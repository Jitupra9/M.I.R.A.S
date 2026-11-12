import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Modal,
  AccessibilityInfo,
  useWindowDimensions,
  Keyboard,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageSquare, Calendar, CheckSquare, Settings as SettingsIcon } from 'lucide-react-native';
import {
  ThemeManager,
  ThemeProvider,
  ThemeOverrideProvider,
  useTheme,
  ThemeColors,
  ThemeName,
  ThemeTransitionOrigin,
  MIDNIGHT_THEME,
  MIDNIGHT_DAY_THEME,
} from './src/theme/colors';
import { NavigationTab, VoiceState, AutonomousTask } from './src/types';
import { AgentEngine, MOCK_FLIGHT } from './src/services/agentEngine';
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
import { FloatingAssistantButton } from './src/components/FloatingAssistantButton';

const ASSISTANT_MODE_STORAGE_KEY = 'miras_assistant_mode_v1';

const getSavedAssistantMode = (): boolean => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(ASSISTANT_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
  return false;
};

interface SharedAppState {
  isSplashComplete: boolean;
  setIsSplashComplete: (v: boolean) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  previousTab: NavigationTab;
  setPreviousTab: (tab: NavigationTab) => void;
  assistantModeEnabled: boolean;
  handleToggleAssistantMode: (val: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (v: boolean) => void;
  isKeyboardVisible: boolean;
  voiceState: VoiceState;
  transcript: string;
  responsePreview: string;
  tasks: AutonomousTask[];
  activeTask: AutonomousTask | null;
  setActiveTask: (t: AutonomousTask | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;
  isRoadblockModalOpen: boolean;
  setIsRoadblockModalOpen: (v: boolean) => void;
  handleOpenProfile: () => void;
  handleStopSpeech: () => void;
  handleProcessQuery: (queryText: string, isFromVoice?: boolean) => Promise<void>;
  handleOrbPress: () => void;
  handleTriggerQuickTask: (type: 'email' | 'flight' | 'resume') => void;
}

function MainAppContent({
  state,
  isTransitionLayer = false,
}: {
  state: SharedAppState;
  isTransitionLayer?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { colors, themeName } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    isSplashComplete,
    setIsSplashComplete,
    activeTab,
    setActiveTab,
    previousTab,
    setPreviousTab,
    assistantModeEnabled,
    handleToggleAssistantMode,
    isAssistantOpen,
    setIsAssistantOpen,
    isKeyboardVisible,
    voiceState,
    transcript,
    responsePreview,
    tasks,
    setActiveTask,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isRoadblockModalOpen,
    setIsRoadblockModalOpen,
    handleOpenProfile,
    handleStopSpeech,
    handleProcessQuery,
    handleOrbPress,
    handleTriggerQuickTask,
  } = state;

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 10) }]}>
      {!isTransitionLayer && <StatusBar style={themeName === 'midnight-day' ? 'dark' : 'light'} />}

      {/* Main Screen View */}
      <View style={[styles.screenWrapper, { backgroundColor: colors.background }]}>
        {activeTab === 'chat' && (
          <ChatScreen
            onSwitchToVoice={() => {
              if (assistantModeEnabled) {
                setIsAssistantOpen(true);
              }
            }}
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
            assistantModeEnabled={assistantModeEnabled}
            onToggleAssistantMode={handleToggleAssistantMode}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            onBack={() => {
              setActiveTab(previousTab === 'assistant' ? 'chat' : previousTab || 'chat');
            }}
            onOpenSettings={() => {
              setPreviousTab('profile');
              setActiveTab('settings');
            }}
          />
        )}
      </View>

      {/* Bottom Navigation Bar (Chat, Today, Tasks, Settings) - hidden while keyboard is open */}
      {!isKeyboardVisible && (
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
      )}

      {/* Movable Floating Assistant Button (shown when Assistant Mode is ON) */}
      {assistantModeEnabled && !isAssistantOpen && isSplashComplete && !isKeyboardVisible && (
        <FloatingAssistantButton onPress={() => setIsAssistantOpen(true)} />
      )}

      {!isTransitionLayer && (
        <>
          {/* Assistant & Current Conversation Overlay Modal */}
          <Modal
            visible={isAssistantOpen}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setIsAssistantOpen(false)}
          >
            <View
              style={[
                styles.rootContainer,
                { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 10) },
              ]}
            >
              <VoiceHomeScreen
                voiceState={voiceState}
                transcript={transcript}
                responsePreview={responsePreview}
                onOrbPress={handleOrbPress}
                onStopSpeech={handleStopSpeech}
                onSubmitQuery={(q) => handleProcessQuery(q, false)}
                selectedModelName="MIRAS AI"
                onDismissTask={() => setActiveTask(null)}
                onOpenProfile={() => {
                  setIsAssistantOpen(false);
                  handleOpenProfile();
                }}
                onClose={() => setIsAssistantOpen(false)}
              />
            </View>
          </Modal>

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
        </>
      )}
    </View>
  );
}

