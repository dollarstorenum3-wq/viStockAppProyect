import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Inicio from './Screens/Inicio';
import Categorias from './Screens/Categorias';
import Favoritos from './Screens/Favoritos';
import Perfil from './Screens/Perfil';
import Carrito from './Screens/Carrito';
import Login from './Screens/Login';
import Categ from './Screens/vistas/Categ';
import Proveedor from './Screens/vistas/Proveedor';
import Marcas from './Screens/vistas/Marcas';
import Productos from './Screens/vistas/Productos';
import Clientes from './Screens/vistas/Clientes';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

function MyTabsCliente() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#bbb7c2ff', borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Inicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={Categorias}
        options={{
          tabBarLabel: 'Categorías',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={Carrito}
        options={{
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function MyTabsAdmon() {
  return (
    <Tab.Navigator
      initialRouteName="Categ"
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#bbb7c2ff', borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Categ"
        component={Categ}
        options={{
          tabBarLabel: 'Categorías',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="th-large" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Proveedor"
        component={Proveedor}
        options={{
          tabBarLabel: 'Proveedores',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="truck" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Marcas"
        component={Marcas}
        options={{
          tabBarLabel: 'Marcas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="tag" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{
          tabBarLabel: 'Productos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-bag" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={Clientes}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color="#000" />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function StackLogin() {
  return (
    <StackNav.Navigator initialRouteName="Login" 
      screenOptions={{ headerShown: false }}>
      <StackNav.Screen name="Login" component={Login} />
      <StackNav.Screen name="MyTabsCliente" component={MyTabsCliente} />
      <StackNav.Screen name="MyTabsAdmon" component={MyTabsAdmon} />
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