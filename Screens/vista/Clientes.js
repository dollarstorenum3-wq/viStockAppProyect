import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormularioAgregarCliente from '../Componentes/cliente/FormularioAgregarCliente'
import FormularioActualizarCliente from '../Componentes/cliente/FormularioActualizarCliente'
import TarjetaClientes from '../Componentes/cliente/TarjetaClientes'
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../Componentes/database/firebaseconfig';
import Buscador from '../Componentes/buscar/Buscador';


export default function Clientes() {

  const [clientes, setClientes]= useState([]);
  const [busqueda, setBusquedad]= useState("");
  const [filtrados, setFiltrados]=useState([]);

  const [modalVisible, setModalVisible]=useState(false);
  const [modalEditVisible, setModalEditVisible]=useState(false);

  const [nuevoCliente, setNuevoCliente]=useState({
    nombre:"",
    apellido:"",
    telefono:"",
    cedula:"",
  });

  const [clienteId, setClienteId]=useState("");

  const [clienteEditado, setClienteEditado]= useState({
    nombre:"",
    apellido:"",
    telefono:"",
    cedula:"",
  });

  const cargarDatos=async()=>{
    try{
      const querySnapshot = await getDocs(collection(db, "clientes"));
      const data = querySnapshot.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
      }));
      setClientes(data);
      setFiltrados(data)
    }catch(error){
      console.error("Error al obtener documentos", error);
      Alert.alert("Error", "No se pudieron cargar los clientes");
    }
  };

  useEffect(()=>{
    cargarDatos();
  }, []);

  const manejoCambio = (campo, valor)=>{
    setNuevoCliente((prev)=>({
      ...prev,
      [campo]:valor,
    }));
  };


  const manejoCambioEdit = (campo, valor)=>{
    setClienteEditado((prev)=>({
      ...prev,
      [campo]:valor,
    }));
  };

  const guardarCliente = async ()=>{
    try{
      if(nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.telefono &&
        nuevoCliente.cedula) {
          await addDoc (collection(db,"clientes"),{
            nombre: nuevoCliente.nombre,
            apellido: nuevoCliente.apellido,
            telefono: nuevoCliente.telefono,
            cedula: nuevoCliente.cedula,
          });
          cargarDatos();
          setNuevoCliente({
            nombre:"",
            apellido:"",
            telefono:"",
            cedula:"",
          });
          setModalVisible(false);
          Alert.alert ("Exito", "cliente guardado correctamente")
        }else{
          Alert.alert("Error", "Por favor, complete todos los campos");
        }
    }catch (error){
    console.error("Error al registrar el producto", error);
    Alert.alert("Error", "No se pudo guardar el producto");
    }
  };

  const actualizarCliente = async()=>{
    try{
      if(clienteEditado.nombre && clienteEditado.apellido &&
        clienteEditado.telefono && clienteEditado.cedula){
          await updateDoc(doc(db, "clientes", clienteId), {
            nombre: clienteEditado.nombre,
            apellido: clienteEditado.apellido,
            telefono: clienteEditado.telefono,
            cedula: clienteEditado.cedula,
          });

          setClienteEditado({
            nombre:"",
            apellido:"",
            telefono:"",
            cedula:"",
          });
          setClienteId("");
          setModalEditVisible(false);
          cargarDatos();

          Alert.alert("Exito", "Cliente actualizado correctamente");
        }else{
          Alert.alert("Error", "Por favor, complete todos los campos")
        }
    }catch(error){
      console.error("Error al actualizar el cliente", error);
      Alert.alert("Error", "No se pudo actualizar el cliente");
    }
  };


  const editarCliente =(cliente)=>{
    setClienteEditado({
      nombre:cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      cedula: cliente.cedula
    });
    setClienteId(cliente.id);
    setModalEditVisible(true);
  };


  const eliminarCliente = async(id)=>{
    try{
      await deleteDoc(doc(db, "clientes", id));
      cargarDatos();
      Alert.alert("Exito", "Clientes eliminado correctamente")
    }catch(error){
      console.error("Error al eliminar el cliente", error)
      Alert.alert("Error", "No se pudo eliminar el cliente");
    }
  };

  const buscarCliente =(texto)=>{
    setBusquedad(texto);
    if(texto.trim()=== ""){
      setFiltrados(clientes);
    }else{
      const resultado = clientes.filter((item)=>
      item.nombre && item.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setFiltrados(resultado);
    }
  }




  return (
    <View style={styles.container}>
        <Buscador
        busqueda={busqueda}
        onSearch={buscarCliente}
        />

        <FormularioAgregarCliente 
          nuevoCliente={nuevoCliente}
          manejoCambio={manejoCambio}
          guardarCliente={guardarCliente}
          visible={modalVisible}
          setVisible={setModalVisible}
        />

        <FormularioActualizarCliente
          clienteEditado={clienteEditado}
          actualizarCliente={actualizarCliente}
          manejoCambio={manejoCambioEdit}
          visible={modalEditVisible}
          setVisible={setModalEditVisible}
        />


        <TarjetaClientes
          clientes={filtrados.length > 0 || busqueda ? filtrados : clientes}
          editarCliente={editarCliente}
          eliminarCliente={eliminarCliente}
        />

        <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => setModalVisible(true)}
        >
        <Text style={styles.textoBotonFlotante}>+</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  botonFlotante: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textoBotonFlotante: {
    color: 'white',
    fontSize: 35,
    lineHeight: 40,
    fontWeight: 'bold',
  },
})