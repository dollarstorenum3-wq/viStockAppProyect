// VistocAApp/Screens/vistas/EstadisticasVentas.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import EstadisticasUnificadas from '../../Componentes/estadisticas/EstadisticasUnificadas';

export default function EstadisticasVentas() {
  return (
    <View style={styles.container}>
      <EstadisticasUnificadas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});