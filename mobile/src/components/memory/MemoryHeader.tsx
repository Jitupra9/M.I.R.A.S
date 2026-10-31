import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface MemoryHeaderProps {
  onOpenProfile: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({ onOpenProfile }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>MIRAS</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={onOpenProfile}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {/* Main Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What MIRAS Remembers</Text>
        <Text style={styles.subtitle}>
          Things I've learned about you to help you better.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    brandText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 1,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
