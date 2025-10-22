import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import BotonEliminarProveedor from './BotonEliminarProveedor';
import FontAwesome from '@expo/vector-icons/FontAwesome';


function TarjetaProveedor({ proveedor, editarProveedor, eliminarProveedor }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de proveedores</Text>

      <ScrollView>
        {proveedor.map((item) => (
          <View key={item.id} style={styles.tarjeta}>
            <View style={styles.contentRow}>
              <Image source={{ uri: item.foto }} style={styles.imagen} />
              <View style={styles.textContainer}>
                <Text style={styles.tar}>{item.compania}</Text>
                <Text style={styles.tar}>{item.telefono}</Text>
                <Text style={styles.tar}>{item.correo_electronico}</Text>
              </View>
            </View>


            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarProveedor(item)}
              >
                <FontAwesome name="edit" size={30} color="black" />
              </TouchableOpacity>
              <BotonEliminarProveedor
                id={item.id}
                eliminarProveedor={eliminarProveedor}
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


  acciones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  
  },
  botonActualizar: {
    padding: 4,
  },
});

export default TarjetaProveedor;