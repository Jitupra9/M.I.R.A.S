import { Trash2 } from "lucide-react";
import { memo } from "react";

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

export default memo(DeleteModal);
