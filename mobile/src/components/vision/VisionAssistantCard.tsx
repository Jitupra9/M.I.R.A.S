import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Check, Shield } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { VisionItemData } from '../../types/vision';

interface VisionAssistantCardProps {
  currentData: VisionItemData;
  reminderSet: boolean;
  onSetReminder: () => void;
  onSecondaryAction: () => void;
}

export const VisionAssistantCard: React.FC<VisionAssistantCardProps> = ({
  currentData,
  reminderSet,
  onSetReminder,
  onSecondaryAction,
}) => {
  return (
    <View style={styles.assistantCard}>
      <View style={styles.assistantHeaderRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.mText}>M</Text>
        </View>
        <View style={styles.assistantTitleCol}>
          <View style={styles.assistantNameRow}>
            <Text style={styles.assistantName}>MIRAS</Text>
            <View style={styles.speakingTag}>
              <Text style={styles.speakingTagText}>Speaking</Text>
            </View>
          </View>
          <Text style={styles.assistantSubtext}>Real-Time Vision Intelligence</Text>
        </View>

        <View style={styles.equalizer}>
          <View style={[styles.eqBar, { height: 16 }]} />
          <View style={[styles.eqBar, { height: 24 }]} />
          <View style={[styles.eqBar, { height: 12 }]} />
        </View>
      </View>

      <Text style={styles.speechQuote}>"{currentData.speechAnalysis}"</Text>

      {/* Action Button 1: Primary Action */}
      <TouchableOpacity
        style={[styles.primaryActionBtn, reminderSet && styles.primaryActionBtnDone]}
        onPress={onSetReminder}
      >
        {reminderSet ? (
          <Check size={16} color={COLORS.buttonTextDark} />
        ) : (
          <Bell size={16} color={COLORS.buttonTextDark} />
        )}
        <Text style={styles.primaryActionBtnText}>
          {reminderSet ? 'Action Completed ✓' : currentData.reminderLabel}
        </Text>
      </TouchableOpacity>

      {/* Action Button 2: Secondary Action */}
      <TouchableOpacity style={styles.secondaryActionBtn} onPress={onSecondaryAction}>
        <Shield size={15} color={COLORS.primary} />
        <Text style={styles.secondaryActionBtnText}>{currentData.secondaryLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  assistantCard: {
    backgroundColor: '#0F1A24',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    gap: 12,
  },
  assistantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  assistantTitleCol: {
    flex: 1,
  },
  assistantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assistantName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  speakingTag: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  speakingTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  assistantSubtext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  equalizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  eqBar: {
    width: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
  speechQuote: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  primaryActionBtnDone: {
    backgroundColor: '#059669',
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  secondaryActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
