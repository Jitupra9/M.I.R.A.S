import { memo, useState } from "react";
import ChatContextMenu from "@/components/Models/ChatContextMenu";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Edit3,
  FolderPlus,
  Leaf,
  MoreHorizontal,
  PanelLeft,
  PanelLeftClose,
  Pin,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const ChatSidebar = ({
  chats,
  currentChatId,
  projects,
  currentProjectId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onArchiveChat,
  onExportChat,
  onClearAllChats,
  isOpen,
  onToggle,
  onUpgradeClick,
  showUpgradeBanner,
  onCloseUpgradeBanner,
  onCreateProject,
  onEditProject,
  onDeleteProject,
  onSelectProject,
  isCollapsed,
  onToggleCollapse,
}: {
  chats: ChatSession[];
  currentChatId: string | null;
  projects: Project[];
  currentProjectId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onPinChat: (id: string) => void;
  onArchiveChat: (id: string) => void;
  onExportChat: (id: string) => void;
  onClearAllChats: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onUpgradeClick?: () => void;
  showUpgradeBanner?: boolean;
  onCloseUpgradeBanner?: () => void;
  onCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onSelectProject: (id: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const [contextMenu, setContextMenu] = useState<{
    chat: ChatSession;
    position: { x: number; y: number };
  } | null>(null);
  const [projectMenuOpen, setProjectMenuOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"chats" | "projects">(
    "chats",
  );

  const filteredChats = chats.filter((c) => {
    if (currentProjectId) return c.projectId === currentProjectId;
    return !c.isArchived;
  });

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-16 bg-sidebar border-r border-sidebar-border flex-col h-full">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-center">
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl bg-sidebar-accent hover:bg-primary/20 flex items-center justify-center transition-all"
            title="Expand sidebar"
          >
            <PanelLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center p-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl transition-all shadow-lg shadow-primary/20"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="px-2 py-1">
          <button
            onClick={onCreateProject}
            className="w-full flex items-center justify-center p-3 hover:bg-sidebar-accent rounded-xl transition-colors text-muted-foreground hover:text-foreground"
            title="Create Project"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1" />
        <div className="p-2 border-t border-sidebar-border">
          <button
            className="w-full flex items-center justify-center p-2 hover:bg-sidebar-accent rounded-xl transition-colors"
            title="Guest User"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              G
            </div>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-72"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-base">MindLeaf</h1>
              <p className="text-xs text-muted-foreground">
                Intelligent Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-2 rounded-xl hover:bg-sidebar-accent transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={onToggle}
              className="p-2 rounded-xl hover:bg-sidebar-accent transition-colors md:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-medium text-sm transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex rounded-xl bg-sidebar-accent/50 p-1">
            <button
              onClick={() => {
                setActiveSection("chats");
                onSelectProject(null);
              }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                activeSection === "chats"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveSection("projects")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
                activeSection === "projects"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {activeSection === "chats" ? (
            <>
              {pinnedChats.length > 0 && (
                <>
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Pinned
                  </p>
                  <div className="space-y-0.5 mb-3">
                    {pinnedChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                          currentChatId === chat.id
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }`}
                        onClick={() => onSelectChat(chat.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            chat,
                            position: { x: e.clientX, y: e.clientY },
                          });
                        }}
                      >
                        <span className="flex-1 text-sm truncate">
                          {chat.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({
                              chat,
                              position: { x: e.clientX, y: e.clientY },
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </p>
                {regularChats.length > 0 && (
                  <button
                    onClick={onClearAllChats}
                    className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Clear all chats"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {regularChats.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {regularChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                        currentChatId === chat.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                      onClick={() => onSelectChat(chat.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenu({
                          chat,
                          position: { x: e.clientX, y: e.clientY },
                        });
                      }}
                    >
                      <span className="flex-1 text-sm truncate">
                        {chat.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu({
                            chat,
                            position: { x: e.clientX, y: e.clientY },
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Projects
                </p>
                <button
                  onClick={onCreateProject}
                  className="p-1 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Create Project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <FolderPlus className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No projects yet</p>
                  <button
                    onClick={onCreateProject}
                    className="text-xs mt-2 text-primary hover:underline"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {projects.map((project) => (
                    <div key={project.id} className="relative group">
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          setActiveSection("chats");
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          currentProjectId === project.id
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-sm ${project.color}`}
                        ></div>
                        <span className="flex-1 text-left truncate">
                          {project.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.chatCount}
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectMenuOpen(
                            projectMenuOpen === project.id ? null : project.id,
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-secondary transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {projectMenuOpen === project.id && (
                        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl py-1 z-50 min-w-32">
                          <button
                            onClick={() => {
                              onEditProject(project);
                              setProjectMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDeleteProject(project.id);
                              setProjectMenuOpen(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {showUpgradeBanner && (
          <div className="p-3 ">
            <div className="relative bg-linear-to-br from-primary/10 to-accent/10 rounded-xl p-3 border border-primary/20">
              <button
                onClick={onCloseUpgradeBanner}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Unlock unlimited chats & more
              </p>
              <button
                onClick={onUpgradeClick}
                className="w-full flex items-center justify-center gap-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-all"
              >
                <Zap className="w-3 h-3" />
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button className="w-full flex items-center gap-2 hover:bg-sidebar-accent px-2 py-2 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
              G
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Guest User</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </aside>

      {contextMenu && (
        <ChatContextMenu
          chat={contextMenu.chat}
          position={contextMenu.position}
          onRename={() => {
            const newTitle = prompt("Enter new title:", contextMenu.chat.title);
            if (newTitle) onRenameChat(contextMenu.chat.id, newTitle);
          }}
          onPin={() => onPinChat(contextMenu.chat.id)}
          onArchive={() => onArchiveChat(contextMenu.chat.id)}
          onExport={() => onExportChat(contextMenu.chat.id)}
          onDelete={() => onDeleteChat(contextMenu.chat.id)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};
export default memo(ChatSidebar);
