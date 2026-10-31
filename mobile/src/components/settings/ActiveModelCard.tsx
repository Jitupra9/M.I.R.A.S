import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, Cpu } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { AIModelConfig } from '../../types';
import { VoiceService } from '../../services/voiceService';

interface ActiveModelCardProps {
  currentModel: AIModelConfig;
  onOpenPicker: () => void;
}

export const ActiveModelCard: React.FC<ActiveModelCardProps> = ({
  currentModel,
  onOpenPicker,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Cpu size={16} color={colors.primary} />
        <Text style={styles.sectionTitle}>ACTIVE AI FOUNDATION MODEL</Text>
      </View>

      <TouchableOpacity
        style={styles.activeModelSelectorCard}
        onPress={() => {
          VoiceService.triggerHaptic('light');
          onOpenPicker();
        }}
        activeOpacity={0.8}
      >
        <View style={styles.activeModelLeft}>
          <View style={styles.modelIconSquircle}>
            <Cpu size={18} color={colors.primary} />
          </View>
          <View style={styles.activeModelTextCol}>
            <View style={styles.activeModelNameRow}>
              <Text style={styles.activeModelName} numberOfLines={1}>
                {currentModel.name}
              </Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>{currentModel.badge}</Text>
              </View>
            </View>
            <Text style={styles.activeModelSub} numberOfLines={1}>
              {currentModel.provider} • {currentModel.speed} • {currentModel.reasoning} reasoning
            </Text>
          </View>
        </View>

        <View style={styles.switchModelAction}>
          <Text style={styles.switchModelText}>Switch</Text>
          <ChevronDown size={15} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      marginBottom: 22,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 1,
    },
    activeModelSelectorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    activeModelLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      flex: 1,
      minWidth: 0,
      marginRight: 10,
    },
    modelIconSquircle: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    activeModelTextCol: {
      flex: 1,
      minWidth: 0,
    },
    activeModelNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'nowrap',
    },
    activeModelName: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    activeBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    activeBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    activeModelSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    switchModelAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 10,
      paddingVertical: 5.5,
      borderRadius: 8,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.2)',
      flexShrink: 0,
    },
    switchModelText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.primary,
    },
  });
