import { Code, X } from "lucide-react";
import { memo, useState } from "react";

const CodeInputModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (snippet: CodeSnippet) => void;
}) => {
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");

  const detectLanguage = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      rb: "ruby",
      go: "go",
      rs: "rust",
      java: "java",
      cpp: "cpp",
      c: "c",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
      sql: "sql",
      sh: "shell",
      yaml: "yaml",
      yml: "yaml",
    };
    return langMap[ext] || "text";
  };

  const handleAdd = () => {
    if (!code.trim()) return;
    const name = filename.trim() || `snippet-${Date.now()}.txt`;
    onAdd({
      id: `code-${Date.now()}`,
      name,
      language: detectLanguage(name),
      content: code,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">Add Code Snippet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Filename (optional)
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. component.tsx"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex-1 min-h-0">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Paste your code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-64 px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!code.trim()}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            Add Code
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(CodeInputModal);
