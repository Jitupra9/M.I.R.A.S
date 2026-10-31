import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { AttachmentData } from '../../types/chat';

interface DocumentAttachmentCardProps {
  attachmentData: AttachmentData;
  onOpenDetails: () => void;
  onRemove: () => void;
}

export const DocumentAttachmentCard: React.FC<DocumentAttachmentCardProps> = ({
  attachmentData,
  onOpenDetails,
  onRemove,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const tagLabel = attachmentData.isImage
    ? 'IMG'
    : attachmentData.name?.endsWith('.pdf')
    ? 'PDF'
    : 'DOC';

  return (
    <View style={styles.attachmentWrapper}>
      <TouchableOpacity
        style={styles.attachmentChip}
        onPress={onOpenDetails}
      >
        <View style={styles.attachIcon}>
          <Text style={styles.pdfText}>{tagLabel}</Text>
        </View>
        <View style={styles.attachCol}>
          <Text style={styles.attachName} numberOfLines={1} ellipsizeMode="tail">
            {attachmentData.name}
          </Text>
          <Text style={styles.attachSub} numberOfLines={1} ellipsizeMode="tail">
            ✓ {attachmentData.sub} (Tap to view)
          </Text>
        </View>
        <Eye size={14} color={colors.primary} style={styles.attachEyeIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeAttachmentChipBtn}
        onPress={onRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={14} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    attachmentWrapper: {
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
      boxSizing: 'border-box' as any,
    },
    attachmentChip: {
      flex: 1,
      minWidth: 0,
      maxWidth: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isDay ? '#F1F5F9' : 'rgba(0, 0, 0, 0.35)',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : colors.surfaceBorderSubtle,
      boxSizing: 'border-box' as any,
    },
    attachIcon: {
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: isDay ? '#FEE2E2' : 'rgba(239, 68, 68, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    pdfText: {
      fontSize: 9,
      fontWeight: '800',
      color: isDay ? '#DC2626' : '#EF4444',
    },
    attachCol: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    attachName: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    attachSub: {
      fontSize: 10,
      color: colors.textSecondary,
      marginTop: 1,
    },
    attachEyeIcon: {
      flexShrink: 0,
      marginLeft: 2,
    },
    removeAttachmentChipBtn: {
      flexShrink: 0,
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  });
};
