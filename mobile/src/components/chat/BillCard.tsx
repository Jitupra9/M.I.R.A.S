import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { BillData } from '../../types/chat';

interface BillCardProps {
  billData: BillData;
  isExpanded?: boolean;
  onToggleExpand: () => void;
  onPayBill: () => void;
  onOpenPdfDetails: () => void;
}

export const BillCard: React.FC<BillCardProps> = ({
  billData,
  isExpanded,
  onToggleExpand,
  onPayBill,
  onOpenPdfDetails,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={styles.billTitleGroup}>
          <Zap size={16} color={colors.primary} />
          <View style={styles.billTitleTextCol}>
            <Text style={styles.billTitle} numberOfLines={1}>{billData.company}</Text>
            <Text style={styles.billDue} numberOfLines={1}>{billData.dueDate}</Text>
          </View>
        </View>
        <Text style={styles.billAmount}>{billData.amount}</Text>
      </View>

      {/* Expand/Collapse Toggle Button */}
      <TouchableOpacity
        style={styles.expandToggleBtn}
        onPress={onToggleExpand}
      >
        {isExpanded ? (
          <>
            <EyeOff size={13} color={colors.primary} />
            <Text style={styles.expandToggleText}>See Less Details</Text>
          </>
        ) : (
          <>
            <Eye size={13} color={colors.primary} />
            <Text style={styles.expandToggleText}>See More (Full Explanation & PDF)</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Collapsible Details */}
      {isExpanded && (
        <View style={styles.expandedContentBox}>
          <View style={styles.diffCols}>
            <View style={styles.diffBox}>
              <Text style={styles.diffLabel}>Electric usage</Text>
              <Text style={styles.diffValueGreen}>↗ +18%</Text>
              <Text style={styles.diffSub}>AC heatwave week</Text>
            </View>

            <View style={styles.diffBox}>
              <Text style={styles.diffLabel}>Rate adjustment</Text>
              <Text style={styles.diffValueNeutral}>+$12.00</Text>
              <Text style={styles.diffSub}>Seasonal fuel fee</Text>
            </View>
          </View>

          <View style={styles.whyHigherInline}>
            <Text style={styles.whyHigherInlineTitle}>💡 Bill Explanation</Text>
            <Text style={styles.whyHigherInlineText}>
              Temperatures averaged 86°F during Sep 18–25, increasing compressor cooling runtime by 4.2 hours daily.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.payBtn, billData.paid && styles.payBtnDone]}
            onPress={onPayBill}
          >
            <CheckCircle2 size={15} color={colors.buttonTextDark} />
            <Text style={styles.payBtnText}>
              {billData.paid ? 'Payment Scheduled ✓' : `Pay this bill (${billData.amount})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.snapshotBtn}
            onPress={onOpenPdfDetails}
          >
            <Eye size={13} color={colors.textSecondary} />
            <Text style={styles.snapshotBtnText}>Show ConEd PDF Snapshot</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    billCard: {
      backgroundColor: isDay ? '#F1F5F9' : 'rgba(0, 0, 0, 0.3)',
      borderRadius: 14,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : colors.surfaceBorderSubtle,
      overflow: 'hidden',
    },
    billHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    billTitleGroup: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    billTitleTextCol: {
      flex: 1,
      minWidth: 0,
    },
    billTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    billDue: {
      fontSize: 10.5,
      color: colors.textMuted,
      marginTop: 1,
    },
    billAmount: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.primary,
      flexShrink: 0,
    },
    expandToggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      marginTop: 8,
      borderTopWidth: 1,
      borderColor: isDay ? '#E2E8F0' : 'rgba(255, 255, 255, 0.06)',
    },
    expandToggleText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.primary,
    },
    expandedContentBox: {
      marginTop: 8,
      gap: 10,
    },
    diffCols: {
      flexDirection: 'row',
      gap: 8,
    },
    diffBox: {
      flex: 1,
      backgroundColor: isDay ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
      borderRadius: 10,
      padding: 8,
      borderWidth: isDay ? 1 : 0,
      borderColor: '#E2E8F0',
    },
    diffLabel: {
      fontSize: 10,
      color: colors.textMuted,
    },
    diffValueGreen: {
      fontSize: 12,
      fontWeight: '700',
      color: isDay ? '#059669' : '#00FFA3',
      marginVertical: 2,
    },
    diffValueNeutral: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
      marginVertical: 2,
    },
    diffSub: {
      fontSize: 9.5,
      color: colors.textSecondary,
    },
    whyHigherInline: {
      backgroundColor: isDay ? '#ECFDF5' : 'rgba(0, 229, 153, 0.05)',
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: isDay ? '#A7F3D0' : 'rgba(0, 229, 153, 0.12)',
    },
    whyHigherInlineTitle: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 2,
    },
    whyHigherInlineText: {
      fontSize: 10,
      color: colors.textSecondary,
      lineHeight: 14,
    },
    payBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 9,
    },
    payBtnDone: {
      backgroundColor: 'rgba(0, 229, 153, 0.2)',
    },
    payBtnText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    snapshotBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 4,
    },
    snapshotBtnText: {
      fontSize: 11,
      color: colors.textSecondary,
    },
  });
};
