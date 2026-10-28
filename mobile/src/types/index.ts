export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export type NavigationTab = 'assistant' | 'chat' | 'today' | 'tasks' | 'settings';

export interface EmailItem {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  receivedAt: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  summary: string;
  fullBody: string;
  actionRequired: string;
  keyPoints: string[];
  isRead: boolean;
}

export interface FlightDetails {
  id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  departureCode: string;
  arrivalCity: string;
  arrivalCode: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: string;
  cabinClass: string;
  seatAssigned?: string;
  bookingStatus: 'FOUND' | 'HOLDING_FARE' | 'CONFIRMED' | 'CANCELLED';
  hitlApprovalRequired: boolean;
  notes?: string;
}

export interface ResumeUpdateDetails {
  id: string;
  fileName: string;
  version: string;
  lastUpdated: string;
  targetRole: string;
  skillsAdded: string[];
  sectionsModified: string[];
  driveLocation: string;
  driveSynced: boolean;
  fileSize: string;
  highlights: string[];
}

export interface TaskStep {
  id: string;
  stepNumber: number;
  agent: string;
  tool: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface AutonomousTask {
  id: string;
  type: 'email_check' | 'flight_book' | 'resume_drive_sync' | 'system_action' | 'general';
  title: string;
  description: string;
  createdAt: string;
  status: 'running' | 'completed' | 'needs_approval' | 'failed';
  steps: TaskStep[];
  emailData?: EmailItem[];
  flightData?: FlightDetails;
  resumeData?: ResumeUpdateDetails;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'miras';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  widgetType?: 'emails' | 'flight' | 'resume' | 'task_timeline';
  widgetData?: any;
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
  speed: string;
  reasoning: string;
}
