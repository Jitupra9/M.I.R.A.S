import { File, Upload, X } from "lucide-react";
import { memo, useRef, useState } from "react";

const FileUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: file.type.startsWith("image/") ? "image" : "document",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      name: file.name,
      size: file.size,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-6 border border-border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Click to upload</p>
          <p className="text-xs text-muted-foreground mt-2">
            Images, PDF, TXT (Max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium mb-3">
              {selectedFiles.length} file(s) selected
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-secondary rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "image" ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium truncate max-w-36">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-all"
          >
            {"Add"}{" "}
            {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(FileUploadModal);
