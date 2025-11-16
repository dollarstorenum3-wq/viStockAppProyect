import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/database/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { usarAutenticacion } from '../src/contexto/AutenticacionContexto';

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState({
    nombre: 'Cargando...',
    email: 'Cargando...',
    inicial: '?',
  });
  const { esInvitado, cerrarSesion } = usarAutenticacion();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const user = auth.currentUser;
        if (!user && !esInvitado) {
          navigation.replace('LoginPantalla');
          return;
        }

        if (esInvitado) {
          setUsuario({ nombre: 'Invitado', email: 'invitado@ejemplo.com', inicial: 'I' });
          return;
        }

        const email = user.email;
        const clientesRef = collection(db, 'clientes');
        const q = query(clientesRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          const nombreCompleto = `${data.nombre || ''} ${data.apellido || ''}`.trim();
          setUsuario({
            nombre: nombreCompleto || 'Sin nombre',
            email: data.email || email,
            inicial: data.nombre?.[0]?.toUpperCase() || email[0].toUpperCase(),
          });
        } else {
          setUsuario({
            nombre: 'Perfil no encontrado',
            email: email,
            inicial: email[0].toUpperCase(),
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        Alert.alert('Error', 'No se pudo cargar el perfil');
      }
    };

    cargarPerfil();
  }, [navigation, esInvitado]);

  const accionPrincipal = () => {
    if (esInvitado) {
      navigation.navigate('RegistroPantalla');
    } else {
      Alert.alert('Cerrar sesión', '¿Estás seguro?', [
        { text: 'Cancelar' },
        { text: 'Sí', onPress: () => { cerrarSesion(); navigation.replace('LoginPantalla'); } }
      ]);
    }
  };

  const verInformacionPersonal = () => {
    if (esInvitado) {
      Alert.alert('Regístrate', 'Debes tener una cuenta para ver tu información.');
    } else {
      navigation.navigate('InformacionPersonal');
    }
  };

  const verHistorialCompras = () => {
    if (esInvitado) {
      Alert.alert('Regístrate', 'Debes tener una cuenta para ver tu historial.');
    } else {
      navigation.navigate('HistorialCompras');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Peril</Text>
      </View>
      <View style={styles.cardUsuario}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{usuario.inicial}</Text>
        </View>
        <View style={styles.infoUsuario}>
          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.modulo} onPress={verInformacionPersonal}>
        <View style={styles.moduloIcono}>
          <FontAwesome name="user" size={20} color="#666" />
        </View>
        <View style={styles.moduloTexto}>
          <Text style={styles.moduloTitulo}>Información Personal</Text>
          <Text style={styles.moduloSubtitulo}>
            {esInvitado ? 'Regístrate para ver' : 'Actualiza tu información'}
          </Text>
        </View>
        <FontAwesome name="chevron-right" size={18} color="#ccc" />
      </TouchableOpacity>

      {/* NUEVA CARD: Historial de Compras */}
      <TouchableOpacity style={styles.modulo} onPress={verHistorialCompras}>
        <View style={styles.moduloIcono}>
          <FontAwesome name="shopping-bag" size={20} color="#666" />
        </View>
        <View style={styles.moduloTexto}>
          <Text style={styles.moduloTitulo}>Historial de Compras</Text>
          <Text style={styles.moduloSubtitulo}>
            {esInvitado ? 'Regístrate para ver' : 'Revisa tus pedidos anteriores'}
          </Text>
        </View>
        <FontAwesome name="chevron-right" size={18} color="#ccc" />
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.botonCerrar} onPress={accionPrincipal}>
          <FontAwesome 
            name={esInvitado ? "user-plus" : "sign-out"} 
            size={18} 
            color={esInvitado ? "#27ae60" : "#e74c3c"} 
            style={styles.iconoCerrar} 
          />
          <Text style={[styles.textoCerrar, { color: esInvitado ? "#27ae60" : "#e74c3c" }]}>
            {esInvitado ? "Regístrate" : "Cerrar Sesión"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  encabezado: { 
    backgroundColor: '#a5a4bdff', 
    paddingVertical: 15, 
    alignItems: 'center' 
  },
  textoEncabezado: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'black',
    margin: 16,
  },
  cardUsuario: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 15,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d6e4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarTexto: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#4a90e2'
  },
  infoUsuario: { 
    flex: 1 
  },
  nombre: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  email: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 4,     
  },
  modulo: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moduloIcono: { 
    marginRight: 16 
  },
  moduloTexto: { 
    flex: 1 
  },
  moduloTitulo: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  moduloSubtitulo: { 
    fontSize: 13, 
    color: '#888', 
    marginTop: 2 
  },
  footer: { 
    padding: 20, 
    paddingBottom: 30, 
    backgroundColor: '#f8f8f8' 
  },
  botonCerrar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  iconoCerrar: {
    marginRight: 8 
  },
  textoCerrar: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
});