
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Coffee, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { ChatWidget } from '@/components/landing/chat-widget';
import { editImage, type EditImageInput } from '@/ai/flows/edit-image-flow';
import fs from 'fs/promises';
import path from 'path';

export const metadata: Metadata = {
  title: 'About Trish Geiger - Trusted Future',
  description: 'Learn more about Patricia "Trish" Geiger, Founding Executive Director of Trusted Future.',
};

export default async function AboutTrishPage() {
  const originalImagePath = '/images/trish3.jpeg';
  const originalImageAlt = "Patricia 'Trish' Geiger";
  let editedImageUrl: string | null = null;
  let editedImageError: string | undefined = undefined;

  try {
    const imageFileName = 'trish3.jpeg';
    const imageFilePath = path.join(process.cwd(), 'public', 'images', imageFileName);
    const imageBuffer = await fs.readFile(imageFilePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/jpeg'; // Assuming trish3.jpeg is a JPEG
    const sourceImageDataUri = `data:${mimeType};base64,${base64Image}`;

    const editPromptInput: EditImageInput = {
      sourceImageDataUri: sourceImageDataUri,
      editPrompt: "Give this portrait a slightly more artistic, painterly style while maintaining a professional look. Enhance the lighting subtly.",
    };
    console.log(`[AboutTrishPage] Attempting to edit image: ${imageFileName} with prompt: "${editPromptInput.editPrompt}"`);
    const result = await editImage(editPromptInput);
    if (result.editedImageUrl) {
      editedImageUrl = result.editedImageUrl;
      console.log(`[AboutTrishPage] Successfully edited image.`);
    } else {
      editedImageError = result.error || "Image editing flow did not return a URL.";
      console.error(`[AboutTrishPage] Failed to edit image: ${editedImageError}`);
    }
  } catch (error: any) {
    editedImageError = error.message || "An error occurred while preparing or calling the image edit flow.";
    console.error(`[AboutTrishPage] Error during image editing setup: ${editedImageError}`);
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Introduction Section */}
        <SectionWrapper id="trish-intro" className="pt-12 md:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-1 flex flex-col items-center gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">Original Portrait</h3>
                <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden shadow-2xl border-4 border-primary/30">
                  <Image
                    src={originalImagePath}
                    alt={originalImageAlt}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="professional headshot woman"
                    className="transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {editedImageUrl && (
                <div className="text-center mt-8 lg:mt-0">
                  <h3 className="text-xl font-semibold text-accent mb-2 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 mr-2 text-accent" />
                    AI-Enhanced Portrait
                  </h3>
                  <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden shadow-2xl border-4 border-accent/30">
                    <Image
                      src={editedImageUrl}
                      alt="AI-Enhanced portrait of Trish Geiger"
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="artistic professional woman"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                      unoptimized={true} 
                    />
                  </div>
                </div>
              )}
              {editedImageError && !editedImageUrl && (
                 <p className="text-sm text-destructive mt-2 text-center">Could not generate AI-enhanced portrait: {editedImageError}</p>
              )}
            </div>

            <div className="lg:col-span-2 space-y-5 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                Patricia &ldquo;Trish&rdquo; Geiger
              </h1>
              <p className="text-2xl text-accent font-semibold">
                Founding Executive Director, Trusted Future
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Trish Geiger is a visionary leader and the founding Executive Director of Trusted Future. With a passion for empowering individuals and families to achieve financial security, Trish has dedicated her career to providing expert guidance and personalized solutions. She believes in building lasting relationships based on trust, integrity, and a deep understanding of her clients' unique aspirations.
              </p>
            </div>
          </div>
        </SectionWrapper>

        {/* Experience and Expertise Section */}
        <SectionWrapper id="trish-experience" className="bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl bg-card">
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-accent/10 rounded-full mb-3">
                  <Briefcase className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Experience and Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-lg text-foreground/80 leading-relaxed">
                <p>
                  With over three years in financial services, Trish offers profound expertise in wealth management, retirement strategies, and advanced insurance solutions. Her client-centric philosophy ensures advice is precisely tailored to meet diverse individual and family goals.
                </p>
                <p>
                  Trish excels at simplifying complex financial topics, making them accessible and actionable. She is deeply committed to ongoing professional development, staying informed on industry innovations to deliver current and effective financial guidance.
                </p>
                <p>
                  As a key leader at Trusted Future, Trish spearheads weekly **Illustration Training** sessions and educates on financial principles and IUL benefits through her Tuesday **BTO** (Build The Opportunity) Zoom calls.
                </p>
                 <p className="italic text-muted-foreground text-sm pt-2">
                  (More details on Trish's background and certifications are available upon request.)
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>

        {/* Morning with Trish Section */}
        <SectionWrapper id="trish-morning-link" className="pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="shadow-lg bg-card overflow-hidden">
              <CardHeader className="items-center bg-primary/5 p-6">
                 <div className="p-3 bg-accent/10 rounded-full mb-3">
                    <Coffee className="h-10 w-10 text-accent" />
                  </div>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">Mornings with Trish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <CardDescription className="text-lg text-foreground/80 leading-relaxed">
                  Get ready to kickstart your day with positivity and purpose! Join Trish for her uplifting "Mornings with Trish" sessions. These upcoming daily gatherings are designed to provide a dose of motivation, valuable financial insights, and an infusion of positive energy to help you navigate your day and financial journey with confidence.
                </CardDescription>
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="/#kickstart">
                    Discover "Mornings with Trish"
                  </Link>
                </Button>
                 <p className="text-sm text-muted-foreground pt-2">
                    This will take you to the "Mornings with Trish" section on our main page for the latest updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
