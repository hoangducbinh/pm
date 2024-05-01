import React from "react";
import { View, StyleSheet } from "react-native";
import Stacks from "./src/Components/Navigations/Stacks";
import { Provider } from "react-redux";
import { store } from "./src/Components/Redux/store";
import Notifications from "./src/Components/Notifications/Notifications";


const App = () => {
  return (
    <Provider store={store}>
         <Stacks />
         {/* <Notifications/> */}
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
