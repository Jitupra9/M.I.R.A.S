"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Brain,
  Zap,
  Code,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Globe,
  Mic,
  Folder,
  Settings,
  Keyboard,
  Star,
  CheckCircle2,
  Lightbulb,
  BookOpen,
} from "lucide-react";

type ModelRecommendation = {
  name: string;
  icon: string;
  provider: string;
  bestFor: string[];
  description: string;
  color: string;
};

const MODEL_RECOMMENDATIONS: ModelRecommendation[] = [
  {
    name: "GPT-5.2",
    icon: "🧠",
    provider: "OpenAI",
    bestFor: ["Complex reasoning", "Code generation", "Writing", "Analysis"],
    description:
      "Most capable model for complex tasks requiring deep understanding and sophisticated reasoning.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "GPT-4o",
    icon: "🌐",
    provider: "OpenAI",
    bestFor: ["Multimodal tasks", "Image analysis", "Real-time conversations"],
    description:
      "Excellent for tasks involving images, audio, and text together. Fast and versatile.",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Gemini 3.1 Pro",
    icon: "✨",
    provider: "Google",
    bestFor: [
      "UI/Frontend design",
      "Creative writing",
      "Research",
      "Long context",
    ],
    description:
      "Outstanding for creative tasks, UI design suggestions, and handling very long documents.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Gemini 2.5 Flash",
    icon: "⚡",
    provider: "Google",
    bestFor: ["Quick answers", "Simple queries", "Everyday tasks"],
    description:
      "Ultra-fast responses perfect for quick questions and simple tasks.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "DeepSeek V3.1",
    icon: "🏠",
    provider: "Local (Ollama)",
    bestFor: ["Privacy-focused tasks", "Offline work", "Code completion"],
    description:
      "Powerful local model with 671B parameters. Runs on your machine for complete privacy.",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Llama 3.3 70B",
    icon: "🦙",
    provider: "Meta/HuggingFace",
    bestFor: ["Open-source projects", "Customization", "Research"],
    description:
      "High-performance open-source model ideal for specialized use cases.",
    color: "from-pink-500 to-rose-500",
  },
];

type FeatureCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FEATURES: FeatureCard[] = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Multiple AI Models",
    description:
      "Switch between different AI providers like OpenAI, Google Gemini, and local models to find the best fit for your task.",
  },
  {
    icon: <Folder className="w-6 h-6" />,
    title: "Project Organization",
    description:
      "Create projects to organize your chats by topic, client, or purpose. Keep your conversations structured and easy to find.",
  },
  {
    icon: <ImageIcon className="w-6 h-6" />,
    title: "Image Upload & Analysis",
    description:
      "Upload images for AI analysis. Get descriptions, extract text, analyze designs, or discuss visual content.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Document Processing",
    description:
      "Upload PDFs and text files to have the AI analyze, summarize, or answer questions about their content.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Code Snippets",
    description:
      "Share code directly in your prompts. The AI can review, debug, explain, or improve your code.",
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice Input",
    description:
      "Use your microphone to speak your prompts. Perfect for hands-free interaction or quick thoughts.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Web Search Integration",
    description:
      "Enable web search to get up-to-date information from the internet in AI responses.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Chat Management",
    description:
      "Pin important chats, archive old ones, rename for clarity, and organize with projects.",
  },
];

type Shortcut = {
  keys: string[];
  description: string;
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], description: "Open search" },
  { keys: ["⌘", "N"], description: "New chat" },
  { keys: ["⌘", "B"], description: "Toggle sidebar" },
  { keys: ["Esc"], description: "Close modals" },
  { keys: ["Enter"], description: "Send message" },
  { keys: ["Shift", "Enter"], description: "New line in message" },
];

type UseTip = {
  category: string;
  tips: string[];
};

const USE_TIPS: UseTip[] = [
  {
    category: "Getting Better Responses",
    tips: [
      "Be specific about what you need - include context, desired format, and any constraints",
      "Break complex tasks into smaller steps for better results",
      "Ask the AI to explain its reasoning for complex problems",
      "Use follow-up questions to refine and improve responses",
    ],
  },
  {
    category: "Working with Code",
    tips: [
      "Always specify the programming language and framework",
      "Include error messages and relevant code context",
      "Ask for explanations along with code solutions",
      "Request tests or documentation when needed",
    ],
  },
  {
    category: "Creative Tasks",
    tips: [
      "Provide examples of the style or tone you want",
      "Use Gemini models for UI/design-related prompts",
      "Ask for multiple variations to choose from",
      "Iterate with feedback to refine outputs",
    ],
  },
  {
    category: "Research & Analysis",
    tips: [
      "Enable web search for current information",
      "Upload documents for summarization or Q&A",
      "Ask for sources and citations when accuracy matters",
      "Use GPT-5.2 for complex analytical tasks",
    ],
  },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Chat</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            User Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            Welcome to <span className="text-primary">NexusAI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your intelligent AI assistant powered by multiple state-of-the-art
            models. Learn how to get the most out of your conversations.
          </p>
        </section>

        {/* What is NexusAI */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">What is NexusAI?</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <p className="text-foreground/90 leading-relaxed">
              NexusAI is a premium AI chat application that gives you access to
              multiple AI models from different providers. Whether you need help
              with coding, writing, analysis, creative projects, or just want to
              have a conversation, NexusAI has you covered.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Unlike single-model assistants, NexusAI lets you switch between
              models to find the best one for each specific task. Need fast
              responses? Use Gemini Flash. Working on complex code? Try GPT-5.2.
              Want creative UI suggestions? Gemini Pro excels there.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Model Recommendations */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Which Model Should I Use?</h2>
          </div>
          <p className="text-muted-foreground">
            Different models excel at different tasks. Here&apos;s a guide to
            help you choose:
          </p>
          <div className="grid gap-4">
            {MODEL_RECOMMENDATIONS.map((model, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br ${model.color} text-white text-2xl shrink-0 w-14 h-14 flex items-center justify-center`}
                  >
                    {model.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-lg">{model.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {model.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {model.bestFor.map((use, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary"
                        >
                          <Star className="w-3 h-3" />
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips for Better Results */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10">
              <Lightbulb className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Tips for Better Results</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {USE_TIPS.map((section, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <h3 className="font-semibold mb-4 text-primary">
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary">
              <Keyboard className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {SHORTCUTS.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <span key={i}>
                        <kbd className="px-2 py-1 rounded-lg bg-secondary text-xs font-mono font-medium">
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="mx-1 text-muted-foreground">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Quick Start Guide</h2>
          </div>
          <div className="bg-linear-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20 p-6">
            <ol className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Start a New Chat",
                  desc: "Click 'New Chat' or press ⌘N to begin a conversation.",
                },
                {
                  step: 2,
                  title: "Choose Your Model",
                  desc: "Select the AI model best suited for your task from the dropdown.",
                },
                {
                  step: 3,
                  title: "Type Your Message",
                  desc: "Enter your question, request, or prompt in the input field.",
                },
                {
                  step: 4,
                  title: "Add Attachments (Optional)",
                  desc: "Upload images, documents, or code snippets for context.",
                },
                {
                  step: 5,
                  title: "Send & Interact",
                  desc: "Press Enter to send. Continue the conversation to refine results.",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <MessageSquare className="w-5 h-5" />
            Start Chatting Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NexusAI - Your Premium AI Assistant</p>
        </div>
      </footer>
    </div>
  );
}
