import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Moon, Sun, Check } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { AIModelConfig } from '../types';
import { VoiceService } from '../services/voiceService';
import { AI_MODELS } from '../data/settingsData';
import { ActiveModelCard } from '../components/settings/ActiveModelCard';
import { ModelPickerModal } from '../components/settings/ModelPickerModal';
import { VoiceAudioSettings } from '../components/settings/VoiceAudioSettings';
import { AutonomousExecutionSettings } from '../components/settings/AutonomousExecutionSettings';
import { SystemMcpHealth } from '../components/settings/SystemMcpHealth';

// Re-export for backward compatibility
export { AI_MODELS };

interface SettingsScreenProps {
  selectedModel?: AIModelConfig;
  onSelectModel?: (model: AIModelConfig) => void;
  onOpenProfile?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  selectedModel = AI_MODELS[0],
  onSelectModel,
  onOpenProfile,
}) => {
  const { colors, themeName, setTheme } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [currentModel, setCurrentModel] = useState<AIModelConfig>(selectedModel);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const isDark = themeName === 'midnight';

  const [transitMode, setTransitMode] = useState(VoiceService.isMutedMode());
  const [autoSpeech, setAutoSpeech] = useState(!VoiceService.isMutedMode());
  const [speechRate, setSpeechRate] = useState(1.0);
  const [haptics, setHaptics] = useState(true);
  const [backgroundTasks, setBackgroundTasks] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Animated values for theme toggle icon
  const rotateAnim = useRef(new Animated.Value(isDark ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: themeName === 'midnight' ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [themeName, rotateAnim]);

  const handleToggleTheme = () => {
    VoiceService.triggerHaptic('medium');
    const nextTheme = themeName === 'midnight' ? 'midnight-day' : 'midnight';

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.75,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: nextTheme === 'midnight' ? 0 : 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setTheme(nextTheme);
    const label = nextTheme === 'midnight' ? 'Dark Mode' : 'Day Mode';
    setStatusMessage(`Theme switched to ${label}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const themeIconRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleToggleTransitMode = (val: boolean) => {
    setTransitMode(val);
    VoiceService.setMuted(val);
    setAutoSpeech(!val);
    VoiceService.triggerHaptic('medium');
    setStatusMessage(
      val
        ? 'Transit Mode Enabled: Audio speech silenced for public commute'
        : 'Transit Mode Disabled: Voice audio enabled'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTestVoice = () => {
    VoiceService.triggerHaptic('medium');
    if (transitMode) {
      setStatusMessage('Transit Mode is active (Voice muted). Disable Transit Mode to test speaker.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    VoiceService.speak(
      `Hello! I am MIRAS, your autonomous personal voice assistant. Speech synthesis is functioning at one hundred percent efficiency.`,
      { rate: speechRate }
    );
    setStatusMessage('Playing audio test voice sample...');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleClearCache = () => {
    VoiceService.triggerHaptic('medium');
    setCacheCleared(true);
    setStatusMessage('24.8 MB audio & memory cache cleared');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleModelSelect = (model: AIModelConfig) => {
    setCurrentModel(model);
    if (onSelectModel) onSelectModel(model);
    setStatusMessage(`Switched to ${model.name}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleek Top Header with Animated Theme Toggle and Profile Avatar Button */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextGroup}>
            <Text style={styles.title}>System Settings</Text>
            <Text style={styles.subtitle}>Appearance, AI Models & System Audio</Text>
          </View>

          <View style={styles.headerActionsGroup}>
            {/* Animated Sun / Moon Theme Toggle */}
            <TouchableOpacity
              style={styles.themeToggleBtn}
              onPress={handleToggleTheme}
              activeOpacity={0.7}
              accessibilityLabel="Toggle Theme Mode"
            >
              <Animated.View
                style={{
                  transform: [{ rotate: themeIconRotate }, { scale: scaleAnim }],
                }}
              >
                {isDark ? <Moon size={18} color="#0CB981" /> : <Sun size={18} color="#D97706" />}
              </Animated.View>
            </TouchableOpacity>

            {/* Profile Avatar Icon beside Page Title */}
            {onOpenProfile && (
              <TouchableOpacity
                style={styles.profileHeaderBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('medium');
                  onOpenProfile();
                }}
                activeOpacity={0.7}
                accessibilityLabel="Navigate to Profile"
              >
                <Text style={styles.profileHeaderAvatarText}>A</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {statusMessage && (
          <View style={styles.toast}>
            <Check size={14} color={colors.buttonTextDark} />
            <Text style={styles.toastText}>{statusMessage}</Text>
          </View>
        )}
      </View>

      {/* 1. ACTIVE AI FOUNDATION MODEL */}
      <ActiveModelCard
        currentModel={currentModel}
        onOpenPicker={() => setIsModelPickerOpen(true)}
      />

      {/* 2. VOICE, AUDIO & COMMUTE / TRANSIT MODE */}
      <VoiceAudioSettings
        transitMode={transitMode}
        onToggleTransitMode={handleToggleTransitMode}
        autoSpeech={autoSpeech}
        onToggleAutoSpeech={val => {
          setAutoSpeech(val);
          VoiceService.setMuted(!val);
        }}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
        onTestVoice={handleTestVoice}
      />

      {/* 3. AUTONOMOUS CHORES & BACKGROUND EXECUTION */}
      <AutonomousExecutionSettings
        backgroundTasks={backgroundTasks}
        onToggleBackgroundTasks={setBackgroundTasks}
        quietHours={quietHours}
        onToggleQuietHours={setQuietHours}
        haptics={haptics}
        onToggleHaptics={setHaptics}
      />

      {/* 4. STORAGE & 5. MCP TOOL SERVERS HEALTH */}
      <SystemMcpHealth cacheCleared={cacheCleared} onClearCache={handleClearCache} />

      {/* AI Foundation Model Picker Modal */}
      <ModelPickerModal
        visible={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        models={AI_MODELS}
        currentModel={currentModel}
        onSelectModel={handleModelSelect}
      />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 14,
      paddingBottom: 40,
    },
    header: {
      marginBottom: 20,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTextGroup: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 3,
      lineHeight: 16,
    },
    headerActionsGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    themeToggleBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    profileHeaderBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    profileHeaderAvatarText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      marginTop: 12,
    },
    toastText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
  });
