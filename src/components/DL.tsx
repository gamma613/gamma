import { cn } from '@/lib/utils';
import * as React from 'react';

// ----------------------------------------------------------------------

type DLVariant = 'table';

type DLProps = React.ComponentPropsWithoutRef<'dl'> & {
  variant?: DLVariant;
};

function DL({ className, variant = 'table', ...props }: DLProps) {
  return (
    <dl
      data-slot="dl"
      data-variant={variant}
      className={cn(
        variant === 'table' && 'table w-full text-sm',
        // Prevent table layout from overflowing its container.
        'min-w-0',
        className
      )}
      {...props}
    />
  );
}

function DLRow({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div data-slot="dl-row" className={cn('table-row', className)} {...props} />;
}

function DT({ className, ...props }: React.ComponentPropsWithoutRef<'dt'>) {
  return (
    <dt
      data-slot="dt"
      className={cn(
        'table-cell py-2 pr-4 text-left font-medium align-top whitespace-nowrap',
        'border-b border-border/60',
        className
      )}
      {...props}
    />
  );
}

function DD({ className, ...props }: React.ComponentPropsWithoutRef<'dd'>) {
  return (
    <dd
      data-slot="dd"
      className={cn('table-cell py-2 w-full border-b border-border/60', className)}
      {...props}
    />
  );
}

export { DD, DL, DLRow, DT };
export type { DLProps, DLVariant };
