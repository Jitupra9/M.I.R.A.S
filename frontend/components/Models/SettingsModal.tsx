import {
  BookOpen,
  Keyboard,
  LogIn,
  Mail,
  MessageCircle,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";

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

export default memo(SettingsModal);
