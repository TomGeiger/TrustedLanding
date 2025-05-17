
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Coffee } from 'lucide-react';
import type { Metadata } from 'next';
import { ChatWidget } from '@/components/landing/chat-widget';

export const metadata: Metadata = {
  title: 'About Trish Geiger - Trusted Future',
  description: 'Learn more about Patricia "Trish" Geiger, Founding Executive Director of Trusted Future.',
};

export default function AboutTrishPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Introduction Section */}
        <SectionWrapper id="trish-intro" className="pt-12 md:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full overflow-hidden shadow-2xl border-4 border-primary/30">
                <Image
                  src="/images/trish3.jpeg"
                  alt="Patricia 'Trish' Geiger"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="professional headshot woman"
                  className="transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
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
                Prior to founding Trusted Future, Trish honed her skills at prominent financial institutions, mastering risk management and investment analysis. She excels at simplifying complex financial topics, making them accessible and actionable for her clients.
              </p>
              <p>
                Trish is deeply committed to ongoing professional development, diligently staying informed on industry innovations and regulatory changes to deliver the most current and effective financial guidance.
              </p>
              <p>
                As a key leader at Trusted Future, Trish spearheads weekly **Illustration Training** sessions for the team, ensuring agents are well-versed in a variety of insurance products to offer robust and comprehensive solutions. She also extends financial literacy to the wider community through her Tuesday **BTO** (Build The Opportunity) Zoom calls, where she educates on core financial principles and the significant benefits of cash value life insurance, with a special focus on Indexed Universal Life (IUL) policies.
              </p>
                 <p className="italic text-muted-foreground text-sm pt-2">
                  (More details on Trish's background, achievements, and professional certifications are available upon request.)
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
