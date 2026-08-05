import { EyeOff, Leaf, LogIn, Menu, Search, Settings, X } from "lucide-react";
import { memo, useState } from "react";

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
export default memo(Header);
