import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Settings,
  ChevronRight,
  Shield,
  Smartphone,
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  User,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ConnectAccountsSection } from '../components/ConnectAccountsSection';
import { MirasLogo } from '../components/MirasLogo';

interface ProfileScreenProps {
  onBack?: () => void;
  onOpenSettings?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onOpenSettings }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Top Navigation Bar with Back Button */}
      <View style={styles.topBar}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              onBack();
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={18} color={colors.primary} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <MirasLogo size={20} glow glowColor={colors.primary} />
            <Text style={styles.brandText}>MIRAS</Text>
          </View>
        )}

        {onOpenSettings ? (
          <TouchableOpacity
            style={styles.settingsShortcutBtn}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              onOpenSettings();
            }}
            activeOpacity={0.7}
          >
            <Settings size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      {/* Floating Status Toast */}
      {toastMessage && (
        <View style={styles.toast}>
          <CheckCircle2 size={14} color={colors.buttonTextDark} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* User Identity & Membership Card */}
      <View style={styles.identityCard}>
        <View style={styles.identityHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>A</Text>
          </View>
          <View style={styles.identityTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Alex Morgan</Text>
              <View style={styles.activeTierPill}>
                <Text style={styles.activeTierPillText}>WORKSPACE PRO</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>alex.morgan@workspace.io</Text>
          </View>
        </View>

        <View style={styles.membershipDivider} />

        <View style={styles.workspaceInfo}>
          <Text style={styles.workspaceTitle}>Alex's MIRAS Workspace</Text>
          <Text style={styles.workspaceDesc}>
            Unlimited multi-agent reasoning, local offline speech processing & encrypted device vault.
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Member since: Oct 2024</Text>
            <Text style={styles.metaItem}>•</Text>
            <Text style={styles.metaItem}>ID: #USR-98421</Text>
            <Text style={styles.metaItem}>•</Text>
            <Text style={[styles.metaItem, { color: colors.primary }]}>Active</Text>
          </View>
        </View>
      </View>

      {/* Quick Link to Application Settings */}
      {onOpenSettings && (
        <TouchableOpacity
          style={styles.settingsRedirectCard}
          onPress={() => {
            VoiceService.triggerHaptic('medium');
            onOpenSettings();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.settingsIconCircle}>
            <Settings size={18} color={colors.primary} />
          </View>
          <View style={styles.settingsTextCol}>
            <Text style={styles.settingsTitle}>Application Settings</Text>
            <Text style={styles.settingsSubtitle}>Theme, Voice Audio, AI Models & System Chores</Text>
          </View>
          <ChevronRight size={18} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* Main Section: Connect Accounts & Services (Category-Based Layout) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>CONNECT ACCOUNTS & SERVICES</Text>
        </View>

        <ConnectAccountsSection onShowToast={showToast} />
      </View>

      {/* Security & 2-Factor Authentication Section */}
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

      {/* Device Vault Encryption Guarantee Box */}
      <View style={styles.guaranteeBox}>
        <Shield size={16} color={colors.primary} />
        <Text style={styles.guaranteeText}>
          All personal credentials and 2FA SMS security codes remain strictly encrypted inside your local device vault.
        </Text>
      </View>
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 40,
      gap: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      marginBottom: 2,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    backBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    brandText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.8,
    },
    topBarTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: 0.2,
    },
    settingsShortcutBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    toastText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    identityCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    identityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    identityTextCol: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    },
    userName: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    activeTierPill: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
    },
    activeTierPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.4,
    },
    userEmail: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    membershipDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginVertical: 14,
    },
    workspaceInfo: {
      gap: 4,
    },
    workspaceTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    workspaceDesc: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
    metaItem: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
    settingsRedirectCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    settingsIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    settingsTextCol: {
      flex: 1,
    },
    settingsTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    settingsSubtitle: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    sectionContainer: {
      gap: 10,
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
    securitySection: {
      gap: 10,
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
    },
    securityTextCol: {
      flex: 1,
    },
    securityTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    securitySub: {
      fontSize: 11,
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
    },
    securityPillText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.4,
    },
    securityDivider: {
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
