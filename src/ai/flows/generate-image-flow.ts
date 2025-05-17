
'use server';
/**
 * @fileOverview A Genkit flow for generating images.
 * - generateImage - Generates an image based on a text prompt.
 * - GenerateImageInput - Input schema for image generation.
 * - GenerateImageOutput - Output schema for image generation.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.').nullable(),
  error: z.string().optional().describe('Error message if image generation failed.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    try {
      const {media, text} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Use this model for image generation
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
           safetySettings: [ // Recommended safety settings for broader content generation
             { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
             { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
             { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
             { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
           ],
        },
      });

      if (media?.url) {
        return { imageUrl: media.url, error: undefined };
      } else {
        const errorMessage = `Image generation did not return a media URL. AI Text Response: ${text || "No text response."}`;
        console.error(errorMessage);
        return { imageUrl: null, error: errorMessage };
      }
    } catch (error: any) {
      console.error('Error during image generation flow:', error);
      return { imageUrl: null, error: error.message || 'An unexpected error occurred during image generation.' };
    }
  }
);
