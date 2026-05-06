/* global React */
const { useState } = React;

// ===== Shared Icons (stroke-based, 1.5px) =====
const Icon = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 1.6, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const I = {
  search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Icon>,
  bell:   (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" /><path d="M10 21a2 2 0 0 0 4 0" /></Icon>,
  book:   (p) => <Icon {...p}><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" /><path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8Z" /></Icon>,
  gear:   (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></Icon>,
  more:   (p) => <Icon {...p}><circle cx="5" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="19" cy="12" r="1.3" fill="currentColor" /></Icon>,
  moreV:  (p) => <Icon {...p}><circle cx="12" cy="5" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="19" r="1.3" fill="currentColor" /></Icon>,
  menu:   (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>,
  chevD:  (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>,
  chevR:  (p) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>,
  cal:    (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>,
  filter: (p) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4" /></Icon>,
  plus:   (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>,
  spark:  (p) => <Icon {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M14 4l-1.6 4.4L8 10l4.4 1.6L14 16l1.6-4.4L20 10l-4.4-1.6Z" /></Icon>,
  arrowU: (p) => <Icon {...p}><path d="m6 9 6-6 6 6" /><path d="M12 3v18" /></Icon>,
  arrowUR:(p) => <Icon {...p}><path d="M7 17 17 7M9 7h8v8" /></Icon>,
  refresh:(p) => <Icon {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></Icon>,
  dot:    (p) => <Icon {...p}><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /></Icon>,
  grid:   (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>,
  chart:  (p) => <Icon {...p}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-6" /></Icon>,
  users:  (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" /><circle cx="17" cy="6" r="2.5" /><path d="M22 18c0-2.5-2-4.5-5-4.5" /></Icon>,
  mega:   (p) => <Icon {...p}><path d="M3 11v2a2 2 0 0 0 2 2h1l4 4V5L6 9H5a2 2 0 0 0-2 2Z" /><path d="M14 7a5 5 0 0 1 0 10" /></Icon>,
  box:    (p) => <Icon {...p}><path d="M3 7 12 3l9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></Icon>,
  cart:   (p) => <Icon {...p}><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.5 12h12L22 7H6" /></Icon>,
  dollar: (p) => <Icon {...p}><path d="M12 2v20" /><path d="M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5" /></Icon>,
  mail:   (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></Icon>,
  eye:    (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>,
  sparkAI:(p) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></Icon>,
  cmd:    (p) => <Icon {...p}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z" /></Icon>,
};

// ===== Helpers =====
const Sparkline = ({ data, color, height = 36, fill = true, gridless = true }) => {
  const w = 100, h = 100;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * h]);
  const pathD = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const fillD = `${pathD} L${w},${h} L0,${h} Z`;
  const id = "sg" + Math.random().toString(36).slice(2, 8);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={fillD} fill={`url(#${id})`} />}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Bars = ({ data, color, height = 80 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: color, opacity: 0.18 + (v / max) * 0.7, borderRadius: 3 }} />
      ))}
    </div>
  );
};

// ===== Sample data =====
const REV_SPARK = [12, 14, 13, 18, 16, 22, 24, 28, 26, 32, 35, 34, 40, 44, 42, 48, 52, 56, 60, 65, 72, 78, 82, 88, 94, 102, 108, 112, 118, 125];
const ORD_SPARK = [4, 5, 6, 5, 7, 8, 9, 11, 10, 12, 13, 15, 14, 16, 18, 17, 19, 20, 22, 21, 23, 24, 26, 25, 27, 28, 30, 29, 31, 33];
const RATE_SPARK = [40, 42, 41, 43, 44, 45, 47, 46, 48, 49, 50, 51, 50, 52, 53, 54, 55, 54, 55, 56, 55, 56, 57, 56, 57, 58, 57, 58, 58, 59];
const CONT_SPARK = [200, 210, 220, 235, 245, 260, 275, 290, 305, 320, 335, 350, 360, 375, 390, 405, 420, 430, 445, 460, 475, 490, 505, 520, 535, 550, 565, 580, 595, 610];
const CHANNEL_BARS = [12, 18, 22, 30, 28, 35, 42, 38, 48, 55, 60, 66, 70, 75, 82, 78, 88, 92, 95, 98, 102, 108, 112, 118];

const ACTIVITY = [
  { t: "Campaign sent", n: "Spring Refresh — Segment A", v: "12,408 recipients", time: "2m ago", tag: "email" },
  { t: "Order placed", n: "#A-29481 · Maya Lin", v: "$248.00", time: "6m ago", tag: "order" },
  { t: "Segment updated", n: "VIP repeat buyers", v: "+312 contacts", time: "14m ago", tag: "audience" },
  { t: "Automation triggered", n: "Cart abandoned · Step 2", v: "84 in flow", time: "22m ago", tag: "auto" },
  { t: "Order placed", n: "#A-29479 · Theo Park", v: "$1,120.00", time: "31m ago", tag: "order" },
];

const CAMPAIGNS = [
  { name: "Spring Refresh",     sent: "12,408", open: "58.2%", click: "12.4%", rev: "$8,420" },
  { name: "Loyalty · April",    sent: "4,210",  open: "63.1%", click: "18.7%", rev: "$3,180" },
  { name: "New Arrivals — Tee", sent: "8,902",  open: "44.6%", click: "9.1%",  rev: "$2,640" },
  { name: "Win-back · Dormant", sent: "2,140",  open: "31.0%", click: "5.2%",  rev: "$890"   },
];

// ===== SIDEBAR =====
function Sidebar({ variant, accent, style = "comfortable", logoText = "NORTH" }) {
  const isDark = variant === "dark";
  const items = [
    { icon: I.grid,  label: "Dashboards", active: true, children: ["Home", "Active dashboard", "All dashboards", "Live view"] },
    { icon: I.chart, label: "Analytics" },
    { icon: I.users, label: "Audience" },
    { icon: I.mega,  label: "Marketing" },
    { icon: I.box,   label: "Products" },
    { icon: I.cart,  label: "Commerce" },
  ];

  const bg     = isDark ? "#0f1115" : (style === "minimal" ? "transparent" : "var(--surface-1)");
  const border = isDark ? "#1c2027" : "var(--hairline)";
  const ink    = isDark ? "#e7e9ee" : "var(--ink)";
  const muted  = isDark ? "#8a92a3" : "var(--muted)";
  const hover  = isDark ? "#161922" : "var(--surface-2)";
  const activeBg = isDark ? "#161c2b" : "color-mix(in oklch, var(--accent) 10%, transparent)";
  const activeInk = isDark ? "#fff" : "var(--accent-ink)";

  return (
    <aside style={{ width: 248, background: bg, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", padding: "18px 14px", gap: 4, color: ink }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 18px", borderBottom: `1px solid ${border}`, marginBottom: 10 }}>
        <button style={{ ...iconBtnSty(ink, hover), border: "none", background: "transparent" }}><I.menu size={18} /></button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--accent)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 11, letterSpacing: 0.5 }}>N</div>
          <div style={{ fontWeight: 700, letterSpacing: 1.4, fontSize: 13, color: ink }}>{logoText}</div>
        </div>
      </div>

      {items.map((it, i) => (
        <div key={i}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "9px 10px", borderRadius: 10, border: "none",
            background: it.active ? activeBg : "transparent",
            color: it.active ? activeInk : ink,
            fontSize: 13.5, fontWeight: it.active ? 600 : 500, cursor: "pointer", textAlign: "left",
          }}>
            <it.icon size={17} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.children && <I.chevD size={14} />}
          </button>
          {it.children && it.active && (
            <div style={{ marginLeft: 28, borderLeft: `1px solid ${border}`, paddingLeft: 10, marginTop: 2, marginBottom: 4, display: "flex", flexDirection: "column", gap: 1 }}>
              {it.children.map((c, j) => (
                <button key={j} style={{
                  textAlign: "left", padding: "7px 10px", borderRadius: 8, border: "none",
                  background: c === "Active dashboard" ? (isDark ? "#1a2030" : "color-mix(in oklch, var(--accent) 8%, transparent)") : "transparent",
                  color: c === "Active dashboard" ? activeInk : muted,
                  fontWeight: c === "Active dashboard" ? 600 : 500,
                  fontSize: 13, cursor: "pointer",
                }}>{c}</button>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: "auto", borderTop: `1px solid ${border}`, paddingTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>DV</div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: ink }}>Deepak Vaidya</span>
          <span style={{ fontSize: 11.5, color: muted }}>Acme Studios</span>
        </div>
      </div>
    </aside>
  );
}

const iconBtnSty = (ink, hover) => ({
  width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center",
  background: "transparent", color: ink, cursor: "pointer",
});

// ===== HEADER =====
function Header({ variant }) {
  const isDark = variant === "dark";
  const ink = isDark ? "#e7e9ee" : "var(--ink)";
  const muted = isDark ? "#8a92a3" : "var(--muted)";
  const surface = isDark ? "#13161d" : "var(--surface-1)";
  const border = isDark ? "#22262f" : "var(--hairline)";
  const inputBg = isDark ? "#0f1115" : "var(--surface-2)";

  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 14, padding: "12px 22px",
      background: surface, borderBottom: `1px solid ${border}`, height: 60, flexShrink: 0,
    }}>
      <div style={{
        flex: 1, maxWidth: 560, display: "flex", alignItems: "center", gap: 10,
        background: inputBg, border: `1px solid ${border}`, borderRadius: 999,
        padding: "8px 14px", color: muted, fontSize: 13.5,
      }}>
        <I.sparkAI size={15} stroke="var(--accent)" />
        <input placeholder="Ask Da Vinci or search anywhere…" style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          color: ink, fontSize: 13.5, fontFamily: "inherit",
        }} />
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px",
          border: `1px solid ${border}`, borderRadius: 6, fontSize: 11, color: muted,
          fontFamily: "ui-monospace, SF Mono, monospace", background: isDark ? "#1a1d25" : "#fff",
        }}>⌘K</span>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 4, color: ink }}>
        <button style={{ ...iconBtnSty(ink), border: "none", position: "relative" }}>
          <I.bell size={17} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: "oklch(0.65 0.2 25)", border: `2px solid ${surface}` }} />
        </button>
        <button style={{ ...iconBtnSty(ink), border: "none" }}><I.book size={17} /></button>
        <button style={{ ...iconBtnSty(ink), border: "none" }}><I.gear size={17} /></button>
        <div style={{ width: 1, height: 22, background: border, margin: "0 6px" }} />
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "transparent", border: `1px solid ${border}`,
          borderRadius: 999, padding: "4px 10px 4px 4px", cursor: "pointer", color: ink,
        }}>
          <span style={{ width: 26, height: 26, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>DV</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Deepak</span>
          <I.chevD size={14} />
        </button>
      </div>
    </header>
  );
}

