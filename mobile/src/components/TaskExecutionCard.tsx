import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Terminal, CheckCircle2, Loader2, AlertTriangle, Layers } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { AutonomousTask } from '../types';

interface TaskExecutionCardProps {
  task: AutonomousTask;
}

export const TaskExecutionCard: React.FC<TaskExecutionCardProps> = ({ task }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Layers size={17} color={colors.secondary} />
          <Text style={styles.cardTitle}>{task.title}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          task.status === 'completed' && styles.statusBadgeCompleted,
          task.status === 'needs_approval' && styles.statusBadgeApproval,
        ]}>
          <Text style={[
            styles.statusBadgeText,
            task.status === 'completed' && styles.statusTextCompleted,
            task.status === 'needs_approval' && styles.statusTextApproval,
          ]}>
            {task.status === 'completed' ? 'COMPLETED' : task.status === 'needs_approval' ? 'AWAITING APPROVAL' : 'RUNNING'}
          </Text>
        </View>
      </View>

      <Text style={styles.taskDescription}>{task.description}</Text>

      {/* Execution Pipeline Steps */}
      <View style={styles.stepsContainer}>
        {task.steps.map((step, idx) => {
          const isDone = step.status === 'completed';
          const isRunning = step.status === 'running';

          return (
            <View key={step.id || idx} style={styles.stepItem}>
              <View style={styles.stepIndicatorCol}>
                <View style={[
                  styles.dot,
                  isDone && styles.dotCompleted,
                  isRunning && styles.dotRunning,
                ]}>
                  {isDone ? (
                    <CheckCircle2 size={12} color="#070B14" />
                  ) : isRunning ? (
                    <View style={styles.innerPulse} />
                  ) : (
                    <Text style={styles.dotNumber}>{step.stepNumber}</Text>
                  )}
                </View>
                {idx < task.steps.length - 1 && <View style={styles.stepLine} />}
              </View>

              <View style={styles.stepContentCol}>
                <View style={styles.stepMetaRow}>
                  <Text style={styles.agentTag}>{step.agent}</Text>
                  <Text style={styles.toolTag}>🔧 {step.tool}</Text>
                  <Text style={styles.timeTag}>{step.timestamp}</Text>
                </View>
                <Text style={styles.actionText}>{step.action}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: `${colors.secondary}4D`,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: `${colors.primary}1F`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeCompleted: {
    backgroundColor: `${colors.success}26`,
  },
  statusBadgeApproval: {
    backgroundColor: `${colors.warning}2E`,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  statusTextApproval: {
    color: colors.warning,
  },
  taskDescription: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  stepsContainer: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 10,
  },
  stepItem: {
    flexDirection: 'row',
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.inactiveNav,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: colors.primary,
  },
  dotRunning: {
    backgroundColor: colors.warning,
  },
  dotNumber: {
    fontSize: 9,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  innerPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#070B14',
  },
  stepLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: colors.surfaceBorderSubtle,
    marginVertical: 2,
    minHeight: 18,
  },
  stepContentCol: {
    flex: 1,
    paddingBottom: 10,
  },
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  agentTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
  },
  toolTag: {
    fontSize: 10,
    color: colors.textCyan,
  },
  timeTag: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginLeft: 'auto',
  },
  actionText: {
    fontSize: 11.5,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});

