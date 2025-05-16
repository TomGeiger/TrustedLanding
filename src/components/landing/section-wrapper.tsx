import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends PropsWithChildren {
  className?: string;
  id?: string;
  containerClassName?: string;
}

export function SectionWrapper({ children, className, id, containerClassName }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-12 md:py-16 lg:py-20', className)}>
      <div className={cn('container mx-auto px-4 md:px-6', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
