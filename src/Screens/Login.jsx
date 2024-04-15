import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  // const [email, setEmail] = useState('hung@gmail.com');
  // const [password, setPassword] = useState('12345678');

  const [email, setEmail] = useState('vune@gmail.com');
  const [password, setPassword] = useState('12345678');


  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Lấy thông tin tài khoản từ Firestore
      const userDoc = await firestore().collection('Member').doc(user.uid).get();
      const userData = userDoc.data();
  
      // Đăng nhập thành công, bạn có thể xử lý tiếp theo ở đây, ví dụ: điều hướng đến màn hình tiếp theo
      console.log('Đăng nhập thành công:', userData);
      navigation.navigate('ProjectScreen');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.code, error.message); // In ra thông báo lỗi cụ thể từ Firebase
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
