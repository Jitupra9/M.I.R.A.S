import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, MessageSquare, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ChatConversation } from '../../types/chat';
import { MirasLogo } from '../MirasLogo';

interface ChatHistorySidebarProps {
  visible: boolean;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onClose: () => void;
  onSelectConversation: (conversation: ChatConversation) => void;
  onNewChat: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  visible,
  conversations,
  activeConversationId,
  onClose,
  onSelectConversation,
  onNewChat,
}) => {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const drawerWidth = Math.min(310, Math.round(screenWidth * 0.8));
  const styles = useMemo(() => createStyles(colors, drawerWidth), [colors, drawerWidth]);

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(-drawerWidth);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth, slideAnim, backdropOpacity]);

  const handleAnimatedClose = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 190,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => handleAnimatedClose()}
    >
      <View style={styles.modalRoot}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => handleAnimatedClose()} />
        </Animated.View>

        {/* Left Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              paddingTop: Math.max(insets.top, 16) + 8,
              paddingBottom: Math.max(insets.bottom, 16),
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <MirasLogo size={20} glow glowColor={colors.primary} />
              <Text style={styles.drawerTitle}>Conversations</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => handleAnimatedClose()}
              activeOpacity={0.7}
              accessibilityLabel="Close Sidebar"
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* New Chat Button */}
          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={() => handleAnimatedClose(onNewChat)}
            activeOpacity={0.8}
          >
            <Plus size={18} color={colors.buttonTextDark} />
            <Text style={styles.newChatBtnText}>New Chat</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>PREVIOUS CONVERSATIONS</Text>

          {/* Conversation List */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {conversations.length === 0 ? (
              <Text style={styles.emptyText}>No previous conversations yet.</Text>
            ) : (
              conversations.map(conv => {
                const isActive = conv.id === activeConversationId;
                return (
                  <TouchableOpacity
                    key={conv.id}
                    style={[styles.convItem, isActive && styles.convItemActive]}
                    onPress={() => handleAnimatedClose(() => onSelectConversation(conv))}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.convIconWrap, isActive && styles.convIconWrapActive]}>
                      <MessageSquare
                        size={15}
                        color={isActive ? colors.primary : colors.textSecondary}
                      />
                    </View>
                    <View style={styles.convTextCol}>
                      <View style={styles.convTitleRow}>
                        <Text
                          numberOfLines={1}
                          style={[styles.convTitle, isActive && styles.convTitleActive]}
                        >
                          {conv.title}
                        </Text>
                        <Text style={styles.convTime}>{conv.updatedAt}</Text>
                      </View>
                      <Text numberOfLines={1} style={styles.convPreview}>
                        {conv.preview}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors, drawerWidth: number) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      flexDirection: 'row',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    drawer: {
      width: drawerWidth,
      height: '100%',
      backgroundColor: colors.cardBgSubtle,
      borderRightWidth: 1,
      borderRightColor: colors.surfaceBorder,
      paddingHorizontal: 16,
      elevation: 24,
      shadowColor: '#000',
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    drawerTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    newChatBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 11,
      paddingHorizontal: 14,
      marginBottom: 20,
    },
    newChatBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    sectionLabel: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.9,
      marginBottom: 10,
    },
    listScroll: {
      flex: 1,
    },
    listContent: {
      gap: 8,
      paddingBottom: 24,
    },
    emptyText: {
      fontSize: 12.5,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 24,
    },
    convItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 11,
      borderRadius: 12,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    convItemActive: {
      backgroundColor: colors.badgeBg,
      borderColor: colors.primaryBorder,
    },
    convIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 9,
      backgroundColor: colors.cardBgElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    convIconWrapActive: {
      backgroundColor: colors.cardBg,
    },
    convTextCol: {
      flex: 1,
    },
    convTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },
    convTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    convTitleActive: {
      color: colors.primary,
    },
    convTime: {
      fontSize: 10,
      color: colors.textMuted,
    },
    convPreview: {
      fontSize: 11.5,
      color: colors.textSecondary,
      marginTop: 3,
    },
  });
