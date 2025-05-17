
'use server';
/**
 * @fileOverview A Genkit flow for editing images based on a source image and a text prompt.
 * - editImage - Edits an image based on a source image data URI and a text prompt.
 * - EditImageInput - Input schema for image editing.
 * - EditImageOutput - Output schema for image editing.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EditImageInputSchema = z.object({
  sourceImageDataUri: z.string().describe(
    "The source image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  editPrompt: z.string().describe('The text prompt describing the desired modifications to the image.'),
});
export type EditImageInput = z.infer<typeof EditImageInputSchema>;

const EditImageOutputSchema = z.object({
  editedImageUrl: z.string().describe('The data URI of the edited image.').nullable(),
  error: z.string().optional().describe('Error message if image editing failed.'),
});
export type EditImageOutput = z.infer<typeof EditImageOutputSchema>;

export async function editImage(input: EditImageInput): Promise<EditImageOutput> {
  return editImageFlow(input);
}

const editImageFlow = ai.defineFlow(
  {
    name: 'editImageFlow',
    inputSchema: EditImageInputSchema,
    outputSchema: EditImageOutputSchema,
  },
  async ({ sourceImageDataUri, editPrompt }) => {
    try {
      console.log(`[editImageFlow] Received edit prompt: "${editPrompt}" for image starting with: ${sourceImageDataUri.substring(0,100)}...`);
      const {media, text} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Use this model for image generation/editing
        prompt: [
          {media: {url: sourceImageDataUri}},
          {text: editPrompt},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ],
        },
      });

      if (media?.url) {
        console.log('[editImageFlow] Image editing successful.');
        return { editedImageUrl: media.url, error: undefined };
      } else {
        const errorMessage = `Image editing did not return a media URL. AI Text Response: ${text || "No text response."}`;
        console.error('[editImageFlow] ' + errorMessage);
        return { editedImageUrl: null, error: errorMessage };
      }
    } catch (error: any) {
      console.error('[editImageFlow] Error during image editing flow:', error);
      return { editedImageUrl: null, error: error.message || 'An unexpected error occurred during image editing.' };
    }
  }
);
