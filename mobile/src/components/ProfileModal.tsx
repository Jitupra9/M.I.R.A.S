import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, CheckCircle2, Settings, ChevronRight } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ConnectAccountsSection } from './ConnectAccountsSection';
import { MembershipTierCard } from './profile/MembershipTierCard';
import { ModalSecuritySection } from './profile/ModalSecuritySection';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export interface ProfileAccountItem {
  id: string;
  title: string;
  sub: string;
  iconType: 'mail' | 'cloud' | 'github' | 'slack' | 'notion' | 'spotify' | 'amazon' | 'flight' | 'bank' | 'server';
  isLinked: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, onOpenSettings }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [connectionToast, setConnectionToast] = useState<string | null>(null);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <View>
                <Text style={styles.userName}>Alex Morgan</Text>
                <Text style={styles.userEmail}>alex.morgan@workspace.io</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                onClose();
              }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Account Membership Tier Card */}
            <MembershipTierCard />

            {/* Quick Link: Open Application Settings Tab */}
            {onOpenSettings && (
              <TouchableOpacity
                style={styles.settingsRedirectBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  onClose();
                  onOpenSettings();
                }}
              >
                <View style={styles.settingsIconCircle}>
                  <Settings size={18} color={colors.primary} />
                </View>
                <View style={styles.settingsRedirectTextCol}>
                  <Text style={styles.settingsRedirectTitle}>Application Settings</Text>
                  <Text style={styles.settingsRedirectSub}>Theme, Voice Audio, AI Models & System Chores</Text>
                </View>
                <ChevronRight size={18} color={colors.primary} />
              </TouchableOpacity>
            )}

            {/* Toast for connection feedback */}
            {connectionToast && (
              <View style={styles.toast}>
                <CheckCircle2 size={14} color={colors.buttonTextDark} />
                <Text style={styles.toastText}>{connectionToast}</Text>
              </View>
            )}

            {/* Section 1: Connect Accounts & Services */}
            <View style={styles.accountsSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>CONNECT ACCOUNTS & SERVICES</Text>
              </View>

              <ConnectAccountsSection
                onShowToast={(msg) => {
                  setConnectionToast(msg);
                  setTimeout(() => setConnectionToast(null), 3000);
                }}
              />
            </View>

            {/* Section 2: Security & Authentication */}
            <ModalSecuritySection />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.cardBgElevated,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      maxHeight: '85%',
      padding: 20,
      paddingBottom: 35,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    userName: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollContent: {
      paddingBottom: 20,
    },
    settingsRedirectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surfaceCard,
      borderRadius: 16,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    settingsIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.badgeBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsRedirectTextCol: {
      flex: 1,
    },
    settingsRedirectTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    settingsRedirectSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginBottom: 14,
    },
    toastText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    accountsSection: {
      marginBottom: 8,
    },
    sectionHeaderRow: {
      marginBottom: 12,
    },
    sectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.textMuted,
    },
  });
