import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface MirasLogoProps {
  size?: number;
  glow?: boolean;
  glowColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const MirasLogo: React.FC<MirasLogoProps> = ({
  size = 32,
  glow = false,
  glowColor = '#0CB981',
  style,
}) => {
  const radius = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        glow && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.85,
          shadowRadius: size * 0.4,
          elevation: 10,
        },
        style,
      ]}
    >
      <Image
        source={require('../../assets/miras-logo-transparent.png')}
        style={[
          styles.logoImage,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  logoImage: {
    borderRadius: 9999,
  },
});
