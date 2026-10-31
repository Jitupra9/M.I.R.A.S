import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { AppHeader } from '../components/AppHeader';
import { ProfileModal } from '../components/ProfileModal';
import {
  TasksScreenProps,
  TaskStatus,
  TaskCategory,
  ComprehensiveTask,
  ReportPeriod,
  PeriodOption,
} from '../types/tasks';
import {
  WEEKLY_OPTIONS,
  MONTHLY_OPTIONS,
  YEARLY_OPTIONS,
  getComprehensiveTasks,
} from '../data/tasksData';
import { TaskOverviewHeader } from '../components/tasks/TaskOverviewHeader';
import { TaskAnalyticsCard } from '../components/tasks/TaskAnalyticsCard';
import { TaskCategoriesGrid } from '../components/tasks/TaskCategoriesGrid';
import { RecentlyCompletedTasks } from '../components/tasks/RecentlyCompletedTasks';
import { TaskFilterBar, TaskFilterType } from '../components/tasks/TaskFilterBar';
import { TaskCardItem } from '../components/tasks/TaskCardItem';
import { PeriodPickerModal } from '../components/tasks/PeriodPickerModal';
import { CategoryTasksModal } from '../components/tasks/CategoryTasksModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { GroceryCartModal } from '../components/tasks/GroceryCartModal';
import { FlightComparisonModal } from '../components/tasks/FlightComparisonModal';

