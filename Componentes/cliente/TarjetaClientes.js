import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BotonEliminarCliente from './BotonEliminarCliente';

export default function TarjetaClientes({ clientes, editarCliente, eliminarCliente}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestion de Clientes</Text>

      <ScrollView>
        {clientes.map((item)=>(
          <View key={item.id} style={styles.tarjeta}>
            <View style={styles.textContainer}>
              <Text style={styles.tar}>{item.nombre}</Text>
              <Text style={styles.tar}>{item.apellido}</Text>
              <Text style={styles.tar}>{item.telefono}</Text>
              <Text style={styles.tar}>{item.cedula}</Text>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarCliente(item)}
              >
                <FontAwesome name="edit" size={30} color="black" />
              </TouchableOpacity>


              <BotonEliminarCliente
                id={item.id}
                eliminarCliente={eliminarCliente}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({container: {
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

