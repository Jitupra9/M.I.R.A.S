import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const UserIdentityCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.identityCard}>
      <View style={styles.identityHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>A</Text>
        </View>
        <View style={styles.identityTextCol}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              Alex Morgan
            </Text>
            <View style={styles.activeTierPill}>
              <Text style={styles.activeTierPillText}>OWNER</Text>
            </View>
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>
            alex.morgan@workspace.io
          </Text>
        </View>
      </View>

      <View style={styles.membershipDivider} />

      <View style={styles.workspaceInfo}>
        <Text style={styles.workspaceTitle}>Personal Assistant Vault</Text>
        <Text style={styles.workspaceDesc}>
          Private autonomous agent with local offline speech processing & encrypted device vault.
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>Created: Oct 2024</Text>
          <Text style={styles.metaItem}>•</Text>
          <Text style={styles.metaItem}>Key: #USR-98421</Text>
          <Text style={styles.metaItem}>•</Text>
          <Text style={[styles.metaItem, { color: colors.primary }]}>Active</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    identityCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    identityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarInitial: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    identityTextCol: {
      flex: 1,
      minWidth: 0,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'nowrap',
    },
    userName: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    activeTierPill: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      flexShrink: 0,
    },
    activeTierPillText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.4,
    },
    userEmail: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    membershipDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginVertical: 12,
    },
    workspaceInfo: {
      gap: 4,
    },
    workspaceTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    workspaceDesc: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 15,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
      flexWrap: 'wrap',
    },
    metaItem: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
  });
