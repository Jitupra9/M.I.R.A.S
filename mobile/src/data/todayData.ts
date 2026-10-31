import { TimelineItemData, NoteBulletItem } from '../types/today';

export const TIMELINE_ITEMS: TimelineItemData[] = [
  {
    id: 'coffee',
    timeRange: '09:00 AM – 10:00 AM',
    badgeText: 'Finished',
    badgeType: 'finished',
    title: 'Morning Focus & Coffee',
    subtitle: 'Home Studio • Pour over brewed',
    iconType: 'coffee',
  },
  {
    id: 'meeting',
    timeRange: '10:30 AM – 11:15 AM',
    badgeText: 'In 35 min',
    badgeType: 'inMins',
    title: 'Team Product Sync',
    subtitle: 'Meet video room • 6 participants',
    iconType: 'video',
    hasJoinButton: true,
  },
  {
    id: 'lunch',
    timeRange: '12:30 PM – 01:30 PM',
    badgeText: 'Table confirmed',
    badgeType: 'confirmed',
    title: 'Lunch with Sarah',
    subtitle: 'Greenwood Cafe • Table reserved by MIRAS (Tap details)',
    iconType: 'utensils',
  },
  {
    id: 'dentist',
    timeRange: '03:00 PM – 03:45 PM',
    badgeText: 'Ride Set',
    badgeType: 'rideSet',
    title: 'Dentist Routine Checkup',
    subtitle: 'Dr. Miller Clinic • Uber pickup scheduled (Tap details)',
    iconType: 'activity',
  },
];

export const MEETING_ATTENDEES = [
  '• Alex Morgan (You)',
  '• Sarah Jenkins (Product Lead)',
  '• David Miller (Engineering)',
  '• Elena Rostova (Design)',
  '• MIRAS AI (Silent Note-Taker)',
];

export const NOTE_BULLETS: NoteBulletItem[] = [
  {
    id: 'n1',
    tag: 'Q4 Deliverables:',
    content: 'Finalize voice-first mobile interface testing by Friday.',
  },
  {
    id: 'n2',
    tag: 'Action for Alex:',
    content: 'Review Delta boarding pass confirmation code with team.',
  },
  {
    id: 'n3',
    tag: 'Sarah:',
    content: 'Sending updated customer survey report by 2 PM.',
  },
];
