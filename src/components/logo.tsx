import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 32, textSize = "text-2xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="p-1.5 bg-primary rounded-md group-hover:bg-primary/90 transition-colors">
        <PiggyBank size={iconSize} className="text-primary-foreground" />
      </div>
      <span className={`font-bold ${textSize} text-primary group-hover:text-primary/90 transition-colors`}>
        Trusted Future
      </span>
    </Link>
  );
}
