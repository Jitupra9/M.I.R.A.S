export const getAIResponse = async (
  userQuery: string,
  attachments: Attachment[],
  model: AIModel,
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let attachmentContext = "";
  if (attachments.length > 0) {
    attachmentContext = `\n\n📎 **Files analyzed:** ${attachments.map((a) => a.name).join(", ")}\n`;
    if (attachments.some((a) => a.type === "image")) {
      attachmentContext += `🖼️ I've analyzed the image(s) you shared. `;
    }
    if (attachments.some((a) => a.type === "document")) {
      attachmentContext += `📄 I've processed the document(s) content. `;
    }
  }

  const responses = [
    `Using **${model.name}** (${model.provider.toUpperCase()})${attachmentContext}\n\nGreat question! Based on my analysis, here's my response to "${userQuery.slice(0, 80)}${userQuery.length > 80 ? "..." : ""}"\n\nThe key points to consider are understanding your specific needs, evaluating different approaches, and finding optimal solutions. Would you like me to elaborate further?`,
    `**${model.name}** here!${attachmentContext}\n\nI appreciate your question. The most important factors to keep in mind include practical implementation strategies, potential challenges, and best practices from industry standards.\n\nDoes this help answer your question?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};
