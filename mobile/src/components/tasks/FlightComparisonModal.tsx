import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface FlightComparisonModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FlightComparisonModal: React.FC<FlightComparisonModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Chicago Flights Comparison</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.flightSub}>Departing Friday, Oct 18 • Nonstop to ORD</Text>

          <View style={styles.flightOptionsList}>
            <View style={[styles.flightOptionCard, styles.flightOptionCardBest]}>
              <View style={styles.flightOptionHeader}>
                <Text style={styles.flightAirline}>United Airlines #UA 442</Text>
                <Text style={styles.flightPriceBest}>$214 (Lowest)</Text>
              </View>
              <Text style={styles.flightTimes}>08:15 AM (JFK) ➔ 10:10 AM (ORD) • 2h 55m</Text>
              <Text style={styles.flightSeatNote}>✓ Window seat available in Row 12</Text>

              <TouchableOpacity
                style={styles.bookOptionBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('success');
                  onClose();
                }}
              >
                <Text style={styles.bookOptionBtnText}>Book United ($214)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.flightOptionCard}>
              <View style={styles.flightOptionHeader}>
                <Text style={styles.flightAirline}>Southwest #WN 812</Text>
                <Text style={styles.flightPrice}>$230</Text>
              </View>
              <Text style={styles.flightTimes}>11:30 AM (LGA) ➔ 01:25 PM (MDW) • 2h 55m</Text>
            </View>

            <View style={styles.flightOptionCard}>
              <View style={styles.flightOptionHeader}>
                <Text style={styles.flightAirline}>American #AA 1902</Text>
                <Text style={styles.flightPrice}>$248</Text>
              </View>
              <Text style={styles.flightTimes}>02:00 PM (JFK) ➔ 03:55 PM (ORD) • 2h 55m</Text>
            </View>
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
      maxHeight: '90%',
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    flightSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 14,
    },
    flightOptionsList: {
      gap: 10,
    },
    flightOptionCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    flightOptionCardBest: {
      borderColor: colors.primaryBorder,
      backgroundColor: colors.surfaceCard,
    },
    flightOptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    flightAirline: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    flightPriceBest: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
    },
    flightPrice: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    flightTimes: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    flightSeatNote: {
      fontSize: 11,
      color: colors.primary,
      marginBottom: 10,
    },
    bookOptionBtn: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: 'center',
    },
    bookOptionBtnText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