// Re-export types for backward compatibility
export type { TasksScreenProps, TaskStatus, TaskCategory, ComprehensiveTask, ReportPeriod, PeriodOption };

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onTriggerTask,
  onOpenApprovalModal,
  onOpenProfile,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Tab State: 'progress_overview' or 'tasks'
  const [subTab, setSubTab] = useState<'progress_overview' | 'tasks'>('progress_overview');

  // Filter State in Tasks Tab
  const [taskFilter, setTaskFilter] = useState<TaskFilterType>('all');

  // Report Period State (weekly, monthly, yearly)
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState<boolean>(false);

  // Grocery Cart State
  const [groceryApproved, setGroceryApproved] = useState(false);

  // Category & Task Inspection Modals
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);
  const [selectedTask, setSelectedTask] = useState<ComprehensiveTask | null>(null);

  // Action Modals State
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // All unified tasks dataset
  const allTasks: ComprehensiveTask[] = useMemo(
    () => getComprehensiveTasks(groceryApproved),
    [groceryApproved]
  );

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return allTasks;
    return allTasks.filter(t => t.status === taskFilter);
  }, [allTasks, taskFilter]);

  // Current options list based on active period type
  const currentPeriodOptions = useMemo(() => {
    if (reportPeriod === 'monthly') return MONTHLY_OPTIONS;
    if (reportPeriod === 'yearly') return YEARLY_OPTIONS;
    return WEEKLY_OPTIONS;
  }, [reportPeriod]);

  // Active period data safely resolved
  const activePeriodData = useMemo(() => {
    const validIndex = Math.min(selectedPeriodIndex, currentPeriodOptions.length - 1);
    return currentPeriodOptions[validIndex] || currentPeriodOptions[0];
  }, [selectedPeriodIndex, currentPeriodOptions]);

  const handlePeriodTypeChange = (type: ReportPeriod) => {
    VoiceService.triggerHaptic('light');
    setReportPeriod(type);
    setSelectedPeriodIndex(0);
  };

  const handlePrevPeriod = () => {
    if (selectedPeriodIndex < currentPeriodOptions.length - 1) {
      VoiceService.triggerHaptic('light');
      setSelectedPeriodIndex(prev => prev + 1);
    }
  };

  const handleNextPeriod = () => {
    if (selectedPeriodIndex > 0) {
      VoiceService.triggerHaptic('light');
      setSelectedPeriodIndex(prev => prev - 1);
    }
  };

  const handleApproveGrocery = () => {
    VoiceService.triggerHaptic('success');
    setGroceryApproved(true);
    setIsGroceryModalOpen(false);
  };

  // Metrics
  const pendingCount = useMemo(() => allTasks.filter(t => t.status === 'pending').length, [allTasks]);
  const inProgressCount = useMemo(() => allTasks.filter(t => t.status === 'in_progress').length, [allTasks]);
  const completedCount = useMemo(() => allTasks.filter(t => t.status === 'completed').length, [allTasks]);

  return (
    <View style={styles.container}>
      {/* Unified Fixed Top Header */}
      <AppHeader onOpenProfile={onOpenProfile || (() => setIsProfileOpen(true))} />

      <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tasks & Chores</Text>
          <Text style={styles.subtitle}>
            Everything MIRAS is handling for you quietly in the background.
          </Text>
        </View>

        {/* Section Overview Header: Tabs, Automation Rate, Quick Metrics */}
        <TaskOverviewHeader
          subTab={subTab}
          onSelectSubTab={setSubTab}
          completedCount={completedCount}
          pendingCount={pendingCount}
          totalTasksCount={allTasks.length}
        />

        {/* TAB 1: PROGRESS OVERVIEW */}
        {subTab === 'progress_overview' && (
          <View style={styles.tabContentFade}>
            {/* Interactive Activity Graph Card */}
            <TaskAnalyticsCard
              reportPeriod={reportPeriod}
              onPeriodTypeChange={handlePeriodTypeChange}
              selectedPeriodIndex={selectedPeriodIndex}
              currentPeriodOptions={currentPeriodOptions}
              activePeriodData={activePeriodData}
              onPrevPeriod={handlePrevPeriod}
              onNextPeriod={handleNextPeriod}
              onOpenPeriodPicker={() => setIsPeriodPickerOpen(true)}
            />

            {/* Section: Progress by Category */}
            <TaskCategoriesGrid
              allTasks={allTasks}
              onSelectCategory={catId => setSelectedCategory(catId)}
            />

            {/* Quick Completed Tasks History */}
            <RecentlyCompletedTasks
              tasks={allTasks}
              completedCount={completedCount}
              onSelectTask={setSelectedTask}
            />
          </View>
        )}

        {/* TAB 2: TASKS */}
        {subTab === 'tasks' && (
          <View style={styles.tabContentFade}>
            {/* Status Filter Chips Bar */}
            <TaskFilterBar
              taskFilter={taskFilter}
              onSelectFilter={setTaskFilter}
              allCount={allTasks.length}
              pendingCount={pendingCount}
              inProgressCount={inProgressCount}
              completedCount={completedCount}
              filteredCount={filteredTasks.length}
            />

            {/* Unified Tasks List */}
            <View style={styles.tasksFeed}>
              {filteredTasks.length === 0 ? (
                <View style={styles.emptyPendingCard}>
                  <CheckCircle2 size={24} color={colors.primary} />
                  <Text style={styles.emptyPendingTitle}>No Tasks Found</Text>
                  <Text style={styles.emptyPendingSub}>
                    No autonomous tasks match this filter right now.
                  </Text>
                </View>
              ) : (
                filteredTasks.map(item => (
                  <TaskCardItem
                    key={item.id}
                    item={item}
                    onSelectTask={setSelectedTask}
                    onOpenApprovalModal={onOpenApprovalModal}
                    onOpenGroceryModal={() => setIsGroceryModalOpen(true)}
                    onOpenFlightModal={() => setIsFlightModalOpen(true)}
                  />
                ))
              )}
            </View>
          </View>
        )}

        {/* MODAL A: SPECIFIC PERIOD PICKER */}
        <PeriodPickerModal
          visible={isPeriodPickerOpen}
          onClose={() => setIsPeriodPickerOpen(false)}
          reportPeriod={reportPeriod}
          currentPeriodOptions={currentPeriodOptions}
          selectedPeriodIndex={selectedPeriodIndex}
          onSelectPeriodIndex={setSelectedPeriodIndex}
        />

        {/* MODAL B: CATEGORY TASKS SHEET */}
        <CategoryTasksModal
          selectedCategory={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          allTasks={allTasks}
          onSelectTask={setSelectedTask}
        />

        {/* MODAL C: UNIFIED FULL TASK DETAILS */}
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onOpenApprovalModal={onOpenApprovalModal}
          onOpenGroceryModal={() => setIsGroceryModalOpen(true)}
          onOpenFlightModal={() => setIsFlightModalOpen(true)}
        />

        {/* Grocery Modal */}
        <GroceryCartModal
          visible={isGroceryModalOpen}
          onClose={() => setIsGroceryModalOpen(false)}
          onApprove={handleApproveGrocery}
        />

        {/* Flight Comparison Modal */}
        <FlightComparisonModal
          visible={isFlightModalOpen}
          onClose={() => setIsFlightModalOpen(false)}
        />

        {/* Profile Modal */}
        <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollWrapper: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 40,
      gap: 16,
    },
    header: {
      marginBottom: 2,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    tabContentFade: {
      gap: 16,
    },
    tasksFeed: {
      gap: 12,
    },
    emptyPendingCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
    },
    emptyPendingTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    emptyPendingSub: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
