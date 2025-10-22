import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BotonEliminarMarca from './BotonEliminarMarca'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TarjetaMarca({marcas, editarmarca, eliminarMarca}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}></Text>

      <ScrollView>
        {marcas.map((item)=>(
          <View key={item.id} style={styles.tarjeta}>
            <View style={styles.textContainer}>
              <Text style={styles.tar}>{item.nombre_marca}</Text>

              <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarmarca(item)}
              >
                <FontAwesome name="edit" size={30} color="black" />
              </TouchableOpacity>


              <BotonEliminarMarca
                id={item.id}
                eliminarMarca={eliminarMarca}
              />
            </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
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

})