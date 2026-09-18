import { EyeOff, LogIn, Menu, Search, Settings } from "lucide-react";
import { memo } from "react";

const Header = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenSettings,
  isTemporaryChat,
  onToggleTemporaryChat,
  currentUser,
  onOpenAuth,
}: {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isTemporaryChat: boolean;
  onToggleTemporaryChat: () => void;
  currentUser?: any;
  onOpenAuth?: () => void;
}) => {
  return (
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

        {currentUser ? (
          <button
            onClick={onOpenAuth}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-xl font-medium text-xs transition-colors"
            title="View Profile / Demo Settings"
          >
            <div className="w-5 h-5 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              {(currentUser.full_name ||
                currentUser.username ||
                "U")[0].toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium text-foreground">
              {currentUser.full_name || currentUser.username}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
