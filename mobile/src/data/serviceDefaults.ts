export interface ConnectionTestResultData {
  success: boolean;
  title: string;
  details: string[];
  timestamp: string;
}

export const DEFAULT_SERVICE_CONFIGS: Record<string, Record<string, any>> = {
  github: {
    personalAccessToken: 'ghp_4k981xLaM0298vBqZ871109aK29xLq19',
    username: 'alexmorgan-ai',
    customEndpoint: 'https://api.github.com',
    enableTriage: true,
    enableCopilotMcp: true,
  },
  slack: {
    authMethod: 'bot_token',
    botToken: 'xoxb-8941920412-9841029412-8f92jkl019',
    teamId: 'T08492JHK',
    alertChannel: '#miras-agent-alerts',
    clientId: '3849281.849281',
    clientSecret: 'slack_sec_8941029412',
  },
  notion: {
    integrationSecret: 'secret_4891jkl09281hba90281bcz891024',
    databaseId: 'a1c9e83b42914d7a8e291f00b48a1293',
    permissionMode: 'read_write',
    syncInterval: 'Real-time webhook sync',
  },
  spotify: {
    clientId: '4a2b1c8d7e6f5a3b2c1d0e9f8a7b6c5d',
    clientSecret: 'spo_sec_99182301928410293810294',
    redirectUri: 'miras://callback/spotify',
    defaultPlaylist: 'Focus Beats & Ambient Work',
    highBitrate: true,
  },
  amazon: {
    accountEmail: 'alex.morgan@workspace.io',
    marketplace: 'US - Amazon.com',
    deliveryZip: '10001',
    mfaChannel: 'SMS (+1 ••• ••• 4920)',
    autoReplenishCart: true,
  },
  'mcp-server': {
    serverUrl: 'https://mcp.internal.workspace/v1/sse',
    transport: 'sse',
    apiKey: 'mcp_live_948102948102481029481',
    customHeaders: '{\n  "X-Project-Id": "miras-prod",\n  "X-Environment": "production"\n}',
    autoDiscoverTools: true,
    timeoutSecs: '15',
  },
  united: {
    mileagePlusNumber: 'UA-88219472',
    accountPin: '942814',
    passengerLastName: 'Morgan',
    seatPreference: 'Economy Plus Extra Legroom',
    autoCheckIn: true,
  },
  banking: {
    authMethod: 'plaid',
    accessToken: 'access-production-9841029481024810',
    accountNumberLast4: '4921',
    accountNickname: 'Chase Sapphire Checking (*4921)',
    dailySpendLimit: '250.00',
    autoReceiptVerification: true,
  },
  'google-workspace': {
    accountEmail: 'alex.morgan@workspace.io',
    serviceAccount: 'miras-workspace-agent@miras-cloud.iam.gserviceaccount.com',
    scopes: 'Gmail, Drive, Calendar, Docs',
    offlineAccess: true,
  },
  'delta-skymiles': {
    skymilesNumber: '#DL-9428148',
    tierStatus: 'Medallion Priority (SkyTeam Elite Plus)',
    autoCheckin: true,
  },
};

export const getMockConnectionTest = (
  serviceId: string,
  serviceTitle: string,
  formData: Record<string, any>
): ConnectionTestResultData => {
  switch (serviceId) {
    case 'github':
      return {
        success: true,
        title: 'GitHub API v3 & GraphQL Verified',
        details: [
          `Authenticated as @${formData.username || 'alexmorgan-ai'} (Pro Member)`,
          '38 repositories accessible (Public & Private)',
          'Scopes active: repo, workflow, read:org, notifications',
          'MCP Tools registered: github.search_issues, github.create_pr',
        ],
        timestamp: 'Verified just now • 48ms ping',
      };

    case 'slack':
      return {
        success: true,
        title: 'Slack Workspace Bot Handshake OK',
        details: [
          `Workspace: Acme AI Engineering (Team ID: ${formData.teamId || 'T08492JHK'})`,
          'Bot User Identity: @miras_assistant active',
          `Alert Destination: ${formData.alertChannel || '#miras-agent-alerts'} verified`,
          'Scopes: chat:write, channels:read, app_mentions:read',
        ],
        timestamp: 'Verified just now • 62ms ping',
      };

    case 'notion':
      return {
        success: true,
        title: 'Notion Knowledge Base Connected',
        details: [
          'Database: Alex Personal Wiki & System Specs',
          '142 pages indexed and synced into agent memory',
          'Permissions: Read blocks, query database, create page blocks',
        ],
        timestamp: 'Verified just now • 90ms ping',
      };

    case 'spotify':
      return {
        success: true,
        title: 'Spotify OAuth 2.0 Token Introspection OK',
        details: [
          'User: Alex Morgan (Spotify Premium Tier)',
          'Playback device detected: MacBook Pro Audio (Ready)',
          `Default playlist synchronized: "${formData.defaultPlaylist || 'Focus Beats & Ambient Work'}"`,
        ],
        timestamp: 'Verified just now • 55ms ping',
      };

    case 'amazon':
      return {
        success: true,
        title: 'Amazon Prime & Whole Foods Link OK',
        details: [
          `Prime Account: ${formData.accountEmail || 'alex.morgan@workspace.io'} (Active)`,
          `Assigned Store: Whole Foods Market (ZIP: ${formData.deliveryZip || '10001'})`,
          '2FA Hardware Authentication: Pre-authorized for cart staging',
        ],
        timestamp: 'Verified just now • 110ms ping',
      };

    case 'mcp-server':
      return {
        success: true,
        title: 'Model Context Protocol Handshake OK (v2024-11-05)',
        details: [
          `Endpoint: ${formData.serverUrl || 'https://mcp.internal.workspace/v1/sse'}`,
          `Transport: ${formData.transport === 'sse' ? 'Server-Sent Events (SSE)' : 'HTTP Stream'}`,
          'Discovered Capabilities: 14 tools (db_query, filesystem, vector_search, web_scrape)',
          'Schema validation: 100% compliant with JSON-RPC 2.0',
        ],
        timestamp: 'Verified just now • 34ms roundtrip',
      };

    case 'united':
      return {
        success: true,
        title: 'United MileagePlus Partner Auth OK',
        details: [
          `Passenger: ${formData.passengerLastName || 'Morgan'}, Alex`,
          'Tier Status: Premier Platinum (Star Alliance Gold)',
          'Available Balance: 148,200 MileagePlus Miles',
          'Autonomous flight check-in agent armed',
        ],
        timestamp: 'Verified just now • 85ms ping',
      };

    case 'banking':
      return {
        success: true,
        title: 'Encrypted Financial Vault Linked',
        details: [
          'Institution: JPMorgan Chase Bank, N.A.',
          `Account: Sapphire Checking (*${formData.accountNumberLast4 || '4921'})`,
          `Autonomous Ceiling: $${formData.dailySpendLimit || '250.00'} (Safety Gate enforced)`,
          'Keyring: AES-256 encrypted inside local device vault',
        ],
        timestamp: 'Verified just now • 78ms ping',
      };

    default:
      return {
        success: true,
        title: `${serviceTitle} Verified`,
        details: [
          'Endpoint reachable and responding with HTTP 200 OK',
          'API credentials validated against authorization gateway',
        ],
        timestamp: 'Verified just now',
      };
  }
};
