import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import FormularioAgregarProducto from '../../Componentes/producto/FormularioAgregarProducto';
import TarjetaProductos from '../../Componentes/producto/TarjetaProductos';
import { collection, doc, deleteDoc, getDocs, addDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../../src/database/firebaseconfig';
import Buscador from '../../Componentes/buscar/Buscador';
import FormularioActualizarProducto from '../../Componentes/producto/FormularioActualizarProducto';
import * as Print from 'expo-print';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing"
import * as Clipboard from "expo-clipboard";
import { Ionicons } from '@expo/vector-icons';

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

  // MÉTODO PDF ORIGINAL (PARA TODOS LOS PRODUCTOS)
  const generarPDF = async () => {
    try {
      const productosLista = filtrados.length > 0 || busqueda ? filtrados : productos;
      
      if (productosLista.length === 0) {
        Alert.alert('Info', 'No hay productos para exportar');
        return;
      }

      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { background-color: #1c2933; color: white; padding: 20px; text-align: center; }
              h1 { color: white; margin: 0; }
              .producto { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
              .total { margin-top: 20px; text-align: center; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Lista de Productos</h1>
            </div>
            ${productosLista.map(p => `
              <div class="producto">
                <strong>${p.nombre_producto}</strong><br>
                Precio: $${parseFloat(p.precio_unitario).toFixed(2)}<br>
                Stock: ${p.existencia}<br>
                Marca: ${p.nombre_marca || 'N/A'}<br>
                Categoría: ${p.nombre_categoria || 'N/A'}<br>
                ${p.descripcion ? `Descripción: ${p.descripcion}<br>` : ''}
                ${p.calificacion ? `Calificación: ${'★'.repeat(p.calificacion)}` : ''}
              </div>
            `).join('')}
            <div class="total">
              Total de productos: ${productosLista.length}
            </div>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      
    } catch (error) {
      console.log('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar PDF');
    }
  };

  // NUEVO MÉTODO PDF INDIVIDUAL
  const generarPDFIndividual = async (producto) => {
    try {
      if (!producto) {
        Alert.alert('Error', 'Producto no válido');
        return;
      }

      const html = `
        <html>
          <head>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                max-width: 800px;
                margin: 0 auto;
              }
              .header { 
                background-color: #1c2933; 
                color: white; 
                padding: 20px; 
                text-align: center; 
                border-radius: 8px 8px 0 0;
              }
              h1 { 
                color: white; 
                margin: 0; 
                font-size: 24px;
              }
              .producto-container {
                border: 2px solid #1c2933;
                border-radius: 10px;
                margin: 20px 0;
                overflow: hidden;
              }
              .producto-info {
                padding: 20px;
                background-color: #f8f9fa;
              }
              .producto-imagen {
                width: 100%;
                max-height: 400px;
                object-fit: contain;
                background-color: white;
                padding: 10px;
              }
              .campo {
                margin: 8px 0;
                display: flex;
              }
              .campo-label {
                font-weight: bold;
                min-width: 120px;
                color: #1c2933;
              }
              .campo-valor {
                flex: 1;
              }
              .calificacion {
                color: #ffc107;
                font-size: 18px;
              }
              .precio {
                font-size: 20px;
                font-weight: bold;
                color: #27ae60;
                text-align: center;
                margin: 15px 0;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 0 0 8px 8px;
                border-top: 1px solid #ddd;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Reporte Individual de Producto</h1>
            </div>
            
            <div class="producto-container">
              ${producto.foto ? `
                <div style="text-align: center; background-color: white; padding: 15px;">
                  <img src="${producto.foto}" alt="${producto.nombre_producto}" class="producto-imagen" 
                      onerror="this.style.display='none'"/>
                </div>
              ` : ''}
              
              <div class="producto-info">
                <div class="campo">
                  <span class="campo-label">Producto:</span>
                  <span class="campo-valor">${producto.nombre_producto}</span>
                </div>
                
                <div class="campo">
                  <span class="campo-label">Descripción:</span>
                  <span class="campo-valor">${producto.descripcion || 'No disponible'}</span>
                </div>
                
                <div class="campo">
                  <span class="campo-label">Categoría:</span>
                  <span class="campo-valor">${producto.nombre_categoria || 'Sin categoría'}</span>
                </div>
                
                <div class="campo">
                  <span class="campo-label">Marca:</span>
                  <span class="campo-valor">${producto.nombre_marca || 'Sin marca'}</span>
                </div>
                
                <div class="campo">
                  <span class="campo-label">Stock:</span>
                  <span class="campo-valor">${producto.existencia} unidades</span>
                </div>
                
                ${producto.calificacion ? `
                  <div class="campo">
                    <span class="campo-label">Calificación:</span>
                    <span class="campo-valor calificacion">${'★'.repeat(producto.calificacion)}${'☆'.repeat(5-producto.calificacion)}</span>
                  </div>
                ` : ''}
                
                <div class="precio">
                  Precio: $${parseFloat(producto.precio_unitario).toFixed(2)}
                </div>
              </div>
              
              <div class="footer">
                Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}
              </div>
            </div>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Reporte - ${producto.nombre_producto}`
      });
      
    } catch (error) {
      console.log('Error al generar PDF individual:', error);
      Alert.alert('Error', 'No se pudo generar el PDF del producto');
    }
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const categoriasMap = {}; 
      const marcasMap = {}; 

      const categoriasSnapshot = await getDocs(collection(db, "categorias"));
      categoriasSnapshot.docs.forEach(doc => {
        categoriasMap[doc.id] = doc.data().nombre_categoria;
      });

      const marcasSnapshot = await getDocs(collection(db, "marcas"));
      marcasSnapshot.docs.forEach(doc => {
        marcasMap[doc.id] = doc.data().nombre_marca;
      });

      const data = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (data.id_categoria) {
            try {
              const categoriaRef = doc(db, "categorias", data.id_categoria);
              const categoriaSnap = await getDoc(categoriaRef);
              data.nombre_categoria = categoriaSnap.exists() ? categoriaSnap.data().nombre_categoria : "Sin categoría";
            } catch (error) {
              console.error("Error al cargar categoría para ID:", data.id_categoria, error);
              data.nombre_categoria = "Sin categoría";
            }
          } else {
            data.nombre_categoria = "Sin categoría";
          }
          if (data.id_marca) {
            try {
              const marcaRef = doc(db, "marcas", data.id_marca);
              const marcaSnap = await getDoc(marcaRef);
              data.nombre_marca = marcaSnap.exists() ? marcaSnap.data().nombre_marca : "Sin marca";
            } catch (error) {
              console.error("Error al cargar marca para ID:", data.id_marca, error);
              data.nombre_marca = "Sin marca";
            }
          } else {
            data.nombre_marca = "Sin marca";
          }
          return data;
        })
      );
      console.log("Productos cargados:", data);
      setProductos(data);
      setFiltrados(data);
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
      console.log("Categorías cargadas:", data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setNombreCategoria([]);
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
      console.log("Marcas cargadas:", data);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
      setNombreMarca([]);
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
    setProductoEditado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre_producto && nuevoProducto.descripcion && nuevoProducto.nombre_categoria &&
        nuevoProducto.nombre_marca && nuevoProducto.precio_unitario && nuevoProducto.existencia && nuevoProducto.calificacion && nuevoProducto.foto) {
        const categoria = nombre_categoria.find(cat => cat.nombre_categoria === nuevoProducto.nombre_categoria);
        const marca = nombre_marca.find(mar => mar.nombre_marca === nuevoProducto.nombre_marca);
        await addDoc(collection(db, "productos"), {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion: nuevoProducto.descripcion,
          id_categoria: categoria ? categoria.id : null,
          id_marca: marca ? marca.id : null,
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
        const categoria = nombre_categoria.find(cat => cat.nombre_categoria === productoEditado.nombre_categoria);
        const marca = nombre_marca.find(mar => mar.nombre_marca === productoEditado.nombre_marca);
        await updateDoc(doc(db, "productos", productoId), {
          nombre_producto: productoEditado.nombre_producto,
          descripcion: productoEditado.descripcion,
          id_categoria: categoria ? categoria.id : null,
          id_marca: marca ? marca.id : null,
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

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const generarExcel = async () => {
    try {
      const productos = await cargarProductoFirebase();
      if (productos.length === 0) {
        throw new Error("No hay datos en la colección 'productos'.");
      }

      console.log("Productos para Excel:", productos);
      const response = await fetch("https://6xn9qs9hz1.execute-api.us-east-2.amazonaws.com/generarExcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: productos })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);

      const fileUri = FileSystem.documentDirectory + "reporte_productos.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Descargar Reporte de Productos"
        });
      } else {
        alert("Compartir no disponible.");
      }

      alert("Excel de productos generado y listo para descargar!");
    } catch (error) {
      console.error("Error generando Excel:", error);
      alert("Error: " + error.message);
    }
  };

  const cargarProductoFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "productos"));
      const productos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productos;
    } catch (error) {
      console.error("Error extrayendo ciudades:", error);
      return [];
    }
  };

  return (
    <View style={styles.container}>
      <Buscador
        busqueda={busqueda}
        onSearch={buscarProductos}
        placeholder="Buscar productos..."
      />

      {/* Botones de exportar */}
      <View style={styles.botonesExportar}>
        <TouchableOpacity style={styles.botonPDF} onPress={generarPDF}>
          <Ionicons name="document" size={20} color="white" />
          <Text style={styles.textoBoton}>PDF General</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botonExcel} onPress={generarExcel}>
          <Ionicons name="document-text" size={20} color="white" />
          <Text style={styles.textoBoton}>Excel</Text>
        </TouchableOpacity>
      </View>

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

      {/* Pasamos la función generarPDFIndividual al componente TarjetaProductos */}
      <TarjetaProductos
        productos={filtrados.length > 0 || busqueda ? filtrados : productos}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
        generarPDFIndividual={generarPDFIndividual} // Nueva prop
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
  botonesExportar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  botonPDF: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  botonExcel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  textoBoton: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
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