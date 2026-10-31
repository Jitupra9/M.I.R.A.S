import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  X,
  RefreshCw,
  Trash2,
  Check,
  Mail,
  Cloud,
  MessageSquare,
  FileText,
  Headphones,
  ShoppingCart,
  Plane,
  CreditCard,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileAccountItem } from './ProfileModal';
import {
  DEFAULT_SERVICE_CONFIGS,
  getMockConnectionTest,
  ConnectionTestResultData,
} from '../data/serviceDefaults';
import { ConnectionTestResult } from './serviceConfig/ConnectionTestResult';
import { DynamicServiceForm } from './serviceConfig/DynamicServiceForm';

export interface ServiceConfigModalProps {
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
  const [testResult, setTestResult] = useState<ConnectionTestResultData | null>(null);

  // Initialize or reset form state whenever selected service changes
  useEffect(() => {
    if (!service) return;

    setFormData(existingConfig || DEFAULT_SERVICE_CONFIGS[service.id] || {});
    setTestResult(null);
    setIsTesting(false);
  }, [service, existingConfig]);

  if (!service) return null;

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setTestResult(null);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Run dynamic and realistic connection testing simulation
  const handleTestConnection = () => {
    VoiceService.triggerHaptic('light');
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      VoiceService.triggerHaptic('success');
      const result = getMockConnectionTest(service.id, service.title, formData);
      setTestResult(result);
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
      case 'chat':
        return <MessageSquare size={20} color={color} />;
      case 'notion':
        return <FileText size={20} color={color} />;
      case 'music':
        return <Headphones size={20} color={color} />;
      case 'cart':
        return <ShoppingCart size={20} color={color} />;
      case 'flight':
        return <Plane size={20} color={color} />;
      case 'bank':
        return <CreditCard size={20} color={color} />;
      default:
        return <Cloud size={20} color={color} />;
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
            <DynamicServiceForm
              serviceId={service.id}
              formData={formData}
              updateField={updateField}
              showSecrets={showSecrets}
              toggleSecret={toggleSecret}
              onSetTestResult={setTestResult}
            />

            {/* Test Connection Result Box */}
            <ConnectionTestResult testResult={testResult} />

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
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
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
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '92%',
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    configHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorderSubtle,
    },
    configHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    serviceIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surfaceCard,
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
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    formContent: {
      padding: 20,
      paddingBottom: 36,
    },
    testBtn: {
      borderRadius: 12,
      paddingVertical: 12,
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
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
      gap: 10,
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
      fontSize: 14,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    disconnectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 12,
      paddingVertical: 11,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    disconnectBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: '#EF4444',
    },
  });
