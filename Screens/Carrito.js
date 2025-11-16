import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RegistroCarrito from '../Componentes/carrito/RegistroCarrito';
import ResumenCompra from '../Componentes/carrito/ResumenCompra';
import { useCarrito } from '../CarritoContext';

export default function Carrito({ navigation }) {
  const { carrito, totalItems } = useCarrito();
  const [busqueda, setBusqueda] = React.useState('');

  const carritoFiltrado = carrito.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Carrito de compras</Text>
        {totalItems > 0 && (
          <Text style={styles.contadorItems}>({totalItems} productos)</Text>
        )}
      </View>
      
      
      <View style={styles.lineaNegra} />

      {carrito.length === 0 ? (
        <View style={styles.carritoVacio}>
          <Text style={styles.textoCarritoVacio}>No hay productos en tu carrito</Text>
          <Text style={styles.subtextoCarritoVacio}>
            ¡Explora nuestros productos y agrega algunos a tu carrito!
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={carritoFiltrado}
            renderItem={({ item }) => <RegistroCarrito item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
          />
    
          {/* PASA navigation A ResumenCompra */}
          <ResumenCompra navigation={navigation} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f8f8' 
  },
  encabezado: { 
    backgroundColor: '#a5a4bdff', 
    paddingVertical: 15, 
    alignItems: 'center',
  },
  textoEncabezado: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'black',
    marginTop:15
  },
  contadorItems: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  lista: { 
    paddingBottom: 10 
  },
  lineaNegra: { 
    height: 1, 
    backgroundColor: 'black', 
    marginVertical: 5, 
    marginTop:10
  },
  carritoVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textoCarritoVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtextoCarritoVacio: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});