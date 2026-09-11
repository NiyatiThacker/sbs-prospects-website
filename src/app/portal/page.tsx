"use client";
import Link from 'next/link';
import { ShieldAlert, Download, Activity, MonitorPlay } from 'lucide-react';


export default function HR360PortalPage() {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#fff8ef",
      fontFamily: "var(--font-inter)",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6rem 1.5rem 3rem",
    }}>
      
      <div style={{ maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 1, background: "rgba(184,144,26,0.4)" }} />
            <span style={{
              fontSize: "0.56rem", letterSpacing: "0.35em", fontWeight: 700,
              color: "#b8901a", textTransform: "uppercase"
            }}>
              HR360 Operations
            </span>
            <div style={{ width: 20, height: 1, background: "rgba(184,144,26,0.4)" }} />
          </div>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 400, color: "#1e1b13",
            letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 16px 0",
          }}>
            Select Your Destination
          </h1>
          <p style={{
            fontFamily: "var(--font-inter)", fontSize: "0.85rem",
            lineHeight: 1.8, color: "#5f5a52", maxWidth: 500, margin: "0 auto",
          }}>
            Access the web dashboard to manage your organization, or download the background agent to start tracking productivity.
          </p>
        </div>

        {/* Portal Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
        }}>
          
          {/* Admin Dashboard Card */}
          <div style={{
            background: "transparent",
            border: "1px solid rgba(184,144,26,0.2)",
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,144,26,0.03)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <ShieldAlert size={28} color="#b8901a" strokeWidth={1.5} style={{ marginBottom: "1.5rem" }} />
            <h2 style={{
              fontFamily: "var(--font-playfair)", fontSize: "1.5rem",
              fontWeight: 400, color: "#1e1b13", letterSpacing: "-0.02em",
              margin: "0 0 12px 0",
            }}>
              Admin Dashboard
            </h2>
            <div style={{ width: 30, height: 1, background: "#c9a84c", margin: "0 auto 16px" }} />
            <p style={{
              fontFamily: "var(--font-inter)", fontSize: "0.75rem",
              lineHeight: 1.8, color: "#5f5a52", marginBottom: "2rem", flexGrow: 1,
            }}>
              Securely access the HR360 web interface. View real-time productivity metrics, manage employee attendance, and review daily screen-time logs. Strictly restricted to management.
            </p>
            <Link 
              href="/hr360"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "0.75rem 2rem", borderRadius: 100,
                background: "transparent", border: "1px solid rgba(184,144,26,0.4)",
                color: "#b8901a", fontSize: "0.6rem", letterSpacing: "0.2em",
                fontWeight: 700, textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(184,144,26,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span>Open Dashboard</span>
            </Link>
          </div>

          {/* Desktop Agent Card */}
          <div style={{
            background: "transparent",
            border: "1px solid rgba(184,144,26,0.2)",
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,144,26,0.03)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Download size={28} color="#b8901a" strokeWidth={1.5} style={{ marginBottom: "1.5rem" }} />
            <h2 style={{
              fontFamily: "var(--font-playfair)", fontSize: "1.5rem",
              fontWeight: 400, color: "#1e1b13", letterSpacing: "-0.02em",
              margin: "0 0 12px 0",
            }}>
              Desktop Agent
            </h2>
            <div style={{ width: 30, height: 1, background: "#c9a84c", margin: "0 auto 16px" }} />
            <p style={{
              fontFamily: "var(--font-inter)", fontSize: "0.75rem",
              lineHeight: 1.8, color: "#5f5a52", marginBottom: "2rem", flexGrow: 1,
            }}>
              Download the lightweight background agent for Windows. The agent automatically tracks screen time, application usage, and syncs data directly to the cloud.
            </p>
            <a 
              href="/downloads/HR360-Agent-Setup.exe?v=2"
              download="HR360-Agent-Setup.exe"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "0.75rem 2rem", borderRadius: 100,
                background: "transparent", border: "1px solid rgba(184,144,26,0.4)",
                color: "#b8901a", fontSize: "0.6rem", letterSpacing: "0.2em",
                fontWeight: 700, textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(184,144,26,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <span>Download Client</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
