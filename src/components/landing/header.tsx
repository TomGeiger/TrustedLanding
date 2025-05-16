import { Logo } from '@/components/logo';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-4 md:py-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Logo iconSize={28} textSize="text-xl" />
        <nav>
          <Link href="/" className="text-base font-medium text-primary hover:text-primary/80 transition-colors">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
