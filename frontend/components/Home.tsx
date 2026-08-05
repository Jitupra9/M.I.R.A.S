"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { AVAILABLE_MODELS } from "@/lib/constant";
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
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { getAIResponse } from "@/components/Mock/MockResponse";
import VoiceListeningModal from "@/components/Models/VoiceListeningModal";
import VoiceRecoder from "@/components/VoiceRecoder";
import ModelSelector from "@/components/Models/ModelSelector";
import PendingAttachment from "@/components/Models/PendingAttachment";
import CodeSnippetBox from "@/components/Models/CodeSnippetBox";
import ChatMessage from "@/components/ChatMessage";
import TypingLoader from "@/components/skeleton/TypingLoader";
import FileUploadModal from "@/components/Models/FileUploadModal";
import CodeInputModal from "@/components/Models/CodeInputModal";
import ProjectModel from "@/components/Models/ProjectModel";
import SettingsModal from "@/components/Models/SettingsModal";
import SearchModal from "@/components/Models/SearchModal";
import UpgradeModal from "@/components/Models/UpgradeModal";
import DeleteModal from "@/components/Models/DeleteModal";
import ChatSidebar from "@/components/layout/ChatSidebar";
import AppHeader from "@/components/layout/AppHeader";
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
        <AppHeader
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
                {isLoading && <TypingLoader />}
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
              <VoiceRecoder
                onTranscript={(text: any) =>
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

      <ProjectModel
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
