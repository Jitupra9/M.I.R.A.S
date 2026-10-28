import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import {
  X,
  User,
  Shield,
  CreditCard,
  Cloud,
  CheckCircle2,
  Settings,
  ChevronRight,
  Lock,
  Mail,
  Smartphone,
  ExternalLink,
  Plus,
  Code2,
  MessageSquare,
  FileText,
  Headphones,
  ShoppingCart,
  Plane,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export interface ProfileAccountItem {
  id: string;
  title: string;
  sub: string;
  iconType: 'mail' | 'cloud' | 'github' | 'slack' | 'notion' | 'spotify' | 'amazon' | 'flight' | 'bank';
  isLinked: boolean;
}

// Initial accounts displayed in the profile
const INITIAL_CONNECTED_ACCOUNTS: ProfileAccountItem[] = [
  {
    id: 'google-workspace',
    title: 'Google Workspace',
    sub: 'alex.morgan@workspace.io • Gmail, Drive, Calendar',
    iconType: 'mail',
    isLinked: true,
  },
  {
    id: 'delta-skymiles',
    title: 'Delta SkyMiles Account',
    sub: '#DL-9428148 • Medallion Priority',
    iconType: 'cloud',
    isLinked: true,
  },
];

// Additional supported services and accounts that users can connect
const SUPPORTED_ADDITIONAL_SERVICES: ProfileAccountItem[] = [
  {
    id: 'github',
    title: 'GitHub Developer Platform',
    sub: 'alexmorgan-ai • Repositories, PR triage & CI/CD',
    iconType: 'github',
    isLinked: false,
  },
  {
    id: 'slack',
    title: 'Slack Team Workspace',
    sub: 'Acme AI Engineering • Standups, alerts & channels',
    iconType: 'slack',
    isLinked: false,
  },
  {
    id: 'notion',
    title: 'Notion Knowledge Base',
    sub: 'Personal Wiki • System specs, roadmaps & notes',
    iconType: 'notion',
    isLinked: false,
  },
  {
    id: 'spotify',
    title: 'Spotify Audio Streaming',
    sub: 'Focus playlists, background beats & podcasts',
    iconType: 'spotify',
    isLinked: false,
  },
  {
    id: 'amazon',
    title: 'Amazon Prime & Whole Foods',
    sub: 'Automated household grocery replenishment',
    iconType: 'amazon',
    isLinked: false,
  },
  {
    id: 'united',
    title: 'United MileagePlus',
    sub: '#UA-882194 • Star Alliance Gold check-in',
    iconType: 'flight',
    isLinked: false,
  },
  {
    id: 'banking',
    title: 'Chase Banking & Financial Vault',
    sub: 'Automated receipt verification & budget checks',
    iconType: 'bank',
    isLinked: false,
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, onOpenSettings }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Connected accounts list state (persists additions during session)
  const [connectedAccounts, setConnectedAccounts] = useState<ProfileAccountItem[]>(INITIAL_CONNECTED_ACCOUNTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [connectionToast, setConnectionToast] = useState<string | null>(null);

  const renderAccountIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case 'mail':
        return <Mail size={16} color={color} />;
      case 'cloud':
        return <Cloud size={16} color={color} />;
      case 'github':
        return <Code2 size={16} color={color} />;
      case 'slack':
        return <MessageSquare size={16} color={color} />;
      case 'notion':
        return <FileText size={16} color={color} />;
      case 'spotify':
        return <Headphones size={16} color={color} />;
      case 'amazon':
        return <ShoppingCart size={16} color={color} />;
      case 'flight':
        return <Plane size={16} color={color} />;
      case 'bank':
        return <CreditCard size={16} color={color} />;
      default:
        return <Cloud size={16} color={color} />;
    }
  };

  const isServiceConnected = (serviceId: string) => {
    return connectedAccounts.some(acc => acc.id === serviceId);
  };

  const handleConnectService = (service: ProfileAccountItem) => {
    VoiceService.triggerHaptic('success');
    if (isServiceConnected(service.id)) {
      // Disconnect if already linked
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== service.id));
      setConnectionToast(`Disconnected ${service.title}`);
    } else {
      // Connect new service
      const newConnected: ProfileAccountItem = { ...service, isLinked: true };
      setConnectedAccounts(prev => [...prev, newConnected]);
      setConnectionToast(`Connected ${service.title}`);
    }
    setTimeout(() => setConnectionToast(null), 3000);
  };

  return (
    <>
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

              {/* Section 1: Connected Services & Integrations with ADD button (Item 1) */}
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeader}>CONNECTED ACCOUNTS & MCP</Text>
                  <TouchableOpacity
                    style={styles.addAccountBtn}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setIsAddModalOpen(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Plus size={12} color={colors.buttonTextDark} />
                    <Text style={styles.addAccountBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>

                {connectedAccounts.map(account => (
                  <View key={account.id} style={styles.accountRow}>
                    <View style={styles.accountIconBox}>
                      {renderAccountIcon(account.iconType, colors.primary)}
                    </View>
                    <View style={styles.accountInfoCol}>
                      <Text style={styles.accountTitle}>{account.title}</Text>
                      <Text style={styles.accountSub}>{account.sub}</Text>
                    </View>
                    <View style={styles.connectedBadge}>
                      <CheckCircle2 size={12} color={colors.success} />
                      <Text style={styles.connectedBadgeText}>Linked</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Section 2: Security & Authentication */}
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
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          MODAL: ADD & CONNECT ACCOUNTS / SERVICES (Item 1)
          ======================================================== */}
      <Modal visible={isAddModalOpen} transparent animationType="slide" onRequestClose={() => setIsAddModalOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.addSheet}>
            {/* Sheet Header */}
            <View style={styles.addSheetHeader}>
              <View style={styles.addSheetHeaderLeft}>
                <Sparkles size={18} color={colors.primary} />
                <View>
                  <Text style={styles.addSheetTitle}>Connect Accounts & Services</Text>
                  <Text style={styles.addSheetSub}>Link tools and MCP providers to Alex's MIRAS Workspace</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsAddModalOpen(false)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* List of Available Services */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.addServicesScroll} contentContainerStyle={styles.addServicesScrollContent}>
              {SUPPORTED_ADDITIONAL_SERVICES.map(service => {
                const connected = isServiceConnected(service.id);
                return (
                  <View key={service.id} style={[styles.serviceOptionCard, connected && styles.serviceOptionCardConnected]}>
                    <View style={styles.accountIconBox}>
                      {renderAccountIcon(service.iconType, colors.primary)}
                    </View>
                    <View style={styles.serviceOptionCol}>
                      <Text style={styles.serviceOptionTitle}>{service.title}</Text>
                      <Text style={styles.serviceOptionSub}>{service.sub}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.connectActionBtn, connected && styles.connectActionBtnLinked]}
                      onPress={() => handleConnectService(service)}
                      activeOpacity={0.8}
                    >
                      {connected ? (
                        <>
                          <Check size={12} color={colors.success} />
                          <Text style={styles.connectActionBtnLinkedText}>Linked</Text>
                        </>
                      ) : (
                        <>
                          <Plus size={12} color={colors.buttonTextDark} />
                          <Text style={styles.connectActionBtnText}>Connect</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>

            {/* Footer Button */}
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => setIsAddModalOpen(false)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 20,
  },
  tierCard: {
    backgroundColor: colors.badgeBg,
    borderRadius: 16,
    padding: 16,
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
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tierPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.buttonTextDark,
    letterSpacing: 0.5,
  },
  tierStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  tierTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tierSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  tierMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  tierMetaText: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  settingsRedirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 12,
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
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingsRedirectSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  toastText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.buttonTextDark,
  },

  // Section with ADD button header (Item 1)
  section: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  addAccountBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  accountIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.badgeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfoCol: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  accountSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  connectedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },

  // Security Section
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
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
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.badgeBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  securityText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    flex: 1,
  },

  // ============================================
  // ADD SERVICES SHEET STYLES (Item 1)
  // ============================================
  addSheet: {
    backgroundColor: colors.cardBgElevated,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    maxHeight: '85%',
    padding: 20,
    paddingBottom: 34,
  },
  addSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  addSheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  addSheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addSheetSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addServicesScroll: {
    maxHeight: 380,
  },
  addServicesScrollContent: {
    gap: 10,
    paddingBottom: 12,
  },
  serviceOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  serviceOptionCardConnected: {
    borderColor: colors.primaryBorder,
  },
  serviceOptionCol: {
    flex: 1,
  },
  serviceOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  serviceOptionSub: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  connectActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectActionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  connectActionBtnLinked: {
    backgroundColor: colors.badgeBg,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  connectActionBtnLinkedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  doneBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
});
