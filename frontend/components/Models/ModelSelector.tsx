import { Check, ChevronDown } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { AVAILABLE_MODELS } from "@/lib/constant";
const ModelSelector = ({
  selectedModel,
  onModelChange,
}: {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupedModels = AVAILABLE_MODELS.reduce(
    (acc, model) => {
      if (!acc[model.provider]) acc[model.provider] = [];
      acc[model.provider].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>,
  );

  const providerColors: Record<string, string> = {
    gemini: "text-blue-400",
    openai: "text-emerald-400",
    ollama: "text-orange-400",
    huggingface: "text-pink-400",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all duration-300"
      >
        <span className="text-base">{selectedModel.icon}</span>
        <span className="font-medium text-foreground hidden sm:block">
          {selectedModel.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 max-h-96 overflow-y-auto backdrop-blur-xl">
          <div className="p-2">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${providerColors[provider]} bg-current`}
                  ></span>
                  <span>{provider}</span>
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      selectedModel.id === model.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{model.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                      {selectedModel.id === model.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default memo(ModelSelector);
