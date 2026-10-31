import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { Message, EmailSummaryItem } from '../../types/chat';
import { BillCard } from './BillCard';
import { EmailListCard } from './EmailListCard';
import { FlightCard } from './FlightCard';
import { CameraScanResultCard } from './CameraScanResultCard';
import { DocumentAttachmentCard } from './DocumentAttachmentCard';

interface ChatMessageItemProps {
  item: Message;
  onToggleExpand: (msgId: string) => void;
  onPayBill: (msgId: string) => void;
  onOpenPdfDetails: (pdfData?: any) => void;
  onOpenEmailDetails: (email: EmailSummaryItem) => void;
  onRemoveAttachment: (msgId: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  item,
  onToggleExpand,
  onPayBill,
  onOpenPdfDetails,
  onOpenEmailDetails,
  onRemoveAttachment,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const isUser = item.sender === 'user';
  const isImageText =
    typeof item.text === 'string' &&
    (item.text.startsWith('data:image') || item.text.startsWith('blob:'));

  return (
    <View style={[styles.msgRow, isUser ? styles.userRow : styles.miraRow]}>
      <View style={[styles.msgBubble, isUser ? styles.userBubble : styles.miraBubble]}>
        {isImageText ? (
          <View style={styles.inlineImageWrapper}>
            <Image
              source={{ uri: item.text }}
              style={styles.inlineImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <Text style={styles.msgText}>{item.text}</Text>
        )}

        {/* 1. Electricity Bill Breakdown Card */}
        {item.cardType === 'electricity_bill' && item.billData && (
          <BillCard
            billData={item.billData}
            isExpanded={item.isExpanded}
            onToggleExpand={() => onToggleExpand(item.id)}
            onPayBill={() => onPayBill(item.id)}
            onOpenPdfDetails={() => onOpenPdfDetails()}
          />
        )}

        {/* 2. Priority Email Triage Card */}
        {item.cardType === 'email_list' && item.emailData && (
          <EmailListCard
            title={item.emailData.title}
            items={item.emailData.items}
            onOpenEmailDetails={onOpenEmailDetails}
          />
        )}

        {/* 3. Flight Booking Card */}
        {item.cardType === 'flight_card' && item.flightData && (
          <FlightCard
            flightData={item.flightData}
            isExpanded={item.isExpanded}
            onToggleExpand={() => onToggleExpand(item.id)}
          />
        )}

        {/* 4. Scanned Camera Image & AI Analysis Card */}
        {item.cardType === 'camera_scan' && item.scanData && (
          <CameraScanResultCard scanData={item.scanData} />
        )}

        {/* 5. Attached Document File Chip */}
        {item.cardType === 'pdf_attachment' && item.attachmentData && (
          <DocumentAttachmentCard
            attachmentData={item.attachmentData}
            onOpenDetails={() => onOpenPdfDetails(item.attachmentData)}
            onRemove={() => onRemoveAttachment(item.id)}
          />
        )}

        <Text style={styles.timestamp}>{item.time}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    msgRow: {
      flexDirection: 'row',
      width: '100%',
    },
    userRow: {
      justifyContent: 'flex-end',
    },
    miraRow: {
      justifyContent: 'flex-start',
    },
    msgBubble: {
      maxWidth: '88%',
      borderRadius: 18,
      padding: 14,
      overflow: 'hidden',
      boxSizing: 'border-box' as any,
    },
    userBubble: {
      backgroundColor: colors.userBubbleBg,
      borderBottomRightRadius: 4,
      borderWidth: 1,
      borderColor: colors.userBubbleBorder,
    },
    miraBubble: {
      backgroundColor: isDay ? '#FFFFFF' : colors.cardBg,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : colors.surfaceBorderSubtle,
    },
    msgText: {
      fontSize: 13.5,
      color: colors.textPrimary,
      lineHeight: 19,
    },
    inlineImageWrapper: {
      borderRadius: 12,
      overflow: 'hidden',
      maxWidth: 240,
      maxHeight: 240,
      marginBottom: 4,
    },
    inlineImage: {
      width: 220,
      height: 160,
      borderRadius: 12,
    },
    timestamp: {
      fontSize: 9.5,
      color: colors.textMuted,
      marginTop: 6,
      alignSelf: 'flex-end',
    },
  });
};
