
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

interface AiChatActionResponse {
  success: boolean;
  response?: string;
  errorMessage?: string;
}

export async function aiChatAction(
  data: AiClientChatInput
): Promise<AiChatActionResponse> {
  const validation = AiClientChatInputSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errorMessage: 'Invalid input: ' + validation.error.errors.map(e => e.message).join(', '),
    };
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
    const result = await conversationalAiChat(flowInput);
    if (result && result.response) {
      return { success: true, response: result.response };
    } else {
      return { success: false, errorMessage: 'AI did not return a response.' };
    }
  } catch (error) {
    console.error('Error in AI chat action:', error);
    return {
      success: false,
      errorMessage: 'Failed to get AI response. Please try again later.',
    };
  }
}
