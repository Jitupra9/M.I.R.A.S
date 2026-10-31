import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Download, ChevronRight, RefreshCw, Shield } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface PrivacyControlsCardProps {
  onExportData: () => void;
  onResetMemory: () => void;
}

export const PrivacyControlsCard: React.FC<PrivacyControlsCardProps> = ({
  onExportData,
  onResetMemory,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>PERSONAL VAULT & PRIVACY</Text>
      </View>

      <View style={styles.privacyCard}>
        <TouchableOpacity
          style={styles.privacyOptionRow}
          onPress={onExportData}
          activeOpacity={0.7}
        >
          <View style={styles.privacyIconBox}>
            <Download size={15} color={colors.primary} />
          </View>
          <View style={styles.privacyTextCol}>
            <Text style={styles.privacyTitle}>Backup & Export Vault</Text>
            <Text style={styles.privacySub}>
              Download encrypted JSON backup of personal data & tasks
            </Text>
          </View>
          <ChevronRight size={15} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.privacyDivider} />

        <TouchableOpacity
          style={styles.privacyOptionRow}
          onPress={onResetMemory}
          activeOpacity={0.7}
        >
          <View style={styles.privacyIconBox}>
            <RefreshCw size={15} color={colors.warning} />
          </View>
          <View style={styles.privacyTextCol}>
            <Text style={styles.privacyTitle}>Clear Assistant Recall Memory</Text>
            <Text style={styles.privacySub}>
              Reset contextual agent memories while keeping platforms connected
            </Text>
          </View>
          <ChevronRight size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Local Device Vault Guarantee Box */}
      <View style={styles.guaranteeBox}>
        <Shield size={16} color={colors.primary} />
        <Text style={styles.guaranteeText}>
          All personal credentials, API keys and 2FA authentication tokens remain strictly encrypted inside your local device vault.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionContainer: {
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
    privacyCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    privacyOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 4,
    },
    privacyIconBox: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    privacyTextCol: {
      flex: 1,
      minWidth: 0,
    },
    privacyTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    privacySub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    privacyDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      marginVertical: 10,
    },
    guaranteeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    guaranteeText: {
      flex: 1,
      fontSize: 10.5,
      color: colors.textSecondary,
      lineHeight: 15,
    },
  });
