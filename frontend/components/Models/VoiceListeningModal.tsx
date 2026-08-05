import { Mic, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const VoiceListeningModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [tick, setTick] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loop = () => {
      setTick(Date.now());
      tickRef.current = requestAnimationFrame(loop);
    };
    tickRef.current = requestAnimationFrame(loop);

    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;

    const setupAudio = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAudioLevel(average / 255);
          }
          animationRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch {
        /* mic denied */
      }
    };
    setupAudio();

    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/98 backdrop-blur-2xl flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-3 rounded-full bg-secondary/30 hover:bg-secondary/50 border border-border/5 backdrop-blur-sm transition-all duration-300 group"
        style={{ transition: "transform 0.3s" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotate(90deg)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
      >
        <X className="w-5 h-5 text-foreground/60" />
      </button>

      <div className="flex flex-col items-center gap-8 max-w-md w-full px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border border-primary/20 pointer-events-none"
                style={{
                  width: `${120 + i * 20}px`,
                  height: `${120 + i * 20}px`,
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) scale(${1 + audioLevel * (i + 1) * 0.3})`,
                  opacity: Math.max(0, 0.4 - i * 0.15 - audioLevel * 0.1),
                  transition: "transform 0.3s, opacity 0.3s",
                }}
              />
            ))}

            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                animation: "nexus-spin 3s linear infinite",
                background:
                  "conic-linear(from 0deg, var(--color-primary, #3b82f6), transparent)",
              }}
            />

            <div
              className="relative w-32 h-32 rounded-full bg-linear-to-br from-background to-secondary/50 border border-border/10 flex items-center justify-center shadow-2xl"
              style={{
                transform: `scale(${0.95 + audioLevel * 0.05})`,
                transition: "transform 0.2s",
              }}
            >
              <Mic className="w-12 h-12 text-primary/80" />
              {audioLevel > 0.1 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          <div className="flex items-end justify-center gap-1 h-12 w-full">
            {Array.from({ length: 20 }, (_, i) => {
              const h =
                audioLevel > 0.05
                  ? Math.abs(Math.sin(i * 0.5 + tick * 0.005)) *
                      audioLevel *
                      40 +
                    audioLevel * 20
                  : Math.abs(Math.sin(i * 0.5)) * 8 + 8;
              return (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-linear-to-t from-primary to-accent"
                  style={{
                    height: `${Math.max(4, h)}px`,
                    opacity: 0.3 + audioLevel * 0.7,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center space-y-3 w-full">
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-bold bg-linear-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent">
              {audioLevel > 0.1 ? "Listening..." : "Ready to Listen"}
            </p>
            <div className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ animation: `nexus-pulse 1.4s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground/80 flex items-center justify-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${audioLevel > 0.1 ? "bg-green-500 animate-pulse" : "bg-secondary"}`}
            />
            {audioLevel > 0.1 ? "I can hear you clearly" : "Speak now to begin"}
          </p>
        </div>

        <button onClick={onClose} className="group relative w-full max-w-xs">
          <div className="absolute -inset-1 bg-linear-to-r from-red-500 via-rose-500 to-red-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300" />
          <div className="relative flex items-center justify-center gap-3 px-8 py-5 bg-linear-to-r from-red-500/90 to-rose-500/90 text-foreground rounded-2xl font-semibold border border-border/10 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-foreground/80 flex items-center justify-center">
                <div className="w-3 h-3 bg-foreground rounded-sm" />
              </div>
              <div className="absolute inset-0 rounded-full border border-foreground/30 animate-ping" />
            </div>
            <span className="text-lg">Stop Recording</span>
          </div>
        </button>

        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground/60">
          <kbd className="px-2 py-1 bg-secondary/50 border border-border/50 rounded-lg text-[10px] font-mono">
            ESC
          </kbd>
          <span>to cancel</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Click anywhere</span>
        </div>
      </div>

      <style>{`
        @keyframes nexus-pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes nexus-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default memo(VoiceListeningModal);
