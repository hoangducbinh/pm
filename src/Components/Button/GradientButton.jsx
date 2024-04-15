import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({ onPress, title, colors }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ borderRadius: 5 }}>
      <LinearGradient
        colors={colors}
        style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
        <Text style={{ color: 'white', fontSize: 16 }}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
