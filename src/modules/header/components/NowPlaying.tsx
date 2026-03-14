import { MuteButton, Player, PlayToggleButton, TrackArt, TrackTitle, VolumeSlider } from '@/modules/player';
//
import { TrackDuration } from '@/modules/player/components/TrackDuration';
import { TrackPosition } from '@/modules/player/components/TrackPosition';

// ----------------------------------------------------------------------

export function NowPlaying() {
  return (
    <>
      <div aria-hidden="true" className="hidden">
        <Player />
      </div>
      <TrackArt width={50} height={50} />
      
      <PlayToggleButton /> 
      <MuteButton /> 
      <VolumeSlider />
      <div className="ml-auto flex flex-col items-start">
        <TrackTitle className="w-full max-w-[12rem] sm:max-w-[16rem] truncate text-xs leading-none text-muted-foreground" />
        <div className="flex items-center gap-2 tabular-nums text-xs leading-none text-muted-foreground">
          <TrackPosition className="text-foreground" />
          <span className="hidden sm:inline">/</span>
          <TrackDuration className="text-foreground" />
        </div>
      </div>
    </>
  );
}
