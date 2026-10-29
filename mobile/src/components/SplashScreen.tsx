import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { MirasLogo } from './MirasLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation drivers
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const glowScale = useRef(new Animated.Value(0.75)).current;
  const glowOpacity = useRef(new Animated.Value(0.2)).current;

  // Master container dissolve
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const isWeb = Platform.OS === 'web';
  const useNativeDriver = !isWeb;

  useEffect(() => {
    // Soft breathing pulse on the diffused background glow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.55,
          duration: 1200,
          useNativeDriver,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.25,
          duration: 1200,
          useNativeDriver,
        }),
      ])
    );
    pulseLoop.start();

    // Main entrance and dissolve sequence
    const sequence = Animated.sequence([
      // 1. Logo & diffused light fade-in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 750,
          useNativeDriver,
        }),
      ]),

      // 2. Pure centered glowing logo presence (clean, tranquil, no text)
      Animated.delay(1200),

      // 3. Smooth dissolve into the home screen
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver,
      }),
    ]);

    sequence.start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });

    const safetyTimer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      pulseLoop.stop();
      clearTimeout(safetyTimer);
    };
  }, [onFinish, useNativeDriver]);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: containerOpacity,
        },
      ]}
      pointerEvents="auto"
    >
      <StatusBar style="light" />

      {/* Atmospheric diffused light-spread effect (zero sharp circular boundary) */}
      <Animated.View
        style={[
          styles.glowWrapper,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={520} height={520} viewBox="0 0 520 520" style={styles.glowSvg}>
          <Defs>
            {/* Wide, ultra-soft ambient light spread */}
            <RadialGradient id="ambientSpread" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#0CB981" stopOpacity="0.28" />
              <Stop offset="25%" stopColor="#0CB981" stopOpacity="0.16" />
              <Stop offset="50%" stopColor="#10B981" stopOpacity="0.06" />
              <Stop offset="75%" stopColor="#0CB981" stopOpacity="0.015" />
              <Stop offset="100%" stopColor="#0CB981" stopOpacity="0" />
            </RadialGradient>
            {/* Core soft bloom directly behind logo */}
            <RadialGradient id="coreBloom" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
              <Stop offset="20%" stopColor="#0CB981" stopOpacity="0.4" />
              <Stop offset="45%" stopColor="#0CB981" stopOpacity="0.18" />
              <Stop offset="70%" stopColor="#0CB981" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#0CB981" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="520" height="520" fill="url(#ambientSpread)" />
          <Rect x="0" y="0" width="520" height="520" fill="url(#coreBloom)" />
        </Svg>
      </Animated.View>

      {/* Center only the crisp circular application logo */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <MirasLogo size={110} glow={false} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F131E', // Dark navy midnight theme canvas
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowWrapper: {
    position: 'absolute',
    width: 520,
    height: 520,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { filter: 'blur(30px)' } : {}),
  },
  glowSvg: {
    position: 'absolute',
    width: 520,
    height: 520,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
});
