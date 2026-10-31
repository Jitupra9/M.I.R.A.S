import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const MembershipTierCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.tierCard}>
      <View style={styles.tierHeaderRow}>
        <View style={styles.tierPill}>
          <Text style={styles.tierPillText}>WORKSPACE PRO</Text>
        </View>
        <Text style={styles.tierStatus}>Active Tier</Text>
      </View>
      <Text style={styles.tierTitle}>Alex's MIRAS Workspace</Text>
      <Text style={styles.tierSub}>
        Unlimited multi-agent reasoning, local offline speech processing & encrypted device vault.
      </Text>
      <View style={styles.tierMetaRow}>
        <Text style={styles.tierMetaText}>Member since: Oct 2024</Text>
        <Text style={styles.tierMetaText}>• ID: #USR-98421</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tierCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    tierHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    tierPill: {
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    tierPillText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    tierStatus: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    tierTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    tierSub: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    tierMetaRow: {
      flexDirection: 'row',
      gap: 8,
    },
    tierMetaText: {
      fontSize: 11,
      color: colors.textMuted,
    },
  });
