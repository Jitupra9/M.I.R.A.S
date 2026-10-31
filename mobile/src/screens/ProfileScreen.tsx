import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  Settings,
  ChevronDown,
  ChevronUp,
  Shield,
  Smartphone,
  Lock,
  CheckCircle2,
  Layers,
  Laptop,
  Download,
  RefreshCw,
  ChevronRight,
  LogOut,
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
  // Single option container for platforms (collapsed by default, click to open)
  const [isPlatformsExpanded, setIsPlatformsExpanded] = useState(false);
  const [otherSessionsTerminated, setOtherSessionsTerminated] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    VoiceService.triggerHaptic('medium');
    showToast('Exporting encrypted personal archive (JSON)...');
  };

  const handleResetMemory = () => {
    VoiceService.triggerHaptic('medium');
    showToast('Agent contextual recall memory cleared');
  };

  const handleTerminateOtherSessions = () => {
    VoiceService.triggerHaptic('medium');
    setOtherSessionsTerminated(true);
    showToast('Signed out of 1 other device session');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation Bar with Back Button and Settings Icon */}
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
            <ArrowLeft size={17} color={colors.primary} />
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
            accessibilityLabel="Open Settings"
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

      {/* 1. USER PERSONAL IDENTITY & OWNER CARD */}
      <View style={styles.identityCard}>
        <View style={styles.identityHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>A</Text>
          </View>
          <View style={styles.identityTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>Alex Morgan</Text>
              <View style={styles.activeTierPill}>
                <Text style={styles.activeTierPillText}>OWNER</Text>
              </View>
            </View>
            <Text style={styles.userEmail} numberOfLines={1}>alex.morgan@workspace.io</Text>
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

      {/* 2. ACCOUNT INTEGRATIONS ("Connect Platforms") - Responsive & Aligned for Small Devices */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>ACCOUNT INTEGRATIONS</Text>
        </View>

        <View style={styles.platformsOptionWrapper}>
          <TouchableOpacity
            style={[
              styles.platformsTriggerCard,
              isPlatformsExpanded && styles.platformsTriggerCardActive,
            ]}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              setIsPlatformsExpanded(!isPlatformsExpanded);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.platformsIconBox}>
              <Layers size={18} color={colors.primary} />
            </View>

            <View style={styles.platformsTextCol}>
              <Text style={styles.platformsTitle} numberOfLines={1}>
                Connect Platforms
              </Text>
              <Text style={styles.platformsSubtitle} numberOfLines={1}>
                {isPlatformsExpanded
                  ? 'Tap to collapse categories'
                  : 'Link Google, Slack, GitHub & APIs'}
              </Text>
            </View>

            <View style={styles.platformsTriggerRight}>
              <View style={styles.platformsBadge}>
                <Text style={styles.platformsBadgeText}>4 CATEGORIES</Text>
              </View>
              <View style={styles.chevronBox}>
                {isPlatformsExpanded ? (
                  <ChevronUp size={16} color={colors.primary} />
                ) : (
                  <ChevronDown size={16} color={colors.textSecondary} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Expanded Categories Container */}
          {isPlatformsExpanded && (
            <View style={styles.platformsExpandedBody}>
              <ConnectAccountsSection onShowToast={showToast} />
            </View>
          )}
        </View>
      </View>

      {/* 3. ACTIVE SESSIONS & CONNECTED DEVICES */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>CONNECTED DEVICES & SESSIONS</Text>
        </View>

        <View style={styles.sessionsCard}>
          {/* Current Device Session */}
          <View style={styles.sessionRow}>
            <View style={styles.sessionIconBox}>
              <Smartphone size={16} color={colors.primary} />
            </View>
            <View style={styles.sessionTextCol}>
              <Text style={styles.sessionDeviceName}>Pixel 8 Pro (This Phone)</Text>
              <Text style={styles.sessionDeviceSub}>Android 14 • MIRAS App v2.4 • Active Now</Text>
            </View>
            <View style={styles.sessionCurrentBadge}>
              <Text style={styles.sessionCurrentBadgeText}>THIS DEVICE</Text>
            </View>
          </View>

          {!otherSessionsTerminated && (
            <>
              <View style={styles.sessionDivider} />

              {/* Second Device Session */}
              <View style={styles.sessionRow}>
                <View style={[styles.sessionIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.1)' }]}>
                  <Laptop size={16} color="#06B6D4" />
                </View>
                <View style={styles.sessionTextCol}>
                  <Text style={styles.sessionDeviceName}>MacBook Pro 16"</Text>
                  <Text style={styles.sessionDeviceSub}>macOS Sonoma • Chrome Gateway • 18m ago</Text>
                </View>
                <View style={[styles.sessionCurrentBadge, { backgroundColor: 'rgba(6, 182, 212, 0.12)', borderColor: 'rgba(6, 182, 212, 0.25)' }]}>
                  <Text style={[styles.sessionCurrentBadgeText, { color: '#06B6D4' }]}>ONLINE</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.terminateSessionsBtn}
                onPress={handleTerminateOtherSessions}
                activeOpacity={0.8}
              >
                <LogOut size={13} color={colors.textSecondary} />
                <Text style={styles.terminateSessionsBtnText}>Sign Out All Other Sessions</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* 4. SECURITY & 2-FACTOR AUTHENTICATION */}
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

      {/* 5. PERSONAL VAULT & PRIVACY CONTROLS */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>PERSONAL VAULT & PRIVACY</Text>
        </View>

        <View style={styles.privacyCard}>
          <TouchableOpacity
            style={styles.privacyOptionRow}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.privacyIconBox}>
              <Download size={15} color={colors.primary} />
            </View>
            <View style={styles.privacyTextCol}>
              <Text style={styles.privacyTitle}>Backup & Export Vault</Text>
              <Text style={styles.privacySub}>Download encrypted JSON backup of personal data & tasks</Text>
            </View>
            <ChevronRight size={15} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.privacyDivider} />

          <TouchableOpacity
            style={styles.privacyOptionRow}
            onPress={handleResetMemory}
            activeOpacity={0.7}
          >
            <View style={styles.privacyIconBox}>
              <RefreshCw size={15} color={colors.warning} />
            </View>
            <View style={styles.privacyTextCol}>
              <Text style={styles.privacyTitle}>Clear Assistant Recall Memory</Text>
              <Text style={styles.privacySub}>Reset contextual agent memories while keeping platforms connected</Text>
            </View>
            <ChevronRight size={15} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Local Device Vault Guarantee Box */}
      <View style={styles.guaranteeBox}>
        <Shield size={16} color={colors.primary} />
        <Text style={styles.guaranteeText}>
          All personal credentials, API keys and 2FA authentication tokens remain strictly encrypted inside your local device vault.
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
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 40,
      gap: 16,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginBottom: 2,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 5,
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

    // Identity Card
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

    // Connect Platforms Option Container
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
    platformsOptionWrapper: {
      gap: 10,
    },
    platformsTriggerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    platformsTriggerCardActive: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    platformsIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    platformsTextCol: {
      flex: 1,
      minWidth: 0,
    },
    platformsTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    platformsSubtitle: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    platformsTriggerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
    },
    platformsBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    platformsBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    chevronBox: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    platformsExpandedBody: {
      paddingTop: 4,
    },

    // Active Sessions Card
    sessionsCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    sessionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    sessionIconBox: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    sessionTextCol: {
      flex: 1,
      minWidth: 0,
    },
    sessionDeviceName: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sessionDeviceSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    sessionCurrentBadge: {
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    sessionCurrentBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
    },
    sessionDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    terminateSessionsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginTop: 2,
    },
    terminateSessionsBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    // Security Section
    securitySection: {
      gap: 8,
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

    // Privacy & Data Controls
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

    // Guarantee Note
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
