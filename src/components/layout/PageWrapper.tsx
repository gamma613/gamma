import { cn } from '@/lib/utils';
import { H1 } from '../Headings';
import { PageControls } from '../PageControls';
import { VIEWPORT_PADDING_CN } from './config';

// ----------------------------------------------------------------------

type Props = React.PropsWithChildren & {
  /** Optional page title to be displayed */
  title?: string;
  /** Optional custom class names (e.g. for adjusting max-w) */
  className?: string;
};

export function PageWrapper({ children, className, title }: Props) {
  return (
    <div
      className={cn(
        'mx-auto max-w-3xl bg-background/75 rounded-xl',
        VIEWPORT_PADDING_CN.x,
        'py-4 sm:py-5 lg:py-6',
        className
      )}
    >
      <PageControls />
      {title && <H1>{title}</H1>}
      {children}
    </div>
  );
}
