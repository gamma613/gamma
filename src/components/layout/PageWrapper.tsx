import { cn } from '@/lib/utils';
import { PageControls } from '../PageControls';

// ----------------------------------------------------------------------

type Props = React.PropsWithChildren & {
  /** Optional page title to be displayed */
  title?: string;
};

export const CN_PAGE_WRAPPER_PADDING = {
  x: 'px-4 sm:px-5 lg:px-6',
  y: 'py-4 sm:py-5 lg:py-6',
};

export function PageWrapper({ children, title }: Props) {
  return (
    <div
      className={cn(
        'mx-auto max-w-3xl bg-background/75 rounded-xl',
        CN_PAGE_WRAPPER_PADDING.x,
        CN_PAGE_WRAPPER_PADDING.y
      )}
    >
      <PageControls />
      {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
      {children}
    </div>
  );
}
