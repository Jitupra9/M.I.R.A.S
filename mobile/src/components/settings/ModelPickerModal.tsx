import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { AIModelConfig } from '../../types';
import { VoiceService } from '../../services/voiceService';

interface ModelPickerModalProps {
  visible: boolean;
  onClose: () => void;
  models: AIModelConfig[];
  currentModel: AIModelConfig;
  onSelectModel: (model: AIModelConfig) => void;
}

export const ModelPickerModal: React.FC<ModelPickerModalProps> = ({
  visible,
  onClose,
  models,
  currentModel,
  onSelectModel,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContentSheet} onStartShouldSetResponder={() => true}>
          {/* Sheet Handle */}
          <View style={styles.sheetHandle} />

          <View style={styles.modalHeaderRow}>
            <View style={styles.modalHeaderTextCol}>
              <Text style={styles.modalTitle}>Choose AI Model</Text>
              <Text style={styles.modalSubtitle}>
                Select routing foundation model for MIRAS reasoning
              </Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose} activeOpacity={0.7}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalModelList}>
            {models.map(model => {
              const isSelected = currentModel.id === model.id;
              return (
                <TouchableOpacity
                  key={model.id}
                  style={[styles.modalModelCard, isSelected && styles.modalModelCardSelected]}
                  onPress={() => {
                    VoiceService.triggerHaptic('medium');
                    onSelectModel(model);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalModelTopRow}>
                    <View style={styles.modalModelNameGroup}>
                      <Text
                        style={[styles.modalModelName, isSelected && { color: colors.primary }]}
                      >
                        {model.name}
                      </Text>
                      <View
                        style={[styles.modalBadge, isSelected && styles.modalBadgeSelected]}
                      >
                        <Text
                          style={[
                            styles.modalBadgeText,
                            isSelected && { color: colors.primary },
                          ]}
                        >
                          {model.badge}
                        </Text>
                      </View>
                    </View>

                    {/* Selection Radio Indicator */}
                    <View
                      style={[
                        styles.radioOuterCircle,
                        isSelected && styles.radioOuterCircleActive,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInnerDot} />}
                    </View>
                  </View>

                  <Text style={styles.modalModelDescription}>{model.description}</Text>

                  <View style={styles.modalModelMetaRow}>
                    <Text style={styles.modalMetaItem}>Provider: {model.provider}</Text>
                    <Text style={styles.modalMetaDivider}>•</Text>
                    <Text style={styles.modalMetaItem}>⚡ {model.speed}</Text>
                    <Text style={styles.modalMetaDivider}>•</Text>
                    <Text style={styles.modalMetaItem}>🧠 {model.reasoning}</Text>
                    {isSelected && (
                      <View style={styles.modalActiveIndicator}>
                        <Check size={12} color={colors.primary} />
                        <Text style={styles.modalActiveIndicatorText}>CURRENT</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    modalContentSheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceBorder,
      alignSelf: 'center',
      marginBottom: 14,
    },
    modalHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    modalHeaderTextCol: {
      flex: 1,
      paddingRight: 12,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    modalSubtitle: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modalCloseBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalModelList: {
      gap: 12,
    },
    modalModelCard: {
      backgroundColor: colors.cardBgElevated,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    modalModelCardSelected: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(16, 185, 129, 0.06)',
    },
    modalModelTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    modalModelNameGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
      flexWrap: 'wrap',
    },
    modalModelName: {
      fontSize: 14.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    modalBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
    },
    modalBadgeSelected: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    modalBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    radioOuterCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    radioOuterCircleActive: {
      borderColor: colors.primary,
    },
    radioInnerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    modalModelDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
      marginBottom: 10,
    },
    modalModelMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorder,
    },
    modalMetaItem: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '600',
    },
    modalMetaDivider: {
      fontSize: 10,
      color: colors.textMuted,
    },
    modalActiveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginLeft: 'auto',
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    modalActiveIndicatorText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.primary,
    },
  });
