import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Clock, X, ExternalLink } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';
import { MEETING_ATTENDEES } from '../../data/todayData';

interface MeetingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Team Product Sync</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetMetaRow}>
            <Clock size={14} color={colors.primary} />
            <Text style={styles.sheetMetaText}>10:30 AM – 11:15 AM (In 35 mins)</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>GOOGLE MEET LINK</Text>
            <Text style={styles.infoBoxValue}>meet.google.com/miras-prod-sync</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>CONFIRMED ATTENDEES ({MEETING_ATTENDEES.length})</Text>
            {MEETING_ATTENDEES.map((att, index) => (
              <Text key={index} style={styles.infoBoxSub}>
                {att}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryModalBtn}
            onPress={() => {
              VoiceService.triggerHaptic('success');
              onClose();
            }}
          >
            <ExternalLink size={16} color={colors.buttonTextDark} />
            <Text style={styles.primaryModalBtnText}>Launch Meeting Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'flex-end',
    },
    sheetContent: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    sheetMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14,
    },
    sheetMetaText: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.primary,
    },
    infoBox: {
      backgroundColor: colors.background,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    infoBoxLabel: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.8,
      color: colors.textMuted,
      marginBottom: 4,
    },
    infoBoxValue: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    infoBoxSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 17,
    },
    primaryModalBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 13,
      marginTop: 8,
    },
    primaryModalBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
