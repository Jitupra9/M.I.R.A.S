import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';
import { ConnectAccountsSection } from '../ConnectAccountsSection';

interface PlatformsAccordionProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onShowToast: (msg: string) => void;
}

export const PlatformsAccordion: React.FC<PlatformsAccordionProps> = ({
  isExpanded,
  onToggleExpanded,
  onShowToast,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>ACCOUNT INTEGRATIONS</Text>
      </View>

      <View style={styles.platformsOptionWrapper}>
        <TouchableOpacity
          style={[
            styles.platformsTriggerCard,
            isExpanded && styles.platformsTriggerCardActive,
          ]}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            onToggleExpanded();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.platformsIconBox}>
            <Layers size={18} color={colors.primary} />
          </View>

          <View style={styles.platformsTextCol}>
            <Text style={styles.platformsTitle} numberOfLines={1}>
              Connect Platforms
            </Text>
            <Text style={styles.platformsSubtitle} numberOfLines={1}>
              {isExpanded
                ? 'Tap to collapse categories'
                : 'Link Google, Slack, GitHub & APIs'}
            </Text>
          </View>

          <View style={styles.platformsTriggerRight}>
            <View style={styles.platformsBadge}>
              <Text style={styles.platformsBadgeText}>4 CATEGORIES</Text>
            </View>
            <View style={styles.chevronBox}>
              {isExpanded ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.textSecondary} />
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Categories Container */}
        {isExpanded && (
          <View style={styles.platformsExpandedBody}>
            <ConnectAccountsSection onShowToast={onShowToast} />
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionContainer: {
      gap: 8,
    },
    sectionHeaderRow: {
      paddingHorizontal: 2,
    },
    sectionHeaderTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    platformsOptionWrapper: {
      gap: 10,
    },
    platformsTriggerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    platformsTriggerCardActive: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    platformsIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    platformsTextCol: {
      flex: 1,
      minWidth: 0,
    },
    platformsTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    platformsSubtitle: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    platformsTriggerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
    },
    platformsBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    platformsBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    chevronBox: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    platformsExpandedBody: {
      paddingTop: 4,
    },
  });
