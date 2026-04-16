import { createContext } from 'react';

// ----------------------------------------------------------------------

export type PlayerMediaContextValue = {
  mediaEl: HTMLMediaElement | null;
  setMediaEl: (el: HTMLMediaElement | null) => void;
};

export const PlayerMediaContext = createContext<PlayerMediaContextValue | null>(null);
