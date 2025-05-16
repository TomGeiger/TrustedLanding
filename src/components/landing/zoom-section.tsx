import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { CalendarDays, Video, Coffee } from 'lucide-react';
import Image from 'next/image';

export function ZoomSection() {
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
                Join Trish every weekday for a dose of motivation and financial wisdom to start your day right!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <CalendarDays className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg text-primary">Schedule:</h4>
                  <p className="text-muted-foreground">Monday - Friday</p>
                  <p className="text-muted-foreground">8:00 AM - 8:30 AM (EST)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Video className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg text-primary">How to Join:</h4>
                  <p className="text-muted-foreground">The session is hosted on Zoom. Click the link below to join!</p>
                </div>
              </div>
              <Button size="lg" className="w-full md:w-auto shadow-md hover:shadow-lg transition-shadow" asChild>
                <a href="https://zoom.us/join" target="_blank" rel="noopener noreferrer">
                  Join Zoom Session <Video className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
