import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { PeriodOption, ReportPeriod } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface PeriodPickerModalProps {
  visible: boolean;
  onClose: () => void;
  reportPeriod: ReportPeriod;
  currentPeriodOptions: PeriodOption[];
  selectedPeriodIndex: number;
  onSelectPeriodIndex: (index: number) => void;
}

export const PeriodPickerModal: React.FC<PeriodPickerModalProps> = ({
  visible,
  onClose,
  reportPeriod,
  currentPeriodOptions,
  selectedPeriodIndex,
  onSelectPeriodIndex,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.pickerModalContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              Select {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Period
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerOptionsList}>
            {currentPeriodOptions.map((opt, idx) => {
              const isSelected = selectedPeriodIndex === idx;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.periodPickOption, isSelected && styles.periodPickOptionSelected]}
                  onPress={() => {
                    VoiceService.triggerHaptic('light');
                    onSelectPeriodIndex(idx);
                    onClose();
                  }}
                >
                  <View style={styles.periodPickLeft}>
                    <Text
                      style={[styles.periodPickLabel, isSelected && styles.periodPickLabelSelected]}
                    >
                      {opt.label}
                    </Text>
                    {opt.subLabel && (
                      <Text style={styles.periodPickSub}>{opt.subLabel}</Text>
                    )}
                  </View>
                  <View style={styles.periodPickRight}>
                    <Text style={styles.periodPickStats}>
                      {opt.totalCompleted} done • {opt.totalPending} pending
                    </Text>
                    {isSelected && <Check size={16} color={colors.primary} />}
                  </View>
                </TouchableOpacity>
              );
            })}
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
    pickerModalContent: {
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
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    pickerOptionsList: {
      gap: 8,
      marginTop: 10,
    },
    periodPickOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    periodPickOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.surfaceCard,
    },
    periodPickLeft: {
      gap: 2,
    },
    periodPickLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    periodPickLabelSelected: {
      color: colors.primary,
    },
    periodPickSub: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
    periodPickRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    periodPickStats: {
      fontSize: 11,
      color: colors.textSecondary,
    },
  });
