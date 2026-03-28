import { PageControls } from '../PageControls';

// ----------------------------------------------------------------------

type Props = React.PropsWithChildren & {
  /** Optional page title to be displayed */
  title?: string;
};

export function PageWrapper({ children, title }: Props) {
  return (
    <div className="mx-auto max-w-3xl my-6 p-6 bg-background/75 rounded-xl">
      <PageControls />
      {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
      {children}
    </div>
  );
}
