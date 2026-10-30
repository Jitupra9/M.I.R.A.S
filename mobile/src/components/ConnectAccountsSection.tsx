import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  Server,
  Key,
  Settings2,
  Trash2,
  ArrowRightLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Code2,
  MessageSquare,
  Layers,
  Mail,
  Calendar,
  HardDrive,
  FileText,
  X,
  Sparkles,
  Zap,
  Activity,
  Check,
  Briefcase,
  Cloud,
  Database,
  Globe,
  Video,
  Pencil,
  FolderPlus,
  MoreVertical,
  Search,
  ChevronRight,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import {
  ConnectionMethod,
  ConnectionStatus,
  IntegrationCategory,
  IntegrationItem,
  IntegrationCredentials,
} from '../types/integrations';

// ============================================================================
// INITIAL PROFESSIONAL CATEGORIES & INTEGRATIONS
// ============================================================================

export const INITIAL_CATEGORIES: IntegrationCategory[] = [
  {
    id: 'personal_productivity',
    name: 'Personal & Productivity',
    description: 'Priority email, smart calendar, documents & wiki',
    iconType: 'sparkles',
    integrationIds: ['gmail', 'gcalendar', 'gdrive', 'notion'],
  },
  {
    id: 'professional_engineering',
    name: 'Professional & Engineering',
    description: 'Code repositories, CI/CD workflows & sprint backlogs',
    iconType: 'code',
    integrationIds: ['github', 'slack', 'linear'],
  },
  {
    id: 'cloud_infrastructure',
    name: 'Cloud & Infrastructure',
    description: 'Cloud environments, server orchestration & compute',
    iconType: 'cloud',
    integrationIds: ['aws', 'cloudflare', 'custom_mcp'],
  },
  {
    id: 'team_communication',
    name: 'Team & Communication',
    description: 'Team channels, community hubs & virtual meetings',
    iconType: 'briefcase',
    integrationIds: ['discord', 'zoom'],
  },
];

export const INITIAL_INTEGRATIONS: Record<string, IntegrationItem> = {
  // Professional & Engineering
  github: {
    id: 'github',
    name: 'GitHub',
    categoryId: 'professional_engineering',
    description: 'alexmorgan-ai • Repositories & CI/CD',
    iconType: 'github',
    status: 'connected_api',
    activeMethod: 'api',
    credentials: {
      accountHandle: 'alexmorgan-ai',
      personalAccessToken: 'ghp_4k981xLaM0298vBqZ871109aK29xLq19',
      scope: 'repo, workflow, read:org',
      customEndpoint: 'https://api.github.com',
    },
    lastConnectedAt: 'Today, 2:15 PM',
    toolsDiscovered: 6,
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    categoryId: 'professional_engineering',
    description: 'Acme AI Engineering • Alerts & standups',
    iconType: 'slack',
    status: 'connected_mcp',
    activeMethod: 'mcp',
    credentials: {
      mcpServerUrl: 'sse://slack.miras-workspace.internal/v1',
      mcpTransport: 'sse',
      mcpAuthToken: 'xoxb-8941920412-9841029412-8f92jkl019',
      autoDiscoverTools: true,
    },
    lastConnectedAt: 'Today, 1:40 PM',
    toolsDiscovered: 4,
  },
  linear: {
    id: 'linear',
    name: 'Linear',
    categoryId: 'professional_engineering',
    description: 'Issue tracker, project cycles & engineering roadmaps',
    iconType: 'linear',
    status: 'not_connected',
    credentials: {
      apiKey: 'lin_api_90481204981204981204',
      mcpServerUrl: 'https://mcp.linear.app/sse',
      mcpTransport: 'sse',
    },
  },

  // Personal & Productivity
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    categoryId: 'personal_productivity',
    description: 'alex.morgan@workspace.io • Inbox triage & summaries',
    iconType: 'gmail',
    status: 'not_connected',
    credentials: {
      accountHandle: 'alex.morgan@workspace.io',
      mcpServerUrl: 'sse://gmail-agent.miras.internal/events',
      mcpTransport: 'sse',
    },
  },
  gcalendar: {
    id: 'gcalendar',
    name: 'Google Calendar',
    categoryId: 'personal_productivity',
    description: 'alex.morgan@workspace.io • Calendar & scheduling',
    iconType: 'calendar',
    status: 'connected_api',
    activeMethod: 'api',
    credentials: {
      accountHandle: 'alex.morgan@workspace.io',
      apiKey: 'ya29.a0AfH6SMA849102849102849102',
      scope: 'calendar.events, calendar.readonly',
    },
    lastConnectedAt: 'Today, 9:00 AM',
    toolsDiscovered: 3,
  },
  gdrive: {
    id: 'gdrive',
    name: 'Google Drive',
    categoryId: 'personal_productivity',
    description: 'Team Shared Drive • Specs, docs, sheets & slides',
    iconType: 'drive',
    status: 'not_connected',
    credentials: {
      mcpServerUrl: 'https://gdrive-mcp.workspace.io/v1',
      mcpTransport: 'http_stream',
    },
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    categoryId: 'personal_productivity',
    description: 'Personal Wiki • System specs & meeting notes',
    iconType: 'notion',
    status: 'not_connected',
    credentials: {
      apiKey: 'secret_4k981xLaM0298vBqZ871109aK29xLq19',
      mcpServerUrl: 'sse://notion-mcp.internal/stream',
      mcpTransport: 'sse',
    },
  },

  // Cloud & Infrastructure
  aws: {
    id: 'aws',
    name: 'AWS Cloud Console',
    categoryId: 'cloud_infrastructure',
    description: 'EC2, Lambda, S3 storage & cloud telemetry',
    iconType: 'aws',
    status: 'not_connected',
    credentials: {
      mcpServerUrl: 'sse://aws-mcp.miras.internal/v1',
      apiKey: 'AKIAIOSFODNN7EXAMPLE',
    },
  },
  cloudflare: {
    id: 'cloudflare',
    name: 'Cloudflare',
    categoryId: 'cloud_infrastructure',
    description: 'Edge workers, DNS routes & SSL certificates',
    iconType: 'cloudflare',
    status: 'not_connected',
    credentials: {
      mcpServerUrl: 'https://api.cloudflare.com/client/v4/mcp',
      apiKey: 'cf_api_98410294129841',
    },
  },
  custom_mcp: {
    id: 'custom_mcp',
    name: 'Custom Remote MCP Gateway',
    categoryId: 'cloud_infrastructure',
    description: 'External Model Context Protocol server endpoints',
    iconType: 'server',
    status: 'not_connected',
    credentials: {
      mcpServerUrl: 'sse://gateway.internal/events',
      mcpTransport: 'sse',
    },
  },

  // Team & Communication
  discord: {
    id: 'discord',
    name: 'Discord',
    categoryId: 'team_communication',
    description: 'Developer community channels & webhooks',
    iconType: 'discord',
    status: 'not_connected',
    credentials: {
      apiKey: 'Bot MTA4OTIxNDg5MTI0',
      mcpServerUrl: 'https://discord.mcp.local/stream',
    },
  },
  zoom: {
    id: 'zoom',
    name: 'Zoom Meetings',
    categoryId: 'team_communication',
    description: 'Cloud recordings, AI meeting notes & transcripts',
    iconType: 'zoom',
    status: 'not_connected',
    credentials: {
      apiKey: 'zm_token_89412904',
      mcpServerUrl: 'sse://zoom-bridge.internal/v1',
    },
  },
};

// ============================================================================
// POPULAR PLATFORMS CATALOG (LinkedIn, Naukri, WorkIndia, Jira, etc.)
// ============================================================================

export interface PlatformPreset {
  id: string;
  name: string;
  description: string;
  iconType: string;
  suggestedCategoryId: string;
  defaultMethod: ConnectionMethod;
  defaultEndpoint?: string;
  suggestedScope?: string;
  categoryTag: string;
}

