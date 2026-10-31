import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart2, CheckSquare, Zap, CheckCircle2, Clock } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface TaskOverviewHeaderProps {
  subTab: 'progress_overview' | 'tasks';
  onSelectSubTab: (tab: 'progress_overview' | 'tasks') => void;
  completedCount: number;
  pendingCount: number;
  totalTasksCount: number;
}

export const TaskOverviewHeader: React.FC<TaskOverviewHeaderProps> = ({
  subTab,
  onSelectSubTab,
  completedCount,
  pendingCount,
  totalTasksCount,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* SECTION A: Sub-Tabs Selector */}
      <View style={styles.sectionAGroup}>
        <View style={styles.subTabRow}>
          {/* Tab 1: Progress Overview */}
          <TouchableOpacity
            style={[
              styles.subTabBtn,
              styles.subTabBtnProgress,
              subTab === 'progress_overview' && styles.subTabBtnActive,
            ]}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              onSelectSubTab('progress_overview');
            }}
            activeOpacity={0.8}
          >
            <BarChart2
              size={15}
              color={subTab === 'progress_overview' ? colors.primary : colors.textMuted}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.subTabBtnText,
                subTab === 'progress_overview' && styles.subTabBtnTextActive,
              ]}
            >
              Progress Overview
            </Text>
            <View
              style={[
                styles.tabBadgeGreen,
                subTab === 'progress_overview' && styles.tabBadgeGreenActive,
              ]}
            >
              <Text style={styles.tabBadgeGreenText}>{completedCount}</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 2: Tasks */}
          <TouchableOpacity
            style={[
              styles.subTabBtn,
              styles.subTabBtnTasks,
              subTab === 'tasks' && styles.subTabBtnActive,
            ]}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              onSelectSubTab('tasks');
            }}
            activeOpacity={0.8}
          >
            <CheckSquare
              size={15}
              color={subTab === 'tasks' ? colors.primary : colors.textMuted}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.subTabBtnText,
                subTab === 'tasks' && styles.subTabBtnTextActive,
              ]}
            >
              Tasks
            </Text>
            <View
              style={[
                styles.tabBadgeAmber,
                subTab === 'tasks' && styles.tabBadgeAmberActive,
              ]}
            >
              <Text style={styles.tabBadgeAmberText}>{totalTasksCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Autonomous Execution Rate Banner */}
        <View style={styles.automationRateCard}>
          <View style={styles.automationRateLeft}>
            <View style={styles.metricIconWrapBlue}>
              <Zap size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.automationRateTitle}>Autonomous Execution</Text>
              <Text style={styles.automationRateSub}>Quiet background AI orchestration</Text>
            </View>
          </View>
          <View style={styles.automationRateRight}>
            <Text style={styles.automationRateNumber}>95%</Text>
            <Text style={styles.automationRateLabel}>Automation Rate</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionDividerGap} />

      {/* SECTION B: Completed Tasks & Pending Actions Quick Metrics */}
      <View style={styles.sectionBGroup}>
        <View style={styles.metricsRowPair}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrapGreen}>
              <CheckCircle2 size={16} color={colors.primary} />
            </View>
            <Text style={styles.metricNumber}>{completedCount}</Text>
            <Text style={styles.metricLabel}>Completed Tasks</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIconWrapAmber}>
              <Clock size={16} color={colors.warning} />
            </View>
            <Text style={[styles.metricNumber, { color: colors.warning }]}>
              {pendingCount}
            </Text>
            <Text style={styles.metricLabel}>Pending Actions</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionDividerGap} />
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    container: {
      width: '100%',
    },
    sectionAGroup: {
      gap: 10,
    },
    subTabRow: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 6,
    },
    subTabBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      paddingHorizontal: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'transparent',
      gap: 5,
    },
    subTabBtnProgress: {
      flex: 1.35,
    },
    subTabBtnTasks: {
      flex: 1,
    },
    subTabBtnActive: {
      backgroundColor: isDay ? '#FFFFFF' : 'rgba(0, 229, 153, 0.12)',
      borderWidth: 1,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },
    subTabBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
      letterSpacing: -0.3,
    },
    subTabBtnTextActive: {
      color: colors.primary,
      fontWeight: '800',
    },
    tabBadgeGreen: {
      backgroundColor: colors.surfaceCard,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 8,
      minWidth: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBadgeGreenActive: {
      backgroundColor: isDay ? 'rgba(5, 150, 105, 0.15)' : 'rgba(0, 229, 153, 0.25)',
    },
    tabBadgeGreenText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.primary,
    },
    tabBadgeAmber: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 8,
      minWidth: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBadgeAmberActive: {
      backgroundColor: 'rgba(245, 158, 11, 0.3)',
    },
    tabBadgeAmberText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.warning,
    },
    automationRateCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    automationRateLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    automationRateTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    automationRateSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    automationRateRight: {
      alignItems: 'flex-end',
      paddingLeft: 8,
    },
    automationRateNumber: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
    },
    automationRateLabel: {
      fontSize: 9.5,
      fontWeight: '700',
      color: colors.textMuted,
    },
    sectionDividerGap: {
      height: 14,
    },
    sectionBGroup: {
      gap: 10,
    },
    metricsRowPair: {
      flexDirection: 'row',
      gap: 12,
    },
    metricCard: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      alignItems: 'center',
      gap: 4,
    },
    metricIconWrapGreen: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricIconWrapAmber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricIconWrapBlue: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricNumber: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    metricLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};
