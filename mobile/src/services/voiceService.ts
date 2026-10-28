import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

export class VoiceService {
  private static isSpeakingNow = false;
  private static isMuted = false;

  public static setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public static isMutedMode(): boolean {
    return this.isMuted;
  }

  public static async speak(
    text: string,
    options?: {
      onStart?: () => void;
      onDone?: () => void;
      rate?: number;
      pitch?: number;
    }
  ) {
    // If quiet/muted mode is active, do not speak out loud
    if (this.isMuted) {
      if (options?.onDone) options.onDone();
      return;
    }

    try {
      // Stop any active speech first
      await this.stop();

      this.isSpeakingNow = true;
      if (options?.onStart) options.onStart();

      Speech.speak(text, {
        language: 'en-US',
        pitch: options?.pitch ?? 1.05,
        rate: options?.rate ?? 0.98,
        onStart: () => {
          this.isSpeakingNow = true;
          if (options?.onStart) options.onStart();
        },
        onDone: () => {
          this.isSpeakingNow = false;
          if (options?.onDone) options.onDone();
        },
        onStopped: () => {
          this.isSpeakingNow = false;
          if (options?.onDone) options.onDone();
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          this.isSpeakingNow = false;
          if (options?.onDone) options.onDone();
        },
      });
    } catch (e) {
      console.warn('VoiceService speak error:', e);
      this.isSpeakingNow = false;
      if (options?.onDone) options.onDone();
    }
  }

  public static async stop() {
    try {
      this.isSpeakingNow = false;
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }
    } catch (e) {
      console.warn('VoiceService stop error:', e);
    }
  }

  public static async triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
    try {
      if (type === 'light') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'heavy') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (type === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'warning') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {
      // Haptics might not be supported in all environments (e.g. web/simulators)
    }
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingNow;
  }
}