function AppWithTransitions() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
  const width = containerSize?.width ?? windowWidth;
  const height = containerSize?.height ?? windowHeight;
  const [isSplashComplete, setIsSplashComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('chat');
  const [previousTab, setPreviousTab] = useState<NavigationTab>('chat');
  const [assistantModeEnabled, setAssistantModeEnabled] = useState<boolean>(getSavedAssistantMode);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [responsePreview, setResponsePreview] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRoadblockModalOpen, setIsRoadblockModalOpen] = useState<boolean>(false);

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

  const handleOpenProfile = useCallback(() => {
    VoiceService.triggerHaptic('light');
    setPreviousTab(activeTab);
    setActiveTab('profile');
  }, [activeTab]);

  const handleToggleAssistantMode = useCallback((val: boolean) => {
    setAssistantModeEnabled(val);
    if (!val) {
      setIsAssistantOpen(false);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(ASSISTANT_MODE_STORAGE_KEY, String(val));
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const handleStopSpeech = useCallback(() => {
    VoiceService.stop();
    setVoiceState('IDLE');
  }, []);

  const handleProcessQuery = useCallback(async (queryText: string) => {
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
  }, []);

  const handleOrbPress = useCallback(() => {
    if (voiceState === 'SPEAKING') {
      handleStopSpeech();
      return;
    }

    if (voiceState === 'LISTENING') {
      setVoiceState('PROCESSING');
      handleProcessQuery(transcript || 'Give me list mails whose need to check once and important to me');
      return;
    }

    VoiceService.triggerHaptic('heavy');
    setVoiceState('LISTENING');
    setTranscript('Listening softly...');

    setTimeout(() => {
      setTranscript('Give me list mails whose need to check once and important to me');
      setTimeout(() => {
        handleProcessQuery('Give me list mails whose need to check once and important to me');
      }, 1200);
    }, 1600);
  }, [voiceState, transcript, handleStopSpeech, handleProcessQuery]);

  const handleTriggerQuickTask = useCallback((type: 'email' | 'flight' | 'resume') => {
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
    handleProcessQuery(prompt);
  }, [handleProcessQuery]);

  const sharedState: SharedAppState = {
    isSplashComplete,
    setIsSplashComplete,
    activeTab,
    setActiveTab,
    previousTab,
    setPreviousTab,
    assistantModeEnabled,
    handleToggleAssistantMode,
    isAssistantOpen,
    setIsAssistantOpen,
    isKeyboardVisible,
    voiceState,
    transcript,
    responsePreview,
    tasks,
    activeTask,
    setActiveTask,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isRoadblockModalOpen,
    setIsRoadblockModalOpen,
    handleOpenProfile,
    handleStopSpeech,
    handleProcessQuery,
    handleOrbPress,
    handleTriggerQuickTask,
  };

  // Circular reveal theme transition state
  const [themeTransition, setThemeTransition] = useState<{
    targetTheme: ThemeName;
    origin: ThemeTransitionOrigin;
  } | null>(null);
  const radiusAnim = useRef(new Animated.Value(0)).current;
  const isTransitioningRef = useRef(false);

  const handleRequestThemeTransition = useCallback(
    async (nextTheme: ThemeName, origin?: ThemeTransitionOrigin) => {
      if (ThemeManager.getTheme() === nextTheme || isTransitioningRef.current) {
        return;
      }

      let reduceMotion = false;
      try {
        reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      } catch {
        reduceMotion = false;
      }

      if (reduceMotion) {
        ThemeManager.setTheme(nextTheme);
        return;
      }

      const resolvedOrigin: ThemeTransitionOrigin = origin ?? {
        x: width / 2,
        y: height / 2,
      };

      const maxRadius =
        Math.hypot(
          Math.max(resolvedOrigin.x, width - resolvedOrigin.x),
          Math.max(resolvedOrigin.y, height - resolvedOrigin.y)
        ) + 24;

      isTransitioningRef.current = true;
      radiusAnim.setValue(0);
      setThemeTransition({ targetTheme: nextTheme, origin: resolvedOrigin });

      Animated.timing(radiusAnim, {
        toValue: maxRadius,
        duration: 620,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        ThemeManager.setTheme(nextTheme);
        setThemeTransition(null);
        isTransitioningRef.current = false;
      });
    },
    [width, height, radiusAnim]
  );

  const targetColors =
    themeTransition?.targetTheme === 'midnight-day' ? MIDNIGHT_DAY_THEME : MIDNIGHT_THEME;

  return (
    <ThemeProvider onRequestTransition={handleRequestThemeTransition}>
      <View
        style={overlayStyles.container}
        onLayout={(e) => {
          const { width: w, height: h } = e.nativeEvent.layout;
          if (w > 0 && h > 0) {
            setContainerSize(prev => (prev && prev.width === w && prev.height === h ? prev : { width: w, height: h }));
          }
        }}
      >
        <MainAppContent state={sharedState} />

        {themeTransition && (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                overlayStyles.revealCircle,
                {
                  left: Animated.subtract(themeTransition.origin.x, radiusAnim),
                  top: Animated.subtract(themeTransition.origin.y, radiusAnim),
                  width: Animated.multiply(radiusAnim, 2),
                  height: Animated.multiply(radiusAnim, 2),
                  borderRadius: radiusAnim,
                },
              ]}
            >
              <Animated.View
                style={[
                  overlayStyles.revealInner,
                  {
                    left: Animated.subtract(radiusAnim, themeTransition.origin.x),
                    top: Animated.subtract(radiusAnim, themeTransition.origin.y),
                    width,
                    height,
                  },
                ]}
              >
                <ThemeOverrideProvider themeName={themeTransition.targetTheme}>
                  <MainAppContent state={sharedState} isTransitionLayer />
                </ThemeOverrideProvider>
              </Animated.View>
            </Animated.View>
            <Animated.View
              pointerEvents="none"
              style={[
                overlayStyles.revealRing,
                {
                  left: Animated.subtract(themeTransition.origin.x, radiusAnim),
                  top: Animated.subtract(themeTransition.origin.y, radiusAnim),
                  width: Animated.multiply(radiusAnim, 2),
                  height: Animated.multiply(radiusAnim, 2),
                  borderRadius: radiusAnim,
                  borderColor: targetColors.primaryGlow,
                },
              ]}
            />
          </>
        )}
      </View>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppWithTransitions />
    </SafeAreaProvider>
  );
}

const overlayStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  revealCircle: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 999,
  },
  revealRing: {
    position: 'absolute',
    borderWidth: 1.5,
    zIndex: 1000,
  },
  revealInner: {
    position: 'absolute',
  },
});

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
