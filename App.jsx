import React from "react";
import { View, StyleSheet } from "react-native";
import Stacks from "./src/Components/Navigations/Stacks";
import GradientButton from "./src/Components/Button/GradientButton";


const App = () => {
  


  return (
    
      <Stacks />
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default App;
