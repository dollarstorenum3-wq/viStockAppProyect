import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormularioActualizarCategoria from '../Componentes/categoria/FormularioActualizarCategoria'
import FormularioAgregarCategoria from '../Componentes/categoria/FormularioAgregarCategoria'
import TarjetaCategoria from '../Componentes/categoria/TarjetaCategoria'
import Buscador from '../Componentes/buscar/Buscador';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../Componentes/database/firebaseconfig';

export default function Categ() {

  const [categorias, setCategorias]= useState([]);
    const [busqueda, setBusquedad]= useState("");
    const [filtrados, setFiltrados]=useState([]);
  
    const [modalVisible, setModalVisible]=useState(false);
    const [modalEditVisible, setModalEditVisible]=useState(false);
  
    const [nuevaCategoria, setNuevoCategoria]=useState({
      nombre_categoria:"",
    });
  
    const [categoriaId, setCategoriaId]=useState("");
  
    const [categoriaEditado, setCategoriaEditado]= useState({
      nombre_categoria:"",
    });
  
    const cargarDatos=async()=>{
      try{
        const querySnapshot = await getDocs(collection(db, "categorias"));
        const data = querySnapshot.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }));
        setCategorias(data);
        setFiltrados(data)
      }catch(error){
        console.error("Error al obtener documentos", error);
        Alert.alert("Error", "No se pudieron cargar las Categoria");
      }
    };
  
    useEffect(()=>{
      cargarDatos();
    }, []);
  
    const manejoCambio = (campo, valor)=>{
      setNuevoCategoria((prev)=>({
        ...prev,
        [campo]:valor,
      }));
    };
  
  
    const manejoCambioEdit = (campo, valor)=>{
      setCategoriaEditado((prev)=>({
        ...prev,
        [campo]:valor,
      }));
    };
  
    const guardarCategoria = async ()=>{
      try{
        if(nuevaCategoria.nombre_categoria) {
            await addDoc (collection(db,"categorias"),{
              nombre_categoria: nuevaCategoria.nombre_categoria
            });
            cargarDatos();
            setNuevoCategoria({
              nombre_categoria:""
            });
            setModalVisible(false);
            Alert.alert ("Exito", "categoria guardado correctamente")
          }else{
            Alert.alert("Error", "Por favor, complete todos los campos");
          }
      }catch (error){
      console.error("Error al registrar el categoria", error);
      Alert.alert("Error", "No se pudo guardar el categoria");
      }
    };
  
    const actualizarCategoria = async()=>{
      try{
        if(categoriaEditado.nombre_categoria){
            await updateDoc(doc(db, "categorias", categoriaId), {
              nombre_categoria: categoriaEditado.nombre_categoria
            });
  
            setCategoriaEditado({
              nombre_categoria:"",
            });
            setCategoriaId("");
            setModalEditVisible(false);
            cargarDatos();
  
            Alert.alert("Exito", "Categoria actualizado correctamente");
          }else{
            Alert.alert("Error", "Por favor, complete todos los campos")
          }
      }catch(error){
        console.error("Error al actualizar el categoria", error);
        Alert.alert("Error", "No se pudo actualizar el Categoria");
      }
    };
  
  
    const editarCategoria =(categoria)=>{
      setCategoriaEditado({
        nombre_categoria: categoria.nombre_categoria
      });
      setCategoriaId(categoria.id);
      setModalEditVisible(true);
    };
  
  
    const eliminarCategoria = async(id)=>{
      try{
        await deleteDoc(doc(db, "categorias", id));
        cargarDatos();
        Alert.alert("Exito", "Categoria eliminado correctamente")
      }catch(error){
        console.error("Error al eliminar la categoria", error)
        Alert.alert("Error", "No se pudo eliminar la Categoria");
      }
    };
  
    const buscarCategoria =(texto)=>{
      setBusquedad(texto);
      if(texto.trim()=== ""){
        setFiltrados(categorias);
      }else{
        const resultado = categorias.filter((item)=>
        item.nombre_categoria && item.nombre_categoria.toLowerCase().includes(texto.toLowerCase())
        );
        setFiltrados(resultado);
      }
    }
  return (
    <View style={styles.container}>
      <Buscador
      busqueda={busqueda}
      onSearch={buscarCategoria}/>

      <FormularioAgregarCategoria
        nuevaCategoria={nuevaCategoria}
        manejoCambio={manejoCambio}
        guardarCategoria={guardarCategoria}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <FormularioActualizarCategoria
        categoriaEditado={categoriaEditado}
        manejoCambio={manejoCambioEdit}
        actualizarCategoria={actualizarCategoria}
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
      />

      <TarjetaCategoria
      categorias={filtrados.length >0 || busqueda ? filtrados : categorias}
      editarCategoria={editarCategoria}
      eliminarCategoria={eliminarCategoria}
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