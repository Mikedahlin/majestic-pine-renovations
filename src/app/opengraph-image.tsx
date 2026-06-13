import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Majestic Pine Renovations — Premium General Contractor, Twin Cities MN";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#121212",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            backgroundColor: "#C8963E",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Majestic Pine Renovations
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#C8963E",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Premium General Contracting
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#A0A0A0",
              fontWeight: 400,
              maxWidth: "700px",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            Luxury residential &amp; commercial construction — Minneapolis, Buffalo, and the Twin Cities Metro.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "32px",
            }}
          >
            {["Licensed & Insured", "5-Star Rated", "Twin Cities Metro"].map(
              (badge) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#6B9E6B",
                    fontSize: "16px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#6B9E6B",
                      borderRadius: "50%",
                      display: "flex",
                    }}
                  />
                  {badge}
                </div>
              ),
            )}
          </div>
          <div
            style={{
              color: "#4A4A4A",
              fontSize: "16px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            majesticpinerenovations.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
