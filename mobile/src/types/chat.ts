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

export interface EmailSummaryItem {
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

export interface BillData {
  company: string;
  dueDate: string;
  amount: string;
  usageDiff: string;
  rateDiff: string;
  paid?: boolean;
}

export interface AttachmentData {
  name: string;
  sub: string;
  fileUrl?: string;
  isImage?: boolean;
  realFile?: any;
}

export interface FlightData {
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
}

export interface ScanData {
  actionType: 'ideas' | 'translate' | 'extract';
  actionLabel: string;
  title: string;
  detectedText: string;
  insights: string[];
  translatedText?: string;
  imageThumbnail: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'mira';
  text: string;
  time: string;
  cardType?: 'electricity_bill' | 'pdf_attachment' | 'email_list' | 'flight_card' | 'camera_scan';
  isExpanded?: boolean;
  billData?: BillData;
  attachmentData?: AttachmentData;
  emailData?: {
    title: string;
    items: EmailSummaryItem[];
  };
  flightData?: FlightData;
  scanData?: ScanData;
}

export interface ChatScreenProps {
  onSwitchToVoice?: () => void;
  onOpenProfile?: () => void;
}
