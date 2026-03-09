import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "toto - Your AI Travel Companion for China";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #083022 0%, #16213E 40%, #0F3460 70%, #083022 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              "radial-gradient(circle, #E7B61B 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "linear-gradient(135deg, #E95331, #E7B61B)",
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(232, 69, 60, 0.3)",
          }}
        >
          <span style={{ fontSize: 52, color: "white", fontWeight: 800 }}>
            途
          </span>
        </div>

        <span
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          toto
        </span>
        <span
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
            marginTop: 8,
          }}
        >
          The Smart Travel Guide
        </span>

        <span
          style={{
            marginTop: 32,
            fontSize: 28,
            fontWeight: 600,
            background: "linear-gradient(135deg, #E95331, #E7B61B)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Your AI Travel Companion for China
        </span>

        <span
          style={{
            marginTop: 16,
            fontSize: 18,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Visas · Payments · Transportation · Language · Local Food
        </span>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #E95331, #E7B61B, #E95331)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
