import { PingPong } from '@/components';
import {
  Player,
  PlayToggleButton,
  SeekBar,
  TrackArt,
  TrackDuration,
  TrackPosition,
  TrackTitleArtist,
  VolumePopover,
} from '@/modules/player';

// ----------------------------------------------------------------------

export function HeaderPlayer() {
  return (
    <div aria-label="Now playing" role="Region" className="px-4">
      {/* Embed the player (hidden) */}
      <div aria-hidden="true" className="hidden">
        <Player />
      </div>

      {/* Toolbar */}
      <div role="toolbar" aria-label="Media controls" className="flex flex-row items-center gap-4">
        {/* Play toggle */}
        <PlayToggleButton className="h-11 w-11" />
        {/* Volume popover (sm:up) */}
        <VolumePopover
          buttonProps={{
            className: 'h-11 w-11',
          }}
          className="hidden sm:block"
        />
        {/* Art (sm:up) */}
        <TrackArt width={44} height={44} className="hidden sm:block" />
        {/* Track info: shrinkable container */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="shrink min-w-0">
            {/* PingPong scrolls single line, constrained by parent width */}
            <PingPong
              speed={30}
              pause={1000}
              className="text-foreground text-xs/4 xs:text-sm/4 sm:text-md/4"
            >
              <TrackTitleArtist />
            </PingPong>
          </div>

          {/* Track position and duration */}
          <div className="flex items-center gap-2 pt-1 tabular-nums text-foreground text-xs">
            <TrackPosition />
            <span className="text-muted-foreground">/</span>
            <TrackDuration />
          </div>
        </div>

        {/* Seek bar - sits overtop of the header */}
        <SeekBar className="fixed inset-x-0 bottom-(--header-height) z-31" />
      </div>
    </div>
  );
}
