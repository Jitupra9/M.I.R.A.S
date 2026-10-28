import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  Sun,
  CheckCircle2,
  Clock,
  Video,
  Coffee,
  Utensils,
  Activity,
  Droplets,
  Moon,
  Plus,
  Minus,
  RefreshCw,
  X,
  MapPin,
  Phone,
  FileText,
  Car,
  ExternalLink,
  Users,
  Check,
  Sparkles,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';

export const TodayScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [glasses, setGlasses] = useState(4);
  const [vitaminsDone, setVitaminsDone] = useState(true);
  const [notesActive, setNotesActive] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [isLunchModalOpen, setIsLunchModalOpen] = useState(false);
  const [isDentistModalOpen, setIsDentistModalOpen] = useState(false);

  const handleLogWater = (delta: number) => {
    VoiceService.triggerHaptic('light');
    const newCount = Math.max(0, Math.min(8, glasses + delta));
    setGlasses(newCount);

    if (newCount === 8) {
      VoiceService.triggerHaptic('success');
    } else {
      VoiceService.triggerHaptic('light');
    }
  };

  const handleToggleVitamins = () => {
    VoiceService.triggerHaptic('medium');
    const nextState = !vitaminsDone;
    setVitaminsDone(nextState);
  };

  const handleToggleNotes = () => {
    VoiceService.triggerHaptic('success');
    const next = !notesActive;
    setNotesActive(next);
  };

  const handleSetReminder = () => {
    VoiceService.triggerHaptic('medium');
    setReminderSet(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>MIRAS</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setIsProfileOpen(true)}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting Banner */}
      <View style={styles.greetingCard}>
        <View style={styles.dateWeatherRow}>
          <Text style={styles.dateText}>THURSDAY, OCT 17</Text>
          <View style={styles.weatherBadge}>
            <Sun size={13} color={colors.primary} />
            <Text style={styles.weatherText}>72°F Breezy</Text>
          </View>
        </View>

        <Text style={styles.greetingTitle}>Good morning, Alex</Text>
        <Text style={styles.cadenceText}>
          You have <Text style={{ color: colors.primary, fontWeight: '700' }}>4 events</Text> and <Text style={{ color: colors.primary, fontWeight: '700' }}>2 reminders</Text> today. Your morning cadence looks comfortable and relaxed.
        </Text>
      </View>

      {/* Next Up Alert Card */}
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
          <TouchableOpacity style={styles.notesActivePill} onPress={() => setIsNotesSheetOpen(true)}>
            <Sparkles size={13} color={colors.buttonTextDark} />
            <Text style={styles.notesActivePillText}>MIRAS Note-Taker Active • 3 points captured</Text>
          </TouchableOpacity>
        )}

        <View style={styles.nextBtnRow}>
          <TouchableOpacity
            style={[styles.takeNotesBtn, notesActive && styles.takeNotesBtnActive]}
            onPress={handleToggleNotes}
          >
            <Text style={[styles.takeNotesBtnText, notesActive && styles.takeNotesBtnTextActive]}>
              {notesActive ? 'Notes Enabled ✓' : 'Take notes for me'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.remindBtn, reminderSet && styles.remindBtnDone]}
            onPress={handleSetReminder}
          >
            <Clock size={13} color={reminderSet ? colors.primary : colors.textSecondary} />
            <Text style={[styles.remindBtnText, reminderSet && { color: colors.primary }]}>
              {reminderSet ? 'Set for 10:35' : 'Remind in 5m'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Timeline */}
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
        <TouchableOpacity style={styles.timelineItem} onPress={() => setIsMeetingModalOpen(true)}>
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
                setIsMeetingModalOpen(true);
              }}
            >
              <Text style={styles.joinBtnText}>Join Meeting</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* 3: Lunch with Sarah */}
        <TouchableOpacity style={styles.timelineItem} onPress={() => setIsLunchModalOpen(true)}>
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
        <TouchableOpacity style={styles.timelineItem} onPress={() => setIsDentistModalOpen(true)}>
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

      {/* Habits & Routines */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Habits & Routines</Text>
          <Text style={styles.countBadge}>Today's Balance</Text>
        </View>

        {/* Vitamins (Clickable Toggle) */}
        <TouchableOpacity style={styles.habitCard} onPress={handleToggleVitamins}>
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

        {/* Hydration Tracker with Plus and Minus */}
        <View style={styles.habitCard}>
          <Droplets size={18} color={colors.primary} />
          <View style={styles.habitCol}>
            <View style={styles.waterHeaderRow}>
              <Text style={styles.habitTitle}>Hydration Tracker</Text>
              <Text style={styles.waterCount}>
                {glasses} / 8 glasses ({Math.round((glasses / 8) * 100)}%)
              </Text>
            </View>
            <View style={styles.waterTrack}>
              <View style={[styles.waterFill, { width: `${(glasses / 8) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.waterBtnRow}>
            <TouchableOpacity
              style={styles.waterMiniBtn}
              onPress={() => handleLogWater(-1)}
              disabled={glasses === 0}
            >
              <Minus size={12} color={glasses === 0 ? colors.textMuted : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logGlassBtn} onPress={() => handleLogWater(1)}>
              <Plus size={12} color={colors.buttonTextDark} />
              <Text style={styles.logGlassText}>+1</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal 1: Meeting Details */}
      <Modal visible={isMeetingModalOpen} transparent animationType="slide" onRequestClose={() => setIsMeetingModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Team Product Sync</Text>
              <TouchableOpacity onPress={() => setIsMeetingModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetMetaRow}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.sheetMetaText}>10:30 AM – 11:15 AM (In 35 mins)</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>GOOGLE MEET LINK</Text>
              <Text style={styles.infoBoxValue}>meet.google.com/miras-prod-sync</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>CONFIRMED ATTENDEES (6)</Text>
              <Text style={styles.infoBoxSub}>• Alex Morgan (You)</Text>
              <Text style={styles.infoBoxSub}>• Sarah Jenkins (Product Lead)</Text>
              <Text style={styles.infoBoxSub}>• David Miller (Engineering)</Text>
              <Text style={styles.infoBoxSub}>• Elena Rostova (Design)</Text>
              <Text style={styles.infoBoxSub}>• MIRAS AI (Silent Note-Taker)</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => {
                VoiceService.triggerHaptic('success');
                setIsMeetingModalOpen(false);
              }}
            >
              <ExternalLink size={16} color={colors.buttonTextDark} />
              <Text style={styles.primaryModalBtnText}>Launch Meeting Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Notes Sheet */}
      <Modal visible={isNotesSheetOpen} transparent animationType="slide" onRequestClose={() => setIsNotesSheetOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>MIRAS Auto-Captured Notes</Text>
              <TouchableOpacity onPress={() => setIsNotesSheetOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.notesSub}>Syncing live with Team Product Sync</Text>

            <View style={styles.noteCard}>
              <Text style={styles.noteBullet}>📌 <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Q4 Deliverables:</Text> Finalize voice-first mobile interface testing by Friday.</Text>
              <Text style={styles.noteBullet}>📌 <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Action for Alex:</Text> Review Delta boarding pass confirmation code with team.</Text>
              <Text style={styles.noteBullet}>📌 <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Sarah:</Text> Sending updated customer survey report by 2 PM.</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => {
                VoiceService.triggerHaptic('medium');
                setIsNotesSheetOpen(false);
              }}
            >
              <FileText size={16} color={colors.buttonTextDark} />
              <Text style={styles.primaryModalBtnText}>Save Notes to Google Drive</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 3: Lunch with Sarah */}
      <Modal visible={isLunchModalOpen} transparent animationType="slide" onRequestClose={() => setIsLunchModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Lunch with Sarah</Text>
              <TouchableOpacity onPress={() => setIsLunchModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>RESTAURANT & RESERVATION</Text>
              <Text style={styles.infoBoxValue}>Greenwood Cafe & Bistro</Text>
              <Text style={styles.infoBoxSub}>142 Main Street • Table for 2</Text>
              <Text style={[styles.infoBoxSub, { color: colors.primary, marginTop: 4 }]}>Confirmation Code: #GW-9821</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>DIETARY PREFERENCES SAVED</Text>
              <Text style={styles.infoBoxSub}>• MIRAS alerted kitchen: Shellfish & peanut allergy noted</Text>
              <Text style={styles.infoBoxSub}>• Quiet booth requested</Text>
            </View>

            <View style={styles.sheetBtnRow}>
              <TouchableOpacity
                style={styles.secondaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                }}
              >
                <Phone size={15} color={colors.primary} />
                <Text style={styles.secondaryModalBtnText}>Call Cafe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryModalBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  setIsLunchModalOpen(false);
                }}
              >
                <MapPin size={15} color={colors.buttonTextDark} />
                <Text style={styles.primaryModalBtnText}>Directions (8 min walk)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 4: Dentist Ride Details */}
      <Modal visible={isDentistModalOpen} transparent animationType="slide" onRequestClose={() => setIsDentistModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Dentist Appointment & Uber</Text>
              <TouchableOpacity onPress={() => setIsDentistModalOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>CLINIC APPOINTMENT</Text>
              <Text style={styles.infoBoxValue}>Dr. Miller Family Dental Clinic</Text>
              <Text style={styles.infoBoxSub}>300 Medical Plaza, Suite 402 • 03:00 PM</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>SCHEDULED UBER RIDE</Text>
              <Text style={styles.infoBoxValue}>Uber Comfort • Pickup 02:40 PM</Text>
              <Text style={styles.infoBoxSub}>Driver: Michael (Silver Toyota Camry • 7XYZ99)</Text>
              <Text style={[styles.infoBoxSub, { color: colors.primary, marginTop: 4 }]}>Estimated Fare: $18.40 (Charged to Corporate card)</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryModalBtn}
              onPress={() => {
                VoiceService.triggerHaptic('medium');
                setIsDentistModalOpen(false);
              }}
            >
              <Car size={16} color={colors.buttonTextDark} />
              <Text style={styles.primaryModalBtnText}>Confirm Pickup Spot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile & Settings Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  greetingCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  dateWeatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  weatherText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  cadenceText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSecondary,
  },
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
  waterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  waterCount: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  sheetMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  infoBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
    marginBottom: 4,
  },
  infoBoxValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoBoxSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  primaryModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 8,
  },
  primaryModalBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  secondaryModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.cardBgSubtle,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    marginTop: 8,
  },
  secondaryModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  sheetBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  notesSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  noteCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 10,
  },
  noteBullet: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
