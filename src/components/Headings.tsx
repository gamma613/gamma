import { cn } from '@/lib/utils';
import * as React from 'react';

type HeadingProps<T extends 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> =
  React.ComponentPropsWithoutRef<T> & {
    disableGutter?: boolean;
  };

function H1({ className, disableGutter, ...props }: HeadingProps<'h1'>) {
  return (
    <h1
      data-slot="h1"
      className={cn(
        'scroll-m-20 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl',
        !disableGutter && 'mb-6',
        className
      )}
      {...props}
    />
  );
}

function H2({ className, disableGutter, ...props }: HeadingProps<'h2'>) {
  return (
    <h2
      data-slot="h2"
      className={cn(
        'scroll-m-20 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl',
        !disableGutter && 'mb-4',
        className
      )}
      {...props}
    />
  );
}

function H3({ className, disableGutter, ...props }: HeadingProps<'h3'>) {
  return (
    <h3
      data-slot="h3"
      className={cn(
        'scroll-m-20 text-xl font-semibold leading-tight tracking-tight sm:text-2xl',
        !disableGutter && 'mb-3',
        className
      )}
      {...props}
    />
  );
}

function H4({ className, disableGutter, ...props }: HeadingProps<'h4'>) {
  return (
    <h4
      data-slot="h4"
      className={cn(
        'scroll-m-20 text-lg font-semibold leading-tight tracking-tight sm:text-xl',
        !disableGutter && 'mb-2',
        className
      )}
      {...props}
    />
  );
}

function H5({ className, disableGutter, ...props }: HeadingProps<'h5'>) {
  return (
    <h5
      data-slot="h5"
      className={cn(
        'scroll-m-20 text-base font-semibold leading-tight tracking-tight sm:text-lg',
        !disableGutter && 'mb-2',
        className
      )}
      {...props}
    />
  );
}

function H6({ className, disableGutter, ...props }: HeadingProps<'h6'>) {
  return (
    <h6
      data-slot="h6"
      className={cn(
        'scroll-m-20 text-sm font-semibold leading-tight tracking-tight text-muted-foreground sm:text-base',
        !disableGutter && 'mb-2',
        className
      )}
      {...props}
    />
  );
}

export { H1, H2, H3, H4, H5, H6 };
export type { HeadingProps };
