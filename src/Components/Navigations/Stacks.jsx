import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../Screens/Home';
import ProjectScreen from '../../Screens/ProjectScreen';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from "../../Screens/Login";
import ChatGroupScreen from "../Chat/ChatGroupScreen";



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
        <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
        <Stack.Screen name="ChatGroup" component={ChatGroupScreen} />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Stacks;
