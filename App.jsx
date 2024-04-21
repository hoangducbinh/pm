import React from "react";
import { View, StyleSheet } from "react-native";
import Stacks from "./src/Components/Navigations/Stacks";
import { Provider } from "react-redux";
import { store } from "./src/Components/Redux/store";


const App = () => {
  return (
    <Provider store={store}>
         <Stacks />
    </Provider>
     
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
