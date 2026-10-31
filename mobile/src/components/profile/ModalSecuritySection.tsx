import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Smartphone, Lock, Shield } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

export const ModalSecuritySection: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>SECURITY & 2-FACTOR AUTHENTICATION</Text>

        <View style={styles.securityRow}>
          <Smartphone size={16} color={colors.primary} />
          <View style={styles.securityTextCol}>
            <Text style={styles.securityRowTitle}>Primary Security Channel</Text>
            <Text style={styles.securityRowSub}>SMS & WhatsApp Verified (+1 ••• ••• 4920)</Text>
          </View>
          <Text style={styles.securityActiveBadge}>2FA ON</Text>
        </View>

        <View style={styles.securityRow}>
          <Lock size={16} color={colors.primary} />
          <View style={styles.securityTextCol}>
            <Text style={styles.securityRowTitle}>Device Vault Encryption</Text>
            <Text style={styles.securityRowSub}>Hardware AES-256 Biometric Keyring</Text>
          </View>
          <Text style={styles.securityActiveBadge}>SECURE</Text>
        </View>
      </View>

      {/* Security Guarantee Note */}
      <View style={styles.securityBox}>
        <Shield size={16} color={colors.primary} />
        <Text style={styles.securityText}>
          All personal credentials and 2FA SMS security codes remain strictly encrypted inside your local device vault.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 16,
      marginTop: 16,
    },
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.textMuted,
      marginBottom: 12,
    },
    securityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    securityTextCol: {
      flex: 1,
    },
    securityRowTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    securityRowSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },
    securityActiveBadge: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    securityBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.surfaceCard,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 10,
    },
    securityText: {
      flex: 1,
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
    },
  });
