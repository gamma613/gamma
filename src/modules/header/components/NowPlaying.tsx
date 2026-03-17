import { PingPong } from '@/components/animation/PingPong';
import { Player, PlayToggleButton, SeekBar, TrackArt, TrackArtist, TrackTitle, VolumeSlider } from '@/modules/player';
//
import { TrackDuration } from '@/modules/player/components/TrackDuration';
import { TrackPosition } from '@/modules/player/components/TrackPosition';

// ----------------------------------------------------------------------

export function NowPlaying() {
  return (
    <div aria-label="Now playing" role="Region" className="px-4">
      {/* Embed the player (hidden) */}
      <div aria-hidden="true" className="hidden">
        <Player />
      </div>

      {/* Toolbar */}
      <div role="toolbar" aria-label="Media controls" className="flex flex-row items-center gap-4">
        <PlayToggleButton className="h-11 w-11" /> 
        <TrackArt width={44} height={44} className="hidden sm:block" />
        {/* TODO: move this into a button w/ popover */}
        <div className="hidden sm-block">
          <VolumeSlider className="px-6 flex-1 max-w-[150px]" />
        </div>

        {/* Track info: shrinkable container */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-shrink min-w-0">
            {/* PingPong scrolls single line, constrained by parent width */}
            <PingPong speed={30} pause={1000} className="text-foreground text-xs sm:text-sm/4">
              <TrackTitle />
              <span className="text-muted-foreground">
                <span aria-hidden="true"> — </span>
                <span className="sr-only"> by </span>
                <TrackArtist />
                and some extra long text to demo scrolling
              </span> 
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
