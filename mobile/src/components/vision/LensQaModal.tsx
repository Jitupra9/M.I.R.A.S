import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Sparkles, Volume2, X } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { LensQuestionItem } from '../../types/vision';

interface LensQaModalProps {
  visible: boolean;
  onClose: () => void;
  questions: LensQuestionItem[];
  selectedQaAnswer: LensQuestionItem | null;
  onAskQuestion: (item: LensQuestionItem) => void;
}

export const LensQaModal: React.FC<LensQaModalProps> = ({
  visible,
  onClose,
  questions,
  selectedQaAnswer,
  onAskQuestion,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <View style={styles.titleRow}>
              <Sparkles size={18} color={COLORS.primary} />
              <Text style={styles.pickerTitle}>Talk to Lens • Ask MIRAS</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.instructionText}>
            Tap any common question below or speak to MIRAS:
          </Text>

          {questions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.sampleItem,
                selectedQaAnswer?.q === item.q && styles.sampleItemSelected,
              ]}
              onPress={() => onAskQuestion(item)}
            >
              <View style={styles.sampleTextCol}>
                <Text style={styles.sampleTitle}>❓ {item.q}</Text>
                {selectedQaAnswer?.q === item.q && (
                  <Text style={styles.answerText}>💡 {item.a}</Text>
                )}
              </View>
              <Volume2 size={16} color={COLORS.primary} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.gotItBtn} onPress={onClose}>
            <Text style={styles.gotItBtnText}>Close</Text>
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
  instructionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
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
  sampleItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
  },
  sampleTextCol: {
    flex: 1,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  answerText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 6,
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
