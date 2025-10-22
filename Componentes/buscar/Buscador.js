
import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const Buscador = ({ busqueda, onSearch, placeholder = "Buscar..." }) => {
  return (
    <View style={styles.contenedor}>
      <Ionicons name="search" size={20} color="gray" style={styles.icono} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={busqueda}
        onChangeText={onSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginTop: 16
  },
  icono: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default Buscador;