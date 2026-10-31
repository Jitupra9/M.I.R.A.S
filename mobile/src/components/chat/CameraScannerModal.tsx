import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  X,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Languages,
  ScanText,
} from 'lucide-react-native';
import { ThemeColors, useTheme } from '../../theme/colors';

interface CameraScannerModalProps {
  visible: boolean;
  cameraCaptured: boolean;
  capturedImageUri: string | null;
  cameraError: string | null;
  cameraInitializing: boolean;
  cameraFacing: 'user' | 'environment';
  isScanningAnimation: boolean;
  selectedScanAction: 'ideas' | 'translate' | 'extract' | null;
  scanLaserAnim: Animated.Value;
  onSetVideoRef: (element: any) => void;
  onClose: () => void;
  onToggleFacing: () => void;
  onRetryCamera: () => void;
  onCapturePhoto: () => void;
  onRetakePhoto: () => void;
  onProcessScanAction: (action: 'ideas' | 'translate' | 'extract') => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  visible,
  cameraCaptured,
  capturedImageUri,
  cameraError,
  cameraInitializing,
  cameraFacing,
  isScanningAnimation,
  selectedScanAction,
  scanLaserAnim,
  onSetVideoRef,
  onClose,
  onToggleFacing,
  onRetryCamera,
  onCapturePhoto,
  onRetakePhoto,
  onProcessScanAction,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.cameraBackdrop}>
        <View style={styles.cameraContainer}>
          {/* Camera Header Bar */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity onPress={onClose} style={styles.cameraIconBtn}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.cameraTitleBadge}>
              <View style={styles.cameraLiveDot} />
              <Text style={styles.cameraTitleText}>MIRAS Neural Vision</Text>
            </View>
            <TouchableOpacity style={styles.cameraIconBtn} onPress={onToggleFacing}>
              <RotateCw size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Viewfinder Target Area */}
          <View style={styles.viewfinderFrame}>
            {/* Corner Brackets */}
            <View style={[styles.cornerBracket, styles.bracketTopLeft]} />
            <View style={[styles.cornerBracket, styles.bracketTopRight]} />
            <View style={[styles.cornerBracket, styles.bracketBottomLeft]} />
            <View style={[styles.cornerBracket, styles.bracketBottomRight]} />

            {/* Laser Scanning Animation Overlay */}
            {isScanningAnimation && (
              <Animated.View
                style={[
                  styles.laserLine,
                  {
                    top: scanLaserAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['5%', '90%'],
                    }),
                  },
                ]}
              />
            )}

            {/* Viewfinder Content */}
            {!cameraCaptured ? (
              cameraError ? (
                <View style={styles.cameraErrorBox}>
                  <AlertCircle size={32} color="#FF5252" />
                  <Text style={styles.cameraErrorTitle}>Camera Access Required</Text>
                  <Text style={styles.cameraErrorText}>{cameraError}</Text>
                  <TouchableOpacity style={styles.retryCameraBtn} onPress={onRetryCamera}>
                    <RotateCw size={14} color="#000000" />
                    <Text style={styles.retryCameraBtnText}>Retry Camera</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.liveFinderContent}>
                  {Platform.OS === 'web' && (
                    <video
                      ref={onSetVideoRef as any}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 14,
                        backgroundColor: '#000000',
                        transform: cameraFacing === 'user' ? 'scaleX(-1)' : 'none',
                      } as any}
                    />
                  )}
                  {cameraInitializing && (
                    <View style={styles.cameraStartingBox}>
                      <ActivityIndicator size="small" color="#00FFA3" />
                      <Text style={styles.cameraStartingText}>Connecting live camera...</Text>
                    </View>
                  )}
                </View>
              )
            ) : (
              <View style={styles.capturedPhotoPreview}>
                {capturedImageUri ? (
                  <Image
                    source={{ uri: capturedImageUri }}
                    style={styles.capturedPhotoActual}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.simulatedDocPhoto}>
                    <Text style={styles.simulatedDocTitle}>CON EDISON / GREENWOOD STATEMENT</Text>
                    <Text style={styles.simulatedDocLine}>Date: Oct 2026 • Reference #98421</Text>
                    <Text style={styles.simulatedDocLine}>Total Amount Due: $142.50 / $48.20</Text>
                    <Text style={styles.simulatedDocLine}>Status: Ready for MIRAS AI Analysis</Text>
                  </View>
                )}
                <View style={styles.capturedPillBadge}>
                  <CheckCircle2 size={13} color="#00FFA3" />
                  <Text style={styles.capturedPillText}>Photo Captured</Text>
                </View>
              </View>
            )}

            {/* Scanning Status HUD */}
            {isScanningAnimation && (
              <View style={styles.scanningHudBox}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={styles.scanningHudText}>Scanning image & extracting neural tokens...</Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          {!cameraCaptured ? (
            <View style={styles.cameraShutterRow}>
              <TouchableOpacity
                style={[styles.shutterRingOuter, !!cameraError && { opacity: 0.5 }]}
                onPress={onCapturePhoto}
                disabled={!!cameraError}
              >
                <View style={styles.shutterRingInner} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelCameraBtn}
                onPress={onClose}
              >
                <Text style={styles.cancelCameraBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.aiActionChoicesContainer}>
              <Text style={styles.aiActionTitle}>What would you like MIRAS to do with this image?</Text>

              <View style={styles.aiActionGrid}>
                {/* Choice 1: Scan & Get Ideas */}
                <TouchableOpacity
                  style={[
                    styles.aiActionButton,
                    selectedScanAction === 'ideas' && styles.aiActionButtonSelected,
                  ]}
                  onPress={() => onProcessScanAction('ideas')}
                >
                  <Sparkles size={18} color={colors.primary} />
                  <View style={styles.aiActionCol}>
                    <Text style={styles.aiActionBtnTitle}>💡 Scan & Get Ideas</Text>
                    <Text style={styles.aiActionBtnSub}>Extract context & recommended next steps</Text>
                  </View>
                </TouchableOpacity>

                {/* Choice 2: Translate Content */}
                <TouchableOpacity
                  style={[
                    styles.aiActionButton,
                    selectedScanAction === 'translate' && styles.aiActionButtonSelected,
                  ]}
                  onPress={() => onProcessScanAction('translate')}
                >
                  <Languages size={18} color={colors.primary} />
                  <View style={styles.aiActionCol}>
                    <Text style={styles.aiActionBtnTitle}>🌐 Translate Content</Text>
                    <Text style={styles.aiActionBtnSub}>Detect language and translate text into English</Text>
                  </View>
                </TouchableOpacity>

                {/* Choice 3: Extract & Summarize */}
                <TouchableOpacity
                  style={[
                    styles.aiActionButton,
                    selectedScanAction === 'extract' && styles.aiActionButtonSelected,
                  ]}
                  onPress={() => onProcessScanAction('extract')}
                >
                  <ScanText size={18} color={colors.primary} />
                  <View style={styles.aiActionCol}>
                    <Text style={styles.aiActionBtnTitle}>📝 Extract & Summarize</Text>
                    <Text style={styles.aiActionBtnSub}>Itemize amounts, dates, tables & key bullets</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.actionChoiceBottomBtns}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={onRetakePhoto}
                >
                  <RotateCw size={14} color={colors.primary} />
                  <Text style={styles.retakeBtnText}>Retake Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={onClose}
                >
                  <X size={14} color={colors.textSecondary} />
                  <Text style={styles.removePhotoBtnText}>Remove Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    cameraBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    cameraContainer: {
      width: '100%',
      maxHeight: '92%',
      backgroundColor: '#060E0A',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.3)',
      overflow: 'hidden',
    },
    cameraHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.cardBgSubtle,
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    cameraIconBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraTitleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    cameraLiveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00FFA3',
    },
    cameraTitleText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    viewfinderFrame: {
      height: 260,
      backgroundColor: '#050D09',
      margin: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.2)',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    cornerBracket: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderColor: '#00FFA3',
      zIndex: 10,
    },
    bracketTopLeft: {
      top: 10,
      left: 10,
      borderTopWidth: 3,
      borderLeftWidth: 3,
    },
    bracketTopRight: {
      top: 10,
      right: 10,
      borderTopWidth: 3,
      borderRightWidth: 3,
    },
    bracketBottomLeft: {
      bottom: 10,
      left: 10,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
    },
    bracketBottomRight: {
      bottom: 10,
      right: 10,
      borderBottomWidth: 3,
      borderRightWidth: 3,
    },
    laserLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: '#00FFA3',
      shadowColor: '#00FFA3',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 8,
      zIndex: 12,
    },
    liveFinderContent: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 16,
    },
    cameraStartingBox: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      zIndex: 2,
    },
    cameraStartingText: {
      fontSize: 12,
      color: '#A0AEC0',
      fontWeight: '600',
    },
    capturedPhotoPreview: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: 16,
    },
    simulatedDocPhoto: {
      width: '90%',
      backgroundColor: '#12231B',
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.25)',
      gap: 4,
    },
    simulatedDocTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primary,
    },
    simulatedDocLine: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    capturedPillBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(0, 229, 153, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 10,
    },
    capturedPillText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#00FFA3',
    },
    scanningHudBox: {
      position: 'absolute',
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: 'rgba(6, 14, 10, 0.85)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(0, 229, 153, 0.4)',
      zIndex: 20,
    },
    scanningHudText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    cameraShutterRow: {
      alignItems: 'center',
      paddingVertical: 18,
    },
    shutterRingOuter: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 4,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shutterRingInner: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
    },
    cancelCameraBtn: {
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    cancelCameraBtnText: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: '600',
    },
    cameraErrorBox: {
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    cameraErrorTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FF5252',
      textAlign: 'center',
    },
    cameraErrorText: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    retryCameraBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 8,
    },
    retryCameraBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#000000',
    },
    capturedPhotoActual: {
      width: '100%',
      height: 240,
      borderRadius: 12,
    },
    aiActionChoicesContainer: {
      padding: 16,
      paddingTop: 4,
      gap: 10,
    },
    aiActionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    aiActionGrid: {
      gap: 8,
    },
    aiActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.cardBg,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.surfaceBorderSubtle,
    },
    aiActionButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: 'rgba(0, 229, 153, 0.1)',
    },
    aiActionCol: {
      flex: 1,
    },
    aiActionBtnTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    aiActionBtnSub: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 2,
    },
    actionChoiceBottomBtns: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      marginTop: 14,
    },
    retakeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
    },
    retakeBtnText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
    },
    removePhotoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    removePhotoBtnText: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.textSecondary,
    },
  });
};
