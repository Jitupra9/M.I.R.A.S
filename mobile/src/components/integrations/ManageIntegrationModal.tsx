import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  Zap,
  Key,
  ArrowRightLeft,
  Trash2,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ConnectionMethod, IntegrationItem } from '../../types/integrations';
import { PlatformIcon } from './PlatformIcon';

interface ManageIntegrationModalProps {
  manageIntegration: IntegrationItem | null;
  onClose: () => void;
  onSwitchMethod: (method: ConnectionMethod, integration: IntegrationItem) => void;
  onDisconnect: (integrationId: string) => void;
  onDeleteIntegration: (integrationId: string) => void;
}

export const ManageIntegrationModal: React.FC<ManageIntegrationModalProps> = ({
  manageIntegration,
  onClose,
  onSwitchMethod,
  onDisconnect,
  onDeleteIntegration,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!manageIntegration) return null;

  return (
    <Modal
      visible={!!manageIntegration}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetModal}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <PlatformIcon iconType={manageIntegration.iconType} isConnected={true} size={22} />
              <View>
                <Text style={styles.sheetTitle}>Manage {manageIntegration.name}</Text>
                <Text style={styles.sheetSub}>
                  Active Connection: {manageIntegration.activeMethod?.toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
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
                    manageIntegration.activeMethod === 'mcp' ? styles.mcpPill : styles.apiPill,
                  ]}
                >
                  {manageIntegration.activeMethod === 'mcp' ? (
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
                  {manageIntegration.toolsDiscovered || 4} Tools Available
                </Text>
              </View>

              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Last Connected</Text>
                <Text style={styles.overviewValue}>
                  {manageIntegration.lastConnectedAt || 'Today'}
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
                  {manageIntegration.activeMethod?.toUpperCase()}
                </Text>{' '}
                connection with a{' '}
                <Text style={{ fontWeight: '700', color: colors.primary }}>
                  {manageIntegration.activeMethod === 'mcp' ? 'API' : 'MCP'}
                </Text>{' '}
                connection. Only one method can be active at a time.
              </Text>

              <TouchableOpacity
                style={styles.switchMethodBtn}
                onPress={() => {
                  const nextMethod: ConnectionMethod =
                    manageIntegration.activeMethod === 'mcp' ? 'api' : 'mcp';
                  onSwitchMethod(nextMethod, manageIntegration);
                }}
                activeOpacity={0.8}
              >
                <ArrowRightLeft size={14} color={colors.buttonTextDark} />
                <Text style={styles.switchMethodBtnText}>
                  Switch to {manageIntegration.activeMethod === 'mcp' ? 'API' : 'MCP'} Connection
                </Text>
              </TouchableOpacity>
            </View>

            {/* Disconnect & Remove */}
            <View style={styles.disconnectCard}>
              <TouchableOpacity
                style={styles.disconnectBtn}
                onPress={() => onDisconnect(manageIntegration.id)}
                activeOpacity={0.8}
              >
                <Trash2 size={14} color={colors.danger} />
                <Text style={styles.disconnectBtnText}>Disconnect Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeFromCategoryBtn}
                onPress={() => onDeleteIntegration(manageIntegration.id)}
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
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 28,
      maxHeight: '90%',
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
    overviewCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 10,
      marginBottom: 14,
    },
    overviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    overviewLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    overviewValue: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    activeStatusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    mcpPill: {
      backgroundColor: 'rgba(0, 229, 153, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.3)',
    },
    mcpPillText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
    },
    apiPill: {
      backgroundColor: 'rgba(6, 182, 212, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    apiPillText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#06B6D4',
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
    },
    switchMethodCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
      marginBottom: 14,
    },
    switchMethodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
    },
    switchMethodBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.primary,
      marginTop: 4,
    },
    switchMethodBtnText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    disconnectCard: {
      gap: 8,
      paddingBottom: 20,
    },
    disconnectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 11,
      borderRadius: 10,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    disconnectBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.danger,
    },
    removeFromCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
    },
    removeFromCategoryBtnText: {
      fontSize: 11.5,
      color: colors.textMuted,
    },
  });
};
