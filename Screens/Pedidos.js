import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '.././src/database/firebaseconfig';
import { FontAwesome } from '@expo/vector-icons';
import { usarAutenticacion } from '../src/contexto/AutenticacionContexto';

export default function Pedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { esInvitado } = usarAutenticacion();

  useEffect(() => {
    if (esInvitado) {
      setPedidos([]);
      setCargando(false);
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'pedidos'),
      where('id_cliente', '==', uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        lista.push({
          id: doc.id,
          id_venta: data.id_venta,
          ...data,
        });
      });
      setPedidos(lista);
      setCargando(false);
    });

    return () => unsubscribe();
  }, [esInvitado]);

  const renderPedido = ({ item }) => {
    const fecha = item.fecha?.toDate?.() || new Date();
    const fechaTxt = fecha.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DetallePedido', { pedido: item })}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pedido #{item.id_venta.slice(0, 6).toUpperCase()}</Text>
          <View style={styles.status}>
            <FontAwesome name="clock-o" size={14} color="#7a6d25" />
            <Text style={styles.statusText}> {item.estado}</Text>
          </View>
        </View>
        <Text style={styles.date}>{fechaTxt}</Text>
        <View style={styles.footer}>
          <Text style={styles.products}>
            {item.detalles.length} producto{item.detalles.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.total}>${parseFloat(item.total).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Mis Pedidos</Text>
        <Text style={styles.contadorItems}>({pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''})</Text>
      </View>
      <View style={styles.lineaNegra} />

      {cargando ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : esInvitado ? (
        <View style={styles.pedidosVacio}>
          <Text style={styles.textoPedidosVacio}>Regístrate para ver tus pedidos</Text>
        </View>
      ) : pedidos.length === 0 ? (
        <View style={styles.pedidosVacio}>
          <Text style={styles.textoPedidosVacio}>No tienes pedidos aún</Text>
          <Text style={styles.subtextoPedidosVacio}>¡Haz tu primera compra!</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={item => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.lista}
        />
      )}
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
    paddingVertical: 15, 
    alignItems: 'center' 
  },
  textoEncabezado: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'black', 
    marginTop: 15 
  },
  contadorItems: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 4 
  },
  lineaNegra: { 
    height: 1, 
    backgroundColor: 'black', 
    marginVertical: 5, 
    marginTop: 10 
  },
  lista: { 
    paddingBottom: 10, 
    marginTop: 18 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginHorizontal: 10, 
    marginBottom: 10, 
    elevation: 2 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 

  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 16 

  },
  status: { 
    backgroundColor: '#f7eeb0', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 12 

  },
  statusText: { 
    color: '#7a6d25', 
    fontWeight: '600', 
    fontSize: 12 

  },
  date: { 
    color: 'gray', 
    marginTop: 5

  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 10, 
    borderTopWidth: 1, 
    borderColor: '#ddd', 
    paddingTop: 8 
  },
  products: { 
    color: '#555' 
  },
  total: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  pedidosVacio: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  textoPedidosVacio: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtextoPedidosVacio: { 
    fontSize: 14, 
    color: '#888', 
    textAlign: 'center' 

  },
  cargando: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' },
});