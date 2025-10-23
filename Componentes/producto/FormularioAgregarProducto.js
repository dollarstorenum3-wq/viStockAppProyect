import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';

const FormularioAgregarProducto = ({
  nuevoProducto,
  manejoCambio,
  guardarProducto,
  nombre_categoria,
  nombre_marca,
  visible = false,
  setVisible = () => {},
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.contenedor}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.modalcontenedor}>
            <Text style={styles.titulomodal}>Agregar nuevo Producto</Text>

            <Text style={styles.label}>Nombre Producto</Text>
            <TextInput
              style={styles.input}
              value={nuevoProducto.nombre_producto}
              onChangeText={(texto) => manejoCambio("nombre_producto", texto)}
            />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={nuevoProducto.descripcion}
              onChangeText={(texto) => manejoCambio("descripcion", texto)}
            />

            <Text style={styles.label}>Categoría</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={nuevoProducto.nombre_categoria}
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
                selectedValue={nuevoProducto.nombre_marca}
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
              value={nuevoProducto.precio_unitario}
              onChangeText={(texto) => manejoCambio("precio_unitario", texto)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Existencia</Text>
            <TextInput
              style={styles.input}
              value={nuevoProducto.existencia}
              onChangeText={(texto) => manejoCambio("existencia", texto)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Calificación</Text>
            <TextInput
              style={styles.input}
              value={nuevoProducto.calificacion}
              onChangeText={(texto) => manejoCambio("calificacion", texto)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Imagen URL</Text>
            <TextInput
              style={styles.input}
              value={nuevoProducto.foto}
              placeholder="Ej: https://placekitten.com/200/200"
              onChangeText={(texto) => manejoCambio("foto", texto)}
            />

            {nuevoProducto.foto ? (
              <Image
                source={{ uri: nuevoProducto.foto }}
                style={styles.preview}
                resizeMode="contain"
                onError={() => Alert.alert('Error', 'No se pudo cargar la imagen')}
              />
            ) : (
              <Text style={styles.mensajePreview}>La imagen se mostrará aquí</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={guardarProducto}>
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
  scroll: {
    width: '100%',
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalcontenedor: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  titulomodal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
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
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#00CC00',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#f0f0f0',
  },
  mensajePreview: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
  },
});

export default FormularioAgregarProducto;