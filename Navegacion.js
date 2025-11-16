import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import Inicio from './Screens/Inicio';
import Categorias from './Screens/Categorias';
import Favoritos from './Screens/Favoritos';
import Perfil from './Screens/Perfil';
import Carrito from './Screens/Carrito';
import Pedidos from './Screens/Pedidos';
import DetallePedido from './Screens/DetallePedido';
import Categ from './Screens/vistas/Categ';
import Proveedor from './Screens/vistas/Proveedor';
import Marcas from './Screens/vistas/Marcas';
import Productos from './Screens/vistas/Productos';
import Clientes from './Screens/vistas/Clientes';
import VentasAdmin from './Screens/vistas/VentasAdmin';
import PedidosAdmin from './Screens/vistas/PedidosAdmin';
import EstadisticasVentas from './Screens/vistas/EstadisticasVentas';

// --- 1. IMPORTAMOS LAS VISTAS DE COMPRA ---
import ComprasAdmin from './Screens/vistas/ComprasAdmin';
import FormularioCompra from './Screens/vistas/FormularioCompra';

import LoginPantalla from './Screens/Login';
import RegistroPantalla from './Screens/RegistroPantalla';
import InformacionPersonal from './Screens/InformacionPersonal';
import HistorialCompras from './Screens/HistorialCompras';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

// Componente del Menú Hamburguesa para Administrador
const HamburgerMenu = ({ isVisible, onClose, navigation, userType }) => {
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const menuItemsAdmin = [
    { name: 'Productos', icon: 'shopping-bag', screen: 'Productos' },
    { name: 'Clientes', icon: 'users', screen: 'Clientes' },
    { name: 'Proveedores', icon: 'truck', screen: 'Proveedor' },
    { name: 'Ventas', icon: 'dollar', screen: 'VentasAdmin' },
    { name: 'Pedidos', icon: 'cube', screen: 'PedidosAdmin' },
    
    { name: 'Compras', icon: 'shopping-basket', screen: 'ComprasAdmin' },
    
    { name: 'Categorías', icon: 'th-large', screen: 'Categ' },
    { name: 'Marcas', icon: 'tag', screen: 'Marcas' },
    { name: 'Estadísticas', icon: 'bar-chart', screen: 'EstadisticasVentas' },
  ];

  const handleMenuItemPress = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  if (!isVisible) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />
      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Panel de Administración</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuItemsScroll}>
          <View style={styles.menuItems}>
            {menuItemsAdmin.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.menuItem,
                  index === menuItemsAdmin.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleMenuItemPress(item.screen)}
              >
                <View style={styles.menuItemContent}>
                  <FontAwesome name={item.icon} size={20} color="#333" />
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.menuFooter}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              onClose();
              navigation.navigate('LoginPantalla');
            }}
          >
            <FontAwesome name="sign-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

// Header Personalizado SOLO para Admin (con menú hamburguesa)
const AdminHeader = ({ navigation, title }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuButton}
      >
        <FontAwesome name="bars" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>
          {title || 'Panel Admin'}
        </Text>
      </View>
      
      <View style={styles.headerRight} />

      <HamburgerMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        userType="admin"
      />
    </View>
  );
};

// (MyTabsCliente no sufre cambios)
function MyTabsCliente() {
  const [totalCarritoItems, setTotalCarritoItems] = useState(0);
  const [totalPedidosItems, setTotalPedidosItems] = useState(0);

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#bbb7c2ff', borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ size }) => <FontAwesome name="home" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={Categorias}
        options={{
          tabBarLabel: 'Categorías',
          tabBarIcon: ({ size }) => <FontAwesome name="th-large" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ size }) => <FontAwesome name="heart" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="Carrito"
        options={{
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ size }) => <FontAwesome name="shopping-cart" size={size} color="#000" />,
        }}
      >
        {(props) => <Carrito {...props} onTotalItemsChange={setTotalCarritoItems} />}
      </Tab.Screen>
      
      <Tab.Screen
        name="Pedidos"
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ size }) => <FontAwesome name="cube" size={33} color="#000" />,
        }}
      >
        {(props) => <Pedidos {...props} onTotalItemsChange={setTotalPedidosItems} />}
      </Tab.Screen>

      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ size }) => <FontAwesome name="user" size={size} color="#000" />,
        }}
      />
    </Tab.Navigator>
  );
}

