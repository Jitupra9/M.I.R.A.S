import { Code, FileText, X } from "lucide-react";
import { memo } from "react";

const PendingAttachment = ({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) => {
  return (
    <div className="relative group inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-xl px-3 py-2 text-sm border border-border/50">
      {file.type === "image" ? (
        <img
          src={file.preview}
          alt={file.name}
          className="w-8 h-8 rounded-lg object-cover"
        />
      ) : file.type === "code" ? (
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Code className="w-4 h-4 text-accent" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
      )}
      <span className="text-xs text-foreground max-w-24 truncate">
        {file.name}
      </span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-destructive/20 hover:bg-destructive/30 text-destructive transition-all duration-200"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
export default memo(PendingAttachment);
