import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
