import { Bot } from "lucide-react";
import { memo } from "react";

const TypingLoader = () => (
  <div className="flex gap-4 py-6 px-4 md:px-6 bg-secondary/20  ">
    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-secondary to-muted flex items-center justify-center shadow-lg">
      <Bot className="w-4 h-4" />
    </div>
    <div className="flex-1 flex items-center">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
      </div>
    </div>
  </div>
);

export default memo(TypingLoader);
