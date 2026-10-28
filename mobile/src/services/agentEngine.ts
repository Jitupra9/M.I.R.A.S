import { EmailItem, FlightDetails, ResumeUpdateDetails, TaskStep, AutonomousTask } from '../types';

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'mail-1',
    sender: 'Dr. Sarah Lin (VP AI Engineering)',
    senderEmail: 'sarah.lin@cloudtech.ai',
    subject: 'URGENT: Multi-Agent Production Architecture Sign-off for Q4',
    receivedAt: '12 mins ago',
    priority: 'URGENT',
    summary: 'Needs your approval on the LangGraph state machine budget and latency threshold SLA before 5:00 PM today.',
    fullBody: 'Hi Team,\n\nWe have reviewed the MIRAS autonomous agent telemetry. The fallback loop latency is within 180ms, but we need your executive sign-off on the distributed MCP server allocation before we deploy to production.\n\nPlease verify the attached cloud benchmark report and confirm your go-ahead.\n\nBest,\nSarah',
    actionRequired: 'Verify cloud benchmark and approve deployment schedule.',
    keyPoints: [
      'Production deployment targeted for Friday.',
      'LangGraph multi-agent latency is well within 180ms threshold.',
      'Awaiting your confirmation on MCP server budget allocation.'
    ],
    isRead: false,
  },
  {
    id: 'mail-2',
    sender: 'Emirates Airline Skywards',
    senderEmail: 'reservations@emirates.com',
    subject: 'Action Needed: Your Flight Price Lock Expires in 3 Hours',
    receivedAt: '45 mins ago',
    priority: 'HIGH',
    summary: 'Fare lock on your upcoming round-trip itinerary is expiring. Total fare held: $842.',
    fullBody: 'Dear Traveler,\n\nYour fare reservation for EK 202 (Economy Flex Plus) has been temporarily held. Complete payment before 23:59 GMT to guarantee your seat and cabin baggage allowance.\n\nBooking Reference: MRAS-9941',
    actionRequired: 'Authorize payment or release the ticket hold.',
    keyPoints: [
      'Fare locked at $842 with 1 free date change.',
      'Hold expires at midnight.',
      'Confirmation reference ready: MRAS-9941.'
    ],
    isRead: false,
  },
  {
    id: 'mail-3',
    sender: 'Marcus Vance (Senior Talent Partner)',
    senderEmail: 'mvance@innovate-frontier.io',
    subject: 'Final Round Scheduling: Lead Autonomous Systems Engineer',
    receivedAt: '2 hours ago',
    priority: 'HIGH',
    summary: 'Executive interview panel invites you for the final system architecture discussion. Two slots open tomorrow.',
    fullBody: 'Hi,\n\nThe engineering leadership was thoroughly impressed with your MIRAS autonomous agent project and React Native interface architecture.\n\nWe would like to book a 45-minute discussion tomorrow at either 11:00 AM or 3:30 PM EST.\n\nLooking forward to speaking soon,\nMarcus',
    actionRequired: 'Reply with your preferred interview slot.',
    keyPoints: [
      'Final round interview invitation.',
      'Two available slots: 11:00 AM or 3:30 PM EST tomorrow.',
      'Specific interest in your multi-agent MCP tool integrations.'
    ],
    isRead: false,
  },
];

export const MOCK_FLIGHT: FlightDetails = {
  id: 'flight-774',
  airline: 'United Airlines (Star Alliance)',
  flightNumber: 'UA 892 • Boeing 787-9 Dreamliner',
  departureCity: 'San Francisco',
  departureCode: 'SFO',
  arrivalCity: 'New York',
  arrivalCode: 'JFK',
  departureDate: 'Tomorrow, Oct 28',
  departureTime: '08:30 AM',
  arrivalDate: 'Tomorrow, Oct 28',
  arrivalTime: '05:15 PM',
  duration: '5h 45m (Non-stop)',
  price: '$389',
  cabinClass: 'Economy Plus (Extra Legroom & Wi-Fi)',
  seatAssigned: '12F (Window)',
  bookingStatus: 'HOLDING_FARE',
  hitlApprovalRequired: true,
  notes: 'Playwright Browser MCP found lowest direct fare with complimentary carry-on.',
};

