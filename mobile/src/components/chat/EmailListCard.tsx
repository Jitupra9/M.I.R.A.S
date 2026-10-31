import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Eye } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { EmailSummaryItem } from '../../types/chat';

interface EmailListCardProps {
  title: string;
  items: EmailSummaryItem[];
  onOpenEmailDetails: (email: EmailSummaryItem) => void;
}

export const EmailListCard: React.FC<EmailListCardProps> = ({
  title,
  items,
  onOpenEmailDetails,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.emailListCard}>
      <View style={styles.emailListHeader}>
        <Mail size={16} color={colors.primary} />
        <Text style={styles.emailListTitle}>{title}</Text>
      </View>

      {items.map(email => (
        <View key={email.id} style={styles.emailItemRow}>
          <View style={styles.emailItemTop}>
            <View style={styles.emailPriorityTag}>
              <Text style={styles.emailPriorityText}>{email.priority}</Text>
            </View>
            <Text style={styles.emailSender}>{email.sender}</Text>
            <Text style={styles.emailTime}>{email.time}</Text>
          </View>

          <Text style={styles.emailSubject}>{email.subject}</Text>
          <Text style={styles.emailSummary}>{email.summary}</Text>

          <TouchableOpacity
            style={styles.emailSeeMoreBtn}
            onPress={() => onOpenEmailDetails(email)}
          >
            <Eye size={12} color={colors.primary} />
            <Text style={styles.emailSeeMoreText}>See more</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    emailListCard: {
      backgroundColor: isDay ? '#F1F5F9' : 'rgba(0, 0, 0, 0.35)',
      borderRadius: 14,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : colors.surfaceBorderSubtle,
      gap: 10,
    },
    emailListHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderColor: isDay ? '#E2E8F0' : 'rgba(255, 255, 255, 0.06)',
    },
    emailListTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    emailItemRow: {
      backgroundColor: isDay ? '#FFFFFF' : 'rgba(255, 255, 255, 0.02)',
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : 'rgba(255, 255, 255, 0.05)',
      gap: 4,
    },
    emailItemTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    emailPriorityTag: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 4,
    },
    emailPriorityText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#F59E0B',
    },
    emailSender: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
    },
    emailTime: {
      fontSize: 10,
      color: colors.textMuted,
    },
    emailSubject: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    emailSummary: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 15,
    },
    emailSeeMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingTop: 4,
    },
    emailSeeMoreText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
  });
};
