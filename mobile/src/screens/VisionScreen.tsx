import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Camera, Eye, FileText, Globe, Image as ImageIcon, Mic, Volume2, Bell, Shield, Sparkles, Check, Zap, X, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

type VisionMode = 'identify' | 'document' | 'translate';

interface VisionItemData {
  title: string;
  pillTag: string;
  cardTitle: string;
  details: string[];
  speechAnalysis: string;
  reminderLabel: string;
  secondaryLabel: string;
}

const VISION_PRESETS: Record<VisionMode, VisionItemData> = {
  identify: {
    title: '💊 Amoxicillin 500mg',
    pillTag: 'Take 1 capsule twice daily with meal',
    cardTitle: 'Amoxicillin 500mg Antibiotic',
    details: [
      'Rx: 1234567-A • Patient: Alex M.',
      'Dosage: Take 1 capsule twice daily',
      'Prescriber: Dr. E. Hartman',
      'Pharmacy: CVS Pharmacy #4829',
    ],
    speechAnalysis: 'I can see the bottle clearly! The instructions indicate taking one capsule with breakfast and one with dinner. Would you like me to set daily reminders for this?',
    reminderLabel: 'Yes, set reminder (8 AM & 7 PM)',
    secondaryLabel: 'Explain precautions & side effects',
  },
  document: {
    title: '📄 Residential Lease Agreement',
    pillTag: 'Rent Due: 1st of every month • $2,450',
    cardTitle: 'Apartment Lease Terms',
    details: [
      'Term: 12 Months (Nov 1 – Oct 31)',
      'Monthly Rent: $2,450 (Due on 1st)',
      'Grace Period: Until 5th (5% late fee after)',
      'Utilities: Water included, Gas/Electric tenant',
    ],
    speechAnalysis: 'I scanned the lease agreement. The key point is your monthly rent of $2,450 is due on the 1st of every month with a grace period until the 5th.',
    reminderLabel: 'Set calendar reminder for rent (1st of month)',
    secondaryLabel: 'Summarize all tenant obligations',
  },
  translate: {
    title: '🌐 Spanish Food Label Translation',
    pillTag: 'Translated: Gluten Free • Keep Refrigerated',
    cardTitle: 'Artisan Gourmet Salsa Fresca',
    details: [
      'Original: "Sin gluten y sin conservantes"',
      'English: "Gluten-free and preservative-free"',
      'Original: "Mantener refrigerado tras abrir"',
      'English: "Keep refrigerated after opening"',
    ],
    speechAnalysis: 'The Spanish food packaging says Gluten-Free and No Preservatives. It also advises keeping it refrigerated once opened.',
    reminderLabel: 'Save recipe & allergy notes to memory',
    secondaryLabel: 'Check for potential allergen ingredients',
  },
};

import { ProfileModal } from '../components/ProfileModal';

const LENS_QUESTIONS: Record<VisionMode, Array<{ q: string; a: string }>> = {
  identify: [
    {
      q: 'Can I take this on an empty stomach?',
      a: 'Amoxicillin is best taken with a meal or snack to minimize stomach upset and nausea.',
    },
    {
      q: 'What should I do if I miss a scheduled dose?',
      a: 'Take the missed capsule as soon as you remember. If it is almost time for your next dose, skip the missed one. Do not double up.',
    },
    {
      q: 'Does this interact with dairy or milk?',
      a: 'No, unlike tetracycline antibiotics, Amoxicillin does not interact with calcium or dairy products.',
    },
  ],
  document: [
    {
      q: 'What is the late fee policy?',
      a: 'Rent is due on the 1st of each month. A grace period is provided until the 5th, after which a 5% late fee ($122.50) is assessed.',
    },
    {
      q: 'Which utilities are included in the lease?',
      a: 'Water and trash services are covered by the property owner. Gas and electric services are billed directly to the tenant.',
    },
  ],
  translate: [
    {
      q: 'Does this contain gluten or preservatives?',
      a: 'The label states: "Sin gluten y sin conservantes", meaning it is 100% gluten-free and free of chemical preservatives.',
    },
    {
      q: 'How should this be stored after opening?',
      a: 'The packaging states "Mantener refrigerado tras abrir", which means keep refrigerated after opening and consume within 7 days.',
    },
  ],
};