export const MOCK_RESUME: ResumeUpdateDetails = {
  id: 'resume-2026',
  fileName: 'Jitu_Lead_AI_Autonomous_Engineer_2026.pdf',
  version: 'v4.2 (Production Build)',
  lastUpdated: 'Just now',
  targetRole: 'Lead Autonomous AI & Full-Stack Systems Engineer',
  skillsAdded: [
    'LangGraph Multi-Agent Workflows',
    'Model Context Protocol (MCP)',
    'React Native (Expo SDK 58)',
    'Realtime Audio & Speech Synthesis',
    'Self-Healing Autonomous Web Automation',
    'Vector Memory & Knowledge Graph RAG',
  ],
  sectionsModified: [
    'Executive Summary: Positioned as Autonomous Systems Architect',
    'Key Projects: Added MIRAS Production Architecture & Cross-Platform Mobile App',
    'Core Competencies: Upgraded to cutting-edge 2026 AI Agent standards',
  ],
  driveLocation: '/Google Drive/Professional/Resumes/Jitu_AI_Lead_Resume_2026.pdf',
  driveSynced: true,
  fileSize: '348 KB',
  highlights: [
    'Exported high-res vector PDF format',
    'Auto-synced to Google Drive cloud with shareable link',
    'Matched 98% ATS score for Senior AI Engineer roles',
  ],
};

export interface AgentResponse {
  spokenText: string;
  chatText: string;
  widgetType?: 'emails' | 'flight' | 'resume' | 'task_timeline';
  widgetData?: any;
  task?: AutonomousTask;
}

