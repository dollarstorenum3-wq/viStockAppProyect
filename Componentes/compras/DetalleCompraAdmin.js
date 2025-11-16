// Componentes/compras/DetalleCompraAdmin.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';

export default function DetalleCompraAdmin({ compra }) {
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Carga los detalles de la subcolección
  useEffect(() => {
    const cargarDetalles = async () => {
      if (!compra?.id) { setCargando(false); return; }
      
      setCargando(true);
      try {
        const rutaDetalles = collection(db, 'compras', compra.id, 'detalles');
        const snapshot = await getDocs(rutaDetalles);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDetalles(lista);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'No se pudieron cargar los detalles de la compra');
      }
      setCargando(false);
    };

    cargarDetalles();
  }, [compra.id]);

  // Componente para mostrar cada item del detalle
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre_producto || 'Producto s/n'}</Text>
        <Text style={styles.cantidad}>Cantidad: {item.cantidad}</Text>
        <Text style={styles.precio}>${parseFloat(item.precio_compra || 0).toFixed(2)} c/u</Text>
      </View>
      <Text style={styles.subtotal}>
        ${parseFloat(item.subtotal || 0).toFixed(2)}
      </Text>
    </View>
  );

  const fecha = compra.fecha?.toDate?.() || new Date();

  return (
    <View style={styles.container}>
      {/* Info General de la Compra */}
      <Text style={styles.id}>Compra #{compra.id.slice(0, 8).toUpperCase()}</Text>
      <Text style={styles.fecha}>
        {fecha.toLocaleDateString('es-ES', {
          day: 'numeric', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })}
      </Text>
      {/* Muestra el nombre del proveedor */}
      <Text style={styles.proveedor}>Proveedor: {compra.nombre_proveedor || compra.id_proveedor}</Text>
      <Text style={styles.total}>Total: ${parseFloat(compra.total || 0).toFixed(2)}</Text>

      <Text style={styles.label}>Productos Comprados:</Text>
      
      {/* Lista de Detalles */}
      {cargando ? (
        <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={detalles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.lista}
          ListEmptyComponent={<Text style={styles.vacio}>No se encontraron productos en esta compra.</Text>}
        />
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { padding: 16 },
  id: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  fecha: { color: '#666', textAlign: 'center', marginBottom: 8 },
  proveedor: { fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 10, fontSize: 16 },
  total: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 5 },
  lista: { maxHeight: 400 },
  vacio: { textAlign: 'center', color: '#888', marginTop: 15},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  info: { flex: 1 },
  nombre: { fontWeight: '600' },
  cantidad: { color: '#666', fontSize: 13 },
  precio: { color: '#888', fontSize: 12 },
  subtotal: { fontWeight: 'bold', color: 'green' },
});