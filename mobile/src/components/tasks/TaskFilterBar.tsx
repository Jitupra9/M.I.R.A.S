import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ListFilter } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

export type TaskFilterType = 'all' | 'pending' | 'in_progress' | 'completed';

interface TaskFilterBarProps {
  taskFilter: TaskFilterType;
  onSelectFilter: (filter: TaskFilterType) => void;
  allCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  filteredCount: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  taskFilter,
  onSelectFilter,
  allCount,
  pendingCount,
  inProgressCount,
  completedCount,
  filteredCount,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const filterOptions = [
    { id: 'all' as const, label: 'All Tasks', count: allCount },
    { id: 'pending' as const, label: 'Pending', count: pendingCount, isAmber: true },
    { id: 'in_progress' as const, label: 'In Progress', count: inProgressCount, isBlue: true },
    { id: 'completed' as const, label: 'Completed', count: completedCount, isGreen: true },
  ];

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeaderRow}>
        <View style={styles.filterHeaderLeft}>
          <ListFilter size={14} color={colors.primary} />
          <Text style={styles.filterTitle}>Filter by Status</Text>
        </View>
        <Text style={styles.filterCountLabel}>{filteredCount} tasks found</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterPillsScroll}
      >
        {filterOptions.map(f => {
          const isSelected = taskFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                onSelectFilter(f.id);
              }}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {f.label}
              </Text>
              <View
                style={[
                  styles.filterBadgeCircle,
                  isSelected && styles.filterBadgeCircleActive,
                  f.isAmber && !isSelected && styles.filterBadgeCircleAmber,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    isSelected && styles.filterBadgeTextActive,
                    f.isAmber && !isSelected && styles.filterBadgeTextAmber,
                  ]}
                >
                  {f.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    filterSection: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 10,
    },
    filterHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    filterTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    filterCountLabel: {
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.textMuted,
    },
    filterPillsScroll: {
      gap: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterChipText: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: colors.buttonTextDark,
      fontWeight: '800',
    },
    filterBadgeCircle: {
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 8,
      backgroundColor: colors.surfaceCard,
    },
    filterBadgeCircleActive: {
      backgroundColor: colors.buttonTextDark,
    },
    filterBadgeCircleAmber: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
    },
    filterBadgeText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.textSecondary,
    },
    filterBadgeTextActive: {
      color: colors.primary,
    },
    filterBadgeTextAmber: {
      color: colors.warning,
    },
  });
