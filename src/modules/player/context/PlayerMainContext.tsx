import { createContext } from 'react';
import type { PlayerMainContextValue } from './types';

// ----------------------------------------------------------------------

export const PlayerMainContext = createContext<PlayerMainContextValue | null>(null);
