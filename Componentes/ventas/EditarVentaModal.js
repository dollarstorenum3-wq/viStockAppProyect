  import React, { useState, useEffect } from 'react';
  import { 
    View, 
    Text, 
    Modal, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    Alert,
    ActivityIndicator
  } from 'react-native';
  import { doc, updateDoc, collection, getDocs, getDoc } from 'firebase/firestore';
  import { db } from '../../src/database/firebaseconfig';
  import { Picker } from '@react-native-picker/picker';
  import FontAwesome from '@expo/vector-icons/FontAwesome';

  export default function EditarVentaModal({ visible, venta, onClose, onGuardar }) {
    const [ventaEditada, setVentaEditada] = useState(null);
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [cargandoPrecios, setCargandoPrecios] = useState(false);

    useEffect(() => {
      if (venta) {
        console.log('📦 Venta recibida para editar:', venta);
        console.log('💰 Detalles de productos:', venta.detalles);
        
        cargarPreciosReales(venta);
      }
      cargarClientes();
    }, [venta]);

    // Función para cargar los precios reales desde Firebase (similar a tu función en productos)
    const cargarPreciosReales = async (ventaOriginal) => {
      try {
        setCargandoPrecios(true);
        
        const detallesConPreciosReales = await Promise.all(
          ventaOriginal.detalles?.map(async (item) => {
            const cantidad = parseInt(item.cantidad) || 1;
            
            // Obtener el precio real del producto desde Firebase (igual que en tu código)
            let precioReal = parseFloat(item.precio_unitario) || 0;
            
            if (item.id_producto) {
              try {
                const productoDoc = await getDoc(doc(db, "productos", item.id_producto));
                if (productoDoc.exists()) {
                  const productoData = productoDoc.data();
                  precioReal = parseFloat(productoData.precio_unitario) || 0;
                  console.log(`✅ Precio real obtenido para ${item.nombre}: $${precioReal}`);
                }
              } catch (error) {
                console.warn(`⚠️ No se pudo obtener precio real para ${item.nombre}:`, error);
                // Si hay error, mantener el precio existente
                precioReal = parseFloat(item.precio_unitario) || 0;
              }
            }
            
            const subtotal = cantidad * precioReal;
            
            return {
              ...item,
              cantidad: cantidad.toString(),
              precio_unitario: precioReal.toString(),
              precio_original: precioReal,
              subtotal: subtotal
            };
          }) || []
        );

        setVentaEditada({ 
          ...ventaOriginal,
          estado: ventaOriginal.estado || 'pendiente',
          id_cliente: ventaOriginal.id_cliente || '',
          detalles: detallesConPreciosReales
        });
        
      } catch (error) {
        console.error('❌ Error cargando precios reales:', error);
        // En caso de error, usar los precios existentes
        const detallesRespaldo = ventaOriginal.detalles?.map(item => {
          const cantidad = parseInt(item.cantidad) || 1;
          const precioUnitario = parseFloat(item.precio_unitario || item.precio || 0);
          const subtotal = cantidad * precioUnitario;
          
          return {
            ...item,
            cantidad: cantidad.toString(),
            precio_unitario: precioUnitario.toString(),
            precio_original: precioUnitario,
            subtotal: subtotal
          };
        }) || [];

        setVentaEditada({ 
          ...ventaOriginal,
          estado: ventaOriginal.estado || 'pendiente',
          id_cliente: ventaOriginal.id_cliente || '',
          detalles: detallesRespaldo
        });
      } finally {
        setCargandoPrecios(false);
      }
    };

    const cargarClientes = async () => {
      try {
        const clientesSnapshot = await getDocs(collection(db, 'clientes'));
        const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
        
        const listaClientes = [];
        
        clientesSnapshot.forEach(doc => {
          listaClientes.push({
            id: doc.id,
            nombre: `${doc.data().nombre || ''} ${doc.data().apellido || ''}`.trim() || 'Cliente sin nombre',
            tipo: 'cliente'
          });
        });
        
        usuariosSnapshot.forEach(doc => {
          const userData = doc.data();
          if (!listaClientes.some(c => c.id === doc.id)) {
            listaClientes.push({
              id: doc.id,
              nombre: userData.nombre || userData.email || 'Usuario sin nombre',
              tipo: 'usuario'
            });
          }
        });
        
        setClientes(listaClientes);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };

    const actualizarCampo = (campo, valor) => {
      setVentaEditada(prev => ({
        ...prev,
        [campo]: valor
      }));
    };

    const actualizarCantidadProducto = async (index, nuevaCantidad) => {
      if (!ventaEditada?.detalles) return;
      
      const nuevosDetalles = [...ventaEditada.detalles];
      const producto = nuevosDetalles[index];
      
      // Validar y convertir la cantidad (mínimo 1)
      const cantidad = Math.max(1, parseInt(nuevaCantidad) || 1);
      
      // Usar el precio real del producto (no modificable)
      const precioUnitario = parseFloat(producto.precio_unitario) || 0;
      
      // Calcular nuevo subtotal
      const subtotal = cantidad * precioUnitario;
      
      nuevosDetalles[index] = {
        ...producto,
        cantidad: cantidad.toString(),
        subtotal: subtotal
      };
      
      console.log(`🔄 Cantidad actualizada producto ${index}:`, {
        nombre: producto.nombre,
        cantidad,
        precioUnitario,
        subtotal
      });
      
      setVentaEditada(prev => ({
        ...prev,
        detalles: nuevosDetalles
      }));
    };

    // Función para actualizar el precio desde Firebase (por si cambió)
    const actualizarPrecioDesdeFirebase = async (index) => {
      if (!ventaEditada?.detalles) return;
      
      const producto = ventaEditada.detalles[index];
      if (!producto.id_producto) {
        Alert.alert('Info', 'Este producto no tiene ID asociado, no se puede actualizar el precio');
        return;
      }
      
      try {
        const precioActual = parseFloat(producto.precio_unitario) || 0;
        
        // Obtener precio actual desde Firebase (igual que en tu código de productos)
        const productoDoc = await getDoc(doc(db, "productos", producto.id_producto));
        if (productoDoc.exists()) {
          const productoData = productoDoc.data();
          const precioReal = parseFloat(productoData.precio_unitario) || 0;
          
          if (precioReal > 0 && precioReal !== precioActual) {
            console.log(`🔄 Actualizando precio para ${producto.nombre}: $${precioActual} → $${precioReal}`);
            
            const nuevosDetalles = [...ventaEditada.detalles];
            const cantidad = parseInt(producto.cantidad) || 1;
            const nuevoSubtotal = cantidad * precioReal;
            
            nuevosDetalles[index] = {
              ...producto,
              precio_unitario: precioReal.toString(),
              precio_original: precioReal,
              subtotal: nuevoSubtotal
            };
            
            setVentaEditada(prev => ({
              ...prev,
              detalles: nuevosDetalles
            }));
            
            Alert.alert(
              'Precio Actualizado',
              `El precio de "${producto.nombre}" se actualizó a $${precioReal.toFixed(2)}`
            );
          } else {
            Alert.alert('Info', `El precio de "${producto.nombre}" ya está actualizado: $${precioActual.toFixed(2)}`);
          }
        } else {
          Alert.alert('Error', 'No se encontró el producto en el inventario');
        }
      } catch (error) {
        console.error('Error actualizando precio desde Firebase:', error);
        Alert.alert('Error', 'No se pudo actualizar el precio del producto');
      }
    };

    const eliminarProducto = (index) => {
      Alert.alert(
        'Eliminar Producto',
        '¿Estás seguro de que quieres eliminar este producto de la venta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              const nuevosDetalles = ventaEditada.detalles.filter((_, i) => i !== index);
              setVentaEditada(prev => ({
                ...prev,
                detalles: nuevosDetalles
              }));
            }
          }
        ]
      );
    };

    const calcularTotal = () => {
      if (!ventaEditada?.detalles) return 0;
      
      const total = ventaEditada.detalles.reduce((sum, item) => {
        const subtotal = parseFloat(item.subtotal) || 0;
        return sum + subtotal;
      }, 0);
      
      console.log('🧮 Total calculado:', total);
      return total;
    };

    const validarDatos = () => {
      if (!ventaEditada.id_cliente) {
        Alert.alert('Error', 'Selecciona un cliente');
        return false;
      }
      
      if (!ventaEditada.detalles || ventaEditada.detalles.length === 0) {
        Alert.alert('Error', 'La venta debe tener al menos un producto');
        return false;
      }
      
      // Validar que todas las cantidades sean válidas
      const cantidadesInvalidas = ventaEditada.detalles.filter(item => {
        const cantidad = parseInt(item.cantidad) || 0;
        return cantidad <= 0;
      });
      
      if (cantidadesInvalidas.length > 0) {
        Alert.alert('Error', 'Todas las cantidades deben ser mayores a 0');
        return false;
      }
      
      return true;
    };

    const guardarCambios = async () => {
      if (!ventaEditada) return;
      
      try {
        setCargando(true);
        
        // Validaciones
        if (!validarDatos()) {
          setCargando(false);
          return;
        }
        
        // Calcular total final
        const total = calcularTotal();
        
        // Preparar datos para guardar
        const datosActualizados = {
          id_cliente: ventaEditada.id_cliente || '',
          estado: ventaEditada.estado || 'pendiente',
          total: total,
          detalles: ventaEditada.detalles.map(item => {
            const cantidad = parseInt(item.cantidad) || 1;
            const precioUnitario = parseFloat(item.precio_unitario) || 0;
            const subtotal = cantidad * precioUnitario;
            
            return {
              id_producto: item.id_producto || '',
              nombre: item.nombre || 'Producto sin nombre',
              cantidad: cantidad,
              precio_unitario: precioUnitario, // Precio real desde Firebase
              subtotal: subtotal
            };
          })
        };
        
        console.log('💾 Datos a guardar en Firebase:', datosActualizados);
        
        // Validar que no haya campos undefined
        if (datosActualizados.estado === undefined) {
          datosActualizados.estado = 'pendiente';
        }
        
        // Actualizar en Firebase
        await updateDoc(doc(db, 'ventas', ventaEditada.id), datosActualizados);
        
        Alert.alert('Éxito', 'Venta actualizada correctamente');
        onGuardar();
      } catch (error) {
        console.error('❌ Error actualizando venta:', error);
        Alert.alert('Error', `No se pudo actualizar la venta: ${error.message}`);
      } finally {
        setCargando(false);
      }
    };

    if (!ventaEditada || cargandoPrecios) {
      return (
        <Modal visible={visible} animationType="slide" transparent={false}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.cargandoTexto}>
              {cargandoPrecios ? 'Cargando precios actualizados...' : 'Cargando venta...'}
            </Text>
          </View>
        </Modal>
      );
    }

    const totalVenta = calcularTotal();
    const clienteSeleccionado = clientes.find(c => c.id === ventaEditada.id_cliente);

    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.titulo}>Editar Venta</Text>
            <TouchableOpacity onPress={onClose} style={styles.botonCerrar}>
              <FontAwesome name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contenido} showsVerticalScrollIndicator={false}>
            {/* Información básica */}
            <View style={styles.seccion}>
              <Text style={styles.subtitulo}>Información General</Text>
              
              <View style={styles.campo}>
                <Text style={styles.label}>Cliente *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ventaEditada.id_cliente}
                    onValueChange={(value) => actualizarCampo('id_cliente', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecciona un cliente" value="" />
                    {clientes.map(cliente => (
                      <Picker.Item 
                        key={cliente.id} 
                        label={cliente.nombre} 
                        value={cliente.id} 
                      />
                    ))}
                  </Picker>
                </View>
                {clienteSeleccionado && (
                  <Text style={styles.clienteSeleccionado}>
                    Cliente seleccionado: {clienteSeleccionado.nombre}
                  </Text>
                )}
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Estado *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={ventaEditada.estado}
                    onValueChange={(value) => actualizarCampo('estado', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Pendiente" value="pendiente" />
                    <Picker.Item label="Completada" value="completada" />
                    <Picker.Item label="Cancelada" value="cancelada" />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Productos */}
            <View style={styles.seccion}>
              <Text style={styles.subtitulo}>
                Productos ({ventaEditada.detalles?.length || 0})
              </Text>
            
              
              {ventaEditada.detalles?.length === 0 ? (
                <Text style={styles.sinProductos}>No hay productos en esta venta</Text>
              ) : (
                ventaEditada.detalles?.map((producto, index) => {
                  const cantidad = parseInt(producto.cantidad) || 1;
                  const precioUnitario = parseFloat(producto.precio_unitario) || 0;
                  const subtotal = cantidad * precioUnitario;
                  
                  return (
                    <View key={index} style={styles.productoCard}>
                      <View style={styles.productoHeader}>
                        <Text style={styles.productoNombre}>
                          {producto.nombre || `Producto ${index + 1}`}
                        </Text>
                        <View style={styles.botonesProducto}>
                          <TouchableOpacity 
                            onPress={() => actualizarPrecioDesdeFirebase(index)}
                            style={styles.botonActualizarPrecio}
                          >
                            <FontAwesome name="refresh" size={14} color="#007AFF" />
                            <Text style={styles.botonActualizarTexto}>Actualizar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => eliminarProducto(index)}
                            style={styles.botonEliminarProducto}
                          >
                            <FontAwesome name="trash" size={16} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <View style={styles.filaProducto}>
                        <View style={styles.campoProducto}>
                          <Text style={styles.label}>Cantidad *</Text>
                          <TextInput
                            style={styles.input}
                            value={producto.cantidad?.toString()}
                            onChangeText={(value) => actualizarCantidadProducto(index, value)}
                            keyboardType="numeric"
                            placeholder="1"
                          />
                        </View>
                        
                        <View style={styles.campoProducto}>
                          <Text style={styles.label}>Precio Unitario</Text>
                          <View style={styles.precioContainer}>
                            <Text style={styles.precioTexto}>
                              ${precioUnitario.toFixed(2)}
                            </Text>
                            <Text style={styles.precioRealTexto}>Precio actual del producto</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.calculosContainer}>
                        <Text style={styles.calculoTexto}>
                          {cantidad} × ${precioUnitario.toFixed(2)} = 
                        </Text>
                        <Text style={styles.subtotalProducto}>
                          ${subtotal.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Total */}
            <View style={styles.seccionTotal}>
              <Text style={styles.totalTexto}>
                Total: ${totalVenta.toFixed(2)}
              </Text>
              <Text style={styles.totalNota}>
                * Campos obligatorios
              </Text>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.botonesAccion}>
            <TouchableOpacity 
              style={[styles.boton, styles.botonCancelar]} 
              onPress={onClose}
              disabled={cargando}
            >
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.boton, styles.botonGuardar, cargando && styles.botonDeshabilitado]} 
              onPress={guardarCambios}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.textoBotonGuardar}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      backgroundColor: 'white',
      marginTop: 30,
    },
    titulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    botonCerrar: {
      padding: 4,
    },
    contenido: {
      flex: 1,
      padding: 16,
    },
    seccion: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    subtitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    notaPrecio: {
      fontSize: 12,
      color: '#666',
      fontStyle: 'italic',
      marginBottom: 12,
      backgroundColor: '#e7f3ff',
      padding: 8,
      borderRadius: 4,
    },
    campo: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      color: '#333',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 6,
      backgroundColor: '#f8f8f8',
      overflow: 'hidden',
    },
    picker: {
      backgroundColor: 'transparent',
    },
    clienteSeleccionado: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
      fontStyle: 'italic',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 6,
      padding: 10,
      backgroundColor: '#f8f8f8',
      fontSize: 14,
    },
    productoCard: {
      backgroundColor: '#f8f8f8',
      padding: 12,
      borderRadius: 6,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    productoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    productoNombre: {
      fontWeight: '600',
      fontSize: 14,
      flex: 1,
      color: '#333',
    },
    botonesProducto: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    botonActualizarPrecio: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e7f3ff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      gap: 4,
    },
    botonActualizarTexto: {
      fontSize: 10,
      color: '#007AFF',
      fontWeight: '500',
    },
    botonEliminarProducto: {
      padding: 6,
    },
    filaProducto: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    campoProducto: {
      flex: 1,
    },
    precioContainer: {
      borderWidth: 1,
      borderColor: '#28a745',
      borderRadius: 6,
      padding: 10,
      backgroundColor: '#f8fff9',
    },
    precioTexto: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#28a745',
      textAlign: 'center',
    },
    precioRealTexto: {
      fontSize: 10,
      color: '#28a745',
      textAlign: 'center',
      marginTop: 2,
      fontStyle: 'italic',
    },
    calculosContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#dee2e6',
    },
    calculoTexto: {
      fontSize: 12,
      color: '#666',
    },
    subtotalProducto: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'green',
    },
    sinProductos: {
      textAlign: 'center',
      color: '#666',
      fontStyle: 'italic',
      padding: 16,
    },
    seccionTotal: {
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    totalTexto: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'green',
    },
    totalNota: {
      fontSize: 12,
      color: '#666',
      marginTop: 8,
      fontStyle: 'italic',
    },
    botonesAccion: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: 'white',
    },
    boton: {
      flex: 1,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botonCancelar: {
      backgroundColor: '#f8f8f8',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    botonGuardar: {
      backgroundColor: '#007AFF',
    },
    botonDeshabilitado: {
      backgroundColor: '#ccc',
    },
    textoBotonCancelar: {
      fontWeight: '600',
      color: '#333',
      fontSize: 14,
    },
    textoBotonGuardar: {
      fontWeight: '600',
      color: 'white',
      fontSize: 14,
    },
    cargandoTexto: {
      marginTop: 10,
      textAlign: 'center',
      color: '#666',
    },
  });