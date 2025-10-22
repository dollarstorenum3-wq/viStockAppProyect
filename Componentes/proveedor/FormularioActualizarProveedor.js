import {  Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';


const FormularioActualizarProveedor = ({
  proveedorEditado,
  manejoCambio, 
  actualizarProveedor, 
  visible = false,
  setEditVisible = () => {}, 
}) => {
  return (
    <Modal 
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => setEditVisible(false)}
    >
      <View style={styles.contenedor}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.modalcontenedor}>
            <Text style={styles.titulomodal}>Actualizar el Proveedor</Text>

            <Text style={styles.label}>Compañia</Text>
            <TextInput
              style={styles.input}
              value={proveedorEditado.compania}
              onChangeText={(compania) => manejoCambio("compania", compania)}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={proveedorEditado.telefono}
              onChangeText={(telefono) => manejoCambio("telefono", telefono)}
            />


            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={proveedorEditado.correo_electronico}
              onChangeText={(correo_electronico) => manejoCambio("correo_electronico", correo_electronico)} 
            />

            <Text style={styles.label}>Imagen URL</Text>
            <TextInput
              style={styles.input}
              value={proveedorEditado.foto}
              placeholder="Ej: https://placekitten.com/200/200"
              onChangeText={(texto) => manejoCambio("foto", texto)}
            />

            {proveedorEditado.foto ? (
              <Image
                source={{ uri: proveedorEditado.foto }}
                style={styles.preview}
                resizeMode="contain"
                onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
              />
            ) : (
              <Text style={styles.mensajePreview}>La imagen se mostrará aquí</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={actualizarProveedor}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalcontenedor: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  titulomodal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#00CC00',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
   scroll:{
    width:"100%",
    height:"100%",
    marginTop:20
    
  },
  scrollContent: {
  justifyContent: 'center',
  alignItems: 'center',   

},

preview: {
  width: '80%',
  height: 100,
  borderRadius: 10,
  marginBottom: 15,
  backgroundColor: '#e8e8ff',
},
mensajePreview: {
  fontStyle: 'italic',
  color: '#666',
  textAlign: 'center',
  marginBottom: 15,
},
})

export default FormularioActualizarProveedor;