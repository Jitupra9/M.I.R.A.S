import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MirasLogo } from './MirasLogo';
import { useTheme } from '../theme/colors';

interface AppHeaderProps {
  onOpenProfile: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenProfile }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
      <View style={styles.brandRow}>
        <MirasLogo size={22} glow glowColor={colors.primary} />
        <Text style={[styles.brandText, { color: colors.primary }]}>MIRAS</Text>
      </View>

      <TouchableOpacity
        style={[styles.avatar, { backgroundColor: colors.primary }]}
        onPress={onOpenProfile}
        activeOpacity={0.8}
        accessibilityLabel="Open Profile"
      >
        <Text style={[styles.avatarText, { color: colors.buttonTextDark }]}>A</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 6,
    width: '100%',
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
