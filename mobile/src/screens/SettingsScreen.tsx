import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import {
  Settings,
  Cpu,
  Volume2,
  ShieldCheck,
  Check,
  Globe,
  HardDrive,
  Terminal,
  Palette,
  Bus,
  Trash2,
  Sparkles,
  Smartphone,
  Moon,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { ThemeColors, useTheme, ThemeManager } from '../theme/colors';
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
  const currentTheme = themeName;
  const [transitMode, setTransitMode] = useState(VoiceService.isMutedMode());
  const [autoSpeech, setAutoSpeech] = useState(!VoiceService.isMutedMode());
  const [speechRate, setSpeechRate] = useState(1.0);
  const [haptics, setHaptics] = useState(true);
  const [backgroundTasks, setBackgroundTasks] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectTheme = (themeName: 'midnight' | 'cyber' | 'claude') => {
    setTheme(themeName);
    VoiceService.triggerHaptic('medium');
    const label =
      themeName === 'midnight'
        ? 'Midnight Navy (Emerald & Purple)'
        : themeName === 'cyber'
        ? 'Cyber Jarvis'
        : 'Claude Warm';
    setStatusMessage(`Theme switched to ${label}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleToggleTransitMode = (val: boolean) => {
    setTransitMode(val);
    VoiceService.setMuted(val);
    setAutoSpeech(!val);
    VoiceService.triggerHaptic('medium');
    setStatusMessage(val ? 'Transit Mode Enabled: Audio speech silenced for public commute' : 'Transit Mode Disabled: Voice audio enabled');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTestVoice = () => {
    VoiceService.triggerHaptic('medium');
    if (transitMode) {
      setStatusMessage("Transit Mode is active (Voice muted). Disable Transit Mode to test speaker.");
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
    VoiceService.speak(
      `Hello! I am MIRAS, your autonomous personal voice assistant. Speech synthesis is functioning at one hundred percent efficiency.`,
      { rate: speechRate }
    );
    setStatusMessage("Playing audio test voice sample...");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleClearCache = () => {
    VoiceService.triggerHaptic('medium');
    setCacheCleared(true);
    setStatusMessage("24.8 MB audio & memory cache cleared");
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>System Settings</Text>
        <Text style={styles.subtitle}>Theme Aesthetics, Model Routing & System Audio</Text>

        {statusMessage && (
          <View style={styles.toast}>
            <Check size={14} color={colors.buttonTextDark} />
            <Text style={styles.toastText}>{statusMessage}</Text>
          </View>
        )}
      </View>

      {/* Quick Jump to Full Profile Page */}
      {onOpenProfile && (
        <TouchableOpacity
          style={styles.profileJumpCard}
          onPress={() => {
            VoiceService.triggerHaptic('medium');
            onOpenProfile();
          }}
          activeOpacity={0.8}
        >
          <View style={styles.profileAvatarCircle}>
            <Text style={styles.profileAvatarText}>A</Text>
          </View>
          <View style={styles.profileInfoCol}>
            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>Alex Morgan</Text>
              <View style={styles.profileTierBadge}>
                <Text style={styles.profileTierBadgeText}>WORKSPACE PRO</Text>
              </View>
            </View>
            <Text style={styles.profileEmail}>alex.morgan@workspace.io • Manage Profile & Accounts</Text>
          </View>
          <ChevronRight size={18} color={colors.primary} />
        </TouchableOpacity>
      )}

      {/* 1. APPLICATION THEME SELECTION (Item 8) */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Palette size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>APPLICATION THEME</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Choose your interface aesthetic. Default is Midnight Navy, or switch to Cyber Jarvis or Claude Warm.
        </Text>

        <View style={styles.themeOptionsRow}>
          {/* Midnight Navy (Primary / Default) */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              currentTheme === 'midnight' && styles.themeCardActiveMidnight,
            ]}
            onPress={() => handleSelectTheme('midnight')}
            activeOpacity={0.8}
          >
            <View style={styles.themeCardHeader}>
              <View style={styles.midnightBadgeDot} />
              <Text style={styles.themeCardTitle}>Midnight Navy</Text>
              <View style={styles.defaultPill}>
                <Text style={styles.defaultPillText}>DEFAULT</Text>
              </View>
              {currentTheme === 'midnight' && (
                <Check size={14} color="#0CB981" style={{ marginLeft: 'auto' }} />
              )}
            </View>
            <Text style={styles.themeCardSub}>Dark Navy, Deep Charcoal, Emerald & Purple (Primary)</Text>
            <View style={styles.swatchRow}>
              <View style={[styles.swatch, { backgroundColor: '#0F131E' }]} />
              <View style={[styles.swatch, { backgroundColor: '#1C202B' }]} />
              <View style={[styles.swatch, { backgroundColor: '#0CB981' }]} />
              <View style={[styles.swatch, { backgroundColor: '#202068' }]} />
            </View>
          </TouchableOpacity>

          {/* Cyber Jarvis */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              currentTheme === 'cyber' && styles.themeCardActiveCyber,
            ]}
            onPress={() => handleSelectTheme('cyber')}
            activeOpacity={0.8}
          >
            <View style={styles.themeCardHeader}>
              <View style={styles.cyberBadgeDot} />
              <Text style={styles.themeCardTitle}>Cyber Jarvis</Text>
              {currentTheme === 'cyber' && (
                <Check size={14} color="#00FFA3" style={{ marginLeft: 'auto' }} />
              )}
            </View>
            <Text style={styles.themeCardSub}>Neon Emerald & Deep Forest Black</Text>
            <View style={styles.swatchRow}>
              <View style={[styles.swatch, { backgroundColor: '#060E0A' }]} />
              <View style={[styles.swatch, { backgroundColor: '#0D1A14' }]} />
              <View style={[styles.swatch, { backgroundColor: '#00E599' }]} />
            </View>
          </TouchableOpacity>

          {/* Claude Warm */}
          <TouchableOpacity
            style={[
              styles.themeCard,
              currentTheme === 'claude' && styles.themeCardActiveClaude,
            ]}
            onPress={() => handleSelectTheme('claude')}
            activeOpacity={0.8}
          >
            <View style={styles.themeCardHeader}>
              <View style={styles.claudeBadgeDot} />
              <Text style={styles.themeCardTitle}>Claude Warm</Text>
              {currentTheme === 'claude' && (
                <Check size={14} color="#D97757" style={{ marginLeft: 'auto' }} />
              )}
            </View>
            <Text style={styles.themeCardSub}>Warm Terracotta & Sand Charcoal</Text>
            <View style={styles.swatchRow}>
              <View style={[styles.swatch, { backgroundColor: '#0D0C0A' }]} />
              <View style={[styles.swatch, { backgroundColor: '#171512' }]} />
              <View style={[styles.swatch, { backgroundColor: '#D97757' }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. VOICE, AUDIO & COMMUTE / TRANSIT MODE (Item 7) */}
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

      {/* 3. ACTIVE AI FOUNDATION MODEL */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Cpu size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>ACTIVE AI FOUNDATION MODEL</Text>
        </View>

        {AI_MODELS.map(model => {
          const isSelected = currentModel.id === model.id;
          return (
            <TouchableOpacity
              key={model.id}
              activeOpacity={0.8}
              style={[styles.modelCard, isSelected && styles.modelCardSelected]}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                setCurrentModel(model);
                if (onSelectModel) onSelectModel(model);
              }}
            >
              <View style={styles.modelHeaderRow}>
                <View style={styles.nameBlock}>
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.providerName}>{model.provider}</Text>
                </View>
                <View style={[styles.badge, isSelected && styles.badgeSelected]}>
                  <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                    {model.badge}
                  </Text>
                </View>
              </View>

              <Text style={styles.modelDesc}>{model.description}</Text>

              <View style={styles.modelMetaRow}>
                <Text style={styles.metaText}>⚡ Latency: {model.speed}</Text>
                <Text style={styles.metaText}>🧠 Reasoning: {model.reasoning}</Text>
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Check size={14} color={colors.primary} />
                    <Text style={styles.selectedIndicatorText}>ACTIVE</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. AUTONOMOUS CHORES & BACKGROUND EXECUTION */}
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

      {/* 5. STORAGE & CACHE */}
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

      {/* 6. MCP TOOL SERVERS HEALTH */}
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

      {/* 7. APP INFO FOOTER */}
      <View style={styles.footerInfo}>
        <Text style={styles.footerVersion}>MIRAS Autonomous Assistant • v2.4.0</Text>
        <Text style={styles.footerSub}>Privacy Guaranteed • End-to-End Encrypted</Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
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
  profileJumpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: 20,
  },
  profileAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  profileInfoCol: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileTierBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  profileTierBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  profileEmail: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  sectionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  themeOptionsRow: {
    gap: 10,
  },
  themeCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  themeCardActiveMidnight: {
    borderColor: '#0CB981',
    backgroundColor: 'rgba(12, 185, 129, 0.08)',
  },
  themeCardActiveCyber: {
    borderColor: '#00FFA3',
    backgroundColor: 'rgba(0, 255, 163, 0.05)',
  },
  themeCardActiveClaude: {
    borderColor: '#D97757',
    backgroundColor: 'rgba(217, 119, 87, 0.06)',
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  midnightBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0CB981',
  },
  defaultPill: {
    backgroundColor: 'rgba(12, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(12, 185, 129, 0.3)',
  },
  defaultPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0CB981',
    letterSpacing: 0.5,
  },
  cyberBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFA3',
  },
  claudeBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97757',
  },
  themeCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  themeCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  swatch: {
    width: 22,
    height: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
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
  modelCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  modelCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceCard,
  },
  modelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  nameBlock: {
    flex: 1,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  providerName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSelected: {
    backgroundColor: colors.surfaceCard,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  badgeTextSelected: {
    color: colors.primary,
  },
  modelDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  modelMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaText: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  selectedIndicatorText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
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
