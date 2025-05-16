
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Coffee } from 'lucide-react';
import type { Metadata } from 'next';

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
                  With over three years of dedicated experience in the financial services industry, Trish has cultivated a comprehensive understanding of wealth management strategies, retirement planning intricacies, and innovative insurance solutions. Her professional expertise is firmly rooted in a client-first philosophy, ensuring that every piece of advice and financial recommendation is meticulously tailored to meet the unique needs and long-term objectives of each individual and family she serves.
                </p>
                <p>
                  Prior to her pivotal role in founding Trusted Future, Trish held several key positions at leading financial institutions. During this time, she sharpened her skills in critical areas such as advanced risk management, in-depth investment analysis, and sophisticated estate planning. She is widely recognized for her exceptional ability to demystify complex financial concepts, transforming them into accessible, understandable, and actionable strategies for her clients.
                </p>
                <p>
                  Trish is deeply committed to continuous professional development and lifelong learning. She diligently stays abreast of the latest industry trends, emerging financial products, and evolving regulatory landscapes to ensure she provides the most current, effective, and compliant advice. Her unwavering dedication to professional excellence is paralleled only by her profound commitment to fostering the financial success and security of her clients.
                </p>
                <p>
                  Beyond her direct client work, Trish is a dedicated leader and educator within Trusted Future. Each week, she conducts comprehensive **Illustration Training** sessions for the Trusted Future team. These sessions cover various insurance companies and their products, ensuring that Trusted Future agents have a broad understanding of the available options to best serve their clients.
                </p>
                <p>
                  Furthermore, Trish is passionate about extending financial literacy to the wider community. Every Tuesday, she hosts a public Zoom call called **BTO** to educate individuals on fundamental financial principles and highlight the advantages of quality cash value life insurance, particularly Indexed Universal Life (IUL) policies. This initiative underscores her commitment to empowering others with financial knowledge.
                </p>

                 <p className="italic text-muted-foreground text-sm">
                  (Further details about specific achievements, certifications, and methodologies can be expanded here to provide a fuller picture of Trish's professional background.)
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
    </div>
  );
}
