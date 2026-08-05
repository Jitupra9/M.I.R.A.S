import {
  Bot,
  Copy,
  FileText,
  Pencil,
  RefreshCw,
  RotateCcw,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

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
export default memo(ChatMessage);
