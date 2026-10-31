import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const GreetingBanner: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.greetingCard}>
      <View style={styles.dateWeatherRow}>
        <Text style={styles.dateText}>THURSDAY, OCT 17</Text>
        <View style={styles.weatherBadge}>
          <Sun size={13} color={colors.primary} />
          <Text style={styles.weatherText}>72°F Breezy</Text>
        </View>
      </View>

      <Text style={styles.greetingTitle}>Good morning, Alex</Text>
      <Text style={styles.cadenceText}>
        You have <Text style={{ color: colors.primary, fontWeight: '700' }}>4 events</Text> and{' '}
        <Text style={{ color: colors.primary, fontWeight: '700' }}>2 reminders</Text> today. Your morning cadence looks comfortable and relaxed.
      </Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    greetingCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    dateWeatherRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    dateText: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.textMuted,
    },
    weatherBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.surfaceCard,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
    },
    weatherText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.primary,
    },
    greetingTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.4,
      marginBottom: 6,
    },
    cadenceText: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
    },
  });
