import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import CardFavorito from '../Componentes/CardFavorito';
import Buscador from '../Componentes/Buscador';
import { useFavoritos } from '../FavoritosContext';

export default function Favoritos() {
  const { favoritos } = useFavoritos();
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false); 

  const favoritosFiltrados = favoritos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Encuentra Lo Que Buscas</Text>
      </View>
      <Buscador value={busqueda} onChangeText={setBusqueda} />
      <View style={styles.lineaNegra} />
      <Text style={styles.titulo}>Mis Favoritos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="black" style={{ marginTop: 20 }} />
      ) : favoritosFiltrados.length > 0 ? (
        <FlatList
          data={favoritosFiltrados}
          renderItem={({ item }) => <CardFavorito producto={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.lista}
        />
      ) : (
        <View style={styles.noFavoritos}>
          <Text style={styles.textoNoFavoritos}>No hay productos en tus favoritos.</Text>
        </View>
      )}
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
  titulo: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    margin: 5, 
    color: 'black' 
  },
  lista: { 
    paddingHorizontal: 10 
  },
  lineaNegra: { 
    height: 1, 
    backgroundColor: 'black', 
    marginVertical: 5 
  },
  noFavoritos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoNoFavoritos: {
    fontSize: 16,
    color: 'gray',
  },
});