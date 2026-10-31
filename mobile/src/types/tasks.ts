import { AutonomousTask } from './index';

export interface TasksScreenProps {
  tasks: AutonomousTask[];
  onTriggerTask: (type: 'email' | 'flight' | 'resume') => void;
  onOpenApprovalModal?: () => void;
  onOpenProfile?: () => void;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskCategory = 'travel' | 'utilities' | 'groceries' | 'career';

export interface ComprehensiveTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  categoryName: string;
  status: TaskStatus;
  statusLabel: string;
  progress: number;
  createdAt: string;
  completedAt?: string;
  amount?: string;
  meta: string;
  agent: string;
  tool: string;
  auditTitle: string;
  steps: string[];
  actionType?: 'approval' | 'flight' | 'grocery' | 'none';
}

export type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

export interface BarData {
  label: string;
  subLabel: string;
  completed: number;
  pending: number;
  height: number;
  isCurrent?: boolean;
}

export interface PeriodOption {
  id: string;
  label: string;
  subLabel?: string;
  totalCompleted: number;
  totalPending: number;
  successRate: string;
  bars: BarData[];
}
