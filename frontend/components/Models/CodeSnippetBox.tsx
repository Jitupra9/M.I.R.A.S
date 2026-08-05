import { Code, X } from "lucide-react";
import { memo, useState } from "react";

const CodeSnippetBox = ({
  snippet,
  onRemove,
}: {
  snippet: CodeSnippet;
  onRemove: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = snippet.content.split("\n").length;

  return (
    <div className="bg-secondary/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/80 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-foreground">
            {snippet.name}
          </span>
          <span className="text-xs text-muted-foreground">{lines} lines</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      {isExpanded && (
        <pre className="p-3 text-xs overflow-x-auto max-h-40 overflow-y-auto">
          <code className="text-foreground/80">{snippet.content}</code>
        </pre>
      )}
    </div>
  );
};

export default memo(CodeSnippetBox);
