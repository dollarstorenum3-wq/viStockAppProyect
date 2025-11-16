// Componentes/compras/TarjetaCompra.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TarjetaCompra({ compra, onVerDetalle, onEliminar, onEditar }) {
  const fecha = compra.fecha?.toDate?.() || new Date();
  const fechaTxt = fecha.toLocaleDateString('es-ES');

  return (
    <View style={styles.tarjeta}>
      <View style={styles.header}>
        <Text style={styles.id}>#{compra.id.slice(0, 8).toUpperCase()}</Text>
        <Text style={styles.estado}>{compra.estado || 'Recibida'}</Text>
      </View>
      <Text style={styles.fecha}>{fechaTxt}</Text>
      
      {/* Muestra el nombre del proveedor */}
      <Text style={styles.proveedor}>Proveedor: {compra.nombre_proveedor || compra.id_proveedor}</Text>
      
      <Text style={styles.total}>Total: ${parseFloat(compra.total || 0).toFixed(2)}</Text>

      <View style={styles.acciones}>
        <TouchableOpacity style={styles.boton} onPress={onVerDetalle}>
          <FontAwesome name="list-alt" size={24} color="#007AFF" />
          <Text style={styles.textoBoton}>Ver Detalles</Text>
        </TouchableOpacity>
        
        <View style={styles.iconosDerecha}>
          <TouchableOpacity style={styles.botonIcono} onPress={onEditar}>
            <FontAwesome name="pencil" size={24} color="#FFA500" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonIcono} onPress={onEliminar}>
            <FontAwesome name="trash" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontWeight: 'bold', fontSize: 16 },
  estado: { color: '#006400', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: '#e6ffe6' },
  fecha: { color: '#666', marginTop: 4 },
  proveedor: { color: '#555', fontSize: 14, marginTop: 4, fontWeight: '600' },
  total: { fontWeight: 'bold', fontSize: 16, marginTop: 6 },
  acciones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 12, 
    alignItems: 'center' 
  },
  boton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  textoBoton: { 
    color: '#007AFF', 
    fontSize: 14 
  },
  iconosDerecha: {
    flexDirection: 'row',
    gap: 16,
  },
  botonIcono: {
    padding: 5,
  },
});