import { PageControls } from "@/components/PageControls";
import { ROUTES } from "@/lib/routes";
import { UpNext } from "@/modules/player";

export default function QueuePage() {
  return (
    <div className="py-6 mx-auto">
      <PageControls backLink={{ path: ROUTES.music().root, title: "Music" }} />
      <h1 className="text-2xl font-semibold mb-6">Queue</h1>
      <UpNext />
    </div>
  );
}
