
'use client';

import * as React from 'react';

interface ZoomQuoteClientProps {
  motivationalQuotes: string[];
}

export function ZoomQuoteClient({ motivationalQuotes }: ZoomQuoteClientProps) {
  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    if (motivationalQuotes && motivationalQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    }
  }, [motivationalQuotes]);

  if (!quote) {
    return null; // Or a loading spinner/placeholder
  }

  return (
    <div className="mt-0 mb-6 p-4 border-l-4 border-accent bg-accent/20 rounded-r-md">
      <p className="italic text-accent/90 text-center md:text-left">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}
