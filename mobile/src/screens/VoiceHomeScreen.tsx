import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  X,
  Keyboard,
  Send,
  Volume2,
  User,
  ChevronDown,
} from 'lucide-react-native';
import { COLORS, ThemeColors, useTheme } from '../theme/colors';
import { VoiceOrb } from '../components/VoiceOrb';
import { ProfileModal } from '../components/ProfileModal';
import { AuthorizationModal } from '../components/AuthorizationModal';
import { VoiceService } from '../services/voiceService';
import { VoiceState, AutonomousTask } from '../types';

interface VoiceHomeScreenProps {
  voiceState: VoiceState;
  transcript: string;
  responsePreview: string;
  activeTask?: AutonomousTask | null;
  onOrbPress: () => void;
  onStopSpeech: () => void;
  onSubmitQuery: (query: string) => void;
  selectedModelName?: string;
  onDismissTask?: () => void;
}

const AI_SUGGESTIONS = [
  'I can help you manage your tasks',
  'I can triage your unread emails',
  'I can organize your schedule',
  'I can answer your questions',
];

// Dedicated Typewriter Component with blinking cursor & character-by-character animation
const TypewriterTagline: React.FC = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor toggle every 500ms
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Character-by-character typewriter loop
  useEffect(() => {
    const currentSentence = AI_SUGGESTIONS[index];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (text.length < currentSentence.length) {
        // Typing: 75ms per character (within 60-100ms range)
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length + 1));
        }, 75);
      } else {
        // Completed text pause: 1800ms (within 1.5-2s range)
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        // Smoothly erase text: 40ms per character (within 30-60ms range)
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length - 1));
        }, 40);
      } else {
        // Short pause before starting next suggestion
        timer = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % AI_SUGGESTIONS.length);
        }, 320);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <View style={styles.typewriterContainer}>
      <Text style={[styles.taglineText, { color: colors.primary }]}>
        {text}
        <Text style={[styles.blinkingCursor, { color: colors.primary, opacity: cursorVisible ? 1 : 0 }]}>|</Text>
      </Text>
    </View>
  );
};

export const VoiceHomeScreen: React.FC<VoiceHomeScreenProps> = ({
  voiceState,
  transcript,
  responsePreview,
  activeTask,
  onOrbPress,
  onStopSpeech,
  onSubmitQuery,
  onDismissTask,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleSendText = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (query.trim()) {
      onSubmitQuery(query.trim());
      setInputText('');
      setIsKeyboardOpen(false);
    }
  };

  const handleStatusClick = () => {
    VoiceService.triggerHaptic('light');
    VoiceService.speak('MIRAS is online and actively listening for commands.');
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Container so components NEVER overlap, even with long responses */}
      <ScrollView
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header with Dynamic Island & Profile Icon */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft} />

          {/* Dynamic Island Status Pill */}
          <TouchableOpacity
            style={styles.dynamicIslandPill}
            onPress={handleStatusClick}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.statusDot,
                voiceState === 'LISTENING' && styles.statusDotListening,
                voiceState === 'SPEAKING' && styles.statusDotSpeaking,
              ]}
            />
            <Text style={styles.dynamicIslandText}>
              {voiceState === 'LISTENING' ? '• REC' : '• MIRAS'}
            </Text>
            <View style={styles.batteryPip} />
          </TouchableOpacity>

          {/* Upper Profile Icon */}
          <TouchableOpacity
            style={styles.userAvatar}
            onPress={() => setIsProfileOpen(true)}
            activeOpacity={0.8}
          >
            <User size={16} color={colors.buttonTextDark} />
          </TouchableOpacity>
        </View>

        {/* 3. Animated Typing Text at the Top + Static Main Title */}
        <View style={styles.greetingHeader}>
          <TypewriterTagline />
          <Text style={styles.mainTitleText}>What Can I Do for You Today?</Text>
        </View>

        {/* 1, 2, 4. Center AI Orb, Audio Waveform & Diffused Glow Stage */}
        <View style={styles.beaconStage}>
          <VoiceOrb
            state={voiceState}
            onPress={onOrbPress}
            onStopSpeech={onStopSpeech}
          />
        </View>

        {/* Live Spoken Transcription Box (Shown when active) */}
        {transcript ? (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptLabel}>YOU</Text>
            <Text style={styles.transcriptText}>"{transcript}"</Text>
          </View>
        ) : null}

        {/* Assistant Response Box (Shown when active, beautifully flowing without overlap) */}
        {responsePreview ? (
          <View style={styles.responseBox}>
            <View style={styles.responseHeaderRow}>
              <Volume2 size={13} color={colors.primary} />
              <Text style={styles.responseLabel}>MIRAS</Text>
            </View>
            <Text style={styles.responseText}>{responsePreview}</Text>
          </View>
        ) : null}


      </ScrollView>

      {/* Modal for typing message */}
      <Modal
        visible={isKeyboardOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsKeyboardOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Type a message to MIRAS</Text>
              <TouchableOpacity onPress={() => setIsKeyboardOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Check important emails, status of flight..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              autoFocus
              onSubmitEditing={() => handleSendText()}
            />

            <TouchableOpacity
              style={[styles.modalSendBtn, !inputText.trim() && styles.modalSendBtnDisabled]}
              onPress={() => handleSendText()}
              disabled={!inputText.trim()}
            >
              <Send size={16} color={inputText.trim() ? colors.buttonTextDark : colors.textMuted} />
              <Text style={[styles.modalSendBtnText, !inputText.trim() && styles.modalSendBtnTextDisabled]}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Profile & Settings Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Authorization Modal for pending tasks */}
      <AuthorizationModal
        visible={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
        onApprove={() => {
          setIsAuthModalVisible(false);
          if (onDismissTask) onDismissTask();
        }}
      />
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
  },
  topBarLeft: {
    width: 34,
  },
  dynamicIslandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
  },
  statusDotListening: {
    backgroundColor: '#EF4444',
  },
  statusDotSpeaking: {
    backgroundColor: colors.primaryLight,
  },
  dynamicIslandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E5E7EB',
    letterSpacing: 0.5,
  },
  batteryPip: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6B7280',
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  greetingHeader: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  typewriterContainer: {
    minHeight: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  taglineText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  blinkingCursor: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  mainTitleText: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  beaconStage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
    marginVertical: 14,
  },
  transcriptBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  transcriptLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  transcriptText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  responseBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.badgeBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  responseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  responseLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  responseText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  actionButtonsArea: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginTop: 18,
    gap: 12,
  },
  useKeyboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.badgeBg,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  useKeyboardBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  pendingHelpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  pendingHelpText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F59E0B',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalInput: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    marginBottom: 16,
  },
  modalSendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
  },
  modalSendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalSendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.buttonTextDark,
  },
  modalSendBtnTextDisabled: {
    color: colors.textMuted,
  },
});
