import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Platform,
  Animated,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import { ThemeColors, useTheme } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';
import { AppHeader } from '../components/AppHeader';
import { MirasLogo } from '../components/MirasLogo';

// Shared types and initial data
import {
  DetailViewItem,
  EmailSummaryItem,
  Message,
  ChatScreenProps,
  ChatConversation,
} from '../types/chat';
import { INITIAL_CONVERSATIONS, INITIAL_EMAILS_DATA } from '../data/chatData';

// Modular chat components
import { ChatMessageList } from '../components/chat/ChatMessageList';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { ChatHistorySidebar } from '../components/chat/ChatHistorySidebar';
import { AttachmentOptionsSheet } from '../components/chat/AttachmentOptionsSheet';
import { CameraScannerModal } from '../components/chat/CameraScannerModal';
import { DetailViewerModal } from '../components/chat/DetailViewerModal';

export const ChatScreen: React.FC<ChatScreenProps> = ({ onSwitchToVoice, onOpenProfile }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const keyboardTopRef = useRef<number | null>(null);
  const keyboardHeightRef = useRef<number>(0);
  const keyboardPaddingAnim = useRef(new Animated.Value(0)).current;

  const updateKeyboardOverlap = useCallback((duration = 180) => {
    const keyboardTop = keyboardTopRef.current;
    if (keyboardTop === null) {
      Animated.timing(keyboardPaddingAnim, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start();
      return;
    }

    const extraClearance = Platform.OS === 'android' ? insets.top + 12 : 6;

    if (containerRef.current && typeof containerRef.current.measureInWindow === 'function') {
      containerRef.current.measureInWindow((_x: number, y: number, _w: number, h: number) => {
        const baseOverlap =
          h > 0 ? Math.max(0, y + h - keyboardTop) : keyboardHeightRef.current;
        const targetPadding = baseOverlap + extraClearance;
        Animated.timing(keyboardPaddingAnim, {
          toValue: targetPadding,
          duration,
          useNativeDriver: false,
        }).start();
      });
    } else {
      Animated.timing(keyboardPaddingAnim, {
        toValue: keyboardHeightRef.current + extraClearance,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [keyboardPaddingAnim, insets.top]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const kbHeight = e.endCoordinates?.height ?? 0;
      const kbTop =
        e.endCoordinates?.screenY && e.endCoordinates.screenY > 0
          ? e.endCoordinates.screenY
          : Dimensions.get('window').height - kbHeight;

      keyboardTopRef.current = kbTop;
      keyboardHeightRef.current = kbHeight;
      updateKeyboardOverlap(e.duration && e.duration > 0 ? e.duration : 180);
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      keyboardTopRef.current = null;
      keyboardHeightRef.current = 0;
      updateKeyboardOverlap(e?.duration && e.duration > 0 ? e.duration : 180);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [updateKeyboardOverlap]);

  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [detailModalItem, setDetailModalItem] = useState<DetailViewItem | null>(null);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Real Camera & Scanner States
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<any>(null);
  const mediaStreamRef = useRef<any>(null);

  const [selectedScanAction, setSelectedScanAction] = useState<'ideas' | 'translate' | 'extract' | null>(null);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);

  // Keep active conversation synced in history sidebar
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    const firstUserMsg = messages.find(m => m.sender === 'user');

    if (activeConversationId === null) {
      const newId = `conv-${Date.now()}`;
      const rawTitle = firstUserMsg?.text || 'New Conversation';
      const title = rawTitle.length > 34 ? `${rawTitle.slice(0, 34)}...` : rawTitle;
      const newConv: ChatConversation = {
        id: newId,
        title,
        preview: lastMsg.text,
        updatedAt: lastMsg.time || 'Just now',
        messages,
      };
      setActiveConversationId(newId);
      setConversations(prev => [newConv, ...prev]);
    } else {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                preview: lastMsg.text,
                updatedAt: lastMsg.time || conv.updatedAt,
                messages,
              }
            : conv
        )
      );
    }
  }, [messages, activeConversationId]);

  const handleSelectConversation = (conv: ChatConversation) => {
    VoiceService.triggerHaptic('light');
    setActiveConversationId(conv.id);
    setMessages(conv.messages);
  };

  const handleNewChat = () => {
    VoiceService.triggerHaptic('light');
    setActiveConversationId(null);
    setMessages([]);
    setInputText('');
  };

  // Scanning laser beam animated value
  const scanLaserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanningAnimation) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLaserAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(scanLaserAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      scanLaserAnim.stopAnimation();
      scanLaserAnim.setValue(0);
    }
  }, [isScanningAnimation]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    VoiceService.triggerHaptic('light');

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      const lower = newMsg.text.toLowerCase();
      let replyText = `I have received: "${newMsg.text}". Taking care of this right away.`;
      let cardType: Message['cardType'] = undefined;
      let emailData: Message['emailData'] = undefined;
      let flightData: Message['flightData'] = undefined;
      let billData: Message['billData'] = undefined;

      if (lower.includes('mail') || lower.includes('email') || lower.includes('inbox')) {
        replyText = "Here are your 3 most important emails requiring attention. Tap 'See More' to expand full details:";
        cardType = 'email_list';
        emailData = {
          title: 'Priority Inbox Triage (3 Mails)',
          items: INITIAL_EMAILS_DATA,
        };
      } else if (lower.includes('flight') || lower.includes('chicago') || lower.includes('airline') || lower.includes('book')) {
        replyText = "I found your Delta flight #DL 1482 to Chicago. Check-in is paused waiting for your security authorization:";
        cardType = 'flight_card';
        flightData = {
          airline: 'Delta Air Lines',
          flightNumber: 'DL 1482',
          departureCity: 'New York (JFK)',
          arrivalCity: 'Chicago (ORD)',
          departureTime: '04:30 PM Today',
          arrivalTime: '06:25 PM Today (Non-stop)',
          seat: '12F (Preferred Window)',
          terminal: 'Terminal 4',
          gate: 'Gate B22',
          price: '$214.00 (Confirmed)',
          baggage: '1 Carry-on included • Personal item stowed',
          status: 'Check-In Paused for SMS Code',
        };
      } else if (lower.includes('screenshot') || lower.includes('bill') || lower.includes('coned')) {
        replyText = "Here is the parsed statement from your electricity provider. Total due: $142.50.";
        cardType = 'electricity_bill';
        billData = {
          company: 'ConEdison Statement',
          dueDate: 'Due Oct 24 • Cycle: Sep 12 - Oct 11',
          amount: '$142.50',
          usageDiff: '+18%\nAC heatwave week',
          rateDiff: '+$12.00\nSeasonal clean fuel fee',
          paid: false,
        };
      }

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'mira',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardType,
        isExpanded: false,
        emailData,
        flightData,
        billData,
      };

      setMessages(prev => [...prev, reply]);
    }, 600);
  };

  const handleOpenPdfDetails = (pdfData?: any) => {
    VoiceService.triggerHaptic('light');
    setDetailModalItem({
      type: 'pdf',
      title: pdfData?.name || 'ConEd_Oct11_Statement.pdf',
      subtitle: pdfData?.sub || 'Verified ConEdison Utility Bill • 2 Pages',
      badgeText: 'PDF',
      statementData: {
        company: 'CON EDISON OF NEW YORK',
        dueDate: 'DUE OCT 24, 2026',
        account: 'Account: 984-2104-11 • Alex Morgan',
        totalAmount: '$142.50',
        lineItems: [
          { desc: 'Electricity Supply (482 kWh @ $0.1419)', price: '$68.40' },
          { desc: 'Delivery & Infrastructure Transmission', price: '$48.10' },
          { desc: 'Clean Energy & Renewable Transition Fee', price: '$12.00' },
          { desc: 'NYC City & State Sales Taxes', price: '$14.00' },
        ],
        whyHigherText:
          'Temperatures averaged 86°F during the Sep 18–25 heatwave, increasing air conditioning compressor runtime by 4.2 hours daily.',
      },
    });
  };

  const handleOpenEmailDetails = (email: EmailSummaryItem) => {
    VoiceService.triggerHaptic('light');
    setDetailModalItem({
      type: 'email',
      title: email.subject,
      subtitle: `From: ${email.sender} (${email.senderEmail})`,
      badgeText: 'EMAIL',
      emailData: {
        subject: email.subject,
        sender: email.sender,
        senderEmail: email.senderEmail,
        recipient: email.recipient || 'Alex Morgan <alex.morgan@workspace.io>',
        dateTime: email.date || `Today • ${email.time}`,
        priority: email.priority,
        actionRequired: email.actionRequired,
        summary: email.summary,
        fullBody: email.fullBody,
        attachments: email.attachments || [
          { name: 'Document_Attachment.pdf', size: '1.8 MB', type: 'application/pdf' },
        ],
        links: email.links || [
          { label: 'View in Workspace Portal', url: 'https://mail.workspace.io' },
        ],
      },
    });
  };

  const toggleMessageExpand = (msgId: string) => {
    VoiceService.triggerHaptic('light');
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isExpanded: !m.isExpanded } : m))
    );
  };

  const handlePayBill = (msgId: string) => {
    VoiceService.triggerHaptic('success');
    setMessages(prev =>
      prev.map(m => (m.id === msgId && m.billData ? { ...m, billData: { ...m.billData, paid: true } } : m))
    );
  };

  const handleAttachDocument = () => {
    setIsAttachmentSheetOpen(false);
    VoiceService.triggerHaptic('medium');

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.doc,.docx,.txt,.csv,image/*';
      fileInput.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        const sizeInMb = file.size / (1024 * 1024);
        const sizeStr = sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
        const isImage = file.type.startsWith('image/');

        const attachedMsg: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: `Attached file: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardType: 'pdf_attachment',
          attachmentData: {
            name: file.name,
            sub: `${file.type.toUpperCase() || 'DOCUMENT'} • ${sizeStr}`,
            isImage,
            realFile: file,
          },
        };

        setMessages(prev => [...prev, attachedMsg]);

        setTimeout(() => {
          const reply: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'mira',
            text: `Document "${file.name}" (${sizeStr}) received and indexed. Ready for questions, summarization, or translation.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, reply]);
        }, 700);
      };
      fileInput.click();
    }
  };

  const handleRemoveAttachment = (msgId: string) => {
    VoiceService.triggerHaptic('light');
    setMessages(prev => prev.filter(m => m.id !== msgId));
  };

  // Camera Management
  const handleSetVideoRef = (element: any) => {
    videoRef.current = element;
    if (element && mediaStreamRef.current) {
      if (element.srcObject !== mediaStreamRef.current) {
        element.srcObject = mediaStreamRef.current;
      }
      element.play().catch(() => {});
    }
  };

  const startCamera = async (targetFacing?: 'user' | 'environment') => {
    const facing = targetFacing || cameraFacing;
    setCameraCaptured(false);
    setCapturedImageUri(null);
    setCameraError(null);
    setCameraInitializing(true);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track: any) => track.stop());
          mediaStreamRef.current = null;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      } catch (err: any) {
        console.warn('Camera getUserMedia error:', err);
        setCameraError(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera permission denied. Please allow camera access in browser settings.'
            : 'Camera hardware is busy, disconnected, or unavailable on this device.'
        );
      } finally {
        setCameraInitializing(false);
      }
    } else {
      setCameraError('Camera API is not supported on this device or platform.');
      setCameraInitializing(false);
    }
  };

  const handleToggleCameraFacing = () => {
    VoiceService.triggerHaptic('medium');
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track: any) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleOpenCameraModal = () => {
    setIsAttachmentSheetOpen(false);
    VoiceService.triggerHaptic('medium');
    setSelectedScanAction(null);
    setIsScanningAnimation(false);
    setIsCameraModalOpen(true);
    startCamera();
  };

  const handleCloseCameraModal = () => {
    stopCamera();
    setIsCameraModalOpen(false);
    setCameraCaptured(false);
    setCapturedImageUri(null);
    setCameraError(null);
  };

  const handleCapturePhoto = () => {
    VoiceService.triggerHaptic('heavy');
    if (videoRef.current && typeof document !== 'undefined') {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const realPhotoUri = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedImageUri(realPhotoUri);
          setCameraCaptured(true);
          stopCamera();
          return;
        }
      } catch (e) {
        console.warn('Canvas capture fallback', e);
      }
    }

    // Fallback if running headless/no webcam: draw simulated document receipt canvas
    if (typeof document !== 'undefined') {
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 640;
      fallbackCanvas.height = 480;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#060E0A';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#00FFA3';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('CON EDISON STATEMENT / SCAN CAPTURE', 40, 80);
        ctx.fillStyle = '#A0AEC0';
        ctx.font = '16px monospace';
        ctx.fillText('Captured: ' + new Date().toLocaleTimeString(), 40, 120);
        ctx.fillText('Document Type: Verified Utility Bill', 40, 160);
        ctx.fillText('Amount: $142.50 • Ref #984210', 40, 200);
        ctx.fillStyle = '#00E599';
        ctx.fillRect(40, 230, 200, 4);
      }
      const dataUrl = fallbackCanvas.toDataURL('image/jpeg', 0.9);
      setCapturedImageUri(dataUrl);
      setCameraCaptured(true);
      stopCamera();
    }
  };

  const handleRetakePhoto = () => {
    VoiceService.triggerHaptic('light');
    setCameraCaptured(false);
    setCapturedImageUri(null);
    setSelectedScanAction(null);
    startCamera();
  };

  const handleProcessScanAction = (action: 'ideas' | 'translate' | 'extract') => {
    setSelectedScanAction(action);
    setIsScanningAnimation(true);
    VoiceService.triggerHaptic('medium');

    setTimeout(() => {
      setIsScanningAnimation(false);
      handleCloseCameraModal();

      let actionLabel = 'Scan & Get Ideas';
      let title = 'Smart Document Ideas & Insights';
      let bullets = [
        'Receipt total of $48.20 matches corporate dinner policy limit.',
        'Tax deduction eligible under Travel & Entertainment Expense.',
        'Suggested action: Auto-submit to Expensify expense report.',
      ];
      let translatedText: string | undefined = undefined;

      if (action === 'translate') {
        actionLabel = 'Translate Content';
        title = 'Language Translation & OCR';
        translatedText = 'English Translation: "Official Lease Addendum: Rent locked through 2027. Monthly maintenance waived."';
        bullets = [
          'Detected Source Language: French (99% confidence)',
          'Translated accurately without formatting loss',
          'Legal terms preserved for contractual review',
        ];
      } else if (action === 'extract') {
        actionLabel = 'Extract & Summarize';
        title = 'Data OCR & Itemized Extraction';
        bullets = [
          'Vendor: Greenwood Bistro & Cafe (#GW-9821)',
          'Date: Today • 12:45 PM',
          'Items: 2 Lunch Specials, Mineral Water, Tax & Gratuity',
          'Total Charged: $48.20 (Chase Sapphire • #4012)',
        ];
      }

      const userScanMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `📸 Scanned image with Camera [${actionLabel}]`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const miraScanMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'mira',
        text: `I finished scanning your photo. Here is the structured breakdown:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cardType: 'camera_scan',
        isExpanded: true,
        scanData: {
          actionType: action,
          actionLabel,
          title,
          detectedText: 'GREENWOOD CAFE & BISTRO • 142 MAIN ST • TOTAL $48.20',
          insights: bullets,
          translatedText,
          imageThumbnail: capturedImageUri || '📷 Document Receipt Snapshot',
        },
      };

      setMessages(prev => [...prev, userScanMsg, miraScanMsg]);
    }, 1400);
  };

  const handleMicPress = () => {
    if (inputText.trim()) {
      handleSend();
    } else {
      VoiceService.triggerHaptic('heavy');
      setInputText("Give me list mails whose need to check once and important to me");
    }
  };

  return (
    <Animated.View
      ref={containerRef}
      collapsable={false}
      onLayout={() => {
        if (keyboardTopRef.current !== null) {
          updateKeyboardOverlap(120);
        }
      }}
      style={[styles.container, { paddingBottom: keyboardPaddingAnim }]}
    >
      {/* Top Header */}
      <AppHeader
        onOpenProfile={onOpenProfile || (() => setIsProfileOpen(true))}
        onOpenSidebar={() => {
          VoiceService.triggerHaptic('light');
          setIsSidebarOpen(true);
        }}
      />

      {/* Messages Feed or Empty Chat Welcome */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyLogoRing}>
            <MirasLogo size={38} glow glowColor={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>How can I help you today?</Text>
          <Text style={styles.emptySubtitle}>
            Start a fresh conversation or open the sidebar menu to continue a previous chat.
          </Text>
          <View style={styles.quickPromptsWrap}>
            {[
              'Check priority emails',
              'Check my electricity bill',
              'Check Delta flight status',
            ].map(prompt => (
              <TouchableOpacity
                key={prompt}
                style={styles.quickPromptChip}
                onPress={() => handleSend(prompt)}
                activeOpacity={0.75}
              >
                <Text style={styles.quickPromptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <ChatMessageList
          messages={messages}
          onToggleExpand={toggleMessageExpand}
          onPayBill={handlePayBill}
          onOpenPdfDetails={handleOpenPdfDetails}
          onOpenEmailDetails={handleOpenEmailDetails}
          onRemoveAttachment={handleRemoveAttachment}
        />
      )}

      {/* Bottom Message Input Bar */}
      <ChatInputBar
        inputText={inputText}
        onChangeText={setInputText}
        onSend={() => handleSend()}
        onMicPress={handleMicPress}
        onOpenAttachmentSheet={() => {
          VoiceService.triggerHaptic('light');
          setIsAttachmentSheetOpen(true);
        }}
      />

      {/* Attachment Options Sheet */}
      <AttachmentOptionsSheet
        visible={isAttachmentSheetOpen}
        onClose={() => setIsAttachmentSheetOpen(false)}
        onScanWithCamera={handleOpenCameraModal}
        onUploadDocument={handleAttachDocument}
      />

      {/* High-Tech Camera & AI Image Scanner Viewfinder Modal */}
      <CameraScannerModal
        visible={isCameraModalOpen}
        cameraCaptured={cameraCaptured}
        capturedImageUri={capturedImageUri}
        cameraError={cameraError}
        cameraInitializing={cameraInitializing}
        cameraFacing={cameraFacing}
        isScanningAnimation={isScanningAnimation}
        selectedScanAction={selectedScanAction}
        scanLaserAnim={scanLaserAnim}
        onSetVideoRef={handleSetVideoRef}
        onClose={handleCloseCameraModal}
        onToggleFacing={handleToggleCameraFacing}
        onRetryCamera={() => startCamera()}
        onCapturePhoto={handleCapturePhoto}
        onRetakePhoto={handleRetakePhoto}
        onProcessScanAction={handleProcessScanAction}
      />

      {/* Shared Document & Email Details Viewer Modal */}
      <DetailViewerModal
        item={detailModalItem}
        onClose={() => setDetailModalItem(null)}
        onDraftReply={(sender) => {
          setDetailModalItem(null);
          setInputText(`Draft a polite response to ${sender}...`);
        }}
        onSchedulePayment={() => {
          setDetailModalItem(null);
        }}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Previous Conversations Sidebar Drawer */}
      <ChatHistorySidebar
        visible={isSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onClose={() => setIsSidebarOpen(false)}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
    </Animated.View>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
    },
    emptyLogoRing: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.badgeBg,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    emptySubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 19,
    },
    quickPromptsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
      marginTop: 20,
    },
    quickPromptChip: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      borderRadius: 16,
      paddingHorizontal: 13,
      paddingVertical: 8,
    },
    quickPromptText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
  });
};
