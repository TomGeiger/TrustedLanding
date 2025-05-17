
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

// Test version - yields hardcoded strings
export async function* aiChatAction(
  data: AiClientChatInput
): AsyncGenerator<string, void, undefined> {
  console.log('[TEST ACTION] aiChatAction called with input:', data.message);

  // Simulate validation
  const validation = AiClientChatInputSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Invalid input: ' + validation.error.errors.map(e => e.message).join(', '));
  }

  try {
    yield "Action Stream: Part 1. ";
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate async work
    yield `Action Stream: Echoing '${data.message}'. `;
    await new Promise(resolve => setTimeout(resolve, 200));
    yield "Action Stream: Part 3. Finished.";
    console.log('[TEST ACTION] aiChatAction finished yielding.');
    return;
  } catch (error) {
    console.error('[TEST ACTION] Error in aiChatAction:', error);
    // Try to yield an error message if possible, though if the stream itself is broken, this might not reach the client.
    try {
      yield "[TEST ACTION ERROR] An error occurred within the test action.";
    } catch (yieldError) {
      // Ignore error during yielding error message
    }
    throw error; // Re-throw original error
  }
}

/*
// Original version calling the flow:
export async function* aiChatAction(
  data: AiClientChatInput
): AsyncGenerator<string, void, undefined> {
  // Ensure this function behaves as an async generator immediately,
  // even if synchronous validation fails.
  // await Promise.resolve(); // Removed for testing

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
    return; // Explicitly return to signify completion
  } catch (error: any) {
    console.error('Error in AI chat action streaming:', error);
    // Re-throw the original error to be caught by the client
    throw error;
  }
}
*/
