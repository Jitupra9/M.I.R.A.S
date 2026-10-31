import { SessionMessage } from '../types/voiceHome';

export const AI_SUGGESTIONS = [
  'I can help you manage your tasks',
  'I can triage your unread emails',
  'I can organize your schedule',
  'I can answer your questions',
];

export const INITIAL_SESSION_MESSAGES: SessionMessage[] = [
  {
    id: 'init-msg',
    sender: 'assistant',
    text: "Hello Alex, I'm MIRAS. Ready to assist you with your schedule, emails, and daily tasks.",
    timestamp: 'Just now',
  },
];
