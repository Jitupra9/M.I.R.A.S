import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Video, Utensils, Activity } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface DailyTimelineSectionProps {
  onOpenMeeting: () => void;
  onOpenLunch: () => void;
  onOpenDentist: () => void;
}

export const DailyTimelineSection: React.FC<DailyTimelineSectionProps> = ({
  onOpenMeeting,
  onOpenLunch,
  onOpenDentist,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Daily Timeline</Text>
        <Text style={styles.countBadge}>4 schedule points</Text>
      </View>

      {/* 1: Finished Coffee */}
      <View style={styles.timelineItem}>
        <View style={styles.iconCircleDone}>
          <CheckCircle2 size={14} color={colors.primary} />
        </View>
        <View style={styles.timelineDetails}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>09:00 AM – 10:00 AM</Text>
            <Text style={styles.finishedBadge}>Finished</Text>
          </View>
          <Text style={styles.itemTitle}>Morning Focus & Coffee</Text>
          <Text style={styles.itemSub}>Home Studio • Pour over brewed</Text>
        </View>
      </View>

      {/* 2: Product Sync */}
      <TouchableOpacity style={styles.timelineItem} onPress={onOpenMeeting}>
        <View style={styles.iconCircleActive}>
          <Video size={14} color={colors.primary} />
        </View>
        <View style={styles.timelineDetails}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>10:30 AM – 11:15 AM</Text>
            <Text style={styles.inMinsBadge}>In 35 min</Text>
          </View>
          <Text style={styles.itemTitle}>Team Product Sync</Text>
          <Text style={styles.itemSub}>Meet video room • 6 participants</Text>

          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => {
              VoiceService.triggerHaptic('medium');
              onOpenMeeting();
            }}
          >
            <Text style={styles.joinBtnText}>Join Meeting</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* 3: Lunch with Sarah */}
      <TouchableOpacity style={styles.timelineItem} onPress={onOpenLunch}>
        <View style={styles.iconCircle}>
          <Utensils size={14} color={colors.primary} />
        </View>
        <View style={styles.timelineDetails}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>12:30 PM – 01:30 PM</Text>
            <Text style={styles.confirmedBadge}>Table confirmed</Text>
          </View>
          <Text style={styles.itemTitle}>Lunch with Sarah</Text>
          <Text style={styles.itemSub}>Greenwood Cafe • Table reserved by MIRAS (Tap details)</Text>
        </View>
      </TouchableOpacity>

      {/* 4: Dentist Routine Checkup */}
      <TouchableOpacity style={styles.timelineItem} onPress={onOpenDentist}>
        <View style={styles.iconCircle}>
          <Activity size={14} color={colors.primary} />
        </View>
        <View style={styles.timelineDetails}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>03:00 PM – 03:45 PM</Text>
            <Text style={styles.rideSetBadge}>Ride Set</Text>
          </View>
          <Text style={styles.itemTitle}>Dentist Routine Checkup</Text>
          <Text style={styles.itemSub}>Dr. Miller Clinic • Uber pickup scheduled (Tap details)</Text>
        </View>
      </TouchableOpacity>
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
    timelineItem: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 14,
    },
    iconCircleDone: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    iconCircleActive: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceCard,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    iconCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.cardBgSubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    timelineDetails: {
      flex: 1,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    timeLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    finishedBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textMuted,
    },
    inMinsBadge: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
    },
    confirmedBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.primary,
    },
    rideSetBadge: {
      fontSize: 10,
      fontWeight: '700',
      color: '#60A5FA',
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 1,
    },
    itemSub: {
      fontSize: 11.5,
      color: colors.textSecondary,
    },
    joinBtn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    joinBtnText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
  });
