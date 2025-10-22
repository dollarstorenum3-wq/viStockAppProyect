import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator,} from "react-native";
import CardProducto from "../Componentes/CardProducto";
import Buscador from "../Componentes/Buscador";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../src/database/firebaseconfig'; 

export default function Categorias() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); 
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categorías
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const categoriasData = categoriasSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          nombre: docSnap.data().nombre_categoria,
        }));
        setCategorias(categoriasData);

        if (categoriasData.length > 0) {
          setCategoriaSeleccionada(categoriasData[0].nombre);
        }

        // Fetch productos y mapear categorías
        const productosSnapshot = await getDocs(collection(db, 'productos'));
        const productosData = await Promise.all(
          productosSnapshot.docs.map(async (docSnap) => {
            const data = { id: docSnap.id, ...docSnap.data() };
            let categoriaNombre = 'Sin categoría';
            if (data.id_categoria) {
              const categoriaRef = doc(db, 'categorias', data.id_categoria);
              const categoriaSnap = await getDoc(categoriaRef);
              if (categoriaSnap.exists()) {
                categoriaNombre = categoriaSnap.data().nombre_categoria;
              }
            }
            return {
              id: data.id,
              nombre: data.nombre_producto,
              precio: `$${data.precio_unitario.toFixed(2)}`,
              imagen: { uri: data.foto },
              calificacion: data.calificacion || 0,
              categoria: categoriaNombre,
            };
          })
        );
        setProductos(productosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrado por categoría y búsqueda
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.categoria === categoriaSeleccionada &&
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Encuentra Lo Que Buscas</Text>
      </View>

      {/* Buscador con carrito (componente reutilizable) */}
      <Buscador value={busqueda} onChangeText={setBusqueda} />

      {/* Línea divisora */}
      <View style={styles.lineaNegra} />

      {/* Texto "Categorías" */}
      <Text style={styles.titulo}>Categorías</Text>

      {/* Barra de categorías */}
      {loading ? (
        <ActivityIndicator size="small" color="black" style={{ marginVertical: 10 }} />
      ) : (
        <View style={styles.categoriasWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriasContent}
          >
            {categorias.map((cat) => {
              const seleccionado = categoriaSeleccionada === cat.nombre;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoriaItem, seleccionado && styles.categoriaSeleccionada]}
                  onPress={() => setCategoriaSeleccionada(cat.nombre)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.textoCategoria, seleccionado && styles.textoCategoriaSeleccionada]}>
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Zona de productos */}
      {loading ? (
        <ActivityIndicator size="large" color="black" style={{ marginTop: 20 }} />
      ) : productosFiltrados.length > 0 ? (
        <FlatList
          data={productosFiltrados}
          renderItem={({ item }) => <CardProducto producto={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.lista}
        />
      ) : (
        <View style={styles.noProductos}>
          <Text style={styles.textoNoProductos}>No hay productos en esta categoría.</Text>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  encabezado: {
    backgroundColor: "#a5a4bdff",
    paddingVertical: 15,
    alignItems: "center",
  },
  textoEncabezado: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    margin: 16,
  },

  lineaNegra: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 5,
  },

  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 8,
    color: "black",
  },

  categoriasWrapper: {
    marginHorizontal: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 56,
    justifyContent: "center",
  },
  categoriasContent: {
    alignItems: "center",
    paddingHorizontal: 6,
  },

  categoriaItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriaSeleccionada: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
  },
  textoCategoria: {
    fontSize: 14,
    color: "black",
  },
  textoCategoriaSeleccionada: {
    fontWeight: "600",
  },

  
  lista: {
    paddingHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 8,
    paddingRight: 8,
  },

  noProductos: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoNoProductos: {
    fontSize: 16,
    color: "gray",
  },
});