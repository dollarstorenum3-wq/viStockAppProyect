// Components/estadisticas/EstadisticasUnificadas.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../src/database/firebaseconfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EstadisticasUnificadas() {
  const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState('ventas_trimestre');
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [tipoGrafica, setTipoGrafica] = useState('barras');

  const OPCIONES_ESTADISTICAS = [
    { label: '📊 Ventas por Trimestre', value: 'ventas_trimestre' },
    { label: '📈 Ventas Mensuales', value: 'ventas_mensuales' },
    { label: '🔥 Productos Más Vendidos', value: 'productos_top' },
    { label: '📦 Stock Bajo', value: 'stock_bajo' }
  ];

  // CONSULTAS OPTIMIZADAS A FIRESTORE - SOLO LAS 4 QUE NECESITAS
  const consultasFirestore = {
    // Ventas por trimestre
    ventas_trimestre: async () => {
      const q = query(
        collection(db, "ventas"),
        orderBy("fecha", "desc"),
        limit(200)
      );
      
      const snapshot = await getDocs(q);
      const trimestres = {
        'Ene-Mar': { ventas: 0, total: 0 },
        'Abr-Jun': { ventas: 0, total: 0 },
        'Jul-Sep': { ventas: 0, total: 0 },
        'Oct-Dic': { ventas: 0, total: 0 }
      };
      
      snapshot.forEach(doc => {
        const venta = doc.data();
        if (venta.fecha) {
          const fecha = venta.fecha.toDate();
          const mes = fecha.getMonth();
          let trimestre;
          
          if (mes <= 2) trimestre = 'Ene-Mar';
          else if (mes <= 5) trimestre = 'Abr-Jun';
          else if (mes <= 8) trimestre = 'Jul-Sep';
          else trimestre = 'Oct-Dic';
          
          trimestres[trimestre].ventas += 1;
          trimestres[trimestre].total += venta.total || 0;
        }
      });
      
      return Object.entries(trimestres).map(([nombre, datos]) => ({
        nombre,
        valor: datos.ventas,
        total: datos.total
      }));
    },

    // Ventas mensuales (último año) - CORREGIDO PARA MOSTRAR TODOS LOS MESES
    ventas_mensuales: async () => {
      const q = query(
        collection(db, "ventas"),
        orderBy("fecha", "desc"),
        limit(500) // Aumentamos el límite para asegurar todos los meses
      );
      
      const snapshot = await getDocs(q);
      
      // Inicializamos todos los meses con nombres completos
      const meses = [
        { nombre: 'Enero', ventas: 0, total: 0 },
        { nombre: 'Febrero', ventas: 0, total: 0 },
        { nombre: 'Marzo', ventas: 0, total: 0 },
        { nombre: 'Abril', ventas: 0, total: 0 },
        { nombre: 'Mayo', ventas: 0, total: 0 },
        { nombre: 'Junio', ventas: 0, total: 0 },
        { nombre: 'Julio', ventas: 0, total: 0 },
        { nombre: 'Agosto', ventas: 0, total: 0 },
        { nombre: 'Septiembre', ventas: 0, total: 0 },
        { nombre: 'Octubre', ventas: 0, total: 0 },
        { nombre: 'Noviembre', ventas: 0, total: 0 },
        { nombre: 'Diciembre', ventas: 0, total: 0 }
      ];
      
      snapshot.forEach(doc => {
        const venta = doc.data();
        if (venta.fecha) {
          const fecha = venta.fecha.toDate();
          const mes = fecha.getMonth(); // 0-11
          if (mes >= 0 && mes <= 11) {
            meses[mes].ventas += 1;
            meses[mes].total += venta.total || 0;
          }
        }
      });
      
      return meses.map(mes => ({
        nombre: mes.nombre,
        valor: mes.ventas,
        total: mes.total
      }));
    },

    // Top 10 productos más vendidos
    productos_top: async () => {
      const q = query(
        collection(db, "ventas"),
        orderBy("fecha", "desc"),
        limit(100) // Últimas 100 ventas para análisis
      );
      
      const snapshot = await getDocs(q);
      const productosMap = {};
      
      snapshot.forEach(doc => {
        const venta = doc.data();
        venta.detalles?.forEach(detalle => {
          const key = detalle.id_producto || detalle.nombre;
          if (!productosMap[key]) {
            productosMap[key] = {
              nombre: detalle.nombre || 'Sin nombre',
              cantidad: 0,
              total: 0
            };
          }
          productosMap[key].cantidad += detalle.cantidad || 0;
          productosMap[key].total += (detalle.precio || 0) * (detalle.cantidad || 0);
        });
      });
      
      return Object.values(productosMap)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10)
        .map(producto => ({
          nombre: producto.nombre,
          valor: producto.cantidad,
          total: producto.total
        }));
    },

    // Productos con stock bajo (versión simplificada sin índices)
    stock_bajo: async () => {
      const q = query(collection(db, "productos"));
      
      const snapshot = await getDocs(q);
      const productos = [];
      
      snapshot.forEach(doc => {
        const producto = doc.data();
        // Filtro en JavaScript para evitar índices compuestos
        if ((producto.stock || 0) < 10) {
          productos.push({
            nombre: producto.nombre_producto || 'Sin nombre',
            valor: producto.existencia || 0,
            total: producto.precio || 0
          });
        }
      });
      
      // Ordenamos en JavaScript por stock (menor a mayor)
      return productos
        .sort((a, b) => a.valor - b.valor)
        .slice(0, 15);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [estadisticaSeleccionada]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const consulta = consultasFirestore[estadisticaSeleccionada];
      if (consulta) {
        const resultado = await consulta();
        setDatos(resultado);
        
        // Determinar tipo de gráfica automáticamente
        if (estadisticaSeleccionada === 'productos_top' || estadisticaSeleccionada === 'stock_bajo') {
          setTipoGrafica('barras_horizontales');
        } else {
          setTipoGrafica('barras');
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setCargando(false);
    }
  };

  const renderGraficaBarras = () => {
    const maxValor = Math.max(...datos.map(d => d.valor));
    const escala = maxValor > 0 ? 180 / maxValor : 1;

    return (
      <View style={styles.graficaContainer}>
        {datos.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { height: item.valor * escala }
                ]} 
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.nombre}
            </Text>
            <Text style={styles.valor}>{item.valor}</Text>
            {item.total > 0 && (
              <Text style={styles.total}>${item.total.toLocaleString()}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderGraficaBarrasHorizontales = () => {
    const maxValor = Math.max(...datos.map(d => d.valor));

    return (
      <View style={styles.graficaHorizontalContainer}>
        {datos.map((item, index) => (
          <View key={index} style={styles.filaHorizontal}>
            <View style={styles.infoFila}>
              <Text style={styles.labelHorizontal} numberOfLines={1}>
                {item.nombre}
              </Text>
              <Text style={styles.valorHorizontal}>{item.valor}</Text>
            </View>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.barHorizontal,
                  { width: `${(item.valor / maxValor) * 100}%` }
                ]} 
              />
            </View>
            {item.total > 0 && (
              <Text style={styles.totalHorizontal}>
                ${item.total.toLocaleString()}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const obtenerTitulo = () => {
    const opcion = OPCIONES_ESTADISTICAS.find(op => op.value === estadisticaSeleccionada);
    return opcion ? opcion.label : 'Estadísticas';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📈 Dashboard de Estadísticas</Text>
      
      {/* Selector con Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Seleccionar Estadística:</Text>
        <Picker
          selectedValue={estadisticaSeleccionada}
          onValueChange={setEstadisticaSeleccionada}
          style={styles.picker}
          dropdownIconColor="#333"
        >
          {OPCIONES_ESTADISTICAS.map((opcion) => (
            <Picker.Item 
              key={opcion.value} 
              label={opcion.label} 
              value={opcion.value} 
            />
          ))}
        </Picker>
      </View>

      {/* Botón actualizar */}
      <View style={styles.botonesContainer}>
        <Text style={styles.actualizarText} onPress={cargarDatos}>
          🔄 Actualizar Datos
        </Text>
      </View>

      {/* Gráfica */}
      <View style={styles.graficaCard}>
        <Text style={styles.graficaTitulo}>{obtenerTitulo()}</Text>
        
        {cargando ? (
          <View style={styles.cargandoContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.cargandoText}>Cargando datos...</Text>
          </View>
        ) : datos.length === 0 ? (
          <Text style={styles.sinDatos}>No hay datos disponibles</Text>
        ) : (
          <>
            {tipoGrafica === 'barras' && renderGraficaBarras()}
            {tipoGrafica === 'barras_horizontales' && renderGraficaBarrasHorizontales()}
            
            {/* Resumen */}
            <View style={styles.resumen}>
              <Text style={styles.resumenText}>
                Total: {datos.length} elementos • 
                Max: {Math.max(...datos.map(d => d.valor))} • 
                Min: {Math.min(...datos.map(d => d.valor))}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Datos en texto CON SCROLLVIEW PARA TODAS LAS ESTADÍSTICAS */}
      {!cargando && datos.length > 0 && (
        <View style={styles.listaDatos}>
          <Text style={styles.listaTitulo}>📋 Detalles Completos:</Text>
          <ScrollView 
            style={styles.listaScroll} 
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            {datos.map((item, index) => (
              <View key={index} style={styles.itemLista}>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <Text style={styles.itemValor}>
                  {item.valor} {estadisticaSeleccionada === 'stock_bajo' ? 'unidades' : 'ventas'}
                </Text>
                {item.total > 0 && (
                  <Text style={styles.itemTotal}>${item.total.toLocaleString()}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  actualizarText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 16,
  },
  graficaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  graficaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  cargandoContainer: {
    alignItems: 'center',
    padding: 40,
  },
  cargandoText: {
    marginTop: 10,
    color: '#666',
  },
  sinDatos: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 40,
    fontSize: 16,
  },
  // Estilos para gráfica de barras verticales
  graficaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 220,
    paddingHorizontal: 5,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 20,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#3498db',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  valor: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  total: {
    fontSize: 10,
    color: '#27ae60',
    textAlign: 'center',
    marginTop: 2,
  },
  // Estilos para gráfica de barras horizontales
  graficaHorizontalContainer: {
    minHeight: 200,
  },
  filaHorizontal: {
    marginBottom: 12,
  },
  infoFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  labelHorizontal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  valorHorizontal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3498db',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barHorizontal: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  totalHorizontal: {
    fontSize: 10,
    color: '#27ae60',
    textAlign: 'right',
    marginTop: 2,
  },
  resumen: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  resumenText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // ESTILOS MEJORADOS PARA LISTA CON SCROLL EN TODAS LAS ESTADÍSTICAS
  listaDatos: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1, // Ocupa el espacio disponible
    maxHeight: 400, // Altura máxima aumentada
  },
  listaScroll: {
    flex: 1, // ScrollView ocupa todo el espacio disponible
  },
  scrollContent: {
    paddingBottom: 10, // Espacio al final del contenido
  },
  listaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  itemLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  itemNombre: {
    flex: 2,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  itemValor: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    textAlign: 'center',
  },
  itemTotal: {
    flex: 1,
    fontSize: 14,
    color: '#27ae60',
    textAlign: 'right',
    fontWeight: '500',
  },
});