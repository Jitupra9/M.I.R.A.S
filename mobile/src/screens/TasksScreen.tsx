import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  ShoppingCart,
  Plane,
  Zap,
  Calendar,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
  Mail,
  Check,
  ExternalLink,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
  AlertCircle,
  ListFilter,
  CheckSquare,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { AutonomousTask } from '../types';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';
import { MirasLogo } from '../components/MirasLogo';
import { AppHeader } from '../components/AppHeader';

interface TasksScreenProps {
  tasks: AutonomousTask[];
  onTriggerTask: (type: 'email' | 'flight' | 'resume') => void;
  onOpenApprovalModal?: () => void;
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

type ReportPeriod = 'weekly' | 'monthly' | 'yearly';

interface BarData {
  label: string;
  subLabel: string;
  completed: number;
  pending: number;
  height: number;
  isCurrent?: boolean;
}

interface PeriodOption {
  id: string;
  label: string;
  subLabel?: string;
  totalCompleted: number;
  totalPending: number;
  successRate: string;
  bars: BarData[];
}

const WEEKLY_OPTIONS: PeriodOption[] = [
  {
    id: 'week-4',
    label: 'Oct 21 – Oct 27 (Week 4)',
    subLabel: 'Current Week',
    totalCompleted: 35,
    totalPending: 4,
    successRate: '94.6%',
    bars: [
      { label: 'Mon', subLabel: '21', completed: 5, pending: 0, height: 50 },
      { label: 'Tue', subLabel: '22', completed: 7, pending: 1, height: 70 },
      { label: 'Wed', subLabel: '23', completed: 4, pending: 0, height: 40 },
      { label: 'Thu', subLabel: '24', completed: 8, pending: 1, height: 80 },
      { label: 'Fri', subLabel: '25', completed: 6, pending: 2, height: 65, isCurrent: true },
      { label: 'Sat', subLabel: '26', completed: 3, pending: 0, height: 32 },
      { label: 'Sun', subLabel: '27', completed: 2, pending: 0, height: 22 },
    ],
  },
  {
    id: 'week-3',
    label: 'Oct 14 – Oct 20 (Week 3)',
    subLabel: 'Previous Week',
    totalCompleted: 42,
    totalPending: 2,
    successRate: '96.2%',
    bars: [
      { label: 'Mon', subLabel: '14', completed: 6, pending: 0, height: 60 },
      { label: 'Tue', subLabel: '15', completed: 9, pending: 0, height: 90 },
      { label: 'Wed', subLabel: '16', completed: 5, pending: 1, height: 50 },
      { label: 'Thu', subLabel: '17', completed: 7, pending: 0, height: 70 },
      { label: 'Fri', subLabel: '18', completed: 8, pending: 1, height: 80 },
      { label: 'Sat', subLabel: '19', completed: 4, pending: 0, height: 40 },
      { label: 'Sun', subLabel: '20', completed: 3, pending: 0, height: 30 },
    ],
  },
  {
    id: 'week-2',
    label: 'Oct 07 – Oct 13 (Week 2)',
    subLabel: '2 Weeks Ago',
    totalCompleted: 38,
    totalPending: 1,
    successRate: '97.4%',
    bars: [
      { label: 'Mon', subLabel: '07', completed: 4, pending: 0, height: 40 },
      { label: 'Tue', subLabel: '08', completed: 6, pending: 0, height: 60 },
      { label: 'Wed', subLabel: '09', completed: 8, pending: 0, height: 80 },
      { label: 'Thu', subLabel: '10', completed: 5, pending: 1, height: 50 },
      { label: 'Fri', subLabel: '11', completed: 7, pending: 0, height: 70 },
      { label: 'Sat', subLabel: '12', completed: 5, pending: 0, height: 50 },
      { label: 'Sun', subLabel: '13', completed: 3, pending: 0, height: 30 },
    ],
  },
  {
    id: 'week-1',
    label: 'Sep 30 – Oct 06 (Week 1)',
    subLabel: '3 Weeks Ago',
    totalCompleted: 33,
    totalPending: 3,
    successRate: '92.8%',
    bars: [
      { label: 'Mon', subLabel: '30', completed: 5, pending: 1, height: 50 },
      { label: 'Tue', subLabel: '01', completed: 7, pending: 0, height: 70 },
      { label: 'Wed', subLabel: '02', completed: 6, pending: 0, height: 60 },
      { label: 'Thu', subLabel: '03', completed: 4, pending: 1, height: 40 },
      { label: 'Fri', subLabel: '04', completed: 6, pending: 1, height: 60 },
      { label: 'Sat', subLabel: '05', completed: 3, pending: 0, height: 30 },
      { label: 'Sun', subLabel: '06', completed: 2, pending: 0, height: 20 },
    ],
  },
];

const MONTHLY_OPTIONS: PeriodOption[] = [
  {
    id: 'month-10-2026',
    label: 'October 2026',
    subLabel: 'Current Month',
    totalCompleted: 159,
    totalPending: 8,
    successRate: '95.2%',
    bars: [
      { label: 'Wk 1', subLabel: 'Oct 1–7', completed: 33, pending: 2, height: 66 },
      { label: 'Wk 2', subLabel: 'Oct 8–14', completed: 38, pending: 1, height: 76 },
      { label: 'Wk 3', subLabel: 'Oct 15–21', completed: 42, pending: 2, height: 84 },
      { label: 'Wk 4', subLabel: 'Oct 22–28', completed: 35, pending: 3, height: 70, isCurrent: true },
      { label: 'Wk 5', subLabel: 'Oct 29–31', completed: 11, pending: 0, height: 22 },
    ],
  },
  {
    id: 'month-09-2026',
    label: 'September 2026',
    subLabel: 'Previous Month',
    totalCompleted: 150,
    totalPending: 5,
    successRate: '96.8%',
    bars: [
      { label: 'Wk 1', subLabel: 'Sep 1–7', completed: 32, pending: 1, height: 64 },
      { label: 'Wk 2', subLabel: 'Sep 8–14', completed: 40, pending: 2, height: 80 },
      { label: 'Wk 3', subLabel: 'Sep 15–21', completed: 41, pending: 1, height: 82 },
      { label: 'Wk 4', subLabel: 'Sep 22–30', completed: 37, pending: 1, height: 74 },
    ],
  },
  {
    id: 'month-08-2026',
    label: 'August 2026',
    subLabel: '2 Months Ago',
    totalCompleted: 162,
    totalPending: 6,
    successRate: '96.4%',
    bars: [
      { label: 'Wk 1', subLabel: 'Aug 1–7', completed: 34, pending: 1, height: 68 },
      { label: 'Wk 2', subLabel: 'Aug 8–14', completed: 39, pending: 2, height: 78 },
      { label: 'Wk 3', subLabel: 'Aug 15–21', completed: 44, pending: 1, height: 88 },
      { label: 'Wk 4', subLabel: 'Aug 22–28', completed: 36, pending: 2, height: 72 },
      { label: 'Wk 5', subLabel: 'Aug 29–31', completed: 9, pending: 0, height: 18 },
    ],
  },
  {
    id: 'month-07-2026',
    label: 'July 2026',
    subLabel: '3 Months Ago',
    totalCompleted: 144,
    totalPending: 7,
    successRate: '95.3%',
    bars: [
      { label: 'Wk 1', subLabel: 'Jul 1–7', completed: 30, pending: 2, height: 60 },
      { label: 'Wk 2', subLabel: 'Jul 8–14', completed: 36, pending: 1, height: 72 },
      { label: 'Wk 3', subLabel: 'Jul 15–21', completed: 41, pending: 3, height: 82 },
      { label: 'Wk 4', subLabel: 'Jul 22–31', completed: 37, pending: 1, height: 74 },
    ],
  },
];

const YEARLY_OPTIONS: PeriodOption[] = [
  {
    id: 'year-2026',
    label: 'Year 2026',
    subLabel: 'Year to Date',
    totalCompleted: 1485,
    totalPending: 38,
    successRate: '97.5%',
    bars: [
      { label: 'Jan', subLabel: '110', completed: 110, pending: 2, height: 48 },
      { label: 'Feb', subLabel: '125', completed: 125, pending: 3, height: 55 },
      { label: 'Mar', subLabel: '140', completed: 140, pending: 2, height: 62 },
      { label: 'Apr', subLabel: '135', completed: 135, pending: 4, height: 60 },
      { label: 'May', subLabel: '148', completed: 148, pending: 3, height: 65 },
      { label: 'Jun', subLabel: '160', completed: 160, pending: 5, height: 72 },
      { label: 'Jul', subLabel: '144', completed: 144, pending: 7, height: 64 },
      { label: 'Aug', subLabel: '162', completed: 162, pending: 6, height: 73 },
      { label: 'Sep', subLabel: '150', completed: 150, pending: 5, height: 67 },
      { label: 'Oct', subLabel: '159', completed: 159, pending: 8, height: 71, isCurrent: true },
      { label: 'Nov', subLabel: '-', completed: 0, pending: 0, height: 4 },
      { label: 'Dec', subLabel: '-', completed: 0, pending: 0, height: 4 },
    ],
  },
  {
    id: 'year-2025',
    label: 'Year 2025',
    subLabel: 'Full Year Archive',
    totalCompleted: 1362,
    totalPending: 31,
    successRate: '97.8%',
    bars: [
      { label: 'Jan', subLabel: '85', completed: 85, pending: 2, height: 38 },
      { label: 'Feb', subLabel: '92', completed: 92, pending: 1, height: 42 },
      { label: 'Mar', subLabel: '105', completed: 105, pending: 3, height: 48 },
      { label: 'Apr', subLabel: '112', completed: 112, pending: 2, height: 50 },
      { label: 'May', subLabel: '118', completed: 118, pending: 3, height: 53 },
      { label: 'Jun', subLabel: '124', completed: 124, pending: 4, height: 56 },
      { label: 'Jul', subLabel: '115', completed: 115, pending: 2, height: 52 },
      { label: 'Aug', subLabel: '128', completed: 128, pending: 3, height: 58 },
      { label: 'Sep', subLabel: '122', completed: 122, pending: 2, height: 55 },
      { label: 'Oct', subLabel: '130', completed: 130, pending: 3, height: 59 },
      { label: 'Nov', subLabel: '136', completed: 136, pending: 2, height: 62 },
      { label: 'Dec', subLabel: '145', completed: 145, pending: 4, height: 66 },
    ],
  },
  {
    id: 'year-2024',
    label: 'Year 2024',
    subLabel: 'Full Year Archive',
    totalCompleted: 885,
    totalPending: 24,
    successRate: '97.3%',
    bars: [
      { label: 'Jan', subLabel: '50', completed: 50, pending: 2, height: 25 },
      { label: 'Feb', subLabel: '58', completed: 58, pending: 1, height: 29 },
      { label: 'Mar', subLabel: '65', completed: 65, pending: 2, height: 33 },
      { label: 'Apr', subLabel: '70', completed: 70, pending: 1, height: 35 },
      { label: 'May', subLabel: '74', completed: 74, pending: 2, height: 37 },
      { label: 'Jun', subLabel: '80', completed: 80, pending: 3, height: 40 },
      { label: 'Jul', subLabel: '76', completed: 76, pending: 2, height: 38 },
      { label: 'Aug', subLabel: '82', completed: 82, pending: 2, height: 41 },
      { label: 'Sep', subLabel: '84', completed: 84, pending: 3, height: 42 },
      { label: 'Oct', subLabel: '88', completed: 88, pending: 2, height: 44 },
      { label: 'Nov', subLabel: '90', completed: 90, pending: 2, height: 45 },
      { label: 'Dec', subLabel: '98', completed: 98, pending: 2, height: 49 },
    ],
  },
];

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onTriggerTask,
  onOpenApprovalModal,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Tab State: 'progress_overview' vs 'tasks'
  const [subTab, setSubTab] = useState<'progress_overview' | 'tasks'>('progress_overview');

