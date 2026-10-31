import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Zap,
  Key,
  Eye,
  EyeOff,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Check,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ConnectionMethod, IntegrationItem } from '../../types/integrations';
import { PlatformIcon } from './PlatformIcon';

interface SetupIntegrationModalProps {
  setupIntegration: IntegrationItem | null;
  activeSetupMethod: ConnectionMethod;
  formData: Record<string, any>;
  showSecrets: Record<string, boolean>;
  isTesting: boolean;
  testResult: {
    success: boolean;
    title: string;
    details: string[];
    timestamp: string;
  } | null;
  simulateFailToggle: boolean;
  connectionError: string | null;
  isSimulatingConnect: boolean;
  onClose: () => void;
  onChangeMethod: (method: ConnectionMethod) => void;
  onChangeFormData: (data: Record<string, any>) => void;
  onToggleShowSecret: (key: string) => void;
  onTestConnection: () => void;
  onToggleSimulateFail: (val: boolean) => void;
  onCompleteConnection: () => void;
}

export const SetupIntegrationModal: React.FC<SetupIntegrationModalProps> = ({
  setupIntegration,
  activeSetupMethod,
  formData,
  showSecrets,
  isTesting,
  testResult,
  simulateFailToggle,
  connectionError,
  isSimulatingConnect,
  onClose,
  onChangeMethod,
  onChangeFormData,
  onToggleShowSecret,
  onTestConnection,
  onToggleSimulateFail,
  onCompleteConnection,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!setupIntegration) return null;

  return (
    <Modal
      visible={!!setupIntegration}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheetModal, { maxHeight: '92%' }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <PlatformIcon iconType={setupIntegration.iconType} isConnected={true} size={20} />
              <View>
                <Text style={styles.sheetTitle}>Connect {setupIntegration.name}</Text>
                <Text style={styles.sheetSub}>Choose MCP or API connection method</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
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
                  onPress={() => onChangeMethod('mcp')}
                  activeOpacity={0.8}
                >
                  <Zap
                    size={13}
                    color={activeSetupMethod === 'mcp' ? colors.buttonTextDark : colors.textSecondary}
                  />
                  <Text
                    numberOfLines={1}
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
                  onPress={() => onChangeMethod('api')}
                  activeOpacity={0.8}
                >
                  <Key
                    size={13}
                    color={activeSetupMethod === 'api' ? colors.buttonTextDark : colors.textSecondary}
                  />
                  <Text
                    numberOfLines={1}
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
                  onChangeText={text => onChangeFormData({ ...formData, mcpServerUrl: text })}
                  placeholder={`sse://${setupIntegration.id}-mcp.internal/v1`}
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
                      onPress={() => onChangeFormData({ ...formData, mcpTransport: protocol })}
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
                    onChangeText={text => onChangeFormData({ ...formData, mcpAuthToken: text })}
                    placeholder="Bearer token or authorization header"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showSecrets.mcpToken}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => onToggleShowSecret('mcpToken')}
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
                    onValueChange={val => onChangeFormData({ ...formData, autoDiscoverTools: val })}
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
                  onChangeText={text => onChangeFormData({ ...formData, accountHandle: text })}
                  placeholder="alexmorgan-ai"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>
                  {setupIntegration.id === 'github'
                    ? 'PERSONAL ACCESS TOKEN (PAT)'
                    : setupIntegration.id === 'slack'
                    ? 'BOT USER OAUTH TOKEN'
                    : setupIntegration.id === 'linear'
                    ? 'LINEAR API KEY'
                    : setupIntegration.id === 'notion'
                    ? 'INTERNAL INTEGRATION SECRET'
                    : 'API / OAUTH ACCESS TOKEN'}
                </Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                    value={formData.apiKey}
                    onChangeText={text => onChangeFormData({ ...formData, apiKey: text })}
                    placeholder="Secret key or token"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showSecrets.apiKey}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => onToggleShowSecret('apiKey')}
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
                  onChangeText={text => onChangeFormData({ ...formData, scope: text })}
                  placeholder="repo, read:org, tools"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Validation & Diagnostic Test */}
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
                  onPress={onTestConnection}
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
                  onValueChange={onToggleSimulateFail}
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
                        onChangeMethod(otherMethod);
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
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitConnectBtn}
                onPress={onCompleteConnection}
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
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-end',
    },
    sheetModal: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 28,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    sheetHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    sheetTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sheetSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      padding: 6,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    dialogScroll: {
      paddingTop: 14,
    },
    methodSwitcherContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.6,
      marginBottom: 6,
      marginTop: 8,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 12,
      padding: 3,
      gap: 4,
    },
    segmentBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingVertical: 9,
      paddingHorizontal: 4,
      borderRadius: 9,
    },
    segmentBtnActive: {
      backgroundColor: colors.primary,
    },
    segmentBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: -0.2,
    },
    segmentBtnTextActive: {
      color: colors.buttonTextDark,
      fontWeight: '800',
    },
    methodExplainerBox: {
      marginTop: 8,
      padding: 10,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    methodExplainerText: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    formGroup: {
      gap: 8,
      marginBottom: 14,
    },
    textInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 13,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    pillSelectorRow: {
      flexDirection: 'row',
      gap: 8,
    },
    selectorPill: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    selectorPillActive: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
    },
    selectorPillText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    selectorPillTextActive: {
      color: colors.primary,
    },
    passwordRow: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    eyeBtn: {
      position: 'absolute',
      right: 12,
      padding: 6,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginTop: 4,
    },
    switchTextCol: {
      flex: 1,
    },
    switchTitle: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    switchSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    testActionsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 12,
      marginBottom: 16,
    },
    testHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    testHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    testHeaderTitle: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    runTestBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.25)',
    },
    runTestBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    simulateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 4,
      borderTopWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    simulateTitle: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    simulateSub: {
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 1,
    },
    testResultBox: {
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      gap: 4,
    },
    testResultSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    testResultError: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    testResultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    testResultTitle: {
      fontSize: 12,
      fontWeight: '700',
    },
    testResultDetailText: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 15,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    errorBannerText: {
      fontSize: 11.5,
      color: colors.danger,
      lineHeight: 16,
    },
    errorSwitchBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 6,
    },
    errorSwitchBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    footerActionRow: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 8,
    },
    cancelBtn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    cancelBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    submitConnectBtn: {
      flex: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    submitConnectBtnText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
};
