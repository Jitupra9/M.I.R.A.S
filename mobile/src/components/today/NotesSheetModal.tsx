import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, FileText } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';
import { NOTE_BULLETS } from '../../data/todayData';

interface NotesSheetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotesSheetModal: React.FC<NotesSheetModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>MIRAS Auto-Captured Notes</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.notesSub}>Syncing live with Team Product Sync</Text>

          <View style={styles.noteCard}>
            {NOTE_BULLETS.map((note) => (
              <Text key={note.id} style={styles.noteBullet}>
                📌 <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{note.tag}</Text>{' '}
                {note.content}
              </Text>
            ))}
          </View>

          <TouchableOpacity
            style={styles.primaryModalBtn}
            onPress={() => {
              VoiceService.triggerHaptic('medium');
              onClose();
            }}
          >
            <FileText size={16} color={colors.buttonTextDark} />
            <Text style={styles.primaryModalBtnText}>Save Notes to Google Drive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'flex-end',
    },
    sheetContent: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    notesSub: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    noteCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 10,
    },
    noteBullet: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    primaryModalBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 13,
      marginTop: 8,
    },
    primaryModalBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
