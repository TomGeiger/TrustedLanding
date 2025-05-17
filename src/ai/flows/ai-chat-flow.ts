
'use server';
/**
 * @fileOverview A Genkit flow for handling AI-powered chat conversations with streaming.
 *
 * - conversationalAiChat - An async generator function that streams AI responses.
 * - AiChatInput - The input type for conversationalAiChat.
 * - AiChatHistoryItem - The type for individual items in the chat history.
 */

import {ai} from '@/ai/genkit';
import type {GenerateResponseChunk} from 'genkit';
import {z} from 'genkit';

const AiChatHistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});
export type AiChatHistoryItem = z.infer<typeof AiChatHistoryItemSchema>;

const AiChatInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z.array(AiChatHistoryItemSchema).optional().describe('The conversation history leading up to the current message.'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;


// const financialMotivationalQuotes = [
//   "The best time to plant a tree was 20 years ago. The second best time is now.",
//   "An investment in knowledge pays the best interest.",
//   "Financial freedom is available to those who learn about it and work for it.",
//   "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
//   "The secret of getting ahead is getting started.",
//   "Do not save what is left after spending, but spend what is left after saving.",
//   "Your economic security does not lie in your job; it lies in your own power to produce - to think, to learn, to create, to adapt.",
//   "A budget is telling your money where to go instead of wondering where it went.",
//   "Success is not final, failure is not fatal: It is the courage to continue that counts.",
//   "The only limit to our realization of tomorrow will be our doubts of today."
// ];

// const chatPromptTemplateString = `You are Trish, a friendly, knowledgeable, highly motivational, and professional assistant for Trusted Future, a financial services agency. Your expertise lies in Life Insurance, and you also serve as a business mentor, helping Trusted Future agents grow their potential. Your primary goal is to answer questions about financial planning, Indexed Universal Life (IUL) insurance, retirement strategies, and the services offered by Trusted Future. You should also offer motivational insights when appropriate.

// IMPORTANT:
// - If the conversation history (provided separately) is NOT empty, DO NOT re-introduce yourself (e.g., do not say "I'm Trish" or "I am Trish"). Assume the user already knows who you are based on the history. Respond directly to their message.
// - If the conversation history IS empty, your very first message to the user must start with "Hello, I'm Trish, your own AI Financial Genius!" and then you can continue to warmly ask how you can assist them with their financial questions today.

// Keep your responses helpful, clear, and concise. Maintain a positive, supportive, and encouraging tone.

// When appropriate and it feels natural, you can offer a piece of financial wisdom or a motivational thought. For this interaction, consider reflecting on the following idea: "__RANDOM_QUOTE__". You don't have to use it, but it's there if it fits the conversation.

// If a user asks a question you cannot answer or that is outside the scope of financial advice or your expertise (e.g., medical advice, personal opinions on unrelated topics), politely state that you cannot help with that specific query and try to redirect them to relevant financial topics if appropriate.

// If the user expresses interest in a consultation, scheduling a meeting, or wants to provide their contact details, guide them to use the contact form fields (Name, Email, Phone) available in the chat window or to visit the "Contact Us" section of the website for more direct contact options. Do not ask for their personal contact information directly in the chat.

// User's latest message: __USER_MESSAGE__`;


// export async function* conversationalAiChat(input: AiChatInput): AsyncGenerator<string, void, undefined> {
//   const randomQuote = financialMotivationalQuotes[Math.floor(Math.random() * financialMotivationalQuotes.length)];
//   let finalPrompt = chatPromptTemplateString.replace('__USER_MESSAGE__', input.message);
//   finalPrompt = finalPrompt.replace('__RANDOM_QUOTE__', randomQuote);

//   try {
//     const {stream, response: finalResponsePromise} = ai.generateStream({
//       prompt: finalPrompt,
//       history: input.history || [],
//       config: {
//         safetySettings: [
//           { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//           { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//           { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//           { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
//         ],
//       }
//     });

//     let hasYieldedText = false;
//     for await (const chunk of stream) {
//       if (chunk.text) {
//         yield chunk.text;
//         hasYieldedText = true;
//       }
//     }

//     // After streaming, check the final response for issues
//     const finalResponse = await finalResponsePromise;
//     const finishReason = finalResponse.candidates?.[0]?.finishReason;
//     const safetyRatings = finalResponse.candidates?.[0]?.safetyRatings;

//     if (finishReason === 'SAFETY') {
//       console.warn('AI response stream potentially blocked/ended due to safety settings. Ratings:', safetyRatings);
//       const message = "\n\n[I'm sorry, my response was interrupted or could not be fully completed due to safety guidelines.]";
//       if (!hasYieldedText) yield "[Safety Block] I am unable to respond to that request."; else yield message;
//     } else if (finishReason === 'MAX_TOKENS') {
//       console.warn('AI response stream truncated due to max tokens.');
//       yield "\n\n[My response was a bit long and may have been cut short.]";
//     } else if (finalResponse.candidates?.[0]?.finishReason !== 'STOP' && !finalResponse.text && !hasYieldedText) {
//       // Check if there was no text at all in the final aggregated response unless it was a natural stop.
//       console.warn('AI stream ended without substantial text output. Finish Reason:', finishReason, 'Full response:', JSON.stringify(finalResponse, null, 2));
//       if (!hasYieldedText) {
//          // If we haven't yielded any text and it's not a natural stop, it's an issue.
//         yield "[Error] I encountered an issue generating a response. Please try rephrasing or try again later.";
//       } else {
//         // If some text was yielded, but it still ended unexpectedly.
//         yield "\n\n[I encountered an issue generating a complete response. Please try rephrasing.]";
//       }
//     }

//   } catch (error) {
//     console.error('Error during AI stream generation:', error);
//     // Ensure the client gets a usable error message if an error is thrown from here.
//     if (error instanceof Error) {
//         // Try to yield a user-friendly message before re-throwing
//         yield `[Error] An error occurred: ${error.message}. Please try again.`;
//         throw error; 
//     } else {
//         yield "[Error] An unexpected error occurred in the AI stream. Please try again.";
//         throw new Error('An unexpected error occurred in the AI stream.');
//     }
//   }
// }


// Test version - yields hardcoded strings - to isolate if the problem is with Genkit or action/client streaming
export async function* conversationalAiChat(input: AiChatInput): AsyncGenerator<string, void, undefined> {
  console.log('[TEST FLOW] conversationalAiChat called with input:', input.message);
  try {
    yield "Hello from test stream! ";
    await new Promise(resolve => setTimeout(resolve, 500));
    yield `You said: "${input.message}". `;
    await new Promise(resolve => setTimeout(resolve, 500));
    yield "Test stream finished.";
    console.log('[TEST FLOW] conversationalAiChat finished.');
    return;
  } catch (error) {
    console.error('[TEST FLOW] Error in test conversationalAiChat:', error);
    // Try to yield an error message if possible, though if the stream itself is broken, this might not reach the client.
    try {
      yield "[TEST FLOW ERROR] An error occurred within the test flow.";
    } catch (yieldError) {
      // Ignore error during yielding error message
    }
    throw error; // Re-throw original error
  }
}
