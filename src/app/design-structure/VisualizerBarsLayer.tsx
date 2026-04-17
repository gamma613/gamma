'use client';

import {
  VisualizerBars,
  VisualizerBarsConfig,
  VisualizerBarsProps,
} from '../../components/animation/VisualizerBars';
import { usePageCollapse } from '../../components/layout';

// ----------------------------------------------------------------------

/**
 * VisualizerBars, but with dynamic opacity based on `collapsed `state from
 * PageCollapseProvider
 */
export function VisualizerBarsLayer({
  config,
  ...rest
}: Omit<VisualizerBarsProps, 'config'> & {
  config: Omit<VisualizerBarsConfig, 'opacity'>;
}) {
  const { collapsed } = usePageCollapse();
  return (
    <VisualizerBars
      config={{
        ...config,
        opacity: collapsed ? 0.9 : 0.25,
      }}
      {...rest}
    />
  );
}
