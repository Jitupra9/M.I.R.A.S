import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { VisionItemData } from '../../types/vision';

interface SnapResultModalProps {
  visible: boolean;
  onClose: () => void;
  currentData: VisionItemData;
  onSetReminder: () => void;
}

export const SnapResultModal: React.FC<SnapResultModalProps> = ({
  visible,
  onClose,
  currentData,
  onSetReminder,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <View style={styles.titleRow}>
              <Check size={18} color={COLORS.primary} />
              <Text style={styles.pickerTitle}>Scan Verified (99% Accuracy)</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>📸 Captured Object:</Text>
            <Text style={styles.infoValue}>{currentData.title}</Text>
          </View>

          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>📋 Key Insight:</Text>
            <Text style={styles.infoValue}>{currentData.pillTag}</Text>
          </View>

          <TouchableOpacity
            style={styles.gotItBtn}
            onPress={() => {
              onClose();
              onSetReminder();
            }}
          >
            <Text style={styles.gotItBtnText}>{currentData.reminderLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#0F1A24',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  infoCardRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  gotItBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  gotItBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
});
