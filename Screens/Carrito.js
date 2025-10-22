import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CardFavorito from '../Componentes/CardFavorito';
import Buscador from '../Componentes/Buscador';
import BotonCarrito from '../Componentes/BotonCarrito';
import { useFavoritos } from '../FavoritosContext';

export default function Carrito() {
  const { favoritos } = useFavoritos();
  const [busqueda, setBusqueda] = useState('');

  const carritoFiltrado = favoritos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Carrito</Text>
      </View>
      <Buscador value={busqueda} onChangeText={setBusqueda} />
      <View style={styles.lineaNegra} />
      <View style={styles.headerContainer}>
        <BotonCarrito />
      </View>
      <Text style={styles.titulo}>Productos en Carrito</Text>
      <FlatList
        data={carritoFiltrado}
        renderItem={({ item }) => <CardFavorito producto={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
      />
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
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginBottom: 5 
  },
});
