import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const acceder = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos vacíos', 'Por favor ingrese su correo y contraseña.');
            return;
        }

        // Autenticación básica 
        if (email === 'edgarmartinez@gmail.com' && password === '123456') {
            Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
            navigation.replace('MyTabsCliente'); // ir a la nav del cliente
        } else if (email === 'admin123@gmail.com' && password === '12345678') {
            Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
            navigation.replace('MyTabsAdmon'); // ir a la nav del administrador
        } else {
            Alert.alert('Error', 'Correo o contraseña incorrectos');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={acceder}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    formContainer: {
        width: '90%', 
        padding: 20,
        backgroundColor: '#fff', 
        borderWidth: 3, 
        borderColor: '#a5a4bdff', 
        borderRadius: 10, 
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2f3640',
        marginBottom: 30,
    },
    input: {
        width: '100%', // Ajuste para que ocupe el ancho del formContainer
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dcdde1',
    },
    button: {
        backgroundColor: '#a5a4bdff',
        width: '100%', // Ajuste para que ocupe el ancho del formContainer
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});