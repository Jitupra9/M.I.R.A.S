import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Plus, X, ChevronRight } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { IntegrationCategory, IntegrationItem } from '../../types/integrations';
import { PlatformPreset } from '../../data/integrationsData';
import { PlatformIcon } from './PlatformIcon';

interface AddAccountModalProps {
  addAccountCategory: IntegrationCategory | null;
  integrations: Record<string, IntegrationItem>;
  catalog: PlatformPreset[];
  onClose: () => void;
  onOpenCustomAppModal: (categoryId: string) => void;
  onSelectCatalogPreset: (preset: PlatformPreset, category: IntegrationCategory) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  addAccountCategory,
  integrations,
  catalog,
  onClose,
  onOpenCustomAppModal,
  onSelectCatalogPreset,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!addAccountCategory) return null;

  const filteredCatalog = catalog.filter(preset => {
    const isAlreadyConnected = Object.values(integrations).some(item => {
      const isMatch =
        item.id === preset.id ||
        item.id.startsWith(`${preset.id}_`) ||
        item.name.toLowerCase() === preset.name.toLowerCase();
      const isConnected =
        item.status === 'connected_mcp' || item.status === 'connected_api';
      return isMatch && isConnected;
    });
    return !isAlreadyConnected;
  });

  return (
    <Modal
      visible={!!addAccountCategory}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetModal}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <Plus size={18} color={colors.primary} />
              <View>
                <Text style={styles.sheetTitle}>Add Account: {addAccountCategory.name}</Text>
                <Text style={styles.sheetSub}>
                  Connect a new application, job platform, or workspace service
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.dialogScroll}>
            {/* Highlight Action Card: Connect New Platform / App */}
            <TouchableOpacity
              style={styles.customPromoCard}
              onPress={() => {
                onClose();
                onOpenCustomAppModal(addAccountCategory.id);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.customPromoIconBox}>
                <Plus size={18} color={colors.buttonTextDark} />
              </View>
              <View style={styles.customPromoContent}>
                <View style={styles.customPromoHeaderRow}>
                  <Text style={styles.customPromoTitle} numberOfLines={1}>
                    Connect New Platform
                  </Text>
                  <View style={styles.newPill}>
                    <Text style={styles.newPillText}>CUSTOM</Text>
                  </View>
                </View>
                <Text style={styles.customPromoSub} numberOfLines={2}>
                  Link LinkedIn, Naukri, WorkIndia, or any custom app
                </Text>
              </View>
              <View style={styles.customPromoArrowBox}>
                <ChevronRight size={18} color={colors.primary} />
              </View>
            </TouchableOpacity>

            {/* Popular Platforms Catalog */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.dialogSectionHeader}>
                POPULAR PLATFORMS & SERVICES TO CONNECT
              </Text>
              {filteredCatalog.map(preset => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.dialogOptionRow}
                  onPress={() => onSelectCatalogPreset(preset, addAccountCategory)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dialogIconBox}>
                    <PlatformIcon iconType={preset.iconType} isConnected={true} size={20} />
                  </View>
                  <View style={styles.dialogOptionCol}>
                    <View style={styles.dialogTitleRow}>
                      <Text style={styles.dialogOptionTitle}>{preset.name}</Text>
                      <View style={styles.tagPill}>
                        <Text style={styles.tagPillText}>{preset.categoryTag}</Text>
                      </View>
                    </View>
                    <Text style={styles.dialogOptionSub}>{preset.description}</Text>
                  </View>
                  <View style={styles.dialogActionArrow}>
                    <Plus size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.cancelFooterBtn} onPress={onClose}>
            <Text style={styles.cancelFooterBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-end',
    },
    sheetModal: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 28,
      maxHeight: '90%',
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    sheetHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    sheetTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sheetSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      padding: 6,
      borderRadius: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    dialogScroll: {
      paddingTop: 14,
    },
    customPromoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 229, 153, 0.08)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.25)',
      marginBottom: 16,
      gap: 12,
    },
    customPromoIconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customPromoContent: {
      flex: 1,
    },
    customPromoHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    customPromoTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    newPill: {
      backgroundColor: 'rgba(0, 229, 153, 0.2)',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
    },
    newPillText: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.primary,
    },
    customPromoSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    customPromoArrowBox: {
      paddingLeft: 4,
    },
    dialogSectionHeader: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.6,
      marginBottom: 10,
    },
    dialogOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      marginBottom: 8,
      gap: 12,
    },
    dialogIconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogOptionCol: {
      flex: 1,
    },
    dialogTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    dialogOptionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    tagPill: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
    },
    tagPillText: {
      fontSize: 9,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    dialogOptionSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    dialogActionArrow: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelFooterBtn: {
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginTop: 8,
    },
    cancelFooterBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textSecondary,
    },
  });
};
