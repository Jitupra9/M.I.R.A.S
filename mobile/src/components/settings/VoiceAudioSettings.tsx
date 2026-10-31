import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Bus, Volume2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';

interface VoiceAudioSettingsProps {
  transitMode: boolean;
  onToggleTransitMode: (val: boolean) => void;
  autoSpeech: boolean;
  onToggleAutoSpeech: (val: boolean) => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  onTestVoice: () => void;
}

export const VoiceAudioSettings: React.FC<VoiceAudioSettingsProps> = ({
  transitMode,
  onToggleTransitMode,
  autoSpeech,
  onToggleAutoSpeech,
  speechRate,
  onChangeSpeechRate,
  onTestVoice,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Volume2 size={16} color={colors.secondary} />
        <Text style={styles.sectionTitle}>VOICE, AUDIO & COMMUTE MODE</Text>
      </View>

      {/* Transit Mode Highlight Box */}
      <View style={[styles.settingItemRow, styles.transitHighlightRow]}>
        <View style={styles.settingTextCol}>
          <View style={styles.transitLabelRow}>
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
          onValueChange={onToggleTransitMode}
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
          onValueChange={onToggleAutoSpeech}
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
                onChangeSpeechRate(rate);
              }}
            >
              <Text style={[styles.rateBtnText, speechRate === rate && styles.rateBtnTextActive]}>
                {rate}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.testVoiceBtn} onPress={onTestVoice}>
        <Volume2 size={15} color={colors.primary} />
        <Text style={styles.testVoiceBtnText}>Test Voice Speaker Output</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    settingItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
    },
    transitHighlightRow: {
      backgroundColor: 'rgba(12, 185, 129, 0.08)',
      paddingHorizontal: 12,
      borderRadius: 12,
      borderBottomWidth: 0,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: 'rgba(12, 185, 129, 0.25)',
    },
    transitLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    settingTextCol: {
      flex: 1,
      paddingRight: 12,
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
    },
    rateSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceBorder,
    },
    rateButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    rateBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    rateBtnActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    rateBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    rateBtnTextActive: {
      color: colors.buttonTextDark,
    },
    testVoiceBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 12,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    testVoiceBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
    },
  });
