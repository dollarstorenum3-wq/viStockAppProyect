import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFavoritos } from '../FavoritosContext';

const CardFavorito = ({ producto }) => {
  const { quitarFavorito } = useFavoritos();

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
      <View style={styles.contentContainer}>
        <Image source={producto.imagen} style={styles.imagen} />
        <View style={styles.textContainer}>
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <Text style={styles.precio}>{producto.precio}</Text>
          <View style={styles.estrellasContainer}>
            {renderEstrellas(producto.calificacion)}
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.botonQuitar} onPress={() => quitarFavorito(producto.id)}>
          <FontAwesome name="heart" size={18} color="red" style={styles.corazon} />
          <Text style={styles.textoQuitar}>Quitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonAgregar}>
          <FontAwesome name="shopping-cart" size={16} color="white" style={styles.iconoCarrito} />
          <Text style={styles.textoBoton}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 10, 
    marginVertical: 10, 
    alignItems: 'stretch', 
    elevation: 2,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagen: { 
    width: 80, 
    height: 80, 
    resizeMode: 'cover', 
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: { 
    flex: 1,
    justifyContent: 'center',
  },
  nombre: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333',
  },
  precio: { 
    fontSize: 14, 
    color: 'green', 
    marginTop: 5,
  },
  estrellasContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonQuitar: { 
    backgroundColor: 'white', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 0.3, // Ajusta proporción 
  },
  corazon: { 
    marginRight: 5,
  },
  textoQuitar: { 
    color: 'black', 
    fontSize: 14, 
  },
  botonAgregar: { 
    backgroundColor: 'black', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 5,
    flex: 0.6, 
  },
  iconoCarrito: { marginRight: 5 },
  textoBoton: { 
    color: 'white', 
    fontSize: 12   
  },
});

export default CardFavorito;