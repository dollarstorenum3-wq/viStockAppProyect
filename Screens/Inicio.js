import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import CardProducto from '../Componentes/CardProducto';
import Buscador from '../Componentes/Buscador';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../src/database/firebaseconfig'; 

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosData = await Promise.all(
          productosSnapshot.docs.map(async (docSnap) => {
            const data = { id: docSnap.id, ...docSnap.data() };
            // Fetch nombre_categoria desde coleccion categorias usando id_categoria
            if (data.id_categoria) {
              const categoriaRef = doc(db, 'categorias', data.id_categoria);
              const categoriaSnap = await getDoc(categoriaRef);
              if (categoriaSnap.exists()) {
                data.categoria = categoriaSnap.data().nombre_categoria || 'Sin categoría';
              } else {
                data.categoria = 'Sin categoría';
              }
            } else {
              data.categoria = 'Sin categoría';
            }  
            return {
              id: data.id,
              nombre: data.nombre_producto,
              precio: `$${data.precio_unitario.toFixed(2)}`,
              imagen: { uri: data.foto },
              calificacion: data.calificacion || 0,
              categoria: data.categoria,
            };
          })
        );
        setProductos(productosData);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Encuentra Lo Que Buscas</Text>
      </View>
      <Buscador value={busqueda} onChangeText={setBusqueda} />
      <View style={styles.lineaNegra} />
      <Text style={styles.tituloSeccion}>Productos Destacados</Text>
      {loading ? (
        <ActivityIndicator size="large" color="black" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={productosFiltrados}
          renderItem={({ item }) => <CardProducto producto={item} />}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  encabezado: { 
    backgroundColor: '#a5a4bdff', 
    paddingVertical: 15, 
    alignItems: 'center' 
  },
  textoEncabezado: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'black',
    margin: 16,
  },
  tituloSeccion: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    margin: 5, 
    color: 'black' 
  },
  lista: { 
    paddingHorizontal: 5 
  },
  lineaNegra: { 
    height: 1, 
    backgroundColor: 'black', 
    marginVertical: 5 
  },
});