
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
  const validation = AiClientChatInputSchema.safeParse(data);

  if (!validation.success) {
    throw new Error('Invalid input: ' + validation.error.errors.map(e => e.message).join(', '));
  }

  const { message, history: clientHistory } = validation.data;

  const genkitHistory: AiChatHistoryItem[] = (clientHistory || []).map(item => ({
    role: item.sender === 'user' ? 'user' : 'model',
    parts: [{ text: item.text }],
  }));

  const flowInput: AiChatInput = {
    message,
    history: genkitHistory,
  };

  try {
    const stream = conversationalAiChat(flowInput);
    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error: any) {
    console.error('Error in AI chat action streaming:', error);
    // The error will be caught by the client's try/catch around the for-await loop.
    // No need to yield a special error string, just re-throw.
    throw new Error(error.message || 'Failed to stream AI response. Please try again later.');
  }
}
