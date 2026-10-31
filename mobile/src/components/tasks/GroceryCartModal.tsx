import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface GroceryCartModalProps {
  visible: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export const GroceryCartModal: React.FC<GroceryCartModalProps> = ({
  visible,
  onClose,
  onApprove,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Whole Foods Market Cart</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.groceryItemsList}>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Organic Whole Milk (1 Gal)</Text>
              <Text style={styles.groceryPrice}>$4.99</Text>
            </View>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Honeycrisp Apples (2 lbs)</Text>
              <Text style={styles.groceryPrice}>$5.49</Text>
            </View>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Organic Greek Yogurt (32 oz)</Text>
              <Text style={styles.groceryPrice}>$6.29</Text>
            </View>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Hass Avocados (Pack of 4)</Text>
              <Text style={styles.groceryPrice}>$4.50</Text>
            </View>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Artisan Sourdough Loaf</Text>
              <Text style={styles.groceryPrice}>$5.99</Text>
            </View>
            <View style={styles.groceryLine}>
              <Text style={styles.groceryName}>Creamy Roasted Almond Butter</Text>
              <Text style={styles.groceryPrice}>$6.92</Text>
            </View>
          </View>

          <View style={styles.groceryTotalRow}>
            <Text style={styles.groceryTotalLabel}>Total (Including Delivery & Tax)</Text>
            <Text style={styles.groceryTotalValue}>$34.18</Text>
          </View>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={onApprove}>
            <Check size={16} color={colors.buttonTextDark} />
            <Text style={styles.primaryModalBtnText}>Approve & Place Order ($34.18)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'flex-end',
    },
    sheetContent: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      maxHeight: '90%',
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },
    groceryItemsList: {
      backgroundColor: colors.background,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      gap: 8,
      marginBottom: 12,
    },
    groceryLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    groceryName: {
      fontSize: 12.5,
      color: colors.textSecondary,
    },
    groceryPrice: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    groceryTotalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 14,
    },
    groceryTotalLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    groceryTotalValue: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
    },
    primaryModalBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 13,
    },
    primaryModalBtnText: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
