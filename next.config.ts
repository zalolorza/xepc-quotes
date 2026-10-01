import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Avoid picking up a parent-directory lockfile (e.g. ~/package-lock.json)
  // which confuses Turbopack's workspace root detection.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
