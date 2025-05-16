import { generatePersonalizedWelcomeMessage, type PersonalizedWelcomeMessageInput } from '@/ai/flows/personalized-welcome';
import PersonalizedWelcome from '@/components/landing/personalized-welcome';
import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { IULSection } from '@/components/landing/iul-section';
import { ZoomSection } from '@/components/landing/zoom-section';
import { ContactSection } from '@/components/landing/contact-section';
import { Footer } from '@/components/landing/footer';

export default async function HomePage() {
  // Example user data for personalized welcome.
  // In a real app, this might come from user session, query params, or a form.
  const userData: PersonalizedWelcomeMessageInput = {
    userName: "Valued Visitor",
    userLocation: "your community",
    userFinancialGoals: "planning for a secure and prosperous future",
  };

  let welcomeMessageText = "Welcome to Trusted Future! We're excited to help you explore your financial options.";
  try {
    const result = await generatePersonalizedWelcomeMessage(userData);
    if (result && result.welcomeMessage) {
      welcomeMessageText = result.welcomeMessage;
    }
  } catch (error) {
    console.error("Failed to generate personalized welcome message:", error);
    // Fallback message is already set
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <PersonalizedWelcome message={welcomeMessageText} />
        <HeroSection />
        <IULSection />
        <ZoomSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
