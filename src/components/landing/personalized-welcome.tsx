'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

interface PersonalizedWelcomeProps {
  message: string;
}

export default function PersonalizedWelcome({ message }: PersonalizedWelcomeProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 mt-6 mb-0 md:mt-8">
      <Alert className="bg-accent/20 border-accent/50 text-accent-foreground shadow-md">
        <Sparkles className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">A Special Welcome!</AlertTitle>
        <AlertDescription className="text-accent/90">
          {message}
        </AlertDescription>
      </Alert>
    </div>
  );
}
