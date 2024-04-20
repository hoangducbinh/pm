import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from "../../Screens/Login";
import ChatGroups from "../../Screens/ChatGroups";
import Chats from "../Chat/Chats";


const Stack = createStackNavigator();

const Stacks = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown:false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ChatGroups" component={ChatGroups} />
        <Stack.Screen name="Chats" component={Chats} />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Stacks;
