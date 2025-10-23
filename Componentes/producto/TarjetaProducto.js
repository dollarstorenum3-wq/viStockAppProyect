import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import BotonEliminarProducto from './BotonEliminarProducto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';


function TarjetaProductos({ productos, editarProducto, eliminarProducto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de productos</Text>

      <ScrollView>
        {productos.map((item) => (
          <View key={item.id} style={styles.tarjeta}>
            <View style={styles.contentRow}>
              <Image source={{ uri: item.foto }} style={styles.imagen} />
              <View style={styles.textContainer}>
                <Text style={styles.tar}>{item.nombre_producto}</Text>
                <Text style={styles.tar}>{item.descripcion}</Text>
                <Text style={styles.subco}>{item.nombre_categoria || "Sin categoría"}</Text>
                <Text style={styles.subco}>{item.nombre_marca || "Sin marca"}</Text>
                <Text style={styles.subco}>Stock {Number(item.existencia) || 0}</Text>
                <Text style={styles.preci}>${Number(item.precio_unitario) || 0}</Text>
              </View>
            </View>


            <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                <Icon
                  key={index}
                  name="star"
                  size={20}
                  color={index < (Number(item.calificacion) || 0) ? "#FFD700" : "#CCCCCC"}
                />
                ))}
              </View>

            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarProducto(item)}
              >
                <FontAwesome name="edit" size={30} color="black" />
              </TouchableOpacity>
              <BotonEliminarProducto
                id={item.id}
                eliminarProducto={eliminarProducto}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  tar: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subco: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  ratingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 5,
},

  preci: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  
  },
  botonActualizar: {
    padding: 4,
  },
});

export default TarjetaProductos;