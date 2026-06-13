import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the whole app under /cd (e.g. http://localhost:3000/cd).
  // basePath prefixes every route and all internal <Link> hrefs automatically.
  basePath: "/cd",
};

export default nextConfig;
