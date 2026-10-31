import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Smartphone, Lock } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const Security2faCard: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.securitySection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>SECURITY & 2-FACTOR AUTHENTICATION</Text>
      </View>

      <View style={styles.securityCard}>
        <View style={styles.securityRow}>
          <View style={styles.securityIconBox}>
            <Smartphone size={16} color={colors.primary} />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityTitle}>Primary Security Channel</Text>
            <Text style={styles.securitySub}>SMS & WhatsApp Verified (+1 ••• ••• 4920)</Text>
          </View>
          <View style={styles.securityPill}>
            <Text style={styles.securityPillText}>2FA ON</Text>
          </View>
        </View>

        <View style={styles.securityDivider} />

        <View style={styles.securityRow}>
          <View style={styles.securityIconBox}>
            <Lock size={16} color={colors.primary} />
          </View>
          <View style={styles.securityTextCol}>
            <Text style={styles.securityTitle}>Device Vault Encryption</Text>
            <Text style={styles.securitySub}>Hardware AES-256 Biometric Keyring</Text>
          </View>
          <View style={styles.securityPill}>
            <Text style={styles.securityPillText}>SECURE</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    securitySection: {
      gap: 8,
    },
    sectionHeaderRow: {
      paddingHorizontal: 2,
    },
    sectionHeaderTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    securityCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    securityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 4,
    },
    securityIconBox: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    securityTextCol: {
      flex: 1,
      minWidth: 0,
    },
    securityTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    securitySub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    securityPill: {
      paddingHorizontal: 7,
      paddingVertical: 2.5,
      borderRadius: 6,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
      flexShrink: 0,
    },
    securityPillText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.4,
    },
    securityDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      marginVertical: 10,
    },
  });
