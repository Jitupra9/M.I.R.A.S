import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, CloudCheck, CheckCircle2, Volume2, Share2, Sparkles, Folder } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { ResumeUpdateDetails } from '../types';
import { VoiceService } from '../services/voiceService';

interface ResumeSyncCardProps {
  resume: ResumeUpdateDetails;
}

export const ResumeSyncCard: React.FC<ResumeSyncCardProps> = ({ resume }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleReadAloud = () => {
    VoiceService.triggerHaptic('light');
    if (!VoiceService.isMutedMode()) {
      const speech = `Resume updated successfully. File ${resume.fileName}. Added new proficiencies in LangGraph multi-agent architecture and React Native mobile development.`;
      VoiceService.speak(speech);
    }
  };

  const handleShare = () => {
    VoiceService.triggerHaptic('medium');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <FileText size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>Resume Evolution & Drive Sync</Text>
        </View>
        <Text style={styles.versionTag}>{resume.version}</Text>
      </View>

      {/* Target Role & File info */}
      <View style={styles.roleCard}>
        <Text style={styles.fileName}>{resume.fileName}</Text>
        <Text style={styles.targetRole}>Target: {resume.targetRole}</Text>
        <Text style={styles.lastModified}>Modified: {resume.lastUpdated} • {resume.fileSize}</Text>
      </View>

      {/* Google Drive Status Bar */}
      <View style={styles.driveStatusCard}>
        <View style={styles.driveIconWrapper}>
          <CloudCheck size={18} color={colors.success} />
        </View>
        <View style={styles.driveDetails}>
          <View style={styles.driveHeaderRow}>
            <Text style={styles.driveStatusTitle}>Synchronized to Google Drive</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>LIVE CLOUD</Text>
            </View>
          </View>
          <Text style={styles.drivePath} numberOfLines={1}>
            {resume.driveLocation}
          </Text>
        </View>
      </View>

      {/* Skills Added Chips */}
      <View style={styles.skillsSection}>
        <View style={styles.sectionTitleRow}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.sectionTitle}>Skills Injected by Career Agent:</Text>
        </View>
        <View style={styles.chipsContainer}>
          {resume.skillsAdded.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modified Sections */}
      <View style={styles.changesSection}>
        <Text style={styles.sectionTitle}>Changelog Highlights:</Text>
        {resume.sectionsModified.map((change, index) => (
          <View key={index} style={styles.changeRow}>
            <CheckCircle2 size={13} color={colors.primary} style={styles.checkIcon} />
            <Text style={styles.changeText}>{change}</Text>
          </View>
        ))}
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.voiceButton} onPress={handleReadAloud}>
          <Volume2 size={14} color={colors.primary} />
          <Text style={styles.voiceButtonText}>Read Highlights</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={14} color="#070B14" />
          <Text style={styles.shareButtonText}>Copy Drive Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  versionTag: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    backgroundColor: `${colors.primary}1F`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  targetRole: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  lastModified: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  driveStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}14`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
    gap: 10,
  },
  driveIconWrapper: {
    backgroundColor: `${colors.success}26`,
    padding: 8,
    borderRadius: 10,
  },
  driveDetails: {
    flex: 1,
  },
  driveHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  driveStatusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  activePill: {
    backgroundColor: `${colors.success}33`,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: 0.5,
  },
  drivePath: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  skillsSection: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    backgroundColor: `${colors.primary}14`,
    borderColor: `${colors.primary}33`,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  changesSection: {
    marginBottom: 12,
    gap: 4,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  checkIcon: {
    marginTop: 2,
  },
  changeText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}1A`,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voiceButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 12,
    color: '#070B14',
    fontWeight: '700',
  },
});
