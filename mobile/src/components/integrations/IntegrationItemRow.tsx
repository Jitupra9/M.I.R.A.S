import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Settings2, Plus, RefreshCw, AlertCircle, Zap, Key } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { IntegrationItem } from '../../types/integrations';
import { PlatformIcon } from './PlatformIcon';

interface IntegrationItemRowProps {
  integration: IntegrationItem;
  isLast?: boolean;
  onOpenManage: (integration: IntegrationItem) => void;
  onOpenSetup: (integration: IntegrationItem) => void;
}

export const IntegrationItemRow: React.FC<IntegrationItemRowProps> = ({
  integration,
  isLast,
  onOpenManage,
  onOpenSetup,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const isMcp = integration.status === 'connected_mcp';
  const isApi = integration.status === 'connected_api';
  const isConnected = isMcp || isApi;
  const isConnecting = integration.status === 'connecting';
  const isFailed = integration.status === 'failed';

  return (
    <View
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
        <PlatformIcon iconType={integration.iconType} isConnected={isConnected} size={18} />
      </View>

      {/* Center: Info with single clean status badge */}
      <View style={styles.accountItemMiddle}>
        <View style={styles.accountNameRow}>
          <Text style={styles.accountItemName} numberOfLines={1}>
            {integration.name}
          </Text>

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

        {/* Subtitle */}
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
            onPress={() => onOpenManage(integration)}
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
            onPress={() => onOpenSetup(integration)}
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
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    accountListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
    },
    accountListItemBorder: {
      borderBottomWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    accountListItemActive: {
      backgroundColor: 'rgba(0, 229, 153, 0.02)',
    },
    platformIconSquircle: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    platformIconSquircleActive: {
      borderColor: 'rgba(0, 229, 153, 0.3)',
      backgroundColor: 'rgba(0, 229, 153, 0.08)',
    },
    accountItemMiddle: {
      flex: 1,
      minWidth: 0,
    },
    accountNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    accountItemName: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    activeStatusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 6,
    },
    mcpPill: {
      backgroundColor: 'rgba(0, 229, 153, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.3)',
    },
    mcpPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
    },
    apiPill: {
      backgroundColor: 'rgba(6, 182, 212, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(6, 182, 212, 0.3)',
    },
    apiPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#06B6D4',
    },
    failedStatusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 6,
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
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    accountItemAction: {
      flexShrink: 0,
    },
    managePillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: 'rgba(0, 229, 153, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.25)',
    },
    managePillBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    connectingPlaceholder: {
      width: 60,
      alignItems: 'center',
    },
    connectPillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    connectPillBtnText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    retryPillBtn: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    retryPillBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.danger,
    },
  });
};
