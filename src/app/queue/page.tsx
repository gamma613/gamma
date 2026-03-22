import { PageControls } from "@/components/PageControls";
import { ROUTES } from "@/lib/routes";
import { Playlist } from "@/modules/player";

export default function QueuePage() {
  return (
    <div className="py-6 mx-auto">
      <PageControls backLink={{ path: ROUTES.music().root, title: "Music" }} />
      <h1 className="text-2xl font-semibold mb-6">Playlist</h1>
      <Playlist />
    </div>
  );
}
