import { EmailSummaryItem, Message, ChatConversation } from '../types/chat';

export const INITIAL_EMAILS_DATA: EmailSummaryItem[] = [
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

export const INITIAL_CHAT: Message[] = [
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

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-electricity',
    title: 'Electricity Bill & Payment',
    preview: 'Scheduled ConEdison ($142.50) payment for Friday, Oct 18.',
    updatedAt: 'Yesterday • 10:43 AM',
    messages: INITIAL_CHAT,
  },
  {
    id: 'conv-emails',
    title: 'Priority Inbox Triage',
    preview: '3 important emails requiring attention (Delta, Beacon, Apex).',
    updatedAt: 'Oct 16',
    messages: [
      {
        id: 'e-msg-1',
        sender: 'user',
        text: 'Give me list mails whose need to check once and important to me',
        time: '09:15 AM',
      },
      {
        id: 'e-msg-2',
        sender: 'mira',
        text: "Here are your 3 most important emails requiring attention. Tap 'See More' to expand full details:",
        time: '09:15 AM',
        cardType: 'email_list',
        isExpanded: false,
        emailData: {
          title: 'Priority Inbox Triage (3 Mails)',
          items: INITIAL_EMAILS_DATA,
        },
      },
    ],
  },
  {
    id: 'conv-flight',
    title: 'Delta Flight #DL 1482 Check-In',
    preview: 'New York (JFK) → Chicago (ORD) • Check-in paused for SMS code.',
    updatedAt: 'Oct 15',
    messages: [
      {
        id: 'f-msg-1',
        sender: 'user',
        text: 'Check my Delta flight to Chicago today',
        time: '02:10 PM',
      },
      {
        id: 'f-msg-2',
        sender: 'mira',
        text: 'I found your Delta flight #DL 1482 to Chicago. Check-in is paused waiting for your security authorization:',
        time: '02:10 PM',
        cardType: 'flight_card',
        isExpanded: false,
        flightData: {
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
        },
      },
    ],
  },
];
