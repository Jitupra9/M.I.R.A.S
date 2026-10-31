import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Modal,
} from 'react-native';
import {
  Cpu,
  Volume2,
  ShieldCheck,
  Check,
  Globe,
  HardDrive,
  Terminal,
  Bus,
  Trash2,
  Sparkles,
  Moon,
  Sun,
  ChevronDown,
  X,
  User,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { AIModelConfig } from '../types';
import { VoiceService } from '../services/voiceService';

export const AI_MODELS: AIModelConfig[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'HYBRID REASONING',
    description: 'Premier agent intelligence for multi-step LangGraph graph routing and tool use.',
    speed: '450ms',
    reasoning: '98/100',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omnimodal',
    provider: 'OpenAI',
    badge: 'MULTIMODAL AUDIO',
    description: 'High-speed audio-to-audio multimodal streaming with native nuance.',
    speed: '280ms',
    reasoning: '95/100',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    badge: 'ULTRA LOW LATENCY',
    description: 'Sub-200ms real-time conversational streaming and long context window.',
    speed: '160ms',
    reasoning: '93/100',
  },
];

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
  }, [themeName]);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
                  transform: [
                    { rotate: themeIconRotate },
                    { scale: scaleAnim },
                  ],
                }}
              >
                {isDark ? (
                  <Moon size={18} color="#0CB981" />
                ) : (
                  <Sun size={18} color="#D97706" />
                )}
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

      {/* 1. ACTIVE AI FOUNDATION MODEL: Compact Single-Row Selector (Opens Picker Modal) */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Cpu size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>ACTIVE AI FOUNDATION MODEL</Text>
        </View>

        <TouchableOpacity
          style={styles.activeModelSelectorCard}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            setIsModelPickerOpen(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.activeModelLeft}>
            <View style={styles.modelIconSquircle}>
              <Cpu size={18} color={colors.primary} />
            </View>
            <View style={styles.activeModelTextCol}>
              <View style={styles.activeModelNameRow}>
                <Text style={styles.activeModelName} numberOfLines={1}>
                  {currentModel.name}
                </Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>{currentModel.badge}</Text>
                </View>
              </View>
              <Text style={styles.activeModelSub} numberOfLines={1}>
                {currentModel.provider} • {currentModel.speed} • {currentModel.reasoning} reasoning
              </Text>
            </View>
          </View>

          <View style={styles.switchModelAction}>
            <Text style={styles.switchModelText}>Switch</Text>
            <ChevronDown size={15} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. VOICE, AUDIO & COMMUTE / TRANSIT MODE */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Volume2 size={16} color={colors.secondary} />
          <Text style={styles.sectionTitle}>VOICE, AUDIO & COMMUTE MODE</Text>
        </View>

        {/* Transit Mode Highlight Box */}
        <View style={[styles.settingItemRow, styles.transitHighlightRow]}>
          <View style={styles.settingTextCol}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Bus size={15} color={colors.primary} />
              <Text style={[styles.settingLabel, { color: colors.primary }]}>
                Transit & Public Quiet Mode
              </Text>
            </View>
            <Text style={styles.settingSubtext}>
              Silences spoken speech audio on trains, buses, and public places.
            </Text>
          </View>
          <Switch
            value={transitMode}
            onValueChange={handleToggleTransitMode}
            trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
            thumbColor={transitMode ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.settingItemRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Auto-Read Assistant Replies</Text>
            <Text style={styles.settingSubtext}>Automatically speak MIRAS responses in voice mode</Text>
          </View>
          <Switch
            value={autoSpeech}
            disabled={transitMode}
            onValueChange={val => {
              setAutoSpeech(val);
              VoiceService.setMuted(!val);
            }}
            trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
            thumbColor={autoSpeech ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.rateSelectorRow}>
          <Text style={styles.settingLabel}>Speech Rate:</Text>
          <View style={styles.rateButtons}>
            {[0.85, 1.0, 1.15].map(rate => (
              <TouchableOpacity
                key={rate}
                style={[styles.rateBtn, speechRate === rate && styles.rateBtnActive]}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  setSpeechRate(rate);
                }}
              >
                <Text style={[styles.rateBtnText, speechRate === rate && styles.rateBtnTextActive]}>
                  {rate}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.testVoiceBtn} onPress={handleTestVoice}>
          <Volume2 size={15} color={colors.primary} />
          <Text style={styles.testVoiceBtnText}>Test Voice Speaker Output</Text>
        </TouchableOpacity>
      </View>

      {/* 3. AUTONOMOUS CHORES & BACKGROUND EXECUTION */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Sparkles size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>AUTONOMOUS CHORES & NOTIFICATIONS</Text>
        </View>

        <View style={styles.settingItemRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Background Chore Execution</Text>
            <Text style={styles.settingSubtext}>Allow MIRAS to monitor flights & triage email in background</Text>
          </View>
          <Switch
            value={backgroundTasks}
            onValueChange={setBackgroundTasks}
            trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
            thumbColor={backgroundTasks ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.settingItemRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Quiet Hours (10 PM - 7 AM)</Text>
            <Text style={styles.settingSubtext}>Silence all voice announcements and audio alerts</Text>
          </View>
          <Switch
            value={quietHours}
            onValueChange={setQuietHours}
            trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
            thumbColor={quietHours ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.settingItemRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Text style={styles.settingSubtext}>Tactile vibrations on task confirmation</Text>
          </View>
          <Switch
            value={haptics}
            onValueChange={setHaptics}
            trackColor={{ false: colors.cardBgElevated, true: colors.primaryDeep }}
            thumbColor={haptics ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* 4. STORAGE & CACHE */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <HardDrive size={16} color={colors.textMuted} />
          <Text style={styles.sectionTitle}>STORAGE & MEMORY</Text>
        </View>

        <TouchableOpacity style={styles.clearCacheBtn} onPress={handleClearCache}>
          <Trash2 size={15} color={colors.textSecondary} />
          <Text style={styles.clearCacheText}>
            {cacheCleared ? 'Cache Cleared (0 KB)' : 'Clear Temporary Audio Cache (24.8 MB)'}
          </Text>
          {cacheCleared && <Check size={14} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* 5. MCP TOOL SERVERS HEALTH */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <ShieldCheck size={16} color={colors.success} />
          <Text style={styles.sectionTitle}>MCP TOOL SERVERS HEALTH</Text>
        </View>

        <View style={styles.mcpList}>
          <View style={styles.mcpItem}>
            <Globe size={15} color={colors.primary} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>Playwright Web Browser MCP</Text>
              <Text style={styles.mcpSub}>Flight booking, job portals & dynamic web forms</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>

          <View style={styles.mcpItem}>
            <HardDrive size={15} color={colors.success} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>Google Workspace & Drive MCP</Text>
              <Text style={styles.mcpSub}>Email triage, calendar & cloud document sync</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>

          <View style={styles.mcpItem}>
            <Terminal size={15} color={colors.warning} />
            <View style={styles.mcpTextCol}>
              <Text style={styles.mcpName}>OS & Filesystem MCP</Text>
              <Text style={styles.mcpSub}>Local terminal execution & file management</Text>
            </View>
            <Text style={styles.mcpStatus}>ONLINE</Text>
          </View>
        </View>
      </View>

      {/* APP INFO FOOTER */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerVersion}>MIRAS Autonomous Assistant • v2.4.0</Text>
        <Text style={styles.footerSub}>Privacy Guaranteed • End-to-End Encrypted</Text>
      </View>

      {/* AI Foundation Model Picker Modal (Modern Web App Style) */}
      <Modal
        visible={isModelPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModelPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModelPickerOpen(false)}
        >
          <View
            style={styles.modalContentSheet}
            onStartShouldSetResponder={() => true}
          >
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTextCol}>
                <Text style={styles.modalTitle}>Choose AI Model</Text>
                <Text style={styles.modalSubtitle}>
                  Select routing foundation model for MIRAS reasoning
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsModelPickerOpen(false)}
                activeOpacity={0.7}
              >
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalModelList}>
              {AI_MODELS.map(model => {
                const isSelected = currentModel.id === model.id;
                return (
                  <TouchableOpacity
                    key={model.id}
                    style={[
                      styles.modalModelCard,
                      isSelected && styles.modalModelCardSelected,
                    ]}
                    onPress={() => {
                      VoiceService.triggerHaptic('medium');
                      setCurrentModel(model);
                      if (onSelectModel) onSelectModel(model);
                      setIsModelPickerOpen(false);
                      setStatusMessage(`Switched to ${model.name}`);
                      setTimeout(() => setStatusMessage(null), 2500);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalModelTopRow}>
                      <View style={styles.modalModelNameGroup}>
                        <Text
                          style={[
                            styles.modalModelName,
                            isSelected && { color: colors.primary },
                          ]}
                        >
                          {model.name}
                        </Text>
                        <View
                          style={[
                            styles.modalBadge,
                            isSelected && styles.modalBadgeSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalBadgeText,
                              isSelected && { color: colors.primary },
                            ]}
                          >
                            {model.badge}
                          </Text>
                        </View>
                      </View>

                      {/* Selection Radio Indicator */}
                      <View
                        style={[
                          styles.radioOuterCircle,
                          isSelected && styles.radioOuterCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInnerDot} />}
                      </View>
                    </View>

                    <Text style={styles.modalModelDescription}>
                      {model.description}
                    </Text>

                    <View style={styles.modalModelMetaRow}>
                      <Text style={styles.modalMetaItem}>
                        Provider: {model.provider}
                      </Text>
                      <Text style={styles.modalMetaDivider}>•</Text>
                      <Text style={styles.modalMetaItem}>⚡ {model.speed}</Text>
                      <Text style={styles.modalMetaDivider}>•</Text>
                      <Text style={styles.modalMetaItem}>🧠 {model.reasoning}</Text>
                      {isSelected && (
                        <View style={styles.modalActiveIndicator}>
                          <Check size={12} color={colors.primary} />
                          <Text style={styles.modalActiveIndicatorText}>CURRENT</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    section: {
      marginBottom: 22,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 1,
    },

    // Active AI Model Selector Card (Clean Minimal Row)
    activeModelSelectorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    activeModelLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      flex: 1,
      minWidth: 0,
      marginRight: 10,
    },
    modelIconSquircle: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    activeModelTextCol: {
      flex: 1,
      minWidth: 0,
    },
    activeModelNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'nowrap',
    },
    activeModelName: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    activeBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
    },
    activeBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    activeModelSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    switchModelAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 10,
      paddingVertical: 5.5,
      borderRadius: 8,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.2)',
      flexShrink: 0,
    },
    switchModelText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.primary,
    },

    // Modal Sheet Styles for Model Picker
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    modalContentSheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceBorder,
      alignSelf: 'center',
      marginBottom: 14,
    },
    modalHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    modalHeaderTextCol: {
      flex: 1,
      paddingRight: 12,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    modalSubtitle: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modalCloseBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalModelList: {
      gap: 10,
    },
    modalModelCard: {
      backgroundColor: colors.cardBgElevated,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    modalModelCardSelected: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    modalModelTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    modalModelNameGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      flex: 1,
      flexWrap: 'wrap',
    },
    modalModelName: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    modalBadge: {
      backgroundColor: colors.cardBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
    },
    modalBadgeSelected: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    modalBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.3,
    },
    radioOuterCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterCircleActive: {
      borderColor: colors.primary,
    },
    radioInnerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    modalModelDescription: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
      marginBottom: 8,
    },
    modalModelMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    modalMetaItem: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
    modalMetaDivider: {
      fontSize: 10,
      color: colors.textMuted,
    },
    modalActiveIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginLeft: 'auto',
    },
    modalActiveIndicatorText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.3,
    },

    // Audio & Transit Settings
    transitHighlightRow: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.primaryBorder,
      borderWidth: 1,
      borderRadius: 14,
      padding: 12,
      marginBottom: 10,
    },
    settingItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorderSubtle,
    },
    settingTextCol: {
      flex: 1,
      paddingRight: 14,
    },
    settingLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    settingSubtext: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 15,
    },
    rateSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorderSubtle,
    },
    rateButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    rateBtn: {
      backgroundColor: colors.cardBgElevated,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    rateBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.surfaceCard,
    },
    rateBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
    },
    rateBtnTextActive: {
      color: colors.primary,
    },
    testVoiceBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      paddingVertical: 12,
      marginTop: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    testVoiceBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
    },

    // Storage & Memory
    clearCacheBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    clearCacheText: {
      fontSize: 12.5,
      color: colors.textPrimary,
      flex: 1,
    },

    // MCP Servers List
    mcpList: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 6,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    mcpItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
    },
    mcpTextCol: {
      flex: 1,
    },
    mcpName: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    mcpSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    mcpStatus: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.success,
      letterSpacing: 0.5,
    },
    footerInfo: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      gap: 4,
    },
    footerVersion: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
    },
    footerSub: {
      fontSize: 10,
      color: colors.textSecondary,
    },
  });