// ===== Page Title bar =====
function PageBar({ variant }) {
  const isDark = variant === "dark";
  const ink = isDark ? "#e7e9ee" : "var(--ink)";
  const muted = isDark ? "#8a92a3" : "var(--muted)";
  const border = isDark ? "#22262f" : "var(--hairline)";
  const surface = isDark ? "#13161d" : "var(--surface-1)";

  const pillBtn = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 999,
    border: `1px solid ${border}`, background: surface,
    fontSize: 13, fontWeight: 500, color: ink, cursor: "pointer",
  };
  const primary = {
    ...pillBtn,
    background: "var(--accent)", color: "var(--accent-fg)", border: "1px solid transparent",
    fontWeight: 600, padding: "8px 16px",
    boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px color-mix(in oklch, var(--accent) 30%, transparent)",
  };
  const ghost = { ...pillBtn, border: "1px solid transparent", background: "transparent" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px 16px", borderBottom: `1px solid ${border}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: ink, letterSpacing: -0.3 }}>Home</h1>
          <button style={{ ...iconBtnSty(muted), border: "none", width: 24, height: 24 }}><I.chevD size={14} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: muted }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "oklch(0.7 0.15 155)" }} />
          <span>Live · synced 2 min ago</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <button style={pillBtn}><I.cal size={14} /> Last 30 days <I.chevD size={13} /></button>
      <button style={pillBtn}><I.filter size={14} /> Filters <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 999, background: "color-mix(in oklch, var(--accent) 14%, transparent)", color: "var(--accent-ink)", fontWeight: 600 }}>2</span></button>
      <button style={ghost}><I.more size={16} /></button>
      <button style={primary}><I.plus size={14} /> Add widget</button>
    </div>
  );
}

