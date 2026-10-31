import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Settings } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { VoiceService } from '../../services/voiceService';
import { MirasLogo } from '../MirasLogo';

interface ProfileTopBarProps {
  onBack?: () => void;
  onOpenSettings?: () => void;
}

export const ProfileTopBar: React.FC<ProfileTopBarProps> = ({ onBack, onOpenSettings }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.topBar}>
      {onBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            onBack();
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={17} color={colors.primary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.brandRow}>
          <MirasLogo size={20} glow glowColor={colors.primary} />
          <Text style={styles.brandText}>MIRAS</Text>
        </View>
      )}

      {onOpenSettings ? (
        <TouchableOpacity
          style={styles.settingsShortcutBtn}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            onOpenSettings();
          }}
          activeOpacity={0.7}
          accessibilityLabel="Open Settings"
        >
          <Settings size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginBottom: 2,
    },
    backBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    backBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    brandText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.8,
    },
    settingsShortcutBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
  });
