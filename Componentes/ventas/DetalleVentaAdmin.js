import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';

export default function DetalleVentaAdmin({ venta }) {
  // Función segura para renderizar items
  const renderItem = ({ item, index }) => {
    const precio = parseFloat(item.precio_unitario || item.precio_ventas || item.precio || 0);
    const cantidad = parseInt(item.cantidad || 1);
    const subtotal = precio * cantidad;

    return (
      <View style={styles.item}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.nombre || 'Producto sin nombre'}</Text>
          <Text style={styles.cantidad}>Cantidad: {cantidad}</Text>
          <Text style={styles.precio}>${precio.toFixed(2)} c/u</Text>
        </View>
        <Text style={styles.subtotal}>
          ${subtotal.toFixed(2)}
        </Text>
      </View>
    );
  };

  const fecha = venta.fecha?.toDate?.() || new Date();
  
  // Calcular total seguro
  const calcularTotal = () => {
    try {
      if (venta.total !== undefined && venta.total !== null && !isNaN(parseFloat(venta.total))) {
        return parseFloat(venta.total).toFixed(2);
      }
      
      if (venta.detalles && Array.isArray(venta.detalles)) {
        const totalCalculado = venta.detalles.reduce((sum, item) => {
          const precio = parseFloat(item.precio_unitario || item.precio_ventas || item.precio || 0);
          const cantidad = parseInt(item.cantidad || 1);
          const itemSubtotal = precio * cantidad;
          return sum + itemSubtotal;
        }, 0);
        return totalCalculado.toFixed(2);
      }
      
      return '0.00';
    } catch (error) {
      console.error('Error calculando total:', error);
      return '0.00';
    }
  };

  const totalFinal = calcularTotal();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.id}>Venta #{venta.id?.slice(0, 8).toUpperCase() || 'N/A'}</Text>
        <Text style={styles.cliente}>Cliente: {venta.nombre_cliente || 'No asignado'}</Text>
        <Text style={styles.fecha}>
          {fecha.toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </Text>
        <Text style={[styles.estado, 
          venta.estado === 'completada' ? styles.estadoCompletada :
          venta.estado === 'pendiente' ? styles.estadoPendiente :
          styles.estadoCancelada
        ]}>
          Estado: {venta.estado || 'N/A'}
        </Text>
        <Text style={styles.total}>Total: ${totalFinal}</Text>
      </View>

      <View style={styles.productosSection}>
        <Text style={styles.label}>Productos ({venta.detalles?.length || 0}):</Text>
        <FlatList
          data={venta.detalles || []}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          style={styles.lista}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos en esta venta</Text>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  id: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8,
    color: '#333',
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
    marginBottom: 8,
    fontSize: 14,
  },
  estado: { 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    textTransform: 'capitalize',
    alignSelf: 'center',
  },
  estadoCompletada: {
    backgroundColor: '#d4edda',
    color: '#28a745',
  },
  estadoPendiente: {
    backgroundColor: '#fff3cd',
    color: '#ffc107',
  },
  estadoCancelada: {
    backgroundColor: '#f8d7da',
    color: '#dc3545',
  },
  total: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#2c5aa0',
  },
  productosSection: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: { 
    fontWeight: '600', 
    marginBottom: 12, 
    fontSize: 16,
    color: '#333',
  },
  lista: { 
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  info: { 
    flex: 1,
    marginRight: 10,
  },
  nombre: { 
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  cantidad: { 
    color: '#666', 
    fontSize: 12,
    marginBottom: 2,
  },
  precio: { 
    color: '#888', 
    fontSize: 12,
  },
  subtotal: { 
    fontWeight: 'bold', 
    color: 'green',
    fontSize: 14,
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#666', 
    fontStyle: 'italic',
    paddingVertical: 20,
    fontSize: 14,
  },
});