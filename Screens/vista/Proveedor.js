
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import FormularioAgregarProveedor from '../../Componentes/proveedor/FormularioAgregarProveedor';
import TarjetaProveedor from '../../Componentes/proveedor/TarjetaProveedor';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../../src/database/firebaseconfig';
import Buscador from '../../Componentes/buscar/Buscador';
import FormularioActualizarProveedor from '../../Componentes/proveedor/FormulariActualizarProveedor';

export default function Proveedor() {
  
  const [proveedor, setProveedor] = useState([]);
  const [busqueda, setBusquedad] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);


  const [proveedorEditado, setProveedorEditado] = useState({
    compania: "",
    telefono: "",
    correo_electronico: "",
    foto: ""
  });

  
  const [proveedorId, setProveedorId] = useState("");

  const [nuevoProveedor, setNuevoProveedor] = useState({
    compania: "",
    telefono: "",
    correo_electronico: "",
    foto: ""
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "proveedores"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProveedor(data);
      setFiltrados(data); 
    } catch (error) {
      console.error("Error al obtener documentos", error);
      Alert.alert("Error", "No se pudieron cargar los proveedores");
    }
  };

  

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejoCambio = (campo, valor) => {
    setNuevoProveedor((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejoCambioEdit = (campo, valor) => {
    setProveedorEditado(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProveedor = async () => {
    try {
      if (nuevoProveedor.compania && nuevoProveedor.telefono && nuevoProveedor.correo_electronico && nuevoProveedor.foto) {
        await addDoc(collection(db, "proveedores"), {
          compania: nuevoProveedor.compania,
          telefono: nuevoProveedor.telefono,
          correo_electronico: nuevoProveedor.correo_electronico,
          foto: nuevoProveedor.foto
        });
        cargarDatos();
        setNuevoProveedor({
          compania: "", telefono: "", correo_electronico: "", foto: ""
        });
        setModalVisible(false);
        Alert.alert("Éxito", "Proveedor guardado correctamente");
      } else {
        Alert.alert("Error", "Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al registrar el proveedor", error);
      Alert.alert("Error", "No se pudo guardar el proveedor");
    }
  };

  const actualizarProveedor = async () => {
    try {
      if (proveedorEditado.compania && proveedorEditado.telefono && proveedorEditado.correo_electronico &&
        proveedorEditado.foto) {
        await updateDoc(doc(db, "proveedores", proveedorId), {
          compania: proveedorEditado.compania,
          telefono: proveedorEditado.telefono,
          correo_electronico: proveedorEditado.correo_electronico,
          foto: productoEditado.foto
        });
        setProveedorEditado({
          compania: "",
          telefono: "",
          correo_electronico: "",
          foto: ""
        });
        setProveedorId("");
        setModalEditVisible(false);
        cargarDatos();
        Alert.alert("Éxito", "Proveedor actualizado correctamente");
      } else {
        Alert.alert("Error", "Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar el proveedor", error);
      Alert.alert("Error", "No se pudo actualizar el proveedor");
    }
  };

  const editarProveedor = (proveedor) => {
    setProveedorEditado({
      compania: proveedor.compania,
      telefono: proveedor.telefono,
      correo_electronico: proveedor.correo_electronico,
      foto: proveedor.foto
    });
    setProveedorId(proveedor.id);
    setModalEditVisible(true);
  };

  const eliminarProveedor = async (id) => {
    try {
      await deleteDoc(doc(db, "proveedores", id));
      cargarDatos();
      Alert.alert("Éxito", "Proveedor eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el proveedor", error);
      Alert.alert("Error", "No se pudo eliminar el proveedor");
    }
  };

  const buscarProveedor = (texto) => {
    setBusquedad(texto);
    if (texto.trim() === "") {
      setFiltrados(proveedor);
    } else {
      const resultado = proveedor.filter((item) =>
        item.compania && item.compania.toLowerCase().includes(texto.toLowerCase())
      );
      setFiltrados(resultado);
    }
  };

  return (
    <View style={styles.container}>
      

      <Buscador
        busqueda={busqueda}
        onSearch={buscarProveedor}
        placeholder="Buscar productos..."
      />

      <FormularioAgregarProveedor
        nuevoProveedor={nuevoProveedor}
        manejoCambio={manejoCambio}
        guardarProveedor={guardarProveedor}
        visible={modalVisible}
        setVisible={setModalVisible}
      />

      <FormularioActualizarProveedor
        proveedorEditado={proveedorEditado}
        actualizarProveedor={actualizarProveedor}
        manejoCambio={manejoCambioEdit}
        visible={modalEditVisible}
        setEditVisible={setModalEditVisible}
      />

      <TarjetaProveedor
        proveedor={filtrados.length > 0 || busqueda ? filtrados : proveedor}
        editarProveedor={editarProveedor}
        eliminarProveedor={eliminarProveedor}
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