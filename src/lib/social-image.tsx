import { SITE_NAME } from "./constants";

export function SocialImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "linear-gradient(135deg, #10231a 0%, #173528 38%, #234837 72%, #315f49 100%)",
        color: "#f7f2eb",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "830px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#f2d6b1",
            }}
          >
            Luxury General Contractor
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: "rgba(247,242,235,0.88)",
            }}
          >
            Remodeling, additions, outdoor living, and commercial build-outs
            across Minneapolis, Buffalo, and the Twin Cities.
          </div>
        </div>

        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 9999,
              border: "12px solid #f2d6b1",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            color: "rgba(247,242,235,0.74)",
          }}
        >
          <div style={{ display: "flex", fontSize: 26 }}>
            Precision craftsmanship. Transparent project delivery.
          </div>
          <div style={{ display: "flex", fontSize: 22 }}>
            majesticpinerenovations.com
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {["Residential", "Commercial", "Exterior"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.1)",
                color: "#f2d6b1",
                fontSize: 20,
                letterSpacing: 1,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
