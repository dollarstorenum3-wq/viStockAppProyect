import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TarjetaVenta({ venta, onVerDetalle, onEliminar, onEditar }) {
  const fecha = venta.fecha?.toDate?.() || new Date();
  const fechaTxt = fecha.toLocaleDateString('es-ES');

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return { color: '#28a745', backgroundColor: '#d4edda' };
      case 'pendiente':
        return { color: '#ffc107', backgroundColor: '#fff3cd' };
      case 'cancelada':
        return { color: '#dc3545', backgroundColor: '#f8d7da' };
      default:
        return { color: '#6c757d', backgroundColor: '#f8f9fa' };
    }
  };

  const estadoStyle = getEstadoColor(venta.estado);

  return (
    <View style={styles.tarjeta}>
      <View style={styles.header}>
        <Text style={styles.id}>#{venta.id.slice(0, 8).toUpperCase()}</Text>
        <Text style={[styles.estado, { color: estadoStyle.color, backgroundColor: estadoStyle.backgroundColor }]}>
          {venta.estado}
        </Text>
      </View>
      
      <Text style={styles.fecha}>{fechaTxt}</Text>
      <Text style={styles.cliente}>Cliente: {venta.nombre_cliente || 'N/A'}</Text>
      <Text style={styles.total}>Total: ${parseFloat(venta.total || 0).toFixed(2)}</Text>
      <Text style={styles.productos}>{venta.detalles?.length || 0} productos</Text>

      <View style={styles.acciones}>
        <TouchableOpacity style={styles.boton} onPress={onVerDetalle}>
          <FontAwesome name="eye" size={18} color="#007AFF" />
          <Text style={[styles.textoBoton, { color: '#007AFF' }]}>Ver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.boton} onPress={onEditar}>
          <FontAwesome name="edit" size={18} color="#FF9500" />
          <Text style={[styles.textoBoton, { color: '#FF9500' }]}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.boton} onPress={onEliminar}>
          <FontAwesome name="trash" size={18} color="#FF3B30" />
          <Text style={[styles.textoBoton, { color: '#FF3B30' }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 4,
  },
  id: { 
    fontWeight: 'bold', 
    fontSize: 16,
    color: '#333',
  },
  estado: { 
    fontWeight: '600', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  fecha: { 
    color: '#666', 
    fontSize: 12,
    marginBottom: 2,
  },
  cliente: { 
    color: '#333', 
    fontWeight: '600', 
    fontSize: 14,
    marginBottom: 2,
  },
  total: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#2c5aa0',
    marginBottom: 2,
  },
  productos: { 
    color: '#888', 
    fontSize: 12,
    fontStyle: 'italic',
  },
  acciones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 12, 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  boton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  textoBoton: { 
    fontSize: 12, 
    fontWeight: '500',
  },
});