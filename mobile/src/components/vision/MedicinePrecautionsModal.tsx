import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Shield, X } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

interface MedicinePrecautionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MedicinePrecautionsModal: React.FC<MedicinePrecautionsModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <View style={styles.titleRow}>
              <Shield size={18} color={COLORS.primary} />
              <Text style={styles.pickerTitle}>Amoxicillin Precautions & Info</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>🍽️ When to take:</Text>
            <Text style={styles.infoValue}>Take at the start of a meal to avoid stomach upset.</Text>
          </View>

          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>⏱️ Schedule:</Text>
            <Text style={styles.infoValue}>
              Every 12 hours (e.g. 8:00 AM breakfast and 7:00 PM dinner).
            </Text>
          </View>

          <View style={styles.infoCardRow}>
            <Text style={styles.infoLabel}>⚠️ Course completion:</Text>
            <Text style={styles.infoValue}>
              Always finish the full 10-day prescription even if feeling better.
            </Text>
          </View>

          <TouchableOpacity style={styles.gotItBtn} onPress={onClose}>
            <Text style={styles.gotItBtnText}>Understood</Text>
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
