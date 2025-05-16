import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { ShieldCheck, TrendingUp, Umbrella } from 'lucide-react';

const iulFeatures = [
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Growth Potential",
    description: "Benefit from potential market-linked growth, typically with a floor to protect against losses.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Downside Protection",
    description: "IUL policies often include a guaranteed minimum interest rate, safeguarding your principal.",
  },
  {
    icon: <Umbrella className="h-8 w-8 text-primary" />,
    title: "Tax Advantages & Flexibility",
    description: "Enjoy tax-deferred growth, tax-free death benefits, and flexible premium payments.",
  },
];

export function IULSection() {
  return (
    <SectionWrapper id="iul" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Understanding Indexed Universal Life (IUL) Insurance
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          IUL insurance offers a unique combination of death benefit protection and the opportunity to build cash value. It's a versatile tool for long-term financial planning.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 relative h-80 md:h-full rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/images/iul.png"
            alt="IUL Chart"
            layout="fill"
            objectFit="cover"
            data-ai-hint="financial growth chart"
            className="transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        </div>

        <div className="md:col-span-1 lg:col-span-2 space-y-8">
          {iulFeatures.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                <div className="p-3 bg-primary/10 rounded-md">
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-md text-foreground/80">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
       <p className="mt-10 text-center text-sm text-muted-foreground">
        Disclaimer: IUL policies are complex financial instruments. Consult with a qualified financial advisor to determine if an IUL policy is suitable for your individual needs and circumstances.
      </p>
    </SectionWrapper>
  );
}
