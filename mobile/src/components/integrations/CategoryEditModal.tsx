import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  FolderPlus,
  X,
  Code2,
  Briefcase,
  Sparkles,
  Cloud,
  Database,
  Globe,
  Trash2,
  Check,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { IntegrationCategory } from '../../types/integrations';

interface CategoryEditModalProps {
  visible: boolean;
  editingCategory: IntegrationCategory | null;
  categoryFormName: string;
  categoryFormDesc: string;
  categoryFormIcon: string;
  onChangeName: (name: string) => void;
  onChangeDesc: (desc: string) => void;
  onChangeIcon: (icon: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: (categoryId: string) => void;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  visible,
  editingCategory,
  categoryFormName,
  categoryFormDesc,
  categoryFormIcon,
  onChangeName,
  onChangeDesc,
  onChangeIcon,
  onClose,
  onSave,
  onDelete,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetModal}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderLeft}>
              <FolderPlus size={18} color={colors.primary} />
              <View>
                <Text style={styles.sheetTitle}>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </Text>
                <Text style={styles.sheetSub}>
                  Organize and group integrations in Alex's workspace
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryFormContent}>
            <Text style={styles.inputLabel}>CATEGORY NAME</Text>
            <TextInput
              style={styles.textInput}
              value={categoryFormName}
              onChangeText={onChangeName}
              placeholder="e.g. Finance & Analytics"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              value={categoryFormDesc}
              onChangeText={onChangeDesc}
              placeholder="e.g. Invoicing, subscription billing & balance sync"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.inputLabel}>CATEGORY ICON</Text>
            <View style={styles.iconSelectorRow}>
              {[
                { id: 'code', label: 'Code', icon: <Code2 size={16} /> },
                { id: 'briefcase', label: 'Work', icon: <Briefcase size={16} /> },
                { id: 'sparkles', label: 'AI', icon: <Sparkles size={16} /> },
                { id: 'cloud', label: 'Cloud', icon: <Cloud size={16} /> },
                { id: 'database', label: 'Data', icon: <Database size={16} /> },
                { id: 'globe', label: 'Web', icon: <Globe size={16} /> },
              ].map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.iconSelectorBtn,
                    categoryFormIcon === item.id && styles.iconSelectorBtnActive,
                  ]}
                  onPress={() => onChangeIcon(item.id)}
                >
                  {React.cloneElement(item.icon, {
                    color: categoryFormIcon === item.id ? colors.primary : colors.textSecondary,
                  })}
                  <Text
                    style={[
                      styles.iconSelectorLabel,
                      categoryFormIcon === item.id && styles.iconSelectorLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.categoryActionRow}>
              {editingCategory && onDelete && (
                <TouchableOpacity
                  style={styles.deleteCategoryBtn}
                  onPress={() => onDelete(editingCategory.id)}
                >
                  <Trash2 size={14} color={colors.danger} />
                  <Text style={styles.deleteCategoryBtnText}>Delete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.saveCategoryBtn, !categoryFormName.trim() && { opacity: 0.5 }]}
                onPress={onSave}
                disabled={!categoryFormName.trim()}
              >
                <Check size={16} color={colors.buttonTextDark} />
                <Text style={styles.saveCategoryBtnText}>
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
      paddingBottom: 32,
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
    categoryFormContent: {
      paddingTop: 16,
      gap: 12,
    },
    inputLabel: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.textMuted,
      letterSpacing: 0.6,
      marginTop: 4,
    },
    textInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 13,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    iconSelectorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    iconSelectorBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    iconSelectorBtnActive: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
    },
    iconSelectorLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    iconSelectorLabelActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    categoryActionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    deleteCategoryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    deleteCategoryBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.danger,
    },
    saveCategoryBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    saveCategoryBtnText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
  });
};
