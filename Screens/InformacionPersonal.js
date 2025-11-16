// Screens/InformacionPersonal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../src/database/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

export default function InformacionPersonal({ navigation }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigation.replace('Login');
          return;
        }

        const email = user.email;
        console.log('Buscando datos con email:', email);

        const clientesRef = collection(db, 'clientes');
        const q = query(clientesRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setDatos(docSnap.data());
        } else {
          console.warn('No se encontró cliente con email:', email);
          Alert.alert('Sin datos', 'No se encontraron datos para este correo');
          setDatos(null);
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [navigation]);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.textoCargando}>Cargando...</Text>
      </View>
    );
  }

  if (!datos) {
    return (
      <View style={styles.cargando}>
        <Text style={styles.textoCargando}>No se encontraron datos</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>

        
      </View>

      <View style={styles.card}>
        <View style={styles.item}>
          <FontAwesome name="user" size={20} color="#4a90e2" />
          <View style={styles.textoItem}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.valor}>{datos.nombre || '—'}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome name="user" size={20} color="#4a90e2" />
          <View style={styles.textoItem}>
            <Text style={styles.label}>Apellido</Text>
            <Text style={styles.valor}>{datos.apellido || '—'}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome name="envelope" size={20} color="#4a90e2" />
          <View style={styles.textoItem}>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.valor}>{datos.email || '—'}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome name="id-card" size={20} color="#4a90e2" />
          <View style={styles.textoItem}>
            <Text style={styles.label}>Cédula</Text>
            <Text style={styles.valor}>{datos.cedula || '—'}</Text>
          </View>
        </View>

        <View style={styles.item}>
          <FontAwesome name="phone" size={20} color="#4a90e2" />
          <View style={styles.textoItem}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.valor}>{datos.telefono || '—'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  titulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333',
    marginLeft: 10 
  },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 16 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#eee' },
  textoItem: { marginLeft: 16, flex: 1 },
  label: { fontSize: 14, color: '#666' },
  valor: { fontSize: 16, color: '#333', marginTop: 2, fontWeight: '500' },
  cargando: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textoCargando: { marginTop: 16, fontSize: 16, color: '#666' },
});