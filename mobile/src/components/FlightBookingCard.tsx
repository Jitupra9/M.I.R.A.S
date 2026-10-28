import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plane, ShieldCheck, CheckCircle2, Clock, Volume2, ArrowRight } from 'lucide-react-native';
import { useTheme, ThemeColors } from '../theme/colors';
import { FlightDetails } from '../types';
import { VoiceService } from '../services/voiceService';

interface FlightBookingCardProps {
  flight: FlightDetails;
  onBookingConfirmed?: () => void;
}

export const FlightBookingCard: React.FC<FlightBookingCardProps> = ({ flight, onBookingConfirmed }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isConfirmed, setIsConfirmed] = useState(flight.bookingStatus === 'CONFIRMED');

  const handleAuthorize = () => {
    VoiceService.triggerHaptic('success');
    setIsConfirmed(true);
    if (onBookingConfirmed) onBookingConfirmed();
  };

  const handleReadAloud = () => {
    VoiceService.triggerHaptic('light');
    if (!VoiceService.isMutedMode()) {
      VoiceService.speak(`Flight details: ${flight.airline}, flight ${flight.flightNumber}. Depart ${flight.departureCity} at ${flight.departureTime}, arrive ${flight.arrivalCity} at ${flight.arrivalTime}. Fare ${flight.price}.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Plane size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>Autonomous Flight Booking</Text>
        </View>
        <Text style={styles.sourceTag}>Playwright MCP</Text>
      </View>

      {/* Route Badge */}
      <View style={styles.routeContainer}>
        <View style={styles.cityBlock}>
          <Text style={styles.airportCode}>{flight.departureCode}</Text>
          <Text style={styles.cityName}>{flight.departureCity}</Text>
          <Text style={styles.flightTime}>{flight.departureTime}</Text>
        </View>

        <View style={styles.flightLineCenter}>
          <Text style={styles.durationText}>{flight.duration}</Text>
          <View style={styles.flightBarWrapper}>
            <View style={styles.flightLine} />
            <Plane size={14} color={colors.primary} style={styles.planeIconMid} />
          </View>
          <Text style={styles.nonStopText}>Non-stop Direct</Text>
        </View>

        <View style={[styles.cityBlock, { alignItems: 'flex-end' }]}>
          <Text style={styles.airportCode}>{flight.arrivalCode}</Text>
          <Text style={styles.cityName}>{flight.arrivalCity}</Text>
          <Text style={styles.flightTime}>{flight.arrivalTime}</Text>
        </View>
      </View>

      {/* Airline and Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Airline</Text>
          <Text style={styles.detailValue}>{flight.airline}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Flight No.</Text>
          <Text style={styles.detailValue}>{flight.flightNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cabin / Seat</Text>
          <Text style={styles.detailValue}>{flight.cabinClass} • {flight.seatAssigned}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Fare</Text>
          <Text style={styles.priceHighlight}>{flight.price}</Text>
        </View>
      </View>

      {/* HITL Safety & Action Banner */}
      {!isConfirmed ? (
        <View style={styles.hitlContainer}>
          <View style={styles.hitlHeader}>
            <ShieldCheck size={16} color={colors.warning} />
            <Text style={styles.hitlTitle}>Human-in-the-Loop Authorization</Text>
          </View>
          <Text style={styles.hitlDescription}>
            Fare has been temporarily locked by MIRAS. Sensitive financial transaction requires your approval.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.readButton} onPress={handleReadAloud}>
              <Volume2 size={15} color={colors.primary} />
              <Text style={styles.readButtonText}>Read Details</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.authorizeButton} onPress={handleAuthorize}>
              <CheckCircle2 size={16} color="#070B14" />
              <Text style={styles.authorizeButtonText}>Authorize Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.confirmedContainer}>
          <CheckCircle2 size={18} color={colors.success} />
          <View style={styles.confirmedDetails}>
            <Text style={styles.confirmedTitle}>Ticket Booked & Confirmed</Text>
            <Text style={styles.confirmedSubtitle}>Confirmation: UA-MIRAS-8821 • Boarding pass sent to email</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sourceTag: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.surfaceBorderSubtle,
  },
  cityBlock: {
    flex: 1,
  },
  airportCode: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  cityName: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  flightTime: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  flightLineCenter: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  durationText: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  flightBarWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightLine: {
    position: 'absolute',
    width: '100%',
    height: 1.5,
    backgroundColor: colors.surfaceBorder,
  },
  planeIconMid: {
    transform: [{ rotate: '90deg' }],
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 4,
  },
  nonStopText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priceHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  hitlContainer: {
    backgroundColor: `${colors.warning}14`,
    borderWidth: 1,
    borderColor: `${colors.warning}4D`,
    borderRadius: 12,
    padding: 12,
  },
  hitlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  hitlTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.warning,
  },
  hitlDescription: {
    fontSize: 11.5,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  readButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}1A`,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 9,
    borderRadius: 8,
  },
  readButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  authorizeButton: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.warning,
    paddingVertical: 9,
    borderRadius: 8,
  },
  authorizeButtonText: {
    fontSize: 12,
    color: '#070B14',
    fontWeight: '800',
  },
  confirmedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: `${colors.success}1E`,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 12,
    padding: 12,
  },
  confirmedDetails: {
    flex: 1,
  },
  confirmedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  confirmedSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
