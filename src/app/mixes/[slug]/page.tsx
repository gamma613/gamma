import { redirect } from "next/navigation";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function MixPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/music/${encodeURIComponent(slug)}`);
}
