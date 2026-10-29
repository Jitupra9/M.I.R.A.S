import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated,
  Image,
} from 'react-native';
import {
  Send,
  Mic,
  Plus,
  Camera,
  Paperclip,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  X,
  FileText,
  Image as ImageIcon,
  Download,
  Share2,
  Calendar,
  Plane,
  Mail,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Sparkles,
  Languages,
  ScanText,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react-native';
import { COLORS, ThemeColors, useTheme } from '../theme/colors';
import { VoiceService } from '../services/voiceService';
import { ProfileModal } from '../components/ProfileModal';
import { MirasLogo } from '../components/MirasLogo';
import { AppHeader } from '../components/AppHeader';

export interface DetailViewItem {
  type: 'pdf' | 'email';
  title: string;
  subtitle: string;
  badgeText: string;
  statementData?: {
    company: string;
    dueDate: string;
    account: string;
    totalAmount: string;
    lineItems: Array<{ desc: string; price: string }>;
    whyHigherText?: string;
  };
  emailData?: {
    subject: string;
    sender: string;
    senderEmail: string;
    recipient: string;
    dateTime: string;
    priority: 'URGENT' | 'HIGH' | 'NORMAL';
    actionRequired: string;
    summary: string;
    fullBody: string;
    attachments?: Array<{ name: string; size: string; type?: string }>;
    links?: Array<{ label: string; url: string }>;
  };
}

interface EmailSummaryItem {
  id: string;
  sender: string;
  senderEmail: string;
  recipient?: string;
  date?: string;
  subject: string;
  time: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  summary: string;
  fullBody: string;
  actionRequired: string;
  attachments?: Array<{ name: string; size: string; type?: string }>;
  links?: Array<{ label: string; url: string }>;
  isExpanded?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'mira';
  text: string;
  time: string;
  cardType?: 'electricity_bill' | 'pdf_attachment' | 'email_list' | 'flight_card' | 'camera_scan';
  isExpanded?: boolean; // For "See More / See Less"
  billData?: {
    company: string;
    dueDate: string;
    amount: string;
    usageDiff: string;
    rateDiff: string;
    paid?: boolean;
  };
  attachmentData?: {
    name: string;
    sub: string;
    fileUrl?: string;
    isImage?: boolean;
    realFile?: any;
  };
  emailData?: {
    title: string;
    items: EmailSummaryItem[];
  };
  flightData?: {
    airline: string;
    flightNumber: string;
    departureCity: string;
    arrivalCity: string;
    departureTime: string;
    arrivalTime: string;
    seat: string;
    terminal: string;
    gate: string;
    price: string;
    baggage: string;
    status: string;
  };
  scanData?: {
    actionType: 'ideas' | 'translate' | 'extract';
    actionLabel: string;
    title: string;
    detectedText: string;
    insights: string[];
    translatedText?: string;
    imageThumbnail: string;
  };
}

const INITIAL_EMAILS_DATA: EmailSummaryItem[] = [
  {
    id: 'e1',
    sender: 'Delta Airlines Check-In',
    senderEmail: 'ticket-notifications@delta.com',
    recipient: 'Alex Morgan <alex.morgan@workspace.io>',
    date: 'Today • 8:42 AM',
    subject: 'Action Required: Check-in open for Flight #DL 1482 to Chicago',
    time: '8:42 AM',
    priority: 'URGENT',
    summary: 'Online boarding passes ready. 6-digit SMS approval needed.',
    fullBody: 'Dear Alex, your flight DL 1482 departs JFK at 4:30 PM today from Terminal 4, Gate B22. To complete FAA mobile boarding pass issuance, please confirm the SMS security code dispatched to your verified device.',
    actionRequired: 'Provide 6-digit SMS code to authorize boarding pass download.',
    attachments: [
      { name: 'Flight_DL1482_E-Ticket.pdf', size: '320 KB', type: 'application/pdf' },
    ],
    links: [
      { label: 'Delta Mobile Check-In Portal', url: 'https://delta.com/checkin' },
    ],
    isExpanded: false,
  },
  {
    id: 'e2',
    sender: 'Beacon Residential Mgmt',
    senderEmail: 'leasing@beaconproperties.com',
    recipient: 'Alex Morgan <alex.morgan@workspace.io>',
    date: 'Yesterday • 2:15 PM',
    subject: 'Lease Renewal Offer: 12-Month Extension Option',
    time: 'Yesterday',
    priority: 'HIGH',
    summary: 'Rent locked at $2,450/mo. Response requested by Nov 1.',
    fullBody: 'Hi Alex, we are pleased to offer you a lease extension for Unit 4B at your current preferential rate of $2,450/month with no maintenance fee increases. Please review the addendum attached.',
    actionRequired: 'Review renewal contract terms and indicate decision.',
    attachments: [
      { name: 'Lease_Addendum_Unit4B_2027.pdf', size: '1.2 MB', type: 'application/pdf' },
    ],
    links: [
      { label: 'Tenant Resident Portal', url: 'https://beaconproperties.com/portal' },
    ],
    isExpanded: false,
  },
  {
    id: 'e3',
    sender: 'Apex Partners Legal',
    senderEmail: 'contracts@apexpartners.io',
    recipient: 'Alex Morgan <alex.morgan@workspace.io>',
    date: 'Oct 16, 2026 • 11:30 AM',
    subject: 'Countersignature Needed: Q4 Product Advisory Agreement',
    time: 'Oct 16',
    priority: 'NORMAL',
    summary: 'Client executed agreement. Ready for your final signature.',
    fullBody: 'Alex, Apex Partners has approved all redlines for the Q4 Voice Interface Advisory agreement. Both parties agree on standard bi-weekly milestone disbursements.',
    actionRequired: 'Sign via DocuSign or authorize MIRAS Drive storage.',
    attachments: [
      { name: 'Advisory_Agreement_Executed.pdf', size: '890 KB', type: 'application/pdf' },
    ],
    links: [
      { label: 'DocuSign Signatures', url: 'https://docusign.net' },
    ],
    isExpanded: false,
  },
];

const INITIAL_CHAT: Message[] = [
  {
    id: '1',
    sender: 'user',
    text: "Can you check my electricity bill from the email and explain why it's higher than last month?",
    time: '10:42 AM',
  },
  {
    id: '2',
    sender: 'mira',
    text: "I found your latest bill from ConEdison ($142.50). Here is a breakdown of what changed:",
    time: '10:42 AM',
    cardType: 'electricity_bill',
    isExpanded: false,
    billData: {
      company: 'ConEdison Statement',
      dueDate: 'Due Oct 24 • Cycle: Sep 12 - Oct 11',
      amount: '$142.50',
      usageDiff: '+18%\nAC heatwave week',
      rateDiff: '+$12.00\nSeasonal clean fuel fee',
      paid: false,
    },
  },
  {
    id: '3',
    sender: 'user',
    text: "Great, please schedule payment for Friday.",
    time: '10:43 AM',
  },
  {
    id: '4',
    sender: 'mira',
    text: "All set! Scheduled for Friday, Oct 18. Attached statement is archived below:",
    time: '10:43 AM',
    cardType: 'pdf_attachment',
    attachmentData: {
      name: 'ConEd_Oct11_Statement.pdf',
      sub: 'Attached statement from bill • 142 KB',
    },
  },
];

interface ChatScreenProps {
  onSwitchToVoice?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onSwitchToVoice }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_CHAT);
  const [inputText, setInputText] = useState('');
  const [detailModalItem, setDetailModalItem] = useState<DetailViewItem | null>(null);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Real Camera & Scanner States (Item 2A)
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraCaptured, setCameraCaptured] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraInitializing, setCameraInitializing] = useState(false);
  const videoRef = useRef<any>(null);
  const mediaStreamRef = useRef<any>(null);

  const [selectedScanAction, setSelectedScanAction] = useState<'ideas' | 'translate' | 'extract' | null>(null);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);

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
      // Note: Voice is silenced in quiet chat per User Rule #8
    }, 600);
  };

  // Open Shared Details Modal for PDF (Item 1)
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

  // Open Shared Details Modal for Email (Item 1 - Replaces inline expansion)
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

  // Toggle See More / See Less on cards
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

  // Real Native Document Picker (Item 2B)
  const handleAttachDocument = () => {
    setIsAttachmentSheetOpen(false);
    VoiceService.triggerHaptic('medium');

    if (typeof document !== 'undefined') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      // Support PDF, Images, DOC, DOCX, TXT, CSV
      fileInput.accept = 'application/pdf,image/*,.doc,.docx,.txt,.csv';
      fileInput.onchange = (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        // Validation: file size limit 25MB
        if (file.size > 25 * 1024 * 1024) {
          alert('File size exceeds the 25 MB limit.');
          return;
        }

        const sizeStr =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(0)} KB`;

        const isImg = file.type?.startsWith('image/');
        let fileUrl: string | undefined = undefined;
        if (isImg && typeof URL !== 'undefined') {
          fileUrl = URL.createObjectURL(file);
        }

        const userDocMsg: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: `Uploaded document: ${file.name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardType: 'pdf_attachment',
          attachmentData: {
            name: file.name,
            sub: `${sizeStr} • ${file.type || 'Verified Document'}`,
            fileUrl,
            isImage: isImg,
            realFile: file,
          },
        };
        setMessages(prev => [...prev, userDocMsg]);

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

  // Camera Management (Item 2A)
  const startCamera = async () => {
    setCameraCaptured(false);
    setCapturedImageUri(null);
    setCameraError(null);
    setCameraInitializing(true);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
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
            ? 'Camera permission denied. Please allow camera permissions in browser settings.'
            : 'Camera hardware is busy, disconnected, or unavailable on this device.'
        );
      } finally {
        setCameraInitializing(false);
      }
    } else {
      setCameraError('Camera API is not supported on this browser or platform.');
      setCameraInitializing(false);
    }
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

  // Run AI Action on Captured Image (Ideas, Translate, Extract) (Item 3c)
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

      // Append user's photo scan message
      const userScanMsg: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `📸 Scanned image with Camera [${actionLabel}]`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Append MIRAs rich scan analysis card
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Unified Top Header */}
      <AppHeader onOpenProfile={() => setIsProfileOpen(true)} />

      {/* Messages Feed */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.msgRow, isUser ? styles.userRow : styles.miraRow]}>
              <View style={[styles.msgBubble, isUser ? styles.userBubble : styles.miraBubble]}>
                <Text style={styles.msgText}>{item.text}</Text>

                {/* 1. Interactive Electricity Bill Breakdown Card with See More / See Less (Item 10a) */}
                {item.cardType === 'electricity_bill' && item.billData && (
                  <View style={styles.billCard}>
                    <View style={styles.billHeader}>
                      <View style={styles.billTitleGroup}>
                        <Zap size={16} color={colors.primary} />
                        <View>
                          <Text style={styles.billTitle}>{item.billData.company}</Text>
                          <Text style={styles.billDue}>{item.billData.dueDate}</Text>
                        </View>
                      </View>
                      <Text style={styles.billAmount}>{item.billData.amount}</Text>
                    </View>

                    {/* Expand/Collapse Toggle Button (Item 10a) */}
                    <TouchableOpacity
                      style={styles.expandToggleBtn}
                      onPress={() => toggleMessageExpand(item.id)}
                    >
                      {item.isExpanded ? (
                        <>
                          <EyeOff size={13} color={colors.primary} />
                          <Text style={styles.expandToggleText}>See Less Details</Text>
                        </>
                      ) : (
                        <>
                          <Eye size={13} color={colors.primary} />
                          <Text style={styles.expandToggleText}>See More (Full Explanation & PDF)</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {/* Collapsible Details */}
                    {item.isExpanded && (
                      <View style={styles.expandedContentBox}>
                        <View style={styles.diffCols}>
                          <View style={styles.diffBox}>
                            <Text style={styles.diffLabel}>Electric usage</Text>
                            <Text style={styles.diffValueGreen}>↗ +18%</Text>
                            <Text style={styles.diffSub}>AC heatwave week</Text>
                          </View>

                          <View style={styles.diffBox}>
                            <Text style={styles.diffLabel}>Rate adjustment</Text>
                            <Text style={styles.diffValueNeutral}>+$12.00</Text>
                            <Text style={styles.diffSub}>Seasonal fuel fee</Text>
                          </View>
                        </View>

                        <View style={styles.whyHigherInline}>
                          <Text style={styles.whyHigherInlineTitle}>💡 Bill Explanation</Text>
                          <Text style={styles.whyHigherInlineText}>
                            Temperatures averaged 86°F during Sep 18–25, increasing compressor cooling runtime by 4.2 hours daily.
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.payBtn, item.billData.paid && styles.payBtnDone]}
                          onPress={() => handlePayBill(item.id)}
                        >
                          <CheckCircle2 size={15} color={colors.buttonTextDark} />
                          <Text style={styles.payBtnText}>
                            {item.billData.paid ? 'Payment Scheduled ✓' : `Pay this bill (${item.billData.amount})`}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.snapshotBtn}
                          onPress={() => {
                            VoiceService.triggerHaptic('light');
                            handleOpenPdfDetails();
                          }}
                        >
                          <Eye size={13} color={colors.textSecondary} />
                          <Text style={styles.snapshotBtnText}>Show ConEd PDF Snapshot</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {/* 2. Interactive Important Emails Triage Card with Expand/Collapse (Item 10a & 10c) */}
                {item.cardType === 'email_list' && item.emailData && (
                  <View style={styles.emailListCard}>
                    <View style={styles.emailListHeader}>
                      <Mail size={16} color={colors.primary} />
                      <Text style={styles.emailListTitle}>{item.emailData.title}</Text>
                    </View>

                    {item.emailData.items.map(email => (
                      <View key={email.id} style={styles.emailItemRow}>
                        <View style={styles.emailItemTop}>
                          <View style={styles.emailPriorityTag}>
                            <Text style={styles.emailPriorityText}>{email.priority}</Text>
                          </View>
                          <Text style={styles.emailSender}>{email.sender}</Text>
                          <Text style={styles.emailTime}>{email.time}</Text>
                        </View>

                        <Text style={styles.emailSubject}>{email.subject}</Text>
                        <Text style={styles.emailSummary}>{email.summary}</Text>

                        {/* See More opens the Document/Email Details Component (Item 1 - No inline expansion) */}
                        <TouchableOpacity
                          style={styles.emailSeeMoreBtn}
                          onPress={() => handleOpenEmailDetails(email)}
                        >
                          <Eye size={12} color={colors.primary} />
                          <Text style={styles.emailSeeMoreText}>See more</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* 3. Interactive Flight Booking Card with See More / See Less (Item 10c) */}
                {item.cardType === 'flight_card' && item.flightData && (
                  <View style={styles.flightCard}>
                    <View style={styles.flightHeader}>
                      <View style={styles.flightAirlineGroup}>
                        <Plane size={16} color={colors.primary} />
                        <View>
                          <Text style={styles.flightAirlineText}>{item.flightData.airline} #{item.flightData.flightNumber}</Text>
                          <Text style={styles.flightRouteText}>{item.flightData.departureCity} ➔ {item.flightData.arrivalCity}</Text>
                        </View>
                      </View>
                      <View style={styles.flightPricePill}>
                        <Text style={styles.flightPriceText}>{item.flightData.price}</Text>
                      </View>
                    </View>

                    {/* See More Toggle */}
                    <TouchableOpacity
                      style={styles.expandToggleBtn}
                      onPress={() => toggleMessageExpand(item.id)}
                    >
                      {item.isExpanded ? (
                        <>
                          <EyeOff size={13} color={colors.primary} />
                          <Text style={styles.expandToggleText}>See Less Details</Text>
                        </>
                      ) : (
                        <>
                          <Eye size={13} color={colors.primary} />
                          <Text style={styles.expandToggleText}>See More (Seats, Terminal & Gate)</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    {item.isExpanded && (
                      <View style={styles.expandedContentBox}>
                        <View style={styles.flightDetailsGrid}>
                          <View style={styles.flightGridCol}>
                            <Text style={styles.flightGridLabel}>DEPARTURE</Text>
                            <Text style={styles.flightGridVal}>{item.flightData.departureTime}</Text>
                            <Text style={styles.flightGridSub}>{item.flightData.terminal} • {item.flightData.gate}</Text>
                          </View>
                          <View style={styles.flightGridCol}>
                            <Text style={styles.flightGridLabel}>ARRIVAL</Text>
                            <Text style={styles.flightGridVal}>{item.flightData.arrivalTime}</Text>
                            <Text style={styles.flightGridSub}>Assigned: {item.flightData.seat}</Text>
                          </View>
                        </View>

                        <View style={styles.baggageNoteBox}>
                          <Text style={styles.baggageNoteText}>🧳 {item.flightData.baggage}</Text>
                        </View>

                        <View style={styles.flightStatusBadge}>
                          <View style={styles.amberDot} />
                          <Text style={styles.flightStatusBadgeText}>{item.flightData.status}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}

                {/* 4. Scanned Camera Image & AI Analysis Card (Item 3c) */}
                {item.cardType === 'camera_scan' && item.scanData && (
                  <View style={styles.scanResultCard}>
                    <View style={styles.scanResultHeader}>
                      <Sparkles size={16} color={colors.primary} />
                      <Text style={styles.scanResultTitle}>{item.scanData.title}</Text>
                      <View style={styles.scanActionBadge}>
                        <Text style={styles.scanActionBadgeText}>{item.scanData.actionLabel}</Text>
                      </View>
                    </View>

                    {/* Image Thumbnail Bar */}
                    <View style={styles.scanThumbnailBox}>
                      <Camera size={14} color={colors.primary} />
                      <Text style={styles.scanThumbnailText}>{item.scanData.imageThumbnail}</Text>
                      <Text style={styles.scanOcrText}>• Verified High-Res OCR</Text>
                    </View>

                    {/* Translation Box if present */}
                    {item.scanData.translatedText && (
                      <View style={styles.translationBox}>
                        <Languages size={15} color={colors.primary} />
                        <Text style={styles.translationText}>{item.scanData.translatedText}</Text>
                      </View>
                    )}

                    {/* Structured Key Insights */}
                    <View style={styles.insightsList}>
                      {item.scanData.insights.map((insight, idx) => (
                        <View key={idx} style={styles.insightBulletRow}>
                          <Check size={12} color={colors.primary} style={{ marginTop: 2 }} />
                          <Text style={styles.insightBulletText}>{insight}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* 5. Attached Document File Chip */}
                {item.cardType === 'pdf_attachment' && item.attachmentData && (
                  <View style={styles.attachmentWrapper}>
                    <TouchableOpacity
                      style={styles.attachmentChip}
                      onPress={() => {
                        VoiceService.triggerHaptic('light');
                        handleOpenPdfDetails(item.attachmentData);
                      }}
                    >
                      <View style={styles.attachIcon}>
                        <Text style={styles.pdfText}>
                          {item.attachmentData.isImage ? 'IMG' : (item.attachmentData.name?.endsWith('.pdf') ? 'PDF' : 'DOC')}
                        </Text>
                      </View>
                      <View style={styles.attachCol}>
                        <Text style={styles.attachName} numberOfLines={1} ellipsizeMode="tail">
                          {item.attachmentData.name}
                        </Text>
                        <Text style={styles.attachSub} numberOfLines={1} ellipsizeMode="tail">
                          ✓ {item.attachmentData.sub} (Tap to view)
                        </Text>
                      </View>
                      <Eye size={14} color={colors.primary} style={styles.attachEyeIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeAttachmentChipBtn}
                      onPress={() => handleRemoveAttachment(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <X size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.timestamp}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom Message Input Bar (Camera button moved inside + menu per Item 3c) */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.plusMenuBtn}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            setIsAttachmentSheetOpen(true);
          }}
        >
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Message MIRAS..."
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />

        <TouchableOpacity style={styles.micSendBtn} onPress={handleMicPress}>
          {inputText.trim() ? (
            <Send size={15} color={colors.buttonTextDark} />
          ) : (
            <Mic size={16} color={colors.buttonTextDark} />
          )}
        </TouchableOpacity>
      </View>

      {/* Attachment Options Sheet (+ Menu) (Item 3b & 3c) */}
      <Modal visible={isAttachmentSheetOpen} transparent animationType="slide" onRequestClose={() => setIsAttachmentSheetOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.attachmentSheet}>
            <View style={styles.sheetTopRow}>
              <Text style={styles.sheetTitle}>Add Attachment</Text>
              <TouchableOpacity onPress={() => setIsAttachmentSheetOpen(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Option 1: Scan with Camera */}
            <TouchableOpacity style={styles.attachOption} onPress={handleOpenCameraModal}>
              <View style={styles.attachOptionIcon}>
                <Camera size={20} color={colors.primary} />
              </View>
              <View style={styles.attachOptionTextCol}>
                <Text style={styles.attachOptionTitle}>Scan with Camera</Text>
                <Text style={styles.attachOptionSub}>Take photo, translate text, or scan receipts & bills</Text>
              </View>
              <ArrowRight size={15} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Option 2: Upload Document (Supports PDF, Images, DOCX, TXT, CSV) */}
            <TouchableOpacity style={styles.attachOption} onPress={handleAttachDocument}>
              <View style={styles.attachOptionIcon}>
                <FileText size={20} color={colors.primary} />
              </View>
              <View style={styles.attachOptionTextCol}>
                <Text style={styles.attachOptionTitle}>Upload Document</Text>
                <Text style={styles.attachOptionSub}>Attach PDF, images, DOCX, TXT or reports for MIRAS to summarize</Text>
              </View>
              <ArrowRight size={15} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* High-Tech Camera & AI Image Scanner Viewfinder Modal (Item 2A) */}
      <Modal visible={isCameraModalOpen} transparent animationType="slide" onRequestClose={handleCloseCameraModal}>
        <View style={styles.cameraBackdrop}>
          <View style={styles.cameraContainer}>
            {/* Camera Header Bar */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={handleCloseCameraModal} style={styles.cameraIconBtn}>
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.cameraTitleBadge}>
                <View style={styles.cameraLiveDot} />
                <Text style={styles.cameraTitleText}>MIRAS Neural Vision</Text>
              </View>
              <TouchableOpacity style={styles.cameraIconBtn} onPress={startCamera}>
                <RotateCw size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Viewfinder Target Area */}
            <View style={styles.viewfinderFrame}>
              {/* Corner Brackets */}
              <View style={[styles.cornerBracket, styles.bracketTopLeft]} />
              <View style={[styles.cornerBracket, styles.bracketTopRight]} />
              <View style={[styles.cornerBracket, styles.bracketBottomLeft]} />
              <View style={[styles.cornerBracket, styles.bracketBottomRight]} />

              {/* Laser Scanning Animation Overlay */}
              {isScanningAnimation && (
                <Animated.View
                  style={[
                    styles.laserLine,
                    {
                      top: scanLaserAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['5%', '90%'],
                      }),
                    },
                  ]}
                />
              )}

              {/* Viewfinder Content */}
              {!cameraCaptured ? (
                cameraError ? (
                  <View style={styles.cameraErrorBox}>
                    <AlertCircle size={32} color="#FF5252" />
                    <Text style={styles.cameraErrorTitle}>Camera Access Required</Text>
                    <Text style={styles.cameraErrorText}>{cameraError}</Text>
                    <TouchableOpacity style={styles.retryCameraBtn} onPress={startCamera}>
                      <RotateCw size={14} color="#000000" />
                      <Text style={styles.retryCameraBtnText}>Retry Camera</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.liveFinderContent}>
                    {Platform.OS === 'web' && (
                      <video
                        ref={videoRef as any}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 12,
                        } as any}
                      />
                    )}
                    <View style={styles.liveFinderOverlay}>
                      <Camera size={36} color="rgba(0, 229, 153, 0.4)" />
                      <Text style={styles.finderGuideText}>
                        Align document, receipt, bill, or text inside frame
                      </Text>
                      <View style={styles.viewfinderModeTags}>
                        <Text style={styles.modeTagActive}>● Document</Text>
                        <Text style={styles.modeTag}>Translate</Text>
                        <Text style={styles.modeTag}>Object</Text>
                      </View>
                    </View>
                  </View>
                )
              ) : (
                <View style={styles.capturedPhotoPreview}>
                  {capturedImageUri ? (
                    <Image
                      source={{ uri: capturedImageUri }}
                      style={styles.capturedPhotoActual}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.simulatedDocPhoto}>
                      <Text style={styles.simulatedDocTitle}>CON EDISON / GREENWOOD STATEMENT</Text>
                      <Text style={styles.simulatedDocLine}>Date: Oct 2026 • Reference #98421</Text>
                      <Text style={styles.simulatedDocLine}>Total Amount Due: $142.50 / $48.20</Text>
                      <Text style={styles.simulatedDocLine}>Status: Ready for MIRAS AI Analysis</Text>
                    </View>
                  )}
                  <View style={styles.capturedPillBadge}>
                    <CheckCircle2 size={13} color="#00FFA3" />
                    <Text style={styles.capturedPillText}>Photo Captured</Text>
                  </View>
                </View>
              )}

              {/* Scanning Status HUD */}
              {isScanningAnimation && (
                <View style={styles.scanningHudBox}>
                  <Sparkles size={16} color={colors.primary} />
                  <Text style={styles.scanningHudText}>Scanning image & extracting neural tokens...</Text>
                </View>
              )}
            </View>

            {/* Bottom Controls */}
            {!cameraCaptured ? (
              <View style={styles.cameraShutterRow}>
                <TouchableOpacity
                  style={[styles.shutterRingOuter, !!cameraError && { opacity: 0.5 }]}
                  onPress={handleCapturePhoto}
                  disabled={!!cameraError}
                >
                  <View style={styles.shutterRingInner} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelCameraBtn}
                  onPress={handleCloseCameraModal}
                >
                  <Text style={styles.cancelCameraBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.aiActionChoicesContainer}>
                <Text style={styles.aiActionTitle}>What would you like MIRAS to do with this image?</Text>

                <View style={styles.aiActionGrid}>
                  {/* Choice 1: Scan & Get Ideas */}
                  <TouchableOpacity
                    style={[
                      styles.aiActionButton,
                      selectedScanAction === 'ideas' && styles.aiActionButtonSelected,
                    ]}
                    onPress={() => handleProcessScanAction('ideas')}
                  >
                    <Sparkles size={18} color={colors.primary} />
                    <View style={styles.aiActionCol}>
                      <Text style={styles.aiActionBtnTitle}>💡 Scan & Get Ideas</Text>
                      <Text style={styles.aiActionBtnSub}>Extract context & recommended next steps</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Choice 2: Translate Content */}
                  <TouchableOpacity
                    style={[
                      styles.aiActionButton,
                      selectedScanAction === 'translate' && styles.aiActionButtonSelected,
                    ]}
                    onPress={() => handleProcessScanAction('translate')}
                  >
                    <Languages size={18} color={colors.primary} />
                    <View style={styles.aiActionCol}>
                      <Text style={styles.aiActionBtnTitle}>🌐 Translate Content</Text>
                      <Text style={styles.aiActionBtnSub}>Detect language and translate text into English</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Choice 3: Extract & Summarize */}
                  <TouchableOpacity
                    style={[
                      styles.aiActionButton,
                      selectedScanAction === 'extract' && styles.aiActionButtonSelected,
                    ]}
                    onPress={() => handleProcessScanAction('extract')}
                  >
                    <ScanText size={18} color={colors.primary} />
                    <View style={styles.aiActionCol}>
                      <Text style={styles.aiActionBtnTitle}>📝 Extract & Summarize</Text>
                      <Text style={styles.aiActionBtnSub}>Itemize amounts, dates, tables & key bullets</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionChoiceBottomBtns}>
                  <TouchableOpacity
                    style={styles.retakeBtn}
                    onPress={handleRetakePhoto}
                  >
                    <RotateCw size={14} color={colors.primary} />
                    <Text style={styles.retakeBtnText}>Retake Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removePhotoBtn}
                    onPress={handleCloseCameraModal}
                  >
                    <X size={14} color={colors.textSecondary} />
                    <Text style={styles.removePhotoBtnText}>Remove Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Shared Document & Email Details Viewer Modal (Item 1 & Item 2) */}
      <Modal
        visible={!!detailModalItem}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalItem(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pdfSheet}>
            <View style={styles.pdfHeader}>
              <View style={styles.pdfTitleRow}>
                <View style={[styles.pdfBadgeIcon, detailModalItem?.type === 'email' && styles.emailBadgeIcon]}>
                  {detailModalItem?.type === 'email' ? (
                    <Mail size={16} color={colors.primary} />
                  ) : (
                    <Text style={styles.pdfBadgeIconText}>{detailModalItem?.badgeText || 'PDF'}</Text>
                  )}
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.pdfTitle} numberOfLines={1}>
                    {detailModalItem?.title}
                  </Text>
                  <Text style={styles.pdfSub} numberOfLines={1}>
                    {detailModalItem?.subtitle}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setDetailModalItem(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pdfScrollContent}>
              {/* Type 1: PDF Utility or Document Statement */}
              {detailModalItem?.type === 'pdf' && (
                <View style={styles.statementCard}>
                  <View style={styles.statementHeaderRow}>
                    <Text style={styles.statementOrg}>
                      {detailModalItem.statementData?.company || 'CON EDISON OF NEW YORK'}
                    </Text>
                    <Text style={styles.statementStatus}>
                      {detailModalItem.statementData?.dueDate ? `DUE ${detailModalItem.statementData.dueDate}` : 'DUE OCT 24, 2026'}
                    </Text>
                  </View>
                  <Text style={styles.statementAccount}>
                    {detailModalItem.statementData?.account || 'Account: 984-2104-11 • Alex Morgan'}
                  </Text>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL AMOUNT DUE</Text>
                    <Text style={styles.totalAmount}>
                      {detailModalItem.statementData?.totalAmount || '$142.50'}
                    </Text>
                  </View>

                  {(detailModalItem.statementData?.lineItems || [
                    { desc: 'Electricity Supply (482 kWh @ $0.1419)', price: '$68.40' },
                    { desc: 'Delivery & Infrastructure Transmission', price: '$48.10' },
                    { desc: 'Clean Energy & Renewable Transition Fee', price: '$12.00' },
                    { desc: 'NYC City & State Sales Taxes', price: '$14.00' },
                  ]).map((item, idx) => (
                    <View key={idx} style={styles.lineItem}>
                      <Text style={styles.lineDesc}>{item.desc}</Text>
                      <Text style={styles.linePrice}>{item.price}</Text>
                    </View>
                  ))}

                  <View style={styles.whyHigherBox}>
                    <Text style={styles.whyHigherTitle}>💡 Why is this bill 18% higher?</Text>
                    <Text style={styles.whyHigherText}>
                      {detailModalItem.statementData?.whyHigherText ||
                        'Temperatures averaged 86°F during the Sep 18–25 heatwave, increasing air conditioning compressor runtime by 4.2 hours daily.'}
                    </Text>
                  </View>

                  <View style={styles.pdfActionRow}>
                    <TouchableOpacity
                      style={styles.pdfActionBtn}
                      onPress={() => {
                        VoiceService.triggerHaptic('success');
                        setDetailModalItem(null);
                      }}
                    >
                      <Download size={15} color={colors.primary} />
                      <Text style={styles.pdfActionBtnText}>Download PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.pdfActionBtnPrimary}
                      onPress={() => {
                        VoiceService.triggerHaptic('success');
                        setDetailModalItem(null);
                      }}
                    >
                      <CheckCircle2 size={15} color={colors.buttonTextDark} />
                      <Text style={styles.pdfActionBtnPrimaryText}>Schedule Payment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Type 2: Email Details View (Item 1) */}
              {detailModalItem?.type === 'email' && detailModalItem.emailData && (
                <View style={styles.emailDetailWrapper}>
                  {/* Metadata Header Box */}
                  <View style={styles.emailMetaCard}>
                    <View style={styles.emailMetaRow}>
                      <Text style={styles.emailMetaLabel}>FROM:</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.emailMetaVal}>{detailModalItem.emailData.sender}</Text>
                        <Text style={styles.emailMetaSubVal}>{detailModalItem.emailData.senderEmail}</Text>
                      </View>
                      <View
                        style={[
                          styles.emailPriorityTagSmall,
                          detailModalItem.emailData.priority === 'URGENT'
                            ? styles.priorityUrgent
                            : styles.priorityHigh,
                        ]}
                      >
                        <Text style={styles.emailPriorityTagText}>
                          {detailModalItem.emailData.priority}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.emailMetaRow}>
                      <Text style={styles.emailMetaLabel}>TO:</Text>
                      <Text style={styles.emailMetaVal}>{detailModalItem.emailData.recipient}</Text>
                    </View>

                    <View style={styles.emailMetaRow}>
                      <Text style={styles.emailMetaLabel}>DATE:</Text>
                      <Text style={styles.emailMetaVal}>{detailModalItem.emailData.dateTime}</Text>
                    </View>
                  </View>

                  {/* Action Required Banner if present */}
                  {detailModalItem.emailData.actionRequired && (
                    <View style={styles.emailActionBoxModal}>
                      <AlertCircle size={15} color="#FFB800" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.emailActionBoxTitle}>Action Required</Text>
                        <Text style={styles.emailActionBoxText}>
                          {detailModalItem.emailData.actionRequired}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* AI Summary Box */}
                  {detailModalItem.emailData.summary && (
                    <View style={styles.emailSummaryCard}>
                      <View style={styles.summaryTitleRow}>
                        <Sparkles size={14} color={colors.primary} />
                        <Text style={styles.summaryTitleText}>MIRAS Executive Summary</Text>
                      </View>
                      <Text style={styles.summaryBodyText}>
                        {detailModalItem.emailData.summary}
                      </Text>
                    </View>
                  )}

                  {/* Full Email Body */}
                  <View style={styles.emailBodyCard}>
                    <Text style={styles.emailBodyHeader}>Subject: {detailModalItem.emailData.subject}</Text>
                    <Text style={styles.emailBodyContent}>
                      {detailModalItem.emailData.fullBody}
                    </Text>
                  </View>

                  {/* Attachments Section if available */}
                  {detailModalItem.emailData.attachments && detailModalItem.emailData.attachments.length > 0 && (
                    <View style={styles.attachmentsSection}>
                      <Text style={styles.attachmentsSectionHeader}>
                        Attachments ({detailModalItem.emailData.attachments.length})
                      </Text>
                      {detailModalItem.emailData.attachments.map((att, idx) => (
                        <View key={idx} style={styles.attachmentItemRow}>
                          <FileText size={16} color={colors.primary} />
                          <View style={{ flex: 1, marginHorizontal: 8 }}>
                            <Text style={styles.attachmentItemName}>{att.name}</Text>
                            <Text style={styles.attachmentItemSize}>{att.size}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.attachmentDownloadBtn}
                            onPress={() => VoiceService.triggerHaptic('light')}
                          >
                            <Download size={14} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Relevant Links if available */}
                  {detailModalItem.emailData.links && detailModalItem.emailData.links.length > 0 && (
                    <View style={styles.attachmentsSection}>
                      <Text style={styles.attachmentsSectionHeader}>Relevant Links</Text>
                      {detailModalItem.emailData.links.map((link, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.attachmentItemRow}
                          onPress={() => VoiceService.triggerHaptic('light')}
                        >
                          <ExternalLink size={15} color={colors.primary} />
                          <Text style={[styles.attachmentItemName, { color: colors.primary, flex: 1, marginHorizontal: 8 }]}>
                            {link.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Footer Actions */}
                  <View style={styles.pdfActionRow}>
                    <TouchableOpacity
                      style={styles.pdfActionBtnPrimary}
                      onPress={() => {
                        VoiceService.triggerHaptic('success');
                        setDetailModalItem(null);
                        setInputText(`Draft a polite response to ${detailModalItem.emailData?.sender}...`);
                      }}
                    >
                      <Sparkles size={15} color={colors.buttonTextDark} />
                      <Text style={styles.pdfActionBtnPrimaryText}>Draft Reply with MIRAS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.pdfActionBtn}
                      onPress={() => {
                        VoiceService.triggerHaptic('light');
                        setDetailModalItem(null);
                      }}
                    >
                      <Text style={styles.pdfActionBtnText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile & Settings Modal */}
      <ProfileModal visible={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  msgRow: {
    flexDirection: 'row',
    width: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  miraRow: {
    justifyContent: 'flex-start',
  },
  msgBubble: {
    maxWidth: '88%',
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
    boxSizing: 'border-box' as any,
  },
  userBubble: {
    backgroundColor: colors.userBubbleBg,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: colors.userBubbleBorder,
  },
  miraBubble: {
    backgroundColor: colors.cardBg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  msgText: {
    fontSize: 13.5,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  timestamp: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 6,
    alignSelf: 'flex-end',
  },

  // Expand / Collapse styles (Item 10a)
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  expandToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
  },
  expandedContentBox: {
    marginTop: 8,
    gap: 10,
  },

  // Electricity bill card
  billCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  billDue: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  diffCols: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 8,
  },
  diffLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  diffValueGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00FFA3',
    marginVertical: 2,
  },
  diffValueNeutral: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  diffSub: {
    fontSize: 9.5,
    color: colors.textSecondary,
  },
  whyHigherInline: {
    backgroundColor: 'rgba(0, 229, 153, 0.05)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.12)',
  },
  whyHigherInlineTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  whyHigherInlineText: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
  },
  payBtnDone: {
    backgroundColor: 'rgba(0, 229, 153, 0.2)',
  },
  payBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  snapshotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  snapshotBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  // Email List Card (Item 10a & 10c)
  emailListCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 10,
  },
  emailListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emailListTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emailItemRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 4,
  },
  emailItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emailPriorityTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  emailPriorityText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F59E0B',
  },
  emailSender: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  emailTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  emailSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emailSummary: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  emailSeeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  emailSeeMoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  emailExpandedBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    gap: 6,
  },
  emailFullBodyLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  emailFullBodyText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  emailActionBox: {
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.15)',
  },
  emailActionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primary,
  },

  // Flight Card (Item 10c)
  flightCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightAirlineGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flightAirlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flightRouteText: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 1,
  },
  flightPricePill: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  flightPriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  flightDetailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  flightGridCol: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 8,
    gap: 2,
  },
  flightGridLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
  },
  flightGridVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  flightGridSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  baggageNoteBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 8,
  },
  baggageNoteText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  flightStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  flightStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },

  // Scanned Camera Result Card (Item 3c)
  scanResultCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
    gap: 8,
  },
  scanResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanResultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  scanActionBadge: {
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scanActionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  scanThumbnailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    padding: 8,
  },
  scanThumbnailText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  scanOcrText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  translationBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0, 229, 153, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.15)',
  },
  translationText: {
    fontSize: 11.5,
    color: colors.textPrimary,
    lineHeight: 16,
    flex: 1,
  },
  insightsList: {
    gap: 6,
  },
  insightBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  insightBulletText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },

  // PDF attachment chip
  attachmentWrapper: {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    boxSizing: 'border-box' as any,
  },
  attachmentChip: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    boxSizing: 'border-box' as any,
  },
  attachIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pdfText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
  },
  attachCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  attachName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  attachSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  attachEyeIcon: {
    flexShrink: 0,
    marginLeft: 2,
  },
  removeAttachmentChipBtn: {
    flexShrink: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Bottom Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 8,
  },
  plusMenuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 13.5,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  micSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Backdrop
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },

  // Attachment Sheet (+ Menu)
  attachmentSheet: {
    backgroundColor: '#0A150F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
    gap: 12,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  attachOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  attachOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachOptionTextCol: {
    flex: 1,
  },
  attachOptionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  attachOptionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Camera Viewfinder Modal Styles (Item 3c)
  cameraBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cameraContainer: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#060E0A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
    overflow: 'hidden',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0A150F',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cameraIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cameraLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFA3',
  },
  cameraTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewfinderFrame: {
    height: 260,
    backgroundColor: '#050D09',
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.2)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00FFA3',
  },
  bracketTopLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  bracketTopRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bracketBottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bracketBottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00FFA3',
    shadowColor: '#00FFA3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    zIndex: 10,
  },
  liveFinderContent: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  finderGuideText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  viewfinderModeTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  modeTagActive: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modeTag: {
    fontSize: 11,
    color: colors.textMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  capturedPhotoPreview: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: 16,
  },
  simulatedDocPhoto: {
    width: '90%',
    backgroundColor: '#12231B',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
    gap: 4,
  },
  simulatedDocTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  simulatedDocLine: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  capturedPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 153, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  capturedPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00FFA3',
  },
  scanningHudBox: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(6, 14, 10, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.4)',
    zIndex: 20,
  },
  scanningHudText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  cameraShutterRow: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  shutterRingOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRingInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
  },
  aiActionChoicesContainer: {
    padding: 16,
    paddingTop: 4,
    gap: 10,
  },
  aiActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  aiActionGrid: {
    gap: 8,
  },
  aiActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  aiActionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
  },
  aiActionCol: {
    flex: 1,
  },
  aiActionBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  aiActionBtnSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  retakeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  retakeBtnText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // PDF Modal Viewer
  pdfSheet: {
    backgroundColor: '#0A150F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.25)',
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pdfTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pdfBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBadgeIconText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pdfSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pdfScrollContent: {
    paddingBottom: 16,
  },
  statementCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    marginBottom: 16,
  },
  statementHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statementOrg: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  statementStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  statementAccount: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  lineDesc: {
    fontSize: 11.5,
    color: colors.textSecondary,
  },
  linePrice: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  whyHigherBox: {
    backgroundColor: 'rgba(0, 229, 153, 0.06)',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.15)',
  },
  whyHigherTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  whyHigherText: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  pdfActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    paddingTop: 4,
  },
  pdfActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  pdfActionBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.primary,
  },
  pdfActionBtnPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  pdfActionBtnPrimaryText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  // Camera & Error styles
  webCameraVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 16,
  },
  liveFinderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cameraErrorBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cameraErrorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5252',
    textAlign: 'center',
  },
  cameraErrorText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  retryCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  retryCameraBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  capturedPhotoActual: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  cancelCameraBtn: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelCameraBtnText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  actionChoiceBottomBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  removePhotoBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  // Shared Detail Modal: Email styles
  emailBadgeIcon: {
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.3)',
  },
  emailDetailWrapper: {
    gap: 12,
  },
  emailMetaCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 8,
  },
  emailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emailMetaLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.textMuted,
    width: 48,
    letterSpacing: 0.5,
  },
  emailMetaVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emailMetaSubVal: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  emailPriorityTagSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityUrgent: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  priorityHigh: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  emailPriorityTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  emailActionBoxModal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  emailActionBoxTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 2,
  },
  emailActionBoxText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.textPrimary,
  },
  emailSummaryCard: {
    backgroundColor: 'rgba(0, 229, 153, 0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.2)',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryTitleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  summaryBodyText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  emailBodyCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  emailBodyHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  emailBodyContent: {
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  attachmentsSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
    gap: 8,
  },
  attachmentsSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  attachmentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  attachmentItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  attachmentItemSize: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  attachmentDownloadBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 229, 153, 0.1)',
  },
});
