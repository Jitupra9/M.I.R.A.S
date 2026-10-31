import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { MemoryCategory } from '../../types/memory';

interface TeachMemoryModalProps {
  visible: boolean;
  editingId: string | null;
  category: MemoryCategory;
  text: string;
  onChangeCategory: (cat: MemoryCategory) => void;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export const TeachMemoryModal: React.FC<TeachMemoryModalProps> = ({
  visible,
  editingId,
  category,
  text,
  onChangeCategory,
  onChangeText,
  onSave,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {editingId ? 'Edit Memory' : 'Teach MIRAS Something'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSub}>
            MIRAS uses this to customize reservations, flights, and dietary alerts.
          </Text>

          {/* Category Selector */}
          <View style={styles.catSelectorRow}>
            <TouchableOpacity
              style={[styles.catOption, category === 'food' && styles.catOptionActive]}
              onPress={() => onChangeCategory('food')}
            >
              <Text
                style={[
                  styles.catOptionText,
                  category === 'food' && styles.catOptionTextActive,
                ]}
              >
                🥗 Food
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.catOption, category === 'work' && styles.catOptionActive]}
              onPress={() => onChangeCategory('work')}
            >
              <Text
                style={[
                  styles.catOptionText,
                  category === 'work' && styles.catOptionTextActive,
                ]}
              >
                💼 Work
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.catOption, category === 'family' && styles.catOptionActive]}
              onPress={() => onChangeCategory('family')}
            >
              <Text
                style={[
                  styles.catOptionText,
                  category === 'family' && styles.catOptionTextActive,
                ]}
              >
                ❤️ Family
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="e.g. Always reserve booth seating for dinner..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={onChangeText}
            multiline
            autoFocus
          />

          <TouchableOpacity
            style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
            onPress={onSave}
            disabled={!text.trim()}
          >
            <Check size={16} color={text.trim() ? colors.buttonTextDark : colors.textMuted} />
            <Text
              style={[styles.saveBtnText, !text.trim() && styles.saveBtnTextDisabled]}
            >
              {editingId ? 'Update Memory' : 'Save Memory'}
            </Text>
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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      justifyContent: 'flex-end',
    },
    sheetContent: {
      backgroundColor: colors.cardBgElevated,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: `${colors.primary}40`,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    modalSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 14,
    },
    catSelectorRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 14,
    },
    catOption: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    catOptionActive: {
      backgroundColor: `${colors.primary}26`,
      borderColor: colors.primary,
    },
    catOptionText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    catOptionTextActive: {
      color: colors.primary,
    },
    modalInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 14,
      padding: 14,
      fontSize: 14,
      color: colors.textPrimary,
      minHeight: 80,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 16,
    },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 13,
    },
    saveBtnDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    saveBtnText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    saveBtnTextDisabled: {
      color: colors.textMuted,
    },
  });
