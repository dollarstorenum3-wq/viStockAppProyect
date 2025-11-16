// Screens/vistas/FormularioCompra.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { db } from '../../src/database/firebaseconfig';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

export default function FormularioCompra({ route, navigation }) {
  const { compraId } = route.params || {};
  const modoEdicion = !!compraId;

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  
  const [detalles, setDetalles] = useState([]);
  const [detallesOriginales, setDetallesOriginales] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  useEffect(() => {
    const cargarDatosFormulario = async () => {
      setCargandoDatos(true);
      try {
        const provSnapshot = await getDocs(collection(db, 'proveedores'));
        const listaProveedores = provSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProveedores(listaProveedores);

        const prodSnapshot = await getDocs(collection(db, 'productos'));
        const listaProductos = prodSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProductos(listaProductos);

        if (modoEdicion) {
          const compraRef = doc(db, 'compras', compraId);
          const compraSnap = await getDoc(compraRef);
          if (compraSnap.exists()) {
            const datosCompra = compraSnap.data();
            setProveedorSeleccionado(datosCompra.id_proveedor);

            const detallesRef = collection(db, 'compras', compraId, 'detalles');
            const detallesSnap = await getDocs(detallesRef);
            const listaDetalles = detallesSnap.docs.map(d => ({
              docId: d.id,
              ...d.data(),
              id_producto: d.data().id_producto 
            }));
            setDetalles(listaDetalles);
            setDetallesOriginales(JSON.parse(JSON.stringify(listaDetalles))); // Copia profunda
          }
        }
      } catch (error) {
        console.error("Error cargando datos: ", error);
        Alert.alert('Error', 'No se pudieron cargar los datos necesarios.');
      }
      setCargandoDatos(false);
    };

    cargarDatosFormulario();
  }, [compraId, modoEdicion]);

  const agregarProducto = () => {
    setDetalles([...detalles, { id_producto: null, cantidad: '1', precio_compra: '' }]);
  };

  const actualizarProducto = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    
    // Si estamos cambiando el producto, resetear cantidad y precio
    if (campo === 'id_producto') {
      const productoSeleccionado = productos.find(p => p.id === valor);
      nuevosDetalles[index][campo] = valor;
      nuevosDetalles[index].cantidad = '1';
      
      if (productoSeleccionado) {
        nuevosDetalles[index].precio_compra = productoSeleccionado.precio_unitario.toString();
      } else {
        nuevosDetalles[index].precio_compra = '';
      }
    } else {
      // Para cantidad y precio, actualizar normalmente
      nuevosDetalles[index][campo] = valor;
    }
    
    setDetalles(nuevosDetalles);
  };

  const eliminarProducto = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };

  // Función para calcular las diferencias en el inventario
  const calcularDiferenciasInventario = () => {
    const diferencias = {};

    // Mapear detalles originales por producto para fácil acceso
    const mapaOriginal = {};
    detallesOriginales.forEach(detalle => {
      mapaOriginal[detalle.id_producto] = {
        cantidad: parseFloat(detalle.cantidad) || 0,
        docId: detalle.docId
      };
    });

    // Mapear detalles actuales por producto
    const mapaActual = {};
    detalles.forEach(detalle => {
      if (detalle.id_producto) {
        mapaActual[detalle.id_producto] = parseFloat(detalle.cantidad) || 0;
      }
    });

    // Calcular diferencias para productos que existían originalmente
    Object.keys(mapaOriginal).forEach(productoId => {
      const cantidadOriginal = mapaOriginal[productoId].cantidad;
      const cantidadActual = mapaActual[productoId] || 0;
      const diferencia = cantidadActual - cantidadOriginal;

      if (diferencia !== 0) {
        diferencias[productoId] = diferencia;
      }

      // Eliminar del mapa actual para no procesarlo de nuevo
      delete mapaActual[productoId];
    });

    // Los productos restantes en mapaActual son nuevos
    Object.keys(mapaActual).forEach(productoId => {
      diferencias[productoId] = mapaActual[productoId];
    });

    return diferencias;
  };

  const handleGuardar = async () => {
    if (!proveedorSeleccionado || detalles.length === 0) {
      Alert.alert('Error', 'Debes seleccionar un proveedor y añadir al menos un producto.');
      return;
    }

    // Validar que todos los productos tengan datos completos
    for (const prod of detalles) {
      if (!prod.id_producto || !prod.cantidad || !prod.precio_compra) {
        Alert.alert('Error', 'Todos los productos deben ser seleccionados y tener cantidad y precio.');
        return;
      }
      
      // Validar que la cantidad sea un número válido
      const cantidad = parseFloat(prod.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        Alert.alert('Error', 'La cantidad debe ser un número mayor a 0.');
        return;
      }
    }

    setCargando(true);
    
    const nombreProveedor = proveedores.find(p => p.id === proveedorSeleccionado)?.compania || 'N/A';
    
    const totalCompra = detalles.reduce((sum, item) => {
      const cantidad = parseFloat(item.cantidad || 0);
      const precio = parseFloat(item.precio_compra || 0);
      return sum + (cantidad * precio);
    }, 0);

    const datosCompra = {
      id_proveedor: proveedorSeleccionado,
      nombre_proveedor: nombreProveedor,
      fecha: new Date(),
      total: totalCompra,
    };

    const batch = writeBatch(db);

    try {
      let compraRef;
      
      if (modoEdicion) {
        compraRef = doc(db, 'compras', compraId);
        batch.update(compraRef, datosCompra);

        // Eliminar todos los detalles antiguos
        const detallesAntiguosSnap = await getDocs(collection(db, 'compras', compraId, 'detalles'));
        detallesAntiguosSnap.docs.forEach(d => batch.delete(d.ref));
        
        // ACTUALIZAR INVENTARIO BASADO EN LAS DIFERENCIAS
        const diferenciasInventario = calcularDiferenciasInventario();
        
        console.log('Diferencias de inventario:', diferenciasInventario);
        
        for (const [productoId, diferencia] of Object.entries(diferenciasInventario)) {
          if (diferencia !== 0) {
            const productoRef = doc(db, 'productos', productoId);
            batch.update(productoRef, {
              existencia: increment(diferencia)
            });
            console.log(`Producto ${productoId}: ${diferencia > 0 ? '+' : ''}${diferencia}`);
          }
        }
        
      } else {
        // Para compras nuevas
        compraRef = doc(collection(db, 'compras'));
        batch.set(compraRef, datosCompra);

        // Incrementar inventario para todos los productos
        for (const producto of detalles) {
          const cantidadNum = parseFloat(producto.cantidad);
          const productoRef = doc(db, 'productos', producto.id_producto);
          batch.update(productoRef, {
            existencia: increment(cantidadNum)
          });
        }
      }

      // Agregar los nuevos detalles de compra
      for (const producto of detalles) {
        const cantidadNum = parseFloat(producto.cantidad);
        const precioNum = parseFloat(producto.precio_compra);
        const nombreProducto = productos.find(p => p.id === producto.id_producto)?.nombre_producto || 'N/A';

        const detalleRef = doc(collection(db, 'compras', compraRef.id, 'detalles'));
        batch.set(detalleRef, {
          id_producto: producto.id_producto,
          nombre_producto: nombreProducto,
          cantidad: cantidadNum,
          precio_compra: precioNum,
          subtotal: cantidadNum * precioNum
        });
      }

      await batch.commit();
      
      Alert.alert('Éxito', `Compra ${modoEdicion ? 'actualizada' : 'guardada'} correctamente. El inventario ha sido actualizado.`);
      navigation.goBack();

    } catch (error) {
      console.error("Error al guardar la compra: ", error);
      Alert.alert('Error', 'No se pudo guardar la compra ni actualizar el inventario.');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{modoEdicion ? 'Editar Compra' : 'Registrar Compra'}</Text>

      <Text style={styles.label}>Proveedor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={proveedorSeleccionado}
          onValueChange={(itemValue) => setProveedorSeleccionado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Seleccione un Proveedor --" value={null} />
          {proveedores.map(prov => (
            <Picker.Item key={prov.id} label={prov.compania} value={prov.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.headerProductos}>
        <Text style={styles.label}>Productos</Text>
        <TouchableOpacity onPress={agregarProducto} style={styles.botonAgregar}>
          <Text style={styles.textoBotonAgregar}>+ Añadir Producto</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={detalles}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemProducto}>
            
            <View style={[styles.pickerItemContainer, { flex: 3 }]}>
              <Picker
                selectedValue={item.id_producto}
                onValueChange={(itemValue) => actualizarProducto(index, 'id_producto', itemValue)}
                style={styles.pickerItem}
              >
                <Picker.Item label="- Producto -" value={null} style={{fontSize: 12}} />
                {productos.map(prod => (
                  <Picker.Item 
                    key={prod.id} 
                    label={`${prod.nombre_producto} (Stock: ${prod.existencia || 0})`} 
                    value={prod.id} 
                    style={{fontSize: 12}} 
                  />
                ))}
              </Picker>
            </View>

            {/* CAMPO DE CANTIDAD - AHORA EDITABLE */}
            <TextInput
              style={[styles.inputProducto, { flex: 1 }]}
              placeholder="Cant"
              value={item.cantidad ? item.cantidad.toString() : ''}
              onChangeText={(txt) => actualizarProducto(index, 'cantidad', txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              editable={true}
            />

            <TextInput
              style={[
                styles.inputProducto, 
                { flex: 1.5 },
                item.id_producto ? styles.inputDeshabilitado : {}
              ]}
              placeholder="Precio"
              value={item.precio_compra ? item.precio_compra.toString() : ''}
              onChangeText={(txt) => actualizarProducto(index, 'precio_compra', txt)}
              keyboardType="numeric"
              editable={false}
            />

            <TouchableOpacity onPress={() => eliminarProducto(index)}>
              <FontAwesome name="trash" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar} disabled={cargando}>
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotonGuardar}>
            {modoEdicion ? 'Actualizar Compra' : 'Guardar Compra'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 5, color: '#333' },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerItemContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
    },
    pickerItem: {
        height: 50,
        width: '100%',
    },
    headerProductos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    botonAgregar: { backgroundColor: '#E8E8E8', padding: 8, borderRadius: 5 },
    textoBotonAgregar: { color: '#007AFF', fontWeight: 'bold' },
    itemProducto: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
    },
    inputProducto: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        textAlign: 'center',
        height: 50,
        backgroundColor: '#fff',
    },
    inputDeshabilitado: {
      backgroundColor: '#f0f0f0',
      color: '#888',
    },
    botonGuardar: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    textoBotonGuardar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});