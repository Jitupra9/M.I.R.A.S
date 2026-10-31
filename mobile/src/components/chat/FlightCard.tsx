import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plane, Eye, EyeOff } from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';
import { FlightData } from '../../types/chat';

interface FlightCardProps {
  flightData: FlightData;
  isExpanded?: boolean;
  onToggleExpand: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flightData,
  isExpanded,
  onToggleExpand,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.flightCard}>
      <View style={styles.flightHeader}>
        <View style={styles.flightAirlineGroup}>
          <Plane size={16} color={colors.primary} />
          <View style={styles.flightAirlineTextCol}>
            <Text style={styles.flightAirlineText} numberOfLines={1}>
              {flightData.airline} #{flightData.flightNumber}
            </Text>
            <Text style={styles.flightRouteText} numberOfLines={1}>
              {flightData.departureCity} ➔ {flightData.arrivalCity}
            </Text>
          </View>
        </View>
        <View style={styles.flightPricePill}>
          <Text style={styles.flightPriceText}>{flightData.price}</Text>
        </View>
      </View>

      {/* See More Toggle */}
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
            <Text style={styles.expandToggleText}>See More (Seats, Terminal & Gate)</Text>
          </>
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContentBox}>
          <View style={styles.flightDetailsGrid}>
            <View style={styles.flightGridCol}>
              <Text style={styles.flightGridLabel}>DEPARTURE</Text>
              <Text style={styles.flightGridVal}>{flightData.departureTime}</Text>
              <Text style={styles.flightGridSub}>{flightData.terminal} • {flightData.gate}</Text>
            </View>
            <View style={styles.flightGridCol}>
              <Text style={styles.flightGridLabel}>ARRIVAL</Text>
              <Text style={styles.flightGridVal}>{flightData.arrivalTime}</Text>
              <Text style={styles.flightGridSub}>Assigned: {flightData.seat}</Text>
            </View>
          </View>

          <View style={styles.baggageNoteBox}>
            <Text style={styles.baggageNoteText}>🧳 {flightData.baggage}</Text>
          </View>

          <View style={styles.flightStatusBadge}>
            <View style={styles.amberDot} />
            <Text style={styles.flightStatusBadgeText}>{flightData.status}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => {
  const isDay = colors.name === 'midnight-day';
  return StyleSheet.create({
    flightCard: {
      backgroundColor: isDay ? '#F1F5F9' : 'rgba(0, 0, 0, 0.3)',
      borderRadius: 14,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: isDay ? '#E2E8F0' : colors.surfaceBorderSubtle,
      overflow: 'hidden',
    },
    flightHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    flightAirlineGroup: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    flightAirlineTextCol: {
      flex: 1,
      minWidth: 0,
    },
    flightAirlineText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    flightRouteText: {
      fontSize: 11,
      color: colors.primary,
      marginTop: 1,
    },
    flightPricePill: {
      backgroundColor: 'rgba(0, 229, 153, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      flexShrink: 0,
    },
    flightPriceText: {
      fontSize: 12,
      fontWeight: '800',
      color: colors.primary,
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
    flightDetailsGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    flightGridCol: {
      flex: 1,
      backgroundColor: isDay ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
      borderRadius: 8,
      padding: 8,
      borderWidth: isDay ? 1 : 0,
      borderColor: '#E2E8F0',
      gap: 2,
    },
    flightGridLabel: {
      fontSize: 9,
      fontWeight: '800',
      color: colors.textMuted,
    },
    flightGridVal: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    flightGridSub: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    baggageNoteBox: {
      backgroundColor: isDay ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
      borderRadius: 8,
      padding: 8,
      borderWidth: isDay ? 1 : 0,
      borderColor: '#E2E8F0',
    },
    baggageNoteText: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    flightStatusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 8,
    },
    amberDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#F59E0B',
    },
    flightStatusBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F59E0B',
    },
  });
};
