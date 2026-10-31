import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface MemorySearchBarProps {
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onClear: () => void;
}

export const MemorySearchBar: React.FC<MemorySearchBarProps> = ({
  searchQuery,
  onChangeSearchQuery,
  onClear,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.searchBar}>
      <Search size={16} color={colors.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search what MIRAS knows..."
        placeholderTextColor={colors.textMuted}
        value={searchQuery}
        onChangeText={onChangeSearchQuery}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={onClear}>
          <X size={15} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    searchInput: {
      flex: 1,
      fontSize: 13.5,
      color: colors.textPrimary,
    },
  });
