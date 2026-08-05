import { Archive, Download, Edit3, Pin, Trash2 } from "lucide-react";
import { memo, useEffect, useRef } from "react";

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

export default memo(ChatContextMenu);
