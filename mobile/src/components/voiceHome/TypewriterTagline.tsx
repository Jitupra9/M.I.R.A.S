import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { AI_SUGGESTIONS } from '../../data/voiceHomeData';

export const TypewriterTagline: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor toggle every 500ms
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Character-by-character typewriter loop
  useEffect(() => {
    const currentSentence = AI_SUGGESTIONS[index];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text.length < currentSentence.length) {
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length + 1));
        }, 75);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length - 1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % AI_SUGGESTIONS.length);
        }, 320);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <View style={styles.typewriterContainer}>
      <Text style={[styles.taglineText, { color: colors.primary }]}>
        {text}
        <Text
          style={[
            styles.blinkingCursor,
            { color: colors.primary, opacity: cursorVisible ? 1 : 0 },
          ]}
        >
          |
        </Text>
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    typewriterContainer: {
      minHeight: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    taglineText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: colors.primary,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    blinkingCursor: {
      color: colors.primary,
      fontWeight: '700',
      fontSize: 14,
    },
  });
