import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, FileText, Plane, ShoppingCart, Zap } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ComprehensiveTask, TaskCategory } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface TaskCategoriesGridProps {
  allTasks: ComprehensiveTask[];
  onSelectCategory: (categoryId: TaskCategory) => void;
}

export const TaskCategoriesGrid: React.FC<TaskCategoriesGridProps> = ({
  allTasks,
  onSelectCategory,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const categoriesMeta = useMemo(
    () => [
      {
        id: 'travel' as TaskCategory,
        name: 'Travel & Flights',
        Icon: Plane,
        color: colors.primary,
      },
      {
        id: 'utilities' as TaskCategory,
        name: 'Utility Bills',
        Icon: Zap,
        color: colors.primary,
      },
      {
        id: 'groceries' as TaskCategory,
        name: 'Groceries & Home',
        Icon: ShoppingCart,
        color: colors.primary,
      },
      {
        id: 'career' as TaskCategory,
        name: 'Career & Drive Sync',
        Icon: FileText,
        color: colors.primary,
      },
    ],
    [colors]
  );

  return (
    <View style={styles.categorySection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Progress by Category</Text>
        <Text style={styles.categoryHintText}>Tap any category to view tasks</Text>
      </View>

      <View style={styles.categoryGrid}>
        {categoriesMeta.map(cat => {
          const catTasks = allTasks.filter(t => t.category === cat.id);
          const catCompleted = catTasks.filter(t => t.status === 'completed').length;
          const percent =
            catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 100;
          const CatIcon = cat.Icon;

          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              activeOpacity={0.75}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                onSelectCategory(cat.id);
              }}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.catIconWrap}>
                  <CatIcon size={14} color={colors.primary} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryPercent}>{percent}%</Text>
                <ChevronRight size={14} color={colors.textMuted} />
              </View>

              <View style={styles.miniProgressTrack}>
                <View style={[styles.miniProgressFill, { width: `${percent}%` }]} />
              </View>

              <View style={styles.categoryFooterRow}>
                <Text style={styles.categoryMeta}>
                  {catCompleted} of {catTasks.length} completed
                </Text>
                <Text style={styles.catTapHint}>View {catTasks.length} tasks ➔</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    categorySection: {
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
    categoryHintText: {
      fontSize: 10.5,
      color: colors.primary,
      fontWeight: '600',
    },
    categoryGrid: {
      gap: 10,
    },
    categoryItem: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    catIconWrap: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryName: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
    },
    categoryPercent: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primary,
    },
    miniProgressTrack: {
      height: 5,
      backgroundColor: colors.surfaceBorderSubtle,
      borderRadius: 3,
      overflow: 'hidden',
    },
    miniProgressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    categoryFooterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryMeta: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    catTapHint: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
  });
