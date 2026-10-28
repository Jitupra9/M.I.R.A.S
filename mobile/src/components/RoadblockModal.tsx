import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Shield, Play, CheckCircle2, Hand, X, Lock, Video, ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { VoiceService } from '../services/voiceService';

interface RoadblockModalProps {
  visible: boolean;
  onClose: () => void;
  onApplySolution: () => void;
}

export const RoadblockModal: React.FC<RoadblockModalProps> = ({ visible, onClose, onApplySolution }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'roadblock' | 'replays' | 'results'>('roadblock');

  const handleApply = () => {
    VoiceService.triggerHaptic('success');
    onApplySolution();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={18} color={colors.textPrimary} />
            <Text style={styles.headerTitle}>Task Details</Text>
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Tab Pills */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'roadblock' && styles.tabPillActive]}
            onPress={() => setActiveTab('roadblock')}
          >
            <Text style={[styles.tabText, activeTab === 'roadblock' && styles.tabTextActive]}>
              Active Roadblock (1)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'replays' && styles.tabPillActive]}
            onPress={() => setActiveTab('replays')}
          >
            <Text style={[styles.tabText, activeTab === 'replays' && styles.tabTextActive]}>
              Video Replays
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabPill, activeTab === 'results' && styles.tabPillActive]}
            onPress={() => setActiveTab('results')}
          >
            <Text style={[styles.tabText, activeTab === 'results' && styles.tabTextActive]}>
              Results
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Banner */}
          <View style={styles.roadblockCard}>
            <View style={styles.bannerRow}>
              <View style={styles.liveTag}>
                <Text style={styles.liveTagText}>MIRAS Live Assistant</Text>
              </View>
              <View style={styles.approvalTag}>
                <Text style={styles.approvalTagText}>⚡ 1-Tap Approval</Text>
              </View>
            </View>

            <Text style={styles.roadblockTitle}>Current Screen Roadblock</Text>
            <Text style={styles.roadblockSub}>The Grand Hyatt • Deluxe Suite Checkout</Text>

            <Text style={styles.agentSpeech}>
              "I reached the checkout page for The Grand Hyatt, but the website has an expired promotional coupon code. Here is a live video snapshot of what happened:"
            </Text>

            {/* Video Snapshot Player Mock */}
            <View style={styles.videoPlayer}>
              <View style={styles.videoUrlBar}>
                <Lock size={11} color={colors.primary} />
                <Text style={styles.videoUrl}>grandhyatt.com/book/checkout</Text>
                <Text style={styles.recordedPill}>1080p Recorded</Text>
              </View>

              {/* Expired Promo Alert */}
              <View style={styles.promoAlert}>
                <Text style={styles.promoAlertText}>Auto-detected: Expired promo code 'SUMMER24'</Text>
              </View>

              {/* Play Button */}
              <TouchableOpacity
                style={styles.playCenterBtn}
                onPress={() => {
                  VoiceService.triggerHaptic('light');
                  setIsPlaying(!isPlaying);
                }}
              >
                <Play size={20} color={colors.buttonTextDark} fill={colors.buttonTextDark} />
              </TouchableOpacity>

              {/* Video Timeline Bar */}
              <View style={styles.videoTimelineRow}>
                <View style={styles.timelineTrack}>
                  <View style={[styles.timelineFill, { width: '40%' }]} />
                </View>
                <Text style={styles.timestampText}>0:02 / 0:24</Text>
              </View>
            </View>

            {/* Solution Found Card */}
            <View style={styles.solutionCard}>
              <View style={styles.solutionHeader}>
                <Sparkles size={15} color={colors.primary} />
                <Text style={styles.solutionTitle}>MIRAS Found a Solution</Text>
              </View>
              <Text style={styles.solutionBody}>
                I found a working alternative code (<Text style={{ color: colors.primary, fontWeight: '700' }}>FALL15</Text>) that saves you <Text style={{ color: colors.primary, fontWeight: '700' }}>$35</Text> instead. Would you like me to apply it and proceed?
              </Text>
            </View>

            {/* Actions */}
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <CheckCircle2 size={16} color={colors.buttonTextDark} />
              <Text style={styles.applyBtnText}>Apply New Code & Book ($210)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.takeOverBtn} onPress={onClose}>
              <Hand size={15} color={colors.primary} />
              <Text style={styles.takeOverBtnText}>Take over screen & do it myself</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelLink} onPress={onClose}>
              <X size={13} color={colors.textMuted} />
              <Text style={styles.cancelLinkText}>Cancel booking</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Video Recordings Section */}
          <View style={styles.recordingsSection}>
            <View style={styles.recordingsHeader}>
              <Text style={styles.recordingsTitle}>Recent Video Recordings</Text>
              <Text style={styles.viewAllText}>View All (14)</Text>
            </View>

            <View style={styles.recordingItem}>
              <View style={styles.playIconBox}>
                <Play size={12} color={colors.primary} fill={colors.primary} />
              </View>
              <View style={styles.recordingCol}>
                <Text style={styles.recordingTitle}>Doctor Appointment...</Text>
                <Text style={styles.recordingSub}>Confirmed appointment with Dr. Patel</Text>
              </View>
              <Text style={styles.recordingTime}>Today • 10:14 AM</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </View>

            <View style={styles.recordingItem}>
              <View style={styles.playIconBox}>
                <Play size={12} color={colors.primary} fill={colors.primary} />
              </View>
              <View style={styles.recordingCol}>
                <Text style={styles.recordingTitle}>Grocery Store Sub...</Text>
                <Text style={styles.recordingSub}>Selected organic almond milk</Text>
              </View>
              <Text style={styles.recordingTime}>Yesterday • 6:42 PM</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </View>
          </View>

          {/* Encryption Guarantee */}
          <View style={styles.encryptionFooter}>
            <Shield size={12} color={colors.textMuted} />
            <Text style={styles.encryptionText}>
              All screen video captures are encrypted and deleted automatically after 24 hours.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.buttonTextDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  roadblockCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveTag: {
    backgroundColor: `${colors.primary}26`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  approvalTag: {
    backgroundColor: `${colors.primary}33`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  approvalTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
  },
  roadblockTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roadblockSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  agentSpeech: {
    fontSize: 12.5,
    color: colors.textPrimary,
    lineHeight: 18,
    marginBottom: 12,
  },
  videoPlayer: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 14,
    padding: 10,
    height: 180,
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  videoUrlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoUrl: {
    fontSize: 10.5,
    color: colors.textSecondary,
    flex: 1,
  },
  recordedPill: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    backgroundColor: `${colors.primary}26`,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignSelf: 'center',
  },
  promoAlertText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F87171',
    textAlign: 'center',
  },
  playCenterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 6,
  },
  videoTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1.5,
  },
  timelineFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  timestampText: {
    fontSize: 9.5,
    color: colors.textMuted,
  },
  solutionCard: {
    backgroundColor: `${colors.primary}14`,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    marginBottom: 12,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  solutionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  solutionBody: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 17,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 22,
    marginBottom: 8,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.buttonTextDark,
  },
  takeOverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    paddingVertical: 10,
    borderRadius: 22,
    marginBottom: 10,
  },
  takeOverBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  cancelLinkText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  recordingsSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  recordingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordingsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 10,
  },
  playIconBox: {
    backgroundColor: `${colors.primary}26`,
    padding: 6,
    borderRadius: 8,
  },
  recordingCol: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  recordingSub: {
    fontSize: 10.5,
    color: colors.textMuted,
  },
  recordingTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  encryptionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  encryptionText: {
    fontSize: 10.5,
    color: colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
});