// ===== KPI Card variants =====
function KpiCardEditorial({ icon: Icon, label, value, deltaPos, delta, sub, sparkData, accent }) {
  return (
    <div style={{
      background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 16,
      padding: "20px 22px 0", display: "flex", flexDirection: "column", overflow: "hidden",
      minHeight: 180,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 12, fontWeight: 500 }}>
        <Icon size={14} />
        <span style={{ textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
        <div style={{ flex: 1 }} />
        <button style={{ ...iconBtnSty("var(--muted)"), border: "none", width: 24, height: 24 }}><I.moreV size={14} /></button>
      </div>
      <div style={{ marginTop: 10, fontSize: 36, fontWeight: 600, color: "var(--ink)", letterSpacing: -1, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 8px", borderRadius: 999, fontWeight: 600,
          background: deltaPos ? "color-mix(in oklch, oklch(0.7 0.15 155) 14%, transparent)" : "color-mix(in oklch, oklch(0.65 0.2 25) 14%, transparent)",
          color: deltaPos ? "oklch(0.5 0.15 155)" : "oklch(0.55 0.2 25)",
        }}>
          {deltaPos ? "↗" : "↘"} {delta}
        </span>
        <span style={{ color: "var(--muted)" }}>{sub}</span>
      </div>
      <div style={{ marginTop: "auto", marginLeft: -22, marginRight: -22, marginBottom: 0 }}>
        <Sparkline data={sparkData} color={accent || "var(--accent)"} height={48} />
      </div>
    </div>
  );
}

function KpiCardCompact({ icon: Icon, label, value, deltaPos, delta, sub, sparkData, accent }) {
  return (
    <div style={{
      background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 12,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "color-mix(in oklch, var(--accent) 12%, transparent)", color: "var(--accent-ink)", display: "grid", placeItems: "center" }}>
          <Icon size={14} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{label}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11.5, color: "var(--muted)" }}>30d</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: -0.5, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </div>
        <div style={{ flex: 1, marginBottom: 2 }}>
          <Sparkline data={sparkData} color={accent || "var(--accent)"} height={32} fill={false} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontWeight: 600,
          color: deltaPos ? "oklch(0.5 0.15 155)" : "oklch(0.55 0.2 25)",
        }}>
          {deltaPos ? "↗" : "↘"} {delta}
        </span>
        <span style={{ color: "var(--muted)" }}>{sub}</span>
      </div>
    </div>
  );
}

