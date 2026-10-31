import React from 'react';
import {
  Code2,
  MessageSquare,
  Layers,
  Mail,
  Calendar,
  HardDrive,
  FileText,
  Cloud,
  Globe,
  Server,
  Video,
  Briefcase,
  CheckCircle2,
  Database,
  Sparkles,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '../../theme/colors';

interface PlatformIconProps {
  iconType: string;
  isConnected: boolean;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  iconType,
  isConnected,
  size = 18,
}) => {
  const { colors } = useTheme();

  switch (iconType) {
    case 'github':
      return <Code2 size={size} color={isConnected ? '#A78BFA' : colors.textSecondary} />;
    case 'slack':
      return <MessageSquare size={size} color={isConnected ? '#34D399' : colors.textSecondary} />;
    case 'linear':
      return <Layers size={size} color={isConnected ? '#818CF8' : colors.textSecondary} />;
    case 'gmail':
      return <Mail size={size} color={isConnected ? '#F87171' : colors.textSecondary} />;
    case 'calendar':
      return <Calendar size={size} color={isConnected ? '#38BDF8' : colors.textSecondary} />;
    case 'drive':
      return <HardDrive size={size} color={isConnected ? '#FBBF24' : colors.textSecondary} />;
    case 'notion':
      return <FileText size={size} color={isConnected ? '#E2E8F0' : colors.textSecondary} />;
    case 'aws':
      return <Cloud size={size} color={isConnected ? '#F97316' : colors.textSecondary} />;
    case 'cloudflare':
      return <Globe size={size} color={isConnected ? '#F59E0B' : colors.textSecondary} />;
    case 'server':
      return <Server size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'discord':
      return <MessageSquare size={size} color={isConnected ? '#6366F1' : colors.textSecondary} />;
    case 'zoom':
      return <Video size={size} color={isConnected ? '#2563EB' : colors.textSecondary} />;
    case 'linkedin':
      return <Briefcase size={size} color={isConnected ? '#0A66C2' : colors.textSecondary} />;
    case 'naukri':
      return <Briefcase size={size} color={isConnected ? '#3B82F6' : colors.textSecondary} />;
    case 'workindia':
      return <Briefcase size={size} color={isConnected ? '#10B981' : colors.textSecondary} />;
    case 'jira':
      return <Layers size={size} color={isConnected ? '#0052CC' : colors.textSecondary} />;
    case 'gitlab':
      return <Code2 size={size} color={isConnected ? '#FC6D26' : colors.textSecondary} />;
    case 'asana':
      return <CheckCircle2 size={size} color={isConnected ? '#F06A6A' : colors.textSecondary} />;
    case 'trello':
      return <Layers size={size} color={isConnected ? '#0079BF' : colors.textSecondary} />;
    case 'whatsapp':
      return <MessageSquare size={size} color={isConnected ? '#25D366' : colors.textSecondary} />;
    case 'teams':
      return <MessageSquare size={size} color={isConnected ? '#6264A7' : colors.textSecondary} />;
    case 'gcp':
      return <Cloud size={size} color={isConnected ? '#4285F4' : colors.textSecondary} />;
    case 'azure':
      return <Cloud size={size} color={isConnected ? '#0078D4' : colors.textSecondary} />;
    case 'supabase':
      return <Database size={size} color={isConnected ? '#3ECF8E' : colors.textSecondary} />;
    case 'telegram':
      return <MessageSquare size={size} color={isConnected ? '#229ED9' : colors.textSecondary} />;
    case 'globe':
      return <Globe size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'briefcase':
      return <Briefcase size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'code':
      return <Code2 size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'message':
      return <MessageSquare size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'database':
      return <Database size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    case 'sparkles':
      return <Sparkles size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
    default:
      return <Zap size={size} color={isConnected ? colors.primary : colors.textSecondary} />;
  }
};
