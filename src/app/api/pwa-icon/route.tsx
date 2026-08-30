import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const size = Number(req.nextUrl.searchParams.get("size") ?? 512);
  const dim = [192, 512].includes(size) ? size : 512;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fbbf24 0%, #e11d48 60%, #2563eb 100%)",
          color: "white",
          fontSize: dim * 0.42,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        AP
      </div>
    ),
    { width: dim, height: dim }
  );
}
