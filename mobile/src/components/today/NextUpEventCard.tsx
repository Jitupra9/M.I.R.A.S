import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Sparkles } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface NextUpEventCardProps {
  notesActive: boolean;
  reminderSet: boolean;
  onToggleNotes: () => void;
  onSetReminder: () => void;
  onOpenNotesSheet: () => void;
}

export const NextUpEventCard: React.FC<NextUpEventCardProps> = ({
  notesActive,
  reminderSet,
  onToggleNotes,
  onSetReminder,
  onOpenNotesSheet,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.nextEventCard}>
      <View style={styles.nextEventHeader}>
        <Text style={styles.nextBadgeText}>● NEXT IN 35 MINS</Text>
        <Text style={styles.nextTime}>10:30 AM</Text>
      </View>

      <Text style={styles.nextTitle}>Team Product Sync</Text>
      <Text style={styles.nextSub}>
        Google Meet • Would you like me to join, transcribe action items, and compile your notes?
      </Text>

      {notesActive && (
        <TouchableOpacity style={styles.notesActivePill} onPress={onOpenNotesSheet}>
          <Sparkles size={13} color={colors.buttonTextDark} />
          <Text style={styles.notesActivePillText}>MIRAS Note-Taker Active • 3 points captured</Text>
        </TouchableOpacity>
      )}

      <View style={styles.nextBtnRow}>
        <TouchableOpacity
          style={[styles.takeNotesBtn, notesActive && styles.takeNotesBtnActive]}
          onPress={onToggleNotes}
        >
          <Text style={[styles.takeNotesBtnText, notesActive && styles.takeNotesBtnTextActive]}>
            {notesActive ? 'Notes Enabled ✓' : 'Take notes for me'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.remindBtn, reminderSet && styles.remindBtnDone]}
          onPress={onSetReminder}
        >
          <Clock size={13} color={reminderSet ? colors.primary : colors.textSecondary} />
          <Text style={[styles.remindBtnText, reminderSet && { color: colors.primary }]}>
            {reminderSet ? 'Set for 10:35' : 'Remind in 5m'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    nextEventCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    nextEventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    nextBadgeText: {
      fontSize: 10.5,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.primary,
    },
    nextTime: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
    },
    nextTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    nextSub: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    notesActivePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 12,
    },
    notesActivePillText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    nextBtnRow: {
      flexDirection: 'row',
      gap: 10,
    },
    takeNotesBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    takeNotesBtnActive: {
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    takeNotesBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
    takeNotesBtnTextActive: {
      color: colors.primary,
    },
    remindBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.cardBgSubtle,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    remindBtnDone: {
      borderColor: colors.primary,
      backgroundColor: colors.surfaceCard,
    },
    remindBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
