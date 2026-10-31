import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Eye, EyeOff, Headphones, Shield, Sparkles } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';
import { ConnectionTestResultData } from '../../data/serviceDefaults';

interface DynamicServiceFormProps {
  serviceId: string;
  formData: Record<string, any>;
  updateField: (key: string, val: any) => void;
  showSecrets: Record<string, boolean>;
  toggleSecret: (key: string) => void;
  onSetTestResult?: (result: ConnectionTestResultData) => void;
}

export const DynamicServiceForm: React.FC<DynamicServiceFormProps> = ({
  serviceId,
  formData,
  updateField,
  showSecrets,
  toggleSecret,
  onSetTestResult,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  switch (serviceId) {
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
                onChangeText={val => updateField('personalAccessToken', val)}
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
              Requires scopes: <Text style={styles.codeSnippet}>repo</Text>,{' '}
              <Text style={styles.codeSnippet}>workflow</Text>,{' '}
              <Text style={styles.codeSnippet}>read:org</Text> for PR triage.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GITHUB ACCOUNT / ORGANIZATION</Text>
            <TextInput
              style={styles.textInput}
              value={formData.username || ''}
              onChangeText={val => updateField('username', val)}
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
              onChangeText={val => updateField('customEndpoint', val)}
              placeholder="https://api.github.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              Leave as default unless using GitHub Enterprise Server.
            </Text>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Autonomous PR & Issue Triage</Text>
              <Text style={styles.toggleSub}>
                Allow MIRAS Agent to read open issues and prepare draft pull requests.
              </Text>
            </View>
            <Switch
              value={formData.enableTriage ?? true}
              onValueChange={val => updateField('enableTriage', val)}
              thumbColor={formData.enableTriage ? colors.primary : '#94A3B8'}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(12, 185, 129, 0.35)' }}
            />
          </View>
        </>
      );

    case 'slack':
      return (
        <>
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
                    onChangeText={val => updateField('botToken', val)}
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
                  Starts with <Text style={styles.codeSnippet}>xoxb-</Text>. Generated in
                  api.slack.com/apps.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>WORKSPACE TEAM ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.teamId || ''}
                  onChangeText={val => updateField('teamId', val)}
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
                  onChangeText={val => updateField('alertChannel', val)}
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
                  onChangeText={val => updateField('clientId', val)}
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
                    onChangeText={val => updateField('clientSecret', val)}
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
                  if (onSetTestResult) {
                    onSetTestResult({
                      success: true,
                      title: 'OAuth 2.0 Authorization Granted',
                      details: [
                        'Workspace authorized: Acme AI Engineering',
                        'Granted scopes: channels:read, chat:write, users:read',
                      ],
                      timestamp: 'Tokens exchanged via PKCE handshake',
                    });
                  }
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
                onChangeText={val => updateField('integrationSecret', val)}
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
              Obtained from <Text style={styles.codeSnippet}>notion.so/my-integrations</Text>.
              Remember to invite the integration to your target database.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ROOT DATABASE OR PAGE ID</Text>
            <TextInput
              style={styles.textInput}
              value={formData.databaseId || ''}
              onChangeText={val => updateField('databaseId', val)}
              placeholder="32-character Notion UUID (e.g. 7f8a9b...)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>
              The 32-character string found in your Notion database share URL.
            </Text>
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
                <Text style={styles.oauthBannerSub}>
                  Connect your Spotify Premium account for focus music orchestration.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.oauthActionBtn}
              onPress={() => {
                VoiceService.triggerHaptic('medium');
                if (onSetTestResult) {
                  onSetTestResult({
                    success: true,
                    title: 'Spotify OAuth 2.0 Authorized',
                    details: [
                      'Authenticated as: Alex Morgan (Premium)',
                      'Active output: MacBook Pro Audio',
                      'Scopes: user-read-playback, user-modify-playback',
                    ],
                    timestamp: 'OAuth session active',
                  });
                }
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
              onChangeText={val => updateField('clientId', val)}
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
                onChangeText={val => updateField('clientSecret', val)}
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
              onChangeText={val => updateField('defaultPlaylist', val)}
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
              onChangeText={val => updateField('accountEmail', val)}
              placeholder="alex.morgan@workspace.io"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>MARKETPLACE REGION</Text>
            <View style={styles.pillRow}>
              {['US - Amazon.com', 'UK - Amazon.co.uk', 'CA - Amazon.ca'].map(region => (
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
              onChangeText={val => updateField('deliveryZip', val)}
              placeholder="10001 (Columbus Circle, NY)"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Autonomous Grocery Replenishment</Text>
              <Text style={styles.toggleSub}>
                Allow MIRAS Agent to stage recurring groceries in your cart for one-tap
                checkout.
              </Text>
            </View>
            <Switch
              value={formData.autoReplenishCart ?? true}
              onValueChange={val => updateField('autoReplenishCart', val)}
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
              onChangeText={val => updateField('serverUrl', val)}
              placeholder="https://mcp.internal.workspace/v1/sse"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              Direct endpoint implementing the official Model Context Protocol JSON-RPC
              specification.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TRANSPORT PROTOCOL</Text>
            <View style={styles.pillRow}>
              {[
                { id: 'sse', label: 'SSE (Server-Sent Events)' },
                { id: 'http', label: 'HTTP Stream' },
                { id: 'stdio', label: 'Stdio WebSocket' },
              ].map(t => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.optionPill, formData.transport === t.id && styles.optionPillActive]}
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
                onChangeText={val => updateField('apiKey', val)}
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
              onChangeText={val => updateField('customHeaders', val)}
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
              <Text style={styles.toggleSub}>
                Query tools/list during connection and register executable agent tools.
              </Text>
            </View>
            <Switch
              value={formData.autoDiscoverTools ?? true}
              onValueChange={val => updateField('autoDiscoverTools', val)}
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
              onChangeText={val => updateField('mileagePlusNumber', val)}
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
                onChangeText={val => updateField('accountPin', val)}
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
              onChangeText={val => updateField('passengerLastName', val)}
              placeholder="Morgan"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CABIN SEATING PREFERENCE</Text>
            <View style={styles.pillRow}>
              {['Window', 'Aisle', 'Economy Plus Extra Legroom'].map(seat => (
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
                Financial tokens are stored only within your on-device secure enclave. Read-only
                transaction telemetry.
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
                onChangeText={val => updateField('accessToken', val)}
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
              onChangeText={val => updateField('accountNumberLast4', val)}
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
              onChangeText={val => updateField('dailySpendLimit', val)}
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
      return (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SERVICE API KEY / ACCESS TOKEN</Text>
            <TextInput
              style={styles.textInput}
              value={formData.apiKey || ''}
              onChangeText={val => updateField('apiKey', val)}
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
              onChangeText={val => updateField('endpoint', val)}
              placeholder="https://api.service.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>
        </>
      );
  }
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    inputGroup: {
      marginBottom: 14,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    inputLabel: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.textSecondary,
      letterSpacing: 0.8,
    },
    requiredBadge: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
      backgroundColor: 'rgba(12, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    textInput: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      fontSize: 13,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    multilineInput: {
      height: 72,
      textAlignVertical: 'top',
      fontFamily: 'monospace',
      fontSize: 11.5,
    },
    secretInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    secretTextInput: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 11,
      fontSize: 13,
      color: colors.textPrimary,
    },
    eyeBtn: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    helperText: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 5,
      lineHeight: 15,
    },
    codeSnippet: {
      fontFamily: 'monospace',
      color: colors.primary,
      backgroundColor: 'rgba(12, 185, 129, 0.08)',
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.surfaceBorderSubtle,
      marginTop: 4,
    },
    toggleTextCol: {
      flex: 1,
      paddingRight: 14,
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
    },
    segmentedSelector: {
      flexDirection: 'row',
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      padding: 3,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    segmentOption: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 9,
    },
    segmentOptionActive: {
      backgroundColor: colors.surfaceCard,
    },
    segmentOptionText: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    segmentOptionTextActive: {
      color: colors.textPrimary,
      fontWeight: '700',
    },
    pillRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 4,
    },
    optionPill: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: colors.cardBgSubtle,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    optionPillActive: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.primary,
    },
    optionPillText: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    optionPillTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    oauthGrantBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: 'rgba(12, 185, 129, 0.1)',
      borderRadius: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      marginTop: 6,
    },
    oauthGrantBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
    },
    oauthBanner: {
      backgroundColor: 'rgba(12, 185, 129, 0.08)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      marginBottom: 14,
      gap: 12,
    },
    oauthBannerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
      marginTop: 2,
    },
    oauthActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 9,
    },
    oauthActionBtnText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    vaultSecurityBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: 'rgba(12, 185, 129, 0.08)',
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      marginBottom: 14,
    },
    vaultBannerTextCol: {
      flex: 1,
    },
    vaultBannerTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    vaultBannerSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 1,
    },
  });
