import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send, Mic, Plus } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface ChatInputBarProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onMicPress: () => void;
  onOpenAttachmentSheet: () => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputText,
  onChangeText,
  onSend,
  onMicPress,
  onOpenAttachmentSheet,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.inputBar}>
      <TouchableOpacity
        style={styles.plusMenuBtn}
        onPress={onOpenAttachmentSheet}
      >
        <Plus size={20} color={colors.primary} />
      </TouchableOpacity>

      <TextInput
        style={styles.textInput}
        placeholder="Message MIRAS..."
        placeholderTextColor={colors.textMuted}
        value={inputText}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
      />

      <TouchableOpacity style={styles.micSendBtn} onPress={onMicPress}>
        {inputText.trim() ? (
          <Send size={15} color={colors.buttonTextDark} />
        ) : (
          <Mic size={16} color={colors.buttonTextDark} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    inputBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.cardBg,
      borderTopWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
    },
    plusMenuBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.25)',
    },
    textInput: {
      flex: 1,
      height: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 20,
      paddingHorizontal: 16,
      fontSize: 13.5,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    micSendBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
