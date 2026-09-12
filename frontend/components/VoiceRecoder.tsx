"use client";

import React, { memo, useEffect, useRef } from "react";
import { Mic, StopCircle } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const VoiceRecorder = ({
  onTranscript,
  isListening,
  setIsListening,
}: VoiceRecorderProps) => {
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  const isListeningRef = useRef(isListening);

  // Keep callback and listening state refs up to date without triggering effect reruns
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // One-time setup of SpeechRecognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("Web Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        }
      }
      if (finalTranscript.trim()) {
        onTranscriptRef.current(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        alert(
          "Microphone access was denied. Please allow microphone permissions in your browser.",
        );
        setIsListening(false);
      } else if (event.error !== "no-speech") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // If user is still supposed to be listening, resume automatically
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.onend = null;
        recognition.stop();
      } catch {
        // ignore cleanup errors
      }
    };
  }, [setIsListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    } else {
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        // If already started, force restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (isListeningRef.current) recognitionRef.current.start();
          }, 100);
        } catch {}
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isListening
          ? "bg-red-500/20 text-red-500 animate-pulse border border-red-500/30"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? (
        <StopCircle className="w-4 h-4 text-red-500" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};

export default memo(VoiceRecorder);
