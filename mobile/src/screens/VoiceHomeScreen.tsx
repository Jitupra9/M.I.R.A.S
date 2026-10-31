import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { ProfileModal } from '../components/ProfileModal';
import { AuthorizationModal } from '../components/AuthorizationModal';
import { VoiceService } from '../services/voiceService';

import { VoiceHomeScreenProps, SessionMessage } from '../types/voiceHome';
import { INITIAL_SESSION_MESSAGES } from '../data/voiceHomeData';
import { VoiceAssistantPage } from '../components/voiceHome/VoiceAssistantPage';
import { SessionConversationPage } from '../components/voiceHome/SessionConversationPage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type { VoiceHomeScreenProps, SessionMessage };

export const VoiceHomeScreen: React.FC<VoiceHomeScreenProps> = ({
  voiceState,
  transcript,
  responsePreview,
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
  const [sessionMessages, setSessionMessages] = useState<SessionMessage[]>(INITIAL_SESSION_MESSAGES);

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

  const handleSpeakMessage = (text: string) => {
    VoiceService.speak(text);
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
        {/* PAGE 0: ASSISTANT VOICE ORB HOME */}
        <VoiceAssistantPage
          screenWidth={SCREEN_WIDTH}
          voiceState={voiceState}
          onOrbPress={onOrbPress}
          onStopSpeech={onStopSpeech}
          onOpenProfile={onOpenProfile || (() => setIsProfileOpen(true))}
          onSlideToConversation={handleSlideToConversation}
          messageCount={sessionMessages.length}
        />

        {/* PAGE 1: CURRENT CONVERSATION MESSAGES */}
        <SessionConversationPage
          screenWidth={SCREEN_WIDTH}
          sessionMessages={sessionMessages}
          inputText={inputText}
          onChangeInputText={setInputText}
          onSendText={handleSendText}
          onSlideToHome={handleSlideToHome}
          onSpeakMessage={handleSpeakMessage}
        />
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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    horizontalScroll: {
      flex: 1,
    },
  });
