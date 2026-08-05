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
