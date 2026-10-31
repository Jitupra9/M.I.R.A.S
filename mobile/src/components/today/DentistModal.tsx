import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, Car } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface DentistModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DentistModal: React.FC<DentistModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Dentist Appointment & Uber</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>CLINIC APPOINTMENT</Text>
            <Text style={styles.infoBoxValue}>Dr. Miller Family Dental Clinic</Text>
            <Text style={styles.infoBoxSub}>300 Medical Plaza, Suite 402 • 03:00 PM</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>SCHEDULED UBER RIDE</Text>
            <Text style={styles.infoBoxValue}>Uber Comfort • Pickup 02:40 PM</Text>
            <Text style={styles.infoBoxSub}>Driver: Michael (Silver Toyota Camry • 7XYZ99)</Text>
            <Text style={[styles.infoBoxSub, { color: colors.primary, marginTop: 4 }]}>
              Estimated Fare: $18.40 (Charged to Corporate card)
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryModalBtn}
            onPress={() => {
              VoiceService.triggerHaptic('medium');
              onClose();
            }}
          >
            <Car size={16} color={colors.buttonTextDark} />
            <Text style={styles.primaryModalBtnText}>Confirm Pickup Spot</Text>
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
