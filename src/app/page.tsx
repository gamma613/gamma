import { ROUTES } from '@/lib/routes';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export default function RootPage() {
  redirect(ROUTES.music().root);
}
