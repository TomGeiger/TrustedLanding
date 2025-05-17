
'use server';

import { z } from 'zod';
import { conversationalAiChat, type AiChatInput, type AiChatHistoryItem } from '@/ai/flows/ai-chat-flow';

const AiClientChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
  history: z.array(
    z.object({
      sender: z.enum(['user', 'ai']),
      text: z.string(),
    })
  ).optional(),
});

export type AiClientChatInput = z.infer<typeof AiClientChatInputSchema>;

export async function* aiChatAction(
  data: AiClientChatInput
): AsyncGenerator<string, void, undefined> {
  // Add a slight delay to ensure this function is treated as async generator from the start
  // and allows the client to set up its stream consumer properly.
  await Promise.resolve(); 

  const validation = AiClientChatInputSchema.safeParse(data);

  if (!validation.success) {
    // If validation fails, we should yield an error message or throw.
    // Throwing an error here might be caught by the client's overall try/catch.
    // Yielding allows for a more controlled error message within the chat.
    console.error('AI Chat Action Validation Error:', validation.error.flatten());
    yield `[Error] Invalid input: ${validation.error.errors.map(e => e.message).join(', ')}`;
    return;
  }

  try {
    const { message, history: clientHistory } = validation.data;

    const genkitHistory: AiChatHistoryItem[] = (clientHistory || []).map(item => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }],
    }));

    const flowInput: AiChatInput = {
      message,
      history: genkitHistory,
    };

    const stream = conversationalAiChat(flowInput);
    for await (const chunk of stream) {
      yield chunk;
    }
    return; 
  } catch (error: any) {
    console.error('Error in AI chat action streaming:', error);
    // Yield a user-friendly error message that can be displayed in the chat.
    // Avoid re-throwing here as it might break the stream consumption on client for some Next.js versions.
    yield `[Error] Failed to get AI response. Details: ${error.message || 'Unknown error'}. Please try again later.`;
  }
}
