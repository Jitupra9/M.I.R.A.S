import { Mic, StopCircle } from "lucide-react";
import { memo, useEffect, useRef } from "react";

const VoiceRecorder = ({
  onTranscript,
  isListening,
  setIsListening,
}: {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}) => {
  const recognitionRef = useRef<unknown>(null);
  const isManualStopRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionInstance.onresult = (event: any) => {
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript;
            onTranscript(transcript);
          }
        };

        recognitionInstance.onerror = (event: { error: string }) => {
          if (event.error !== "aborted") {
            setIsListening(false);
          }
        };

        recognitionInstance.onend = () => {
          if (isManualStopRef.current) {
            isManualStopRef.current = false;
            setIsListening(false);
          } else if (isListening) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (recognitionRef.current as any)?.start();
            } catch {
              setIsListening(false);
            }
          }
        };

        recognitionRef.current = recognitionInstance;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          isManualStopRef.current = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (recognitionRef.current as any).stop();
        } catch {
          // Ignore
        }
      }
    };
  }, [onTranscript, setIsListening, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      isManualStopRef.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop();
      setIsListening(false);
    } else {
      isManualStopRef.current = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).start();
      setIsListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isListening
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
      title={isListening ? "Stop recording" : "Voice input"}
    >
      {isListening ? (
        <StopCircle className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};
export default memo(VoiceRecorder);
