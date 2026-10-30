export type ConnectionMethod = 'mcp' | 'api';

export type ConnectionStatus =
  | 'not_connected'
  | 'connecting'
  | 'connected_mcp'
  | 'connected_api'
  | 'failed';

export interface IntegrationCredentials {
  // Common / API credentials
  apiKey?: string;
  personalAccessToken?: string;
  clientId?: string;
  clientSecret?: string;
  accountHandle?: string;
  scope?: string;
  customEndpoint?: string;

  // MCP specific credentials
  mcpServerUrl?: string;
  mcpTransport?: 'sse' | 'http_stream' | 'websocket';
  mcpAuthToken?: string;
  mcpCustomHeaders?: string;
  autoDiscoverTools?: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  iconType: string;
  status: ConnectionStatus;
  activeMethod?: ConnectionMethod;
  credentials?: IntegrationCredentials;
  lastConnectedAt?: string;
  toolsDiscovered?: number;
  failureReason?: string;
}

export interface IntegrationCategory {
  id: string;
  name: string;
  description: string;
  iconType: 'code' | 'sparkles' | 'folder' | 'tools' | 'cloud' | 'briefcase' | 'database' | 'globe';
  integrationIds: string[];
}
