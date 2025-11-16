import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCarrito } from '../../CarritoContext';

const RegistroCarrito = ({ item }) => {
  const { actualizarCantidad, quitarDelCarrito } = useCarrito();

  const aumentarCantidad = () => {
    actualizarCantidad(item.id, item.cantidad + 1);
  };

  const disminuirCantidad = () => {
    actualizarCantidad(item.id, item.cantidad - 1);
  };

  const subtotal = parseFloat(item.precio) * item.cantidad;

  return (
    <View style={styles.container}>
      <Image source={item.imagen} style={styles.imagen} />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.precioUnitario}>${parseFloat(item.precio).toFixed(2)} c/u</Text>
        <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
        
        <View style={styles.controlesContainer}>
          <View style={styles.controlesCantidad}>
            <TouchableOpacity style={styles.botonCantidad} onPress={disminuirCantidad}>
              <FontAwesome name="minus" size={14} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.cantidad}>{item.cantidad}</Text>
            
            <TouchableOpacity style={styles.botonCantidad} onPress={aumentarCantidad}>
              <FontAwesome name="plus" size={14} color="white" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.botonEliminar} 
            onPress={() => quitarDelCarrito(item.id)}
          >
            <FontAwesome name="trash" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 2,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  precioUnitario: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  controlesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlesCantidad: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonCantidad: {
    backgroundColor: '#a5a4bdff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cantidad: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonEliminar: {
    backgroundColor: '#e74c3c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistroCarrito;