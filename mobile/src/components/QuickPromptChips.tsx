import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Mail, Plane, FileText, Search, Sparkles } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

interface QuickPromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickPromptChips: React.FC<QuickPromptChipsProps> = ({ onSelectPrompt }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const quickPrompts = useMemo(() => [
    {
      icon: Mail,
      label: 'Check Important Emails',
      prompt: 'Give me list mails whose need to check once and important to me',
      color: colors.primary,
    },
    {
      icon: Sparkles,
      label: "Explain What's Inside",
      prompt: 'What inside that explain and summarize',
      color: colors.secondary,
    },
    {
      icon: Plane,
      label: 'Book Flight Ticket',
      prompt: 'Go and book one flight ticket to New York',
      color: colors.warning,
    },
    {
      icon: FileText,
      label: 'Update Resume & Drive',
      prompt: 'Update and modify my resume and store in drive',
      color: colors.success,
    },
    {
      icon: Search,
      label: 'Autonomous System Status',
      prompt: 'Report active MCP tools and agent memory status',
      color: colors.textCyan,
    },
  ], [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Suggested Voice Commands:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {quickPrompts.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              style={[styles.chip, { borderColor: `${item.color}40` }]}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                onSelectPrompt(item.prompt);
              }}
            >
              <IconComponent size={14} color={item.color} />
              <Text style={styles.chipText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBgElevated,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

