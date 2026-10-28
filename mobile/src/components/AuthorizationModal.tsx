import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Shield, X, Lock, CheckCircle2, RefreshCw, ExternalLink, MessageSquare } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

interface AuthorizationModalProps {
  visible: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export const AuthorizationModal: React.FC<AuthorizationModalProps> = ({ visible, onClose, onApprove }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [code, setCode] = useState('492810');
  const [isLiveSync, setIsLiveSync] = useState(true);

  const handleUseSuggestedCode = () => {
    VoiceService.triggerHaptic('light');
    setCode('492810');
  };

  const handleFinish = () => {
    VoiceService.triggerHaptic('success');
    VoiceService.speak("Security code verified. Your Delta flight boarding passes are now confirmed and saved.");
    onApprove();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <View style={styles.shieldWrapper}>
                <Shield size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.title}>Authorization Needed</Text>
                <Text style={styles.subtitle}>AI Agent paused • Human in the loop</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* MIRAS Assistant Speech Bubble */}
          <View style={styles.speechBubble}>
            <View style={styles.speechHeader}>
              <View style={styles.speechAvatar}>
                <Text style={styles.speechAvatarText}>M</Text>
              </View>
              <Text style={styles.speechSender}>MIRAS Assistant</Text>
              <Text style={styles.activePill}>⚡ Active now</Text>
            </View>

            <Text style={styles.speechBody}>
              Hey! I was filling out your airline check-in form for your flight tomorrow, but the airline sent a security code to your phone. Can you enter it below or take over so I can finish this for you?
            </Text>
          </View>

          {/* Simulated Browser View */}
          <View style={styles.browserCard}>
            <View style={styles.browserHeader}>
              <Lock size={12} color={colors.primary} />
              <Text style={styles.browserUrl}>delta.com/flight-checkin</Text>
              <View style={styles.liveSyncBadge}>
                <Text style={styles.liveSyncText}>Live sync</Text>
              </View>
            </View>

            <View style={styles.flightSummaryRow}>
              <Text style={styles.airlineName}>Delta Air Lines</Text>
              <Text style={styles.flightNo}>Flight DL 1842</Text>
            </View>

            <View style={styles.promptBox}>
              <MessageSquare size={16} color={colors.primary} />
              <Text style={styles.promptText}>Enter Security Code sent via text</Text>
              <Text style={styles.phoneHint}>Sent to (***) ***-8291</Text>
            </View>
          </View>

          {/* 6-Digit Code Input & Recent Text Suggestion */}
          <View style={styles.codeSection}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>Security Verification Code</Text>
              {code ? (
                <TouchableOpacity onPress={() => setCode('')}>
                  <Text style={styles.pasteText}>✕ Clear</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleUseSuggestedCode}>
                  <Text style={styles.pasteText}>📋 Use SMS (492810)</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Digits Display */}
            <View style={styles.digitsRow}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View key={i} style={[styles.digitCircle, code[i] ? styles.digitCircleFilled : null]}>
                  <Text style={styles.digitText}>{code[i] || '•'}</Text>
                </View>
              ))}
            </View>

            {/* Option 1: Manual Input Box (when code is from WhatsApp, Email, or not auto-detected) */}
            <View style={styles.manualInputWrapper}>
              <TextInput
                style={styles.manualCodeInput}
                placeholder="Or type 6-digit code manually..."
                placeholderTextColor={colors.textMuted}
                value={code}
                onChangeText={(val) => setCode(val.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Option 2: Auto SMS suggestion chip (Tap to use detected code) */}
            <TouchableOpacity style={styles.smsChip} onPress={handleUseSuggestedCode}>
              <MessageSquare size={14} color={colors.primary} />
              <View style={styles.smsCol}>
                <Text style={styles.smsSender}>Auto-detected SMS from Delta (Just now)</Text>
                <Text style={styles.smsCode}>Code: 492-810</Text>
              </View>
              <Text style={styles.useCodeText}>Use Code</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
            <CheckCircle2 size={18} color={colors.buttonTextDark} />
            <Text style={styles.primaryBtnText}>Let MIRAS Finish This</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
            <ExternalLink size={15} color={colors.textPrimary} />
            <Text style={styles.secondaryBtnText}>Open Page to Do It Myself</Text>
          </TouchableOpacity>

          {/* Privacy Note */}
          <View style={styles.privacyRow}>
            <Shield size={12} color={colors.textMuted} />
            <Text style={styles.privacyText}>Your information is always private and protected.</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.cardBgElevated,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldWrapper: {
    backgroundColor: `${colors.primary}26`,
    padding: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
  },
  speechBubble: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  speechHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  speechAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechAvatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  speechSender: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  activePill: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  speechBody: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  browserCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  browserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  browserUrl: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  liveSyncBadge: {
    backgroundColor: `${colors.primary}26`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveSyncText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.primary,
  },
  flightSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  airlineName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flightNo: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  promptBox: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  promptText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  phoneHint: {
    fontSize: 11,
    color: colors.textMuted,
  },
  codeSection: {
    marginBottom: 16,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pasteText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  digitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  digitCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitCircleFilled: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}1A`,
  },
  digitText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  smsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}14`,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  smsCol: {
    flex: 1,
  },
  smsSender: {
    fontSize: 10.5,
    color: colors.textSecondary,
  },
  smsCode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  manualInputWrapper: {
    marginVertical: 4,
  },
  manualCodeInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
  },
  useCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  privacyText: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
});
