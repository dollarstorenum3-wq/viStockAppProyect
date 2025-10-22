import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Buscador from '../Componentes/Buscador';
import BotonCarrito from '../Componentes/BotonCarrito';


export default function Perfil( {navigation} ) {
  const [busqueda, setBusqueda] = useState('');
  const cerrarSesion = () => {
    navigation.replace('Login');
  };
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Encuentra Lo Que Buscas</Text>
      </View>
      <Buscador value={busqueda} onChangeText={setBusqueda} />
      <View style={styles.lineaNegra} />
      <View style={styles.headerContainer}>
        <BotonCarrito />
      </View>
      <Text style={styles.texto}>Perfil</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
  texto: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20 
  },
  lineaNegra: { 
    height: 1, 
    backgroundColor: 'black', 
    marginVertical: 5 
  },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 5 
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  button: {
    backgroundColor: '#e74c3c', 
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    width:'60%',
    alignItems: 'center',
    marginTop:15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
