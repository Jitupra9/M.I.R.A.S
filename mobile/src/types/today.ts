export interface TodayScreenProps {
  onOpenProfile?: () => void;
}

export interface TimelineItemData {
  id: string;
  timeRange: string;
  badgeText: string;
  badgeType: 'finished' | 'inMins' | 'confirmed' | 'rideSet';
  title: string;
  subtitle: string;
  iconType: 'coffee' | 'video' | 'utensils' | 'activity';
  hasJoinButton?: boolean;
}

export interface NoteBulletItem {
  id: string;
  tag: string;
  content: string;
}
