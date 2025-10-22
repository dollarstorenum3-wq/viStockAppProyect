import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import BotonEliminarCategoria from './BotonEliminarCategoria';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TarjetaCategoria({categorias, editarCategoria, eliminarCategoria}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}></Text>

      <ScrollView>
        {categorias.map((item)=>(
          <View key={item.id} style={styles.tarjeta}>
            <View style={styles.textContainer}>
              <Text style={styles.tar}>{item.nombre_categoria}</Text>

              <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarCategoria(item)}
              >
                <FontAwesome name="edit" size={30} color="black" />
              </TouchableOpacity>


              <BotonEliminarCategoria
                id={item.id}
                eliminarCategoria={eliminarCategoria}
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