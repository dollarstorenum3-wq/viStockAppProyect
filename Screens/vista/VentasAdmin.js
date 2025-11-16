import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';
import Buscador from '../../Componentes/buscar/Buscador';
import TarjetaVenta from '../../Componentes/ventas/TarjetaVenta';
import DetalleVentaAdmin from '../../Componentes/ventas/DetalleVentaAdmin';
import EditarVentaModal from '../../Componentes/ventas/EditarVentaModal';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing"
import { Ionicons } from '@expo/vector-icons';

export default function VentasAdmin() {
  const [ventas, setVentas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventaAEditar, setVentaAEditar] = useState(null);

  // Función para obtener nombre del cliente
  const obtenerNombreCliente = async (idCliente) => {
    try {
      if (!idCliente) return 'Cliente no encontrado';
      
      const clienteDoc = await getDoc(doc(db, 'clientes', idCliente));
      if (clienteDoc.exists()) {
        const clienteData = clienteDoc.data();
        return `${clienteData.nombre || ''} ${clienteData.apellido || ''}`.trim() || 'Cliente sin nombre';
      }
      
      const userDoc = await getDoc(doc(db, 'usuarios', idCliente));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.nombre || userData.email || 'Cliente sin nombre';
      }
      
      return 'Cliente no encontrado';
    } catch (error) {
      console.error('Error obteniendo nombre del cliente:', error);
      return 'Error al cargar';
    }
  };

  const cargarVentas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'ventas'));
      const ventasConNombres = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const ventaData = doc.data();
          const nombreCliente = await obtenerNombreCliente(ventaData.id_cliente);
          
          return {
            id: doc.id,
            ...ventaData,
            detalles: ventaData.detalles || [],
            nombre_cliente: nombreCliente
          };
        })
      );
      
      setVentas(ventasConNombres);
      setFiltradas(ventasConNombres);
    } catch (error) {
      console.error('Error cargando ventas:', error);
      Alert.alert('Error', 'No se pudieron cargar las ventas');
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const buscar = (texto) => {
    setBusqueda(texto);
    if (!texto.trim()) {
      setFiltradas(ventas);
    } else {
      const res = ventas.filter(v =>
        v.id.toLowerCase().includes(texto.toLowerCase()) ||
        v.nombre_cliente?.toLowerCase().includes(texto.toLowerCase()) ||
        v.detalles?.some(d => d.nombre?.toLowerCase().includes(texto.toLowerCase()))
      );
      setFiltradas(res);
    }
  };

  const eliminar = async (id) => {
    Alert.alert(
      'Eliminar Venta',
      '¿Seguro que deseas eliminar esta venta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'ventas', id));
            cargarVentas();
          }
        }
      ]
    );
  };

  const verDetalle = (venta) => {
    setVentaSeleccionada(venta);
    setModalVisible(true);
  };

  const editarVenta = (venta) => {
    setVentaAEditar(venta);
    setModalEditarVisible(true);
  };

  const cerrarModalEditar = () => {
    setModalEditarVisible(false);
    setVentaAEditar(null);
  };

  const guardarCambiosVenta = () => {
    cargarVentas();
    cerrarModalEditar();
    Alert.alert('Éxito', 'Venta actualizada correctamente');
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const generarExcel = async () => {
    try {
      const ventas = await cargarVentasFirebase();
      if (ventas.length === 0) {
        throw new Error("No hay datos en la colección 'ventas'.");
      }

      console.log("Ventas para Excel:", ventas);
      const response = await fetch("https://6xn9qs9hz1.execute-api.us-east-2.amazonaws.com/generarExcelVentas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: ventas })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);

      const fileUri = FileSystem.documentDirectory + "reporte_Ventas.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Descargar Reporte de Ventas"
        });
      } else {
        alert("Compartir no disponible.");
      }

      alert("Excel de ventas generado y listo para descargar!");
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
    }
  };

  const cargarVentasFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ventas"));
      const ventas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return ventas;
    } catch (error) {
      console.error("Error extrayendo ventas:", error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Ventas</Text>
      <Buscador busqueda={busqueda} onSearch={buscar} placeholder="Buscar por ID, cliente o producto..." />
      
      <View style={styles.contenedorBotonExcel}>
        <TouchableOpacity style={styles.botonExcel} onPress={generarExcel}>
          <Ionicons name="document-text" size={20} color="white" />
          <Text style={styles.textoBoton}>Exportar a Excel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listaVentas}>
        {filtradas.length === 0 ? (
          <Text style={styles.vacio}>No hay ventas registradas</Text>
        ) : (
          filtradas.map(venta => (
            <TarjetaVenta
              key={venta.id}
              venta={venta}
              onVerDetalle={() => verDetalle(venta)}
              onEliminar={() => eliminar(venta.id)}
              onEditar={() => editarVenta(venta)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal para ver detalle */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Detalle de la Venta</Text>
            <TouchableOpacity 
              style={styles.botonCerrarModal} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {ventaSeleccionada && <DetalleVentaAdmin venta={ventaSeleccionada} />}
          <TouchableOpacity 
            style={styles.botonCerrar} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textoCerrar}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para editar venta */}
      <EditarVentaModal
        visible={modalEditarVisible}
        venta={ventaAEditar}
        onClose={cerrarModalEditar}
        onGuardar={guardarCambiosVenta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 
  },
  titulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  listaVentas: {
    flex: 1,
  },
  vacio: { 
    textAlign: 'center', 
    color: '#666', 
    marginTop: 20, 
    fontSize: 16 
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#f8f8f8', 
    paddingTop: 40 
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  modalTitulo: { 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  botonCerrarModal: {
    padding: 4,
  },
  botonCerrar: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    margin: 16,
    alignItems: 'center',
  },
  textoCerrar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contenedorBotonExcel: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    marginTop: 5,
  },
  botonExcel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoBoton: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});