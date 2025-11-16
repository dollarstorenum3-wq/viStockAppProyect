// Screens/vistas/ComprasAdmin.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, Alert, TouchableOpacity } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';
import Buscador from '../../Componentes/buscar/Buscador';
import TarjetaCompra from '../../Componentes/compras/TarjetaCompra';
import DetalleCompraAdmin from '../../Componentes/compras/DetalleCompraAdmin';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ComprasAdmin() {
  const [compras, setCompras] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const navigation = useNavigation();

  const cargarCompras = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'compras'));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompras(lista);
      setFiltradas(lista);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar las compras');
    }
  };

  // useEffect que recarga los datos cuando la pantalla obtiene 'focus'
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarCompras();
    });
    return unsubscribe;
  }, [navigation]);

  const buscar = (texto) => {
    setBusqueda(texto);
    if (!texto.trim()) {
      setFiltradas(compras);
    } else {
      const res = compras.filter(c =>
        c.id.toLowerCase().includes(texto.toLowerCase()) ||
        c.nombre_proveedor?.toLowerCase().includes(texto.toLowerCase()) // Buscamos por nombre
      );
      setFiltradas(res);
    }
  };

  const eliminar = async (id) => {
    Alert.alert(
      'Eliminar Compra',
      '¿Seguro que deseas eliminar esta compra? (El inventario no se revertirá)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // Nota: Esto solo borra la compra, no la subcolección ni revierte el stock.
            await deleteDoc(doc(db, 'compras', id));
            cargarCompras();
          }
        }
      ]
    );
  };

  const verDetalle = (compra) => {
    setCompraSeleccionada(compra);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Buscador busqueda={busqueda} onSearch={buscar} placeholder="Buscar por ID o Proveedor..." />

      <ScrollView>
        {filtradas.length === 0 ? (
          <Text style={styles.vacio}>No hay compras registradas</Text>
        ) : (
          filtradas.map(compra => (
            <TarjetaCompra
              key={compra.id}
              compra={compra}
              onVerDetalle={() => verDetalle(compra)}
              onEliminar={() => eliminar(compra.id)}
              onEditar={() => navigation.navigate('FormularioCompra', { compraId: compra.id })}
            />
          ))
        )}
      </ScrollView>

      {/* Botón flotante (+) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FormularioCompra')}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* MODAL: DETALLE DE LA COMPRA */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitulo}>Detalle de la Compra</Text>
          {compraSeleccionada && <DetalleCompraAdmin compra={compraSeleccionada} />}
          <Text style={styles.cerrar} onPress={() => setModalVisible(false)}>
            Cerrar
          </Text>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  vacio: { textAlign: 'center', color: '#666', marginTop: 20, fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 40 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  cerrar: { textAlign: 'center', color: '#007AFF', marginTop: 20, fontSize: 16, fontWeight: '600' },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
});