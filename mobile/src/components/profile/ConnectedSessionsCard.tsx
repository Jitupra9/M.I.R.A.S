import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Smartphone, Laptop, LogOut } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface ConnectedSessionsCardProps {
  otherSessionsTerminated: boolean;
  onTerminateOtherSessions: () => void;
}

export const ConnectedSessionsCard: React.FC<ConnectedSessionsCardProps> = ({
  otherSessionsTerminated,
  onTerminateOtherSessions,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>CONNECTED DEVICES & SESSIONS</Text>
      </View>

      <View style={styles.sessionsCard}>
        {/* Current Device Session */}
        <View style={styles.sessionRow}>
          <View style={styles.sessionIconBox}>
            <Smartphone size={16} color={colors.primary} />
          </View>
          <View style={styles.sessionTextCol}>
            <Text style={styles.sessionDeviceName}>Pixel 8 Pro (This Phone)</Text>
            <Text style={styles.sessionDeviceSub}>Android 14 • MIRAS App v2.4 • Active Now</Text>
          </View>
          <View style={styles.sessionCurrentBadge}>
            <Text style={styles.sessionCurrentBadgeText}>THIS DEVICE</Text>
          </View>
        </View>

        {!otherSessionsTerminated && (
          <>
            <View style={styles.sessionDivider} />

            {/* Second Device Session */}
            <View style={styles.sessionRow}>
              <View style={[styles.sessionIconBox, { backgroundColor: 'rgba(6, 182, 212, 0.1)' }]}>
                <Laptop size={16} color="#06B6D4" />
              </View>
              <View style={styles.sessionTextCol}>
                <Text style={styles.sessionDeviceName}>MacBook Pro 16"</Text>
                <Text style={styles.sessionDeviceSub}>macOS Sonoma • Chrome Gateway • 18m ago</Text>
              </View>
              <View
                style={[
                  styles.sessionCurrentBadge,
                  {
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                    borderColor: 'rgba(6, 182, 212, 0.25)',
                  },
                ]}
              >
                <Text style={[styles.sessionCurrentBadgeText, { color: '#06B6D4' }]}>ONLINE</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.terminateSessionsBtn}
              onPress={onTerminateOtherSessions}
              activeOpacity={0.8}
            >
              <LogOut size={13} color={colors.textSecondary} />
              <Text style={styles.terminateSessionsBtnText}>Sign Out All Other Sessions</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionContainer: {
      gap: 8,
    },
    sectionHeaderRow: {
      paddingHorizontal: 2,
    },
    sectionHeaderTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.8,
    },
    sessionsCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      gap: 10,
    },
    sessionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    sessionIconBox: {
      width: 34,
      height: 34,
      borderRadius: 9,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    sessionTextCol: {
      flex: 1,
      minWidth: 0,
    },
    sessionDeviceName: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sessionDeviceSub: {
      fontSize: 10.5,
      color: colors.textSecondary,
      marginTop: 1,
    },
    sessionCurrentBadge: {
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 5,
      backgroundColor: 'rgba(16, 185, 129, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(16, 185, 129, 0.25)',
      flexShrink: 0,
    },
    sessionCurrentBadgeText: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primary,
    },
    sessionDivider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    terminateSessionsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginTop: 2,
    },
    terminateSessionsBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
