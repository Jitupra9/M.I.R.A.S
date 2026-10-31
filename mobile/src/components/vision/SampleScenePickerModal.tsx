import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ChevronRight, X } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { VisionMode } from '../../types/vision';

interface SampleScenePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: VisionMode) => void;
}

export const SampleScenePickerModal: React.FC<SampleScenePickerModalProps> = ({
  visible,
  onClose,
  onSelectMode,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Sample Camera Scene</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sampleItem}
            onPress={() => {
              onClose();
              onSelectMode('identify');
            }}
          >
            <Text style={styles.sampleEmoji}>💊</Text>
            <View style={styles.sampleTextCol}>
              <Text style={styles.sampleTitle}>Prescription Medicine Bottle</Text>
              <Text style={styles.sampleSub}>Amoxicillin 500mg • Reads dosage & sets reminders</Text>
            </View>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sampleItem}
            onPress={() => {
              onClose();
              onSelectMode('document');
            }}
          >
            <Text style={styles.sampleEmoji}>📄</Text>
            <View style={styles.sampleTextCol}>
              <Text style={styles.sampleTitle}>Residential Lease Contract</Text>
              <Text style={styles.sampleSub}>Extracts rent dates, payment terms & late fees</Text>
            </View>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sampleItem}
            onPress={() => {
              onClose();
              onSelectMode('translate');
            }}
          >
            <Text style={styles.sampleEmoji}>🌐</Text>
            <View style={styles.sampleTextCol}>
              <Text style={styles.sampleTitle}>Spanish Food & Nutrition Label</Text>
              <Text style={styles.sampleSub}>Real-time Spanish to English ingredient translation</Text>
            </View>
            <ChevronRight size={16} color={COLORS.primary} />
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
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  sampleEmoji: {
    fontSize: 24,
  },
  sampleTextCol: {
    flex: 1,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sampleSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
