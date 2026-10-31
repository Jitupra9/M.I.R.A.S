import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, Eye, FileText, Globe, Image as ImageIcon, Mic } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { VisionMode } from '../../types/vision';

interface VisionControlsBarProps {
  activeMode: VisionMode;
  onModeSwitch: (mode: VisionMode) => void;
  onOpenPhotoPicker: () => void;
  onSnap: () => void;
  onOpenLensQa: () => void;
}

export const VisionControlsBar: React.FC<VisionControlsBarProps> = ({
  activeMode,
  onModeSwitch,
  onOpenPhotoPicker,
  onSnap,
  onOpenLensQa,
}) => {
  return (
    <>
      {/* Mode Selector Chips */}
      <View style={styles.modeChipsRow}>
        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'identify' && styles.modeChipActive]}
          onPress={() => onModeSwitch('identify')}
        >
          <Eye
            size={13}
            color={activeMode === 'identify' ? COLORS.buttonTextDark : COLORS.textSecondary}
          />
          <Text style={[styles.modeChipText, activeMode === 'identify' && styles.modeChipTextActive]}>
            Identify Item
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'document' && styles.modeChipActive]}
          onPress={() => onModeSwitch('document')}
        >
          <FileText
            size={13}
            color={activeMode === 'document' ? COLORS.buttonTextDark : COLORS.textSecondary}
          />
          <Text style={[styles.modeChipText, activeMode === 'document' && styles.modeChipTextActive]}>
            Read document
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeChip, activeMode === 'translate' && styles.modeChipActive]}
          onPress={() => onModeSwitch('translate')}
        >
          <Globe
            size={13}
            color={activeMode === 'translate' ? COLORS.buttonTextDark : COLORS.textSecondary}
          />
          <Text style={[styles.modeChipText, activeMode === 'translate' && styles.modeChipTextActive]}>
            Translate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Camera Capture Shutter Bar */}
      <View style={styles.cameraControlsBar}>
        <TouchableOpacity style={styles.controlBtn} onPress={onOpenPhotoPicker}>
          <ImageIcon size={20} color={COLORS.primary} />
          <Text style={styles.controlBtnText}>Sample Photos</Text>
        </TouchableOpacity>

        {/* Big Mint Shutter Button */}
        <TouchableOpacity style={styles.shutterButton} onPress={onSnap}>
          <View style={styles.shutterInnerRing}>
            <Camera size={26} color={COLORS.buttonTextDark} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={onOpenLensQa}>
          <Mic size={20} color={COLORS.primary} />
          <Text style={styles.controlBtnText}>Talk to Lens</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modeChipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modeChipTextActive: {
    color: COLORS.buttonTextDark,
  },
  cameraControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  controlBtn: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  controlBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  shutterInnerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.buttonTextDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
