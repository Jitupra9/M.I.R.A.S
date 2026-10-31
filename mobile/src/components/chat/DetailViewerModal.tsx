import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  Mail,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  ExternalLink,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { DetailViewItem } from '../../types/chat';
import { VoiceService } from '../../services/voiceService';

interface DetailViewerModalProps {
  item: DetailViewItem | null;
  onClose: () => void;
  onDraftReply?: (sender: string) => void;
  onSchedulePayment?: () => void;
}

export const DetailViewerModal: React.FC<DetailViewerModalProps> = ({
  item,
  onClose,
  onDraftReply,
  onSchedulePayment,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!item) return null;

  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Backdrop dismiss touchable */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            VoiceService.triggerHaptic('light');
            onClose();
          }}
          accessibilityLabel="Close details viewer"
        />

        <View
          style={styles.pdfSheet}
          onStartShouldSetResponder={() => true}
        >
          {/* Top pill handle */}
          <View style={styles.sheetHandleBar} />

          <View style={styles.pdfHeader}>
            <View style={styles.pdfTitleRow}>
              <View style={[styles.pdfBadgeIcon, item.type === 'email' && styles.emailBadgeIcon]}>
                {item.type === 'email' ? (
                  <Mail size={16} color={colors.primary} />
                ) : (
                  <Text style={styles.pdfBadgeIconText}>{item.badgeText || 'PDF'}</Text>
                )}
              </View>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.pdfTitle}>
                  {item.title}
                </Text>
                <Text style={styles.pdfSub}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                VoiceService.triggerHaptic('light');
                onClose();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.pdfCloseBtn}
              accessibilityLabel="Close details"
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pdfScrollContent}>
            {/* Type 1: PDF Utility or Document Statement */}
            {item.type === 'pdf' && (
              <View style={styles.statementCard}>
                <View style={styles.statementHeaderRow}>
                  <Text style={styles.statementOrg} numberOfLines={1}>
                    {item.statementData?.company || 'CON EDISON OF NEW YORK'}
                  </Text>
                  <Text style={styles.statementStatus} numberOfLines={1}>
                    {item.statementData?.dueDate
                      ? item.statementData.dueDate.trim().toUpperCase().startsWith('DUE')
                        ? item.statementData.dueDate.trim()
                        : `DUE ${item.statementData.dueDate.trim()}`
                      : 'DUE OCT 24, 2026'}
                  </Text>
                </View>
                <Text style={styles.statementAccount}>
                  {item.statementData?.account || 'Account: 984-2104-11 • Alex Morgan'}
                </Text>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL AMOUNT DUE</Text>
                  <Text style={styles.totalAmount}>
                    {item.statementData?.totalAmount || '$142.50'}
                  </Text>
                </View>

                {(item.statementData?.lineItems || [
                  { desc: 'Electricity Supply (482 kWh @ $0.1419)', price: '$68.40' },
                  { desc: 'Delivery & Infrastructure Transmission', price: '$48.10' },
                  { desc: 'Clean Energy & Renewable Transition Fee', price: '$12.00' },
                  { desc: 'NYC City & State Sales Taxes', price: '$14.00' },
                ]).map((line, idx) => (
                  <View key={idx} style={styles.lineItem}>
                    <Text style={styles.lineDesc}>{line.desc}</Text>
                    <Text style={styles.linePrice}>{line.price}</Text>
                  </View>
                ))}

                <View style={styles.whyHigherBox}>
                  <Text style={styles.whyHigherTitle}>💡 Why is this bill 18% higher?</Text>
                  <Text style={styles.whyHigherText}>
                    {item.statementData?.whyHigherText ||
                      'Temperatures averaged 86°F during the Sep 18–25 heatwave, increasing air conditioning compressor runtime by 4.2 hours daily.'}
                  </Text>
                </View>

                <View style={styles.pdfActionRow}>
                  <TouchableOpacity
                    style={styles.pdfActionBtn}
                    onPress={() => {
                      VoiceService.triggerHaptic('success');
                      onClose();
                    }}
                  >
                    <Download size={15} color={colors.primary} />
                    <Text style={styles.pdfActionBtnText}>Download PDF</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.pdfActionBtnPrimary}
                    onPress={() => {
                      VoiceService.triggerHaptic('success');
                      if (onSchedulePayment) {
                        onSchedulePayment();
                      } else {
                        onClose();
                      }
                    }}
                  >
                    <CheckCircle2 size={15} color={colors.buttonTextDark} />
                    <Text style={styles.pdfActionBtnPrimaryText}>Schedule Payment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Type 2: Email Details View */}
            {item.type === 'email' && item.emailData && (
              <View style={styles.emailDetailWrapper}>
                {/* Metadata Header Box */}
                <View style={styles.emailMetaCard}>
                  <View style={styles.emailMetaRow}>
                    <Text style={styles.emailMetaLabel}>FROM:</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.emailMetaVal}>{item.emailData.sender}</Text>
                      <Text style={styles.emailMetaSubVal}>{item.emailData.senderEmail}</Text>
                    </View>
                    <View
                      style={[
                        styles.emailPriorityTagSmall,
                        item.emailData.priority === 'URGENT'
                          ? styles.priorityUrgent
                          : styles.priorityHigh,
                      ]}
                    >
                      <Text style={styles.emailPriorityTagText}>
                        {item.emailData.priority}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.emailMetaRow}>
                    <Text style={styles.emailMetaLabel}>TO:</Text>
                    <Text style={styles.emailMetaVal}>{item.emailData.recipient}</Text>
                  </View>

                  <View style={styles.emailMetaRow}>
                    <Text style={styles.emailMetaLabel}>DATE:</Text>
                    <Text style={styles.emailMetaVal}>{item.emailData.dateTime}</Text>
                  </View>
                </View>

                {/* Action Required Banner if present */}
                {item.emailData.actionRequired && (
                  <View style={styles.emailActionBoxModal}>
                    <AlertCircle size={15} color="#FFB800" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.emailActionBoxTitle}>Action Required</Text>
                      <Text style={styles.emailActionBoxText}>
                        {item.emailData.actionRequired}
                      </Text>
                    </View>
                  </View>
                )}

                {/* AI Summary Box */}
                {item.emailData.summary && (
                  <View style={styles.emailSummaryCard}>
                    <View style={styles.summaryTitleRow}>
                      <Sparkles size={14} color={colors.primary} />
                      <Text style={styles.summaryTitleText}>MIRAS Executive Summary</Text>
                    </View>
                    <Text style={styles.summaryBodyText}>
                      {item.emailData.summary}
                    </Text>
                  </View>
                )}

                {/* Full Email Body */}
                <View style={styles.emailBodyCard}>
                  <Text style={styles.emailBodyHeader}>Subject: {item.emailData.subject}</Text>
                  <Text style={styles.emailBodyContent}>
                    {item.emailData.fullBody}
                  </Text>
                </View>

                {/* Attachments Section if available */}
                {item.emailData.attachments && item.emailData.attachments.length > 0 && (
                  <View style={styles.attachmentsSection}>
                    <Text style={styles.attachmentsSectionHeader}>
                      Attachments ({item.emailData.attachments.length})
                    </Text>
                    {item.emailData.attachments.map((att, idx) => (
                      <View key={idx} style={styles.attachmentItemRow}>
                        <FileText size={16} color={colors.primary} />
                        <View style={{ flex: 1, marginHorizontal: 8 }}>
                          <Text style={styles.attachmentItemName}>{att.name}</Text>
                          <Text style={styles.attachmentItemSize}>{att.size}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.attachmentDownloadBtn}
                          onPress={() => VoiceService.triggerHaptic('light')}
                        >
                          <Download size={14} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Relevant Links if available */}
                {item.emailData.links && item.emailData.links.length > 0 && (
                  <View style={styles.attachmentsSection}>
                    <Text style={styles.attachmentsSectionHeader}>Relevant Links</Text>
                    {item.emailData.links.map((link, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.attachmentItemRow}
                        onPress={() => VoiceService.triggerHaptic('light')}
                      >
                        <ExternalLink size={15} color={colors.primary} />
                        <Text style={[styles.attachmentItemName, { color: colors.primary, flex: 1, marginHorizontal: 8 }]}>
                          {link.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Footer Actions */}
                <View style={styles.pdfActionRow}>
                  <TouchableOpacity
                    style={styles.pdfActionBtnPrimary}
                    onPress={() => {
                      VoiceService.triggerHaptic('success');
                      if (onDraftReply && item.emailData?.sender) {
                        onDraftReply(item.emailData.sender);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    <Sparkles size={15} color={colors.buttonTextDark} />
                    <Text style={styles.pdfActionBtnPrimaryText}>Draft Reply with MIRAS</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.pdfActionBtn}
                    onPress={() => {
                      VoiceService.triggerHaptic('light');
                      onClose();
                    }}
                  >
                    <Text style={styles.pdfActionBtnText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    pdfSheet: {
      backgroundColor: colors.cardBgSubtle,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
      maxHeight: '88%',
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    sheetHandleBar: {
      width: 38,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textMuted,
      opacity: 0.35,
      alignSelf: 'center',
      marginBottom: 12,
    },
    pdfHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 14,
      gap: 8,
    },
    pdfTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      flex: 1,
    },
    pdfBadgeIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    emailBadgeIcon: {
      backgroundColor: 'rgba(0, 229, 153, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.3)',
    },
    pdfBadgeIconText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#EF4444',
    },
    pdfTitle: {
      fontSize: 14.5,
      fontWeight: '700',
      color: colors.textPrimary,
      lineHeight: 20,
    },
    pdfSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 3,
      lineHeight: 15,
    },
    pdfCloseBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    pdfScrollContent: {
      paddingBottom: 16,
    },
    statementCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 16,
    },
    statementHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      gap: 6,
    },
    statementOrg: {
      flex: 1,
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.2,
      marginRight: 4,
    },
    statementStatus: {
      fontSize: 9.5,
      fontWeight: '700',
      color: '#F59E0B',
      flexShrink: 0,
    },
    statementAccount: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 12,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.06)',
      marginBottom: 12,
    },
    totalLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primary,
    },
    lineItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 5,
    },
    lineDesc: {
      fontSize: 11.5,
      color: colors.textSecondary,
    },
    linePrice: {
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    whyHigherBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 12,
      padding: 12,
      marginTop: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    whyHigherTitle: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    whyHigherText: {
      fontSize: 11,
      lineHeight: 16,
      color: colors.textSecondary,
    },
    pdfActionRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
      paddingTop: 4,
    },
    pdfActionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 12,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    pdfActionBtnText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primary,
    },
    pdfActionBtnPrimary: {
      flex: 1.2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
    },
    pdfActionBtnPrimaryText: {
      fontSize: 12.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    emailDetailWrapper: {
      gap: 12,
    },
    emailMetaCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
    },
    emailMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    emailMetaLabel: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.textMuted,
      width: 48,
      letterSpacing: 0.5,
    },
    emailMetaVal: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    emailMetaSubVal: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 1,
    },
    emailPriorityTagSmall: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    priorityUrgent: {
      backgroundColor: 'rgba(255, 82, 82, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(255, 82, 82, 0.3)',
    },
    priorityHigh: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    emailPriorityTagText: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: 0.5,
    },
    emailActionBoxModal: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.25)',
    },
    emailActionBoxTitle: {
      fontSize: 11.5,
      fontWeight: '800',
      color: '#F59E0B',
      marginBottom: 2,
    },
    emailActionBoxText: {
      fontSize: 11.5,
      lineHeight: 16,
      color: colors.textPrimary,
    },
    emailSummaryCard: {
      backgroundColor: 'rgba(0, 229, 153, 0.06)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.2)',
    },
    summaryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    summaryTitleText: {
      fontSize: 11.5,
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
    },
    summaryBodyText: {
      fontSize: 12,
      lineHeight: 17,
      color: colors.textPrimary,
    },
    emailBodyCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    emailBodyHeader: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 10,
    },
    emailBodyContent: {
      fontSize: 12.5,
      lineHeight: 19,
      color: colors.textPrimary,
    },
    attachmentsSection: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
    },
    attachmentsSectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    attachmentItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
    },
    attachmentItemName: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    attachmentItemSize: {
      fontSize: 10.5,
      color: colors.textMuted,
    },
    attachmentDownloadBtn: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
    },
  });
};
