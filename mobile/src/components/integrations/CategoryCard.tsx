import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Code2,
  Sparkles,
  Cloud,
  Briefcase,
  Database,
  Globe,
  FolderPlus,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { IntegrationCategory, IntegrationItem } from '../../types/integrations';
import { IntegrationItemRow } from './IntegrationItemRow';

interface CategoryCardProps {
  category: IntegrationCategory;
  isExpanded: boolean;
  integrations: Record<string, IntegrationItem>;
  onToggleExpand: (categoryId: string) => void;
  onOpenEditCategory: (category: IntegrationCategory) => void;
  onOpenAddAccount: (category: IntegrationCategory) => void;
  onOpenManage: (integration: IntegrationItem) => void;
  onOpenSetup: (integration: IntegrationItem) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isExpanded,
  integrations,
  onToggleExpand,
  onOpenEditCategory,
  onOpenAddAccount,
  onOpenManage,
  onOpenSetup,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const renderCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'code':
        return <Code2 size={16} color={colors.primary} />;
      case 'sparkles':
        return <Sparkles size={16} color={colors.primary} />;
      case 'cloud':
        return <Cloud size={16} color={colors.primary} />;
      case 'briefcase':
        return <Briefcase size={16} color={colors.primary} />;
      case 'database':
        return <Database size={16} color={colors.primary} />;
      case 'globe':
        return <Globe size={16} color={colors.primary} />;
      default:
        return <FolderPlus size={16} color={colors.primary} />;
    }
  };

  const connectedCount = category.integrationIds.filter(id => {
    const item = integrations[id];
    return item && (item.status === 'connected_mcp' || item.status === 'connected_api');
  }).length;

  return (
    <View style={styles.categoryCard}>
      {/* Category Header */}
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => onToggleExpand(category.id)}
        activeOpacity={0.8}
      >
        {/* Row 1: Icon, Title, Connected Badge, Edit & Chevron */}
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleGroup}>
            <View style={styles.categoryIconCircle}>
              {renderCategoryIcon(category.iconType)}
            </View>
            <Text style={styles.categoryTitle} numberOfLines={1}>
              {category.name}
            </Text>
          </View>

          <View style={styles.headerRightGroup}>
            {/* Connected Count Badge */}
            <View style={[styles.countBadge, connectedCount > 0 && styles.countBadgeActive]}>
              <Text
                style={[styles.countBadgeText, connectedCount > 0 && styles.countBadgeTextActive]}
              >
                {connectedCount > 0 ? `${connectedCount} Connected` : '0 Linked'}
              </Text>
            </View>

            {/* Edit Category Button */}
            <TouchableOpacity
              style={styles.categoryEditIconBtn}
              onPress={e => {
                e.stopPropagation();
                onOpenEditCategory(category);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Pencil size={13} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Expand / Collapse Chevron */}
            <View style={styles.chevronBox}>
              {isExpanded ? (
                <ChevronUp size={16} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={16} color={colors.textSecondary} />
              )}
            </View>
          </View>
        </View>

        {/* Row 2: Description & Add Account Button */}
        <View style={styles.headerBottomRow}>
          <Text style={styles.categorySub} numberOfLines={1}>
            {category.description}
          </Text>

          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={e => {
              e.stopPropagation();
              onOpenAddAccount(category);
            }}
            activeOpacity={0.7}
          >
            <Plus size={11} color={colors.buttonTextDark} />
            <Text style={styles.headerAddBtnText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Expandable Content: List of Accounts */}
      {isExpanded && (
        <View style={styles.categoryBody}>
          {category.integrationIds.length === 0 ? (
            <View style={styles.emptyCategoryBox}>
              <Text style={styles.emptyCategoryTitle}>Category Ready</Text>
              <Text style={styles.emptyCategorySub}>
                No accounts linked yet. Click "+ Add Account" above to link services.
              </Text>
            </View>
          ) : (
            category.integrationIds.map((integrationId, index) => {
              const integration = integrations[integrationId];
              if (!integration) return null;
              const isLast = index === category.integrationIds.length - 1;

              return (
                <IntegrationItemRow
                  key={integration.id}
                  integration={integration}
                  isLast={isLast}
                  onOpenManage={onOpenManage}
                  onOpenSetup={onOpenSetup}
                />
              );
            })
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    categoryCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
      overflow: 'hidden',
      marginBottom: 14,
    },
    categoryHeader: {
      padding: 14,
      gap: 10,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      minWidth: 0,
    },
    categoryIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
    },
    headerRightGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },
    countBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2.5,
      borderRadius: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    countBadgeActive: {
      backgroundColor: 'rgba(0, 229, 153, 0.12)',
    },
    countBadgeText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.textMuted,
    },
    countBadgeTextActive: {
      color: colors.primary,
    },
    categoryEditIconBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chevronBox: {
      width: 20,
      alignItems: 'center',
    },
    headerBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingLeft: 42,
    },
    categorySub: {
      fontSize: 11,
      color: colors.textSecondary,
      flex: 1,
    },
    headerAddBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4.5,
      borderRadius: 7,
      backgroundColor: colors.primary,
      flexShrink: 0,
    },
    headerAddBtnText: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.buttonTextDark,
    },
    categoryBody: {
      borderTopWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    emptyCategoryBox: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
    },
    emptyCategoryTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    emptyCategorySub: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
};
