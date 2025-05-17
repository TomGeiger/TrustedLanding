
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { ChevronRight } from 'lucide-react';
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image-flow';

export async function HeroSection() {
  const imagePromptInput: GenerateImageInput = {
    prompt: "A dynamic and uplifting image of a diverse group of people (e.g., families, individuals, business professionals) looking towards a bright, secure future. The scene should evoke feelings of trust, financial stability, and expert guidance. Consider a modern, clean aesthetic with subtle financial or growth-related visual cues. Use a color palette that aligns with trust and professionalism (blues, soft greens, hints of optimistic yellow or gold)."
  };
  let heroImageUrl = "/images/diverse-group.jpg"; // Fallback image
  let imageAltText = "Financial Planning for a diverse group";
  let dataAiHint = "financial planning meeting"; // Default hint for fallback

  try {
    console.log("Attempting to generate Hero image...");
    const result = await generateImage(imagePromptInput);
    if (result.imageUrl) {
      heroImageUrl = result.imageUrl;
      imageAltText = "AI-generated visual representing a secure financial future";
      dataAiHint = "diverse future finance"; // Hint for AI generated image
      console.log("Successfully generated Hero image.");
    } else {
      console.error("Failed to generate Hero image, using fallback. Error:", result.error);
    }
  } catch (error) {
    console.error("Error calling generateImage flow for Hero, using fallback:", error);
  }

  return (
    <SectionWrapper id="hero" className="bg-gradient-to-b from-background to-primary/5 pt-8 md:pt-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
            Secure Your <span className="text-accent">Future</span> with Trusted Guidance
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Trusted Future, an agency within Experior Financial Group, specializes in providing personalized financial solutions, including Indexed Universal Life Insurance, to help you achieve your long-term goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <a href="#contact">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <a href="#iul">Learn More About Our Services</a>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-96 lg:h-[450px] rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={heroImageUrl}
            alt={imageAltText}
            layout="fill"
            objectFit="cover"
            data-ai-hint={dataAiHint}
            className="transform hover:scale-105 transition-transform duration-500"
            unoptimized={heroImageUrl.startsWith("data:")} // Data URIs often need unoptimized
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
