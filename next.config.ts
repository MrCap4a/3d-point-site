import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ssh2"],
  async redirects() {
    return [
      {
        // Серийное производство теперь — секция «Малые серии» на /business.
        source: "/serial",
        destination: "/business#serial",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
