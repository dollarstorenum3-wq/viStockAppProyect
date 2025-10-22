import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const Buscador = ({ value, onChangeText }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FontAwesome name="search" size={18} color="gray" style={styles.iconoBusqueda} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Buscar productos..."
          placeholderTextColor="gray"
        />
      </View>

      {/* Botón del carrito */}
      <TouchableOpacity style={styles.carritoButton} onPress={() => navigation.navigate("Carrito")}>
        <FontAwesome name="shopping-cart" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  iconoBusqueda: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "black",
  },
  carritoButton: {
    marginLeft: 10,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
  },
});

export default Buscador;