// (MyTabsAdmon no sufre cambios)
function MyTabsAdmon() {
  return (
    <Tab.Navigator
      initialRouteName="Productos"
      screenOptions={({ navigation, route }) => ({
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#bbb7c2ff', borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12 },
        header: () => (
          <AdminHeader
            navigation={navigation}
            title={getHeaderTitle(route.name)}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{
          tabBarLabel: 'Productos',
          tabBarIcon: ({ size }) => <FontAwesome name="shopping-bag" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ size }) => <FontAwesome name="users" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="Proveedor"
        component={Proveedor}
        options={{
          tabBarLabel: 'Proveedores',
          tabBarIcon: ({ size }) => <FontAwesome name="truck" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="VentasAdmin"
        component={VentasAdmin}
        options={{
          tabBarLabel: 'Ventas',
          tabBarIcon: ({ size }) => <FontAwesome name="dollar" size={size} color="#000" />,
        }}
      />
      <Tab.Screen
        name="PedidosAdmin"
        component={PedidosAdmin}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ size }) => <FontAwesome name="cube" size={size} color="#000" />,
        }}
      />
    </Tab.Navigator>
  );
}


const getHeaderTitle = (routeName) => {
  const titleMap = {
    'Productos': 'Gestión de Productos',
    'Clientes': 'Gestión de Clientes',
    'Proveedor': 'Gestión de Proveedores',
    'VentasAdmin': 'Gestión de Ventas',
    'PedidosAdmin': 'Gestión de Pedidos',
    'ComprasAdmin': 'Gestión de Compras',
    'Categ': 'Gestión de Categorías',
    'Marcas': 'Gestión de Marcas',
    'EstadisticasVentas': 'Estadísticas de Ventas'
  };
  return titleMap[routeName] || routeName;
};

function StackLogin() {
  return (
    <StackNav.Navigator
      initialRouteName="LoginPantalla"
      screenOptions={{ headerShown: false }}
    >
      {/* PANTALLAS DE AUTENTICACIÓN */}
      <StackNav.Screen name="LoginPantalla" component={LoginPantalla} />
      <StackNav.Screen name="RegistroPantalla" component={RegistroPantalla} />

      {/* PANTALLAS PRINCIPALES - AÑADIDAS AL STACK PARA NAVEGACIÓN */}
      <StackNav.Screen name="MyTabsCliente" component={MyTabsCliente} />
      <StackNav.Screen name="MyTabsAdmon" component={MyTabsAdmon} />
      
      
      {/* (Pantallas de Cliente: Pedidos, DetallePedido, etc. sin cambios) */}
      <StackNav.Screen
        name="Pedidos"
        component={Pedidos}
        options={{
          headerShown: true,
          title: 'Mis Pedidos',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="DetallePedido"
        component={DetallePedido}
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="InformacionPersonal"
        component={InformacionPersonal}
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="HistorialCompras"
        component={HistorialCompras}
        options={{
          headerShown: true,
          title: '',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* PANTALLAS ADMIN QUE NO ESTÁN EN LA BARRA DE PESTAÑAS PERO SÍ EN EL MENÚ */}
      <StackNav.Screen
        name="Categ"
        component={Categ}
        options={{
          headerShown: true,
          title: 'Gestión de Categorías',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="Marcas"
        component={Marcas}
        options={{
          headerShown: true,
          title: 'Gestión de Marcas',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="EstadisticasVentas"
        component={EstadisticasVentas}
        options={{
          headerShown: true,
          title: 'Estadísticas de Ventas',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      
      {/* --- 4. REGISTRAMOS LAS PANTALLAS DE COMPRA EN EL STACK --- */}
      <StackNav.Screen
        name="ComprasAdmin"
        component={ComprasAdmin}
        options={{
          headerShown: true,
          title: 'Gestión de Compras',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <StackNav.Screen
        name="FormularioCompra"
        component={FormularioCompra}
        options={{
          headerShown: true,
          title: 'Formulario de Compra',
          headerStyle: { backgroundColor: '#a5a4bdff' },
          headerTintColor: 'black',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

    </StackNav.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <StackLogin />
    </NavigationContainer>
  );
}

// (Estilos sin cambios)
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#a5a4bdff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    height: 75,
  },
  menuButton: {
    padding: 8,
    marginTop:10
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:18
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: '#fff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    backgroundColor: '#a5a4bdff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  menuItemsScroll: {
    flex: 1,
  },
  menuItems: {
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,

  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});