import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Dimensions,
} from 'react-native';
import {
  X,
  Send,
  Volume2,
  User,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react-native';
import { COLORS, ThemeColors, useTheme } from '../theme/colors';
import { VoiceOrb } from '../components/VoiceOrb';
import { ProfileModal } from '../components/ProfileModal';
import { AuthorizationModal } from '../components/AuthorizationModal';
import { MirasLogo } from '../components/MirasLogo';
import { VoiceService } from '../services/voiceService';
import { VoiceState, AutonomousTask } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  onOpenProfile?: () => void;
}

interface SessionMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
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
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length + 1));
        }, 75);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentSentence.slice(0, text.length - 1));
        }, 40);
      } else {
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
  onOpenProfile,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const horizontalScrollRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState<0 | 1>(0);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  // Keep a running session conversation history
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>([
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Hello Alex, I'm MIRAS. Ready to assist you with your schedule, emails, and daily tasks.",
      timestamp: 'Just now',
    },
  ]);

  // Sync spoken user query into conversation list
  useEffect(() => {
    if (transcript && transcript !== 'Listening softly...' && transcript.trim()) {
      setSessionMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'user' && last.text === transcript.trim()) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'usr-' + Date.now(),
            sender: 'user',
            text: transcript.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }
  }, [transcript]);

  // Sync assistant response into conversation list
  useEffect(() => {
    if (responsePreview && responsePreview.trim()) {
      setSessionMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'assistant' && last.text === responsePreview.trim()) {
          return prev;
        }
        return [
          ...prev,
          {
            id: 'asst-' + Date.now(),
            sender: 'assistant',
            text: responsePreview.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }
  }, [responsePreview]);

  const handleSlideToConversation = () => {
    VoiceService.triggerHaptic('light');
    horizontalScrollRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: true });
    setCurrentPage(1);
  };

  const handleSlideToHome = () => {
    VoiceService.triggerHaptic('light');
    horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
    setCurrentPage(0);
  };

  const handleSendText = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (query.trim()) {
      // Add immediately to session messages
      setSessionMessages((prev) => [
        ...prev,
        {
          id: 'usr-' + Date.now(),
          sender: 'user',
          text: query.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      onSubmitQuery(query.trim());
      setInputText('');
    }
  };

  const handleStatusClick = () => {
    VoiceService.triggerHaptic('light');
    VoiceService.speak('MIRAS is online and actively listening for commands.');
  };

  return (
    <View style={styles.container}>
      {/* Dual Page Horizontal Pager: Page 0 is Clean Voice Orb, Page 1 is Current Conversation */}
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(page === 1 ? 1 : 0);
        }}
        style={styles.horizontalScroll}
        contentContainerStyle={{ width: SCREEN_WIDTH * 2 }}
      >
        {/* ================= PAGE 0: ASSISTANT VOICE ORB HOME ================= */}
        <View style={[styles.pageWrapper, { width: SCREEN_WIDTH }]}>
            {/* Top Bar: Profile icon only in the top-right corner in the exact same position */}
            <View style={styles.topRightProfileContainer}>
              <TouchableOpacity
                style={[styles.userAvatar, { backgroundColor: colors.primary }]}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  if (onOpenProfile) {
                    onOpenProfile();
                  } else {
                    setIsProfileOpen(true);
                  }
                }}
                activeOpacity={0.8}
                accessibilityLabel="Open Profile"
              >
                <Text style={[styles.avatarText, { color: colors.buttonTextDark }]}>A</Text>
              </TouchableOpacity>
            </View>

          <ScrollView
            style={styles.scrollWrapper}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >

            {/* 3. Animated Typing Text at the Top + Static Main Title */}
            <View style={styles.greetingHeader}>
              <TypewriterTagline />
              <Text style={styles.mainTitleText}>What Can I Do for You Today?</Text>
            </View>

            {/* AI Orb, Audio Waveform & Diffused Glow Stage (Clean, zero talking messages here) */}
            <View style={styles.beaconStage}>
              <VoiceOrb
                state={voiceState}
                onPress={onOrbPress}
                onStopSpeech={onStopSpeech}
              />
            </View>

            {/* Bottom Actions: Slide Right to Current Conversation */}
            <View style={styles.bottomCueContainer}>
              <TouchableOpacity
                style={styles.slideCueBtn}
                onPress={handleSlideToConversation}
                activeOpacity={0.8}
              >
                <View style={styles.slideCueLeft}>
                  <View style={styles.slideCueIconCircle}>
                    <MessageSquare size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.slideCueTitle}>Current Conversation</Text>
                    <Text style={styles.slideCueSub}>Slide right to view messages</Text>
                  </View>
                </View>

                <View style={styles.slideCueRight}>
                  {sessionMessages.length > 0 && (
                    <View style={styles.msgCountPill}>
                      <Text style={styles.msgCountText}>{sessionMessages.length}</Text>
                    </View>
                  )}
                  <ArrowRight size={17} color={colors.primary} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* ================= PAGE 1: CURRENT CONVERSATION MESSAGES ================= */}
        <View style={[styles.pageWrapper, { width: SCREEN_WIDTH }]}>
          {/* Top Header with Return Arrow Button (<) */}
          <View style={styles.conversationHeader}>
            <TouchableOpacity
              style={styles.backArrowBtn}
              onPress={handleSlideToHome}
              activeOpacity={0.7}
              accessibilityLabel="Back to Voice Assistant"
            >
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.convHeaderCenter}>
              <Text style={styles.convHeaderTitle}>Current Conversation</Text>
              <Text style={styles.convHeaderSub}>Slide left or tap arrow to return</Text>
            </View>

            {/* Spacer to keep title centered */}
            <View style={styles.convHeaderRightSpacer} />
          </View>

          {/* Conversation Feed */}
          <ScrollView
            style={styles.conversationFeed}
            contentContainerStyle={styles.conversationContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {sessionMessages.map((item) => {
              const isUser = item.sender === 'user';
              return (
                <View
                  key={item.id}
                  style={[
                    styles.convMessageRow,
                    isUser ? styles.convMessageRowUser : styles.convMessageRowAssistant,
                  ]}
                >
                  <View
                    style={[
                      styles.convMessageBubble,
                      isUser ? styles.convBubbleUser : styles.convBubbleAssistant,
                    ]}
                  >
                    <View style={styles.convBubbleHeader}>
                      <View style={styles.convSenderInfo}>
                        {!isUser && (
                          <MirasLogo size={14} glow glowColor={colors.primary} />
                        )}
                        <Text
                          style={[
                            styles.convSenderLabel,
                            { color: isUser ? colors.primaryLight : colors.primary },
                          ]}
                        >
                          {isUser ? 'YOU' : 'MIRAS'}
                        </Text>
                      </View>

                      <View style={styles.convMetaRight}>
                        {!isUser && (
                          <TouchableOpacity
                            onPress={() => VoiceService.speak(item.text)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Volume2 size={13} color={colors.primary} />
                          </TouchableOpacity>
                        )}
                        <Text style={styles.convTimestamp}>{item.timestamp}</Text>
                      </View>
                    </View>

                    <Text style={styles.convMessageText}>{item.text}</Text>
                  </View>
                </View>
              );
            })}

            {sessionMessages.length === 0 && (
              <View style={styles.convEmptyState}>
                <MessageSquare size={36} color={colors.textMuted} />
                <Text style={styles.convEmptyTitle}>No conversation messages yet</Text>
                <Text style={styles.convEmptySub}>
                  Speak to MIRAS or tap below to send a message.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Interactive TextInput Bar on Page 1 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.convBottomBar}>
              <View style={styles.convInputContainer}>
                <TextInput
                  style={styles.convTextInput}
                  placeholder="Type a message to MIRAS..."
                  placeholderTextColor={colors.textMuted}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => handleSendText()}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  style={[styles.convSendBtn, !inputText.trim() && styles.convSendBtnDisabled]}
                  onPress={() => handleSendText()}
                  disabled={!inputText.trim()}
                  activeOpacity={0.8}
                  accessibilityLabel="Send message"
                >
                  <Send
                    size={16}
                    color={inputText.trim() ? colors.buttonTextDark : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>

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
  horizontalScroll: {
    flex: 1,
  },
  pageWrapper: {
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
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topRightProfileContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
    width: '100%',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
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
    minHeight: 300,
    marginVertical: 10,
  },
  bottomCueContainer: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  slideCueBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  slideCueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slideCueIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.badgeBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  slideCueTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  slideCueSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  slideCueRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  msgCountPill: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  msgCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },

  // Current Conversation Page Styles
  conversationHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorderSubtle,
  },
  backArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  convHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  convHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  convHeaderSub: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  convHeaderRightSpacer: {
    width: 38,
    height: 38,
  },
  conversationFeed: {
    flex: 1,
  },
  conversationContent: {
    padding: 16,
    paddingBottom: 24,
  },
  convMessageRow: {
    marginBottom: 14,
    width: '100%',
  },
  convMessageRowUser: {
    alignItems: 'flex-end',
  },
  convMessageRowAssistant: {
    alignItems: 'flex-start',
  },
  convMessageBubble: {
    maxWidth: '88%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  convBubbleUser: {
    backgroundColor: colors.cardBg,
    borderColor: colors.surfaceBorderSubtle,
    borderBottomRightRadius: 4,
  },
  convBubbleAssistant: {
    backgroundColor: colors.badgeBg,
    borderColor: colors.surfaceBorder,
    borderBottomLeftRadius: 4,
  },
  convBubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  convSenderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  convSenderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  convMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  convTimestamp: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  convMessageText: {
    fontSize: 13.5,
    color: colors.textPrimary,
    lineHeight: 19.5,
  },
  convEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  convEmptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  convEmptySub: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  convBottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorderSubtle,
    backgroundColor: colors.background,
  },
  convInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    minHeight: 46,
  },
  convTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingRight: 10,
  },
  convSendBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  convSendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});
