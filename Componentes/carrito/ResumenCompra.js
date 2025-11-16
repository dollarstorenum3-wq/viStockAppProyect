import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../src/database/firebaseconfig';
import { collection, Timestamp, runTransaction, doc } from 'firebase/firestore';
import { useCarrito } from '../../CarritoContext';
import { usarAutenticacion } from '../../src/contexto/AutenticacionContexto';

export default function ResumenCompra({ navigation }) {
  const { carrito, totalCarrito, limpiarCarrito } = useCarrito();
  const { esInvitado } = usarAutenticacion();

  const handleFinalizarCompra = async () => {
    if (esInvitado) {
      Alert.alert('Regístrate', 'Debes tener una cuenta para comprar.');
      return;
    }

    if (carrito.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de comprar.');
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert('Error', 'No estás autenticado.');
      return;
    }

    Alert.alert(
      'Confirmar Compra',
      `Total: $${totalCarrito.toFixed(2)}\n¿Finalizar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await runTransaction(db, async (transaction) => {
                const productosRefs = carrito.map(item => doc(db, 'productos', item.id));
                const productosSnap = await Promise.all(
                  productosRefs.map(ref => transaction.get(ref))
                );

                const detalles = [];
                let totalCalculado = 0;

                for (let i = 0; i < carrito.length; i++) {
                  const item = carrito[i];
                  const snap = productosSnap[i];

                  if (!snap.exists()) throw new Error(`Producto ${item.nombre} no existe`);
                  const data = snap.data();
                  const precio = parseFloat(data.precio_unitario) || 0;
                  const existencia = data.existencia || 0;

                  if (existencia < item.cantidad) throw new Error(`Stock insuficiente para ${item.nombre}`);

                  const subtotal = precio * item.cantidad;
                  totalCalculado += subtotal;

                  detalles.push({
                    id_producto: item.id,
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio_ventas: precio,
                  });

                  transaction.update(productosRefs[i], {
                    existencia: existencia - item.cantidad
                  });
                }

                if (Math.abs(totalCalculado - totalCarrito) > 0.01) {
                  throw new Error('El total no coincide');
                }

                const ventasRef = collection(db, 'ventas');
                const nuevaVentaRef = doc(ventasRef);
                transaction.set(nuevaVentaRef, {
                  id_cliente: uid,
                  fecha: Timestamp.now(),
                  detalles,
                  total: totalCalculado,
                });

                const pedidosRef = collection(db, 'pedidos');
                const nuevoPedidoRef = doc(pedidosRef);
                transaction.set(nuevoPedidoRef, {
                  id_venta: nuevaVentaRef.id,
                  id_cliente: uid,
                  fecha: Timestamp.now(),
                  estado: 'pendiente',
                  detalles,
                  total: totalCalculado,
                  num_productos: detalles.length,
                });
              });

              limpiarCarrito();

              // CAMBIO CLAVE: NAVEGAR A LA PESTAÑA PEDIDOS
              Alert.alert(
                '¡Compra Exitosa!',
                'Tu pedido ha sido registrado.',
                [
                  {
                    text: 'Ver Pedidos',
                    onPress: () => navigation.navigate('MyTabsCliente', { screen: 'Pedidos' })
                  }
                ]
              );
            } catch (error) {
              console.error('Error en compra:', error);
              Alert.alert('Error', error.message || 'No se pudo procesar la compra.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.resumen}>
        <Text style={styles.texto}>Total: </Text>
        <Text style={styles.total}>${totalCarrito.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.botonFinalizar} onPress={handleFinalizarCompra}>
        <Text style={styles.textoBoton}>Finalizar Compra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#ddd', 
    padding: 15, 
    elevation: 3 
  },
  resumen: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },
  texto: { 
    fontSize: 16, 
    color: '#333' 
  },
  total: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000' 
  },
  botonFinalizar: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  textoBoton: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});