export const POPULAR_PLATFORM_CATALOG: PlatformPreset[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional profile, network & job messaging',
    iconType: 'linkedin',
    suggestedCategoryId: 'personal_productivity',
    defaultMethod: 'api',
    defaultEndpoint: 'https://api.linkedin.com/v2',
    suggestedScope: 'r_liteprofile, r_emailaddress, w_member_social',
    categoryTag: 'Job & Career',
  },
  {
    id: 'naukri',
    name: 'Naukri.com',
    description: "India's #1 Job Portal • Job alerts, resume & recruiter sync",
    iconType: 'naukri',
    suggestedCategoryId: 'personal_productivity',
    defaultMethod: 'api',
    defaultEndpoint: 'https://recruiter.naukri.com/api/v1',
    suggestedScope: 'jobs, applications, alerts',
    categoryTag: 'Job & Career',
  },
  {
    id: 'workindia',
    name: 'WorkIndia',
    description: 'Employer portal • Candidate search & alert dispatch',
    iconType: 'workindia',
    suggestedCategoryId: 'personal_productivity',
    defaultMethod: 'api',
    defaultEndpoint: 'https://workindia.in/employer-api',
    suggestedScope: 'candidates, postings, messages',
    categoryTag: 'Job & Career',
  },
  {
    id: 'jira',
    name: 'Jira Software',
    description: 'Atlassian Jira • Sprint backlog, issues & workflow tickets',
    iconType: 'jira',
    suggestedCategoryId: 'professional_engineering',
    defaultMethod: 'mcp',
    defaultEndpoint: 'sse://jira.workspace.internal/v1',
    categoryTag: 'Engineering',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'Git repositories, CI/CD runners & issue boards',
    iconType: 'gitlab',
    suggestedCategoryId: 'professional_engineering',
    defaultMethod: 'api',
    defaultEndpoint: 'https://gitlab.com/api/v4',
    suggestedScope: 'read_user, read_repository, api',
    categoryTag: 'Engineering',
  },
  {
    id: 'asana',
    name: 'Asana Projects',
    description: 'Team projects, task milestones & progress tracking',
    iconType: 'asana',
    suggestedCategoryId: 'personal_productivity',
    defaultMethod: 'api',
    defaultEndpoint: 'https://app.asana.com/api/1.0',
    categoryTag: 'Productivity',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Kanban boards, task lists & sprint cards',
    iconType: 'trello',
    suggestedCategoryId: 'personal_productivity',
    defaultMethod: 'api',
    defaultEndpoint: 'https://api.trello.com/1',
    categoryTag: 'Productivity',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Agent notifications, automated dispatch & client chats',
    iconType: 'whatsapp',
    suggestedCategoryId: 'team_communication',
    defaultMethod: 'api',
    defaultEndpoint: 'https://graph.facebook.com/v19.0',
    suggestedScope: 'whatsapp_business_messaging',
    categoryTag: 'Chat & Social',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Enterprise team channels, bot integrations & chat transcripts',
    iconType: 'teams',
    suggestedCategoryId: 'team_communication',
    defaultMethod: 'mcp',
    defaultEndpoint: 'sse://teams.internal.miras/v1',
    categoryTag: 'Chat & Social',
  },
  {
    id: 'gcp',
    name: 'Google Cloud (GCP)',
    description: 'Cloud Run, BigQuery data streams & Vertex AI',
    iconType: 'gcp',
    suggestedCategoryId: 'cloud_infrastructure',
    defaultMethod: 'mcp',
    defaultEndpoint: 'sse://gcp-mcp.internal/v1',
    categoryTag: 'Cloud & AI',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    description: 'Azure App Service, Cognitive Services & Cosmos DB',
    iconType: 'azure',
    suggestedCategoryId: 'cloud_infrastructure',
    defaultMethod: 'mcp',
    defaultEndpoint: 'sse://azure-mcp.internal/v1',
    categoryTag: 'Cloud & AI',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'PostgreSQL database, real-time subscriptions & edge storage',
    iconType: 'supabase',
    suggestedCategoryId: 'cloud_infrastructure',
    defaultMethod: 'api',
    defaultEndpoint: 'https://api.supabase.com/v1',
    categoryTag: 'Cloud & AI',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Instant alerts, channel dispatch & bot command actions',
    iconType: 'telegram',
    suggestedCategoryId: 'team_communication',
    defaultMethod: 'api',
    defaultEndpoint: 'https://api.telegram.org/bot',
    categoryTag: 'Chat & Social',
  },
];

interface ConnectAccountsSectionProps {
  onShowToast?: (message: string) => void;
}

