import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

import { ProfileScreenProps } from '../types/profile';
import { ProfileTopBar } from '../components/profile/ProfileTopBar';
import { UserIdentityCard } from '../components/profile/UserIdentityCard';
import { PlatformsAccordion } from '../components/profile/PlatformsAccordion';
import { ConnectedSessionsCard } from '../components/profile/ConnectedSessionsCard';
import { Security2faCard } from '../components/profile/Security2faCard';
import { PrivacyControlsCard } from '../components/profile/PrivacyControlsCard';

export type { ProfileScreenProps };

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onOpenSettings }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlatformsExpanded, setIsPlatformsExpanded] = useState(false);
  const [otherSessionsTerminated, setOtherSessionsTerminated] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportData = () => {
    VoiceService.triggerHaptic('medium');
    showToast('Exporting encrypted personal archive (JSON)...');
  };

  const handleResetMemory = () => {
    VoiceService.triggerHaptic('medium');
    showToast('Agent contextual recall memory cleared');
  };

  const handleTerminateOtherSessions = () => {
    VoiceService.triggerHaptic('medium');
    setOtherSessionsTerminated(true);
    showToast('Signed out of 1 other device session');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation Bar with Back Button and Settings Icon */}
      <ProfileTopBar onBack={onBack} onOpenSettings={onOpenSettings} />

      {/* Floating Status Toast */}
      {toastMessage && (
        <View style={styles.toast}>
          <CheckCircle2 size={14} color={colors.buttonTextDark} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* 1. USER PERSONAL IDENTITY & OWNER CARD */}
      <UserIdentityCard />

      {/* 2. ACCOUNT INTEGRATIONS ("Connect Platforms") */}
      <PlatformsAccordion
        isExpanded={isPlatformsExpanded}
        onToggleExpanded={() => setIsPlatformsExpanded((prev) => !prev)}
        onShowToast={showToast}
      />

      {/* 3. ACTIVE SESSIONS & CONNECTED DEVICES */}
      <ConnectedSessionsCard
        otherSessionsTerminated={otherSessionsTerminated}
        onTerminateOtherSessions={handleTerminateOtherSessions}
      />

      {/* 4. SECURITY & 2-FACTOR AUTHENTICATION */}
      <Security2faCard />

      {/* 5. PERSONAL VAULT & PRIVACY CONTROLS */}
      <PrivacyControlsCard
        onExportData={handleExportData}
        onResetMemory={handleResetMemory}
      />
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 40,
      gap: 16,
    },
    toast: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    toastText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.buttonTextDark,
    },
  });
