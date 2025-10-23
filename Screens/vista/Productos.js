import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import FormularioAgregarProducto from '../Componentes/producto/FormularioAgregarProducto';
import TarjetaProductos from '../Componentes/producto/TarjetaProductos';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../Componentes/database/firebaseconfig';
import Buscador from '../Componentes/buscar/Buscador';
import FormularioActualizarProducto from '../Componentes/producto/FormularioActualizarProducto';

export default function Productos() {
  
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusquedad] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [nombre_categoria, setNombreCategoria] = useState([]); 
  const [nombre_marca, setNombreMarca] = useState([]);

  const [productoEditado, setProductoEditado] = useState({
    nombre_producto: "",
    descripcion: "",
    nombre_categoria: "",
    nombre_marca: "",
    precio_unitario: "",
    existencia: "",
    calificacion: "",
    foto: ""
  });


  const [productoId, setProductoId] = useState("");

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion: "",
    nombre_categoria: "",
    nombre_marca: "",
    precio_unitario: "",
    existencia: "",
    calificacion: "",
    foto: ""
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
      setFiltrados(data); // Inicializar filtrados con todos los productos
    } catch (error) {
      console.error("Error al obtener documentos", error);
      Alert.alert("Error", "No se pudieron cargar los productos");
    }
  };

  const cargarCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categorias"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNombreCategoria(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const cargarMarcas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "marcas"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNombreMarca(data);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    cargarCategorias();
    cargarMarcas();
  }, []);

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejoCambioEdit = (campo, valor) => {
    setProductoEditado(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre_producto && nuevoProducto.descripcion && nuevoProducto.nombre_categoria &&
        nuevoProducto.nombre_marca && nuevoProducto.precio_unitario && nuevoProducto.existencia && nuevoProducto.calificacion && nuevoProducto.foto) {
        await addDoc(collection(db, "productos"), {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion: nuevoProducto.descripcion,
          nombre_categoria: nuevoProducto.nombre_categoria,
          nombre_marca: nuevoProducto.nombre_marca,
          precio_unitario: parseFloat(nuevoProducto.precio_unitario),
          existencia: parseInt(nuevoProducto.existencia),
          calificacion: parseInt(nuevoProducto.calificacion),
          foto: nuevoProducto.foto
        });
        cargarDatos();
        setNuevoProducto({
          nombre_producto: "", descripcion: "", nombre_categoria: "", nombre_marca: "", precio_unitario: "", existencia: "",
          calificacion: "", foto: ""
        });
        setModalVisible(false);
        Alert.alert("Éxito", "Producto guardado correctamente");
      } else {
        Alert.alert("Error", "Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al registrar el producto", error);
      Alert.alert("Error", "No se pudo guardar el producto");
    }
  };

  const actualizarProducto = async () => {
    try {
      if (productoEditado.nombre_producto && productoEditado.descripcion && productoEditado.nombre_categoria &&
        productoEditado.nombre_marca && productoEditado.precio_unitario && productoEditado.existencia && productoEditado.calificacion &&
        productoEditado.foto) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre_producto: productoEditado.nombre_producto,
          descripcion: productoEditado.descripcion,
          nombre_categoria: productoEditado.nombre_categoria,
          nombre_marca: productoEditado.nombre_marca,
          precio_unitario: parseFloat(productoEditado.precio_unitario),
          existencia: parseInt(productoEditado.existencia),
          calificacion: parseInt(productoEditado.calificacion),
          foto: productoEditado.foto
        });
        setProductoEditado({
          nombre_producto: "",
          descripcion: "",
          nombre_categoria: "",
          nombre_marca: "",
          precio_unitario: "",
          existencia: "",
          calificacion: "",
          foto: ""
        });
        setProductoId("");
        setModalEditVisible(false);
        cargarDatos();
        Alert.alert("Éxito", "Producto actualizado correctamente");
      } else {
        Alert.alert("Error", "Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar el producto", error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  const editarProducto = (producto) => {
    setProductoEditado({
      nombre_producto: producto.nombre_producto,
      descripcion: producto.descripcion,
      nombre_categoria: producto.nombre_categoria,
      nombre_marca: producto.nombre_marca,
      precio_unitario: producto.precio_unitario.toString(),
      existencia: producto.existencia.toString(),
      calificacion: producto.calificacion.toString(),
      foto: producto.foto
    });
    setProductoId(producto.id);
    setModoEdicion(true);
    setModalEditVisible(true);
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
      Alert.alert("Éxito", "Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto", error);
      Alert.alert("Error", "No se pudo eliminar el producto");
    }
  };

  const buscarProductos = (texto) => {
    setBusquedad(texto);
    if (texto.trim() === "") {
      setFiltrados(productos);
    } else {
      const resultado = productos.filter((item) =>
        item.nombre_producto && item.nombre_producto.toLowerCase().includes(texto.toLowerCase())
      );
      setFiltrados(resultado);
    }
  };

  return (
    <View style={styles.container}>
      

      <Buscador
        busqueda={busqueda}
        onSearch={buscarProductos}
        placeholder="Buscar productos..."
      />

      <FormularioAgregarProducto
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        visible={modalVisible}
        setVisible={setModalVisible}
        nombre_categoria={nombre_categoria}
        nombre_marca={nombre_marca}
      />

      <FormularioActualizarProducto
        productoEditado={productoEditado}
        actualizarProducto={actualizarProducto}
        manejoCambio={manejoCambioEdit}
        visible={modalEditVisible}
        setEditVisible={setModalEditVisible}
        nombre_categoria={nombre_categoria}
        nombre_marca={nombre_marca}
      />

      <TarjetaProductos
        productos={filtrados.length > 0 || busqueda ? filtrados : productos}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
        
      />

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBotonFlotante}>+</Text>
      </TouchableOpacity>
    </View>
  );
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
});