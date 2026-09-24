import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's client runtime ships WASM query engines for every database
  // provider (cockroachdb/mysql/sqlite/sqlserver/postgresql) regardless of
  // which one schema.prisma actually uses, and picks between them with a
  // dynamic require the file tracer can't rule out statically — so every
  // route that touches Prisma bundles all ~55MB of them. This schema only
  // ever uses postgresql; drop the other four from every route's bundle.
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@prisma/client/runtime/query_engine_bg.{cockroachdb,mysql,sqlite,sqlserver}.*",
      "node_modules/@prisma/client/runtime/query_compiler_bg.{cockroachdb,mysql,sqlite,sqlserver}.*",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
