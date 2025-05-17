
'use server';

import { conversationalAiChat, type AiChatInput, type AiChatHistoryItem } from '@/ai/flows/ai-chat-flow';
import { z } from 'zod';

const AiClientChatInputSchema = z.object({
  message: z.string(),
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
  // Ensure this function behaves as an async generator immediately,
  // even if synchronous validation fails.
  await Promise.resolve();

  const validation = AiClientChatInputSchema.safeParse(data);

  if (!validation.success) {
    // This error will now cause the promise for the generator to reject.
    throw new Error('Invalid input: ' + validation.error.errors.map(e => e.message).join(', '));
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
  } catch (error: any) {
    console.error('Error in AI chat action streaming:', error);
    // Re-throw the original error to be caught by the client
    throw error;
  }
}
