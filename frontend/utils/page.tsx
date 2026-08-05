"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Menu,
  Plus,
  Send,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  User,
  Bot,
  Leaf,
  ChevronRight,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Upload,
  File,
  Mic,
  StopCircle,
  ChevronDown,
  Cpu,
  LogIn,
  Settings,
  Crown,
  Zap,
  Search,
  FolderPlus,
  Globe,
  Code,
  Check,
  MoreHorizontal,
  Edit3,
  Copy,
  Pin,
  Archive,
  Keyboard,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  EyeOff,
  Mail,
  MessageCircle,
  Download,
  Share2,
  RefreshCw,
  Star,
  History,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  RotateCcw,
} from "lucide-react";

// ============ TypeScript Declarations ============
declare global {
  interface Window {
    SpeechRecognition: unknown;
    webkitSpeechRecognition: unknown;
  }
}

// ============ Types ============
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  model?: string;
  isFavorite?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
};

type Attachment = {
  id: string;
  type: "image" | "document" | "code";
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  modelId: string;
  projectId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
};

type UploadedFile = {
  id: string;
  file: File;
  type: "image" | "document" | "code";
  preview: string;
  name: string;
  size: number;
  content?: string;
};

type CodeSnippet = {
  id: string;
  name: string;
  language: string;
  content: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  chatCount: number;
};

type AIModel = {
  id: string;
  name: string;
  provider: "gemini" | "openai" | "ollama" | "huggingface";
  description: string;
  icon: string;
};

// ============ Available AI Models ============
const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    provider: "gemini",
    description: "Advanced reasoning",
    icon: "✨",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "gemini",
    description: "Fast responses",
    icon: "⚡",
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "gemini",
    description: "Latest flash",
    icon: "🚀",
  },
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
    description: "Most capable",
    icon: "🧠",
  },
  {
    id: "gpt-5.1",
    name: "GPT-5.1",
    provider: "openai",
    description: "Advanced reasoning",
    icon: "🎯",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Omnimodal",
    icon: "🌐",
  },
  {
    id: "deepseek-v3.1:671b",
    name: "DeepSeek V3.1",
    provider: "ollama",
    description: "671B parameters",
    icon: "🏠",
  },
  {
    id: "llama3.2:latest",
    name: "Llama 3.2",
    provider: "ollama",
    description: "Meta&apos;s LLM",
    icon: "🦙",
  },
  {
    id: "meta-llama/Llama-3.3-70B",
    name: "Llama 3.3 70B",
    provider: "huggingface",
    description: "High performance",
    icon: "🤗",
  },
  {
    id: "mistralai/Mixtral-8x7B",
    name: "Mixtral 8x7B",
    provider: "huggingface",
    description: "Mixture of experts",
    icon: "🎭",
  },
];

const PROJECT_COLORS = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-emerald-500" },
  { name: "Purple", value: "bg-violet-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Cyan", value: "bg-cyan-500" },
];

