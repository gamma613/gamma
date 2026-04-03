import { createContext } from 'react';
import type { PlayerVolumeContextValue } from './types';

// ----------------------------------------------------------------------

export const PlayerVolumeContext = createContext<PlayerVolumeContextValue | null>(null);
