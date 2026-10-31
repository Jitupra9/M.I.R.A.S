import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X, Camera, FileText, ArrowRight } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface AttachmentOptionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onScanWithCamera: () => void;
  onUploadDocument: () => void;
}

export const AttachmentOptionsSheet: React.FC<AttachmentOptionsSheetProps> = ({
  visible,
  onClose,
  onScanWithCamera,
  onUploadDocument,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.attachmentSheet}>
          <View style={styles.sheetTopRow}>
            <Text style={styles.sheetTitle}>Add Attachment</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Option 1: Scan with Camera */}
          <TouchableOpacity style={styles.attachOption} onPress={onScanWithCamera}>
            <View style={styles.attachOptionIcon}>
              <Camera size={20} color={colors.primary} />
            </View>
            <View style={styles.attachOptionTextCol}>
              <Text style={styles.attachOptionTitle}>Scan with Camera</Text>
              <Text style={styles.attachOptionSub}>Take photo, translate text, or scan receipts & bills</Text>
            </View>
            <ArrowRight size={15} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Option 2: Upload Document */}
          <TouchableOpacity style={styles.attachOption} onPress={onUploadDocument}>
            <View style={styles.attachOptionIcon}>
              <FileText size={20} color={colors.primary} />
            </View>
            <View style={styles.attachOptionTextCol}>
              <Text style={styles.attachOptionTitle}>Upload Document</Text>
              <Text style={styles.attachOptionSub}>Attach PDF, images, DOCX, TXT or reports for MIRAS to summarize</Text>
            </View>
            <ArrowRight size={15} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    attachmentSheet: {
      backgroundColor: colors.cardBgSubtle,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 12,
    },
    sheetTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    sheetTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    attachOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    attachOptionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    attachOptionTextCol: {
      flex: 1,
    },
    attachOptionTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    attachOptionSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
};
