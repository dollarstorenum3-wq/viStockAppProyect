import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react'

export default function BotonEliminarCategoria({ id, eliminarCategoria }) {


  const [visible, setVisible]=useState(false);

  const confirmarEliminar = ()=>{
    setVisible(false);
    eliminarCategoria(id);
  };


  return (
    <View>
      <TouchableOpacity style={styles.boton} onPress={()=>setVisible(true)}>
        <MaterialIcons name="delete-forever" size={30} color="black" />
      </TouchableOpacity>


      <Modal visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={()=>setVisible(false)}>

        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.texto}>¿Desea eliminar este cliente?</Text>


            <View style={styles.fila}>

              <TouchableOpacity style={[styles.botonAccion, styles.cancelar]} onPress={()=>setVisible(false)}>
                <Text style={styles.textoAccion}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.botonAccion, styles.confirmar]} onPress={confirmarEliminar}>
                <Text style={styles.textoAccion}>Eliminar</Text>
            </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  boton:{
    padding:4,
    borderRadius:5,
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"center",
    
  },

  overlay:{
    flex:1,
    backgroundColor:"transparent",
    justifyContent:"center",
    alignItems:"center"
  },

  modal:{
    backgroundColor:"#f3f3f3ff",
    padding:20,
    borderRadius:10,
    width:"80%",
    alignItems:"center"
  },

  texto:{
    fontSize:18,
    marginBottom:20
  },
  fila:{
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%"
  },

  botonAccion:{
    flex:1,
    marginHorizontal:5,
    padding:10,
    borderRadius:5,
    alignItems:"center"
  },

  cancelar:{
    backgroundColor:"#ccc"
  },
  confirmar:{
    backgroundColor:"#e63946"
  },
  textoAccion:{
    color:"white",
    fontWeight:"bold"
  }
})