export class AgentEngine {
  public static async processVoiceQuery(query: string): Promise<AgentResponse> {
    const q = query.toLowerCase().trim();

    // 1. Email check prompt: "give me list mails whose need to check once and important to me"
    if (
      q.includes('mail') ||
      q.includes('email') ||
      q.includes('inbox') ||
      q.includes('message')
    ) {
      if (q.includes('explain') || q.includes('what inside') || q.includes('detail')) {
        return {
          spokenText: 'I have analyzed your urgent emails. The top priority is from Doctor Sarah Lin requesting your sign-off on the LangGraph multi-agent deployment before five PM. Second is an Emirates flight hold expiring in three hours, and third is an interview invitation from Anthropic for Lead Autonomous Systems Engineer.',
          chatText: '📬 **Email Intelligence Briefing**\n\nHere is the detailed breakdown of the 3 important emails requiring your attention:\n\n1. **Dr. Sarah Lin (CloudTech AI)** — Needs Q4 Multi-Agent LangGraph sign-off today before 5:00 PM.\n2. **Emirates Airlines** — Fare lock of $842 expires in 3 hours. Reference: `MRAS-9941`.\n3. **Marcus Vance (Talent Partner)** — Final round interview invite with 2 open slots tomorrow.\n\nTap any card below to inspect full body or dictate a quick response.',
          widgetType: 'emails',
          widgetData: INITIAL_EMAILS,
          task: {
            id: 'task-email-explain-' + Date.now(),
            type: 'email_check',
            title: 'Email Triage & In-Depth Content Analysis',
            description: 'Analyzed 3 urgent emails via Google Workspace MCP and extracted required actions.',
            createdAt: 'Just now',
            status: 'completed',
            steps: [
              { id: '1', stepNumber: 1, agent: 'Supervisor', tool: 'Router', action: 'Classified intent to EmailAgent', status: 'completed', timestamp: '00:01' },
              { id: '2', stepNumber: 2, agent: 'EmailAgent', tool: 'WorkspaceMCP.get_unread', action: 'Filtered priority emails from VIP senders', status: 'completed', timestamp: '00:02' },
              { id: '3', stepNumber: 3, agent: 'PersonalKnowledgeAgent', tool: 'Summarizer', action: 'Synthesized bullet points and action items', status: 'completed', timestamp: '00:03' },
            ],
            emailData: INITIAL_EMAILS,
          }
        };
      }

      return {
        spokenText: 'You have three important emails that need your attention. One from Doctor Sarah Lin regarding multi-agent sign-off, one from Emirates regarding your flight price lock, and an interview invite from Marcus Vance. Would you like me to explain what is inside?',
        chatText: '📬 **Priority Mail Triage**\n\nI queried your inbox using Google Workspace MCP. Found **3 urgent emails** that need your review today:\n\n• **Dr. Sarah Lin** — Multi-Agent Architecture Sign-off (Urgent)\n• **Emirates Skywards** — Price Lock Expiring ($842)\n• **Marcus Vance** — Lead AI Engineer Final Round\n\nYou can ask: *"What inside that explain"* to hear the full breakdown, or tap below.',
        widgetType: 'emails',
        widgetData: INITIAL_EMAILS,
        task: {
          id: 'task-email-list-' + Date.now(),
          type: 'email_check',
          title: 'Priority Mail Triage Scan',
          description: 'Queried unread emails using Google Workspace MCP.',
          createdAt: 'Just now',
          status: 'completed',
          steps: [
            { id: '1', stepNumber: 1, agent: 'Supervisor', tool: 'Router', action: 'Delegated query to EmailAgent', status: 'completed', timestamp: '00:01' },
            { id: '2', stepNumber: 2, agent: 'EmailAgent', tool: 'WorkspaceMCP.list_urgent', action: 'Retrieved 3 high-priority threads', status: 'completed', timestamp: '00:02' },
          ],
          emailData: INITIAL_EMAILS,
        }
      };
    }

    // 2. Flight booking prompt: "go and book one flight ticket"
    if (
      q.includes('flight') ||
      q.includes('book ticket') ||
      q.includes('ticket') ||
      q.includes('plane') ||
      q.includes('travel')
    ) {
      return {
        spokenText: 'I initiated the travel booking agent. I found United Airlines flight 892 non-stop from San Francisco to New York for three hundred and eighty nine dollars. The fare is held and ready. As a safety measure, please confirm your authorization to charge your card.',
        chatText: '✈️ **Autonomous Flight Booking Agent (Playwright MCP)**\n\nI launched an automated browser session to find the best direct flight to New York:\n\n• **Flight**: United Airlines UA 892 (Boeing 787-9)\n• **Route**: SFO ✈️ JFK (Non-stop, 5h 45m)\n• **Timing**: Tomorrow, 08:30 AM → 05:15 PM\n• **Price**: **$389** (Held for 30 minutes)\n\n🛡️ **Human-in-the-Loop Safety Rule**: External financial transactions require user confirmation. Tap **"Authorize Payment"** below to finalize.',
        widgetType: 'flight',
        widgetData: MOCK_FLIGHT,
        task: {
          id: 'task-flight-' + Date.now(),
          type: 'flight_book',
          title: 'Autonomous Flight Search & Hold (SFO → JFK)',
          description: 'Searched 5 booking portals via Playwright Browser MCP and locked lowest rate.',
          createdAt: 'Just now',
          status: 'needs_approval',
          steps: [
            { id: '1', stepNumber: 1, agent: 'Supervisor', tool: 'Router', action: 'Routed to Web & Task Automation Agent', status: 'completed', timestamp: '00:01' },
            { id: '2', stepNumber: 2, agent: 'WebAgent', tool: 'PlaywrightMCP.open_session', action: 'Navigated to flight comparison portal', status: 'completed', timestamp: '00:03' },
            { id: '3', stepNumber: 3, agent: 'WebAgent', tool: 'PlaywrightMCP.fill_form', action: 'Selected SFO to JFK for tomorrow morning', status: 'completed', timestamp: '00:05' },
            { id: '4', stepNumber: 4, agent: 'WebAgent', tool: 'PlaywrightMCP.hold_seat', action: 'Selected Seat 12F (Window) & held fare', status: 'completed', timestamp: '00:07' },
            { id: '5', stepNumber: 5, agent: 'HITL Guard', tool: 'LangGraph.Interrupt', action: 'Paused workflow for user payment authorization', status: 'running', timestamp: '00:08' },
          ],
          flightData: MOCK_FLIGHT,
        }
      };
    }

    // 3. Resume update and Drive sync: "updage and modify my resume and store in drive"
    if (
      q.includes('resume') ||
      q.includes('cv') ||
      q.includes('drive') ||
      q.includes('google drive')
    ) {
      return {
        spokenText: 'I have updated your resume with your latest LangGraph multi-agent architecture and React Native mobile stack. The updated PDF has been compiled and saved to your Google Drive under Professional Resumes.',
        chatText: '📄 **Resume Modified & Synced to Google Drive**\n\nI dispatched the Career Agent and Google Drive MCP:\n\n• **Updated Sections**: Added LangGraph stateful loops, Model Context Protocol (MCP), and React Native cross-platform mobile app.\n• **Target Role**: Lead Autonomous AI & Full-Stack Systems Engineer\n• **Cloud Sync**: Uploaded to `Google Drive /Professional/Resumes/Jitu_AI_Lead_Resume_2026.pdf`\n• **ATS Benchmark**: 98% match rating with top MNC AI roles.\n\nYou can view the highlights and share link below.',
        widgetType: 'resume',
        widgetData: MOCK_RESUME,
        task: {
          id: 'task-resume-' + Date.now(),
          type: 'resume_drive_sync',
          title: 'Resume Modernization & Google Drive Cloud Sync',
          description: 'Updated skills, reformatted structure, and pushed version 4.2 to Google Drive.',
          createdAt: 'Just now',
          status: 'completed',
          steps: [
            { id: '1', stepNumber: 1, agent: 'Supervisor', tool: 'Router', action: 'Assigned to CareerAgent & OS Agent', status: 'completed', timestamp: '00:01' },
            { id: '2', stepNumber: 2, agent: 'CareerAgent', tool: 'DocModifier', action: 'Injected 2026 AI skills & project metrics', status: 'completed', timestamp: '00:04' },
            { id: '3', stepNumber: 3, agent: 'SystemAgent', tool: 'PDFCompiler', action: 'Generated ATS-optimized vector PDF (348 KB)', status: 'completed', timestamp: '00:06' },
            { id: '4', stepNumber: 4, agent: 'ServiceAgent', tool: 'DriveMCP.upload_file', action: 'Synchronized with Google Drive /Resumes/', status: 'completed', timestamp: '00:08' },
          ],
          resumeData: MOCK_RESUME,
        }
      };
    }

    // 4. Default intelligent voice assistant response
    return {
      spokenText: `I am online and ready. I can check your emails, book travel tickets, update your resume and sync with Google Drive, or run custom automated tasks. What should we do next?`,
      chatText: `⚡ **MIRAS Intelligence Active**\n\nI heard: *"${query}"*\n\nHere are some commands you can speak or tap anytime:\n\n• 📬 *"Give me list mails whose need to check once and important to me"*\n• 💬 *"What inside that explain"*\n• ✈️ *"Go and book one flight ticket to New York"*\n• 📄 *"Update and modify my resume and store in drive"*`,
      task: {
        id: 'task-general-' + Date.now(),
        type: 'general',
        title: 'Voice Query Reasoning',
        description: `Executed query: "${query.slice(0, 60)}"`,
        createdAt: 'Just now',
        status: 'completed',
        steps: [
          { id: '1', stepNumber: 1, agent: 'Supervisor', tool: 'LangChainCore', action: 'Synthesized contextual answer', status: 'completed', timestamp: '00:01' },
        ]
      }
    };
  }
}
