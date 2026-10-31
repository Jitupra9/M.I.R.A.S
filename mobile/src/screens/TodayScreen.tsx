import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';
import { AppHeader } from '../components/AppHeader';

import { TodayScreenProps } from '../types/today';
import { GreetingBanner } from '../components/today/GreetingBanner';
import { NextUpEventCard } from '../components/today/NextUpEventCard';
import { DailyTimelineSection } from '../components/today/DailyTimelineSection';
import { HabitsRoutinesSection } from '../components/today/HabitsRoutinesSection';
import { MeetingDetailsModal } from '../components/today/MeetingDetailsModal';
import { NotesSheetModal } from '../components/today/NotesSheetModal';
import { LunchModal } from '../components/today/LunchModal';
import { DentistModal } from '../components/today/DentistModal';

export type { TodayScreenProps };

export const TodayScreen: React.FC<TodayScreenProps> = ({ onOpenProfile }) => {
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
    setVitaminsDone((prev) => !prev);
  };

  const handleToggleNotes = () => {
    VoiceService.triggerHaptic('success');
    setNotesActive((prev) => !prev);
  };

  const handleSetReminder = () => {
    VoiceService.triggerHaptic('medium');
    setReminderSet(true);
  };

  return (
    <View style={styles.container}>
      {/* Unified Fixed Top Header */}
      <AppHeader onOpenProfile={onOpenProfile || (() => setIsProfileOpen(true))} />

      <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.content}>
        {/* Greeting Banner */}
        <GreetingBanner />

        {/* Next Up Alert Card */}
        <NextUpEventCard
          notesActive={notesActive}
          reminderSet={reminderSet}
          onToggleNotes={handleToggleNotes}
          onSetReminder={handleSetReminder}
          onOpenNotesSheet={() => setIsNotesSheetOpen(true)}
        />

        {/* Daily Timeline */}
        <DailyTimelineSection
          onOpenMeeting={() => setIsMeetingModalOpen(true)}
          onOpenLunch={() => setIsLunchModalOpen(true)}
          onOpenDentist={() => setIsDentistModalOpen(true)}
        />

        {/* Habits & Routines */}
        <HabitsRoutinesSection
          vitaminsDone={vitaminsDone}
          glasses={glasses}
          onToggleVitamins={handleToggleVitamins}
          onLogWater={handleLogWater}
        />

        {/* Modal 1: Meeting Details */}
        <MeetingDetailsModal
          visible={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
        />

        {/* Modal 2: Notes Sheet */}
        <NotesSheetModal
          visible={isNotesSheetOpen}
          onClose={() => setIsNotesSheetOpen(false)}
        />

        {/* Modal 3: Lunch with Sarah */}
        <LunchModal
          visible={isLunchModalOpen}
          onClose={() => setIsLunchModalOpen(false)}
        />

        {/* Modal 4: Dentist Ride Details */}
        <DentistModal
          visible={isDentistModalOpen}
          onClose={() => setIsDentistModalOpen(false)}
        />

        {/* Profile & Settings Modal */}
        <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollWrapper: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 40,
    },
  });
