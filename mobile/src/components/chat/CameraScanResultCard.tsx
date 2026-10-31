import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Sparkles, Camera, Languages, Check } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ScanData } from '../../types/chat';

interface CameraScanResultCardProps {
  scanData: ScanData;
}

export const CameraScanResultCard: React.FC<CameraScanResultCardProps> = ({ scanData }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const isImageUri =
    typeof scanData.imageThumbnail === 'string' &&
    (scanData.imageThumbnail.startsWith('data:image') ||
      scanData.imageThumbnail.startsWith('http://') ||
      scanData.imageThumbnail.startsWith('https://') ||
      scanData.imageThumbnail.startsWith('file:') ||
      scanData.imageThumbnail.startsWith('blob:'));

  return (
    <View style={styles.scanResultCard}>
      <View style={styles.scanResultHeader}>
        <Sparkles size={16} color={colors.primary} />
        <Text style={styles.scanResultTitle}>{scanData.title}</Text>
        <View style={styles.scanActionBadge}>
          <Text style={styles.scanActionBadgeText}>{scanData.actionLabel}</Text>
        </View>
      </View>

      {/* Captured Image Display or Thumbnail Bar */}
      {isImageUri ? (
        <View style={styles.imagePreviewWrapper}>
          <Image
            source={{ uri: scanData.imageThumbnail }}
            style={styles.scanImage}
            resizeMode="cover"
          />
          <View style={styles.scanThumbnailBox}>
            <Camera size={14} color={colors.primary} />
            <Text style={styles.scanThumbnailText}>Captured Document Snapshot</Text>
            <Text style={styles.scanOcrText}>• Verified High-Res OCR</Text>
          </View>
        </View>
      ) : (
        <View style={styles.scanThumbnailBox}>
          <Camera size={14} color={colors.primary} />
          <Text style={styles.scanThumbnailText}>{scanData.imageThumbnail}</Text>
          <Text style={styles.scanOcrText}>• Verified High-Res OCR</Text>
        </View>
      )}

      {/* Translation Box if present */}
      {scanData.translatedText && (
        <View style={styles.translationBox}>
          <Languages size={15} color={colors.primary} />
          <Text style={styles.translationText}>{scanData.translatedText}</Text>
        </View>
      )}

      {/* Structured Key Insights */}
      <View style={styles.insightsList}>
        {scanData.insights.map((insight, idx) => (
          <View key={idx} style={styles.insightBulletRow}>
            <Check size={12} color={colors.primary} style={{ marginTop: 2 }} />
            <Text style={styles.insightBulletText}>{insight}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    scanResultCard: {
      backgroundColor: isDay ? '#F1F5F9' : 'rgba(0, 0, 0, 0.4)',
      borderRadius: 14,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: isDay ? 'rgba(5, 150, 105, 0.25)' : 'rgba(0, 229, 153, 0.3)',
      gap: 8,
    },
    scanResultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    scanResultTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
    },
    scanActionBadge: {
      backgroundColor: 'rgba(0, 229, 153, 0.15)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    scanActionBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
    },
    imagePreviewWrapper: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDay ? '#CBD5E1' : 'rgba(0, 229, 153, 0.25)',
      backgroundColor: isDay ? '#F8FAFC' : '#040907',
      marginBottom: 4,
    },
    scanImage: {
      width: '100%',
      height: 180,
    },
    scanThumbnailBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 8,
      padding: 8,
    },
    scanThumbnailText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    scanOcrText: {
      fontSize: 10,
      color: colors.textMuted,
    },
    translationBox: {
      flexDirection: 'row',
      gap: 8,
      backgroundColor: 'rgba(0, 229, 153, 0.08)',
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.15)',
    },
    translationText: {
      fontSize: 11.5,
      color: colors.textPrimary,
      lineHeight: 16,
      flex: 1,
    },
    insightsList: {
      gap: 6,
    },
    insightBulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    insightBulletText: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
      flex: 1,
    },
  });
};
