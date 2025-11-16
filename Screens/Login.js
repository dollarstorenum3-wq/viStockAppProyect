import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../src/database/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { usarAutenticacion } from '../src/contexto/AutenticacionContexto';

export default function LoginPantalla({ navigation }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { entrarComoInvitado } = usarAutenticacion();
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Validación con Lambda
  const validarLoginDesdeLambda = async () => {
    try {
      const response = await fetch('https://4fzjdlfcdj.execute-api.us-east-1.amazonaws.com/validarLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (data.valido) return true;
      Alert.alert('Error de validación', data.mensaje || 'Datos inválidos');
      return false;
    } catch (error) {
      console.error('Error al validar login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor de validación');
      return false;
    }
  };

  const iniciarSesion = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Complete los campos');
    }

    // Validar con Lambda antes de Firebase
    const esValido = await validarLoginDesdeLambda();
    if (!esValido) return;

    try {
      // Firebase convierte emails a minúsculas automáticamente
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));
      const rol = userDoc.exists() ? userDoc.data().rol : 'cliente';
      navigation.replace(rol === 'admin' ? 'MyTabsAdmon' : 'MyTabsCliente');
    } catch (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  const irARegistro = () => {
    navigation.navigate('RegistroPantalla');
  };

  const entrarInvitado = () => {
    entrarComoInvitado();
    navigation.replace('MyTabsCliente');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../Imagenes/Logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.pestanas}>
          <TouchableOpacity
            style={[styles.pestana, modo === 'login' && styles.pestanaActiva]}
            onPress={() => setModo('login')}
          >
            <Text style={[styles.textoPestana, modo === 'login' && styles.textoActivo]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pestana, modo === 'registro' && styles.pestanaActiva]}
            onPress={() => setModo('registro')}
          >
            <Text style={[styles.textoPestana, modo === 'registro' && styles.textoActivo]}>Regístrate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pestana, modo === 'invitado' && styles.pestanaActiva]}
            onPress={() => setModo('invitado')}
          >
            <Text style={[styles.textoPestana, modo === 'invitado' && styles.textoActivo]}>Invitado</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formulario}>
          {modo === 'login' && (
            <>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="tucorreo@gmail.com" 
                  value={email} 
                  onChangeText={setEmail} 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                />
              </View>

              <View style={styles.labelContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput 
                    style={styles.inputContraseña} 
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

              <TouchableOpacity style={styles.boton} onPress={iniciarSesion}>
                <Text style={styles.textoBoton}>Entrar</Text>
              </TouchableOpacity>
            </>
          )}

          {modo === 'registro' && (
            <TouchableOpacity style={styles.boton} onPress={irARegistro}>
              <Text style={styles.textoBoton}>Ir a Registro</Text>
            </TouchableOpacity>
          )}

          {modo === 'invitado' && (
            <TouchableOpacity style={styles.boton} onPress={entrarInvitado}>
              <Text style={styles.textoBoton}>Entrar como Invitado</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#f5f6fa', 
    alignItems: 'center', 
    paddingTop: 50 
  },
  logo: { 
    width: 200, 
    height: 230, 
    marginBottom: 10 
  },
  pestanas: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginBottom: 20, 
    width: '90%'
  },
  pestana: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center' 
  },
  pestanaActiva: { 
    backgroundColor: '#a5a4bdff' 
  },
  textoPestana: { 
    fontSize: 16, 
    color: '#666' 
  },
  textoActivo: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  formulario: { 
    width: '90%', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    borderWidth: 3, 
    borderColor: '#a5a4bdff' 
  },
  labelContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
    paddingLeft: 4,
  },
  input: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 16,
    borderWidth: 1, 
    borderColor: '#dcdde1' 
  },
  passwordContainer: {
    position: 'relative',
  },
  inputContraseña: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 16,
    borderWidth: 1, 
    borderColor: '#dcdde1',
    paddingRight: 100,
  },
  botonMostrar: {
    position: 'absolute',
    right: 12,
    top: 20,
  },
  textoMostrar: {
    color: '#a5a4bdff',
    fontWeight: '600',
    fontSize: 15,
  },
  boton: { 
    backgroundColor: '#a5a4bdff', 
    width: '100%', 
    paddingVertical: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  textoBoton: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});