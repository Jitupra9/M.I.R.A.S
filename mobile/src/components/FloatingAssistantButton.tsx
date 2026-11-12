import React, { useRef, useEffect, useMemo } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, ThemeColors } from '../theme/colors';
import { MirasLogo } from './MirasLogo';
import { VoiceService } from '../services/voiceService';

interface FloatingAssistantButtonProps {
  onPress: () => void;
}

const BUTTON_SIZE = 56;
const EDGE_MARGIN = 12;

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const boundsRef = useRef({ minX: EDGE_MARGIN, maxX: 300, minY: 60, maxY: 600 });
  boundsRef.current = {
    minX: EDGE_MARGIN,
    maxX: Math.max(EDGE_MARGIN, screenWidth - BUTTON_SIZE - EDGE_MARGIN),
    minY: Math.max(insets.top + 12, 16),
    maxY: Math.max(insets.top + 80, screenHeight - insets.bottom - 88 - BUTTON_SIZE),
  };

  const clampPosition = (x: number, y: number) => {
    const { minX, maxX, minY, maxY } = boundsRef.current;
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const initialPos = clampPosition(
    screenWidth - BUTTON_SIZE - 18,
    screenHeight - insets.bottom - 156
  );

  const pan = useRef(new Animated.ValueXY(initialPos)).current;
  const currentPos = useRef(initialPos);
  const dragStartPos = useRef(initialPos);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  // Keep button inside screen bounds if window resizes
  useEffect(() => {
    const clamped = clampPosition(currentPos.current.x, currentPos.current.y);
    currentPos.current = clamped;
    pan.setValue(clamped);
  }, [screenWidth, screenHeight, insets.top, insets.bottom, pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStartPos.current = { ...currentPos.current };
        Animated.spring(scaleAnim, {
          toValue: 0.92,
          useNativeDriver: true,
          friction: 6,
        }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        const next = clampPosition(
          dragStartPos.current.x + gestureState.dx,
          dragStartPos.current.y + gestureState.dy
        );
        currentPos.current = next;
        pan.setValue(next);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }).start();

        const movedDistance = Math.hypot(gestureState.dx, gestureState.dy);
        if (movedDistance < 6) {
          VoiceService.triggerHaptic('medium');
          onPressRef.current();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      accessibilityRole="button"
      accessibilityLabel="Open Voice Assistant"
      style={[
        styles.floatingBtn,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
        Platform.OS === 'web' ? ({ cursor: 'grab', userSelect: 'none', touchAction: 'none' } as any) : null,
      ]}
    >
      <MirasLogo size={28} glow glowColor={colors.primary} />
    </Animated.View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    floatingBtn: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      borderRadius: BUTTON_SIZE / 2,
      backgroundColor: colors.cardBgElevated,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 80,
      elevation: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
  });
