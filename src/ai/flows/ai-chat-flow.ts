
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

// Removed export from schema definition
const AiChatHistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({ text: z.string() })),
});
export type AiChatHistoryItem = z.infer<typeof AiChatHistoryItemSchema>;

// Removed export from schema definition
const AiChatInputSchema = z.object({
  message: z.string().describe('The latest message from the user.'),
  history: z.array(AiChatHistoryItemSchema).optional().describe('The conversation history.'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

// Removed export from schema definition
const AiChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type AiChatOutput = z.infer<typeof AiChatOutputSchema>;

export async function conversationalAiChat(input: AiChatInput): Promise<AiChatOutput> {
  return aiChatFlow(input);
}

const chatPrompt = `You are Trish, a friendly, knowledgeable, and professional assistant for Trusted Future, a financial services agency. Your primary goal is to answer questions about financial planning, Indexed Universal Life (IUL) insurance, retirement strategies, and the services offered by Trusted Future.

Keep your responses helpful, clear, and concise. Maintain a positive and supportive tone.

If a user asks a question you cannot answer or that is outside the scope of financial advice (e.g., medical advice, personal opinions on unrelated topics), politely state that you cannot help with that specific query and try to redirect them to relevant financial topics if appropriate.

If the user expresses interest in a consultation, scheduling a meeting, or wants to provide their contact details, guide them to use the contact form fields (Name, Email, Phone) available in the chat window or to visit the "Contact Us" section of the website for more direct contact options. Do not ask for their personal contact information directly in the chat.

Here is the current conversation history (if any):
{{#if history}}
{{#each history}}
{{#ifCond role '===' 'user'}}User: {{parts.[0].text}}{{/ifCond}}
{{#ifCond role '===' 'model'}}Trish: {{parts.[0].text}}{{/ifCond}}
{{/each}}
{{/if}}

User's latest message: {{{message}}}
Trish's response:`;


const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: AiChatOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      prompt: chatPrompt,
      history: input.history || [],
      input: {
        message: input.message,
        history: input.history // For Handlebars access if needed, though direct history param is preferred by model
      },
      config: {
        // Example safety settings - adjust as needed
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
           {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }
    });
    
    if (!output?.text) {
        // Handle cases where the model might not return text, e.g., due to safety filters
        // You could return a default message or throw an error
        // For safety, it's often better to return a generic message if generation fails.
        const safetyFeedback = output?.candidates?.[0]?.finishReason;
        if (safetyFeedback === 'SAFETY') {
             return { response: "I'm sorry, I can't respond to that. Can I help with something else related to your financial goals?" };
        }
        return { response: "I'm sorry, I encountered an issue. Could you please rephrase or try again?" };
    }
    return { response: output.text! };
  }
);

// Registering a Handlebars helper for conditional logic within the prompt
// This is a simple equality check, more complex logic should be outside the prompt.
import Handlebars from 'handlebars';
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '===':
      // @ts-ignore
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    default:
      // @ts-ignore
      return options.inverse(this);
  }
});

