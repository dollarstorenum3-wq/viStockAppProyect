import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFavoritos } from '../FavoritosContext';

const CardProducto = ({ producto }) => {
  const { agregarFavorito, favoritos } = useFavoritos();
  const esFavorito = favoritos.some(fav => fav.id === producto.id);

  const renderEstrellas = (calificacion) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < calificacion ? 'star' : 'star-o'}
        size={14}
        color={index < calificacion ? 'gold' : 'gray'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <View style={styles.card}>
      <Image source={producto.imagen} style={styles.imagen} />
      <TouchableOpacity style={styles.corazonContainer} onPress={() => agregarFavorito(producto)}>
        <FontAwesome name="heart" size={20} color={esFavorito ? 'red' : 'gray'} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.categoria}>{producto.categoria}</Text>
        <Text style={styles.precio}>{producto.precio}</Text>
        <View style={styles.estrellasContainer}>
          {renderEstrellas(producto.calificacion)}
        </View>
      </View>
      <TouchableOpacity style={styles.botonAgregar}>
        <FontAwesome name="shopping-cart" size={16} color="white" style={styles.iconoCarrito} />
        <Text style={styles.textoBoton}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 10, 
    margin: 5, 
    width: '47%', 
    alignItems: 'center', 
    elevation: 2 
  },
  imagen: { 
    width: '100%', 
    height: 150, 
    resizeMode: 'cover', 
    borderRadius: 5 
  },
  corazonContainer: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 5 
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  nombre: { 
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center' 
  },
  categoria: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  precio: { 
    fontSize: 14, 
    color: 'green', 
    marginTop: 5,
    marginBottom: 5 
  },
  estrellasContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  botonAgregar: { 
    backgroundColor: 'black', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderRadius: 5, 
    width: '100%', 
    justifyContent: 'center' 
  },
  iconoCarrito: { marginRight: 5 },
  textoBoton: { 
    color: 'white', 
    fontSize: 12   
  },
});

export default CardProducto;