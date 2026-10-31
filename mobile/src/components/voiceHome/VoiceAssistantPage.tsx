import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MessageSquare, ArrowRight } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceState } from '../../types';
import { VoiceOrb } from '../VoiceOrb';
import { TypewriterTagline } from './TypewriterTagline';

interface VoiceAssistantPageProps {
  screenWidth: number;
  voiceState: VoiceState;
  onOrbPress: () => void;
  onStopSpeech: () => void;
  onOpenProfile: () => void;
  onSlideToConversation: () => void;
  messageCount: number;
}

export const VoiceAssistantPage: React.FC<VoiceAssistantPageProps> = ({
  screenWidth,
  voiceState,
  onOrbPress,
  onStopSpeech,
  onOpenProfile,
  onSlideToConversation,
  messageCount,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.pageWrapper, { width: screenWidth }]}>
      {/* Top Bar: Profile icon only in the top-right corner */}
      <View style={styles.topRightProfileContainer}>
        <TouchableOpacity
          style={[styles.userAvatar, { backgroundColor: colors.primary }]}
          onPress={onOpenProfile}
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
        {/* Animated Typing Text at the Top + Static Main Title */}
        <View style={styles.greetingHeader}>
          <TypewriterTagline />
          <Text style={styles.mainTitleText}>What Can I Do for You Today?</Text>
        </View>

        {/* AI Orb, Audio Waveform & Diffused Glow Stage */}
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
            onPress={onSlideToConversation}
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
              {messageCount > 0 && (
                <View style={styles.msgCountPill}>
                  <Text style={styles.msgCountText}>{messageCount}</Text>
                </View>
              )}
              <ArrowRight size={17} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
  });