// ============ Mock AI Response ============
const getAIResponse = async (
  userQuery: string,
  attachments: Attachment[],
  model: AIModel,
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let attachmentContext = "";
  if (attachments.length > 0) {
    attachmentContext = `\n\n📎 **Files analyzed:** ${attachments.map((a) => a.name).join(", ")}\n`;
    if (attachments.some((a) => a.type === "image")) {
      attachmentContext += `🖼️ I've analyzed the image(s) you shared. `;
    }
    if (attachments.some((a) => a.type === "document")) {
      attachmentContext += `📄 I've processed the document(s) content. `;
    }
  }

  const responses = [
    `Using **${model.name}** (${model.provider.toUpperCase()})${attachmentContext}\n\nGreat question! Based on my analysis, here's my response to "${userQuery.slice(0, 80)}${userQuery.length > 80 ? "..." : ""}"\n\nThe key points to consider are understanding your specific needs, evaluating different approaches, and finding optimal solutions. Would you like me to elaborate further?`,
    `**${model.name}** here!${attachmentContext}\n\nI appreciate your question. The most important factors to keep in mind include practical implementation strategies, potential challenges, and best practices from industry standards.\n\nDoes this help answer your question?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// ============ Voice Listening Modal ============
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

// ============ Voice Recorder Component ============
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

// ============ Model Selector ============
const ModelSelector = ({
  selectedModel,
  onModelChange,
}: {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedModels = AVAILABLE_MODELS.reduce(
    (acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = [];
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>,
  );

  const providerColors: Record<string, string> = {
    gemini: "text-blue-400",
    openai: "text-emerald-400",
    ollama: "text-orange-400",
    huggingface: "text-pink-400",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all duration-300"
      >
        <span className="text-base">{selectedModel.icon}</span>
        <span className="font-medium text-foreground hidden sm:block">
          {selectedModel.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 max-h-96 overflow-y-auto backdrop-blur-xl">
          <div className="p-2">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${providerColors[provider]} bg-current`}
                  ></span>
                  <span>{provider}</span>
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      selectedModel.id === model.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{model.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                      {selectedModel.id === model.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Pending Attachment Preview ============
const PendingAttachment = ({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) => {
  return (
    <div className="relative group inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-xl px-3 py-2 text-sm border border-border/50">
      {file.type === "image" ? (
        <img
          src={file.preview}
          alt={file.name}
          className="w-8 h-8 rounded-lg object-cover"
        />
      ) : file.type === "code" ? (
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Code className="w-4 h-4 text-accent" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
      )}
      <span className="text-xs text-foreground max-w-24 truncate">
        {file.name}
      </span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-destructive/20 hover:bg-destructive/30 text-destructive transition-all duration-200"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

// ============ Code Snippet Box ============
const CodeSnippetBox = ({
  snippet,
  onRemove,
}: {
  snippet: CodeSnippet;
  onRemove: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = snippet.content.split("\n").length;

  return (
    <div className="bg-secondary/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/80 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-foreground">
            {snippet.name}
          </span>
          <span className="text-xs text-muted-foreground">{lines} lines</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      {isExpanded && (
        <pre className="p-3 text-xs overflow-x-auto max-h-40 overflow-y-auto">
          <code className="text-foreground/80">{snippet.content}</code>
        </pre>
      )}
    </div>
  );
};

// ============ Message Component (ChatGPT-style always-visible actions) ============
const ChatMessage = ({
  message,
  onCopy,
  onRegenerate,
  onToggleFavorite,
  onEdit,
  onResend,
  onLike,
  onDislike,
  isFavorite,
  isLastAssistant,
}: {
  message: Message;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
  onToggleFavorite?: () => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onResend?: (messageId: string) => void;
  onLike?: (messageId: string) => void;
  onDislike?: (messageId: string) => void;
  isFavorite?: boolean;
  isLastAssistant?: boolean;
}) => {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      editRef.current.style.height = "auto";
      editRef.current.style.height = editRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex gap-4 py-6 px-4 md:px-6 ${!isUser && "bg-secondary/20"}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
          isUser
            ? "bg-linear-to-br from-primary to-accent text-primary-foreground"
            : "bg-linear-to-br from-secondary to-muted text-foreground"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 space-y-2 max-w-3xl">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-sm">
            {isUser ? "You" : "MindLeaf"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.model && !isUser && (
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
              {message.model}
            </span>
          )}
          {isFavorite && (
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {message.attachments.map((att) =>
              att.type === "image" ? (
                <img
                  key={att.id}
                  src={att.url}
                  alt={att.name}
                  className="max-w-48 max-h-36 rounded-xl object-cover shadow-lg"
                />
              ) : (
                <div
                  key={att.id}
                  className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 border border-border"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm">{att.name}</span>
                </div>
              ),
            )}
          </div>
        )}

        {/* Message content or edit mode */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              ref={editRef}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                }
                if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none min-h-15 leading-relaxed"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
              >
                Save & Submit
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 bg-secondary border border-border rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}

        {/* Always-visible action buttons (ChatGPT style) */}
        {!isEditing && (
          <div className="flex items-center gap-1 pt-1">
            {/* Copy - for both user and assistant */}
            <button
              onClick={() => onCopy(message.content)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* User message actions */}
            {isUser && (
              <>
                {/* Edit */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit message"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Resend */}
                {onResend && (
                  <button
                    onClick={() => onResend(message.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title="Resend message"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            {/* Assistant message actions */}
            {!isUser && (
              <>
                {/* Like */}
                {onLike && (
                  <button
                    onClick={() => onLike(message.id)}
                    className={`p-1.5 rounded-lg hover:bg-secondary transition-colors ${
                      message.isLiked
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${message.isLiked ? "fill-current" : ""}`}
                    />
                  </button>
                )}

                {/* Dislike */}
                {onDislike && (
                  <button
                    onClick={() => onDislike(message.id)}
                    className={`p-1.5 rounded-lg hover:bg-secondary transition-colors ${
                      message.isDisliked
                        ? "text-destructive"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Bad response"
                  >
                    <ThumbsDown
                      className={`w-3.5 h-3.5 ${message.isDisliked ? "fill-current" : ""}`}
                    />
                  </button>
                )}

                {/* Regenerate (only for last assistant message) */}
                {isLastAssistant && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    title="Regenerate response"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            {/* Favorite - for both */}
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`p-1.5 rounded-lg hover:bg-secondary transition-colors ${
                  isFavorite
                    ? "text-yellow-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Star
                  className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ Typing Indicator ============
const TypingIndicator = () => (
  <div className="flex gap-4 py-6 px-4 md:px-6 bg-secondary/20">
    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-secondary to-muted flex items-center justify-center shadow-lg">
      <Bot className="w-4 h-4" />
    </div>
    <div className="flex-1 flex items-center">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
      </div>
    </div>
  </div>
);

// ============ File Upload Modal ============
const FileUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: file.type.startsWith("image/") ? "image" : "document",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      name: file.name,
      size: file.size,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Click to upload</p>
          <p className="text-xs text-muted-foreground mt-2">
            Images, PDF, TXT (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-3">
              {selectedFiles.length} file(s) selected
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-secondary rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "image" ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium truncate max-w-36">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {"Add"}{" "}
            {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Code Input Modal ============
const CodeInputModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (snippet: CodeSnippet) => void;
}) => {
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");

  const detectLanguage = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      go: "go",
      rs: "rust",
      java: "java",
      cpp: "cpp",
      c: "c",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
      sql: "sql",
      sh: "shell",
      yaml: "yaml",
      yml: "yaml",
    };
    return langMap[ext] || "text";
  };

  const handleAdd = () => {
    if (!code.trim()) return;
    const name = filename.trim() || `snippet-${Date.now()}.txt`;
    onAdd({
      id: `code-${Date.now()}`,
      name,
      language: detectLanguage(name),
      content: code,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Add Code Snippet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Filename (optional)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. component.tsx"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1 min-h-0">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Paste your code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!code.trim()}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            Add Code
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Project Modal ============
const ProjectModal = ({
  isOpen,
  onClose,
  onSave,
  editProject,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, "id" | "createdAt" | "chatCount">) => void;
  editProject?: Project | null;
}) => {
  const [name, setName] = useState(editProject?.name || "");
  const [description, setDescription] = useState(
    editProject?.description || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    editProject?.color || PROJECT_COLORS[0].value,
  );

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setSelectedColor(editProject.color);
    } else {
      setName("");
      setDescription("");
      setSelectedColor(PROJECT_COLORS[0].value);
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">
            {editProject ? "Edit Project" : "Create Project"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome project"
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Color
            </label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-primary ring-offset-card"
                      : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name, description, color: selectedColor });
                onClose();
              }
            }}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {editProject ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Settings Modal ============
const SettingsModal = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<
    "general" | "account" | "shortcuts" | "contact"
  >("general");

  if (!isOpen) return null;

  const tabs = [
    { id: "general" as const, label: "General", icon: Settings },
    { id: "account" as const, label: "Account", icon: User },
    { id: "shortcuts" as const, label: "Shortcuts", icon: Keyboard },
    { id: "contact" as const, label: "Contact Us", icon: Mail },
  ];

  const shortcuts = [
    { keys: ["⌘", "K"], description: "Open search" },
    { keys: ["⌘", "N"], description: "New chat" },
    { keys: ["⌘", "B"], description: "Toggle sidebar" },
    { keys: ["⌘", "Enter"], description: "Send message" },
    { keys: ["⌘", "/"], description: "Focus input" },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-bold">Settings</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex min-h-100">
          <div className="w-48 border-r border-border p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}

            <Link
              href="/instructions"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-secondary text-muted-foreground mt-2 border-t border-border pt-4"
            >
              <BookOpen className="w-4 h-4" />
              Instructions & Guide
            </Link>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Appearance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Theme</p>
                        <p className="text-xs text-muted-foreground">
                          Choose light or dark mode
                        </p>
                      </div>
                      <button
                        onClick={onToggleTheme}
                        className="flex items-center gap-2 px-3 py-2 bg-secondary border border-border rounded-xl text-sm hover:bg-secondary/80 transition-colors"
                      >
                        {isDark ? (
                          <>
                            <Moon className="w-4 h-4" />
                            Dark
                          </>
                        ) : (
                          <>
                            <Sun className="w-4 h-4" />
                            Light
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Chat</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Send with Enter</p>
                        <p className="text-xs text-muted-foreground">
                          Press Enter to send messages
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 accent-primary"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    G
                  </div>
                  <div>
                    <p className="font-semibold">Guest User</p>
                    <p className="text-sm text-muted-foreground">
                      Sign in to sync your chats
                    </p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            )}

            {activeTab === "shortcuts" && (
              <div className="space-y-3">
                {shortcuts.map((shortcut, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <kbd
                          key={j}
                          className="px-2 py-1 bg-secondary border border-border rounded-lg text-xs font-mono"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Get in Touch</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Have questions, feedback, or need assistance? We&apos;d love
                    to hear from you.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href="mailto:support@mindleaf.ai"
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">
                        support@mindleaf.ai
                      </p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Live Chat</p>
                      <p className="text-xs text-muted-foreground">
                        Chat with our support team
                      </p>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Help Center</p>
                      <p className="text-xs text-muted-foreground">
                        Browse FAQs and guides
                      </p>
                    </div>
                  </a>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Response time: Usually within 24 hours
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Search Modal ============
const SearchModal = ({
  isOpen,
  onClose,
  chats,
  onSelectChat,
}: {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatSession[];
  onSelectChat: (id: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setQuery("");
  }, [isOpen]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(query.toLowerCase()) ||
      chat.messages.some((m) =>
        m.content.toLowerCase().includes(query.toLowerCase()),
      ),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-[10vh]">
      <div className="bg-card rounded-2xl w-full max-w-xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search previous chat"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
            title="Close search"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {query ? "No results found" : "Start typing to search"}
            </div>
          ) : (
            <div className="p-2">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.messages.length} messages •{" "}
                      {chat.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ Upgrade Modal ============
const UpgradeModal = ({ onClose }: { onClose: () => void }) => {
  const plans = [
    {
      name: "Pro",
      price: "$20",
      period: "/month",
      features: [
        "Unlimited chats",
        "Priority support",
        "Advanced models",
        "File uploads up to 100MB",
      ],
      popular: true,
    },
    {
      name: "Team",
      price: "$50",
      period: "/month",
      features: [
        "Everything in Pro",
        "5 team members",
        "Shared workspace",
        "Admin controls",
        "Analytics",
      ],
      popular: false,
    },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-muted-foreground text-sm mb-6">
            Unlock the full potential of MindLeaf with our premium plans.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 ${
                  plan.popular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {"Get"} {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Delete Confirmation Modal ============
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-sm w-full p-6 border border-border shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Chat Context Menu ============
const ChatContextMenu = ({
  chat,
  onRename,
  onPin,
  onArchive,
  onDelete,
  onExport,
  onClose,
  position,
}: {
  chat: ChatSession;
  onRename: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClose: () => void;
  position: { x: number; y: number };
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { icon: Edit3, label: "Rename", action: onRename },
    { icon: Pin, label: chat.isPinned ? "Unpin" : "Pin", action: onPin },
    {
      icon: Archive,
      label: chat.isArchived ? "Unarchive" : "Archive",
      action: onArchive,
    },
    { icon: Download, label: "Export Chat", action: onExport },
    { icon: Trash2, label: "Delete", action: onDelete, destructive: true },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-card border border-border rounded-xl shadow-2xl py-1 z-50 min-w-40"
      style={{ top: position.y, left: position.x }}
    >
      {menuItems.map((item, i) => (
        <button
          key={i}
          onClick={() => {
            item.action();
            onClose();
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors ${
            "destructive" in item && item.destructive ? "text-destructive" : ""
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ============ Header Component ============
const Header = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenSettings,
  isTemporaryChat,
  onToggleTemporaryChat,
}: {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isTemporaryChat: boolean;
  onToggleTemporaryChat: () => void;
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-secondary transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm text-muted-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search previous chat</span>
            <kbd className="ml-4 px-1.5 py-0.5 bg-background border border-border rounded text-xs">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative group">
            <button
              onClick={onToggleTemporaryChat}
              className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isTemporaryChat
                  ? "bg-accent/20 text-accent"
                  : "hover:bg-secondary text-muted-foreground"
              }`}
            >
              <EyeOff className="w-5 h-5" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              {isTemporaryChat
                ? "Temporary chat ON - History won't be saved"
                : "Open temporary chat"}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-8 border border-border shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to MindLeaf</h2>
              <p className="text-muted-foreground text-sm mt-2">
                Sign in to unlock all features
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full mt-2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Sign In
              </button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-secondary transition-colors text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-secondary transition-colors text-sm font-medium">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============ Sidebar Component ============
const ChatSidebar = ({
  chats,
  currentChatId,
  projects,
  currentProjectId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onArchiveChat,
  onExportChat,
  onClearAllChats,
  isOpen,
  onToggle,
  onUpgradeClick,
  showUpgradeBanner,
  onCloseUpgradeBanner,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onSelectProject,
  isCollapsed,
  onToggleCollapse,
}: {
  chats: ChatSession[];
  currentChatId: string | null;
  projects: Project[];
  currentProjectId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onPinChat: (id: string) => void;
  onArchiveChat: (id: string) => void;
  onExportChat: (id: string) => void;
  onClearAllChats: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onUpgradeClick?: () => void;
  showUpgradeBanner?: boolean;
  onCloseUpgradeBanner?: () => void;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onSelectProject: (id: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const [contextMenu, setContextMenu] = useState<{
    chat: ChatSession;
    position: { x: number; y: number };
  } | null>(null);
  const [projectMenuOpen, setProjectMenuOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"chats" | "projects">(
    "chats",
  );

  const filteredChats = chats.filter((c) => {
    if (currentProjectId) return c.projectId === currentProjectId;
    return !c.isArchived;
  });

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-16 bg-sidebar border-r border-sidebar-border flex-col h-full">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-center">
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl bg-sidebar-accent hover:bg-primary/20 flex items-center justify-center transition-all"
            title="Expand sidebar"
          >
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center p-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl transition-all shadow-lg shadow-primary/20"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="px-2 py-1">
          <button
            onClick={onCreateProject}
            className="w-full flex items-center justify-center p-3 hover:bg-sidebar-accent rounded-xl transition-colors text-muted-foreground hover:text-foreground"
            title="Create Project"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1" />
        <div className="p-2 border-t border-sidebar-border">
          <button
            className="w-full flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-xl transition-colors"
            title="Guest User"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              G
            </div>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-72"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-base">MindLeaf</h1>
              <p className="text-xs text-muted-foreground">
                Intelligent Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-2 rounded-xl hover:bg-sidebar-accent transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onToggle}
              className="p-2 rounded-xl hover:bg-sidebar-accent transition-colors md:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-medium text-sm transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex rounded-xl bg-sidebar-accent/50 p-1">
            <button
              onClick={() => {
                setActiveSection("chats");
                onSelectProject(null);
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                activeSection === "chats"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveSection("projects")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                activeSection === "projects"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {activeSection === "chats" ? (
            <>
              {pinnedChats.length > 0 && (
                <>
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </p>
                  <div className="space-y-0.5 mb-3">
                    {pinnedChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                          currentChatId === chat.id
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }`}
                        onClick={() => onSelectChat(chat.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            chat,
                            position: { x: e.clientX, y: e.clientY },
                          });
                        }}
                      >
                        <span className="flex-1 text-sm truncate">
                          {chat.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({
                              chat,
                              position: { x: e.clientX, y: e.clientY },
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </p>
                {regularChats.length > 0 && (
                  <button
                    onClick={onClearAllChats}
                    className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Clear all chats"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {regularChats.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {regularChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        currentChatId === chat.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                      onClick={() => onSelectChat(chat.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          chat,
                          position: { x: e.clientX, y: e.clientY },
                        });
                      }}
                    >
                      <span className="flex-1 text-sm truncate">
                        {chat.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({
                            chat,
                            position: { x: e.clientX, y: e.clientY },
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Projects
                </p>
                <button
                  onClick={onCreateProject}
                  className="p-1 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Create Project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <FolderPlus className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No projects yet</p>
                  <button
                    onClick={onCreateProject}
                    className="text-xs mt-2 text-primary hover:underline"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {projects.map((project) => (
                    <div key={project.id} className="relative group">
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          setActiveSection("chats");
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          currentProjectId === project.id
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-sm ${project.color}`}
                        ></div>
                        <span className="flex-1 text-left truncate">
                          {project.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.chatCount}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectMenuOpen(
                            projectMenuOpen === project.id ? null : project.id,
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {projectMenuOpen === project.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl py-1 z-50 min-w-32">
                          <button
                            onClick={() => {
                              onEditProject(project);
                              setProjectMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDeleteProject(project.id);
                              setProjectMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {showUpgradeBanner && (
          <div className="p-3 ">
            <div className="relative bg-linear-to-br from-primary/10 to-accent/10 rounded-xl p-3 border border-primary/20">
              <button
                onClick={onCloseUpgradeBanner}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Unlock unlimited chats & more
              </p>
              <button
                onClick={onUpgradeClick}
                className="w-full flex items-center justify-center gap-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
              >
                <Zap className="w-3 h-3" />
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button className="w-full flex items-center gap-2 hover:bg-sidebar-accent px-2 py-2 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              G
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Guest User</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </aside>

      {contextMenu && (
        <ChatContextMenu
          chat={contextMenu.chat}
          position={contextMenu.position}
          onRename={() => {
            const newTitle = prompt("Enter new title:", contextMenu.chat.title);
            if (newTitle) onRenameChat(contextMenu.chat.id, newTitle);
          }}
          onPin={() => onPinChat(contextMenu.chat.id)}
          onArchive={() => onArchiveChat(contextMenu.chat.id)}
          onExport={() => onExportChat(contextMenu.chat.id)}
          onDelete={() => onDeleteChat(contextMenu.chat.id)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};

// ============ Main Component ============
export default function Home() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel>(
    AVAILABLE_MODELS[0],
  );
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    type: "chat" | "project";
    id: string;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const savedChats = localStorage.getItem("nexus-chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        const restored = parsed.map((chat: ChatSession) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            attachments: msg.attachments || [],
          })),
        }));
        setChats(restored);
        if (restored.length > 0) setCurrentChatId(restored[0].id);
      } catch {
        // ignore
      }
    }

    const savedProjects = localStorage.getItem("nexus-projects");
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(
          parsed.map((p: Project) => ({
            ...p,
            createdAt: new Date(p.createdAt),
          })),
        );
      } catch {
        // ignore
      }
    }

    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  useEffect(() => {
    if (chats.length > 0)
      localStorage.setItem("nexus-chats", JSON.stringify(chats));
    else localStorage.removeItem("nexus-chats");
  }, [chats]);

  useEffect(() => {
    if (projects.length > 0)
      localStorage.setItem("nexus-projects", JSON.stringify(projects));
    else localStorage.removeItem("nexus-projects");
  }, [projects]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setIsSearchOpen(true);
        } else if (e.key === "n") {
          e.preventDefault();
          createNewChat();
        } else if (e.key === "b") {
          e.preventDefault();
          setIsSidebarCollapsed((prev) => !prev);
        }
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      modelId: selectedModel.id,
      projectId: currentProjectId || undefined,
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setPendingFiles([]);
    setInputValue("");
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [selectedModel.id, currentProjectId]);

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChatId === id) {
      const remaining = chats.filter((c) => c.id !== id);
      setCurrentChatId(remaining[0]?.id || null);
    }
  };

  const renameChat = (id: string, title: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, title } : chat)),
    );
  };

  const pinChat = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat,
      ),
    );
  };

  const archiveChat = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, isArchived: !chat.isArchived } : chat,
      ),
    );
  };

  const exportChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;

    const exportData = {
      title: chat.title,
      exportedAt: new Date().toISOString(),
      messages: chat.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
        model: m.model,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChatId(null);
  };

  const toggleFavoriteMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, isFavorite: !msg.isFavorite }
                  : msg,
              ),
            }
          : chat,
      ),
    );
  };

  const likeMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, isLiked: !msg.isLiked, isDisliked: false }
                  : msg,
              ),
            }
          : chat,
      ),
    );
  };

  const dislikeMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, isDisliked: !msg.isDisliked, isLiked: false }
                  : msg,
              ),
            }
          : chat,
      ),
    );
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!currentChatId || isLoading) return;

    // Find the message index
    const chat = chats.find((c) => c.id === currentChatId);
    if (!chat) return;
    const msgIndex = chat.messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    // Update the message content and remove all messages after it
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.slice(0, msgIndex).concat({
                ...c.messages[msgIndex],
                content: newContent,
              }),
              updatedAt: new Date(),
            }
          : c,
      ),
    );

    // Regenerate the response
    setIsLoading(true);
    const aiResponse = await getAIResponse(
      newContent,
      chat.messages[msgIndex].attachments || [],
      selectedModel,
    );

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      model: selectedModel.name,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: new Date(),
            }
          : c,
      ),
    );
    setIsLoading(false);
  };

  const resendMessage = async (messageId: string) => {
    if (!currentChatId || isLoading) return;

    const chat = chats.find((c) => c.id === currentChatId);
    if (!chat) return;
    const msgIndex = chat.messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    const userMsg = chat.messages[msgIndex];

    // Remove all messages after this user message
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.slice(0, msgIndex + 1),
              updatedAt: new Date(),
            }
          : c,
      ),
    );

    // Regenerate the response
    setIsLoading(true);
    const aiResponse = await getAIResponse(
      userMsg.content,
      userMsg.attachments || [],
      selectedModel,
    );

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      model: selectedModel.name,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: new Date(),
            }
          : c,
      ),
    );
    setIsLoading(false);
  };

  const regenerateResponse = async () => {
    if (!currentChatId || isLoading) return;
    const chat = chats.find((c) => c.id === currentChatId);
    if (!chat || chat.messages.length < 2) return;

    const lastUserMsgIndex = [...chat.messages]
      .reverse()
      .findIndex((m) => m.role === "user");
    if (lastUserMsgIndex === -1) return;

    const lastUserMsg =
      chat.messages[chat.messages.length - 1 - lastUserMsgIndex];

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: c.messages.slice(0, -1),
            }
          : c,
      ),
    );

    setIsLoading(true);
    const aiResponse = await getAIResponse(
      lastUserMsg.content,
      lastUserMsg.attachments || [],
      selectedModel,
    );

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      model: selectedModel.name,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: [...c.messages, assistantMessage],
              updatedAt: new Date(),
            }
          : c,
      ),
    );
    setIsLoading(false);
  };

  const createProject = (
    data: Omit<Project, "id" | "createdAt" | "chatCount">,
  ) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      chatCount: 0,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (
    data: Omit<Project, "id" | "createdAt" | "chatCount">,
  ) => {
    if (!editingProject) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p)),
    );
    setEditingProject(null);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setChats((prev) =>
      prev.map((c) =>
        c.projectId === id ? { ...c, projectId: undefined } : c,
      ),
    );
    if (currentProjectId === id) setCurrentProjectId(null);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const sendMessage = async () => {
    if ((!inputValue.trim() && pendingFiles.length === 0) || isLoading) return;

    const attachments: Attachment[] = pendingFiles.map((file) => ({
      id: file.id,
      type: file.type,
      name: file.name,
      url: file.preview,
      size: file.size,
    }));
    const userQuery =
      inputValue.trim() ||
      (attachments.length > 0 ? "Can you analyze these files?" : "");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuery,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    let targetChatId = currentChatId;
    if (!targetChatId) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: userQuery.slice(0, 30) || "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        modelId: selectedModel.id,
        projectId: currentProjectId || undefined,
      };
      setChats((prev) => [newChat, ...prev]);
      targetChatId = newChat.id;
      setCurrentChatId(newChat.id);
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === targetChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              updatedAt: new Date(),
              modelId: selectedModel.id,
            }
          : chat,
      ),
    );
    setInputValue("");
    setPendingFiles([]);
    setCodeSnippets([]);
    setIsLoading(true);

    const aiResponse = await getAIResponse(
      userQuery,
      attachments,
      selectedModel,
    );
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      model: selectedModel.name,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === targetChatId) {
          const updatedMessages = [...chat.messages, assistantMessage];
          if (chat.messages.length === 1 && userQuery) {
            return {
              ...chat,
              messages: updatedMessages,
              title:
                userQuery.slice(0, 30) + (userQuery.length > 30 ? "..." : ""),
              updatedAt: new Date(),
            };
          }
          return { ...chat, messages: updatedMessages, updatedAt: new Date() };
        }
        return chat;
      }),
    );
    setIsLoading(false);
  };

  const projectsWithCounts = projects.map((p) => ({
    ...p,
    chatCount: chats.filter((c) => c.projectId === p.id).length,
  }));

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        projects={projectsWithCounts}
        currentProjectId={currentProjectId}
        onNewChat={createNewChat}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          setPendingFiles([]);
          setInputValue("");
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
        onDeleteChat={(id) => setDeleteModal({ type: "chat", id })}
        onRenameChat={renameChat}
        onPinChat={pinChat}
        onArchiveChat={archiveChat}
        onExportChat={exportChat}
        onClearAllChats={clearAllChats}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(false)}
        onUpgradeClick={() => setIsUpgradeModalOpen(true)}
        showUpgradeBanner={showUpgradeBanner}
        onCloseUpgradeBanner={() => setShowUpgradeBanner(false)}
        onCreateProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        onEditProject={(project) => {
          setEditingProject(project);
          setIsProjectModalOpen(true);
        }}
        onDeleteProject={(id) => setDeleteModal({ type: "project", id })}
        onSelectProject={setCurrentProjectId}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isTemporaryChat={isTemporaryChat}
          onToggleTemporaryChat={() => setIsTemporaryChat(!isTemporaryChat)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 min-h-[70vh]">
                <div className="w-20 h-20 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                  <Leaf className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-balance">
                  How can I help you today?
                </h2>
                <p className="text-muted-foreground max-w-md mb-8 text-balance">
                  Ask me anything! I can analyze images, read documents, and
                  answer your questions with advanced AI models.
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  {[
                    { icon: Mic, label: "Voice Input" },
                    { icon: ImageIcon, label: "Image Analysis" },
                    { icon: FileText, label: "Document Reading" },
                    { icon: Cpu, label: `${AVAILABLE_MODELS.length}+ Models` },
                  ].map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-sm border border-border/50"
                    >
                      <feature.icon className="w-4 h-4 text-primary" />
                      {feature.label}
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {[
                    "Explain quantum computing simply",
                    "Write a professional email",
                    "Debug my code",
                    "Creative writing ideas",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="text-left px-4 py-3 bg-card border border-border rounded-xl text-sm hover:bg-secondary/50 hover:border-primary/30 transition-all"
                    >
                      <span className="text-muted-foreground">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isLastAssistant =
                    msg.role === "assistant" && index === messages.length - 1;
                  return (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onCopy={copyMessage}
                      onToggleFavorite={() =>
                        currentChatId &&
                        toggleFavoriteMessage(currentChatId, msg.id)
                      }
                      isFavorite={msg.isFavorite}
                      isLastAssistant={isLastAssistant}
                      onRegenerate={
                        isLastAssistant ? regenerateResponse : undefined
                      }
                      onEdit={editMessage}
                      onResend={resendMessage}
                      onLike={
                        currentChatId
                          ? (messageId) => likeMessage(currentChatId, messageId)
                          : undefined
                      }
                      onDislike={
                        currentChatId
                          ? (messageId) =>
                              dislikeMessage(currentChatId, messageId)
                          : undefined
                      }
                    />
                  );
                })}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-3">
            {codeSnippets.length > 0 && (
              <div className="space-y-2 mb-3">
                {codeSnippets.map((snippet) => (
                  <CodeSnippetBox
                    key={snippet.id}
                    snippet={snippet}
                    onRemove={() =>
                      setCodeSnippets((prev) =>
                        prev.filter((s) => s.id !== snippet.id),
                      )
                    }
                  />
                ))}
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2 pb-2 border-b border-border">
                {pendingFiles.map((file) => (
                  <PendingAttachment
                    key={file.id}
                    file={file}
                    onRemove={() =>
                      setPendingFiles((prev) =>
                        prev.filter((f) => f.id !== file.id),
                      )
                    }
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  webSearchEnabled
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Web Search
              </button>
              <button
                onClick={() => setIsCodeModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <Code className="w-3.5 h-3.5" />
                Add Code
              </button>
            </div>

            <div className="flex items-center gap-2 bg-secondary/30 rounded-2xl border border-border shadow-sm px-2 py-1.5">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
              <button
                onClick={() => setIsFileUploadOpen(true)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Attach files"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    codeSnippets.length > 0
                      ? "Ask about your code..."
                      : pendingFiles.length > 0
                        ? "Ask about your files..."
                        : "Message MindLeaf..."
                  }
                  className="w-full bg-transparent outline-none text-foreground text-sm placeholder:text-muted-foreground"
                  maxLength={4000}
                />
              </div>
              {inputValue.length > 0 && (
                <span
                  className={`text-xs ${inputValue.length > 3500 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {inputValue.length}/4000
                </span>
              )}
              <VoiceRecorder
                onTranscript={(text) =>
                  setInputValue((prev) => prev + (prev ? " " : "") + text)
                }
                isListening={isListening}
                setIsListening={setIsListening}
              />
              <button
                onClick={sendMessage}
                disabled={
                  (!inputValue.trim() &&
                    pendingFiles.length === 0 &&
                    codeSnippets.length === 0) ||
                  isLoading
                }
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  (inputValue.trim() ||
                    pendingFiles.length > 0 ||
                    codeSnippets.length > 0) &&
                  !isLoading
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-2">
              MindLeaf may produce inaccurate information. Verify important
              facts.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={isFileUploadOpen}
        onClose={() => setIsFileUploadOpen(false)}
        onUpload={(files) => setPendingFiles((prev) => [...prev, ...files])}
      />

      {isCodeModalOpen && (
        <CodeInputModal
          onClose={() => setIsCodeModalOpen(false)}
          onAdd={(snippet) => {
            setCodeSnippets((prev) => [...prev, snippet]);
            setIsCodeModalOpen(false);
          }}
        />
      )}

      {isUpgradeModalOpen && (
        <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} />
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={editingProject ? updateProject : createProject}
        editProject={editingProject}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chats={chats}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          setIsSearchOpen(false);
        }}
      />

      <DeleteModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => {
          if (deleteModal?.type === "chat") {
            deleteChat(deleteModal.id);
          } else if (deleteModal?.type === "project") {
            deleteProject(deleteModal.id);
          }
        }}
        title={deleteModal?.type === "chat" ? "Delete Chat" : "Delete Project"}
        description={
          deleteModal?.type === "chat"
            ? "Are you sure you want to delete this chat? This action cannot be undone."
            : "Are you sure you want to delete this project? All associated chats will be moved to All Chats."
        }
      />

      <VoiceListeningModal
        isOpen={isListening}
        onClose={() => setIsListening(false)}
      />

      {copiedMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-medium shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}
