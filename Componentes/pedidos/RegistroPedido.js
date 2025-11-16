import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const RegistroPedido = ({ pedido }) => {
  const fecha = pedido.fecha?.toDate ? pedido.fecha.toDate() : new Date(pedido.fecha);
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const productosCount = pedido.detalles?.length || 0;

  return (
    <View style={styles.card}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Pedido #{pedido.id}</Text>
        <View style={styles.estadoContainer}>
          <FontAwesome name="clock-o" size={14} color="#b8860b" />
          <Text style={styles.estadoTexto}>Pendiente</Text>
        </View>
      </View>

      <Text style={styles.fecha}>{fechaFormateada}</Text>
      <View style={styles.linea} />

      <View style={styles.fila}>
        <Text style={styles.textoProductos}>
          {productosCount} producto{productosCount !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.totalTexto}>${pedido.total?.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 2,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7cc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  estadoTexto: {
    color: '#b8860b',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  fecha: {
    color: '#666',
    marginTop: 6,
    fontSize: 13,
  },
  linea: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoProductos: {
    color: '#555',
    fontSize: 14,
  },
  totalTexto: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RegistroPedido;