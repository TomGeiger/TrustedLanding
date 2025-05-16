'use server';

/**
 * @fileOverview Generates a personalized welcome message based on user data.
 *
 * - generatePersonalizedWelcomeMessage - A function that generates a personalized welcome message.
 * - PersonalizedWelcomeMessageInput - The input type for the generatePersonalizedWelcomeMessage function.
 * - PersonalizedWelcomeMessageOutput - The return type for the generatePersonalizedWelcomeMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedWelcomeMessageInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  userLocation: z.string().describe('The location of the user.'),
  userFinancialGoals: z.string().describe('The financial goals of the user.'),
});
export type PersonalizedWelcomeMessageInput = z.infer<
  typeof PersonalizedWelcomeMessageInputSchema
>;

const PersonalizedWelcomeMessageOutputSchema = z.object({
  welcomeMessage: z.string().describe('The personalized welcome message.'),
});
export type PersonalizedWelcomeMessageOutput = z.infer<
  typeof PersonalizedWelcomeMessageOutputSchema
>;

export async function generatePersonalizedWelcomeMessage(
  input: PersonalizedWelcomeMessageInput
): Promise<PersonalizedWelcomeMessageOutput> {
  return personalizedWelcomeMessageFlow(input);
}

const personalizedWelcomeMessagePrompt = ai.definePrompt({
  name: 'personalizedWelcomeMessagePrompt',
  input: {schema: PersonalizedWelcomeMessageInputSchema},
  output: {schema: PersonalizedWelcomeMessageOutputSchema},
  prompt: `You are an AI assistant specializing in creating personalized welcome messages for a financial services agency called Trusted Future.

  Generate a welcome message for a user based on the following information:

  User Name: {{{userName}}}
  User Location: {{{userLocation}}}
  User Financial Goals: {{{userFinancialGoals}}}

The welcome message should be engaging, and relevant to the user's financial goals. Keep the message short and to the point.
  `,
});

const personalizedWelcomeMessageFlow = ai.defineFlow(
  {
    name: 'personalizedWelcomeMessageFlow',
    inputSchema: PersonalizedWelcomeMessageInputSchema,
    outputSchema: PersonalizedWelcomeMessageOutputSchema,
  },
  async input => {
    const {output} = await personalizedWelcomeMessagePrompt(input);
    return output!;
  }
);
