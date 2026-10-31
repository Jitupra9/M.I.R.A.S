import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, Phone, MapPin } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface LunchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LunchModal: React.FC<LunchModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Lunch with Sarah</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>RESTAURANT & RESERVATION</Text>
            <Text style={styles.infoBoxValue}>Greenwood Cafe & Bistro</Text>
            <Text style={styles.infoBoxSub}>142 Main Street • Table for 2</Text>
            <Text style={[styles.infoBoxSub, { color: colors.primary, marginTop: 4 }]}>
              Confirmation Code: #GW-9821
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>DIETARY PREFERENCES SAVED</Text>
            <Text style={styles.infoBoxSub}>• MIRAS alerted kitchen: Shellfish & peanut allergy noted</Text>
            <Text style={styles.infoBoxSub}>• Quiet booth requested</Text>
          </View>

          <View style={styles.sheetBtnRow}>
            <TouchableOpacity
              style={styles.secondaryModalBtn}
              onPress={() => {
                VoiceService.triggerHaptic('light');
              }}
            >
              <Phone size={15} color={colors.primary} />
              <Text style={styles.secondaryModalBtnText}>Call Cafe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => {
                VoiceService.triggerHaptic('medium');
                onClose();
              }}
            >
              <MapPin size={15} color={colors.buttonTextDark} />
              <Text style={styles.primaryModalBtnText}>Directions (8 min walk)</Text>
            </TouchableOpacity>
          </View>
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
    sheetBtnRow: {
      flexDirection: 'row',
      gap: 10,
    },
    secondaryModalBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginTop: 8,
    },
    secondaryModalBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },
    primaryModalBtn: {
      flex: 1,
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
