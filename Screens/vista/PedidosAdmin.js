// Screens/vistas/PedidosAdmin.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, doc, getDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';
import Buscador from '../../Componentes/buscar/Buscador';
import TarjetaPedidoAdmin from '../../Componentes/pedidosAdmn/TarjetaPedidoAdmin';
import DetallePedidoAdmin from '../../Componentes/pedidosAdmn/DetallePedidoAdmin';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Ionicons } from '@expo/vector-icons';

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todo");

  const obtenerNombreCliente = async (idCliente) => {
    try {
      if (!idCliente) return 'Cliente no encontrado';
      const clienteDoc = await getDoc(doc(db, 'clientes', idCliente));
      if (clienteDoc.exists()) {
        const data = clienteDoc.data();
        return `${data.nombre || ''} ${data.apellido || ''}`.trim() || 'Cliente sin nombre';
      }
      const userDoc = await getDoc(doc(db, 'usuarios', idCliente));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.nombre || data.email || 'Cliente sin nombre';
      }
      return 'Cliente no encontrado';
    } catch (error) {
      console.error('Error obteniendo cliente:', error);
      return 'Error al cargar';
    }
  };

  useEffect(() => {
    let unsubscribe;

    const cargarPedidosEnTiempoReal = (estadoFiltro = "todo") => {
      let q;
      if (estadoFiltro === "todo") {
        q = collection(db, "pedidos");
      } else {
        q = query(collection(db, "pedidos"), where("estado", "==", estadoFiltro));
      }

      unsubscribe = onSnapshot(q, async (snapshot) => {
        const pedidosConNombres = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const nombreCliente = await obtenerNombreCliente(data.id_cliente);
            return { id: docSnap.id, ...data, nombre_cliente: nombreCliente };
          })
        );

        setPedidos(pedidosConNombres);
        setFiltrados(pedidosConNombres);
      }, (error) => {
        console.error("Error en onSnapshot:", error);
        Alert.alert("Error", "No se pudieron cargar los pedidos");
      });
    };

    cargarPedidosEnTiempoReal(filtroEstado);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [filtroEstado]);

  const cambiarFiltro = (estado) => {
    setFiltroEstado(estado);
  };

  const buscar = (texto) => {
    setBusqueda(texto);
    if (!texto.trim()) {
      setFiltrados(pedidos);
    } else {
      const res = pedidos.filter(p =>
        p.id_venta?.toLowerCase().includes(texto.toLowerCase()) ||
        p.nombre_cliente?.toLowerCase().includes(texto.toLowerCase()) ||
        p.detalles?.some(d => d.nombre?.toLowerCase().includes(texto.toLowerCase()))
      );
      setFiltrados(res);
    }
  };

  const verDetalle = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalVisible(true);
  };

  const eliminarPedido = async (pedidoId) => {
    Alert.alert(
      'Eliminar Pedido',
      '¿Estás seguro de que deseas eliminar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'pedidos', pedidoId));
              Alert.alert('Éxito', 'Pedido eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el pedido');
            }
          }
        }
      ]
    );
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const generarExcel = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pedidos"));
      const pedidos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (pedidos.length === 0) throw new Error("No hay pedidos.");
      const response = await fetch("https://6xn9qs9hz1.execute-api.us-east-2.amazonaws.com/generarExcelPedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: pedidos })
      });
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      const fileUri = FileSystem.documentDirectory + "reporte_Pedidos.xlsx";
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Buscador busqueda={busqueda} onSearch={buscar} placeholder="Buscar por ID, cliente o producto..." />

      <View style={styles.marcoCategorias}>
        <View style={styles.categoriasRow}>
          <TouchableOpacity
            style={[styles.todoItem, filtroEstado === 'todo' && styles.todoItemSelected]}
            onPress={() => cambiarFiltro('todo')}
          >
            <Text style={[styles.textoTodo, filtroEstado === 'todo' && styles.textoTodoSelected]}>Todo</Text>
          </TouchableOpacity>

          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriasContent}
            >
              {[
                { label: "Pendiente", value: "pendiente" },
                { label: "Enviado", value: "enviado" },
                { label: "Entregado", value: "entregado" },
                { label: "Cancelado", value: "cancelado" }
              ].map((item) => {
                const seleccionado = filtroEstado === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.categoriaItem, seleccionado && styles.categoriaSeleccionada]}
                    onPress={() => cambiarFiltro(item.value)}
                  >
                    <Text style={[styles.textoCategoria, seleccionado && styles.textoCategoriaSeleccionada]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>

      <View style={styles.contenedorBotonExcel}>
        <TouchableOpacity style={styles.botonExcel} onPress={generarExcel}>
          <Ionicons name="document-text" size={20} color="white" />
          <Text style={styles.textoBoton}>Exportar a Excel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {filtrados.length === 0 ? (
          <Text style={styles.vacio}>No hay pedidos</Text>
        ) : (
          filtrados.map(pedido => (
            <TarjetaPedidoAdmin
              key={pedido.id}
              pedido={pedido}
              onPress={() => verDetalle(pedido)}
              onEliminar={eliminarPedido}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitulo}>Detalle del Pedido</Text>
          {pedidoSeleccionado && (
            <DetallePedidoAdmin pedido={pedidoSeleccionado} />
          )}
          <Text style={styles.cerrar} onPress={() => setModalVisible(false)}>
            Cerrar
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 

  },
  vacio: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 20 

  },
  marcoCategorias: { 
    backgroundColor: "#F0F0F0", 
    padding: 10, 
    borderRadius: 22, 
    marginVertical: 10 

  },
  categoriasRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 

  },
  todoItem: { 
    backgroundColor: '#e0e0e0', 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginRight: 10, 
    minWidth: 100, 
    alignItems: 'center', 
    justifyContent: 'center' 

  },
  todoItemSelected: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#ccc' 
  },
  
  textoTodo: { 
    fontSize: 15, 
    color: 'black', 
    fontWeight: '600' 
  },
  
  textoTodoSelected: { 
    fontWeight: '700' 
  },

  scrollWrapper: { 
    flex: 1 
  },

  categoriasContent: { 
    alignItems: "center", 
    paddingHorizontal: 6 
  },
  
  categoriaItem: { 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    marginRight: 12, 
    backgroundColor: "#e0e0e0", 
    borderRadius: 22, 
    minWidth: 110, 
    alignItems: "center", 
    justifyContent: "center" 
  },

  categoriaSeleccionada: { 
    backgroundColor: "white", 
    borderWidth: 1, 
    borderColor: "#ccc" 
  },

  textoCategoria: { 

    fontSize: 15, 
    color: "black" 
  },

  textoCategoriaSeleccionada: { 
    fontWeight: "600" 
  },

  contenedorBotonExcel: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 15 
  },

  botonExcel: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#27ae60', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 8 
  },

  textoBoton: { 
    color: 'white', 
    marginLeft: 8, 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  modal: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    paddingTop: 40 
  },

  modalTitulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  cerrar: { 
    textAlign: 'center', 
    color: '#007AFF', 
    marginTop: 20, 
    fontSize: 16  
  },
});