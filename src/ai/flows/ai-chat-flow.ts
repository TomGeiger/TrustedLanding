
'use server';
/**
 * @fileOverview A Genkit flow for handling AI-powered chat conversations.
 *
 * - conversationalAiChat - A function that generates an AI response based on user input and conversation history.
 * - AiChatInput - The input type for the conversationalAiChat.
 * - AiChatOutput - The return type for the conversationalAiChat.
 * - AiChatHistoryItem - The type for individual items in the chat history.
 */

import {ai} from '@/ai/genkit';
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

const AiChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

export async function conversationalAiChat(input: AiChatInput): Promise<AiChatOutput> {
  return aiChatFlow(input);
}

// Simplified prompt: Relies on the `history` parameter of `ai.generate` for past conversation.
// The `{{{message}}}` placeholder is for the current user message.
const chatPrompt = `You are Trish, a friendly, knowledgeable, and professional assistant for Trusted Future, a financial services agency. Your primary goal is to answer questions about financial planning, Indexed Universal Life (IUL) insurance, retirement strategies, and the services offered by Trusted Future.

Keep your responses helpful, clear, and concise. Maintain a positive and supportive tone.

If a user asks a question you cannot answer or that is outside the scope of financial advice (e.g., medical advice, personal opinions on unrelated topics), politely state that you cannot help with that specific query and try to redirect them to relevant financial topics if appropriate.

If the user expresses interest in a consultation, scheduling a meeting, or wants to provide their contact details, guide them to use the contact form fields (Name, Email, Phone) available in the chat window or to visit the "Contact Us" section of the website for more direct contact options. Do not ask for their personal contact information directly in the chat.

User's latest message: {{{message}}}
Trish's response:`;


const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => { // input contains { message: string, history?: AiChatHistoryItem[] }
    const {output} = await ai.generate({
      prompt: chatPrompt,         // The template string including system prompt and current message placeholder
      history: input.history || [], // The conversation history *before* the current user's message
      input: {                   // Data for populating placeholders in `chatPrompt`
        message: input.message,  // The current user's message
      },
      config: {
        safetySettings: [ // Added safety settings
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
           {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
           {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
           {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          }
        ],
      }
    });
    
    if (!output) {
        console.error('AI generation returned a null or undefined output object.');
        return { response: "I'm sorry, the AI service returned an unexpected empty result. Please try again." };
    }
    
    if (!output.text) {
        const finishReason = output.candidates?.[0]?.finishReason;
        const safetyRatings = output.candidates?.[0]?.safetyRatings;

        if (finishReason === 'SAFETY') {
             console.warn('AI response blocked due to safety settings. Ratings:', safetyRatings);
             return { response: "I'm sorry, I can't respond to that as it may have triggered a safety guideline. Can I help with something else related to your financial goals?" };
        }
         if (finishReason === 'MAX_TOKENS') {
            console.warn('AI response truncated due to max tokens.');
            return { response: "My response was a bit long and got cut short. Could you ask a more specific question, or perhaps break it down?" };
        }
        console.error('AI did not return text. Finish reason:', finishReason, 'Output:', output);
        return { response: "I'm sorry, I encountered an issue generating a response. Could you please rephrase or try again?" };
    }
    return { response: output.text };
  }
);

