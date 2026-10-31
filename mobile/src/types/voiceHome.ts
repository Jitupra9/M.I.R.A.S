import { VoiceState, AutonomousTask } from './index';

export interface VoiceHomeScreenProps {
  voiceState: VoiceState;
  transcript: string;
  responsePreview: string;
  activeTask?: AutonomousTask | null;
  onOrbPress: () => void;
  onStopSpeech: () => void;
  onSubmitQuery: (query: string) => void;
  selectedModelName?: string;
  onDismissTask?: () => void;
  onOpenProfile?: () => void;
}

export interface SessionMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
