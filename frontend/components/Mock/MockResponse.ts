/**
 * Standalone Demo AI Response Engine for M.I.R.A.S
 * Runs 100% locally in the browser with simulated AI generation.
 */

export const getAIResponse = async (
  userQuery: string,
  attachments: Attachment[] = [],
  model?: AIModel,
  sessionId?: string,
): Promise<string> => {
  // Simulate natural AI thinking/typing latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const modelName = model?.name || "M.I.R.A.S Intelligence";
  const modelProvider = model?.provider ? model.provider.toUpperCase() : "DEMO";
  const queryLower = userQuery.toLowerCase().trim();

  let attachmentDetails = "";
  if (attachments && attachments.length > 0) {
    const fileNames = attachments.map((a) => `\`${a.name}\``).join(", ");
    attachmentDetails = `\n\n> 📎 **Analyzed Attachments:** ${fileNames}\n`;
    if (attachments.some((a) => a.type === "image")) {
      attachmentDetails += `> 🖼️ *Visual analysis complete: Image contents identified and contextualized.*\n`;
    }
    if (attachments.some((a) => a.type === "document")) {
      attachmentDetails += `> 📄 *Document parsed: Key structures and paragraphs extracted successfully.*\n`;
    }
    if (attachments.some((a) => a.type === "code")) {
      attachmentDetails += `> 💻 *Code file inspected: Syntax and logic parsed.*\n`;
    }
  }

  // 1. Coding-related prompts
  if (
    queryLower.includes("code") ||
    queryLower.includes("function") ||
    queryLower.includes("python") ||
    queryLower.includes("javascript") ||
    queryLower.includes("typescript") ||
    queryLower.includes("react") ||
    queryLower.includes("create an app") ||
    queryLower.includes("write a script")
  ) {
    return `### ⚡ Solution by **${modelName}** (${modelProvider})
${attachmentDetails}
Here is an implementation tailored to your request:

\`\`\`typescript
// M.I.R.A.S Demo Automation Routine
interface TaskConfig {
  taskName: string;
  retries: number;
  verbose: boolean;
}

export async function executeDemoTask(config: TaskConfig): Promise<boolean> {
  console.log(\`[M.I.R.A.S] Initializing task: \${config.taskName}\`);
  try {
    // Simulated asynchronous execution
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[M.I.R.A.S] Operation completed successfully.");
    return true;
  } catch (error) {
    console.error("[M.I.R.A.S] Execution failed:", error);
    return false;
  }
}
\`\`\`

#### Key Highlights:
1. **Type Safety**: Explicit interfaces for flexible configuration.
2. **Resilience**: Integrated try-catch error boundary for graceful handling.
3. **Extensibility**: Ready to connect to APIs, state stores, or local utilities.

Would you like me to add automated unit tests or extend this logic?`;
  }

  // 2. Greetings and self-introduction
  if (
    queryLower === "hi" ||
    queryLower === "hello" ||
    queryLower === "hey" ||
    queryLower.includes("who are you") ||
    queryLower.includes("what is miras")
  ) {
    return `👋 Hello! I am **M.I.R.A.S** (Multimodal Intelligent Reasoning & Autonomous System), running under **${modelName}**.
${attachmentDetails}
Here's what I can do in this interactive demo:
- 💡 **Answering questions** with detailed reasoning and markdown formatting.
- 💻 **Writing and refactoring code** in Python, TypeScript, SQL, and more.
- 📁 **Analyzing uploaded files**, documents, and images.
- 🎙️ **Voice dictation & audio feedback** for hands-free interactions.
- 🗂️ **Managing projects & chat sessions** with persistent local history.

How can I help you today? Feel free to ask a question or try uploading a file!`;
  }

  // 3. Summarization / analysis prompts
  if (
    queryLower.includes("summarize") ||
    queryLower.includes("explain") ||
    queryLower.includes("overview")
  ) {
    return `### 📋 Summary & Analysis — **${modelName}**
${attachmentDetails}
Here is a structured breakdown based on your inquiry:

1. **Executive Overview**:
   The objective is to synthesize key patterns, eliminate redundancies, and highlight actionable insights for: *"**${userQuery.slice(0, 100)}${userQuery.length > 100 ? "..." : ""}**"*.

2. **Core Insights**:
   - **Architectural Efficiency**: Maintaining a lean, decoupled client interface ensures fast render times and zero network blocking.
   - **User Experience**: Interactive feedback loops provide responsive tactile experiences.
   - **Flexibility**: Modular component hierarchies make feature swapping effortless.

3. **Recommended Next Steps**:
   - Test various prompts and model switches to evaluate the interactive UI.
   - Explore file uploads and context menus in the sidebar.

Let me know if you need deeper exploration on any specific aspect!`;
  }

  // 4. Default contextual response
  const responses = [
    `### **${modelName}** (${modelProvider})
${attachmentDetails}
Thanks for your message! Here is the response to:

> *"${userQuery.slice(0, 120)}${userQuery.length > 120 ? "..." : ""}"*

Everything is running smoothly in **Demo UI Mode**. You can freely:
- Switch between different AI models using the selector.
- Create new projects and group chats in the sidebar.
- Test voice input, code modals, and attachment uploads.
- Customize your appearance in Settings.

What would you like to explore next?`,

    `### 🧠 Insights from **${modelName}**
${attachmentDetails}
I've processed your query: **"${userQuery.slice(0, 80)}${userQuery.length > 80 ? "..." : ""}"**.

Here are the key takeaways:
- **Fast Execution**: Real-time interactive UI with no backend latency.
- **Local Persistence**: All your chats, projects, and custom snippets are stored locally in your browser session.
- **Rich Components**: Full support for code highlighting, voice synthesis, and multi-model switching.

Feel free to ask follow-up questions or test any prompt you like!`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};
