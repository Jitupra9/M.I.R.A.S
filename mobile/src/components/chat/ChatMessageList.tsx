import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { Message, EmailSummaryItem } from '../../types/chat';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessageListProps {
  messages: Message[];
  onToggleExpand: (msgId: string) => void;
  onPayBill: (msgId: string) => void;
  onOpenPdfDetails: (pdfData?: any) => void;
  onOpenEmailDetails: (email: EmailSummaryItem) => void;
  onRemoveAttachment: (msgId: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onToggleExpand,
  onPayBill,
  onOpenPdfDetails,
  onOpenEmailDetails,
  onRemoveAttachment,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ChatMessageItem
          item={item}
          onToggleExpand={onToggleExpand}
          onPayBill={onPayBill}
          onOpenPdfDetails={onOpenPdfDetails}
          onOpenEmailDetails={onOpenEmailDetails}
          onRemoveAttachment={onRemoveAttachment}
        />
      )}
    />
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 14,
    },
  });
};
