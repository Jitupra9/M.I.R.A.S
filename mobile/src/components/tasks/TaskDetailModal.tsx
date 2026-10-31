import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Check, CheckCircle2, Clock, X, Zap } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ComprehensiveTask } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface TaskDetailModalProps {
  task: ComprehensiveTask | null;
  onClose: () => void;
  onOpenApprovalModal?: () => void;
  onOpenGroceryModal: () => void;
  onOpenFlightModal: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onOpenApprovalModal,
  onOpenGroceryModal,
  onOpenFlightModal,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={!!task} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.taskDetailSheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.taskDetailHeaderLeft}>
              <View style={styles.taskCategoryPill}>
                <Text style={styles.taskCategoryPillText}>{task?.categoryName.toUpperCase()}</Text>
              </View>
              <Text style={styles.taskDetailIdText}>#{task?.id.slice(-6).toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.taskDetailScroll} showsVerticalScrollIndicator={false}>
            {/* Title & Status Row */}
            <Text style={styles.taskDetailTitle}>{task?.title}</Text>
            <Text style={styles.taskDetailDesc}>{task?.description}</Text>

            {/* Status Badge + Progress Bar */}
            <View style={styles.taskDetailStatusCard}>
              <View style={styles.taskDetailStatusHeader}>
                <Text style={styles.taskDetailStatusLabel}>Current Status & Progress</Text>
                <View
                  style={[
                    styles.statusBadge,
                    task?.status === 'pending' && styles.statusBadgePending,
                    task?.status === 'in_progress' && styles.statusBadgeInProgress,
                    task?.status === 'completed' && styles.statusBadgeCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      task?.status === 'pending' && styles.statusBadgeTextPending,
                      task?.status === 'in_progress' && styles.statusBadgeTextInProgress,
                      task?.status === 'completed' && styles.statusBadgeTextCompleted,
                    ]}
                  >
                    {task?.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.taskDetailProgressBarTrack}>
                <View
                  style={[
                    styles.taskDetailProgressBarFill,
                    { width: `${task?.progress || 0}%` },
                    task?.status === 'pending' && { backgroundColor: colors.warning },
                    task?.status === 'completed' && { backgroundColor: colors.primary },
                  ]}
                />
              </View>
              <Text style={styles.taskDetailProgressSub}>{task?.progress}% Complete</Text>
            </View>

            {/* Timestamps Section */}
            <View style={styles.taskDetailTimelineCard}>
              <Text style={styles.detailSectionHeader}>Timeline & Execution Window</Text>
              <View style={styles.timelineRow}>
                <Clock size={15} color={colors.textMuted} />
                <View style={styles.timelineCol}>
                  <Text style={styles.timelineLabel}>Created At</Text>
                  <Text style={styles.timelineValue}>{task?.createdAt}</Text>
                </View>
              </View>

              <View style={styles.timelineRow}>
                <CheckCircle2
                  size={15}
                  color={task?.completedAt ? colors.primary : colors.textMuted}
                />
                <View style={styles.timelineCol}>
                  <Text style={styles.timelineLabel}>Completed At</Text>
                  <Text
                    style={[
                      styles.timelineValue,
                      task?.completedAt && { color: colors.primary, fontWeight: '700' },
                    ]}
                  >
                    {task?.completedAt ? task.completedAt : 'In Progress (Active Execution)'}
                  </Text>
                </View>
              </View>

              {task?.amount && (
                <View style={styles.timelineRow}>
                  <Zap size={15} color={colors.primary} />
                  <View style={styles.timelineCol}>
                    <Text style={styles.timelineLabel}>Transaction / Settlement Amount</Text>
                    <Text
                      style={[
                        styles.timelineValue,
                        { color: colors.primary, fontWeight: '800' },
                      ]}
                    >
                      {task.amount}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Agent & Tool Details */}
            <View style={styles.taskDetailInfoCard}>
              <Text style={styles.detailSectionHeader}>AI Agent & Tools Orchestration</Text>
              <View style={styles.agentMetaLine}>
                <Text style={styles.agentMetaKey}>Autonomous Agent:</Text>
                <Text style={styles.agentMetaVal}>{task?.agent}</Text>
              </View>
              <View style={styles.agentMetaLine}>
                <Text style={styles.agentMetaKey}>MCP Integration:</Text>
                <Text style={styles.agentMetaVal}>{task?.tool}</Text>
              </View>
              <View style={styles.agentMetaLine}>
                <Text style={styles.agentMetaKey}>System Record:</Text>
                <Text style={styles.agentMetaVal}>{task?.meta}</Text>
              </View>
            </View>

            {/* Step-by-Step Audit Trail */}
            <View style={styles.taskDetailAuditCard}>
              <Text style={styles.detailSectionHeader}>Step-by-Step Audit Trail</Text>
              <View style={styles.auditList}>
                {task?.steps.map((step, idx) => (
                  <View key={idx} style={styles.auditRow}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.auditText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.taskDetailFooter}>
            {task?.status === 'pending' && task.actionType === 'approval' && (
              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  onClose();
                  if (onOpenApprovalModal) onOpenApprovalModal();
                }}
              >
                <Text style={styles.primaryModalBtnText}>Help MIRAS / Enter Code</Text>
              </TouchableOpacity>
            )}

            {task?.status === 'pending' && task.actionType === 'grocery' && (
              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  onClose();
                  onOpenGroceryModal();
                }}
              >
                <Text style={styles.primaryModalBtnText}>Review & Place Order ($34.18)</Text>
              </TouchableOpacity>
            )}

            {task?.status === 'in_progress' && task.actionType === 'flight' && (
              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  onClose();
                  onOpenFlightModal();
                }}
              >
                <Text style={styles.primaryModalBtnText}>Inspect Flight Options</Text>
              </TouchableOpacity>
            )}

            {task?.status === 'completed' && (
              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  onClose();
                }}
              >
                <Check size={16} color={colors.buttonTextDark} />
                <Text style={styles.primaryModalBtnText}>Done</Text>
              </TouchableOpacity>
            )}
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
    taskDetailSheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 34,
      maxHeight: '90%',
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    taskDetailHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
    taskDetailIdText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
    },
    taskDetailScroll: {
      marginVertical: 12,
    },
    taskDetailTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    taskDetailDesc: {
      fontSize: 12.5,
      color: colors.textSecondary,
      lineHeight: 18,
      marginTop: 6,
      marginBottom: 14,
    },
    taskDetailStatusCard: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 12,
      gap: 8,
    },
    taskDetailStatusHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskDetailStatusLabel: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.textPrimary,
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
    taskDetailProgressBarTrack: {
      height: 6,
      backgroundColor: colors.surfaceBorderSubtle,
      borderRadius: 3,
      overflow: 'hidden',
    },
    taskDetailProgressBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    taskDetailProgressSub: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
      alignSelf: 'flex-end',
    },
    taskDetailTimelineCard: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 12,
      gap: 10,
    },
    detailSectionHeader: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: 0.3,
      marginBottom: 4,
    },
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    timelineCol: {
      flex: 1,
    },
    timelineLabel: {
      fontSize: 10,
      color: colors.textMuted,
      fontWeight: '600',
    },
    timelineValue: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 1,
    },
    taskDetailInfoCard: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 12,
      gap: 8,
    },
    agentMetaLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    agentMetaKey: {
      fontSize: 11,
      color: colors.textMuted,
      fontWeight: '600',
    },
    agentMetaVal: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.textPrimary,
      maxWidth: '65%',
      textAlign: 'right',
    },
    taskDetailAuditCard: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 12,
      gap: 8,
    },
    auditList: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 16,
    },
    auditRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    stepNumberBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumberText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
    },
    auditText: {
      fontSize: 12,
      color: colors.textSecondary,
      flex: 1,
    },
    taskDetailFooter: {
      paddingTop: 10,
    },
    primaryModalBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 13,
    },
    primaryModalBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
