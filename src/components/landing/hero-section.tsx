
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
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
            src="/images/hero-banner-financial-planning.jpg"
            alt="Financial Planning"
            layout="fill"
            objectFit="cover"
            data-ai-hint="financial planning meeting"
            className="transform hover:scale-105 transition-transform duration-500"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </SectionWrapper>
  );
}