export const ConnectAccountsSection: React.FC<ConnectAccountsSectionProps> = ({ onShowToast }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Categories and integrations state
  const [categories, setCategories] = useState<IntegrationCategory[]>(INITIAL_CATEGORIES);
  const [integrations, setIntegrations] = useState<Record<string, IntegrationItem>>(INITIAL_INTEGRATIONS);

  // Expand / collapse state per category (personal open by default, others collapsed)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    personal_productivity: true,
    professional_engineering: false,
    cloud_infrastructure: false,
    team_communication: false,
  });

  // Dialog states
  const [addAccountCategory, setAddAccountCategory] = useState<IntegrationCategory | null>(null);
  const [setupIntegration, setSetupIntegration] = useState<IntegrationItem | null>(null);
  const [manageIntegration, setManageIntegration] = useState<IntegrationItem | null>(null);

  // Category CRUD states (Point 3)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IntegrationCategory | null>(null);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [categoryFormDesc, setCategoryFormDesc] = useState('');
  const [categoryFormIcon, setCategoryFormIcon] = useState<IntegrationCategory['iconType']>('code');

  // Setup modal form state
  const [activeSetupMethod, setActiveSetupMethod] = useState<ConnectionMethod>('mcp');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSimulatingConnect, setIsSimulatingConnect] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [simulateFailToggle, setSimulateFailToggle] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    title: string;
    details: string[];
    timestamp: string;
  } | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Custom Application / Platform Modal state
  const [isCustomAppModalOpen, setIsCustomAppModalOpen] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [customAppDesc, setCustomAppDesc] = useState('');
  const [customAppCategory, setCustomAppCategory] = useState<string>('personal_productivity');
  const [customAppIcon, setCustomAppIcon] = useState<string>('briefcase');
  const [customAppMethod, setCustomAppMethod] = useState<ConnectionMethod>('api');

  // Toggle Category Expand/Collapse
  const toggleCategory = (categoryId: string) => {
    VoiceService.triggerHaptic('light');
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Open "Add Account" dialog for a specific category
  const handleOpenAddAccount = (category: IntegrationCategory) => {
    VoiceService.triggerHaptic('light');
    setAddAccountCategory(category);
  };

  // Open Custom Platform/App Modal
  const handleOpenCustomAppModal = (categoryId?: string, prefillName = '') => {
    VoiceService.triggerHaptic('light');
    setCustomAppName(prefillName);
    setCustomAppUrl('');
    setCustomAppDesc('');
    setCustomAppCategory(categoryId || addAccountCategory?.id || categories[0]?.id || 'personal_productivity');
    setCustomAppIcon('briefcase');
    setCustomAppMethod('api');
    setIsCustomAppModalOpen(true);
  };

  // Save and launch setup for custom application
  const handleSaveCustomApp = () => {
    if (!customAppName.trim()) return;

    VoiceService.triggerHaptic('medium');
    const slug = customAppName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const customId = `app_${slug}_${Date.now()}`;
    const targetCatId = customAppCategory || addAccountCategory?.id || categories[0]?.id;

    const newItem: IntegrationItem = {
      id: customId,
      name: customAppName.trim(),
      categoryId: targetCatId,
      description: customAppDesc.trim() || `${customAppName.trim()} custom service integration`,
      iconType: customAppIcon,
      status: 'not_connected',
      activeMethod: customAppMethod,
      credentials: {
        accountHandle: 'alexmorgan-ai',
        customEndpoint: customAppUrl.trim(),
        mcpServerUrl: customAppMethod === 'mcp' ? (customAppUrl.trim() || `sse://${slug}.miras.internal/v1`) : '',
        apiKey: '',
        scope: 'read, write, tools',
      },
    };

    setIntegrations(prev => ({
      ...prev,
      [customId]: newItem,
    }));

    setCategories(prev =>
      prev.map(cat =>
        cat.id === targetCatId
          ? {
              ...cat,
              integrationIds: cat.integrationIds.includes(customId)
                ? cat.integrationIds
                : [...cat.integrationIds, customId],
            }
          : cat
      )
    );

    setExpandedCategories(prev => ({ ...prev, [targetCatId]: true }));
    setIsCustomAppModalOpen(false);
    setAddAccountCategory(null);

    if (onShowToast) {
      onShowToast(`Added "${customAppName.trim()}" to workspace`);
    }

    handleOpenSetup(newItem, customAppMethod);
  };

  // Select platform directly from catalog
  const handleSelectCatalogPreset = (preset: PlatformPreset, targetCategory: IntegrationCategory) => {
    VoiceService.triggerHaptic('medium');
    const newId = `${preset.id}_${Date.now()}`;
    const newItem: IntegrationItem = {
      id: newId,
      name: preset.name,
      categoryId: targetCategory.id,
      description: preset.description,
      iconType: preset.iconType,
      status: 'not_connected',
      activeMethod: preset.defaultMethod,
      credentials: {
        accountHandle: 'alexmorgan-ai',
        customEndpoint: preset.defaultEndpoint,
        mcpServerUrl: preset.defaultMethod === 'mcp' ? preset.defaultEndpoint : '',
        scope: preset.suggestedScope || 'read, write, tools',
        apiKey: '',
      },
    };

    setIntegrations(prev => ({
      ...prev,
      [newId]: newItem,
    }));

    setCategories(prev =>
      prev.map(cat =>
        cat.id === targetCategory.id
          ? {
              ...cat,
              integrationIds: cat.integrationIds.includes(newId)
                ? cat.integrationIds
                : [...cat.integrationIds, newId],
            }
          : cat
      )
    );

    setExpandedCategories(prev => ({ ...prev, [targetCategory.id]: true }));
    setAddAccountCategory(null);

    if (onShowToast) {
      onShowToast(`Added "${preset.name}" to ${targetCategory.name}`);
    }

    handleOpenSetup(newItem, preset.defaultMethod);
  };

  // Remove integration completely from category/workspace
  const handleDeleteIntegrationFromCategory = (integrationId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = integrations[integrationId];
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        integrationIds: cat.integrationIds.filter(id => id !== integrationId),
      }))
    );
    setIntegrations(prev => {
      const copy = { ...prev };
      delete copy[integrationId];
      return copy;
    });
    setManageIntegration(null);
    if (onShowToast) {
      onShowToast(`Removed ${target ? target.name : 'Integration'} from workspace`);
    }
  };

  // Open "Create New Category" modal
  const handleOpenCreateCategory = () => {
    VoiceService.triggerHaptic('medium');
    setEditingCategory(null);
    setCategoryFormName('');
    setCategoryFormDesc('');
    setCategoryFormIcon('briefcase');
    setIsCategoryModalOpen(true);
  };

  // Open "Edit Category" modal
  const handleOpenEditCategory = (category: IntegrationCategory) => {
    VoiceService.triggerHaptic('light');
    setEditingCategory(category);
    setCategoryFormName(category.name);
    setCategoryFormDesc(category.description);
    setCategoryFormIcon(category.iconType);
    setIsCategoryModalOpen(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = () => {
    if (!categoryFormName.trim()) return;

    VoiceService.triggerHaptic('medium');

    if (editingCategory) {
      // Update existing category
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: categoryFormName.trim(),
                description: categoryFormDesc.trim() || 'Custom workspace integrations category',
                iconType: categoryFormIcon,
              }
            : cat
        )
      );
      if (onShowToast) onShowToast(`Category updated to "${categoryFormName.trim()}"`);
    } else {
      // Create new category
      const newCatId = `custom_cat_${Date.now()}`;
      const newCategory: IntegrationCategory = {
        id: newCatId,
        name: categoryFormName.trim(),
        description: categoryFormDesc.trim() || 'Custom workspace integrations category',
        iconType: categoryFormIcon,
        integrationIds: [],
      };

      setCategories(prev => [...prev, newCategory]);
      setExpandedCategories(prev => ({ ...prev, [newCatId]: true }));
      if (onShowToast) onShowToast(`Created new category "${categoryFormName.trim()}"`);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (categoryId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = categories.find(c => c.id === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    setIsCategoryModalOpen(false);
    if (onShowToast) onShowToast(`Removed category "${target ? target.name : 'Category'}"`);
  };

  // Open Connection Setup modal for an integration
  const handleOpenSetup = (integration: IntegrationItem, defaultMethod?: ConnectionMethod) => {
    VoiceService.triggerHaptic('medium');
    setSetupIntegration(integration);
    const initialMethod = defaultMethod || integration.activeMethod || 'mcp';
    setActiveSetupMethod(initialMethod);
    setConnectionError(null);
    setTestResult(null);
    setSimulateFailToggle(false);

    const creds = integration.credentials || {};
    setFormData({
      mcpServerUrl:
        creds.mcpServerUrl ||
        (initialMethod === 'mcp' ? `sse://${integration.id}-mcp.internal/v1` : ''),
      mcpTransport: creds.mcpTransport || 'sse',
      mcpAuthToken: creds.mcpAuthToken || `token_${integration.id}_auth_9841`,
      autoDiscoverTools: creds.autoDiscoverTools ?? true,
      apiKey: creds.apiKey || creds.personalAccessToken || `key_${integration.id}_89104`,
      accountHandle: creds.accountHandle || 'alexmorgan-ai',
      scope: creds.scope || 'read, write, tools',
    });
  };

  // Open Manage Connection modal for an already connected integration
  const handleOpenManage = (integration: IntegrationItem) => {
    VoiceService.triggerHaptic('light');
    setManageIntegration(integration);
  };

  // Test Connection
  const handleTestConnection = async () => {
    VoiceService.triggerHaptic('light');
    setIsTesting(true);
    setTestResult(null);
    setConnectionError(null);

    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTesting(false);

    if (simulateFailToggle) {
      setTestResult({
        success: false,
        title: 'Connection Test Failed',
        details: [
          `Server reached: 502 Bad Gateway at ${formData.mcpServerUrl || 'API endpoint'}`,
          'Authentication failed: Invalid credentials or token expired',
          'Tip: Try switching to the other connection method below',
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
      setConnectionError(
        `Could not verify ${activeSetupMethod.toUpperCase()} connection. Please check credentials or switch connection methods.`
      );
    } else {
      setTestResult({
        success: true,
        title: `${activeSetupMethod.toUpperCase()} Connection Verified`,
        details: [
          `Latency: ${Math.floor(Math.random() * 35 + 35)}ms (Optimal)`,
          activeSetupMethod === 'mcp'
            ? 'MCP Protocol: Server-Sent Events (SSE) active • 5 tools discovered'
            : 'API Scopes: Read, Write & Tool Dispatch verified',
          'Local AES-256 Vault: Securely staged for connection',
        ],
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  // Complete Connection Process
  const handleCompleteConnection = async () => {
    if (!setupIntegration) return;

    VoiceService.triggerHaptic('medium');
    setIsSimulatingConnect(true);
    setConnectionError(null);

    setIntegrations(prev => ({
      ...prev,
      [setupIntegration.id]: {
        ...prev[setupIntegration.id],
        status: 'connecting',
      },
    }));

    await new Promise(resolve => setTimeout(resolve, 1100));
    setIsSimulatingConnect(false);

    if (simulateFailToggle) {
      VoiceService.triggerHaptic('heavy');
      setIntegrations(prev => ({
        ...prev,
        [setupIntegration.id]: {
          ...prev[setupIntegration.id],
          status: 'failed',
          failureReason: `${activeSetupMethod.toUpperCase()} connection handshake timed out.`,
        },
      }));
      setConnectionError(
        `Connection failed via ${activeSetupMethod.toUpperCase()}. You can retry or try the other connection method.`
      );
      if (onShowToast) {
        onShowToast(`${setupIntegration.name} connection failed`);
      }
    } else {
      VoiceService.triggerHaptic('heavy');
      const newStatus: ConnectionStatus =
        activeSetupMethod === 'mcp' ? 'connected_mcp' : 'connected_api';

      setIntegrations(prev => ({
        ...prev,
        [setupIntegration.id]: {
          ...prev[setupIntegration.id],
          status: newStatus,
          activeMethod: activeSetupMethod,
          lastConnectedAt: 'Just now',
          toolsDiscovered: activeSetupMethod === 'mcp' ? 5 : 4,
          failureReason: undefined,
          credentials: {
            ...prev[setupIntegration.id].credentials,
            ...formData,
          },
        },
      }));

      if (onShowToast) {
        onShowToast(`${setupIntegration.name} connected via ${activeSetupMethod.toUpperCase()}`);
      }

      setSetupIntegration(null);
      setAddAccountCategory(null);
    }
  };

  // Disconnect an account
  const handleDisconnect = (integrationId: string) => {
    VoiceService.triggerHaptic('heavy');
    const target = integrations[integrationId];
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        status: 'not_connected',
        activeMethod: undefined,
        lastConnectedAt: undefined,
        failureReason: undefined,
      },
    }));

    setManageIntegration(null);
    if (onShowToast) {
      onShowToast(`${target ? target.name : 'Account'} disconnected`);
    }
  };

  // Switch Connection Method
  const handleSwitchMethod = (targetMethod: ConnectionMethod, integration: IntegrationItem) => {
    VoiceService.triggerHaptic('medium');
    setManageIntegration(null);
    handleOpenSetup(integration, targetMethod);
  };

  // Helper to render platform icon with brand colors
  const renderPlatformIcon = (iconType: string, isConnected: boolean, size = 18) => {
    switch (iconType) {
      case 'github':
        return <Code2 size={size} color={isConnected ? '#A78BFA' : colors.textSecondary} />;
      case 'slack':
        return <MessageSquare size={size} color={isConnected ? '#34D399' : colors.textSecondary} />;
      case 'linear':
        return <Layers size={size} color={isConnected ? '#818CF8' : colors.textSecondary} />;
      case 'gmail':
        return <Mail size={size} color={isConnected ? '#F87171' : colors.textSecondary} />;
      case 'calendar':
        return <Calendar size={size} color={isConnected ? '#38BDF8' : colors.textSecondary} />;
      case 'drive':
        return <HardDrive size={size} color={isConnected ? '#FBBF24' : colors.textSecondary} />;
      case 'notion':
        return <FileText size={size} color={isConnected ? '#E2E8F0' : colors.textSecondary} />;
      case 'aws':
        return <Cloud size={size} color={isConnected ? '#F97316' : colors.textSecondary} />;
      case 'cloudflare':
        return <Globe size={size} color={isConnected ? '#F59E0B' : colors.textSecondary} />;
      case 'server':
        return <Server size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'discord':
        return <MessageSquare size={size} color={isConnected ? '#6366F1' : colors.textSecondary} />;
      case 'zoom':
        return <Video size={size} color={isConnected ? '#2563EB' : colors.textSecondary} />;
      case 'linkedin':
        return <Briefcase size={size} color={isConnected ? '#0A66C2' : colors.textSecondary} />;
      case 'naukri':
        return <Briefcase size={size} color={isConnected ? '#3B82F6' : colors.textSecondary} />;
      case 'workindia':
        return <Briefcase size={size} color={isConnected ? '#10B981' : colors.textSecondary} />;
      case 'jira':
        return <Layers size={size} color={isConnected ? '#0052CC' : colors.textSecondary} />;
      case 'gitlab':
        return <Code2 size={size} color={isConnected ? '#FC6D26' : colors.textSecondary} />;
      case 'asana':
        return <CheckCircle2 size={size} color={isConnected ? '#F06A6A' : colors.textSecondary} />;
      case 'trello':
        return <Layers size={size} color={isConnected ? '#0079BF' : colors.textSecondary} />;
      case 'whatsapp':
        return <MessageSquare size={size} color={isConnected ? '#25D366' : colors.textSecondary} />;
      case 'teams':
        return <MessageSquare size={size} color={isConnected ? '#6264A7' : colors.textSecondary} />;
      case 'gcp':
        return <Cloud size={size} color={isConnected ? '#4285F4' : colors.textSecondary} />;
      case 'azure':
        return <Cloud size={size} color={isConnected ? '#0078D4' : colors.textSecondary} />;
      case 'supabase':
        return <Database size={size} color={isConnected ? '#3ECF8E' : colors.textSecondary} />;
      case 'telegram':
        return <MessageSquare size={size} color={isConnected ? '#229ED9' : colors.textSecondary} />;
      case 'globe':
        return <Globe size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'briefcase':
        return <Briefcase size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'code':
        return <Code2 size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'message':
        return <MessageSquare size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'database':
        return <Database size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      case 'sparkles':
        return <Sparkles size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
      default:
        return <Zap size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    }
  };

  // Helper to render category icon
  const renderCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'code':
        return <Code2 size={16} color={colors.primary} />;
      case 'sparkles':
        return <Sparkles size={16} color={colors.primary} />;
      case 'cloud':
        return <Cloud size={16} color={colors.primary} />;
      case 'briefcase':
        return <Briefcase size={16} color={colors.primary} />;
      case 'database':
        return <Database size={16} color={colors.primary} />;
      case 'globe':
        return <Globe size={16} color={colors.primary} />;
      default:
        return <FolderPlus size={16} color={colors.primary} />;
    }
  };

  // Count connected accounts in a category
  const getConnectedCount = (category: IntegrationCategory): number => {
    return category.integrationIds.filter(id => {
      const item = integrations[id];
      return item && (item.status === 'connected_mcp' || item.status === 'connected_api');
    }).length;
  };

  return (
    <View style={styles.container}>
      {/* Top Action Bar: Add Category & Management */}
      <View style={styles.topActionBar}>
        <View style={styles.categoryCountInfo}>
          <Text style={styles.categoryCountText}>
            {categories.length} Categories • Organized Workspace
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newCategoryBtn}
          onPress={handleOpenCreateCategory}
          activeOpacity={0.8}
        >
          <Plus size={12} color={colors.buttonTextDark} />
          <Text style={styles.newCategoryBtnText}>New Category</Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      {categories.map(category => {
        const isExpanded = !!expandedCategories[category.id];
        const connectedCount = getConnectedCount(category);

        return (
          <View key={category.id} style={styles.categoryCard}>
            {/* Category Header */}
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.8}
            >
              {/* Row 1: Icon, Title, Connected Badge, Edit & Chevron */}
              <View style={styles.headerTopRow}>
                <View style={styles.headerTitleGroup}>
                  <View style={styles.categoryIconCircle}>
                    {renderCategoryIcon(category.iconType)}
                  </View>
                  <Text style={styles.categoryTitle} numberOfLines={1}>
                    {category.name}
                  </Text>
                </View>

                <View style={styles.headerRightGroup}>
                  {/* Connected Count Badge */}
                  <View style={[styles.countBadge, connectedCount > 0 && styles.countBadgeActive]}>
                    <Text
                      style={[styles.countBadgeText, connectedCount > 0 && styles.countBadgeTextActive]}
                    >
                      {connectedCount > 0 ? `${connectedCount} Connected` : '0 Linked'}
                    </Text>
                  </View>

                  {/* Edit Category Button */}
                  <TouchableOpacity
                    style={styles.categoryEditIconBtn}
                    onPress={e => {
                      e.stopPropagation();
                      handleOpenEditCategory(category);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Pencil size={13} color={colors.textSecondary} />
                  </TouchableOpacity>

                  {/* Expand / Collapse Chevron */}
                  <View style={styles.chevronBox}>
                    {isExpanded ? (
                      <ChevronUp size={16} color={colors.textSecondary} />
                    ) : (
                      <ChevronDown size={16} color={colors.textSecondary} />
                    )}
                  </View>
                </View>
              </View>

              {/* Row 2: Description & Add Account Button */}
              <View style={styles.headerBottomRow}>
                <Text style={styles.categorySub} numberOfLines={1}>
                  {category.description}
                </Text>

                <TouchableOpacity
                  style={styles.headerAddBtn}
                  onPress={e => {
                    e.stopPropagation();
                    handleOpenAddAccount(category);
                  }}
                  activeOpacity={0.7}
                >
                  <Plus size={11} color={colors.buttonTextDark} />
                  <Text style={styles.headerAddBtnText}>Add Account</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Expandable Content: Sleek Unified List UI (Point 1) */}
            {isExpanded && (
              <View style={styles.categoryBody}>
                {category.integrationIds.length === 0 ? (
                  <View style={styles.emptyCategoryBox}>
                    <Text style={styles.emptyCategoryTitle}>Category Ready</Text>
                    <Text style={styles.emptyCategorySub}>
                      No accounts linked yet. Click "+ Add Account" above to link services.
                    </Text>
                  </View>
                ) : (
                  category.integrationIds.map((integrationId, index) => {
                    const integration = integrations[integrationId];
                    if (!integration) return null;

                    const isMcp = integration.status === 'connected_mcp';
                    const isApi = integration.status === 'connected_api';
                    const isConnected = isMcp || isApi;
                    const isConnecting = integration.status === 'connecting';
                    const isFailed = integration.status === 'failed';
                    const isLast = index === category.integrationIds.length - 1;

                    return (
                      <View
                        key={integration.id}
                        style={[
                          styles.accountListItem,
                          !isLast && styles.accountListItemBorder,
                          isConnected && styles.accountListItemActive,
                        ]}
                      >
                        {/* Left: Platform Icon in sleek squircle */}
                        <View
                          style={[
                            styles.platformIconSquircle,
                            isConnected && styles.platformIconSquircleActive,
                          ]}
                        >
                          {renderPlatformIcon(integration.iconType, isConnected, 18)}
                        </View>

                        {/* Center: Info with single clean status badge (Point 1 fix) */}
                        <View style={styles.accountItemMiddle}>
                          <View style={styles.accountNameRow}>
                            <Text style={styles.accountItemName} numberOfLines={1}>
                              {integration.name}
                            </Text>

                            {/* Single Clean Status Pill (No Repetitive Text) */}
                            {isConnected ? (
                              <View
                                style={[
                                  styles.activeStatusPill,
                                  isMcp ? styles.mcpPill : styles.apiPill,
                                ]}
                              >
                                {isMcp ? (
                                  <>
                                    <Zap size={9} color={colors.primary} />
                                    <Text style={styles.mcpPillText}>MCP Active</Text>
                                  </>
                                ) : (
                                  <>
                                    <Key size={9} color="#06B6D4" />
                                    <Text style={styles.apiPillText}>API Active</Text>
                                  </>
                                )}
                              </View>
                            ) : isFailed ? (
                              <View style={styles.failedStatusPill}>
                                <AlertCircle size={9} color={colors.danger} />
                                <Text style={styles.failedPillText}>Error</Text>
                              </View>
                            ) : null}
                          </View>

                          {/* Subtitle: Account handle or purpose */}
                          <Text style={styles.accountItemSub} numberOfLines={1}>
                            {isConnected && integration.credentials?.accountHandle
                              ? `@${integration.credentials.accountHandle} • Active & Synced`
                              : integration.description}
                          </Text>
                        </View>

                        {/* Right: Clean Action Button */}
                        <View style={styles.accountItemAction}>
                          {isConnected ? (
                            <TouchableOpacity
                              style={styles.managePillBtn}
                              onPress={() => handleOpenManage(integration)}
                              activeOpacity={0.7}
                            >
                              <Settings2 size={12} color={colors.primary} />
                              <Text style={styles.managePillBtnText}>Manage</Text>
                            </TouchableOpacity>
                          ) : isConnecting ? (
                            <View style={styles.connectingPlaceholder}>
                              <ActivityIndicator size="small" color={colors.primary} />
                            </View>
                          ) : (
                            <TouchableOpacity
                              style={[styles.connectPillBtn, isFailed && styles.retryPillBtn]}
                              onPress={() => handleOpenSetup(integration)}
                              activeOpacity={0.7}
                            >
                              {isFailed ? (
                                <>
                                  <RefreshCw size={11} color={colors.danger} />
                                  <Text style={styles.retryPillBtnText}>Retry</Text>
                                </>
                              ) : (
                                <>
                                  <Plus size={12} color={colors.buttonTextDark} />
                                  <Text style={styles.connectPillBtnText}>Connect</Text>
                                </>
                              )}
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
        );
      })}

      {/* ==================================================================== */}
      {/* MODAL: CREATE OR EDIT CATEGORY (Point 3)                             */}
      {/* ==================================================================== */}
      <Modal
        visible={isCategoryModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCategoryModalOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheetModal}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <FolderPlus size={18} color={colors.primary} />
                <View>
                  <Text style={styles.sheetTitle}>
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </Text>
                  <Text style={styles.sheetSub}>
                    Organize and group integrations in Alex's workspace
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsCategoryModalOpen(false)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.categoryFormContent}>
              <Text style={styles.inputLabel}>CATEGORY NAME</Text>
              <TextInput
                style={styles.textInput}
                value={categoryFormName}
                onChangeText={setCategoryFormName}
                placeholder="e.g. Finance & Analytics"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                style={styles.textInput}
                value={categoryFormDesc}
                onChangeText={setCategoryFormDesc}
                placeholder="e.g. Invoicing, subscription billing & balance sync"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>CATEGORY ICON</Text>
              <View style={styles.iconSelectorRow}>
                {[
                  { id: 'code', label: 'Code', icon: <Code2 size={16} /> },
                  { id: 'briefcase', label: 'Work', icon: <Briefcase size={16} /> },
                  { id: 'sparkles', label: 'AI', icon: <Sparkles size={16} /> },
                  { id: 'cloud', label: 'Cloud', icon: <Cloud size={16} /> },
                  { id: 'database', label: 'Data', icon: <Database size={16} /> },
                  { id: 'globe', label: 'Web', icon: <Globe size={16} /> },
                ].map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.iconSelectorBtn,
                      categoryFormIcon === item.id && styles.iconSelectorBtnActive,
                    ]}
                    onPress={() => setCategoryFormIcon(item.id as any)}
                  >
                    {React.cloneElement(item.icon, {
                      color: categoryFormIcon === item.id ? colors.primary : colors.textSecondary,
                    })}
                    <Text
                      style={[
                        styles.iconSelectorLabel,
                        categoryFormIcon === item.id && styles.iconSelectorLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.categoryActionRow}>
                {editingCategory && (
                  <TouchableOpacity
                    style={styles.deleteCategoryBtn}
                    onPress={() => handleDeleteCategory(editingCategory.id)}
                  >
                    <Trash2 size={14} color={colors.danger} />
                    <Text style={styles.deleteCategoryBtnText}>Delete</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.saveCategoryBtn, !categoryFormName.trim() && { opacity: 0.5 }]}
                  onPress={handleSaveCategory}
                  disabled={!categoryFormName.trim()}
                >
                  <Check size={16} color={colors.buttonTextDark} />
                  <Text style={styles.saveCategoryBtnText}>
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD ACCOUNT DIALOG (Filtered to Specific Category)          */}
      {/* ==================================================================== */}
      <Modal
        visible={!!addAccountCategory}
        transparent
        animationType="slide"
        onRequestClose={() => setAddAccountCategory(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheetModal}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <Plus size={18} color={colors.primary} />
                <View>
                  <Text style={styles.sheetTitle}>Add Account: {addAccountCategory?.name}</Text>
                  <Text style={styles.sheetSub}>
                    Connect a new application, job platform, or workspace service
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setAddAccountCategory(null)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.dialogScroll}>
              {/* Highlight Action Card: Connect New Platform / App */}
              <TouchableOpacity
                style={styles.customPromoCard}
                onPress={() => {
                  if (addAccountCategory) {
                    handleOpenCustomAppModal(addAccountCategory.id);
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.customPromoIconBox}>
                  <Plus size={18} color={colors.buttonTextDark} />
                </View>
                <View style={styles.customPromoContent}>
                  <View style={styles.customPromoHeaderRow}>
                    <Text style={styles.customPromoTitle} numberOfLines={1}>
                      Connect New Platform
                    </Text>
                    <View style={styles.newPill}>
                      <Text style={styles.newPillText}>CUSTOM</Text>
                    </View>
                  </View>
                  <Text style={styles.customPromoSub} numberOfLines={2}>
                    Link LinkedIn, Naukri, WorkIndia, or any custom app
                  </Text>
                </View>
                <View style={styles.customPromoArrowBox}>
                  <ChevronRight size={18} color={colors.primary} />
                </View>
              </TouchableOpacity>

              {/* Popular Platforms Catalog (LinkedIn, Naukri, WorkIndia, Jira, etc.) */}
              {(() => {
                if (!addAccountCategory) return null;

                const filteredCatalog = POPULAR_PLATFORM_CATALOG.filter(preset => {
                  // Do not show if already connected in the workspace
                  const isAlreadyConnected = Object.values(integrations).some(item => {
                    const isMatch =
                      item.id === preset.id ||
                      item.id.startsWith(`${preset.id}_`) ||
                      item.name.toLowerCase() === preset.name.toLowerCase();
                    const isConnected =
                      item.status === 'connected_mcp' || item.status === 'connected_api';
                    return isMatch && isConnected;
                  });
                  return !isAlreadyConnected;
                });

                return (
                  <View style={{ marginBottom: 14 }}>
                    <Text style={styles.dialogSectionHeader}>
                      POPULAR PLATFORMS & SERVICES TO CONNECT
                    </Text>
                    {filteredCatalog.map(preset => (
                      <TouchableOpacity
                        key={preset.id}
                        style={styles.dialogOptionRow}
                        onPress={() => handleSelectCatalogPreset(preset, addAccountCategory)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.dialogIconBox}>
                          {renderPlatformIcon(preset.iconType, true, 20)}
                        </View>
                        <View style={styles.dialogOptionCol}>
                          <View style={styles.dialogTitleRow}>
                            <Text style={styles.dialogOptionTitle}>{preset.name}</Text>
                            <View style={styles.tagPill}>
                              <Text style={styles.tagPillText}>{preset.categoryTag}</Text>
                            </View>
                          </View>
                          <Text style={styles.dialogOptionSub}>{preset.description}</Text>
                        </View>
                        <View style={styles.dialogActionArrow}>
                          <Plus size={16} color={colors.primary} />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })()}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelFooterBtn}
              onPress={() => setAddAccountCategory(null)}
            >
              <Text style={styles.cancelFooterBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL 2: CONNECTION SETUP DIALOG (Fixed Overlap & Sizing)            */}
      {/* ==================================================================== */}
      <Modal
        visible={!!setupIntegration}
        transparent
        animationType="slide"
        onRequestClose={() => setSetupIntegration(null)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.sheetModal, { maxHeight: '92%' }]}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                {setupIntegration && renderPlatformIcon(setupIntegration.iconType, true, 20)}
                <View>
                  <Text style={styles.sheetTitle}>Connect {setupIntegration?.name}</Text>
                  <Text style={styles.sheetSub}>Choose MCP or API connection method</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSetupIntegration(null)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.dialogScroll}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Method Switcher */}
              <View style={styles.methodSwitcherContainer}>
                <Text style={styles.inputLabel}>CONNECTION METHOD</Text>
                <View style={styles.segmentedControl}>
                  <TouchableOpacity
                    style={[
                      styles.segmentBtn,
                      activeSetupMethod === 'mcp' && styles.segmentBtnActive,
                    ]}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setActiveSetupMethod('mcp');
                      setTestResult(null);
                      setConnectionError(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Zap
                      size={14}
                      color={activeSetupMethod === 'mcp' ? colors.buttonTextDark : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.segmentBtnText,
                        activeSetupMethod === 'mcp' && styles.segmentBtnTextActive,
                      ]}
                    >
                      MCP Connection
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.segmentBtn,
                      activeSetupMethod === 'api' && styles.segmentBtnActive,
                    ]}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      setActiveSetupMethod('api');
                      setTestResult(null);
                      setConnectionError(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Key
                      size={14}
                      color={activeSetupMethod === 'api' ? colors.buttonTextDark : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.segmentBtnText,
                        activeSetupMethod === 'api' && styles.segmentBtnTextActive,
                      ]}
                    >
                      API Connection
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Method Explainer Box */}
                <View style={styles.methodExplainerBox}>
                  {activeSetupMethod === 'mcp' ? (
                    <Text style={styles.methodExplainerText}>
                      ⚡{' '}
                      <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                        Model Context Protocol (MCP)
                      </Text>
                      : Dynamically exposes tools & resources to MIRAS AI agents. Only one method is active at a time.
                    </Text>
                  ) : (
                    <Text style={styles.methodExplainerText}>
                      🔑{' '}
                      <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                        REST / GraphQL API
                      </Text>
                      : Connects via direct personal tokens or OAuth credentials. Only one method is active at a time.
                    </Text>
                  )}
                </View>
              </View>

              {/* Dynamic Credentials Form */}
              {activeSetupMethod === 'mcp' ? (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>MCP SERVER ENDPOINT URL</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.mcpServerUrl}
                    onChangeText={text => setFormData({ ...formData, mcpServerUrl: text })}
                    placeholder={`sse://${setupIntegration?.id}-mcp.internal/v1`}
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabel}>TRANSPORT PROTOCOL</Text>
                  <View style={styles.pillSelectorRow}>
                    {['sse', 'http_stream', 'websocket'].map(protocol => (
                      <TouchableOpacity
                        key={protocol}
                        style={[
                          styles.selectorPill,
                          formData.mcpTransport === protocol && styles.selectorPillActive,
                        ]}
                        onPress={() => setFormData({ ...formData, mcpTransport: protocol })}
                      >
                        <Text
                          style={[
                            styles.selectorPillText,
                            formData.mcpTransport === protocol && styles.selectorPillTextActive,
                          ]}
                        >
                          {protocol.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>AUTHENTICATION BEARER TOKEN</Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                      value={formData.mcpAuthToken}
                      onChangeText={text => setFormData({ ...formData, mcpAuthToken: text })}
                      placeholder="Bearer token or authorization header"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showSecrets.mcpToken}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() =>
                        setShowSecrets({ ...showSecrets, mcpToken: !showSecrets.mcpToken })
                      }
                    >
                      {showSecrets.mcpToken ? (
                        <EyeOff size={18} color={colors.textSecondary} />
                      ) : (
                        <Eye size={18} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchTextCol}>
                      <Text style={styles.switchTitle}>Auto-Discover Tools</Text>
                      <Text style={styles.switchSub}>
                        Introspect capabilities during agent execution
                      </Text>
                    </View>
                    <Switch
                      value={formData.autoDiscoverTools}
                      onValueChange={val => setFormData({ ...formData, autoDiscoverTools: val })}
                      trackColor={{ false: colors.surfaceBorder, true: colors.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>ACCOUNT / ORG IDENTIFIER</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.accountHandle}
                    onChangeText={text => setFormData({ ...formData, accountHandle: text })}
                    placeholder="alexmorgan-ai"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabel}>
                    {setupIntegration?.id === 'github'
                      ? 'PERSONAL ACCESS TOKEN (PAT)'
                      : setupIntegration?.id === 'slack'
                      ? 'BOT USER OAUTH TOKEN'
                      : setupIntegration?.id === 'linear'
                      ? 'LINEAR API KEY'
                      : setupIntegration?.id === 'notion'
                      ? 'INTERNAL INTEGRATION SECRET'
                      : 'API / OAUTH ACCESS TOKEN'}
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                      value={formData.apiKey}
                      onChangeText={text => setFormData({ ...formData, apiKey: text })}
                      placeholder="Secret key or token"
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showSecrets.apiKey}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() =>
                        setShowSecrets({ ...showSecrets, apiKey: !showSecrets.apiKey })
                      }
                    >
                      {showSecrets.apiKey ? (
                        <EyeOff size={18} color={colors.textSecondary} />
                      ) : (
                        <Eye size={18} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.inputLabel}>PERMISSION SCOPES</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.scope}
                    onChangeText={text => setFormData({ ...formData, scope: text })}
                    placeholder="repo, read:org, tools"
                    placeholderTextColor={colors.textSecondary}
                    autoCapitalize="none"
                  />
                </View>
              )}

              {/* Point 2 Fix: No Overlap in Validation & Diagnostic Test */}
              <View style={styles.testActionsCard}>
                <View style={styles.testHeaderRow}>
                  <View style={styles.testHeaderLeft}>
                    <Activity size={14} color={colors.primary} />
                    <Text style={styles.testHeaderTitle} numberOfLines={1}>
                      System Diagnostics
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.runTestBtn}
                    onPress={handleTestConnection}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <>
                        <RefreshCw size={11} color={colors.primary} />
                        <Text style={styles.runTestBtnText}>Test Connection</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Simulate Failure Switch */}
                <View style={styles.simulateRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.simulateTitle}>Simulate Handshake Failure</Text>
                    <Text style={styles.simulateSub}>Verify error state & method fallback</Text>
                  </View>
                  <Switch
                    value={simulateFailToggle}
                    onValueChange={setSimulateFailToggle}
                    trackColor={{ false: colors.surfaceBorder, true: colors.danger }}
                    thumbColor="#fff"
                  />
                </View>

                {/* Test Result Card */}
                {testResult && (
                  <View
                    style={[
                      styles.testResultBox,
                      testResult.success ? styles.testResultSuccess : styles.testResultError,
                    ]}
                  >
                    <View style={styles.testResultHeader}>
                      {testResult.success ? (
                        <CheckCircle2 size={15} color={colors.success} />
                      ) : (
                        <AlertCircle size={15} color={colors.danger} />
                      )}
                      <Text
                        style={[
                          styles.testResultTitle,
                          { color: testResult.success ? colors.success : colors.danger },
                        ]}
                      >
                        {testResult.title}
                      </Text>
                    </View>
                    {testResult.details.map((detail, idx) => (
                      <Text key={idx} style={styles.testResultDetailText}>
                        • {detail}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Error Banner with Switch Method Button */}
                {connectionError && (
                  <View style={styles.errorBanner}>
                    <AlertCircle size={15} color={colors.danger} />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.errorBannerText}>{connectionError}</Text>
                      <TouchableOpacity
                        style={styles.errorSwitchBtn}
                        onPress={() => {
                          const otherMethod: ConnectionMethod =
                            activeSetupMethod === 'mcp' ? 'api' : 'mcp';
                          setActiveSetupMethod(otherMethod);
                          setSimulateFailToggle(false);
                          setConnectionError(null);
                          setTestResult(null);
                        }}
                      >
                        <ArrowRightLeft size={11} color={colors.primary} />
                        <Text style={styles.errorSwitchBtnText}>
                          Try {activeSetupMethod === 'mcp' ? 'API Connection' : 'MCP Connection'} Instead
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.footerActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setSetupIntegration(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitConnectBtn}
                  onPress={handleCompleteConnection}
                  disabled={isSimulatingConnect}
                >
                  {isSimulatingConnect ? (
                    <ActivityIndicator size="small" color={colors.buttonTextDark} />
                  ) : (
                    <>
                      <Check size={16} color={colors.buttonTextDark} />
                      <Text style={styles.submitConnectBtnText}>
                        Connect via {activeSetupMethod.toUpperCase()}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL 3: MANAGE CONNECTION DIALOG (Switch Method & Disconnect)       */}
      {/* ==================================================================== */}
      <Modal
        visible={!!manageIntegration}
        transparent
        animationType="slide"
        onRequestClose={() => setManageIntegration(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheetModal}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                {manageIntegration && renderPlatformIcon(manageIntegration.iconType, true, 22)}
                <View>
                  <Text style={styles.sheetTitle}>Manage {manageIntegration?.name}</Text>
                  <Text style={styles.sheetSub}>
                    Active Connection: {manageIntegration?.activeMethod?.toUpperCase()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setManageIntegration(null)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.dialogScroll}>
              <View style={styles.overviewCard}>
                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Connection Method</Text>
                  <View
                    style={[
                      styles.activeStatusPill,
                      manageIntegration?.activeMethod === 'mcp' ? styles.mcpPill : styles.apiPill,
                    ]}
                  >
                    {manageIntegration?.activeMethod === 'mcp' ? (
                      <>
                        <Zap size={10} color={colors.primary} />
                        <Text style={styles.mcpPillText}>MCP Connection</Text>
                      </>
                    ) : (
                      <>
                        <Key size={10} color="#06B6D4" />
                        <Text style={styles.apiPillText}>API Connection</Text>
                      </>
                    )}
                  </View>
                </View>

                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Status</Text>
                  <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.statusText, { color: colors.success }]}>
                      Online & Healthy
                    </Text>
                  </View>
                </View>

                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Discovered Tools</Text>
                  <Text style={styles.overviewValue}>
                    {manageIntegration?.toolsDiscovered || 4} Tools Available
                  </Text>
                </View>

                <View style={styles.overviewRow}>
                  <Text style={styles.overviewLabel}>Last Connected</Text>
                  <Text style={styles.overviewValue}>
                    {manageIntegration?.lastConnectedAt || 'Today'}
                  </Text>
                </View>
              </View>

              {/* Switch Connection Method */}
              <View style={styles.switchMethodCard}>
                <View style={styles.switchMethodHeader}>
                  <ArrowRightLeft size={16} color={colors.primary} />
                  <Text style={styles.switchMethodTitle}>Switch Connection Method</Text>
                </View>
                <Text style={styles.switchMethodDesc}>
                  Switching will replace your active{' '}
                  <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                    {manageIntegration?.activeMethod?.toUpperCase()}
                  </Text>{' '}
                  connection with a{' '}
                  <Text style={{ fontWeight: '700', color: colors.primary }}>
                    {manageIntegration?.activeMethod === 'mcp' ? 'API' : 'MCP'}
                  </Text>{' '}
                  connection. Only one method can be active at a time.
                </Text>

                <TouchableOpacity
                  style={styles.switchMethodBtn}
                  onPress={() => {
                    if (!manageIntegration) return;
                    const nextMethod: ConnectionMethod =
                      manageIntegration.activeMethod === 'mcp' ? 'api' : 'mcp';
                    handleSwitchMethod(nextMethod, manageIntegration);
                  }}
                  activeOpacity={0.8}
                >
                  <ArrowRightLeft size={14} color={colors.buttonTextDark} />
                  <Text style={styles.switchMethodBtnText}>
                    Switch to {manageIntegration?.activeMethod === 'mcp' ? 'API' : 'MCP'} Connection
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Disconnect & Remove */}
              <View style={styles.disconnectCard}>
                <TouchableOpacity
                  style={styles.disconnectBtn}
                  onPress={() => {
                    if (manageIntegration) {
                      handleDisconnect(manageIntegration.id);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Trash2 size={14} color={colors.danger} />
                  <Text style={styles.disconnectBtnText}>Disconnect Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeFromCategoryBtn}
                  onPress={() => {
                    if (manageIntegration) {
                      handleDeleteIntegrationFromCategory(manageIntegration.id);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <X size={13} color={colors.textSecondary} />
                  <Text style={styles.removeFromCategoryBtnText}>Remove from Workspace</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* MODAL 5: CUSTOM PLATFORM & APP CONNECTOR (LinkedIn, Naukri, etc.)    */}
      {/* ==================================================================== */}
      <Modal
        visible={isCustomAppModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsCustomAppModalOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheetModal}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <Sparkles size={18} color={colors.primary} />
                <View>
                  <Text style={styles.sheetTitle}>Connect Platform or App</Text>
                  <Text style={styles.sheetSub}>
                    Link LinkedIn, Naukri, WorkIndia, custom web app, or MCP server
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsCustomAppModalOpen(false)}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.dialogScroll}>
              {/* Platform / App Name */}
              <Text style={styles.inputLabel}>APPLICATION / PLATFORM NAME *</Text>
              <TextInput
                style={styles.textInput}
                value={customAppName}
                onChangeText={setCustomAppName}
                placeholder="e.g. LinkedIn, Naukri, WorkIndia, Custom Portal..."
                placeholderTextColor={colors.textMuted}
              />

              {/* Application Link / Endpoint URL */}
              <Text style={styles.inputLabel}>APPLICATION LINK / SERVER URL (OPTIONAL)</Text>
              <TextInput
                style={styles.textInput}
                value={customAppUrl}
                onChangeText={setCustomAppUrl}
                placeholder="e.g. https://recruiter.naukri.com/api or sse://server/v1"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />

              {/* Description */}
              <Text style={styles.inputLabel}>DESCRIPTION / ROLE</Text>
              <TextInput
                style={styles.textInput}
                value={customAppDesc}
                onChangeText={setCustomAppDesc}
                placeholder="e.g. Candidate hiring, job alert sync & messaging"
                placeholderTextColor={colors.textMuted}
              />

              {/* Category Picker */}
              <Text style={styles.inputLabel}>ASSIGN TO WORKSPACE CATEGORY</Text>
              <View style={styles.categoryPickerRow}>
                {categories.map(cat => {
                  const isSelected = customAppCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryPickerChip,
                        isSelected && styles.categoryPickerChipActive,
                      ]}
                      onPress={() => setCustomAppCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      {renderCategoryIcon(cat.iconType)}
                      <Text
                        style={[
                          styles.categoryPickerChipText,
                          isSelected && styles.categoryPickerChipTextActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Platform Icon */}
              <Text style={styles.inputLabel}>PLATFORM ICON</Text>
              <View style={styles.iconSelectorRow}>
                {[
                  { id: 'briefcase', label: 'Jobs', icon: <Briefcase size={16} /> },
                  { id: 'globe', label: 'Web', icon: <Globe size={16} /> },
                  { id: 'code', label: 'Dev', icon: <Code2 size={16} /> },
                  { id: 'message', label: 'Chat', icon: <MessageSquare size={16} /> },
                  { id: 'sparkles', label: 'AI', icon: <Sparkles size={16} /> },
                  { id: 'server', label: 'MCP', icon: <Server size={16} /> },
                  { id: 'database', label: 'Data', icon: <Database size={16} /> },
                  { id: 'cloud', label: 'Cloud', icon: <Cloud size={16} /> },
                ].map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.iconSelectorBtn,
                      customAppIcon === item.id && styles.iconSelectorBtnActive,
                    ]}
                    onPress={() => setCustomAppIcon(item.id)}
                  >
                    {React.cloneElement(item.icon, {
                      color: customAppIcon === item.id ? colors.primary : colors.textSecondary,
                    })}
                    <Text
                      style={[
                        styles.iconSelectorLabel,
                        customAppIcon === item.id && styles.iconSelectorLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Connection Protocol Segment */}
              <Text style={styles.inputLabel}>CONNECTION PROTOCOL</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    customAppMethod === 'api' && styles.segmentBtnActive,
                  ]}
                  onPress={() => setCustomAppMethod('api')}
                >
                  <Key
                    size={14}
                    color={customAppMethod === 'api' ? colors.buttonTextDark : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.segmentBtnText,
                      customAppMethod === 'api' && styles.segmentBtnTextActive,
                    ]}
                  >
                    API / OAuth / Webhook
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    customAppMethod === 'mcp' && styles.segmentBtnActive,
                  ]}
                  onPress={() => setCustomAppMethod('mcp')}
                >
                  <Server
                    size={14}
                    color={customAppMethod === 'mcp' ? colors.buttonTextDark : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.segmentBtnText,
                      customAppMethod === 'mcp' && styles.segmentBtnTextActive,
                    ]}
                  >
                    MCP Server (SSE / Stdio)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={[styles.footerActionRow, { marginTop: 16 }]}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsCustomAppModalOpen(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitConnectBtn,
                    !customAppName.trim() && { opacity: 0.5 },
                  ]}
                  onPress={handleSaveCustomApp}
                  disabled={!customAppName.trim()}
                >
                  <Check size={16} color={colors.buttonTextDark} />
                  <Text style={styles.submitConnectBtnText}>
                    Continue to Setup →
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      gap: 12,
    },
    topActionBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
      marginBottom: 2,
    },
    categoryCountInfo: {
      flex: 1,
    },
    categoryCountText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    newCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 5.5,
      borderRadius: 9,
      backgroundColor: colors.primary,
    },
    newCategoryBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },

    // Category Card & 2-Row Header
    categoryCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      overflow: 'hidden',
    },
    categoryHeader: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      backgroundColor: colors.cardBgElevated,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerTitleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 0,
      marginRight: 8,
    },
    categoryIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 9,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    categoryTitle: {
      fontSize: 14.5,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: 0.2,
      flexShrink: 1,
    },
    headerRightGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },
    countBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    countBadgeActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    countBadgeText: {
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    countBadgeTextActive: {
      color: colors.primary,
    },
    categoryEditIconBtn: {
      width: 24,
      height: 24,
      borderRadius: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chevronBox: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.04)',
      width: '100%',
    },
    categorySub: {
      fontSize: 11,
      color: colors.textSecondary,
      flex: 1,
      minWidth: 0,
      marginRight: 10,
    },
    headerAddBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4.5,
      borderRadius: 8,
      backgroundColor: colors.primary,
      flexShrink: 0,
    },
    headerAddBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },

    // Category Body: Redesigned Clean Account List (Point 1 Fix)
    categoryBody: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: colors.cardBg,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorder,
    },
    emptyCategoryBox: {
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyCategoryTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    emptyCategorySub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    accountListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 11,
    },
    accountListItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    },
    accountListItemActive: {
      // Subtle glow effect
    },
    platformIconSquircle: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      flexShrink: 0,
    },
    platformIconSquircleActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    accountItemMiddle: {
      flex: 1,
      minWidth: 0,
      marginRight: 10,
    },
    accountNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    accountItemName: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    activeStatusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
    },
    mcpPill: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    apiPill: {
      backgroundColor: 'rgba(6, 182, 212, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    mcpPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    apiPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#06B6D4',
      letterSpacing: 0.3,
    },
    failedStatusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    failedPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.danger,
    },
    accountItemSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    accountItemAction: {
      alignItems: 'flex-end',
      flexShrink: 0,
    },
    connectPillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 8,
    },
    connectPillBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    retryPillBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.35)',
    },
    retryPillBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.danger,
    },
    managePillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5.5,
      borderRadius: 8,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    managePillBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    connectingPlaceholder: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },

    // Category Form Modal
    categoryFormContent: {
      padding: 20,
    },
    iconSelectorRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 18,
      flexWrap: 'wrap',
    },
    iconSelectorBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    iconSelectorBtnActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: colors.primary,
    },
    iconSelectorLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    iconSelectorLabelActive: {
      color: colors.primary,
    },
    categoryActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
    },
    deleteCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 11,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    deleteCategoryBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.danger,
    },
    saveCategoryBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 11,
      backgroundColor: colors.primary,
    },
    saveCategoryBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },

    // Modal / Sheets
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      justifyContent: 'flex-end',
    },
    sheetModal: {
      backgroundColor: colors.cardBgElevated,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      paddingBottom: 24,
      maxHeight: '88%',
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
    },
    sheetHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    sheetTitle: {
      fontSize: 15.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sheetSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogScroll: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    dialogOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 10,
    },
    dialogOptionRowConnected: {
      borderColor: 'rgba(16, 185, 129, 0.3)',
      backgroundColor: 'rgba(16, 185, 129, 0.04)',
    },
    dialogIconBox: {
      width: 40,
      height: 40,
      borderRadius: 11,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    dialogOptionCol: {
      flex: 1,
      marginRight: 8,
    },
    dialogTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dialogOptionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    alreadyLinkedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
    },
    alreadyLinkedText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.success,
    },
    dialogOptionSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    dialogActionArrow: {
      padding: 4,
    },
    cancelFooterBtn: {
      marginHorizontal: 20,
      marginTop: 6,
      paddingVertical: 12,
      borderRadius: 11,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    cancelFooterBtnText: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    // Custom Platform Highlight Card (Perfect Alignment for all screens)
    customPromoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.35)',
      marginBottom: 14,
    },
    customPromoIconBox: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    customPromoContent: {
      flex: 1,
      minWidth: 0,
      marginLeft: 11,
      marginRight: 6,
    },
    customPromoHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },
    customPromoTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    newPill: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.4)',
      flexShrink: 0,
    },
    newPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    customPromoSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 3,
      lineHeight: 15,
    },
    customPromoArrowBox: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    dialogSectionHeader: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textMuted,
      letterSpacing: 0.8,
      marginTop: 4,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    tagPill: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    tagPillText: {
      fontSize: 9.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    categoryPickerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 10,
    },
    categoryPickerChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: colors.cardBgElevated,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    categoryPickerChipActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: colors.primary,
    },
    categoryPickerChipText: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    categoryPickerChipTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    removeFromCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      marginTop: 8,
    },
    removeFromCategoryBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    // Method Switcher & Form
    methodSwitcherContainer: {
      marginBottom: 14,
    },
    inputLabel: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 6,
      marginTop: 10,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    segmentBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 9,
      borderRadius: 9,
    },
    segmentBtnActive: {
      backgroundColor: colors.primary,
    },
    segmentBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    segmentBtnTextActive: {
      color: colors.buttonTextDark,
    },
    methodExplainerBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    methodExplainerText: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    formGroup: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 14,
    },
    textInput: {
      backgroundColor: colors.cardBgElevated,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 13,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 8,
    },
    pillSelectorRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    selectorPill: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colors.cardBgElevated,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    selectorPillActive: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: colors.primary,
    },
    selectorPillText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    selectorPillTextActive: {
      color: colors.primary,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    eyeBtn: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.cardBgElevated,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorder,
    },
    switchTextCol: {
      flex: 1,
      marginRight: 10,
    },
    switchTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    switchSub: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 2,
    },

    // Point 2 Fix: No Overlap in Validation & Diagnostic Test
    testActionsCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 14,
    },
    testHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 8,
    },
    testHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
      minWidth: 0,
    },
    testHeaderTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    runTestBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 7,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.3)',
      flexShrink: 0,
    },
    runTestBtnText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
    },
    simulateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorder,
      marginTop: 4,
    },
    simulateTitle: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    simulateSub: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 1,
    },
    testResultBox: {
      borderRadius: 10,
      padding: 10,
      marginTop: 8,
      borderWidth: 1,
    },
    testResultSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    testResultError: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    testResultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    testResultTitle: {
      fontSize: 11.5,
      fontWeight: '700',
    },
    testResultDetailText: {
      fontSize: 10.5,
      color: colors.textSecondary,
      lineHeight: 15,
      marginTop: 2,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.35)',
      borderRadius: 10,
      padding: 10,
      marginTop: 8,
    },
    errorBannerText: {
      fontSize: 11,
      color: colors.danger,
      lineHeight: 15,
    },
    errorSwitchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 8,
      paddingVertical: 5,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    errorSwitchBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    footerActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 11,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    cancelBtnText: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    submitConnectBtn: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 11,
      backgroundColor: colors.primary,
    },
    submitConnectBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },

    // Manage Connection Modal Styles
    overviewCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 14,
      gap: 10,
    },
    overviewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    overviewLabel: {
      fontSize: 11.5,
      color: colors.textSecondary,
    },
    overviewValue: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '600',
    },
    switchMethodCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      marginBottom: 14,
    },
    switchMethodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    switchMethodTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    switchMethodDesc: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 16,
      marginBottom: 12,
    },
    switchMethodBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingVertical: 11,
      borderRadius: 10,
    },
    switchMethodBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    disconnectCard: {
      marginBottom: 10,
    },
    disconnectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 11,
      borderRadius: 11,
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    disconnectBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.danger,
    },
  });
