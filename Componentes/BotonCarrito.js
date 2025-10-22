import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const BotonCarrito = () => {
  return (
    <TouchableOpacity style={styles.boton}>
      <FontAwesome name="shopping-cart" size={20} color="black" />
      <Text style={styles.texto}>Carrito</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: { padding: 10 },
  texto: { fontSize: 14, color: 'black' },
});

export default BotonCarrito;