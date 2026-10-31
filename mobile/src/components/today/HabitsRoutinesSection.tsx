import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Droplets, Minus, Plus } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface HabitsRoutinesSectionProps {
  vitaminsDone: boolean;
  glasses: number;
  onToggleVitamins: () => void;
  onLogWater: (delta: number) => void;
}

export const HabitsRoutinesSection: React.FC<HabitsRoutinesSectionProps> = ({
  vitaminsDone,
  glasses,
  onToggleVitamins,
  onLogWater,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Habits & Routines</Text>
        <Text style={styles.countBadge}>Today's Balance</Text>
      </View>

      {/* Vitamins (Clickable Toggle) */}
      <TouchableOpacity style={styles.habitCard} onPress={onToggleVitamins}>
        <CheckCircle2
          size={18}
          color={vitaminsDone ? colors.primary : colors.textMuted}
        />
        <View style={styles.habitCol}>
          <Text style={styles.habitTitle}>Morning Vitamins</Text>
          <Text style={styles.habitSub}>
            {vitaminsDone ? 'Omega 3, Zinc & D3 taken at 8:45 AM' : 'Pending: Take with water'}
          </Text>
        </View>
        <Text style={[styles.doneText, !vitaminsDone && { color: colors.textMuted }]}>
          {vitaminsDone ? 'Done ✓' : 'Tap to complete'}
        </Text>
      </TouchableOpacity>

      {/* Hydration Tracker with Plus and Minus (Zero overlap) */}
      <View style={styles.hydrationCard}>
        <View style={styles.hydrationTopRow}>
          <View style={styles.hydrationTitleGroup}>
            <View style={styles.habitIconWrap}>
              <Droplets size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitTitle}>Hydration Tracker</Text>
              <Text style={styles.waterCountSub}>
                {glasses} of 8 glasses ({Math.round((glasses / 8) * 100)}%)
              </Text>
            </View>
          </View>

          <View style={styles.waterBtnRow}>
            <TouchableOpacity
              style={styles.waterMiniBtn}
              onPress={() => onLogWater(-1)}
              disabled={glasses === 0}
            >
              <Minus size={12} color={glasses === 0 ? colors.textMuted : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logGlassBtn} onPress={() => onLogWater(1)}>
              <Plus size={12} color={colors.buttonTextDark} />
              <Text style={styles.logGlassText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.waterTrack}>
          <View style={[styles.waterFill, { width: `${Math.min(100, (glasses / 8) * 100)}%` }]} />
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    countBadge: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    habitCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    habitCol: {
      flex: 1,
    },
    habitTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    habitSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    doneText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.primary,
    },
    hydrationCard: {
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    hydrationTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    hydrationTitleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      paddingRight: 8,
    },
    habitIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.badgeBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    waterCountSub: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
      marginTop: 2,
    },
    waterTrack: {
      height: 6,
      backgroundColor: colors.surfaceBorderSubtle,
      borderRadius: 3,
      overflow: 'hidden',
    },
    waterFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    waterBtnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    waterMiniBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.cardBgSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    logGlassBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    logGlassText: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
