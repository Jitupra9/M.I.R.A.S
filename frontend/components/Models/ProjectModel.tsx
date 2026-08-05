import { X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { PROJECT_COLORS } from "@/lib/constant";
const ProjectModal = ({
  isOpen,
  onClose,
  onSave,
  editProject,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, "id" | "createdAt" | "chatCount">) => void;
  editProject?: Project | null;
}) => {
  const [name, setName] = useState(editProject?.name || "");
  const [description, setDescription] = useState(
    editProject?.description || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    editProject?.color || PROJECT_COLORS[0].value,
  );

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setSelectedColor(editProject.color);
    } else {
      setName("");
      setDescription("");
      setSelectedColor(PROJECT_COLORS[0].value);
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">
            {editProject ? "Edit Project" : "Create Project"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome project"
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Color
            </label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-primary ring-offset-card"
                      : ""
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name, description, color: selectedColor });
                onClose();
              }
            }}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {editProject ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(ProjectModal);
