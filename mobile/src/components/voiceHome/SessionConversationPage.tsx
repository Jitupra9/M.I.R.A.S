import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Volume2, MessageSquare, Send } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { MirasLogo } from '../MirasLogo';
import { SessionMessage } from '../../types/voiceHome';

interface SessionConversationPageProps {
  screenWidth: number;
  sessionMessages: SessionMessage[];
  inputText: string;
  onChangeInputText: (text: string) => void;
  onSendText: (text?: string) => void;
  onSlideToHome: () => void;
  onSpeakMessage: (text: string) => void;
}

export const SessionConversationPage: React.FC<SessionConversationPageProps> = ({
  screenWidth,
  sessionMessages,
  inputText,
  onChangeInputText,
  onSendText,
  onSlideToHome,
  onSpeakMessage,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.pageWrapper, { width: screenWidth }]}>
      {/* Top Header with Return Arrow Button (<) */}
      <View style={styles.conversationHeader}>
        <TouchableOpacity
          style={styles.backArrowBtn}
          onPress={onSlideToHome}
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
                    {!isUser && <MirasLogo size={14} glow glowColor={colors.primary} />}
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
                        onPress={() => onSpeakMessage(item.text)}
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
              onChangeText={onChangeInputText}
              onSubmitEditing={() => onSendText()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.convSendBtn, !inputText.trim() && styles.convSendBtnDisabled]}
              onPress={() => onSendText()}
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
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pageWrapper: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
