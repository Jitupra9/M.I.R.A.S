import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { COLORS, useTheme } from '../theme/colors';
import { VoiceState } from '../types';

interface VoiceOrbProps {
  state: VoiceState;
  onPress: () => void;
  onStopSpeech?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state, onPress, onStopSpeech }) => {
  const { colors, themeName } = useTheme();
  // 1. Central Orb & Ambient Glow Breathing Animation (2.5s cycle)
  const orbScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  // 2. Continuous Master Animation for Expanding Ripple Rings (4.2s cycle)
  const masterRingAnim = useRef(new Animated.Value(0)).current;

  // 3. Audio Waveform Independent Bars (7 bars)
  const eq1 = useRef(new Animated.Value(5)).current;
  const eq2 = useRef(new Animated.Value(9)).current;
  const eq3 = useRef(new Animated.Value(14)).current;
  const eq4 = useRef(new Animated.Value(18)).current;
  const eq5 = useRef(new Animated.Value(12)).current;
  const eq6 = useRef(new Animated.Value(8)).current;
  const eq7 = useRef(new Animated.Value(5)).current;

  // 1. Central Orb & Background Glow Breathing Loop
  useEffect(() => {
    const isLive = state === 'LISTENING' || state === 'SPEAKING';
    const cycleTime = isLive ? 1200 : 2500;
    const minScale = isLive ? 1.0 : 0.96;
    const maxScale = isLive ? 1.18 : 1.06;
    const minGlow = isLive ? 0.45 : 0.22;
    const maxGlow = isLive ? 0.85 : 0.45;

    const breatheAnim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orbScale, {
            toValue: maxScale,
            duration: cycleTime / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(glowOpacity, {
            toValue: maxGlow,
            duration: cycleTime / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(orbScale, {
            toValue: minScale,
            duration: cycleTime / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(glowOpacity, {
            toValue: minGlow,
            duration: cycleTime / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      ])
    );

    breatheAnim.start();
    return () => breatheAnim.stop();
  }, [state]);

  // 2. Master Loop for Ripple Rings (Perpetual, Gapless, 4.2s duration)
  useEffect(() => {
    masterRingAnim.setValue(0);
    const ringLoop = Animated.loop(
      Animated.timing(masterRingAnim, {
        toValue: 1,
        duration: state === 'LISTENING' ? 3200 : 4200,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    ringLoop.start();
    return () => ringLoop.stop();
  }, [state]);

  // 3. Audio Waveform Bars Smooth Transitions (180–320ms per transition)
  useEffect(() => {
    const isLive = state === 'LISTENING' || state === 'SPEAKING';

    const animateBar = (anim: Animated.Value, minH: number, maxH: number, speed: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: maxH,
            duration: speed,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: minH,
            duration: speed,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ])
      );
    };

    const l1 = animateBar(eq1, 3, isLive ? 14 : 7, 240);
    const l2 = animateBar(eq2, 4, isLive ? 20 : 10, 190);
    const l3 = animateBar(eq3, 5, isLive ? 24 : 14, 270);
    const l4 = animateBar(eq4, 6, isLive ? 26 : 16, 210);
    const l5 = animateBar(eq5, 5, isLive ? 22 : 12, 290);
    const l6 = animateBar(eq6, 4, isLive ? 18 : 9, 220);
    const l7 = animateBar(eq7, 3, isLive ? 12 : 6, 250);

    l1.start();
    l2.start();
    l3.start();
    l4.start();
    l5.start();
    l6.start();
    l7.start();

    return () => {
      l1.stop();
      l2.stop();
      l3.stop();
      l4.stop();
      l5.stop();
      l6.stop();
      l7.stop();
    };
  }, [state]);

  // Derive 4 staggered ripple waves from masterRingAnim with zero dead gaps
  const ring1Val = masterRingAnim;
  const ring2Val = masterRingAnim.interpolate({
    inputRange: [0, 0.7499, 0.75, 1],
    outputRange: [0.25, 1, 0, 0.25],
  });
  const ring3Val = masterRingAnim.interpolate({
    inputRange: [0, 0.4999, 0.5, 1],
    outputRange: [0.5, 1, 0, 0.5],
  });
  const ring4Val = masterRingAnim.interpolate({
    inputRange: [0, 0.2499, 0.25, 1],
    outputRange: [0.75, 1, 0, 0.75],
  });

  const renderRippleRing = (ringVal: Animated.AnimatedInterpolation<number>, key: string) => {
    // Rings slowly expand outward from center (scale: 1.0 to 4.4)
    const scale = ringVal.interpolate({
      inputRange: [0, 1],
      outputRange: [1.0, 4.4],
    });

    // Faint, subtle and transparent (peaks around 0.42, fades softly to 0)
    const opacity = ringVal.interpolate({
      inputRange: [0, 0.08, 0.55, 1],
      outputRange: [0, 0.42, 0.22, 0],
    });

    return (
      <Animated.View
        key={key}
        pointerEvents="none"
        style={[
          styles.rippleRing,
          {
            borderColor: colors.primary,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  const handlePress = () => {
    if (state === 'SPEAKING' && onStopSpeech) {
      onStopSpeech();
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.touchContainer}
    >
      {/* 4. Native SVG Soft Radial Gradient Glow (Zero sharp edges on Mobile Android & Web alike) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.glowWrapper,
          {
            opacity: glowOpacity,
          },
        ]}
      >
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <Defs>
            <RadialGradient id={`softAtmosphereGlow-${themeName}`} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={colors.primary} stopOpacity={0.28} />
              <Stop offset="25%" stopColor={colors.primary} stopOpacity={0.16} />
              <Stop offset="50%" stopColor={colors.secondary} stopOpacity={0.08} />
              <Stop offset="75%" stopColor={colors.primaryDeep} stopOpacity={0.02} />
              <Stop offset="100%" stopColor={colors.background} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={140} cy={140} r={135} fill={`url(#softAtmosphereGlow-${themeName})`} />
        </Svg>
      </Animated.View>

      {/* 1. Multiple Transparent Expanding Circular Ripple Rings */}
      {renderRippleRing(ring1Val, 'ripple-1')}
      {renderRippleRing(ring2Val, 'ripple-2')}
      {renderRippleRing(ring3Val, 'ripple-3')}
      {renderRippleRing(ring4Val, 'ripple-4')}

      {/* Fixed Subtle Inner Halo Ring */}
      <View
        style={[
          styles.fixedInnerRing,
          {
            borderColor: colors.surfaceBorder,
            backgroundColor: colors.surfaceSubtle,
          },
        ]}
      />

      {/* 1. Central Glowing AI Orb */}
      <Animated.View
        style={[
          styles.centralOrbContainer,
          {
            transform: [{ scale: orbScale }],
          },
        ]}
      >
        {/* Soft outer aura ring */}
        <View
          style={[
            styles.orbAuraRing,
            {
              backgroundColor: colors.primaryGlow,
              borderColor: colors.surfaceBorder,
            },
          ]}
        />
        {/* Bright core circle */}
        <View
          style={[
            styles.orbCore,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
            (state === 'LISTENING' || state === 'SPEAKING') && [
              styles.orbCoreActive,
              { backgroundColor: colors.primaryLight, shadowColor: colors.primary },
            ],
          ]}
        />
      </Animated.View>

      {/* 2. Audio Waveform Animation: Multiple thin vertical bars */}
      <View
        style={[
          styles.waveformContainer,
          {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <Animated.View style={[styles.waveBar, { height: eq1, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq2, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq3, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq4, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq5, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq6, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
        <Animated.View style={[styles.waveBar, { height: eq7, backgroundColor: colors.primary, shadowColor: colors.primary }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    overflow: 'visible',
  },
  glowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedInnerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.25)',
    backgroundColor: 'rgba(0, 255, 163, 0.03)',
    pointerEvents: 'none',
  },
  rippleRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#00FFA3',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  centralOrbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  orbAuraRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 255, 163, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.45)',
  },
  orbCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00FFA3',
    shadowColor: '#00FFA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 6,
  },
  orbCoreActive: {
    backgroundColor: '#52FFA8',
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  waveformContainer: {
    position: 'absolute',
    bottom: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.22)',
  },
  waveBar: {
    width: 2.5,
    borderRadius: 2,
    backgroundColor: '#00FFA3',
    shadowColor: '#00FFA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
});
