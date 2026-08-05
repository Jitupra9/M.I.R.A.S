import { MessageSquare, Search, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

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

export default memo(SearchModal);
