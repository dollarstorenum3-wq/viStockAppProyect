import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormularioAgregarMarca from '../Componentes/marca/FormularioAgregarMarca'
import FormularioActualizarMarca from '../Componentes/marca/FormularioActualizarMarca'
import TarjetaMarca from '../Componentes/marca/TarjetaMarca'
import Buscador from '../Componentes/buscar/Buscador';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../Componentes/database/firebaseconfig';

export default function Marcas() {

  const [marcas, setMarcas]= useState([]);
    const [busqueda, setBusquedad]= useState("");
    const [filtrados, setFiltrados]=useState([]);
  
    const [modalVisible, setModalVisible]=useState(false);
    const [modalEditVisible, setModalEditVisible]=useState(false);
  
    const [nuevaMarca, setNuevoMarca]=useState({
      nombre_marca:"",
    });
  
    const [marcaId, setMarcaId]=useState("");
  
    const [marcaEditado, setMarcaEditado]= useState({
      nombre_marca:"",
    });
  
    const cargarDatos=async()=>{
      try{
        const querySnapshot = await getDocs(collection(db, "marcas"));
        const data = querySnapshot.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }));
        setMarcas(data);
        setFiltrados(data)
      }catch(error){
        console.error("Error al obtener documentos", error);
        Alert.alert("Error", "No se pudieron cargar las Marcas");
      }
    };
  
    useEffect(()=>{
      cargarDatos();
    }, []);
  
    const manejoCambio = (campo, valor)=>{
      setNuevoMarca((prev)=>({
        ...prev,
        [campo]:valor,
      }));
    };
  
  
    const manejoCambioEdit = (campo, valor)=>{
      setMarcaEditado((prev)=>({
        ...prev,
        [campo]:valor,
      }));
    };
  
    const guardarMarca = async ()=>{
      try{
        if(nuevaMarca.nombre_marca) {
            await addDoc (collection(db,"marcas"),{
              nombre_marca: nuevaMarca.nombre_marca
            });
            cargarDatos();
            setNuevoMarca({
              nombre_marca:""
            });
            setModalVisible(false);
            Alert.alert ("Exito", "marca guardado correctamente")
          }else{
            Alert.alert("Error", "Por favor, complete todos los campos");
          }
      }catch (error){
      console.error("Error al registrar el marca", error);
      Alert.alert("Error", "No se pudo guardar el marca");
      }
    };
  
    const actualizarMarca = async()=>{
      try{
        if(marcaEditado.nombre_marca){
            await updateDoc(doc(db, "marcas", marcaId), {
              nombre_marca: marcaEditado.nombre_marca
            });
  
            setMarcaEditado({
              nombre_marca:"",
            });
            setMarcaId("");
            setModalEditVisible(false);
            cargarDatos();
  
            Alert.alert("Exito", "Marca actualizado correctamente");
          }else{
            Alert.alert("Error", "Por favor, complete todos los campos")
          }
      }catch(error){
        console.error("Error al actualizar el marca", error);
        Alert.alert("Error", "No se pudo actualizar el marca");
      }
    };
  
  
    const editarMarca =(marca)=>{
      setMarcaEditado({
        nombre_marca: marca.nombre_marca
      });
      setMarcaId(marca.id);
      setModalEditVisible(true);
    };
  
  
    const eliminarMarca = async(id)=>{
      try{
        await deleteDoc(doc(db, "marcas", id));
        cargarDatos();
        Alert.alert("Exito", "Marca eliminado correctamente")
      }catch(error){
        console.error("Error al eliminar el marca", error)
        Alert.alert("Error", "No se pudo eliminar el Marca");
      }
    };
  
    const buscarMarca =(texto)=>{
      setBusquedad(texto);
      if(texto.trim()=== ""){
        setFiltrados(marcas);
      }else{
        const resultado = marcas.filter((item)=>
        item.nombre_marca && item.nombre_marca.toLowerCase().includes(texto.toLowerCase())
        );
        setFiltrados(resultado);
      }
    }
  return (
    <View style={styles.container}>
      <Buscador
      busqueda={busqueda}
      onSearch={buscarMarca}/>

      <FormularioAgregarMarca
        nuevaMarca={nuevaMarca}
        manejoCambio={manejoCambio}
        guardarMarca={guardarMarca}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <FormularioActualizarMarca
        marcaEditado={marcaEditado}
        manejoCambio={manejoCambioEdit}
        actualizarMarca={actualizarMarca}
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
      />

      <TarjetaMarca
      marcas={filtrados.length >0 || busqueda ? filtrados : marcas}
      editarmarca={editarMarca}
      eliminarMarca={eliminarMarca}
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

const styles = StyleSheet.create({ container: {
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
