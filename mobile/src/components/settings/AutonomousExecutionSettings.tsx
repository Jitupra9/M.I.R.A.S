import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface AutonomousExecutionSettingsProps {
  backgroundTasks: boolean;
  onToggleBackgroundTasks: (val: boolean) => void;
  quietHours: boolean;
  onToggleQuietHours: (val: boolean) => void;
  haptics: boolean;
  onToggleHaptics: (val: boolean) => void;
}

export const AutonomousExecutionSettings: React.FC<AutonomousExecutionSettingsProps> = ({
  backgroundTasks,
  onToggleBackgroundTasks,
  quietHours,
  onToggleQuietHours,
  haptics,
  onToggleHaptics,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Sparkles size={16} color={colors.primary} />
        <Text style={styles.sectionTitle}>AUTONOMOUS CHORES & NOTIFICATIONS</Text>
      </View>

      <View style={styles.settingItemRow}>
        <View style={styles.settingTextCol}>
          <Text style={styles.settingLabel}>Background Chore Execution</Text>
          <Text style={styles.settingSubtext}>
            Allow MIRAS to monitor flights & triage email in background
          </Text>
        </View>
        <Switch
          value={backgroundTasks}
          onValueChange={onToggleBackgroundTasks}
          trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
          thumbColor={backgroundTasks ? colors.primary : colors.textMuted}
        />
      </View>

      <View style={styles.settingItemRow}>
        <View style={styles.settingTextCol}>
          <Text style={styles.settingLabel}>Quiet Hours (10 PM - 7 AM)</Text>
          <Text style={styles.settingSubtext}>Silence all voice announcements and audio alerts</Text>
        </View>
        <Switch
          value={quietHours}
          onValueChange={onToggleQuietHours}
          trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
          thumbColor={quietHours ? colors.primary : colors.textMuted}
        />
      </View>

      <View style={styles.settingItemRow}>
        <View style={styles.settingTextCol}>
          <Text style={styles.settingLabel}>Haptic Feedback</Text>
          <Text style={styles.settingSubtext}>Tactile vibrations on task confirmation</Text>
        </View>
        <Switch
          value={haptics}
          onValueChange={onToggleHaptics}
          trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
          thumbColor={haptics ? colors.primary : colors.textMuted}
        />
      </View>
    </View>
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
    settingItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
    },
    settingTextCol: {
      flex: 1,
      paddingRight: 12,
    },
    settingLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    settingSubtext: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