  // Tasks Filter State in 'tasks' Tab
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Report Period State (Weekly, Monthly, Yearly)
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number>(0);
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState<boolean>(false);

  // Chores State
  const [groceryApproved, setGroceryApproved] = useState(false);

  // Selected Category for Category Tasks Modal
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null);

  // Selected Task for Unified Full Details Modal
  const [selectedTask, setSelectedTask] = useState<ComprehensiveTask | null>(null);

  // Modals for legacy quick triggers
  const [isGroceryModalOpen, setIsGroceryModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // All unified tasks dataset
  const allTasks: ComprehensiveTask[] = useMemo(() => [
    {
      id: 'task-flight-checkin',
      title: 'Delta Flight Check-In',
      description: 'Flight #DL 1482 from JFK to ORD • Security authorization needed for boarding pass issuance.',
      category: 'travel',
      categoryName: 'Travel & Flights',
      status: 'pending',
      statusLabel: 'Pending Approval',
      progress: 60,
      createdAt: 'Today, 10:18 AM',
      meta: 'Flight #DL 1482 • Terminal 4 • Seat 12A • Code expires in 8 mins',
      agent: 'Supervisor & TravelAgent',
      tool: 'DeltaPortal MCP',
      auditTitle: 'Delta Airlines Flight Check-in Authorization',
      actionType: 'approval',
      steps: [
        'Supervisor Agent: Routing query to Delta Portal API',
        'DeltaPortal: Navigated to passenger check-in verification',
        'SafetyGate: Paused execution awaiting 6-digit SMS verification code',
      ],
    },
    {
      id: 'task-grocery-order',
      title: 'Whole Foods Organic Groceries',
      description: '6 organic grocery essentials (Milk, Honeycrisp apples, Greek yogurt, Avocados, Sourdough, Almond butter).',
      category: 'groceries',
      categoryName: 'Groceries & Home',
      status: groceryApproved ? 'completed' : 'pending',
      statusLabel: groceryApproved ? 'Completed' : 'Pending Approval',
      progress: groceryApproved ? 100 : 50,
      createdAt: 'Today, 09:45 AM',
      completedAt: groceryApproved ? 'Today, 10:30 AM' : undefined,
      amount: '$34.18',
      meta: '6 items • Whole Foods Market • Delivery window: 1:00 PM – 2:00 PM',
      agent: 'HouseholdChoresAgent',
      tool: 'Amazon Fresh MCP',
      auditTitle: 'Whole Foods Market Order #WF-4821',
      actionType: 'grocery',
      steps: [
        'Scanned smart kitchen inventory notes for replenishment',
        'Built optimized organic grocery cart on Whole Foods',
        groceryApproved
          ? 'Approved by user ($34.18 Apple Pay) • Order placed and scheduled for delivery'
          : 'Cart assembled and locked awaiting user payment approval',
      ],
    },
    {
      id: 'task-flight-search',
      title: 'Finding Cheap Direct Flights to Chicago',
      description: 'Comparing nonstop fares across United, American, and Southwest for Friday departure.',
      category: 'travel',
      categoryName: 'Travel & Flights',
      status: 'in_progress',
      statusLabel: 'In Progress',
      progress: 70,
      createdAt: 'Today, 09:30 AM',
      meta: '3 airline routes compared • Lowest fare: $214 (United #UA 442)',
      agent: 'TravelAgent',
      tool: 'Google Flights MCP',
      auditTitle: 'Nonstop Flight Matrix Comparison',
      actionType: 'flight',
      steps: [
        'Google Flights MCP: Scraped morning direct flights JFK/LGA to ORD/MDW',
        'Filtered for non-stop flights with carry-on included',
        'Found lowest fare: United Airlines #UA 442 for $214',
        'Monitoring fare lock countdown (2h 45m remaining)',
      ],
    },
    {
      id: 'task-internet-autopay',
      title: 'Spectrum Fiber Internet Auto-Pay',
      description: 'Monthly high-speed fiber internet subscription invoice verification and scheduling.',
      category: 'utilities',
      categoryName: 'Utility Bills',
      status: 'in_progress',
      statusLabel: 'In Progress',
      progress: 85,
      createdAt: 'Today, 07:00 AM',
      amount: '$79.99',
      meta: 'Spectrum 1Gbps Fiber • Auto-pay scheduled for tonight 11:59 PM',
      agent: 'FinanceAgent',
      tool: 'Spectrum Billing Gateway',
      auditTitle: 'Telecommunications Recurring Auto-Pay Check',
      steps: [
        'Parsed invoice statement: $79.99 for Oct 2026',
        'Verified billing address and payment token integrity',
        'Scheduled automatic settlement at 11:59 PM',
      ],
    },
    {
      id: 'task-interview-prep',
      title: 'Anthropic Lead AI Engineer Prep Document',
      description: 'Synthesizing talking points and architecture diagram review for tomorrow\'s executive session.',
      category: 'career',
      categoryName: 'Career & Drive Sync',
      status: 'in_progress',
      statusLabel: 'In Progress',
      progress: 40,
      createdAt: 'Today, 11:15 AM',
      meta: 'Meeting with Marcus Vance • 45-min discussion scheduled',
      agent: 'ExecutiveBriefingAgent',
      tool: 'Workspace MCP & Notion',
      auditTitle: 'Career Strategy & Technical Dossier',
      steps: [
        'Parsed email invite from Marcus Vance with scheduling slots',
        'Synthesizing MIRAS multi-agent telemetry benchmark results',
        'Drafting executive talking points on autonomous orchestration',
      ],
    },
    {
      id: 'task-coned-bill',
      title: 'Paid Electric Bill',
      description: 'ConEdison monthly statement auto-verified and settled via Chase Freedom (*4012).',
      category: 'utilities',
      categoryName: 'Utility Bills',
      status: 'completed',
      statusLabel: 'Completed',
      progress: 100,
      createdAt: 'Today, 08:10 AM',
      completedAt: 'Today, 08:14 AM',
      amount: '$64.20',
      meta: 'Confirmation: #CONED-98214-PAY • Chase Freedom (*4012)',
      agent: 'FinanceAgent',
      tool: 'ConEdison MCP & Chase API',
      auditTitle: 'ConEdison Utility Payment Receipt',
      steps: [
        'ConEd statement OCR analyzed: $64.20 due Oct 28',
        'Autonomous budget rule passed (under $100 ceiling threshold)',
        'Executed payment via Chase Freedom (*4012)',
        'Stored encrypted PDF receipt in Financial Archive',
      ],
    },
    {
      id: 'task-drive-resume',
      title: 'Synced Drive Resume',
      description: 'Modified resume with AI Autonomous Systems lead credentials and uploaded to Google Drive.',
      category: 'career',
      categoryName: 'Career & Drive Sync',
      status: 'completed',
      statusLabel: 'Completed',
      progress: 100,
      createdAt: 'Today, 08:45 AM',
      completedAt: 'Today, 08:50 AM',
      meta: 'File: Alex_Morgan_Resume_2026.pdf • Google Drive / Career',
      agent: 'DocumentSyncAgent',
      tool: 'Google Drive MCP',
      auditTitle: 'Google Drive Document Synchronization',
      steps: [
        'Extracted updated skills and autonomous architecture achievements',
        'Compiled ATS-optimized PDF: Alex_Morgan_Resume_2026.pdf',
        'Uploaded to Google Drive / Career / Active Applications',
        'Generated secure link: drive.google.com/file/d/miras-resume-2026',
      ],
    },
    {
      id: 'task-junk-emails',
      title: 'Filtered 18 Junk Emails',
      description: 'Automated newsletter cleanup, unsubscribing from spam and archiving marketing clutter.',
      category: 'career',
      categoryName: 'Career & Drive Sync',
      status: 'completed',
      statusLabel: 'Completed',
      progress: 100,
      createdAt: 'Today, 08:30 AM',
      completedAt: 'Today, 08:32 AM',
      meta: '18 newsletters processed • 0 false positives',
      agent: 'EmailTriageAgent',
      tool: 'Google Workspace MCP',
      auditTitle: 'Automated Inbox Spam Triage Log',
      steps: [
        'Sender: Promotions Daily (Unsubscribed via RFC-8058 header)',
        'Sender: Flash Sales VIP (Archived in Promotional folder)',
        'Sender: Fast Loan Offers (Moved to Junk with spam score 9.8)',
        'Primary inbox flagged for Dr. Sarah Lin & Marcus Vance',
      ],
    },
    {
      id: 'task-emirates-lock',
      title: 'Emirates Flight Price Freeze',
      description: 'Locked low fare of $842 for international route via Emirates Skywards MCP.',
      category: 'travel',
      categoryName: 'Travel & Flights',
      status: 'completed',
      statusLabel: 'Completed',
      progress: 100,
      createdAt: 'Yesterday, 04:12 PM',
      completedAt: 'Yesterday, 04:28 PM',
      amount: '$842.00',
      meta: 'Reference: MRAS-9941 • 3-hour price freeze applied',
      agent: 'TravelAgent',
      tool: 'Emirates Skywards MCP',
      auditTitle: 'Emirates Airlines Fare Freeze Confirmation',
      steps: [
        'Voice prompt parsed: Freeze fare for Dubai connection',
        'Submitted reservation reference MRAS-9941',
        'Confirmed zero cancellation penalty lock for 3 hours',
      ],
    },
    {
      id: 'task-household-essentials',
      title: 'Household Essentials Replenishment',
      description: 'Eco-friendly laundry detergent pods and artisanal coffee beans re-order.',
      category: 'groceries',
      categoryName: 'Groceries & Home',
      status: 'completed',
      statusLabel: 'Completed',
      progress: 100,
      createdAt: 'Oct 24, 2026 • 01:20 PM',
      completedAt: 'Oct 24, 2026 • 01:24 PM',
      amount: '$28.40',
      meta: 'Delivered to building concierge • 15% subscriber discount applied',
      agent: 'HouseholdChoresAgent',
      tool: 'Amazon Fresh MCP',
      auditTitle: 'Smart Home Automated Replenishment Log',
      steps: [
        'Detected low laundry supplies in inventory ledger',
        'Applied automated 15% subscriber coupon discount',
        'Package received and logged by concierge',
      ],
    },
  ], [groceryApproved]);

  // Categories metadata
  const categoriesMeta = useMemo(() => [
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
  ], [colors]);

  // Filtered tasks for the 'tasks' tab
  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return allTasks;
    return allTasks.filter(t => t.status === taskFilter);
  }, [allTasks, taskFilter]);

  // Current Period Data (Weekly / Monthly / Yearly)
  const currentPeriodOptions = useMemo(() => {
    if (reportPeriod === 'weekly') return WEEKLY_OPTIONS;
    if (reportPeriod === 'monthly') return MONTHLY_OPTIONS;
    return YEARLY_OPTIONS;
  }, [reportPeriod]);

  const activePeriodData = useMemo(() => {
    const validIndex = Math.min(selectedPeriodIndex, currentPeriodOptions.length - 1);
    return currentPeriodOptions[validIndex] || currentPeriodOptions[0];
  }, [currentPeriodOptions, selectedPeriodIndex]);

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
    if (selectedTask?.id === 'task-grocery-order') {
      setSelectedTask(prev => prev ? { ...prev, status: 'completed', statusLabel: 'Completed', progress: 100, completedAt: 'Just now' } : null);
    }
  };

  const pendingCount = useMemo(() => allTasks.filter(t => t.status === 'pending').length, [allTasks]);
  const inProgressCount = useMemo(() => allTasks.filter(t => t.status === 'in_progress').length, [allTasks]);
  const completedCount = useMemo(() => allTasks.filter(t => t.status === 'completed').length, [allTasks]);

  // Category Tasks for the Category modal
  const categoryTasksList = useMemo(() => {
    if (!selectedCategory) return [];
    return allTasks.filter(t => t.category === selectedCategory);
  }, [allTasks, selectedCategory]);

  const selectedCategoryMeta = useMemo(() => {
    if (!selectedCategory) return null;
    return categoriesMeta.find(c => c.id === selectedCategory);
  }, [categoriesMeta, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Unified Fixed Top Header */}
      <AppHeader onOpenProfile={() => setIsProfileOpen(true)} />

      <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.content}>
        {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks & Chores</Text>
        <Text style={styles.subtitle}>
          Everything MIRAS is handling for you quietly in the background.
        </Text>
      </View>

      {/* SECTION A: Sub-Tabs Selector (Renamed per Item 1) */}
      <View style={styles.sectionAGroup}>
        <View style={styles.subTabRow}>
          {/* Tab 1: Progress Overview */}
          <TouchableOpacity
            style={[styles.subTabBtn, subTab === 'progress_overview' && styles.subTabBtnActive]}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              setSubTab('progress_overview');
            }}
          >
            <BarChart2 size={15} color={subTab === 'progress_overview' ? colors.primary : colors.textMuted} />
            <Text style={[styles.subTabBtnText, subTab === 'progress_overview' && styles.subTabBtnTextActive]}>
              Progress Overview
            </Text>
            <View style={styles.tabBadgeGreen}>
              <Text style={styles.tabBadgeGreenText}>{completedCount}</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 2: Tasks (Renamed per Item 1) */}
          <TouchableOpacity
            style={[styles.subTabBtn, subTab === 'tasks' && styles.subTabBtnActive]}
            onPress={() => {
              VoiceService.triggerHaptic('light');
              setSubTab('tasks');
            }}
          >
            <CheckSquare size={15} color={subTab === 'tasks' ? colors.primary : colors.textMuted} />
            <Text style={[styles.subTabBtnText, subTab === 'tasks' && styles.subTabBtnTextActive]}>
              Tasks
            </Text>
            <View style={styles.tabBadgeAmber}>
              <Text style={styles.tabBadgeAmberText}>{allTasks.length}</Text>
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

      {/* Section Divider Gap */}
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

      {/* Section Divider Gap */}
      <View style={styles.sectionDividerGap} />

      {/* ========================================================
          TAB 1: PROGRESS OVERVIEW
          ======================================================== */}
      {subTab === 'progress_overview' && (
        <View style={styles.tabContentFade}>
          {/* Interactive Activity Graph Card (Weekly, Monthly, Yearly per Item 2) */}
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
                    onPress={() => handlePeriodTypeChange(period)}
                  >
                    <Text style={[styles.periodPillText, reportPeriod === period && styles.periodPillTextActive]}>
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interactive Period Selector Bar (Select specific week, month, or year) */}
            <View style={styles.periodSelectorBar}>
              <TouchableOpacity
                style={[styles.periodNavBtn, selectedPeriodIndex >= currentPeriodOptions.length - 1 && styles.periodNavBtnDisabled]}
                onPress={handlePrevPeriod}
                disabled={selectedPeriodIndex >= currentPeriodOptions.length - 1}
              >
                <ChevronLeft size={16} color={selectedPeriodIndex >= currentPeriodOptions.length - 1 ? colors.textMuted : colors.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.periodCurrentBadge}
                onPress={() => setIsPeriodPickerOpen(true)}
              >
                <Calendar size={13} color={colors.primary} />
                <Text style={styles.periodCurrentText}>
                  {activePeriodData.label}
                </Text>
                <ChevronDown size={14} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.periodNavBtn, selectedPeriodIndex <= 0 && styles.periodNavBtnDisabled]}
                onPress={handleNextPeriod}
                disabled={selectedPeriodIndex <= 0}
              >
                <ChevronRight size={16} color={selectedPeriodIndex <= 0 ? colors.textMuted : colors.textPrimary} />
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
                      const pendingHeight = item.pending > 0
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

          {/* Section: Progress by Category (Clickable per Item 3) */}
          <View style={styles.categorySection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Progress by Category</Text>
              <Text style={styles.categoryHintText}>Tap any category to view tasks</Text>
            </View>

            <View style={styles.categoryGrid}>
              {categoriesMeta.map(cat => {
                const catTasks = allTasks.filter(t => t.category === cat.id);
                const catCompleted = catTasks.filter(t => t.status === 'completed').length;
                const percent = catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 100;
                const CatIcon = cat.Icon;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    activeOpacity={0.75}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setSelectedCategory(cat.id);
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

          {/* Quick Completed Tasks History */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recently Completed</Text>
              <Text style={styles.countBadge}>{completedCount} verified</Text>
            </View>

            {allTasks.filter(t => t.status === 'completed').slice(0, 4).map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.finishedCard}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  setSelectedTask(item);
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
        </View>
      )}

      {/* ========================================================
          TAB 2: TASKS (All Tasks with Filters per Item 1)
          ======================================================== */}
      {subTab === 'tasks' && (
        <View style={styles.tabContentFade}>
          {/* Status Filter Chips Bar (Item 1: All Tasks by default) */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeaderRow}>
              <View style={styles.filterHeaderLeft}>
                <ListFilter size={14} color={colors.primary} />
                <Text style={styles.filterTitle}>Filter by Status</Text>
              </View>
              <Text style={styles.filterCountLabel}>{filteredTasks.length} tasks found</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsScroll}>
              {[
                { id: 'all' as const, label: 'All Tasks', count: allTasks.length },
                { id: 'pending' as const, label: 'Pending', count: pendingCount, isAmber: true },
                { id: 'in_progress' as const, label: 'In Progress', count: inProgressCount, isBlue: true },
                { id: 'completed' as const, label: 'Completed', count: completedCount, isGreen: true },
              ].map(f => {
                const isSelected = taskFilter === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setTaskFilter(f.id);
                    }}
                  >
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                      {f.label}
                    </Text>
                    <View style={[
                      styles.filterBadgeCircle,
                      isSelected && styles.filterBadgeCircleActive,
                      f.isAmber && !isSelected && styles.filterBadgeCircleAmber,
                    ]}>
                      <Text style={[
                        styles.filterBadgeText,
                        isSelected && styles.filterBadgeTextActive,
                        f.isAmber && !isSelected && styles.filterBadgeTextAmber,
                      ]}>
                        {f.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Unified Tasks List */}
          <View style={styles.tasksFeed}>
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyPendingCard}>
                <CheckCircle2 size={24} color={colors.primary} />
                <Text style={styles.emptyPendingTitle}>No Tasks Found</Text>
                <Text style={styles.emptyPendingSub}>No autonomous tasks match this filter right now.</Text>
              </View>
            ) : (
              filteredTasks.map(item => {
                const isPending = item.status === 'pending';
                const isInProgress = item.status === 'in_progress';
                const isCompleted = item.status === 'completed';

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.taskCard,
                      isPending && styles.taskCardPending,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setSelectedTask(item);
                    }}
                  >
                    {/* Card Header: Category + Status Badge */}
                    <View style={styles.taskCardTopRow}>
                      <View style={styles.taskCategoryPill}>
                        <Text style={styles.taskCategoryPillText}>{item.categoryName.toUpperCase()}</Text>
                      </View>

                      {/* Status Pill */}
                      <View style={[
                        styles.statusBadge,
                        isPending && styles.statusBadgePending,
                        isInProgress && styles.statusBadgeInProgress,
                        isCompleted && styles.statusBadgeCompleted,
                      ]}>
                        <View style={[
                          styles.statusDotSmall,
                          isPending && styles.statusDotSmallPending,
                          isInProgress && styles.statusDotSmallInProgress,
                          isCompleted && styles.statusDotSmallCompleted,
                        ]} />
                        <Text style={[
                          styles.statusBadgeText,
                          isPending && styles.statusBadgeTextPending,
                          isInProgress && styles.statusBadgeTextInProgress,
                          isCompleted && styles.statusBadgeTextCompleted,
                        ]}>
                          {item.statusLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Title & Description */}
                    <Text style={styles.taskCardTitle}>{item.title}</Text>
                    <Text style={styles.taskCardDesc} numberOfLines={2}>
                      {item.description}
                    </Text>

                    {/* Progress Bar */}
                    <View style={styles.taskProgressBarTrack}>
                      <View style={[
                        styles.taskProgressBarFill,
                        { width: `${item.progress}%` },
                        isPending && { backgroundColor: colors.warning },
                        isCompleted && { backgroundColor: colors.primary },
                      ]} />
                    </View>

                    {/* Metadata & Timestamps (Item 3 Requirement: show created and completed timestamps) */}
                    <View style={styles.taskTimestampsRow}>
                      <View style={styles.timestampItem}>
                        <Clock size={11} color={colors.textMuted} />
                        <Text style={styles.timestampText}>Created: {item.createdAt}</Text>
                      </View>

                      {item.completedAt ? (
                        <View style={styles.timestampItem}>
                          <CheckCircle2 size={11} color={colors.primary} />
                          <Text style={[styles.timestampText, { color: colors.primary }]}>
                            Done: {item.completedAt}
                          </Text>
                        </View>
                      ) : (
                        <Text style={styles.progressPercentLabel}>{item.progress}%</Text>
                      )}
                    </View>

                    {/* Action Row / Footer */}
                    <View style={styles.taskCardFooter}>
                      <Text style={styles.taskMetaText} numberOfLines={1}>
                        {item.amount ? `${item.amount} • ` : ''}{item.agent}
                      </Text>

                      {isPending && item.actionType === 'approval' && (
                        <TouchableOpacity
                          style={styles.actionBtnSmall}
                          onPress={() => {
                            VoiceService.triggerHaptic('medium');
                            if (onOpenApprovalModal) onOpenApprovalModal();
                          }}
                        >
                          <Text style={styles.actionBtnSmallText}>Help MIRAS</Text>
                          <ArrowRight size={12} color={colors.buttonTextDark} />
                        </TouchableOpacity>
                      )}

                      {isPending && item.actionType === 'grocery' && (
                        <TouchableOpacity
                          style={styles.actionBtnSmall}
                          onPress={() => {
                            VoiceService.triggerHaptic('medium');
                            setIsGroceryModalOpen(true);
                          }}
                        >
                          <Text style={styles.actionBtnSmallText}>Approve Cart</Text>
                          <ArrowRight size={12} color={colors.buttonTextDark} />
                        </TouchableOpacity>
                      )}

                      {isInProgress && item.actionType === 'flight' && (
                        <TouchableOpacity
                          style={styles.actionBtnSmallSubtle}
                          onPress={() => {
                            VoiceService.triggerHaptic('light');
                            setIsFlightModalOpen(true);
                          }}
                        >
                          <Text style={styles.actionBtnSmallSubtleText}>View Fares</Text>
                        </TouchableOpacity>
                      )}

                      {isCompleted && (
                        <View style={styles.verifiedCheckBadge}>
                          <Check size={11} color={colors.primary} />
                          <Text style={styles.verifiedCheckText}>Verified</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      )}

      {/* ========================================================
          MODAL A: SPECIFIC PERIOD PICKER (Week, Month, Year)
          ======================================================== */}
      <Modal visible={isPeriodPickerOpen} transparent animationType="fade" onRequestClose={() => setIsPeriodPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerModalContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Select {reportPeriod.charAt(0).toUpperCase() + reportPeriod.slice(1)} Period
              </Text>
              <TouchableOpacity onPress={() => setIsPeriodPickerOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerOptionsList}>
              {currentPeriodOptions.map((opt, idx) => {
                const isSelected = selectedPeriodIndex === idx;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.periodPickOption, isSelected && styles.periodPickOptionSelected]}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setSelectedPeriodIndex(idx);
                      setIsPeriodPickerOpen(false);
                    }}
                  >
                    <View style={styles.periodPickLeft}>
                      <Text style={[styles.periodPickLabel, isSelected && styles.periodPickLabelSelected]}>
                        {opt.label}
                      </Text>
                      {opt.subLabel && (
                        <Text style={styles.periodPickSub}>{opt.subLabel}</Text>
                      )}
                    </View>
                    <View style={styles.periodPickRight}>
                      <Text style={styles.periodPickStats}>
                        {opt.totalCompleted} done • {opt.totalPending} pending
                      </Text>
                      {isSelected && <Check size={16} color={colors.primary} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          MODAL B: CATEGORY TASKS SHEET (Item 3: Click Category)
          ======================================================== */}
      <Modal visible={!!selectedCategory} transparent animationType="slide" onRequestClose={() => setSelectedCategory(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.categoryTasksSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.categorySheetHeaderLeft}>
                <View style={styles.categorySheetIconWrap}>
                  {selectedCategoryMeta && <selectedCategoryMeta.Icon size={18} color={colors.primary} />}
                </View>
                <View>
                  <Text style={styles.sheetTitle}>{selectedCategoryMeta?.name}</Text>
                  <Text style={styles.categorySheetSub}>
                    {categoryTasksList.length} tasks recorded in this category
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
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
                    setSelectedTask(task);
                  }}
                >
                  <View style={styles.categoryTaskTopRow}>
                    <Text style={styles.categoryTaskTitle}>{task.title}</Text>
                    <View style={[
                      styles.statusBadge,
                      task.status === 'pending' && styles.statusBadgePending,
                      task.status === 'in_progress' && styles.statusBadgeInProgress,
                      task.status === 'completed' && styles.statusBadgeCompleted,
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        task.status === 'pending' && styles.statusBadgeTextPending,
                        task.status === 'in_progress' && styles.statusBadgeTextInProgress,
                        task.status === 'completed' && styles.statusBadgeTextCompleted,
                      ]}>
                        {task.statusLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.categoryTaskDesc} numberOfLines={2}>
                    {task.description}
                  </Text>

                  <View style={styles.categoryTaskTimestamps}>
                    <Text style={styles.categoryTaskTime}>
                      Created: {task.createdAt}
                    </Text>
                    {task.completedAt && (
                      <Text style={[styles.categoryTaskTime, { color: colors.primary }]}>
                        Done: {task.completedAt}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.primaryModalBtnText}>Close Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          MODAL C: UNIFIED FULL TASK DETAILS (Item 3 Requirement)
          ======================================================== */}
      <Modal visible={!!selectedTask} transparent animationType="slide" onRequestClose={() => setSelectedTask(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.taskDetailSheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.taskDetailHeaderLeft}>
                <View style={styles.taskCategoryPill}>
                  <Text style={styles.taskCategoryPillText}>{selectedTask?.categoryName.toUpperCase()}</Text>
                </View>
                <Text style={styles.taskDetailIdText}>#{selectedTask?.id.slice(-6).toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTask(null)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.taskDetailScroll} showsVerticalScrollIndicator={false}>
              {/* Title & Status Row */}
              <Text style={styles.taskDetailTitle}>{selectedTask?.title}</Text>
              <Text style={styles.taskDetailDesc}>{selectedTask?.description}</Text>

              {/* Status Badge + Progress Bar */}
              <View style={styles.taskDetailStatusCard}>
                <View style={styles.taskDetailStatusHeader}>
                  <Text style={styles.taskDetailStatusLabel}>Current Status & Progress</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedTask?.status === 'pending' && styles.statusBadgePending,
                    selectedTask?.status === 'in_progress' && styles.statusBadgeInProgress,
                    selectedTask?.status === 'completed' && styles.statusBadgeCompleted,
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      selectedTask?.status === 'pending' && styles.statusBadgeTextPending,
                      selectedTask?.status === 'in_progress' && styles.statusBadgeTextInProgress,
                      selectedTask?.status === 'completed' && styles.statusBadgeTextCompleted,
                    ]}>
                      {selectedTask?.statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.taskDetailProgressBarTrack}>
                  <View style={[
                    styles.taskDetailProgressBarFill,
                    { width: `${selectedTask?.progress || 0}%` },
                    selectedTask?.status === 'pending' && { backgroundColor: colors.warning },
                    selectedTask?.status === 'completed' && { backgroundColor: colors.primary },
                  ]} />
                </View>
                <Text style={styles.taskDetailProgressSub}>{selectedTask?.progress}% Complete</Text>
              </View>

              {/* Timestamps Section (Item 3 Requirement: Created & Completed) */}
              <View style={styles.taskDetailTimelineCard}>
                <Text style={styles.detailSectionHeader}>Timeline & Execution Window</Text>
                <View style={styles.timelineRow}>
                  <Clock size={15} color={colors.textMuted} />
                  <View style={styles.timelineCol}>
                    <Text style={styles.timelineLabel}>Created At</Text>
                    <Text style={styles.timelineValue}>{selectedTask?.createdAt}</Text>
                  </View>
                </View>

                <View style={styles.timelineRow}>
                  <CheckCircle2 size={15} color={selectedTask?.completedAt ? colors.primary : colors.textMuted} />
                  <View style={styles.timelineCol}>
                    <Text style={styles.timelineLabel}>Completed At</Text>
                    <Text style={[styles.timelineValue, selectedTask?.completedAt && { color: colors.primary, fontWeight: '700' }]}>
                      {selectedTask?.completedAt ? selectedTask.completedAt : 'In Progress (Active Execution)'}
                    </Text>
                  </View>
                </View>

                {selectedTask?.amount && (
                  <View style={styles.timelineRow}>
                    <Zap size={15} color={colors.primary} />
                    <View style={styles.timelineCol}>
                      <Text style={styles.timelineLabel}>Transaction / Settlement Amount</Text>
                      <Text style={[styles.timelineValue, { color: colors.primary, fontWeight: '800' }]}>
                        {selectedTask.amount}
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
                  <Text style={styles.agentMetaVal}>{selectedTask?.agent}</Text>
                </View>
                <View style={styles.agentMetaLine}>
                  <Text style={styles.agentMetaKey}>MCP Integration:</Text>
                  <Text style={styles.agentMetaVal}>{selectedTask?.tool}</Text>
                </View>
                <View style={styles.agentMetaLine}>
                  <Text style={styles.agentMetaKey}>System Record:</Text>
                  <Text style={styles.agentMetaVal}>{selectedTask?.meta}</Text>
                </View>
              </View>

              {/* Step-by-Step Audit Trail */}
              <View style={styles.taskDetailAuditCard}>
                <Text style={styles.detailSectionHeader}>Step-by-Step Audit Trail</Text>
                <View style={styles.auditList}>
                  {selectedTask?.steps.map((step, idx) => (
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
              {selectedTask?.status === 'pending' && selectedTask.actionType === 'approval' && (
                <TouchableOpacity
                  style={styles.primaryModalBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('medium');
                    setSelectedTask(null);
                    if (onOpenApprovalModal) onOpenApprovalModal();
                  }}
                >
                  <Text style={styles.primaryModalBtnText}>Help MIRAS / Enter Code</Text>
                </TouchableOpacity>
              )}

              {selectedTask?.status === 'pending' && selectedTask.actionType === 'grocery' && (
                <TouchableOpacity
                  style={styles.primaryModalBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('medium');
                    setSelectedTask(null);
                    setIsGroceryModalOpen(true);
                  }}
                >
                  <Text style={styles.primaryModalBtnText}>Review & Place Order ($34.18)</Text>
                </TouchableOpacity>
              )}

              {selectedTask?.status === 'in_progress' && selectedTask.actionType === 'flight' && (
                <TouchableOpacity
                  style={styles.primaryModalBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('light');
                    setSelectedTask(null);
                    setIsFlightModalOpen(true);
                  }}
                >
                  <Text style={styles.primaryModalBtnText}>Inspect Flight Options</Text>
                </TouchableOpacity>
              )}

              {selectedTask?.status === 'completed' && (
                <TouchableOpacity
                  style={styles.primaryModalBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('light');
                    setSelectedTask(null);
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

      {/* Legacy Grocery Modal */}
      <Modal visible={isGroceryModalOpen} transparent animationType="slide" onRequestClose={() => setIsGroceryModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Whole Foods Market Cart</Text>
              <TouchableOpacity onPress={() => setIsGroceryModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.groceryItemsList}>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Organic Whole Milk (1 Gal)</Text>
                <Text style={styles.groceryPrice}>$4.99</Text>
              </View>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Honeycrisp Apples (2 lbs)</Text>
                <Text style={styles.groceryPrice}>$5.49</Text>
              </View>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Organic Greek Yogurt (32 oz)</Text>
                <Text style={styles.groceryPrice}>$6.29</Text>
              </View>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Hass Avocados (Pack of 4)</Text>
                <Text style={styles.groceryPrice}>$4.50</Text>
              </View>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Artisan Sourdough Loaf</Text>
                <Text style={styles.groceryPrice}>$5.99</Text>
              </View>
              <View style={styles.groceryLine}>
                <Text style={styles.groceryName}>Creamy Roasted Almond Butter</Text>
                <Text style={styles.groceryPrice}>$6.92</Text>
              </View>
            </View>

            <View style={styles.groceryTotalRow}>
              <Text style={styles.groceryTotalLabel}>Total (Including Delivery & Tax)</Text>
              <Text style={styles.groceryTotalValue}>$34.18</Text>
            </View>

            <TouchableOpacity style={styles.primaryModalBtn} onPress={handleApproveGrocery}>
              <Check size={16} color={colors.buttonTextDark} />
              <Text style={styles.primaryModalBtnText}>Approve & Place Order ($34.18)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Legacy Chicago Flights Comparison Modal */}
      <Modal visible={isFlightModalOpen} transparent animationType="slide" onRequestClose={() => setIsFlightModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chicago Flights Comparison</Text>
              <TouchableOpacity onPress={() => setIsFlightModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.flightSub}>Departing Friday, Oct 18 • Nonstop to ORD</Text>

            <View style={styles.flightOptionsList}>
              <View style={[styles.flightOptionCard, styles.flightOptionCardBest]}>
                <View style={styles.flightOptionHeader}>
                  <Text style={styles.flightAirline}>United Airlines #UA 442</Text>
                  <Text style={styles.flightPriceBest}>$214 (Lowest)</Text>
                </View>
                <Text style={styles.flightTimes}>08:15 AM (JFK) ➔ 10:10 AM (ORD) • 2h 55m</Text>
                <Text style={styles.flightSeatNote}>✓ Window seat available in Row 12</Text>

                <TouchableOpacity
                  style={styles.bookOptionBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('success');
                    setIsFlightModalOpen(false);
                  }}
                >
                  <Text style={styles.bookOptionBtnText}>Book United ($214)</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.flightOptionCard}>
                <View style={styles.flightOptionHeader}>
                  <Text style={styles.flightAirline}>Southwest #WN 812</Text>
                  <Text style={styles.flightPrice}>$230</Text>
                </View>
                <Text style={styles.flightTimes}>11:30 AM (LGA) ➔ 01:25 PM (MDW) • 2h 55m</Text>
              </View>

              <View style={styles.flightOptionCard}>
                <View style={styles.flightOptionHeader}>
                  <Text style={styles.flightAirline}>American #AA 1902</Text>
                  <Text style={styles.flightPrice}>$248</Text>
                </View>
                <Text style={styles.flightTimes}>02:00 PM (JFK) ➔ 03:55 PM (ORD) • 2h 55m</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollWrapper: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Sub-Tabs Header Row
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  subTabBtnActive: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  subTabBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  subTabBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabBadgeGreen: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeGreenText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  tabBadgeAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeAmberText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.warning,
  },

  // Automation Rate Card
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

  // Section B: Quick Metrics Pair
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

  tabContentFade: {
    gap: 16,
  },

  // ============================================
  // GRAPH STYLES (Weekly, Monthly, Yearly)
  // ============================================
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

  // ============================================
  // CATEGORIES STYLES (Clickable per Item 3)
  // ============================================
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

  // Quick Completed List
  section: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 10,
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

  // ============================================
  // TAB 2: TASKS TAB WITH STATUS FILTERS
  // ============================================
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

  tasksFeed: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 8,
  },
  taskCardPending: {
    borderColor: 'rgba(245, 158, 11, 0.35)',
    backgroundColor: colors.cardBgSubtle,
  },
  taskCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  statusDotSmallPending: {
    backgroundColor: colors.warning,
  },
  statusDotSmallInProgress: {
    backgroundColor: colors.primary,
  },
  statusDotSmallCompleted: {
    backgroundColor: colors.success,
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
  taskCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  taskCardDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  taskProgressBarTrack: {
    height: 4,
    backgroundColor: colors.surfaceBorderSubtle,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  taskProgressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  taskTimestampsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  timestampItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  progressPercentLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
  taskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorderSubtle,
  },
  taskMetaText: {
    fontSize: 10.5,
    color: colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  actionBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBtnSmallText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  actionBtnSmallSubtle: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  actionBtnSmallSubtleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },
  verifiedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedCheckText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
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

  // ============================================
  // MODAL STYLES (Details, Categories, Picker)
  // ============================================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  pickerOptionsList: {
    gap: 8,
    marginTop: 10,
  },
  periodPickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  periodPickOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceCard,
  },
  periodPickLeft: {
    gap: 2,
  },
  periodPickLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  periodPickLabelSelected: {
    color: colors.primary,
  },
  periodPickSub: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  periodPickRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodPickStats: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  // Category Tasks Sheet
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
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorderSubtle,
  },
  categoryTaskTime: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // Full Task Details Sheet
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
  taskDetailHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  taskDetailFooter: {
    paddingTop: 10,
  },

  // Common sheet styles
  sheetContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    maxHeight: '90%',
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

  // Grocery modal styles
  groceryItemsList: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 8,
    marginBottom: 12,
  },
  groceryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groceryName: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  groceryPrice: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  groceryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    marginBottom: 14,
  },
  groceryTotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  groceryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },

  // Flight modal styles
  flightSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  flightOptionsList: {
    gap: 10,
  },
  flightOptionCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  flightOptionCardBest: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.surfaceCard,
  },
  flightOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  flightAirline: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flightPriceBest: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  flightPrice: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flightTimes: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  flightSeatNote: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 10,
  },
  bookOptionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  bookOptionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },

  // Audit styles
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
  auditText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
});
