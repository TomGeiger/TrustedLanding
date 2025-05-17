
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionWrapper } from '@/components/landing/section-wrapper';
import { ShieldCheck, TrendingUp, Umbrella } from 'lucide-react';
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image-flow';

const iulFeatures = [
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Growth Potential",
    description: "Benefit from potential market-linked growth, typically with a floor to protect against losses.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Downside Protection",
    description: "IUL policies often include a guaranteed minimum interest rate, safeguarding your principal from market downturns.",
  },
  {
    icon: <Umbrella className="h-8 w-8 text-primary" />,
    title: "Tax Advantages & Flexibility",
    description: "Enjoy tax-deferred cash value growth, potential for tax-free loans and withdrawals, and flexible premium payments.",
  },
];

export async function IULSection() {
  const imagePromptInput: GenerateImageInput = {
    prompt: "A visually appealing abstract representation of financial growth and security. Use a color palette that includes deep blues and soft purples, conveying trust and sophistication. The image should be suitable for a financial services website's section on Indexed Universal Life insurance."
  };
  let iulImageUrl = "/images/iul2.png"; // Fallback image
  let imageAltText = "Indexed Universal Life Insurance visual representation";
  let dataAiHint = "financial growth security"; // Default hint for fallback

  try {
    console.log("Attempting to generate IUL image...");
    const result = await generateImage(imagePromptInput);
    if (result.imageUrl) {
      iulImageUrl = result.imageUrl;
      imageAltText = "AI-generated visual for Indexed Universal Life Insurance";
      dataAiHint = "abstract financial art"; // Hint for AI generated image
      console.log("Successfully generated IUL image.");
    } else {
      console.error("Failed to generate IUL image, using fallback. Error:", result.error);
    }
  } catch (error) {
    console.error("Error calling generateImage flow, using fallback:", error);
  }

  return (
    <SectionWrapper id="iul" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Understanding Indexed Universal Life (IUL) Insurance
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Indexed Universal Life (IUL) insurance is a type of permanent life insurance that offers a death benefit along with the potential to build cash value over time.
          Unlike traditional universal life insurance, IUL policies provide the opportunity for cash value growth linked to the performance of a stock market index, such as the S&P 500®.
          This means you can participate in some of the market's gains, often up to a certain cap rate, without being directly invested in the market.
          Crucially, IUL policies typically include a 'floor,' which is a minimum guaranteed interest crediting rate (often 0%), protecting your accumulated cash value from market downturns.
          This combination of potential upside growth and downside protection, along with flexible premium options and tax advantages (like tax-deferred growth and potentially tax-free access to cash value through loans or withdrawals), makes IUL a versatile tool for long-term financial planning, supplemental retirement income, or estate planning.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 relative h-80 md:h-full rounded-lg overflow-hidden shadow-xl">
          <Image
            src={iulImageUrl}
            alt={imageAltText}
            layout="fill"
            objectFit="cover"
            data-ai-hint={dataAiHint}
            className="transform hover:scale-105 transition-transform duration-500"
            unoptimized={iulImageUrl.startsWith("data:")} // Data URIs often need unoptimized
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
        Disclaimer: IUL policies are complex financial instruments. Consult with a qualified financial advisor to determine if an IUL policy is suitable for your individual needs and circumstances. Life insurance policies are subject to fees, charges, and surrender charges. Guarantees are based on the claims-paying ability of the issuing insurance company. Access to cash values through borrowing or partial surrenders will reduce the policy's cash value and death benefit, may increase the chance the policy will lapse, and may result in a tax liability if the policy terminates before the death of the insured.
      </p>
    </SectionWrapper>
  );
}
