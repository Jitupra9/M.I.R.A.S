import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const TransparencyCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.transparentCard}>
      <View style={styles.sparkleIconWrapper}>
        <Sparkles size={16} color={colors.primary} />
      </View>
      <View style={styles.transparentDetails}>
        <Text style={styles.transparentTitle}>Always transparent</Text>
        <Text style={styles.transparentSubtitle}>
          You are always in control. Tap edit to update details, or ask MIRAS to forget anytime.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    transparentCard: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: `${colors.primary}0D`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: `${colors.primary}26`,
    },
    sparkleIconWrapper: {
      marginTop: 2,
    },
    transparentDetails: {
      flex: 1,
    },
    transparentTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 2,
    },
    transparentSubtitle: {
      fontSize: 11.5,
      lineHeight: 16,
      color: colors.textSecondary,
    },
  });
