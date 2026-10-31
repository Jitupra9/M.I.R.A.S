import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ImageIcon, Zap } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { VisionItemData } from '../../types/vision';

interface VisionViewfinderProps {
  currentData: VisionItemData;
  torchActive: boolean;
  shutterFlash: boolean;
  onToggleTorch: () => void;
  onOpenPhotoPicker: () => void;
}

export const VisionViewfinder: React.FC<VisionViewfinderProps> = ({
  currentData,
  torchActive,
  shutterFlash,
  onToggleTorch,
  onOpenPhotoPicker,
}) => {
  return (
    <View style={[styles.viewfinderContainer, shutterFlash && styles.viewfinderFlash]}>
      {/* Top Overlay Badge & Controls */}
      <View style={styles.viewfinderTopRow}>
        <View style={styles.liveVisionBadge}>
          <View style={styles.redDot} />
          <Text style={styles.liveVisionText}>Live Vision • MIRAS Active</Text>
        </View>

        <View style={styles.viewfinderActions}>
          <TouchableOpacity
            style={[styles.iconCircleBtn, torchActive && styles.iconCircleBtnActive]}
            onPress={onToggleTorch}
          >
            <Zap size={14} color={torchActive ? COLORS.buttonTextDark : COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconCircleBtn} onPress={onOpenPhotoPicker}>
            <ImageIcon size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Identified Item Header Pill */}
      <View style={styles.identifiedPill}>
        <Text style={styles.identifiedPillText}>{currentData.title}</Text>
      </View>

      {/* Camera Target Frame with 4 Corners & Laser Scan Line */}
      <View style={styles.targetFrame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />

        <View style={styles.scanLaserLine} />

        {/* Item Content Preview */}
        <View style={styles.bottleLabelCard}>
          <Text style={styles.medName}>{currentData.cardTitle}</Text>
          {currentData.details.map((line, idx) => (
            <Text key={idx} style={styles.detailLineText}>
              • {line}
            </Text>
          ))}
        </View>
      </View>

      {/* Floating Dosage Recognition Chip */}
      <View style={styles.dosageChip}>
        <Text style={styles.dosageChipText}>{currentData.pillTag}</Text>
      </View>

      {/* Bottom Focus Indicator */}
      <View style={styles.focusIndicatorRow}>
        <View style={styles.focusDot} />
        <Text style={styles.focusText}>Auto-focus locked • High confidence</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewfinderContainer: {
    backgroundColor: '#0F1A24',
    borderRadius: 20,
    height: 380,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 153, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  viewfinderFlash: {
    backgroundColor: '#FFFFFF',
  },
  viewfinderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  liveVisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveVisionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  viewfinderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  iconCircleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  identifiedPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.4)',
    zIndex: 10,
  },
  identifiedPillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  targetFrame: {
    width: '85%',
    height: 180,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  scanLaserLine: {
    position: 'absolute',
    top: '30%',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.85,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  bottleLabelCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 12,
    borderRadius: 10,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  medName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  detailLineText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  dosageChip: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  dosageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  focusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  focusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  focusText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
