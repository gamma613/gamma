import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

// export default nextConfig;
export default withContentCollections(nextConfig);