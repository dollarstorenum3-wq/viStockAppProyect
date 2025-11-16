import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/database/firebaseconfig';

export default function DetallePedido({ route, navigation }) {
  const { pedido } = route.params;

  const fecha = pedido.fecha?.toDate?.() || new Date();
  const fechaTxt = fecha.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Función para cancelar pedido
  const cancelarPedido = async () => {
    Alert.alert(
      "Cancelar Pedido",
      "¿Estás seguro de que deseas cancelar este pedido?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              const pedidoRef = doc(db, 'pedidos', pedido.id);
              await updateDoc(pedidoRef, { estado: 'cancelado' });
              Alert.alert('Éxito', 'El pedido ha sido cancelado');
              navigation.goBack(); // Regresa para que onSnapshot refresque
            } catch (error) {
              Alert.alert('Error', 'No se pudo cancelar el pedido');
            }
          }
        }
      ]
    );
  };

  // Normaliza estado para comparar sin importar mayúsculas
  const estadoNormalizado = pedido.estado?.toLowerCase();

  // Determinar color e ícono según estado (insensible a mayúsculas)
  const getEstadoStyle = () => {
    switch (estadoNormalizado) {
      case 'pendiente':
        return { color: '#b8860b', bg: '#fff7cc', icon: 'clock-o' };
      case 'enviado':
        return { color: '#b8860b', bg: '#fff7cc', icon: 'truck' };
      case 'entregado':
        return { color: '#2e8b57', bg: '#e6f7ed', icon: 'check-circle' };
      case 'cancelado':
        return { color: '#c0392b', bg: '#fadbd8', icon: 'ban' };
      default:
        return { color: '#b8860b', bg: '#fff7cc', icon: 'clock-o' };
    }
  };

  const estiloEstado = getEstadoStyle();

  const renderItem = ({ item }) => {
    const precio = parseFloat(item.precio_ventas) || 0;
    const subtotal = precio * item.cantidad;

    return (
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
          <Text style={styles.precioUnitario}>
            ${precio.toFixed(2)} c/u
          </Text>
        </View>
        <Text style={styles.subtotal}>
          ${subtotal.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Detalle del Pedido</Text>
        <Text style={styles.id}>#{pedido.id_venta.slice(0, 8).toUpperCase()}</Text>
      </View>

      <View style={styles.infoGeneral}>
        <View style={styles.fila}>
          <FontAwesome name="calendar" size={16} color="#666" />
          <Text style={styles.texto}> {fechaTxt}</Text>
        </View>

        {/* Fila de Estado + Botón Cancelar */}
        <View style={styles.filaEstado}>
          <View style={[styles.estadoContainer, { backgroundColor: estiloEstado.bg }]}>
            <FontAwesome name={estiloEstado.icon} size={16} color={estiloEstado.color} />
            <Text style={[styles.estadoTexto, { color: estiloEstado.color }]}> {pedido.estado}</Text>
          </View>

          {/* Botón solo si es pendiente (sin importar mayúsculas) */}
          {estadoNormalizado === 'pendiente' && (
            <TouchableOpacity style={styles.botonCancelar} onPress={cancelarPedido}>
              <Text style={styles.textoCancelar}>Cancelar Pedido</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={pedido.detalles}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total:</Text>
        <Text style={styles.totalMonto}>${parseFloat(pedido.total).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8' 
  },
  encabezado: { 
    backgroundColor: '#a5a4bdff', 
    paddingVertical: 20, 
    alignItems: 'center'
  },
  titulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'black', 
    marginTop: 15 
  },
  id: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 5 
  },
  infoGeneral: { 
    backgroundColor: 'white', 
    padding: 15, 
    margin: 10, 
    borderRadius: 10, 
    elevation: 2 
  },
  fila: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 6 
  },
  texto: { 
    marginLeft: 8, 
    color: '#444', 
    fontSize: 15
  },
  filaEstado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  estadoTexto: {
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14
  },
  botonCancelar: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoCancelar: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13
  },
  lista: { 
    paddingHorizontal: 10 
  },
  item: { 
    backgroundColor: 'white', 
    padding: 12, 
    marginVertical: 5, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 1 
  },
  info: { 
    flex: 1 
  },
  nombre: { 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  cantidad: { 
    color: '#666', 
    fontSize: 13, 
    marginTop: 2 
  },
  precioUnitario: { 
    color: '#888', 
    fontSize: 12, 
    marginTop: 2 
  },
  subtotal: { 
    fontWeight: 'bold', 
    color: 'green', 
    fontSize: 15 
  },
  totalContainer: { 
    backgroundColor: 'white', 
    padding: 15,
    margin: 10, 
    borderRadius: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    elevation: 3 
  },
  totalTexto: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  totalMonto: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'green' 
  },
});