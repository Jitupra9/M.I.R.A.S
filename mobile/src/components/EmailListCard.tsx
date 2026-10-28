import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, ChevronDown, ChevronUp, AlertCircle, Volume2, CornerDownRight, CheckCircle2 } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { EmailItem } from '../types';
import { VoiceService } from '../services/voiceService';

interface EmailListCardProps {
  emails: EmailItem[];
  onReplyDictate?: (email: EmailItem) => void;
}

export const EmailListCard: React.FC<EmailListCardProps> = ({ emails, onReplyDictate }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expandedId, setExpandedId] = useState<string | null>(emails[0]?.id || null);

  const toggleExpand = (id: string) => {
    VoiceService.triggerHaptic('light');
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleReadAloud = (email: EmailItem) => {
    VoiceService.triggerHaptic('medium');
    if (!VoiceService.isMutedMode()) {
      const speech = `Email from ${email.sender}. Subject: ${email.subject}. Summary: ${email.summary}. Required Action: ${email.actionRequired}.`;
      VoiceService.speak(speech);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Mail size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>Urgent Inbox Triage ({emails.length})</Text>
        </View>
        <Text style={styles.sourceTag}>Google Workspace MCP</Text>
      </View>

      <Text style={styles.subSubtitle}>
        Mails identified requiring your immediate review:
      </Text>

      {emails.map((mail) => {
        const isExpanded = expandedId === mail.id;
        const isUrgent = mail.priority === 'URGENT';

        return (
          <View
            key={mail.id}
            style={[
              styles.mailItem,
              isExpanded && styles.mailItemExpanded,
              isUrgent && styles.mailItemUrgent,
            ]}
          >
            {/* Header Clickable Row */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleExpand(mail.id)}
              style={styles.mailSummaryHeader}
            >
              <View style={styles.priorityIndicator}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: isUrgent ? colors.danger : colors.warning },
                  ]}
                />
              </View>

              <View style={styles.headerDetails}>
                <View style={styles.senderRow}>
                  <Text style={styles.senderName} numberOfLines={1}>
                    {mail.sender}
                  </Text>
                  <Text style={styles.receivedAt}>{mail.receivedAt}</Text>
                </View>

                <Text style={styles.subjectText} numberOfLines={isExpanded ? 3 : 1}>
                  {mail.subject}
                </Text>

                {!isExpanded && (
                  <Text style={styles.previewText} numberOfLines={1}>
                    {mail.summary}
                  </Text>
                )}
              </View>

              <View style={styles.expandChevron}>
                {isExpanded ? (
                  <ChevronUp size={18} color={colors.primary} />
                ) : (
                  <ChevronDown size={18} color={colors.textMuted} />
                )}
              </View>
            </TouchableOpacity>

            {/* In-depth Explained Content (What's Inside) */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />

                {/* AI Explanation Banner */}
                <View style={styles.explanationBanner}>
                  <AlertCircle size={15} color={colors.primary} />
                  <Text style={styles.explanationTitle}>
                    What's Inside (MIRAS Intelligence):
                  </Text>
                </View>

                <Text style={styles.explanationSummary}>{mail.summary}</Text>

                {/* Key Points */}
                <View style={styles.keyPointsList}>
                  {mail.keyPoints.map((point, index) => (
                    <View key={index} style={styles.bulletRow}>
                      <CornerDownRight size={13} color={colors.primary} style={styles.bulletIcon} />
                      <Text style={styles.bulletText}>{point}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Required Box */}
                <View style={styles.actionBox}>
                  <Text style={styles.actionLabel}>ACTION NEEDED:</Text>
                  <Text style={styles.actionValue}>{mail.actionRequired}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtonRow}>
                  <TouchableOpacity
                    style={styles.voiceReadButton}
                    onPress={() => handleReadAloud(mail)}
                  >
                    <Volume2 size={14} color={colors.primary} />
                    <Text style={styles.voiceReadButtonText}>Read Aloud</Text>
                  </TouchableOpacity>

                  {onReplyDictate && (
                    <TouchableOpacity
                      style={styles.dictateButton}
                      onPress={() => onReplyDictate(mail)}
                    >
                      <CheckCircle2 size={14} color="#000" />
                      <Text style={styles.dictateButtonText}>Dictate Reply</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sourceTag: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  mailItem: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    overflow: 'hidden',
  },
  mailItemExpanded: {
    borderColor: colors.surfaceBorder,
  },
  mailItemUrgent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  mailSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  priorityIndicator: {
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerDetails: {
    flex: 1,
  },
  senderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: '75%',
  },
  receivedAt: {
    fontSize: 11,
    color: colors.textMuted,
  },
  subjectText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  previewText: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  expandChevron: {
    marginLeft: 8,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorderSubtle,
    marginBottom: 10,
  },
  explanationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  explanationSummary: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  keyPointsList: {
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletIcon: {
    marginTop: 2,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  actionBox: {
    backgroundColor: `${colors.danger}14`,
    borderColor: `${colors.danger}40`,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.danger,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  actionValue: {
    fontSize: 11.5,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceReadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}1A`,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voiceReadButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  dictateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dictateButtonText: {
    fontSize: 12,
    color: '#070B14',
    fontWeight: '700',
  },
});
