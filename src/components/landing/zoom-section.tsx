
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { CalendarDays, Video, Coffee, Hourglass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

export function ZoomSection() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // This will only run on the client, after initial hydration
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <SectionWrapper id="kickstart" className="bg-primary/5">
      <div className="grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-2 relative h-80 md:h-[400px] rounded-lg overflow-hidden shadow-xl order-last md:order-first">
            <Image
                src="/images/trish2.jpeg"
                alt="Mornings with Trish"
                layout="fill"
                objectFit="cover"
                data-ai-hint="motivational speaker online"
                className="transform hover:scale-105 transition-transform duration-500"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
              {quote && (
                <div className="mt-0 mb-6 p-4 border-l-4 border-accent bg-accent/20 rounded-r-md">
                  <p className="italic text-accent/90 text-center md:text-left">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
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
