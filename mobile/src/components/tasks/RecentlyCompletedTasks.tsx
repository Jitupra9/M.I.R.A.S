import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, ChevronRight } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ComprehensiveTask } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface RecentlyCompletedTasksProps {
  tasks: ComprehensiveTask[];
  completedCount: number;
  onSelectTask: (task: ComprehensiveTask) => void;
}

export const RecentlyCompletedTasks: React.FC<RecentlyCompletedTasksProps> = ({
  tasks,
  completedCount,
  onSelectTask,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const recentCompleted = useMemo(
    () => tasks.filter(t => t.status === 'completed').slice(0, 4),
    [tasks]
  );

  if (recentCompleted.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recently Completed</Text>
        <Text style={styles.countBadge}>{completedCount} verified</Text>
      </View>

      {recentCompleted.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.finishedCard}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            onSelectTask(item);
          }}
        >
          <View style={styles.finishedIconCircle}>
            <CheckCircle2 size={15} color={colors.primary} />
          </View>
          <View style={styles.finishedCol}>
            <Text style={styles.finishedTitle}>{item.title}</Text>
            <Text style={styles.finishedSub}>
              {item.completedAt || item.createdAt} • Tap for full details
            </Text>
          </View>
          {item.amount && <Text style={styles.finishedPrice}>{item.amount}</Text>}
          <ChevronRight size={14} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 10,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    countBadge: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    finishedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    finishedIconCircle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    finishedCol: {
      flex: 1,
    },
    finishedTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    finishedSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    finishedPrice: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primary,
    },
  });
