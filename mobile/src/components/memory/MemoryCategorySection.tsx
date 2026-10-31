import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { MemoryItem } from '../../types/memory';

interface MemoryCategorySectionProps {
  title: string;
  items: MemoryItem[];
  icon: React.ReactNode;
  onEdit: (item: MemoryItem) => void;
  onForget: (id: string) => void;
}

export const MemoryCategorySection: React.FC<MemoryCategorySectionProps> = ({
  title,
  items,
  icon,
  onEdit,
  onForget,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleWithIcon}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Text style={styles.countBadge}>{items.length} facts</Text>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.memoryCard}>
          <Text style={styles.memoryText}>{item.text}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)}>
              <Edit2 size={12} color={colors.primary} />
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => onForget(item.id)}>
              <Trash2 size={12} color={colors.textMuted} />
              <Text style={styles.actionBtnText}>Forget this</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      marginBottom: 20,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitleWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    countBadge: {
      fontSize: 11,
      color: colors.textMuted,
    },
    memoryCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    memoryText: {
      fontSize: 13.5,
      lineHeight: 18,
      color: colors.textPrimary,
      marginBottom: 8,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionBtnText: {
      fontSize: 11,
      color: colors.textMuted,
    },
  });
