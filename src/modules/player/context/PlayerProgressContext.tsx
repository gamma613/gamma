import { createContext } from 'react';
import type { PlayerProgressContextValue } from './types';

// ----------------------------------------------------------------------

export const PlayerProgressContext = createContext<PlayerProgressContextValue | null>(null);
