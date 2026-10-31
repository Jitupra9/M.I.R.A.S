import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { PeriodOption, ReportPeriod } from '../../types/tasks';

interface TaskAnalyticsCardProps {
  reportPeriod: ReportPeriod;
  onPeriodTypeChange: (type: ReportPeriod) => void;
  selectedPeriodIndex: number;
  currentPeriodOptions: PeriodOption[];
  activePeriodData: PeriodOption;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onOpenPeriodPicker: () => void;
}

export const TaskAnalyticsCard: React.FC<TaskAnalyticsCardProps> = ({
  reportPeriod,
  onPeriodTypeChange,
  selectedPeriodIndex,
  currentPeriodOptions,
  activePeriodData,
  onPrevPeriod,
  onNextPeriod,
  onOpenPeriodPicker,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.graphCard}>
      {/* Header: Title + Period Mode Selector Pills */}
      <View style={styles.graphHeader}>
        <View>
          <Text style={styles.graphTitle}>Task Progress Graph</Text>
          <Text style={styles.graphSub}>Autonomous tasks completed vs pending</Text>
        </View>

        {/* Weekly, Monthly, Yearly Toggle Pills */}
        <View style={styles.periodPillsContainer}>
          {(['weekly', 'monthly', 'yearly'] as ReportPeriod[]).map(period => (
            <TouchableOpacity
              key={period}
              style={[styles.periodPill, reportPeriod === period && styles.periodPillActive]}
              onPress={() => onPeriodTypeChange(period)}
            >
              <Text style={[styles.periodPillText, reportPeriod === period && styles.periodPillTextActive]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Interactive Period Selector Bar */}
      <View style={styles.periodSelectorBar}>
        <TouchableOpacity
          style={[styles.periodNavBtn, selectedPeriodIndex >= currentPeriodOptions.length - 1 && styles.periodNavBtnDisabled]}
          onPress={onPrevPeriod}
          disabled={selectedPeriodIndex >= currentPeriodOptions.length - 1}
        >
          <ChevronLeft
            size={16}
            color={selectedPeriodIndex >= currentPeriodOptions.length - 1 ? colors.textMuted : colors.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.periodCurrentBadge} onPress={onOpenPeriodPicker}>
          <Calendar size={13} color={colors.primary} />
          <Text style={styles.periodCurrentText}>{activePeriodData.label}</Text>
          <ChevronDown size={14} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.periodNavBtn, selectedPeriodIndex <= 0 && styles.periodNavBtnDisabled]}
          onPress={onNextPeriod}
          disabled={selectedPeriodIndex <= 0}
        >
          <ChevronRight
            size={16}
            color={selectedPeriodIndex <= 0 ? colors.textMuted : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Graph Legend */}
      <View style={styles.graphLegendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Completed ({activePeriodData.totalCompleted})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Pending ({activePeriodData.totalPending})</Text>
        </View>
        <View style={styles.legendRateBadge}>
          <Sparkles size={11} color={colors.primary} />
          <Text style={styles.legendRateText}>{activePeriodData.successRate} Success</Text>
        </View>
      </View>

      {/* Visual Bars Container */}
      <View style={styles.barsContainer}>
        {activePeriodData.bars.map((item, idx) => (
          <View key={idx} style={styles.barCol}>
            <View style={styles.barTrack}>
              {(() => {
                const completedHeight = item.height;
                const pendingHeight =
                  item.pending > 0
                    ? Math.min(24, item.pending * (reportPeriod === 'yearly' ? 1.5 : 8))
                    : 0;
                const totalHeight = Math.min(85, completedHeight + pendingHeight);

                if (totalHeight <= 0) return null;

                return (
                  <View
                    style={[
                      styles.combinedBarColumn,
                      {
                        height: totalHeight,
                        backgroundColor: item.pending > 0 ? colors.warning : colors.primary,
                      },
                    ]}
                  >
                    {completedHeight > 0 && (
                      <View
                        style={[
                          styles.barFillCompleted,
                          {
                            height: completedHeight,
                            backgroundColor: colors.primary,
                            opacity: item.isCurrent ? 1 : 0.85,
                          },
                        ]}
                      />
                    )}
                  </View>
                );
              })()}
            </View>
            <Text style={[styles.dayLabel, item.isCurrent && styles.dayLabelToday]}>
              {item.label}
            </Text>
            <Text style={styles.dateLabelMini}>{item.subLabel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    graphCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 14,
    },
    graphHeader: {
      flexDirection: 'column',
      gap: 10,
    },
    graphTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    graphSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    periodPillsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      alignSelf: 'flex-start',
      gap: 4,
    },
    periodPill: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 7,
    },
    periodPillActive: {
      backgroundColor: colors.primary,
    },
    periodPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    periodPillTextActive: {
      color: colors.buttonTextDark,
      fontWeight: '800',
    },
    periodSelectorBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    periodNavBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceCard,
    },
    periodNavBtnDisabled: {
      opacity: 0.35,
    },
    periodCurrentBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    periodCurrentText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    graphLegendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 2,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 10.5,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    legendRateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.surfaceCard,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 8,
    },
    legendRateText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.primary,
    },
    barsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 120,
      paddingTop: 10,
    },
    barCol: {
      alignItems: 'center',
      gap: 5,
      flex: 1,
    },
    barTrack: {
      width: 18,
      height: 85,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: colors.surfaceBorderSubtle,
      borderRadius: 5,
      overflow: 'hidden',
    },
    combinedBarColumn: {
      width: 18,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    barFillCompleted: {
      width: '100%',
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    dayLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textMuted,
    },
    dayLabelToday: {
      color: colors.primary,
      fontWeight: '800',
    },
    dateLabelMini: {
      fontSize: 8.5,
      color: colors.textMuted,
    },
  });
