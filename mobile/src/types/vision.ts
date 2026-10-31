export type VisionMode = 'identify' | 'document' | 'translate';

export interface VisionItemData {
  title: string;
  pillTag: string;
  cardTitle: string;
  details: string[];
  speechAnalysis: string;
  reminderLabel: string;
  secondaryLabel: string;
}

export interface LensQuestionItem {
  q: string;
  a: string;
}