export const VisionScreen: React.FC = () => {
  const [activeMode, setActiveMode] = useState<VisionMode>('identify');
  const [reminderSet, setReminderSet] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isSideEffectsOpen, setIsSideEffectsOpen] = useState(false);
  const [isLensQaOpen, setIsLensQaOpen] = useState(false);
  const [selectedQaAnswer, setSelectedQaAnswer] = useState<{ q: string; a: string } | null>(null);
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
    VoiceService.speak(torchActive ? "Camera light turned off." : "Camera illumination flashlight enabled.");
  };

  const handleSnap = () => {
    VoiceService.triggerHaptic('heavy');
    setShutterFlash(true);
    setTimeout(() => {
      setShutterFlash(false);
      setIsSnapModalOpen(true);
    }, 220);

    VoiceService.speak(`View captured. ${currentData.title} analyzed with 99 percent confidence.`);
  };

  const handleSetReminder = () => {
    VoiceService.triggerHaptic('success');
    setReminderSet(true);
    if (activeMode === 'identify') {
      VoiceService.speak("Prescription reminders scheduled for 8:00 AM and 7:00 PM daily.");
    } else if (activeMode === 'document') {
      VoiceService.speak("Calendar reminder scheduled for rent on the 1st of each month.");
    } else {
      VoiceService.speak("Dietary notes and allergy information saved to MIRAS Memory.");
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

  const handleAskQuestion = (qa: { q: string; a: string }) => {
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
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => setIsProfileOpen(true)}
        >
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Live Viewfinder Window */}
      <View style={[styles.viewfinderContainer, shutterFlash && styles.viewfinderFlash]}>
        {/* Top Overlay Badge & Controls */}
        <View style={styles.viewfinderTopRow}>
          <View style={styles.liveVisionBadge}>
            <View style={styles.redDot} />
            <Text style={styles.liveVisionText}>Live Vision • MIRAS Active</Text>
          </View>

          <View style={styles.viewfinderActions}>
            <TouchableOpacity
              style={[styles.iconCircleBtn, torchActive && styles.iconCircleBtnActive]}
              onPress={handleToggleTorch}
            >
              <Zap size={14} color={torchActive ? COLORS.buttonTextDark : COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconCircleBtn}
              onPress={() => setIsPhotoPickerOpen(true)}
            >
              <ImageIcon size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Identified Item Header Pill */}
        <View style={styles.identifiedPill}>
          <Text style={styles.identifiedPillText}>{currentData.title}</Text>
        </View>

        {/* Camera Target Frame with 4 Corners & Laser Scan Line */}
        <View style={styles.targetFrame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          <View style={styles.scanLaserLine} />

          {/* Item Content Preview */}
          <View style={styles.bottleLabelCard}>
            <Text style={styles.medName}>{currentData.cardTitle}</Text>
            {currentData.details.map((line, idx) => (
              <Text key={idx} style={styles.detailLineText}>• {line}</Text>
            ))}
          </View>
        </View>

        {/* Floating Dosage Recognition Chip */}
        <View style={styles.dosageChip}>
          <Text style={styles.dosageChipText}>{currentData.pillTag}</Text>
        </View>

        {/* Bottom Focus Indicator */}
        <View style={styles.focusIndicatorRow}>
          <View style={styles.focusDot} />
          <Text style={styles.focusText}>Auto-focus locked • High confidence</Text>
        </View>
      </View>

      {/* MIRAS Real-time Assistant Speech & Actions */}
      <View style={styles.assistantCard}>
        <View style={styles.assistantHeaderRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.mText}>M</Text>
          </View>
          <View style={styles.assistantTitleCol}>
            <View style={styles.assistantNameRow}>
              <Text style={styles.assistantName}>MIRAS</Text>
              <View style={styles.speakingTag}>
                <Text style={styles.speakingTagText}>Speaking</Text>
              </View>
            </View>
            <Text style={styles.assistantSubtext}>Real-Time Vision Intelligence</Text>
          </View>

          <View style={styles.equalizer}>
            <View style={[styles.eqBar, { height: 16 }]} />
            <View style={[styles.eqBar, { height: 24 }]} />
            <View style={[styles.eqBar, { height: 12 }]} />
          </View>
        </View>

        <Text style={styles.speechQuote}>"{currentData.speechAnalysis}"</Text>

        {/* Action Button 1: Primary Action */}
        <TouchableOpacity
          style={[styles.primaryActionBtn, reminderSet && styles.primaryActionBtnDone]}
          onPress={handleSetReminder}
        >
          {reminderSet ? <Check size={16} color={COLORS.buttonTextDark} /> : <Bell size={16} color={COLORS.buttonTextDark} />}
          <Text style={styles.primaryActionBtnText}>
            {reminderSet ? 'Action Completed ✓' : currentData.reminderLabel}
          </Text>
        </TouchableOpacity>

        {/* Action Button 2: Secondary Action */}
        <TouchableOpacity style={styles.secondaryActionBtn} onPress={handleSecondaryAction}>
          <Shield size={15} color={COLORS.primary} />
          <Text style={styles.secondaryActionBtnText}>{currentData.secondaryLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Selector Chips */}
      <View style={styles.modeChipsRow}>
        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'identify' && styles.modeChipActive]}
          onPress={() => handleModeSwitch('identify')}
        >
          <Eye size={13} color={activeMode === 'identify' ? COLORS.buttonTextDark : COLORS.textSecondary} />
          <Text style={[styles.modeChipText, activeMode === 'identify' && styles.modeChipTextActive]}>
            Identify Item
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'document' && styles.modeChipActive]}
          onPress={() => handleModeSwitch('document')}
        >
          <FileText size={13} color={activeMode === 'document' ? COLORS.buttonTextDark : COLORS.textSecondary} />
          <Text style={[styles.modeChipText, activeMode === 'document' && styles.modeChipTextActive]}>
            Read document
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'translate' && styles.modeChipActive]}
          onPress={() => handleModeSwitch('translate')}
        >
          <Globe size={13} color={activeMode === 'translate' ? COLORS.buttonTextDark : COLORS.textSecondary} />
          <Text style={[styles.modeChipText, activeMode === 'translate' && styles.modeChipTextActive]}>
            Translate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Capture Shutter Bar */}
      <View style={styles.cameraControlsBar}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setIsPhotoPickerOpen(true)}
        >
          <ImageIcon size={20} color={COLORS.primary} />
          <Text style={styles.controlBtnText}>Sample Photos</Text>
        </TouchableOpacity>

        {/* Big Mint Shutter Button */}
        <TouchableOpacity style={styles.shutterButton} onPress={handleSnap}>
          <View style={styles.shutterInnerRing}>
            <Camera size={26} color={COLORS.buttonTextDark} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            setIsLensQaOpen(true);
            VoiceService.speak("Lens Q&A open. Select any question or ask about this item.");
          }}
        >
          <Mic size={20} color={COLORS.primary} />
          <Text style={styles.controlBtnText}>Talk to Lens</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Picker Modal */}
      <Modal visible={isPhotoPickerOpen} transparent animationType="slide" onRequestClose={() => setIsPhotoPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Sample Camera Scene</Text>
              <TouchableOpacity onPress={() => setIsPhotoPickerOpen(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sampleItem}
              onPress={() => {
                setIsPhotoPickerOpen(false);
                handleModeSwitch('identify');
              }}
            >
              <Text style={styles.sampleEmoji}>💊</Text>
              <View style={styles.sampleTextCol}>
                <Text style={styles.sampleTitle}>Prescription Medicine Bottle</Text>
                <Text style={styles.sampleSub}>Amoxicillin 500mg • Reads dosage & sets reminders</Text>
              </View>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleItem}
              onPress={() => {
                setIsPhotoPickerOpen(false);
                handleModeSwitch('document');
              }}
            >
              <Text style={styles.sampleEmoji}>📄</Text>
              <View style={styles.sampleTextCol}>
                <Text style={styles.sampleTitle}>Residential Lease Contract</Text>
                <Text style={styles.sampleSub}>Extracts rent dates, payment terms & late fees</Text>
              </View>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleItem}
              onPress={() => {
                setIsPhotoPickerOpen(false);
                handleModeSwitch('translate');
              }}
            >
              <Text style={styles.sampleEmoji}>🌐</Text>
              <View style={styles.sampleTextCol}>
                <Text style={styles.sampleTitle}>Spanish Food & Nutrition Label</Text>
                <Text style={styles.sampleSub}>Real-time Spanish to English ingredient translation</Text>
              </View>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Precautions Modal */}
      <Modal visible={isSideEffectsOpen} transparent animationType="slide" onRequestClose={() => setIsSideEffectsOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Shield size={18} color={COLORS.primary} />
                <Text style={styles.pickerTitle}>Amoxicillin Precautions & Info</Text>
              </View>
              <TouchableOpacity onPress={() => setIsSideEffectsOpen(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoCardRow}>
              <Text style={styles.infoLabel}>🍽️ When to take:</Text>
              <Text style={styles.infoValue}>Take at the start of a meal to avoid stomach upset.</Text>
            </View>

            <View style={styles.infoCardRow}>
              <Text style={styles.infoLabel}>⏱️ Schedule:</Text>
              <Text style={styles.infoValue}>Every 12 hours (e.g. 8:00 AM breakfast and 7:00 PM dinner).</Text>
            </View>

            <View style={styles.infoCardRow}>
              <Text style={styles.infoLabel}>⚠️ Course completion:</Text>
              <Text style={styles.infoValue}>Always finish the full 10-day prescription even if feeling better.</Text>
            </View>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setIsSideEffectsOpen(false)}>
              <Text style={styles.gotItBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lens Q&A Modal */}
      <Modal visible={isLensQaOpen} transparent animationType="slide" onRequestClose={() => setIsLensQaOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={18} color={COLORS.primary} />
                <Text style={styles.pickerTitle}>Talk to Lens • Ask MIRAS</Text>
              </View>
              <TouchableOpacity onPress={() => setIsLensQaOpen(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 }}>
              Tap any common question below or speak to MIRAS:
            </Text>

            {LENS_QUESTIONS[activeMode].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sampleItem,
                  selectedQaAnswer?.q === item.q && { borderColor: COLORS.primary, backgroundColor: 'rgba(0, 229, 153, 0.08)' },
                ]}
                onPress={() => handleAskQuestion(item)}
              >
                <View style={styles.sampleTextCol}>
                  <Text style={styles.sampleTitle}>❓ {item.q}</Text>
                  {selectedQaAnswer?.q === item.q && (
                    <Text style={{ fontSize: 12, color: COLORS.primary, marginTop: 6, lineHeight: 17 }}>
                      💡 {item.a}
                    </Text>
                  )}
                </View>
                <Volume2 size={16} color={COLORS.primary} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setIsLensQaOpen(false)}>
              <Text style={styles.gotItBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Snap Scan Result Modal */}
      <Modal visible={isSnapModalOpen} transparent animationType="slide" onRequestClose={() => setIsSnapModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Check size={18} color={COLORS.primary} />
                <Text style={styles.pickerTitle}>Scan Verified (99% Accuracy)</Text>
              </View>
              <TouchableOpacity onPress={() => setIsSnapModalOpen(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.infoCardRow}>
              <Text style={styles.infoLabel}>📸 Captured Object:</Text>
              <Text style={styles.infoValue}>{currentData.title}</Text>
            </View>

            <View style={styles.infoCardRow}>
              <Text style={styles.infoLabel}>📋 Key Insight:</Text>
              <Text style={styles.infoValue}>{currentData.pillTag}</Text>
            </View>

            <TouchableOpacity
              style={styles.gotItBtn}
              onPress={() => {
                setIsSnapModalOpen(false);
                handleSetReminder();
              }}
            >
              <Text style={styles.gotItBtnText}>{currentData.reminderLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
  viewfinderContainer: {
    backgroundColor: '#0A1812',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
    padding: 14,
    minHeight: 330,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  viewfinderFlash: {
    backgroundColor: '#FFF',
  },
  viewfinderTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveVisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveVisionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewfinderActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconCircleBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.2)',
  },
  iconCircleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  identifiedPill: {
    backgroundColor: 'rgba(0, 229, 153, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginVertical: 4,
  },
  identifiedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  targetFrame: {
    width: 230,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 10,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomRightRadius: 6,
  },
  scanLaserLine: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: '#00E599',
    shadowColor: '#00E599',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  bottleLabelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 8,
    width: 190,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  medName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  detailLineText: {
    fontSize: 9.5,
    color: COLORS.textPrimary,
    lineHeight: 14,
  },
  dosageChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginVertical: 4,
  },
  dosageChipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  focusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  focusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
  focusText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  assistantCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorderSubtle,
    marginBottom: 12,
  },
  assistantHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
  assistantTitleCol: {
    flex: 1,
  },
  assistantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assistantName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  speakingTag: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  speakingTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  assistantSubtext: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
  },
  equalizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  eqBar: {
    width: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
  speechQuote: {
    fontSize: 12.5,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 12,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 22,
    marginBottom: 8,
  },
  primaryActionBtnDone: {
    backgroundColor: '#059669',
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.2)',
    paddingVertical: 10,
    borderRadius: 22,
  },
  secondaryActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modeChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorderSubtle,
  },
  modeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modeChipTextActive: {
    color: COLORS.buttonTextDark,
    fontWeight: '800',
  },
  cameraControlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlBtn: {
    alignItems: 'center',
    gap: 4,
    width: 75,
  },
  controlBtnText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 229, 153, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  shutterInnerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: '#0A1812',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  sampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorderSubtle,
  },
  sampleEmoji: {
    fontSize: 22,
  },
  sampleTextCol: {
    flex: 1,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sampleSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  infoCardRow: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  gotItBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  gotItBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.buttonTextDark,
  },
});
