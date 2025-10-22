import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

const FormularioActualizarCliente=({
  actualizarCliente,
  manejoCambio,
  clienteEditado,
  visible = false,
  setVisible=()=>{}
})=> {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => setVisible=(false)}
    >
      <View style={styles.contenedor}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.modalcontenedor}>
            <Text style={styles.titulomodal}>Actualizar el Cliente</Text>

            <Text style={styles.label}>Nombre del Cliente</Text>
            <TextInput
            style={styles.input}
            value={clienteEditado.nombre}
            onChangeText={(nombre)=>manejoCambio("nombre", nombre)}
            />

            <Text style={styles.label}>Apellido del cliente</Text>
            <TextInput
            style={styles.input}
            value={clienteEditado.apellido}
            onChangeText={(apellido)=>manejoCambio("apellido", apellido)}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
            style={styles.input}
            value={clienteEditado.telefono}
            onChangeText={(telefono)=>manejoCambio("telefono", telefono)}
            />

            <Text style={styles.label}>Cédula</Text>
            <TextInput
            style={styles.input}
            value={clienteEditado.cedula}
            onChangeText={(cedula)=>manejoCambio("cedula", cedula)}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={actualizarCliente}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </View>
      
    </Modal>
  )
}

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
})

export default FormularioActualizarCliente;

