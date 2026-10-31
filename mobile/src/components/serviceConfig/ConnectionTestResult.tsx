import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { ConnectionTestResultData } from '../../data/serviceDefaults';

interface ConnectionTestResultProps {
  testResult: ConnectionTestResultData | null;
}

export const ConnectionTestResult: React.FC<ConnectionTestResultProps> = ({ testResult }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!testResult) return null;

  return (
    <View
      style={[
        styles.testResultBox,
        testResult.success ? styles.testResultBoxSuccess : styles.testResultBoxError,
      ]}
    >
      <View style={styles.testResultHeaderRow}>
        {testResult.success ? (
          <CheckCircle2 size={16} color={colors.success} />
        ) : (
          <AlertCircle size={16} color="#EF4444" />
        )}
        <Text
          style={[
            styles.testResultTitle,
            { color: testResult.success ? colors.success : '#EF4444' },
          ]}
        >
          {testResult.title}
        </Text>
      </View>

      {testResult.details.map((detail, idx) => (
        <Text key={idx} style={styles.testResultDetailText}>
          • {detail}
        </Text>
      ))}

      <Text style={styles.testResultTimestamp}>{testResult.timestamp}</Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    testResultBox: {
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      marginBottom: 14,
      gap: 6,
    },
    testResultBoxSuccess: {
      backgroundColor: 'rgba(0, 229, 153, 0.08)',
      borderColor: 'rgba(0, 229, 153, 0.25)',
    },
    testResultBoxError: {
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.25)',
    },
    testResultHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    testResultTitle: {
      fontSize: 13,
      fontWeight: '700',
    },
    testResultDetailText: {
      fontSize: 11.5,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    testResultTimestamp: {
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 4,
    },
  });
