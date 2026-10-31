import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight, Check, CheckCircle2, Clock } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ComprehensiveTask } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface TaskCardItemProps {
  item: ComprehensiveTask;
  onSelectTask: (task: ComprehensiveTask) => void;
  onOpenApprovalModal?: () => void;
  onOpenGroceryModal: () => void;
  onOpenFlightModal: () => void;
}

export const TaskCardItem: React.FC<TaskCardItemProps> = ({
  item,
  onSelectTask,
  onOpenApprovalModal,
  onOpenGroceryModal,
  onOpenFlightModal,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isPending = item.status === 'pending';
  const isInProgress = item.status === 'in_progress';
  const isCompleted = item.status === 'completed';

  return (
    <TouchableOpacity
      style={[styles.taskCard, isPending && styles.taskCardPending]}
      activeOpacity={0.8}
      onPress={() => {
        VoiceService.triggerHaptic('light');
        onSelectTask(item);
      }}
    >
      {/* Card Header: Category + Status Badge */}
      <View style={styles.taskCardTopRow}>
        <View style={styles.taskCategoryPill}>
          <Text style={styles.taskCategoryPillText}>{item.categoryName.toUpperCase()}</Text>
        </View>

        {/* Status Pill */}
        <View
          style={[
            styles.statusBadge,
            isPending && styles.statusBadgePending,
            isInProgress && styles.statusBadgeInProgress,
            isCompleted && styles.statusBadgeCompleted,
          ]}
        >
          <View
            style={[
              styles.statusDotSmall,
              isPending && styles.statusDotSmallPending,
              isInProgress && styles.statusDotSmallInProgress,
              isCompleted && styles.statusDotSmallCompleted,
            ]}
          />
          <Text
            style={[
              styles.statusBadgeText,
              isPending && styles.statusBadgeTextPending,
              isInProgress && styles.statusBadgeTextInProgress,
              isCompleted && styles.statusBadgeTextCompleted,
            ]}
          >
            {item.statusLabel}
          </Text>
        </View>
      </View>

      {/* Title & Description */}
      <Text style={styles.taskCardTitle}>{item.title}</Text>
      <Text style={styles.taskCardDesc} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Progress Bar */}
      <View style={styles.taskProgressBarTrack}>
        <View
          style={[
            styles.taskProgressBarFill,
            { width: `${item.progress}%` },
            isPending && { backgroundColor: colors.warning },
            isCompleted && { backgroundColor: colors.primary },
          ]}
        />
      </View>

      {/* Metadata & Timestamps */}
      <View style={styles.taskTimestampsRow}>
        <View style={styles.timestampItem}>
          <Clock size={11} color={colors.textMuted} />
          <Text style={styles.timestampText}>Created: {item.createdAt}</Text>
        </View>

        {item.completedAt ? (
          <View style={styles.timestampItem}>
            <CheckCircle2 size={11} color={colors.primary} />
            <Text style={[styles.timestampText, { color: colors.primary }]}>
              Done: {item.completedAt}
            </Text>
          </View>
        ) : (
          <Text style={styles.progressPercentLabel}>{item.progress}%</Text>
        )}
      </View>

      {/* Action Row / Footer */}
      <View style={styles.taskCardFooter}>
        <Text style={styles.taskMetaText} numberOfLines={1}>
          {item.amount ? `${item.amount} • ` : ''}
          {item.agent}
        </Text>

        {isPending && item.actionType === 'approval' && (
          <TouchableOpacity
            style={styles.actionBtnSmall}
            onPress={() => {
              VoiceService.triggerHaptic('medium');
              if (onOpenApprovalModal) onOpenApprovalModal();
            }}
          >
            <Text style={styles.actionBtnSmallText}>Help MIRAS</Text>
            <ArrowRight size={12} color={colors.buttonTextDark} />
          </TouchableOpacity>
        )}

        {isPending && item.actionType === 'grocery' && (
          <TouchableOpacity
            style={styles.actionBtnSmall}
            onPress={() => {
              VoiceService.triggerHaptic('medium');
              onOpenGroceryModal();
            }}
          >
            <Text style={styles.actionBtnSmallText}>Approve Cart</Text>
            <ArrowRight size={12} color={colors.buttonTextDark} />
          </TouchableOpacity>
        )}

        {isInProgress && item.actionType === 'flight' && (
          <TouchableOpacity
            style={styles.actionBtnSmallSubtle}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              onOpenFlightModal();
            }}
          >
            <Text style={styles.actionBtnSmallSubtleText}>View Fares</Text>
          </TouchableOpacity>
        )}

        {isCompleted && (
          <View style={styles.verifiedCheckBadge}>
            <Check size={11} color={colors.primary} />
            <Text style={styles.verifiedCheckText}>Verified</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    taskCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
      overflow: 'hidden',
    },
    taskCardPending: {
      borderColor: 'rgba(245, 158, 11, 0.35)',
      backgroundColor: colors.cardBgSubtle,
    },
    taskCardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskCategoryPill: {
      backgroundColor: colors.surfaceCard,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    taskCategoryPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: colors.surfaceCard,
    },
    statusBadgePending: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
    },
    statusBadgeInProgress: {
      backgroundColor: colors.surfaceCard,
    },
    statusBadgeCompleted: {
      backgroundColor: 'rgba(0, 229, 153, 0.12)',
    },
    statusDotSmall: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.textMuted,
    },
    statusDotSmallPending: {
      backgroundColor: colors.warning,
    },
    statusDotSmallInProgress: {
      backgroundColor: colors.primary,
    },
    statusDotSmallCompleted: {
      backgroundColor: colors.success,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    statusBadgeTextPending: {
      color: colors.warning,
    },
    statusBadgeTextInProgress: {
      color: colors.primary,
    },
    statusBadgeTextCompleted: {
      color: colors.success,
    },
    taskCardTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    taskCardDesc: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    taskProgressBarTrack: {
      height: 4,
      backgroundColor: colors.surfaceBorderSubtle,
      borderRadius: 2,
      overflow: 'hidden',
      marginTop: 2,
    },
    taskProgressBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    taskTimestampsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 2,
    },
    timestampItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    timestampText: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
    progressPercentLabel: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
    },
    taskCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorderSubtle,
    },
    taskMetaText: {
      fontSize: 10.5,
      color: colors.textMuted,
      flex: 1,
      marginRight: 8,
    },
    actionBtnSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    actionBtnSmallText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    actionBtnSmallSubtle: {
      backgroundColor: colors.surfaceCard,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    actionBtnSmallSubtleText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
    },
    verifiedCheckBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    verifiedCheckText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
    },
  });
