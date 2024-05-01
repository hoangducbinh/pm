import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging';
const Notifications = () => {

    useEffect(()=>{
        getDeviceToken()
    },[])

    const getDeviceToken =async()=>{
        let token = await messaging().getToken();
        console.log("token",token);
    }
    
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
    
        return unsubscribe;
      }, []);

  return null;
}

export default Notifications