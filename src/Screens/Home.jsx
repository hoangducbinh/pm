import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const Home = () => {
  const newMessageNotification = useSelector(state => state.notification.newMessageNotification);

  return (
    <View>
      {newMessageNotification && <Text>{newMessageNotification}</Text>}
    </View>
  );
};

export default Home;