import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Server,
  Shield,
  Key,
  Lock,
  ExternalLink,
  Globe,
  Activity,
  Sparkles,
  Trash2,
  Sliders,
  Code2,
  MessageSquare,
  FileText,
  Headphones,
  ShoppingCart,
  Plane,
  CreditCard,
  Cloud,
  Mail,
  Check,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileAccountItem } from './ProfileModal';

interface ServiceConfigModalProps {
  visible: boolean;
  service: ProfileAccountItem | null;
  isAlreadyConnected: boolean;
  existingConfig?: Record<string, any>;
  onClose: () => void;
  onSave: (serviceId: string, configData: Record<string, any>) => void;
  onDisconnect?: (serviceId: string) => void;
}

export const ServiceConfigModal: React.FC<ServiceConfigModalProps> = ({
  visible,
  service,
  isAlreadyConnected,
  existingConfig,
  onClose,
  onSave,
  onDisconnect,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Testing connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    title: string;
    details: string[];
    timestamp: string;
  } | null>(null);

  // Initialize or reset form state whenever selected service changes
  useEffect(() => {
    if (!service) return;

    // Default pre-populated realistic credentials for smooth prototyping
    const defaults: Record<string, Record<string, any>> = {
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

    setFormData(existingConfig || defaults[service.id] || {});
    setTestResult(null);
    setIsTesting(false);
  }, [service, existingConfig]);

  if (!service) return null;

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setTestResult(null);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Run dynamic and realistic connection testing simulation
  const handleTestConnection = () => {
    VoiceService.triggerHaptic('light');
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      VoiceService.triggerHaptic('success');

      switch (service.id) {
        case 'github':
          setTestResult({
            success: true,
            title: 'GitHub API v3 & GraphQL Verified',
            details: [
              `Authenticated as @${formData.username || 'alexmorgan-ai'} (Pro Member)`,
              '38 repositories accessible (Public & Private)',
              'Scopes active: repo, workflow, read:org, notifications',
              'MCP Tools registered: github.search_issues, github.create_pr',
            ],
            timestamp: 'Verified just now • 48ms ping',
          });
          break;

        case 'slack':
          setTestResult({
            success: true,
            title: 'Slack Workspace Bot Handshake OK',
            details: [
              `Workspace: Acme AI Engineering (Team ID: ${formData.teamId || 'T08492JHK'})`,
              'Bot User Identity: @miras_assistant active',
              `Alert Destination: ${formData.alertChannel || '#miras-agent-alerts'} verified`,
              'Scopes: chat:write, channels:read, app_mentions:read',
            ],
            timestamp: 'Verified just now • 62ms ping',
          });
          break;

        case 'notion':
          setTestResult({
            success: true,
            title: 'Notion Knowledge Base Connected',
            details: [
              'Database: Alex Personal Wiki & System Specs',
              '142 pages indexed and synced into agent memory',
              'Permissions: Read blocks, query database, create page blocks',
            ],
            timestamp: 'Verified just now • 90ms ping',
          });
          break;

        case 'spotify':
          setTestResult({
            success: true,
            title: 'Spotify OAuth 2.0 Token Introspection OK',
            details: [
              'User: Alex Morgan (Spotify Premium Tier)',
              'Playback device detected: MacBook Pro Audio (Ready)',
              `Default playlist synchronized: "${formData.defaultPlaylist || 'Focus Beats & Ambient Work'}"`,
            ],
            timestamp: 'Verified just now • 55ms ping',
          });
          break;

        case 'amazon':
          setTestResult({
            success: true,
            title: 'Amazon Prime & Whole Foods Link OK',
            details: [
              `Prime Account: ${formData.accountEmail || 'alex.morgan@workspace.io'} (Active)`,
              `Assigned Store: Whole Foods Market (ZIP: ${formData.deliveryZip || '10001'})`,
              '2FA Hardware Authentication: Pre-authorized for cart staging',
            ],
            timestamp: 'Verified just now • 110ms ping',
          });
          break;

        case 'mcp-server':
          setTestResult({
            success: true,
            title: 'Model Context Protocol Handshake OK (v2024-11-05)',
            details: [
              `Endpoint: ${formData.serverUrl || 'https://mcp.internal.workspace/v1/sse'}`,
              `Transport: ${formData.transport === 'sse' ? 'Server-Sent Events (SSE)' : 'HTTP Stream'}`,
              'Discovered Capabilities: 14 tools (db_query, filesystem, vector_search, web_scrape)',
              'Schema validation: 100% compliant with JSON-RPC 2.0',
            ],
            timestamp: 'Verified just now • 34ms roundtrip',
          });
          break;

        case 'united':
          setTestResult({
            success: true,
            title: 'United MileagePlus Partner Auth OK',
            details: [
              `Passenger: ${formData.passengerLastName || 'Morgan'}, Alex`,
              'Tier Status: Premier Platinum (Star Alliance Gold)',
              'Available Balance: 148,200 MileagePlus Miles',
              'Autonomous flight check-in agent armed',
            ],
            timestamp: 'Verified just now • 85ms ping',
          });
          break;

        case 'banking':
          setTestResult({
            success: true,
            title: 'Encrypted Financial Vault Linked',
            details: [
              'Institution: JPMorgan Chase Bank, N.A.',
              `Account: Sapphire Checking (*${formData.accountNumberLast4 || '4921'})`,
              `Autonomous Ceiling: $${formData.dailySpendLimit || '250.00'} (Safety Gate enforced)`,
              'Keyring: AES-256 encrypted inside local device vault',
            ],
            timestamp: 'Verified just now • 78ms ping',
          });
          break;

        default:
          setTestResult({
            success: true,
            title: `${service.title} Verified`,
            details: [
              'Endpoint reachable and responding with HTTP 200 OK',
              'API credentials validated against authorization gateway',
            ],
            timestamp: 'Verified just now',
          });
      }
    }, 900);
  };

  const handleSave = () => {
    VoiceService.triggerHaptic('success');
    onSave(service.id, formData);
  };

  const handleDisconnect = () => {
    VoiceService.triggerHaptic('warning');
    if (onDisconnect) {
      onDisconnect(service.id);
    }
  };

  const renderServiceIcon = (iconType: string, color: string) => {
    switch (iconType) {
      case 'mail':
        return <Mail size={20} color={color} />;
      case 'cloud':
        return <Cloud size={20} color={color} />;
      case 'github':
        return <Code2 size={20} color={color} />;
      case 'slack':
        return <MessageSquare size={20} color={color} />;
      case 'notion':
        return <FileText size={20} color={color} />;
      case 'spotify':
        return <Headphones size={20} color={color} />;
      case 'amazon':
        return <ShoppingCart size={20} color={color} />;
      case 'server':
        return <Server size={20} color={color} />;
      case 'flight':
        return <Plane size={20} color={color} />;
      case 'bank':
        return <CreditCard size={20} color={color} />;
      default:
        return <Cloud size={20} color={color} />;
    }
  };

  // Render the specific, realistic input fields for each service
  const renderDynamicForm = () => {
    switch (service.id) {
      case 'github':
        return (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>PERSONAL ACCESS TOKEN (PAT)</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.personalAccessToken || ''}
                  onChangeText={(val) => updateField('personalAccessToken', val)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.githubToken}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('githubToken')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.githubToken ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Requires scopes: <Text style={styles.codeSnippet}>repo</Text>, <Text style={styles.codeSnippet}>workflow</Text>, <Text style={styles.codeSnippet}>read:org</Text> for PR triage.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>GITHUB ACCOUNT / ORGANIZATION</Text>
              <TextInput
                style={styles.textInput}
                value={formData.username || ''}
                onChangeText={(val) => updateField('username', val)}
                placeholder="alexmorgan-ai"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>API ENDPOINT HOST (OPTIONAL)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.customEndpoint || ''}
                onChangeText={(val) => updateField('customEndpoint', val)}
                placeholder="https://api.github.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>Leave as default unless using GitHub Enterprise Server.</Text>
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <Text style={styles.toggleTitle}>Autonomous PR & Issue Triage</Text>
                <Text style={styles.toggleSub}>Allow MIRAS Agent to read open issues and prepare draft pull requests.</Text>
              </View>
              <Switch
                value={formData.enableTriage ?? true}
                onValueChange={(val) => updateField('enableTriage', val)}
                thumbColor={formData.enableTriage ? colors.primary : '#94A3B8'}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(12, 185, 129, 0.35)' }}
              />
            </View>
          </>
        );

      case 'slack':
        return (
          <>
            {/* Auth Method Selector */}
            <View style={styles.segmentedSelector}>
              <TouchableOpacity
                style={[
                  styles.segmentOption,
                  formData.authMethod !== 'oauth' && styles.segmentOptionActive,
                ]}
                onPress={() => updateField('authMethod', 'bot_token')}
              >
                <Text
                  style={[
                    styles.segmentOptionText,
                    formData.authMethod !== 'oauth' && styles.segmentOptionTextActive,
                  ]}
                >
                  Bot User Token
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentOption,
                  formData.authMethod === 'oauth' && styles.segmentOptionActive,
                ]}
                onPress={() => updateField('authMethod', 'oauth')}
              >
                <Text
                  style={[
                    styles.segmentOptionText,
                    formData.authMethod === 'oauth' && styles.segmentOptionTextActive,
                  ]}
                >
                  OAuth App (Client ID/Sec)
                </Text>
              </TouchableOpacity>
            </View>

            {formData.authMethod !== 'oauth' ? (
              <>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>SLACK BOT USER OAUTH TOKEN</Text>
                    <Text style={styles.requiredBadge}>REQUIRED</Text>
                  </View>
                  <View style={styles.secretInputWrapper}>
                    <TextInput
                      style={styles.secretTextInput}
                      value={formData.botToken || ''}
                      onChangeText={(val) => updateField('botToken', val)}
                      placeholder="xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxx"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showSecrets.slackToken}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => toggleSecret('slackToken')}
                      style={styles.eyeBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {showSecrets.slackToken ? (
                        <EyeOff size={16} color={colors.textSecondary} />
                      ) : (
                        <Eye size={16} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.helperText}>
                    Starts with <Text style={styles.codeSnippet}>xoxb-</Text>. Generated in api.slack.com/apps.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WORKSPACE TEAM ID</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.teamId || ''}
                    onChangeText={(val) => updateField('teamId', val)}
                    placeholder="T08492JHK"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>DEFAULT NOTIFICATION CHANNEL</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.alertChannel || ''}
                    onChangeText={(val) => updateField('alertChannel', val)}
                    placeholder="#miras-agent-alerts"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>SLACK CLIENT ID</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.clientId || ''}
                    onChangeText={(val) => updateField('clientId', val)}
                    placeholder="3849281.849281"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>SLACK CLIENT SECRET</Text>
                  <View style={styles.secretInputWrapper}>
                    <TextInput
                      style={styles.secretTextInput}
                      value={formData.clientSecret || ''}
                      onChangeText={(val) => updateField('clientSecret', val)}
                      placeholder="••••••••••••••••••••"
                      placeholderTextColor={colors.textMuted}
                      secureTextEntry={!showSecrets.slackSecret}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => toggleSecret('slackSecret')}
                      style={styles.eyeBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {showSecrets.slackSecret ? (
                        <EyeOff size={16} color={colors.textSecondary} />
                      ) : (
                        <Eye size={16} color={colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.oauthGrantBtn}
                  onPress={() => {
                    VoiceService.triggerHaptic('medium');
                    updateField('botToken', 'xoxb-oauth-granted-9842104921');
                    updateField('teamId', 'T08492JHK');
                    updateField('alertChannel', '#miras-agent-alerts');
                    setTestResult({
                      success: true,
                      title: 'OAuth 2.0 Authorization Granted',
                      details: [
                        'Workspace authorized: Acme AI Engineering',
                        'Granted scopes: channels:read, chat:write, users:read',
                      ],
                      timestamp: 'Tokens exchanged via PKCE handshake',
                    });
                  }}
                >
                  <Sparkles size={15} color={colors.primary} />
                  <Text style={styles.oauthGrantBtnText}>Authorize with Acme AI Workspace</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        );

      case 'notion':
        return (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>INTERNAL INTEGRATION SECRET</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.integrationSecret || ''}
                  onChangeText={(val) => updateField('integrationSecret', val)}
                  placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.notionSecret}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('notionSecret')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.notionSecret ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.helperText}>
                Obtained from <Text style={styles.codeSnippet}>notion.so/my-integrations</Text>. Remember to invite the integration to your target database.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ROOT DATABASE OR PAGE ID</Text>
              <TextInput
                style={styles.textInput}
                value={formData.databaseId || ''}
                onChangeText={(val) => updateField('databaseId', val)}
                placeholder="32-character Notion UUID (e.g. 7f8a9b...)"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
              <Text style={styles.helperText}>The 32-character string found in your Notion database share URL.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PERMISSION CAPABILITY</Text>
              <View style={styles.pillRow}>
                <TouchableOpacity
                  style={[
                    styles.optionPill,
                    formData.permissionMode !== 'read_write' && styles.optionPillActive,
                  ]}
                  onPress={() => updateField('permissionMode', 'read_only')}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      formData.permissionMode !== 'read_write' && styles.optionPillTextActive,
                    ]}
                  >
                    Read & Search Only
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionPill,
                    formData.permissionMode === 'read_write' && styles.optionPillActive,
                  ]}
                  onPress={() => updateField('permissionMode', 'read_write')}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      formData.permissionMode === 'read_write' && styles.optionPillTextActive,
                    ]}
                  >
                    Read, Write & Append
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );

      case 'spotify':
        return (
          <>
            <View style={styles.oauthBanner}>
              <View style={styles.oauthBannerTop}>
                <Headphones size={22} color={colors.primary} />
                <View style={styles.oauthBannerTextCol}>
                  <Text style={styles.oauthBannerTitle}>Spotify Web API PKCE</Text>
                  <Text style={styles.oauthBannerSub}>Connect your Spotify Premium account for focus music orchestration.</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.oauthActionBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  setTestResult({
                    success: true,
                    title: 'Spotify OAuth 2.0 Authorized',
                    details: [
                      'Authenticated as: Alex Morgan (Premium)',
                      'Active output: MacBook Pro Audio',
                      'Scopes: user-read-playback, user-modify-playback',
                    ],
                    timestamp: 'OAuth session active',
                  });
                }}
              >
                <Sparkles size={14} color={colors.buttonTextDark} />
                <Text style={styles.oauthActionBtnText}>Authorize via Spotify Account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SPOTIFY CLIENT ID</Text>
              <TextInput
                style={styles.textInput}
                value={formData.clientId || ''}
                onChangeText={(val) => updateField('clientId', val)}
                placeholder="32-character client hex ID"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SPOTIFY CLIENT SECRET</Text>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.clientSecret || ''}
                  onChangeText={(val) => updateField('clientSecret', val)}
                  placeholder="••••••••••••••••••••••••••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.spotifySecret}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('spotifySecret')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.spotifySecret ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DEFAULT WORK FOCUS PLAYLIST</Text>
              <TextInput
                style={styles.textInput}
                value={formData.defaultPlaylist || ''}
                onChangeText={(val) => updateField('defaultPlaylist', val)}
                placeholder="Focus Beats & Ambient Work"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </>
        );

      case 'amazon':
        return (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>AMAZON ACCOUNT EMAIL</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={formData.accountEmail || ''}
                onChangeText={(val) => updateField('accountEmail', val)}
                placeholder="alex.morgan@workspace.io"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>MARKETPLACE REGION</Text>
              <View style={styles.pillRow}>
                {['US - Amazon.com', 'UK - Amazon.co.uk', 'CA - Amazon.ca'].map((region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.optionPill,
                      formData.marketplace === region && styles.optionPillActive,
                    ]}
                    onPress={() => updateField('marketplace', region)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        formData.marketplace === region && styles.optionPillTextActive,
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WHOLE FOODS DELIVERY ZIP CODE</Text>
              <TextInput
                style={styles.textInput}
                value={formData.deliveryZip || ''}
                onChangeText={(val) => updateField('deliveryZip', val)}
                placeholder="10001 (Columbus Circle, NY)"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <Text style={styles.toggleTitle}>Autonomous Grocery Replenishment</Text>
                <Text style={styles.toggleSub}>Allow MIRAS Agent to stage recurring groceries in your cart for one-tap checkout.</Text>
              </View>
              <Switch
                value={formData.autoReplenishCart ?? true}
                onValueChange={(val) => updateField('autoReplenishCart', val)}
                thumbColor={formData.autoReplenishCart ? colors.primary : '#94A3B8'}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(12, 185, 129, 0.35)' }}
              />
            </View>
          </>
        );

      case 'mcp-server':
        return (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>MCP SERVER ENDPOINT URL</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={formData.serverUrl || ''}
                onChangeText={(val) => updateField('serverUrl', val)}
                placeholder="https://mcp.internal.workspace/v1/sse"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.helperText}>
                Direct endpoint implementing the official Model Context Protocol JSON-RPC specification.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TRANSPORT PROTOCOL</Text>
              <View style={styles.pillRow}>
                {[
                  { id: 'sse', label: 'SSE (Server-Sent Events)' },
                  { id: 'http', label: 'HTTP Stream' },
                  { id: 'stdio', label: 'Stdio WebSocket' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.optionPill,
                      formData.transport === t.id && styles.optionPillActive,
                    ]}
                    onPress={() => updateField('transport', t.id)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        formData.transport === t.id && styles.optionPillTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>API KEY / BEARER TOKEN (OPTIONAL)</Text>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.apiKey || ''}
                  onChangeText={(val) => updateField('apiKey', val)}
                  placeholder="mcp_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.mcpKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('mcpKey')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.mcpKey ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CUSTOM AUTH HEADERS (JSON)</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.customHeaders || ''}
                onChangeText={(val) => updateField('customHeaders', val)}
                placeholder={'{\n  "X-Project-Id": "miras-prod"\n}'}
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextCol}>
                <Text style={styles.toggleTitle}>Auto-Discover Tools & Prompts</Text>
                <Text style={styles.toggleSub}>Query tools/list during connection and register executable agent tools.</Text>
              </View>
              <Switch
                value={formData.autoDiscoverTools ?? true}
                onValueChange={(val) => updateField('autoDiscoverTools', val)}
                thumbColor={formData.autoDiscoverTools ? colors.primary : '#94A3B8'}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(12, 185, 129, 0.35)' }}
              />
            </View>
          </>
        );

      case 'united':
        return (
          <>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>MILEAGEPLUS ACCOUNT NUMBER</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={formData.mileagePlusNumber || ''}
                onChangeText={(val) => updateField('mileagePlusNumber', val)}
                placeholder="UA-88219472"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SECURITY PIN / WEB PASSWORD</Text>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.accountPin || ''}
                  onChangeText={(val) => updateField('accountPin', val)}
                  placeholder="••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.unitedPin}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('unitedPin')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.unitedPin ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSENGER LEGAL LAST NAME</Text>
              <TextInput
                style={styles.textInput}
                value={formData.passengerLastName || ''}
                onChangeText={(val) => updateField('passengerLastName', val)}
                placeholder="Morgan"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CABIN SEATING PREFERENCE</Text>
              <View style={styles.pillRow}>
                {['Window', 'Aisle', 'Economy Plus Extra Legroom'].map((seat) => (
                  <TouchableOpacity
                    key={seat}
                    style={[
                      styles.optionPill,
                      formData.seatPreference === seat && styles.optionPillActive,
                    ]}
                    onPress={() => updateField('seatPreference', seat)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        formData.seatPreference === seat && styles.optionPillTextActive,
                      ]}
                    >
                      {seat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        );

      case 'banking':
        return (
          <>
            <View style={styles.vaultSecurityBanner}>
              <Shield size={20} color={colors.primary} />
              <View style={styles.vaultBannerTextCol}>
                <Text style={styles.vaultBannerTitle}>Hardware Keyring Encryption (AES-256)</Text>
                <Text style={styles.vaultBannerSub}>
                  Financial tokens are stored only within your on-device secure enclave. Read-only transaction telemetry.
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>PLAID CLIENT / ACCESS TOKEN</Text>
                <Text style={styles.requiredBadge}>REQUIRED</Text>
              </View>
              <View style={styles.secretInputWrapper}>
                <TextInput
                  style={styles.secretTextInput}
                  value={formData.accessToken || ''}
                  onChangeText={(val) => updateField('accessToken', val)}
                  placeholder="access-production-xxxxxxxxxxxxxxxxxxxxxxxx"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showSecrets.bankToken}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleSecret('bankToken')}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showSecrets.bankToken ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ACCOUNT NUMBER (LAST 4 DIGITS)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.accountNumberLast4 || ''}
                onChangeText={(val) => updateField('accountNumberLast4', val)}
                placeholder="4921"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AUTONOMOUS SAFETY CEILING ($ USD)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.dailySpendLimit || ''}
                onChangeText={(val) => updateField('dailySpendLimit', val)}
                placeholder="250.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
              />
              <Text style={styles.helperText}>
                Transactions above this amount require strict 2FA biometric confirmation.
              </Text>
            </View>
          </>
        );

      default:
        // Generic fallback for any other custom service
        return (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SERVICE API KEY / ACCESS TOKEN</Text>
              <TextInput
                style={styles.textInput}
                value={formData.apiKey || ''}
                onChangeText={(val) => updateField('apiKey', val)}
                placeholder="Enter API Key or Token..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CUSTOM ENDPOINT / URL</Text>
              <TextInput
                style={styles.textInput}
                value={formData.endpoint || ''}
                onChangeText={(val) => updateField('endpoint', val)}
                placeholder="https://api.service.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.configSheet}>
          {/* Header */}
          <View style={styles.configHeader}>
            <View style={styles.configHeaderLeft}>
              <View style={styles.serviceIconCircle}>
                {renderServiceIcon(service.iconType, colors.primary)}
              </View>
              <View style={styles.headerTitleCol}>
                <Text style={styles.configTitle}>{service.title}</Text>
                <Text style={styles.configSubtitle}>Credentials & Integration Settings</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form Scroll View */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Dynamic fields */}
            {renderDynamicForm()}

            {/* Test Connection Result Box */}
            {testResult && (
              <View
                style={[
                  styles.testResultBox,
                  testResult.success ? styles.testResultBoxSuccess : styles.testResultBoxError,
                ]}
              >
                <View style={styles.testResultHeaderRow}>
                  {testResult.success ? (
                    <CheckCircle2 size={16} color={colors.success} />
                  ) : (
                    <AlertCircle size={16} color="#EF4444" />
                  )}
                  <Text
                    style={[
                      styles.testResultTitle,
                      { color: testResult.success ? colors.success : '#EF4444' },
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

                <Text style={styles.testResultTimestamp}>{testResult.timestamp}</Text>
              </View>
            )}

            {/* Test Connection Button */}
            <TouchableOpacity
              style={styles.testBtn}
              onPress={handleTestConnection}
              disabled={isTesting}
              activeOpacity={0.8}
            >
              {isTesting ? (
                <View style={styles.testingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.testBtnText}>Testing handshake & credentials...</Text>
                </View>
              ) : (
                <View style={styles.testingRow}>
                  <RefreshCw size={15} color={colors.primary} />
                  <Text style={styles.testBtnText}>Test Connection</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Check size={16} color={colors.buttonTextDark} />
                <Text style={styles.saveBtnText}>
                  {isAlreadyConnected ? 'Update & Save Configuration' : 'Save & Connect Service'}
                </Text>
              </TouchableOpacity>

              {isAlreadyConnected && onDisconnect && (
                <TouchableOpacity
                  style={styles.disconnectBtn}
                  onPress={handleDisconnect}
                  activeOpacity={0.8}
                >
                  <Trash2 size={14} color="#EF4444" />
                  <Text style={styles.disconnectBtnText}>Disconnect Service</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'flex-end',
    },
    configSheet: {
      backgroundColor: colors.cardBgElevated,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      maxHeight: '90%',
      padding: 20,
      paddingBottom: 32,
    },
    configHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    configHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    serviceIconCircle: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.badgeBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    headerTitleCol: {
      flex: 1,
    },
    configTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    configSubtitle: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.06)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContent: {
      gap: 14,
      paddingBottom: 24,
    },
    inputGroup: {
      gap: 6,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputLabel: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    requiredBadge: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      backgroundColor: colors.badgeBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    textInput: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 13.5,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    multilineInput: {
      minHeight: 70,
      textAlignVertical: 'top',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 12,
    },
    secretInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      paddingHorizontal: 14,
    },
    secretTextInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 13.5,
      color: colors.textPrimary,
    },
    eyeBtn: {
      padding: 6,
    },
    helperText: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 15,
    },
    codeSnippet: {
      color: colors.primary,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 10,
    },
    toggleTextCol: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    toggleSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 14,
    },
    segmentedSelector: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    segmentOption: {
      flex: 1,
      paddingVertical: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    segmentOptionActive: {
      backgroundColor: colors.badgeBg,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    segmentOptionText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    segmentOptionTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionPill: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    optionPillActive: {
      backgroundColor: colors.badgeBg,
      borderColor: colors.primaryBorder,
    },
    optionPillText: {
      fontSize: 11.5,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    optionPillTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    oauthBanner: {
      backgroundColor: colors.badgeBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 12,
    },
    oauthBannerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    oauthBannerTextCol: {
      flex: 1,
    },
    oauthBannerTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    oauthBannerSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
      lineHeight: 15,
    },
    oauthActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
    },
    oauthActionBtnText: {
      fontSize: 12.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    oauthGrantBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.badgeBg,
      borderRadius: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    oauthGrantBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
    },
    vaultSecurityBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: 'rgba(12, 185, 129, 0.08)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    vaultBannerTextCol: {
      flex: 1,
    },
    vaultBannerTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
    },
    vaultBannerSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
      lineHeight: 14,
    },
    testResultBox: {
      borderRadius: 12,
      padding: 12,
      gap: 4,
      borderWidth: 1,
    },
    testResultBoxSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    testResultBoxError: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    testResultHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    testResultTitle: {
      fontSize: 12.5,
      fontWeight: '700',
    },
    testResultDetailText: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 15,
      paddingLeft: 4,
    },
    testResultTimestamp: {
      fontSize: 9.5,
      color: colors.textMuted,
      marginTop: 4,
      fontStyle: 'italic',
    },
    testBtn: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      paddingVertical: 11,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    testingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    testBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },
    actionRow: {
      gap: 8,
      marginTop: 4,
    },
    saveBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
    },
    saveBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    disconnectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderRadius: 12,
      paddingVertical: 11,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    disconnectBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#EF4444',
    },
  });
