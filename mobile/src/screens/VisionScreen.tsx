import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';
import { VisionMode, VisionItemData, LensQuestionItem } from '../types/vision';
import { VISION_PRESETS, LENS_QUESTIONS } from '../data/visionData';
import { VisionViewfinder } from '../components/vision/VisionViewfinder';
import { VisionAssistantCard } from '../components/vision/VisionAssistantCard';
import { VisionControlsBar } from '../components/vision/VisionControlsBar';
import { SampleScenePickerModal } from '../components/vision/SampleScenePickerModal';
import { MedicinePrecautionsModal } from '../components/vision/MedicinePrecautionsModal';
import { LensQaModal } from '../components/vision/LensQaModal';
import { SnapResultModal } from '../components/vision/SnapResultModal';

// Re-export for backward compatibility
export type { VisionMode, VisionItemData, LensQuestionItem };
export { VISION_PRESETS, LENS_QUESTIONS };

export const VisionScreen: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VisionMode>('identify');
  const [reminderSet, setReminderSet] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isSideEffectsOpen, setIsSideEffectsOpen] = useState(false);
  const [isLensQaOpen, setIsLensQaOpen] = useState(false);
  const [selectedQaAnswer, setSelectedQaAnswer] = useState<LensQuestionItem | null>(null);
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);

  const currentData = VISION_PRESETS[activeMode];

  const handleModeSwitch = (mode: VisionMode) => {
    VoiceService.triggerHaptic('light');
    setActiveMode(mode);
    setReminderSet(false);
    setSelectedQaAnswer(null);
    const data = VISION_PRESETS[mode];
    VoiceService.speak(`Switched to ${mode} mode. ${data.speechAnalysis}`);
  };

  const handleToggleTorch = () => {
    VoiceService.triggerHaptic('medium');
    setTorchActive(prev => !prev);
    VoiceService.speak(
      torchActive ? 'Camera light turned off.' : 'Camera illumination flashlight enabled.'
    );
  };

  const handleSnap = () => {
    VoiceService.triggerHaptic('heavy');
    setShutterFlash(true);
    setTimeout(() => {
      setShutterFlash(false);
      setIsSnapModalOpen(true);
    }, 220);

    VoiceService.speak(
      `View captured. ${currentData.title} analyzed with 99 percent confidence.`
    );
  };

  const handleSetReminder = () => {
    VoiceService.triggerHaptic('success');
    setReminderSet(true);
    if (activeMode === 'identify') {
      VoiceService.speak('Prescription reminders scheduled for 8:00 AM and 7:00 PM daily.');
    } else if (activeMode === 'document') {
      VoiceService.speak('Calendar reminder scheduled for rent on the 1st of each month.');
    } else {
      VoiceService.speak('Dietary notes and allergy information saved to MIRAS Memory.');
    }
  };

  const handleSecondaryAction = () => {
    VoiceService.triggerHaptic('light');
    if (activeMode === 'identify') {
      setIsSideEffectsOpen(true);
    } else {
      VoiceService.speak(`Detailed breakdown: ${currentData.details.join('. ')}`);
    }
  };

  const handleAskQuestion = (qa: LensQuestionItem) => {
    VoiceService.triggerHaptic('medium');
    setSelectedQaAnswer(qa);
    VoiceService.speak(qa.a);
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

      {/* Camera Live Viewfinder Window */}
      <VisionViewfinder
        currentData={currentData}
        torchActive={torchActive}
        shutterFlash={shutterFlash}
        onToggleTorch={handleToggleTorch}
        onOpenPhotoPicker={() => setIsPhotoPickerOpen(true)}
      />

      {/* MIRAS Real-time Assistant Speech & Actions */}
      <VisionAssistantCard
        currentData={currentData}
        reminderSet={reminderSet}
        onSetReminder={handleSetReminder}
        onSecondaryAction={handleSecondaryAction}
      />

      {/* Mode Selector Chips and Camera Shutter Bar */}
      <VisionControlsBar
        activeMode={activeMode}
        onModeSwitch={handleModeSwitch}
        onOpenPhotoPicker={() => setIsPhotoPickerOpen(true)}
        onSnap={handleSnap}
        onOpenLensQa={() => {
          VoiceService.triggerHaptic('light');
          setIsLensQaOpen(true);
          VoiceService.speak('Lens Q&A open. Select any question or ask about this item.');
        }}
      />

      {/* Photo Picker Modal */}
      <SampleScenePickerModal
        visible={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onSelectMode={handleModeSwitch}
      />

      {/* Precautions Modal */}
      <MedicinePrecautionsModal
        visible={isSideEffectsOpen}
        onClose={() => setIsSideEffectsOpen(false)}
      />

      {/* Lens Q&A Modal */}
      <LensQaModal
        visible={isLensQaOpen}
        onClose={() => setIsLensQaOpen(false)}
        questions={LENS_QUESTIONS[activeMode]}
        selectedQaAnswer={selectedQaAnswer}
        onAskQuestion={handleAskQuestion}
      />

      {/* Snap Scan Result Modal */}
      <SnapResultModal
        visible={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        currentData={currentData}
        onSetReminder={handleSetReminder}
      />

      {/* Profile Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
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
    color: COLORS.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
});
