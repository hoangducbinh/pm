
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setEmail, setPassword, setLoggedIn } from '../Components/Redux/reducers/authReducer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';






const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const email = useSelector(state => state.auth.email);
  const password = useSelector(state => state.auth.password);

 
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Kiểm tra xem có thông tin đăng nhập đã được lưu trong AsyncStorage không
        const savedEmail = await AsyncStorage.getItem('email');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedEmail && savedPassword) {
          dispatch(setEmail(savedEmail));
          dispatch(setPassword(savedPassword));
          dispatch(setLoggedIn(true));
          navigation.navigate('ChatGroups');
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra thông tin đăng nhập:', error);
      }
    };

    checkLoggedIn();
  }, []); // Chỉ chạy một lần sau khi màn hình được hiển thị lần đầu tiên

  const handleEmailLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Lưu thông tin đăng nhập vào AsyncStorage
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);

      console.log('Đăng nhập thành công:', user);
      dispatch(setLoggedIn(true));
      navigation.navigate('ChatGroups');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.code, error.message);
    }
  };
  
  
 
 
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => dispatch(setEmail(text))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={text => dispatch(setPassword(text))}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
       
       
        <TouchableOpacity style={styles.forgotPasswordButton} >
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: 'blue',
    fontSize: 14,
  },
});

export default LoginScreen;
