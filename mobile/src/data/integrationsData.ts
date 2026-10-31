import {
  ConnectionMethod,
  IntegrationCategory,
  IntegrationItem,
} from '../types/integrations';

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
