import {  Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';


const FormularioActualizarProducto = ({
  productoEditado,
  manejoCambio, 
  actualizarProducto, 
  nombre_categoria,
  nombre_marca,
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
            <Text style={styles.titulomodal}>Actualizar el Producto</Text>

            <Text style={styles.label}>Nombre Producto</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.nombre_producto}
              onChangeText={(texto) => manejoCambio("nombre_producto", texto)}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.descripcion}
              onChangeText={(texto) => manejoCambio("descripcion", texto)}
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={productoEditado.nombre_categoria}
                style={styles.picker}
                onValueChange={(itemValue) => manejoCambio("nombre_categoria", itemValue)}
              >
                <Picker.Item label="Seleccione una categoría" value="" />
                {nombre_categoria && nombre_categoria.map((cate) => (
                  <Picker.Item 
                    key={cate.id} 
                    label={String(cate.nombre_categoria)} 
                    value={String(cate.nombre_categoria)} 
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Marca</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={productoEditado.nombre_marca}
                style={styles.picker}
                onValueChange={(itemValue) => manejoCambio("nombre_marca", itemValue)}
              >
                <Picker.Item label="Seleccione una marca" value="" />
                {nombre_marca && nombre_marca.map((mar) => (
                  <Picker.Item
                    key={mar.id}
                    label={String(mar.nombre_marca)}
                    value={String(mar.nombre_marca)}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Precio</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.precio_unitario}
              onChangeText={(texto) => manejoCambio("precio_unitario", texto)} 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Existencia</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.existencia}
              onChangeText={(texto) => manejoCambio("existencia", texto)} 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Calificación</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.calificacion}
              onChangeText={(texto) => manejoCambio("calificacion", texto)} 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Imagen URL</Text>
            <TextInput
              style={styles.input}
              value={productoEditado.foto}
              placeholder="Ej: https://placekitten.com/200/200"
              onChangeText={(texto) => manejoCambio("foto", texto)}
            />

            {productoEditado.foto ? (
              <Image
                source={{ uri: productoEditado.foto }}
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
              <TouchableOpacity style={styles.saveButton} onPress={actualizarProducto}>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
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

export default FormularioActualizarProducto;