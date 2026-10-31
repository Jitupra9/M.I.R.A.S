import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  Sparkles,
  X,
  Briefcase,
  Globe,
  Code2,
  MessageSquare,
  Server,
  Database,
  Cloud,
  Key,
  Check,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ConnectionMethod, IntegrationCategory } from '../../types/integrations';
import { PlatformIcon } from './PlatformIcon';

interface CustomAppModalProps {
  visible: boolean;
  customAppName: string;
  customAppUrl: string;
  customAppDesc: string;
  customAppCategory: string;
  customAppIcon: string;
  customAppMethod: ConnectionMethod;
  categories: IntegrationCategory[];
  onChangeName: (val: string) => void;
  onChangeUrl: (val: string) => void;
  onChangeDesc: (val: string) => void;
  onChangeCategory: (val: string) => void;
  onChangeIcon: (val: string) => void;
  onChangeMethod: (val: ConnectionMethod) => void;
  onClose: () => void;
  onSave: () => void;
}

export const CustomAppModal: React.FC<CustomAppModalProps> = ({
  visible,
  customAppName,
  customAppUrl,
  customAppDesc,
  customAppCategory,
  customAppIcon,
  customAppMethod,
  categories,
  onChangeName,
  onChangeUrl,
  onChangeDesc,
  onChangeCategory,
  onChangeIcon,
  onChangeMethod,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.dialogScroll}>
            {/* Platform / App Name */}
            <Text style={styles.inputLabel}>APPLICATION / PLATFORM NAME *</Text>
            <TextInput
              style={styles.textInput}
              value={customAppName}
              onChangeText={onChangeName}
              placeholder="e.g. LinkedIn, Naukri, WorkIndia, Custom Portal..."
              placeholderTextColor={colors.textMuted}
            />

            {/* Application Link / Endpoint URL */}
            <Text style={styles.inputLabel}>APPLICATION LINK / SERVER URL (OPTIONAL)</Text>
            <TextInput
              style={styles.textInput}
              value={customAppUrl}
              onChangeText={onChangeUrl}
              placeholder="e.g. https://recruiter.naukri.com/api or sse://server/v1"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />

            {/* Description */}
            <Text style={styles.inputLabel}>DESCRIPTION / ROLE</Text>
            <TextInput
              style={styles.textInput}
              value={customAppDesc}
              onChangeText={onChangeDesc}
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
                    onPress={() => onChangeCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <PlatformIcon iconType={cat.iconType} isConnected={isSelected} size={14} />
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
                  onPress={() => onChangeIcon(item.id)}
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
                onPress={() => onChangeMethod('api')}
                activeOpacity={0.8}
              >
                <Key
                  size={13}
                  color={customAppMethod === 'api' ? colors.buttonTextDark : colors.textSecondary}
                />
                <Text
                  numberOfLines={1}
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
                onPress={() => onChangeMethod('mcp')}
                activeOpacity={0.8}
              >
                <Server
                  size={13}
                  color={customAppMethod === 'mcp' ? colors.buttonTextDark : colors.textSecondary}
                />
                <Text
                  numberOfLines={1}
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
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitConnectBtn,
                  !customAppName.trim() && { opacity: 0.5 },
                ]}
                onPress={onSave}
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
      paddingBottom: 32,
      maxHeight: '92%',
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
    inputLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.6,
      marginTop: 10,
      marginBottom: 6,
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
    categoryPickerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryPickerChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    categoryPickerChipActive: {
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      borderColor: colors.primary,
    },
    categoryPickerChipText: {
      fontSize: 11.5,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    categoryPickerChipTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    iconSelectorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    iconSelectorBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    iconSelectorBtnActive: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
    },
    iconSelectorLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    iconSelectorLabelActive: {
      color: colors.primary,
      fontWeight: '700',
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
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: -0.25,
    },
    segmentBtnTextActive: {
      color: colors.buttonTextDark,
      fontWeight: '800',
    },
    footerActionRow: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 10,
      paddingBottom: 24,
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
