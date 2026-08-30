import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 76,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        AP
      </div>
    ),
    { ...size }
  );
}
