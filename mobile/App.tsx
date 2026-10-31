import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Animated, AccessibilityInfo } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, MessageSquare, Calendar, CheckSquare, Settings as SettingsIcon } from 'lucide-react-native';
import { ThemeManager, ThemeProvider, useTheme, ThemeColors } from './src/theme/colors';
import { NavigationTab, VoiceState, AutonomousTask } from './src/types';
import { AgentEngine, INITIAL_EMAILS, MOCK_FLIGHT, MOCK_RESUME } from './src/services/agentEngine';
import { VoiceService } from './src/services/voiceService';
import { VoiceHomeScreen } from './src/screens/VoiceHomeScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthorizationModal } from './src/components/AuthorizationModal';
import { RoadblockModal } from './src/components/RoadblockModal';
import { SplashScreen } from './src/components/SplashScreen';

function MainApp() {
  const insets = useSafeAreaInsets();
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isSplashComplete, setIsSplashComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('assistant');
  const [previousTab, setPreviousTab] = useState<NavigationTab>('assistant');

  const handleOpenProfile = () => {
    VoiceService.triggerHaptic('light');
    setPreviousTab(activeTab);
    setActiveTab('profile');
  };
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [responsePreview, setResponsePreview] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRoadblockModalOpen, setIsRoadblockModalOpen] = useState<boolean>(false);

  // Initial tasks
  const [tasks, setTasks] = useState<AutonomousTask[]>([
    {
      id: 'task-init-flight',
      type: 'flight_book',
      title: 'Delta Flight Check-In',
      description: 'Flight #DL 1482 • Check-in security code authorization needed.',
      createdAt: '12 mins ago',
      status: 'needs_approval',
      steps: [
        { id: 's1', stepNumber: 1, agent: 'Supervisor', tool: 'Router', action: 'Assigned to Travel Agent', status: 'completed', timestamp: '00:01' },
        { id: 's2', stepNumber: 2, agent: 'TravelAgent', tool: 'DeltaPortal', action: 'Navigated to boarding pass check-in', status: 'completed', timestamp: '00:03' },
        { id: 's3', stepNumber: 3, agent: 'SafetyGate', tool: 'HumanApproval', action: 'Paused for 6-digit SMS verification', status: 'running', timestamp: '00:05' },
      ],
      flightData: MOCK_FLIGHT,
    },
  ]);

  const [activeTask, setActiveTask] = useState<AutonomousTask | null>(tasks[0]);

  useEffect(() => {
    return () => {
      VoiceService.stop();
    };
  }, []);

  const handleStopSpeech = () => {
    VoiceService.stop();
    setVoiceState('IDLE');
  };

  const handleProcessQuery = async (queryText: string, isFromVoice = false) => {
    setTranscript(queryText);
    setVoiceState('PROCESSING');
    VoiceService.triggerHaptic('medium');

    await new Promise(resolve => setTimeout(resolve, 800));

    const result = await AgentEngine.processVoiceQuery(queryText);
    setResponsePreview(result.spokenText);

    if (result.task) {
      setActiveTask(result.task);
      setTasks(prev => [result.task!, ...prev]);
    }

    if (result.spokenText) {
      setVoiceState('SPEAKING');
      VoiceService.speak(result.spokenText, {
        rate: 1.0,
        onDone: () => setVoiceState('IDLE'),
      });
    } else {
      setVoiceState('IDLE');
    }
  };

  const handleOrbPress = () => {
    if (voiceState === 'SPEAKING') {
      handleStopSpeech();
      return;
    }

    if (voiceState === 'LISTENING') {
      setVoiceState('PROCESSING');
      handleProcessQuery(transcript || 'Give me list mails whose need to check once and important to me', true);
      return;
    }

    VoiceService.triggerHaptic('heavy');
    setVoiceState('LISTENING');
    setTranscript('Listening softly...');

    setTimeout(() => {
      setTranscript('Give me list mails whose need to check once and important to me');
      setTimeout(() => {
        handleProcessQuery('Give me list mails whose need to check once and important to me', true);
      }, 1200);
    }, 1600);
  };

  const handleTriggerQuickTask = (type: 'email' | 'flight' | 'resume') => {
    if (type === 'flight') {
      setIsRoadblockModalOpen(true);
      return;
    }
    let prompt = '';
    if (type === 'email') {
      prompt = 'Give me list mails whose need to check once and important to me';
    } else if (type === 'resume') {
      prompt = 'Update and modify my resume and store in drive';
    }
    handleProcessQuery(prompt, false);
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar style={themeName === 'midnight-day' ? 'dark' : 'light'} />

      {/* Main Screen View with themeKey to force instant re-render on theme change */}
      <View key={themeName} style={[styles.screenWrapper, { backgroundColor: colors.background }]}>
        {activeTab === 'assistant' && (
          <VoiceHomeScreen
            voiceState={voiceState}
            transcript={transcript}
            responsePreview={responsePreview}
            activeTask={activeTask}
            onOrbPress={handleOrbPress}
            onStopSpeech={handleStopSpeech}
            onSubmitQuery={(q) => handleProcessQuery(q, false)}
            selectedModelName="MIRAS AI"
            onDismissTask={() => setActiveTask(null)}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            onSwitchToVoice={() => setActiveTab('assistant')}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {activeTab === 'today' && (
          <TodayScreen
            onOpenProfile={handleOpenProfile}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            onTriggerTask={handleTriggerQuickTask}
            onOpenApprovalModal={() => setIsAuthModalOpen(true)}
            onOpenProfile={handleOpenProfile}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            onOpenProfile={handleOpenProfile}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            onBack={() => {
              setActiveTab(previousTab || 'assistant');
            }}
            onOpenSettings={() => {
              setPreviousTab('profile');
              setActiveTab('settings');
            }}
          />
        )}
      </View>

      {/* Non-overlapping Polished Animated Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: colors.cardBgSubtle,
            borderTopColor: colors.surfaceBorderSubtle,
            paddingBottom: Math.max(insets.bottom, 16) + 4,
          },
        ]}
      >
        {[
          { id: 'assistant' as NavigationTab, label: 'Assistant', Icon: Mic },
          { id: 'chat' as NavigationTab, label: 'Chat', Icon: MessageSquare },
          { id: 'today' as NavigationTab, label: 'Today', Icon: Calendar },
          { id: 'tasks' as NavigationTab, label: 'Tasks', Icon: CheckSquare },
          { id: 'settings' as NavigationTab, label: 'Settings', Icon: SettingsIcon },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              style={styles.navItem}
              onPress={() => {
                VoiceService.triggerHaptic('light');
                setActiveTab(tab.id);
              }}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <tab.Icon size={18} color={isActive ? colors.primary : colors.inactiveNav} />
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.navText,
                  { color: isActive ? colors.primary : colors.inactiveNav },
                  isActive && styles.navTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Delta Flight Check-in Authorization Sheet */}
      <AuthorizationModal
        visible={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onApprove={() => {
          setIsAuthModalOpen(false);
          setActiveTask(null);
        }}
      />

      {/* Task Details Video Replay & Roadblock Modal */}
      <RoadblockModal
        visible={isRoadblockModalOpen}
        onClose={() => setIsRoadblockModalOpen(false)}
        onApplySolution={() => {
          setIsRoadblockModalOpen(false);
          setActiveTask(null);
        }}
      />

      {/* Premium Mobile Splash Screen Animation */}
      {!isSplashComplete && (
        <SplashScreen onFinish={() => setIsSplashComplete(true)} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenWrapper: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgSubtle,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorderSubtle,
    paddingTop: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  navItem: {
    flex: 1,
    maxWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: colors.badgeBg,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
  },
  iconWrap: {
    padding: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    transform: [{ scale: 1.05 }],
  },
  navText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: colors.inactiveNav,
    marginTop: 2,
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
});
