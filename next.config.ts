import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/*': ['./.git/**/*', './.github/**/*', './scripts/**/*', './developer-assets/media/**/*'],
  },
};

// export default nextConfig;
export default withContentCollections(nextConfig);
