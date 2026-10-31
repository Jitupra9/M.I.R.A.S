import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, Plane, ShoppingCart, X, Zap } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ComprehensiveTask, TaskCategory } from '../../types/tasks';
import { VoiceService } from '../../services/voiceService';

interface CategoryTasksModalProps {
  selectedCategory: TaskCategory | null;
  onClose: () => void;
  allTasks: ComprehensiveTask[];
  onSelectTask: (task: ComprehensiveTask) => void;
}

export const CategoryTasksModal: React.FC<CategoryTasksModalProps> = ({
  selectedCategory,
  onClose,
  allTasks,
  onSelectTask,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const categoriesMeta = useMemo(
    () => ({
      travel: { name: 'Travel & Flights', Icon: Plane },
      utilities: { name: 'Utility Bills', Icon: Zap },
      groceries: { name: 'Groceries & Home', Icon: ShoppingCart },
      career: { name: 'Career & Drive Sync', Icon: FileText },
    }),
    []
  );

  const selectedCategoryMeta = selectedCategory ? categoriesMeta[selectedCategory] : null;
  const categoryTasksList = useMemo(
    () => (selectedCategory ? allTasks.filter(t => t.category === selectedCategory) : []),
    [allTasks, selectedCategory]
  );

  return (
    <Modal visible={!!selectedCategory} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.categoryTasksSheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.categorySheetHeaderLeft}>
              <View style={styles.categorySheetIconWrap}>
                {selectedCategoryMeta && (
                  <selectedCategoryMeta.Icon size={18} color={colors.primary} />
                )}
              </View>
              <View>
                <Text style={styles.sheetTitle}>{selectedCategoryMeta?.name}</Text>
                <Text style={styles.categorySheetSub}>
                  {categoryTasksList.length} tasks recorded in this category
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.categoryTasksScroll} showsVerticalScrollIndicator={false}>
            {categoryTasksList.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.categoryTaskItem}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  onSelectTask(task);
                }}
              >
                <View style={styles.categoryTaskTopRow}>
                  <Text style={styles.categoryTaskTitle}>{task.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      task.status === 'pending' && styles.statusBadgePending,
                      task.status === 'in_progress' && styles.statusBadgeInProgress,
                      task.status === 'completed' && styles.statusBadgeCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        task.status === 'pending' && styles.statusBadgeTextPending,
                        task.status === 'in_progress' && styles.statusBadgeTextInProgress,
                        task.status === 'completed' && styles.statusBadgeTextCompleted,
                      ]}
                    >
                      {task.statusLabel}
                    </Text>
                  </View>
                </View>

                <Text style={styles.categoryTaskDesc} numberOfLines={2}>
                  {task.description}
                </Text>

                <View style={styles.categoryTaskTimestamps}>
                  <Text style={styles.categoryTaskTime}>Created: {task.createdAt}</Text>
                  {task.completedAt && (
                    <Text style={[styles.categoryTaskTime, { color: colors.primary }]}>
                      Done: {task.completedAt}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={onClose}>
            <Text style={styles.primaryModalBtnText}>Close Category</Text>
          </TouchableOpacity>
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
    categoryTasksSheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      maxHeight: '85%',
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
    categorySheetHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    categorySheetIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categorySheetSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },
    categoryTasksScroll: {
      marginVertical: 14,
    },
    categoryTaskItem: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 6,
    },
    categoryTaskTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryTaskTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
      marginRight: 8,
    },
    categoryTaskDesc: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    categoryTaskTimestamps: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 4,
      paddingTop: 4,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorderSubtle,
    },
    categoryTaskTime: {
      fontSize: 10,
      color: colors.textMuted,
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