// ===== Main panel content =====
function MainPanel({ variant = "editorial" }) {
  const editorial = variant === "editorial";
  const Kpi = editorial ? KpiCardEditorial : KpiCardCompact;

  const kpis = [
    { icon: I.dollar, label: "Revenue",        value: "$16,621", deltaPos: true,  delta: "+325%", sub: "vs prev 30d", sparkData: REV_SPARK },
    { icon: I.cart,   label: "Orders",         value: "25",      deltaPos: true,  delta: "+400%", sub: "vs prev 30d", sparkData: ORD_SPARK },
    { icon: I.mail,   label: "Open rate",      value: "54.6%",   deltaPos: true,  delta: "+3.4 pp", sub: "vs prev 30d", sparkData: RATE_SPARK },
    { icon: I.users,  label: "Total contacts", value: "12,408",  deltaPos: true,  delta: "+6.4%", sub: "all time",    sparkData: CONT_SPARK },
  ];

  return (
    <div style={{ padding: "22px 28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: editorial ? 16 : 14 }}>
        {kpis.map((k, i) => <Kpi key={i} {...k} />)}
      </div>

      {/* Two-up: chart + activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: editorial ? 16 : 14 }}>
        <Card title="Revenue by channel" subtitle="Last 30 days" right={
          <div style={{ display: "flex", gap: 6 }}>
            {["7d", "30d", "90d"].map((p, i) => (
              <button key={i} style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                border: "1px solid var(--hairline)",
                background: p === "30d" ? "var(--ink)" : "transparent",
                color: p === "30d" ? "var(--surface-1)" : "var(--muted)",
                cursor: "pointer",
              }}>{p}</button>
            ))}
          </div>
        }>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, padding: "8px 4px" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Total</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: "var(--ink)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>$16,621</div>
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 6 }}>
              {[{ k: "Email", v: "$9,840", c: "var(--accent)" }, { k: "Direct", v: "$4,210", c: "oklch(0.7 0.13 200)" }, { k: "Social", v: "$2,571", c: "oklch(0.75 0.12 90)" }].map((s, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: s.c }} /> {s.k}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <Bars data={CHANNEL_BARS} color="var(--accent)" height={140} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10.5, color: "var(--muted)", fontFamily: "ui-monospace, SF Mono, monospace" }}>
              <span>Apr 06</span><span>Apr 13</span><span>Apr 20</span><span>Apr 27</span><span>May 04</span>
            </div>
          </div>
        </Card>

        <Card title="Live activity" subtitle="Realtime" right={
          <button style={{ ...iconBtnSty("var(--muted)"), border: "1px solid var(--hairline)", width: 28, height: 28 }}><I.refresh size={13} /></button>
        }>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, padding: "10px 0",
                borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--hairline)" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: tagBg(a.tag), color: tagInk(a.tag),
                  display: "grid", placeItems: "center", marginTop: 2,
                }}>
                  {tagIcon(a.tag)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.t} · <span style={{ fontFamily: "ui-monospace, SF Mono, monospace", fontSize: 11 }}>{a.time}</span></div>
                  <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.n}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{a.v}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Campaign table */}
      <Card title="Top campaigns" subtitle="Performance · Last 30 days" right={
        <a style={{ fontSize: 12.5, color: "var(--accent-ink)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          View all <I.arrowUR size={12} />
        </a>
      }>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", padding: "8px 4px", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500, borderBottom: "1px solid var(--hairline)" }}>
          <span>Campaign</span><span>Sent</span><span>Open rate</span><span>Click rate</span><span style={{ textAlign: "right" }}>Revenue</span>
        </div>
        {CAMPAIGNS.map((c, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr",
            padding: "12px 4px", fontSize: 13.5, color: "var(--ink)", alignItems: "center",
            borderBottom: i < CAMPAIGNS.length - 1 ? "1px solid var(--hairline)" : "none",
          }}>
            <span style={{ fontWeight: 500 }}>{c.name}</span>
            <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{c.sent}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{c.open}</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{c.click}</span>
            <span style={{ textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c.rev}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <section style={{
      background: "var(--surface-1)", border: "1px solid var(--hairline)", borderRadius: 14,
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{title}</h3>
          {subtitle && <span style={{ fontSize: 12, color: "var(--muted)" }}>{subtitle}</span>}
        </div>
        <div style={{ flex: 1 }} />
        {right}
      </div>
      <div>{children}</div>
    </section>
  );
}

function tagBg(t) {
  if (t === "email") return "color-mix(in oklch, var(--accent) 12%, transparent)";
  if (t === "order") return "color-mix(in oklch, oklch(0.7 0.15 155) 14%, transparent)";
  if (t === "audience") return "color-mix(in oklch, oklch(0.75 0.12 90) 18%, transparent)";
  return "color-mix(in oklch, oklch(0.7 0.13 300) 14%, transparent)";
}
function tagInk(t) {
  if (t === "email") return "var(--accent-ink)";
  if (t === "order") return "oklch(0.45 0.15 155)";
  if (t === "audience") return "oklch(0.45 0.12 90)";
  return "oklch(0.45 0.13 300)";
}
function tagIcon(t) {
  if (t === "email") return <I.mail size={13} />;
  if (t === "order") return <I.cart size={13} />;
  if (t === "audience") return <I.users size={13} />;
  return <I.spark size={13} />;
}

// ===== Variant wrapper =====
function DashboardA({ accent, sidebarStyle }) {
  // Warm Editorial — cream, generous spacing, hairline cards
  return (
    <div className="variant-warm" style={{
      "--surface-0": "#f7f3ec",
      "--surface-1": "#fdfbf7",
      "--surface-2": "#f1ece2",
      "--ink":       "#1a1814",
      "--muted":     "#7a7466",
      "--hairline":  "#e6dfd1",
      "--accent":    accent,
      "--accent-fg": "#fff",
      "--accent-ink": `color-mix(in oklch, ${accent} 80%, #000 20%)`,
      background: "var(--surface-0)", color: "var(--ink)",
      display: "flex", height: "100%", fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <Sidebar variant="light" accent={accent} style={sidebarStyle} logoText="NORTH" />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header variant="light" />
        <PageBar variant="light" />
        <div style={{ flex: 1, overflow: "auto" }}>
          <MainPanel variant="editorial" />
        </div>
      </main>
    </div>
  );
}

function DashboardB({ accent, sidebarStyle }) {
  // Cool Compact layout — Warm editorial palette
  const isDark = sidebarStyle === "dark-rail";
  return (
    <div className="variant-cool" style={{
      "--surface-0": "#f7f3ec",
      "--surface-1": "#fdfbf7",
      "--surface-2": "#f1ece2",
      "--ink":       "#1a1814",
      "--muted":     "#7a7466",
      "--hairline":  "#e6dfd1",
      "--accent":    accent,
      "--accent-fg": "#fff",
      "--accent-ink": `color-mix(in oklch, ${accent} 75%, #000 25%)`,
      background: "var(--surface-0)", color: "var(--ink)",
      display: "flex", height: "100%", fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <Sidebar variant={isDark ? "dark" : "light"} accent={accent} style={sidebarStyle} logoText="NORTHSTAR" />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header variant="light" />
        <PageBar variant="light" />
        <div style={{ flex: 1, overflow: "auto" }}>
          <MainPanel variant="compact" />
        </div>
      </main>
    </div>
  );
}

Object.assign(window, {
  DashboardA, DashboardB, Sidebar, Header, PageBar, MainPanel, Card, Sparkline, Bars, I, KpiCardEditorial, KpiCardCompact,
});
