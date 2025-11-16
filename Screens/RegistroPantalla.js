import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, KeyboardAvoidingView, Alert, Platform 
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../src/database/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

export default function RegistroPantalla({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false); 

  const validarDatosDesdeLambda = async () => {
    try {
      const response = await fetch('https://4fzjdlfcdj.execute-api.us-east-1.amazonaws.com/apiDatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, telefono, cedula, email, password })
      });

      const data = await response.json();
      if (data.valido) return true;
      Alert.alert('Error de validación', data.mensaje || 'Los datos no son válidos');
      return false;
    } catch (error) {
      console.error('Error al validar datos:', error);
      Alert.alert('Error', 'No se pudo conectar con el servicio de validación.');
      return false;
    }
  };

  const registrarse = async () => {
    if (!nombre || !apellido || !telefono || !cedula || !email || !password) {
      return Alert.alert('Error', 'Todos los campos son obligatorios');
    }

    const esValido = await validarDatosDesdeLambda();
    if (!esValido) return;

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, password);
      const uid = credencial.user.uid;

      await setDoc(doc(db, 'users', uid), { rol: 'cliente' });
      await setDoc(doc(db, 'clientes', uid), { nombre, apellido, telefono, cedula, email });

      Alert.alert('Éxito', 'Cuenta creada correctamente');
      navigation.replace('MyTabsCliente');
    } catch (error) {
      const mensaje = error.code === 'auth/email-already-in-use'
        ? 'Este correo ya está registrado'
        : 'Error al crear cuenta';
      Alert.alert('Error', mensaje);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Crear Cuenta</Text>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} placeholder="Ingresa tu nombre" value={nombre} onChangeText={setNombre} />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput style={styles.input} placeholder="Ingresa tu apellido" value={apellido} onChangeText={setApellido} />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} placeholder="88552233" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Cédula</Text>
          <TextInput style={styles.input} placeholder="001-010190-0001A" value={cedula} onChangeText={setCedula} />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput style={styles.input} placeholder="tucorreo@ejemplo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.inputPassword}
              placeholder="Mínimo 6 caracteres"
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!mostrarPassword}  
            />
            <TouchableOpacity 
              style={styles.botonMostrar}
              onPress={() => setMostrarPassword(!mostrarPassword)}
            >
              <Text style={styles.textoMostrar}>
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.boton} onPress={registrarse}>
          <Text style={styles.textoBoton}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.volver}>Volver al Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#f5f6fa', 
    justifyContent: 'center' 
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30, 
    color: '#2f3640' 
  },
  labelContainer: { width: '100%', marginBottom: 15 },
  label: { fontSize: 14, color: '#333', marginBottom: 6, fontWeight: '600', paddingLeft: 4 },
  
  passwordContainer: {
    position: 'relative',
  },
  inputPassword: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    paddingRight: 100,  
  },
  botonMostrar: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  textoMostrar: {
    color: '#a5a4bdff',
    fontWeight: '600',
    fontSize: 15,
  },

  input: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    fontSize: 16 
  },
  boton: { 
    backgroundColor: '#a5a4bdff', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  textoBoton: { color: '#fff', fontSize: 18, fontWeight: '600' },
  volver: { marginTop: 20, textAlign: 'center', color: '#666', fontSize: 16 },
});