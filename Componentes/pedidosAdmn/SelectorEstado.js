// Componentes/pedidosAdmn/DetallePedidoAdmin.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';
import SelectorEstado from './SelectorEstado';

export default function DetallePedidoAdmin({ pedido }) {
  const [estado, setEstado] = useState(pedido.estado?.toLowerCase() || 'pendiente');

  const cambiarEstado = async (nuevo) => {
    if (nuevo === estado) return;
    const nuevoEstado = nuevo.toLowerCase(); // Siempre guarda en minúsculas
    try {
      await updateDoc(doc(db, 'pedidos', pedido.id), { estado: nuevoEstado });
      await updateDoc(doc(db, 'ventas', pedido.id_venta), { estado: nuevoEstado });
      setEstado(nuevoEstado);
      Alert.alert('Éxito', 'Estado actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const calcularSubtotal = (item) => {
    try {
      const precio = parseFloat(item.precio_ventas || 0);
      const cantidad = parseInt(item.cantidad || 1);
      if (isNaN(precio) || isNaN(cantidad)) return '0.00';
      return (precio * cantidad).toFixed(2);
    } catch (error) {
      return '0.00';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.nombre}>{item.nombre || 'Producto'}</Text>
      <Text style={styles.cantidad}>x{item.cantidad || 1}</Text>
      <Text style={styles.subtotal}>${calcularSubtotal(item)}</Text>
    </View>
  );

  const calcularTotal = () => {
    try {
      if (pedido.total !== undefined && pedido.total !== null && !isNaN(parseFloat(pedido.total))) {
        return parseFloat(pedido.total).toFixed(2);
      }
      if (pedido.detalles && Array.isArray(pedido.detalles) && pedido.detalles.length > 0) {
        const totalCalculado = pedido.detalles.reduce((sum, item) => {
          const subtotal = parseFloat(calcularSubtotal(item));
          return sum + (isNaN(subtotal) ? 0 : subtotal);
        }, 0);
        return totalCalculado.toFixed(2);
      }
      return '0.00';
    } catch (error) {
      return '0.00';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.id}>#{pedido.id_venta?.slice(0, 8).toUpperCase() || 'N/A'}</Text>
      <Text style={styles.cliente}>Cliente: {pedido.nombre_cliente || 'N/A'}</Text>
      <Text style={styles.fecha}>
        {pedido.fecha?.toDate?.().toLocaleString('es-ES') || 
        pedido.fecha?.toLocaleString?.('es-ES') || 
        'Sin fecha'}
      </Text>

      <SelectorEstado estado={estado} onChange={cambiarEstado} />

      <Text style={styles.label}>Productos:</Text>
      <FlatList
        data={pedido.detalles || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos</Text>}
      />

      <View style={styles.total}>
        <Text style={styles.totalTexto}>Total:</Text>
        <Text style={styles.totalMonto}>${calcularTotal()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: 'white', 
    flex: 1 

  },
  id: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#333' 

  },
  cliente: { 
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 8, 
    color: '#333' 

  },
  fecha: { 
    color: '#666', 
    textAlign: 'center', 
    marginVertical: 10, 
    fontSize: 14 

  },
  label: { 
    fontWeight: '600', 
    marginTop: 15, 
    marginBottom: 5, 
    fontSize: 16, 
    color: '#333' 

  },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    alignItems: 'center' 

  },
  nombre: { 
    flex: 1, 
    fontSize: 16, 
    color: '#333' 
  },
  cantidad: { 
    width: 50, 
    textAlign: 'center', 
    fontSize: 16, 
    color: '#666' 
  },
  subtotal: { 
    width: 80, 
    textAlign: 'right', 
    fontWeight: '600', 
    fontSize: 16, 
    color: '#333' 
  },
  total: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20, 
    paddingTop: 15, 
    borderTopWidth: 2, 
    borderColor: '#ddd' 
  },
  totalTexto: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333'     
  },
  totalMonto: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: 'green'     
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#666', 
    fontStyle: 'italic', 
    marginVertical: 20, 
    fontSize: 16     
  },
});