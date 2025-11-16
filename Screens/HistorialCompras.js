// Screens/HistorialCompras.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../src/database/firebaseconfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function HistorialCompras({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const formatearFecha = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Sin fecha';
    const date = timestamp.toDate();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} - ${horas}:${minutos}`;
  };

  const getEstadoStyle = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return { text: 'Entregado', color: '#27ae60', bg: '#d4edda' };
      case 'enviado':
        return { text: 'Enviado', color: '#007bff', bg: '#cce5ff' };
      case 'pendiente':
        return { text: 'Pendiente', color: '#ffc107', bg: '#fff3cd' };
      case 'cancelado':
        return { text: 'Cancelado', color: '#dc3545', bg: '#f8d7da' };
      default:
        return { text: estado || 'Desconocido', color: '#6c757d', bg: '#e2e3e5' };
    }
  };

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.replace('LoginPantalla');
          return;
        }

        const pedidosRef = collection(db, 'pedidos');
        const q = query(
          pedidosRef,
          where('id_cliente', '==', user.uid),
          orderBy('fecha', 'desc')
        );

        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPedidos(lista);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'No se pudo cargar el historial');
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [navigation]);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.textoCargando}>Cargando tus pedidos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Historial de Compras</Text>

      {pedidos.length === 0 ? (
        <View style={{ minHeight: 500, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name="shopping-bag" size={80} color="#ddd" />
          <Text style={styles.textoSin}>Aún no tienes pedidos 😔</Text>
          <Text style={styles.subtexto}>Aquí aparecerán cuando compres algo</Text>
        </View>
      ) : (
        pedidos.map(pedido => {
          const estado = getEstadoStyle(pedido.estado);
          return (
            <View key={pedido.id} style={styles.card}>
              <View style={styles.header}>
                {/* FECHA A LA IZQUIERDA */}
                <Text style={styles.fecha}>{formatearFecha(pedido.fecha)}</Text>

                {/* TOTAL Y ESTADO A LA DERECHA, UNO DEBAJO DEL OTRO */}
                <View style={styles.derechaContainer}>
                  <Text style={styles.total}>Total: ${pedido.total?.toFixed(2) || '0.00'}</Text>
                  <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
                    <Text style={[styles.estadoText, { color: estado.color }]}>
                      {estado.text}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detalles}>
                {pedido.detalles?.map((item, i) => (
                  <Text key={i} style={styles.item}>
                    • {item.cantidad}x {item.nombre}
                    {item.precio > 0 && ` - $${item.precio.toFixed(2)} c/u`}
                  </Text>
                ))}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8'    
  },

  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    margin: 20, 
    color: '#333' 
  },

  card: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginBottom: 16, 
    padding: 18, 
    borderRadius: 16, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.15 
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',  
    marginBottom: 12 
  },

  fecha: { 
    fontSize: 15, 
    color: '#555', 
    fontWeight: '600',
    flex: 1  
  },

  derechaContainer: {
    alignItems: 'flex-end' 
  },

  total: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#27ae60',
    marginBottom: 6
  },

  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-end',  
    minWidth: 80,
    alignItems: 'center'
  },

  estadoText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  detalles: { 
    marginVertical: 10 
  },

  item: { 
    fontSize: 16, 
    color: '#333', 
    marginLeft: 10, 
    marginVertical: 4, 
    fontWeight: '500' 
  },

  textoSin: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#999', 
    marginTop: 20 
  },
  
  subtexto: { 
    fontSize: 15, 
    color: '#aaa', 
    marginTop: 10, 
    textAlign: 'center', 
    paddingHorizontal: 40 
  },
  
  cargando: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  textoCargando: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#666' 
  },
});