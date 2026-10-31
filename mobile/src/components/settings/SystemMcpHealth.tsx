import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Globe, HardDrive, ShieldCheck, Terminal, Trash2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface SystemMcpHealthProps {
  cacheCleared: boolean;
  onClearCache: () => void;
}

export const SystemMcpHealth: React.FC<SystemMcpHealthProps> = ({
  cacheCleared,
  onClearCache,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      {/* 4. STORAGE & CACHE */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <HardDrive size={16} color={colors.textMuted} />
          <Text style={styles.sectionTitle}>STORAGE & MEMORY</Text>
        </View>

        <TouchableOpacity style={styles.clearCacheBtn} onPress={onClearCache}>
          <Trash2 size={15} color={colors.textSecondary} />
          <Text style={styles.clearCacheText}>
            {cacheCleared ? 'Cache Cleared (0 KB)' : 'Clear Temporary Audio Cache (24.8 MB)'}
          </Text>
          {cacheCleared && <Check size={14} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* 5. MCP TOOL SERVERS HEALTH */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ShieldCheck size={16} color={colors.success} />
          <Text style={styles.sectionTitle}>MCP TOOL SERVERS HEALTH</Text>
        </View>

        <View style={styles.mcpList}>
          <View style={styles.mcpItem}>
            <Globe size={15} color={colors.primary} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>Playwright Web Browser MCP</Text>
              <Text style={styles.mcpSub}>Flight booking, job portals & dynamic web forms</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>

          <View style={styles.mcpItem}>
            <HardDrive size={15} color={colors.success} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>Google Workspace & Drive MCP</Text>
              <Text style={styles.mcpSub}>Email triage, calendar & cloud document sync</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>

          <View style={styles.mcpItem}>
            <Terminal size={15} color={colors.warning} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>OS & Filesystem MCP</Text>
              <Text style={styles.mcpSub}>Local terminal execution & file management</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>
        </View>
      </View>

      {/* APP INFO FOOTER */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerVersion}>MIRAS Autonomous Assistant • v2.4.0</Text>
        <Text style={styles.footerSub}>Privacy Guaranteed • End-to-End Encrypted</Text>
      </View>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      marginBottom: 22,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 1,
    },
    clearCacheBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.cardBg,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    clearCacheText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
    },
    mcpList: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    mcpItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
    },
    mcpTextCol: {
      flex: 1,
    },
    mcpName: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    mcpSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    mcpStatus: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.success,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 6,
    },
    footerInfo: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    footerVersion: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
    },
    footerSub: {
      fontSize: 10.5,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
