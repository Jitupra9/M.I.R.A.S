/**
 * Real API integration with M.I.R.A.S FastAPI backend.
 * Connects directly to http://localhost:8000/chat/message.
 */
export const getAIResponse = async (
  userQuery: string,
  attachments: Attachment[] = [],
  model?: AIModel,
  sessionId?: string,
): Promise<string> => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  let attachmentContext = "";
  if (attachments && attachments.length > 0) {
    attachmentContext = `\n[Attachments: ${attachments.map((a) => a.name).join(", ")}]`;
  }

  const prompt = userQuery + attachmentContext;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("miras_token") : null;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${backendUrl}/chat/message`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: prompt,
        model: model?.id || "qwen2.5:3b",
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `❌ Server Error (${response.status}): ${errorText}`;
    }

    const data = await response.json();
    return data.response || "Task completed.";
  } catch (err: any) {
    return `⚠️ Could not reach M.I.R.A.S backend at ${backendUrl}.\n\nMake sure the backend is running with:\n\`cd backend && .\\venv\\Scripts\\python run.py\`\n\n(Details: ${err.message})`;
  }
};
