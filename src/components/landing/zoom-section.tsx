
// Note: This component is an async Server Component.
import * as React from 'react'; // Keep React import for JSX
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { CalendarDays, Video, Coffee, Hourglass, Sparkles } from 'lucide-react';
import { editImage, type EditImageInput } from '@/ai/flows/edit-image-flow';
import { ZoomQuoteClient } from './zoom-quote-client'; // Import the new client component

const fs = require('fs/promises');
const path = require('path');

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger."
];

export async function ZoomSection() {
  const originalImageFileName = 'trish2.jpeg';
  const originalImagePath = `/images/${originalImageFileName}`;
  const originalImageAlt = "Mornings with Trish";
  let displayImageUrl = originalImagePath;
  let displayImageAlt = originalImageAlt;
  let imageError: string | undefined = undefined;
  let isAiEnhanced = false;

  try {
    const imageFilePath = path.join(process.cwd(), 'public', 'images', originalImageFileName);
    const imageBuffer = await fs.readFile(imageFilePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg'; // Assuming trish2.jpeg is a JPEG
    const sourceImageDataUri = `data:${mimeType};base64,${base64Image}`;

    const editPromptInput: EditImageInput = {
      sourceImageDataUri: sourceImageDataUri,
      editPrompt: "Give this image a brighter, more energetic morning feel. Subtly enhance the colors and lighting to be warm and inviting, suitable for a motivational 'Mornings with Trish' session. Keep the professional look.",
    };
    console.log(`[ZoomSection] Attempting to edit image: ${originalImageFileName} with prompt: "${editPromptInput.editPrompt}"`);
    const result = await editImage(editPromptInput);

    if (result.editedImageUrl) {
      displayImageUrl = result.editedImageUrl;
      displayImageAlt = "AI-Enhanced portrait for Mornings with Trish";
      isAiEnhanced = true;
      console.log(`[ZoomSection] Successfully edited image for Mornings with Trish.`);
    } else {
      imageError = result.error || "Image editing flow did not return a URL for ZoomSection.";
      console.error(`[ZoomSection] Failed to edit image: ${imageError}`);
    }
  } catch (error: any) {
    imageError = error.message || "An error occurred while preparing or calling the image edit flow for ZoomSection.";
    console.error(`[ZoomSection] Error during image editing setup: ${imageError}`);
  }

  return (
    <SectionWrapper id="kickstart" className="bg-primary/5">
      <div className="grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-2 relative h-80 md:h-[400px] rounded-lg overflow-hidden shadow-xl order-last md:order-first">
          <Image
            src={displayImageUrl}
            alt={displayImageAlt}
            layout="fill"
            objectFit="cover"
            data-ai-hint={isAiEnhanced ? "AI enhanced motivational speaker" : "motivational speaker online"}
            className="transform hover:scale-105 transition-transform duration-500"
            unoptimized={displayImageUrl.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
           {isAiEnhanced && (
            <div className="absolute top-2 right-2 bg-accent/80 text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full shadow-md flex items-center backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" /> AI Enhanced
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <Card className="shadow-xl bg-card">
            <CardHeader className="text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-2 text-accent">
                <Coffee className="h-8 w-8" />
                <CardTitle className="text-3xl md:text-4xl font-bold text-accent">
                  Mornings with Trish
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-muted-foreground">
                Get ready! Trish will soon be hosting daily sessions for a dose of motivation and financial wisdom to start your day right! <strong className="text-primary">Coming Soon!</strong>
              </CardDescription>
              <p className="text-base text-muted-foreground mt-3 text-center md:text-left">
                Curious about the host?{' '}
                <Link href="/about-trish" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                  Meet Patricia &ldquo;Trish&rdquo; Geiger
                </Link>.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ZoomQuoteClient motivationalQuotes={motivationalQuotes} />
              {imageError && (
                <p className="text-sm text-destructive text-center md:text-left">
                  AI image enhancement failed: {imageError}. Displaying original.
                </p>
              )}
              <div className="flex items-start gap-4">
                <CalendarDays className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg text-primary">Anticipated Schedule:</h4>
                  <p className="text-muted-foreground">Monday - Friday</p>
                  <p className="text-muted-foreground">8:00 AM - 8:30 AM (EST)</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                    <Hourglass className="h-3 w-3" />
                    Coming Soon
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Video className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg text-primary">How to Join:</h4>
                  <p className="text-muted-foreground">Details on how to join the Zoom session will be available soon. Stay tuned!</p>
                </div>
              </div>
              <Button size="lg" className="w-full md:w-auto shadow-md" disabled>
                <Hourglass className="mr-2 h-5 w-5" />
                Coming Soon!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
