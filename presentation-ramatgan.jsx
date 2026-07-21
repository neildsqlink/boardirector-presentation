import { useState, useEffect, useCallback, useRef } from "react";

// Resolve a public-folder path to the deployed base URL so assets work both at
// "/" (npm run dev) and under a sub-path (GitHub Pages / /ramatgan/).
const A = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ─── Brand Tokens (shared across the Boardirector decks) ─── */
const B = {
  bigStone: "#172134",
  bigStone2: "#0F1727",
  royalBlue: "#5877E6",
  gullGray: "#9AA2B3",
  cadetBlue: "#ADB4C6",
  athensGray: "#E7E8EC",
  whisper: "#E7EEFF",
  white: "#FFFFFF",
  orange: "#FE7501",
  orangeLight: "#FF9A3E",
  teal: "#2ABFBF",
  red: "#E54848",
  green: "#16A34A",
  purple: "#7C4DFF",
  font: "Rubik",
  fontEn: "Inter",
};

/* ─── Inline SVG icons (stroke-based, inherit color) ─── */
const Icon = ({ name, size = 24, color = "currentColor", stroke = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const paths = {
    calendar: (<><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></>),
    calendarCheck: (<><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /><path d="M8.5 14.5l2.5 2.5 4.5-4.5" /></>),
    users: (<><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M21.5 20c0-2.8-1.6-4.9-4-5.6" /></>),
    book: (<><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3.5H6.5A2.5 2.5 0 0 1 4 20.5z" /></>),
    checks: (<><path d="M3 12.5l3.5 3.5L14 8.5" /><path d="M11 15l1.5 1.5L21 8" /></>),
    checklist: (<><rect x="3" y="4" width="18" height="17" rx="2.5" /><path d="M7 9l1.5 1.5L11 8" /><path d="M7 15l1.5 1.5L11 14" /><path d="M14 9.5h4M14 15.5h4" /></>),
    bell: (<><path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" /><path d="M10 20a2 2 0 0 0 4 0" /></>),
    chart: (<><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 20v-6M13 20V9M18 20v-9" /></>),
    shield: (<><path d="M12 3l7 3v5c0 5-3.3 8.3-7 10-3.7-1.7-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>),
    clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
    layers: (<><path d="M12 3l8.5 4.5L12 12 3.5 7.5z" /><path d="M3.5 12L12 16.5 20.5 12M3.5 16.5L12 21l8.5-4.5" /></>),
    search: (<><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>),
    arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
    file: (<><path d="M6.5 2.5h7l4 4v13.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1.5-1.5z" /><path d="M13.5 2.5V7h4" /><path d="M8.5 12.5h7M8.5 16h5" /></>),
    folder: <path d="M3 7a2 2 0 0 1 2-2h3.6l2 2.5H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    target: (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.7" /></>),
    flag: (<><path d="M6 21V4" /><path d="M6 4.5h11l-2.2 3.5L17 11.5H6z" /></>),
    lock: (<><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><path d="M12 14.8v2.4" /></>),
    plus: <path d="M12 5v14M5 12h14" />,
    chevronDown: <path d="M6 9.5l6 6 6-6" />,
    pin: (<><path d="M12 21c4.5-4.2 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 2.5 6.8 7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
    close: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M4 12.5l5 5L20 6.5" />,
    scale: (<><path d="M12 4v15M8.5 19.5h7M5 7.5h14M12 4.5l-5 2.5M12 4.5l5 2.5" /><path d="M6 8l-2.5 5.5a2.6 2.6 0 0 0 5 0zM18 8l-2.5 5.5a2.6 2.6 0 0 0 5 0z" /></>),
    alert: (<><path d="M12 4l9 15.5H3z" /><path d="M12 10v4.5M12 17.5v.5" /></>),
    share: (<><circle cx="6" cy="12" r="2.5" /><circle cx="17" cy="6" r="2.5" /><circle cx="17" cy="18" r="2.5" /><path d="M8.2 10.8l6.6-3.6M8.2 13.2l6.6 3.6" /></>),
    user: (<><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" /></>),
    key: (<><circle cx="8" cy="12" r="4" /><path d="M11.9 12H21M18 12v3M15 12v2.2" /></>),
    headset: (<><path d="M4 13.5v-1.5a8 8 0 0 1 16 0v1.5" /><rect x="3" y="13" width="4" height="6.5" rx="1.6" /><rect x="17" y="13" width="4" height="6.5" rx="1.6" /><path d="M20 19.5a4 4 0 0 1-4 3.2h-3" /></>),
    gears: (<><circle cx="10.5" cy="10.5" r="3" /><path d="M10.5 5.2V6.8M10.5 14.2v1.6M5.2 10.5H6.8M14.2 10.5h1.6M6.7 6.7l1.1 1.1M13.2 13.2l1.1 1.1M14.3 6.7l-1.1 1.1M7.8 13.2l-1.1 1.1" /></>),
    hourglass: (<><path d="M6 3h12M6 21h12M7.5 3c0 4.5 4.5 5.5 4.5 9s-4.5 4.5-4.5 9M16.5 3c0 4.5-4.5 5.5-4.5 9s4.5 4.5 4.5 9" /></>),
    mail: (<><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3.5 7l8.5 6 8.5-6" /></>),
    chat: (<><path d="M4 5.5h16v10H9.5L5 20v-4.5H4z" /><path d="M8.5 10.5h7M8.5 13h4" /></>),
    cloud: (<><path d="M7 18a4 4 0 0 1 0-8 5.2 5.2 0 0 1 9.8-1.3A3.6 3.6 0 0 1 17 18z" /></>),
    grid: (<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M4 15h16M10 4v16" /></>),
    box: (<><path d="M3 7.2l9-4 9 4v9.6l-9 4-9-4z" /><path d="M3 7.2l9 4 9-4M12 11.2v9.6" /></>),
    dots: (<><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" /></>),
    building: (<><rect x="5" y="3" width="14" height="18" rx="1.2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></>),
    bank: (<><path d="M3 9.5l9-5.5 9 5.5" /><path d="M4.5 9.5v9M19.5 9.5v9M8.5 9.5v9M12 9.5v9M15.5 9.5v9M3 21h18" /></>),
    briefcase: (<><rect x="3" y="7.5" width="18" height="12.5" rx="2" /><path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>),
    bolt: <path d="M13 3L5 13h6l-1 8 8-11h-6z" />,
    graduation: (<><path d="M12 4l10 4-10 4L2 8z" /><path d="M6 10v5c0 1.6 3 3 6 3s6-1.4 6-3v-5" /></>),
    heart: <path d="M12 20s-7-4.4-9.4-9A5 5 0 0 1 12 6a5 5 0 0 1 9.4 5C19 15.6 12 20 12 20z" />,
    activity: <path d="M3 12h4l2.5 7 5-14 2.5 7h4" />,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

/* ─── Boardirector logo (official lockup: orange B mark + wordmark + "by SQlink").
   `light` inverts it to solid white for placement on dark backgrounds. `height`
   accepts any CSS length so the hero can scale it responsively. ─── */
const BDLogo = ({ height = 34, light = false, style }) => (
  <img
    src={A("logo_sq.svg")}
    alt="Boardirector"
    style={{ height, width: "auto", display: "block", filter: light ? "brightness(0) invert(1)" : "none", ...style }}
  />
);

/* ─── Soft glow orbs for dark slides ─── */
const Orbs = () => (
  <>
    <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${B.orange}2b, transparent 70%)`, filter: "blur(24px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: "-22%", left: "-10%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${B.royalBlue}2e, transparent 70%)`, filter: "blur(24px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: "35%", left: "18%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${B.teal}1c, transparent 70%)`, filter: "blur(24px)", pointerEvents: "none" }} />
  </>
);

/* ─── Slide chrome: logo top-left, section index top-right, page bottom-left ─── */
function Chrome({ index, section, page, dark, active }) {
  const line = dark ? "rgba(255,255,255,0.9)" : B.bigStone;
  const dim = dark ? B.cadetBlue : B.gullGray;
  return (
    <>
      <div style={{ position: "absolute", top: "5.2vh", left: "5vw", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(-8px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
        <BDLogo height={42} light={dark} />
      </div>
      <div style={{ position: "absolute", top: "5.6vh", right: "5vw", display: "flex", alignItems: "center", gap: 12, direction: "rtl", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(-8px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: line }}>{index} - {section}</span>
        <span style={{ width: 34, height: 2.5, borderRadius: 2, background: B.orange }} />
      </div>
      <div style={{ position: "absolute", bottom: "4.5vh", left: "5vw", fontSize: 13, color: dim, fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: "0.04em" }}>
        10 / {page}
      </div>
    </>
  );
}

/* ─── Two-tone title (dark line + gray line), right-aligned RTL ─── */
function Title({ line1, line2, dark, active }) {
  const c1 = dark ? "#fff" : B.bigStone;
  const c2 = dark ? B.cadetBlue : B.gullGray;
  return (
    <div style={{ textAlign: "right", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(28px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s" }}>
      <h2 style={{ margin: 0, fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.16, letterSpacing: "-0.02em" }}>
        <span style={{ color: c1 }}>{line1}</span>
        {line2 && (<><br /><span style={{ color: c2 }}>{line2}</span></>)}
      </h2>
    </div>
  );
}

/* ─── Animated count-up (fires when slide becomes active) ─── */
function useCountUp(target, active, duration = 1500) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);
  return val;
}
const fmt = (n) => Math.round(n).toLocaleString("en-US");

/* ═══════════════════════════════════════════════════════════════
   SLIDE 1 — HERO (split: dark card panel left · title right)
   ═══════════════════════════════════════════════════════════════ */
const FloatCard = ({ children, delay, active, style }) => (
  <div
    style={{
      background: B.white,
      borderRadius: 16,
      boxShadow: "0 30px 70px -28px rgba(0,0,0,0.55), 0 8px 22px -12px rgba(0,0,0,0.35)",
      padding: "16px 18px",
      direction: "rtl",
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0) rotate(var(--r,0deg))" : "translateY(30px) rotate(var(--r,0deg))",
      transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      animation: active ? `floatCard 7s ease-in-out ${delay + 0.4}s infinite` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

function HeroSlide({ active }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: B.white, display: "flex", overflow: "hidden" }}>
      {/* left dark panel with floating cards */}
      <div style={{ position: "relative", width: "44%", background: `linear-gradient(155deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`, overflow: "hidden" }}>
        <Orbs />
        <div style={{ position: "absolute", inset: 0, padding: "0 clamp(20px,4vw,64px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
          {/* meeting card */}
          <FloatCard delay={0.15} active={active} style={{ "--r": "-2deg", marginRight: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `${B.orange}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="calendar" size={16} color={B.orange} />
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: B.bigStone }}>ישיבת ועדת מכרזים</div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: B.orange, background: `${B.orange}15`, padding: "3px 9px", borderRadius: 20 }}>בעוד 3 ימים</span>
            </div>
            {[["#7C4DFF", "אישור פרוטוקול קודם"], [B.orange, "פתיחת הצעות – מכרז 07/26"], [B.royalBlue, "אישור התקשרות – שירותי מחשוב"]].map(([c, t], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 0", fontSize: 12.5, color: B.bigStone }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }} /> {t}
              </div>
            ))}
          </FloatCard>
          {/* decision card */}
          <FloatCard delay={0.32} active={active} style={{ "--r": "1.5deg", marginLeft: 30, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 16px ${B.orange}55` }}>
              <Icon name="arrowLeft" size={16} color="#fff" stroke={2.4} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.bigStone }}>החלטה מס׳ 12/26</div>
              <div style={{ fontSize: 11.5, color: B.gullGray, marginTop: 2 }}>אושר פה אחד · חתום דיגיטלית</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: B.green, background: `${B.green}15`, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.05em" }}>APPROVED</span>
          </FloatCard>
          {/* tasks card */}
          <FloatCard delay={0.5} active={active} style={{ "--r": "-1deg", marginRight: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `${B.royalBlue}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="checklist" size={16} color={B.royalBlue} />
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: B.bigStone }}>משימות לקראת הישיבה</div>
              <span style={{ fontSize: 11, fontWeight: 700, color: B.gullGray }}>4/6</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 0", fontSize: 12.5, color: B.bigStone }}>
              <span style={{ width: 17, height: 17, borderRadius: "50%", background: B.green, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</span> הפצת חומרי רקע
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 0", fontSize: 12.5, color: B.bigStone }}>
              <span style={{ width: 17, height: 17, borderRadius: "50%", border: `1.6px solid ${B.athensGray}`, flexShrink: 0 }} /> אישור מסמכי המכרז
              <span style={{ marginInlineStart: "auto", fontSize: 9.5, fontWeight: 700, color: B.orange, background: `${B.orange}15`, padding: "2px 8px", borderRadius: 20 }}>TODAY</span>
            </div>
          </FloatCard>
        </div>
      </div>

      {/* right content */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(30px,5vw,80px)" }}>
        <div style={{ direction: "rtl", textAlign: "right", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(26px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
          <BDLogo style={{ width: "min(460px, 42vw)", height: "auto", display: "inline-block" }} />
          <p style={{ marginTop: 30, fontSize: "clamp(16px,1.7vw,22px)", color: B.gullGray, fontWeight: 400, lineHeight: 1.7, maxWidth: 560, marginInlineStart: "auto" }}>
            מערכת לניהול ועדות העירייה, ישיבות, החלטות ופרוטוקולים.
            <br />מקצה לקצה, מאובטח, מכל מכשיר.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: "5vh", left: "clamp(30px,5vw,80px)", right: "clamp(30px,5vw,80px)", display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center", direction: "rtl", fontSize: 13, color: B.cadetBlue }}>
          <span>Bar Lev · Sales &amp; BD</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>לשימוש חיצוני</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ fontWeight: 700, letterSpacing: "0.08em", color: B.gullGray }}>SQLINK</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Generic content-slide shell (chrome + title + body)
   ═══════════════════════════════════════════════════════════════ */
function Shell({ slide, active, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: slide.dark ? `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)` : B.white, overflow: "hidden" }}>
      {slide.dark && <Orbs />}
      <Chrome index={slide.index} section={slide.section} page={slide.page} dark={slide.dark} active={active} />
      <div style={{ position: "absolute", top: "13vh", right: "5vw", left: "5vw" }}>
        <Title line1={slide.line1} line2={slide.line2} dark={slide.dark} active={active} />
      </div>
      {children}
    </div>
  );
}

const Card = ({ active, delay, dark, highlight, style, children }) => (
  <div
    style={{
      position: "relative",
      borderRadius: 18,
      background: highlight ? `linear-gradient(155deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)` : dark ? "rgba(255,255,255,0.04)" : B.white,
      border: highlight ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.08)" : B.athensGray}`,
      boxShadow: highlight ? `0 30px 60px -30px ${B.royalBlue}77` : dark ? "none" : "0 18px 40px -30px rgba(23,33,52,0.5)",
      overflow: "hidden",
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(26px)",
      transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}
  >
    {highlight && <div style={{ position: "absolute", bottom: -40, left: -30, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${B.royalBlue}44, transparent 70%)`, filter: "blur(10px)" }} />}
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const IconBadge = ({ name, color, bg }) => (
  <div style={{ width: 44, height: 44, borderRadius: 13, background: bg || `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon name={name} size={22} color={color} />
  </div>
);

/* ── SLIDE 2 — מה זה Boardirector (before/after consolidation) ── */
const TODAY_TOOLS = [
  { icon: "cloud", label: "דרייב", color: "#4285F4" },
  { icon: "chat", label: "וואטסאפ", color: "#25D366" },
  { icon: "mail", label: "מיילים", color: B.orange },
  { icon: "grid", label: "אקסלים", color: "#1D6F42" },
  { icon: "box", label: "קלסרים", color: B.purple },
  { icon: "dots", label: "ועוד", color: B.gullGray },
];
function WhatSlide({ slide, active }) {
  const pills = ["ועדות", "ישיבות", "החלטות", "פרוטוקולים", "הרשאות"];
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "42vh", right: "5vw", left: "5vw", display: "flex", alignItems: "center", gap: "3vw", direction: "rtl" }}>
        {/* TODAY — scattered tools grid (RIGHT, RTL start) */}
        <div style={{ flex: 1, opacity: active ? 1 : 0, transition: "opacity 0.6s ease 0.15s" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.gullGray, marginBottom: 12, textAlign: "right" }}>היום</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {TODAY_TOOLS.map((t, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 8px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 10px 26px -24px rgba(23,33,52,0.5)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(18px)", transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.06}s` }}>
                <Icon name={t.icon} size={24} color={t.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: B.bigStone }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* arrow (points LEFT — everything consolidates into Boardirector) */}
        <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.6)", transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.4s" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 28px ${B.orange}55` }}>
            <Icon name="arrowLeft" size={24} color="#fff" stroke={2.4} />
          </div>
        </div>
        {/* AFTER — one dark Boardirector card (LEFT, RTL end) */}
        <div style={{ flex: "0 0 40%", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: B.orange, marginBottom: 12, textAlign: "right" }}>עם Boardirector</div>
          <div style={{ position: "relative", borderRadius: 18, background: `linear-gradient(155deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`, padding: "26px 28px", overflow: "hidden", boxShadow: `0 30px 60px -28px ${B.royalBlue}55` }}>
            <div style={{ position: "absolute", top: -30, left: -20, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${B.royalBlue}44, transparent 70%)`, filter: "blur(8px)" }} />
            <div style={{ position: "relative", textAlign: "right" }}>
              <BDLogo height={40} light style={{ display: "inline-block" }} />
              <p style={{ color: B.cadetBlue, fontSize: 13.5, lineHeight: 1.6, marginTop: 14, marginBottom: 18 }}>פלטפורמה אחת. כל מחזור החיים של הוועדה — לפני, תוך כדי, ואחרי.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, direction: "rtl" }}>
                {pills.map((p, i) => (
                  <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "6px 14px", borderRadius: 20 }}>{p}</span>
                ))}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`, padding: "6px 14px", borderRadius: 20 }}>+ Audit Trail</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ── SLIDE 3 — המציאות היום (scattered-material stat cards) ── */
const REALITY = [
  { icon: "cloud", color: "#4285F4", label: "בדרייב", n: 20, desc: "קבצים ללא היררכיה" },
  { icon: "mail", color: B.orange, label: "במיילים", n: 3, desc: "גרסאות סותרות של אותו מסמך" },
  { icon: "chat", color: "#25D366", label: "בוואטסאפ", n: 14, desc: "תגובות. אף אחד לא יודע מה סוכם" },
  { icon: "clock", color: B.orange, label: "בפועל", n: 4, prefix: "+", unit: " שעות", desc: "עבודה רק על ההכנה לישיבה", highlight: true },
];
function RealityCard({ c, active, delay }) {
  const v = useCountUp(c.n, active, 1400);
  return (
    <Card active={active} delay={delay} highlight={c.highlight} style={{ flex: 1, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: c.highlight ? "rgba(255,255,255,0.85)" : B.gullGray }}>{c.label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: c.highlight ? "rgba(255,255,255,0.1)" : `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={c.icon} size={17} color={c.highlight ? B.orangeLight : c.color} />
        </div>
      </div>
      <div style={{ textAlign: "right", direction: "rtl", fontSize: "clamp(30px,3.4vw,48px)", fontWeight: 800, color: c.highlight ? "#fff" : B.bigStone, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{c.prefix || ""}{fmt(v)}</span>{c.unit ? <span style={{ fontSize: "0.6em" }}>{c.unit}</span> : ""}
      </div>
      <div style={{ textAlign: "right", direction: "rtl", fontSize: 13.5, color: c.highlight ? B.cadetBlue : B.gullGray, marginTop: 6, lineHeight: 1.5 }}>{c.desc}</div>
    </Card>
  );
}
function RealitySlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "40vh", right: "5vw", left: "5vw", display: "flex", gap: 18, direction: "rtl" }}>
        {REALITY.map((c, i) => (<RealityCard key={i} c={c} active={active} delay={0.15 + i * 0.1} />))}
      </div>
      <div style={{ position: "absolute", bottom: "12vh", right: "5vw", left: "5vw", direction: "rtl", textAlign: "right", borderTop: `1px solid ${B.athensGray}`, paddingTop: 20, fontSize: "clamp(16px,1.7vw,21px)", color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(14px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s" }}>
        זה לא בלגן. זו <strong style={{ color: B.orange }}>חשיפת מידע וסיכון תפעולי</strong>, והבעלות עליהם על שולחן המנמ״ר.
      </div>
    </Shell>
  );
}

/* ── SLIDE 4 — התוצאות בשטח (dark, 3 big animated stats) ── */
const RESULTS = [
  { n: 100, suffix: "%", head: "מוכנות לביקורת ולמבקר המדינה", desc: "Audit trail מלא על כל פעולה — מוכנות מלאה למבקר ולביקורת פנים" },
  { n: 10, suffix: "x", head: "מהירות איתור החלטות", desc: "סינון לפי ועדה, תאריך, קטגוריה וסטטוס — שניות במקום שעות" },
  { n: 85, suffix: "%", head: "פחות זמן בהכנת ישיבה", desc: "אג׳נדה, הפצה, חתימות ואיגוד פרוטוקול — אוטומטי" },
];
function ResultStat({ c, active, delay }) {
  const v = useCountUp(c.n, active, 1700);
  return (
    <div style={{ flex: 1, textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
      <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontWeight: 800, fontSize: "clamp(72px,10vw,150px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "#fff" }}>
        {fmt(v)}<span style={{ color: B.orange }}>{c.suffix}</span>
      </div>
      <div style={{ fontSize: "clamp(17px,1.5vw,21px)", fontWeight: 700, color: "#fff", marginTop: 22 }}>{c.head}</div>
      <div style={{ fontSize: 14.5, color: B.cadetBlue, marginTop: 10, lineHeight: 1.6, maxWidth: 320, marginInline: "auto" }}>{c.desc}</div>
    </div>
  );
}
function ResultsSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "46%", right: "5vw", left: "5vw", transform: "translateY(-40%)", display: "flex", gap: "3vw", direction: "rtl" }}>
        {RESULTS.map((c, i) => (<ResultStat key={i} c={c} active={active} delay={0.25 + i * 0.15} />))}
      </div>
    </Shell>
  );
}

/* ── SLIDE 5 — מה אנחנו פותרים (5 friction cards) ── */
const FRICTION = [
  { icon: "scale", color: B.orange, title: "ניגודי עניינים", desc: "של נבחרי ציבור וחברי ועדה — ניהול ידני של מי רואה מה, בכל ועדה ובכל מסמך, הוא מקור לטעויות.", highlight: true, tag: "קריטי בעירייה" },
  { icon: "alert", color: B.red, title: "חשיפה רגולטורית", desc: "דרישות שקיפות וחוק חופש המידע — בלי audit trail, בלי שליטה בהרשאות ובלי תיעוד גרסאות." },
  { icon: "shield", color: B.purple, title: "מעקב החלטות", desc: "החלטות מוצבע ולא נאכפות — מה בוצע, מי אחראי, מה הסטטוס. כשהמידע מפוזר, אין על מה לעקוב." },
  { icon: "share", color: B.royalBlue, title: "פיזור מידע", desc: "חומר רגיש זולג בין מייל, וואטסאפ ודרייב פרטי — Shadow IT שמחוץ לשליטת המנמ״ר." },
  { icon: "user", color: B.teal, title: "עומס תפעולי", desc: "הכנת אג׳נדה, הפצת זימונים, איסוף חתימות ואיגוד פרוטוקולים — שוחק את מזכירות הוועדות." },
];
function FrictionSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "42vh", right: "5vw", left: "5vw", display: "flex", gap: 16, direction: "rtl" }}>
        {FRICTION.map((c, i) => (
          <Card key={i} active={active} delay={0.15 + i * 0.08} highlight={c.highlight} style={{ flex: 1, padding: "22px 22px 24px" }}>
            {c.tag && <div style={{ position: "absolute", top: 0, right: 0, fontSize: 10, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`, padding: "5px 12px", borderRadius: "0 0 0 12px", letterSpacing: "0.03em" }}>{c.tag}</div>}
            <div style={{ display: "flex", justifyContent: "flex-start", direction: "rtl", marginBottom: 16, marginTop: c.tag ? 14 : 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: c.highlight ? "rgba(255,255,255,0.1)" : `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={c.icon} size={21} color={c.highlight ? B.orangeLight : c.color} />
              </div>
            </div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 18, fontWeight: 700, color: c.highlight ? "#fff" : B.bigStone, marginBottom: 8 }}>{c.title}</div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 13, color: c.highlight ? B.cadetBlue : B.gullGray, lineHeight: 1.6 }}>{c.desc}</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

/* ── SLIDE 6 — היכולות המרכזיות (4 quadrant capability cards) ── */
const CAPS = [
  { tag: "COMMITTEES · 01", icon: "users", color: B.royalBlue, title: "ניהול ועדות מקצה לקצה", items: ["הקמת ועדת מכרזים או ועדה לתכנון ובנייה בפחות מדקה — חברים, מנהלים, הרשאות", "תבניות מוכנות לוועדות חוזרות — שכפול הגדרות בקליק", "ריבוי ועדות במקביל, עם אחידות ארגונית מלאה"] },
  { tag: "MEETINGS · 02", icon: "calendar", color: B.royalBlue, title: "ישיבות וסדרי יום", items: ["סדר יום מובנה — על בסיס תכנית עבודה ודרישות רגולציה", "הפצת חומרים מאובטחת, הרשאות לפי תפקיד", "תיעוד פרוטוקול, איסוף חתימות וניהול אישורים"] },
  { tag: "DECISION TRACKER · 03", icon: "checklist", color: B.orange, title: "מעקב החלטות", items: ["כל החלטה מקבלת אחראי, תאריך יעד וסטטוס — שום דבר לא נופל", "סינון לפי ועדה, תאריך וקטגוריה — מכרזים, תכנון ובנייה, תקציב", "שליפת החלטות ישנות במהירות — מענה לדרישות מבקרים"] },
  { tag: "SECURITY & COMPLIANCE · 04", icon: "shield", color: B.teal, title: "אבטחה ועמידה ברגולציה", items: ["הרשאות גרנולריות — עד לרמת המסמך הבודד", "מסלול ביקורת מלא — audit trail על כל פעולה", "מוכנות מלאה למבקר המדינה ולביקורת פנים"], highlight: true },
];
function CapsSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "31vh", bottom: "8vh", right: "5vw", left: "5vw", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 18 }}>
        {CAPS.map((c, i) => (
          <Card key={i} active={active} delay={0.15 + i * 0.1} highlight={c.highlight} style={{ padding: "20px 26px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl", marginBottom: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: 11, fontWeight: 700, color: c.highlight ? B.orangeLight : c.color, letterSpacing: "0.12em" }}>{c.tag}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: c.highlight ? "#fff" : B.bigStone, marginTop: 3 }}>{c.title}</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.highlight ? "rgba(255,255,255,0.1)" : `${c.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={c.icon} size={20} color={c.highlight ? B.orangeLight : c.color} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
              {c.items.map((it, j) => (
                <div key={j} style={{ display: "flex", gap: 9, direction: "rtl", textAlign: "right", fontSize: 13, color: c.highlight ? B.cadetBlue : B.gullGray, lineHeight: 1.5 }}>
                  <Icon name="check" size={15} color={c.highlight ? B.orangeLight : c.color} stroke={2.4} />
                  <span style={{ flex: 1 }}>{it}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

/* ── SLIDE 7 — אבטחה וריבונות מידע (3 cards + banner) ── */
const SECURITY = [
  { icon: "pin", color: B.orange, title: "המידע נשאר בישראל", desc: "אחסון בסביבה מאובטחת בישראל — ריבונות מלאה על המידע העירוני." },
  { icon: "key", color: B.royalBlue, title: "חיבור ל-AD / SSO", desc: "הזדהות ארגונית, ניהול משתמשים והרשאות — שליטה מלאה של צוות ה-IT." },
  { icon: "shield", color: B.teal, title: "תקני אבטחה מובילים", desc: "עמידה בתקני אבטחת המידע המחמירים בעולם.", badges: ["ISO 27001", "SOC 2", "תואם רגולציה ישראלית"] },
];
function SecuritySlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "36vh", right: "5vw", left: "5vw", display: "flex", gap: 18, direction: "rtl" }}>
        {SECURITY.map((c, i) => (
          <Card key={i} active={active} delay={0.15 + i * 0.1} style={{ flex: 1, padding: "26px 28px", minHeight: 190 }}>
            <div style={{ display: "flex", justifyContent: "flex-start", direction: "rtl", marginBottom: 16 }}>
              <IconBadge name={c.icon} color={c.color} />
            </div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 20, fontWeight: 700, color: B.bigStone, marginBottom: 8 }}>{c.title}</div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 14, color: B.gullGray, lineHeight: 1.6 }}>{c.desc}</div>
            {c.badges && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, direction: "rtl", marginTop: 16 }}>
                {c.badges.map((b, j) => (<span key={j} style={{ fontSize: 11.5, fontWeight: 700, color: B.bigStone, background: B.whisper, border: `1px solid ${B.royalBlue}22`, padding: "5px 12px", borderRadius: 20 }}>{b}</span>))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: "12vh", right: "5vw", left: "5vw", direction: "rtl", display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderRadius: 14, border: `1.5px dashed ${B.orange}66`, background: `${B.orange}08`, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(14px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s" }}>
        <Icon name="hourglass" size={20} color={B.orange} />
        <span style={{ fontSize: 15, color: B.bigStone }}>
          <strong>בתהליך אישור לענן הממשלתי (נימבוס)</strong>
          <span style={{ color: B.gullGray }}> · תהליך מתמשך, נעדכן בהתקדמות.</span>
        </span>
      </div>
    </Shell>
  );
}

/* ── SLIDE 8 — הטמעה וליווי (3 cards) ── */
const ONBOARD = [
  { icon: "calendarCheck", color: B.orange, title: "לוח זמנים ברור", lead: "שבועות, לא חודשים", desc: "מהאפיון ועד עלייה לאוויר, עם אבני דרך מוגדרות מראש." },
  { icon: "gears", color: B.royalBlue, title: "אנחנו מקימים ומלווים", lead: "הצוות שלכם לא בונה", desc: "ההקמה, ההגדרות וההדרכות עלינו — רק מאשר." },
  { icon: "headset", color: B.purple, title: "מנהל לקוח צמוד", lead: "אפיון, הטמעה וליווי שוטף", desc: "כתובת אחת לאורך כל הדרך." },
];
function OnboardSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "40%", right: "5vw", left: "5vw", transform: "translateY(-30%)", display: "flex", gap: 18, direction: "rtl" }}>
        {ONBOARD.map((c, i) => (
          <Card key={i} active={active} delay={0.15 + i * 0.1} style={{ flex: 1, padding: "28px 30px", minHeight: 200 }}>
            <div style={{ display: "flex", justifyContent: "flex-start", direction: "rtl", marginBottom: 18 }}>
              <IconBadge name={c.icon} color={c.color} />
            </div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 21, fontWeight: 700, color: B.bigStone, marginBottom: 6 }}>{c.title}</div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 14, fontWeight: 700, color: c.color, marginBottom: 8 }}>{c.lead}</div>
            <div style={{ textAlign: "right", direction: "rtl", fontSize: 14, color: B.gullGray, lineHeight: 1.6 }}>{c.desc}</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

/* ── SLIDE 9 — מה ייחודי לנו (4 numbered quadrant cards) ── */
const UNIQUE = [
  { n: "01", title: "מסמך כחלק מתהליך", desc: "מסמך יודע שהוא חלק מישיבה X, שייך לוועדה Y, ושההחלטה שהתקבלה על בסיסו מקושרת לסעיף בפרוטוקול — לא עוד קובץ בודד." },
  { n: "02", title: "הרשאות גרנולריות, אוטומטיות", desc: "הרשאות נגזרות עד לרמת המסמך הבודד — על בסיס התהליך, הוועדה וניגודי העניינים של נבחרי הציבור. לא ידני, לא ניתן לטעות." },
  { n: "03", title: "תהליך אחד, לא ארבעה מוצרים", desc: "מועצה, מכרזים, תכנון ובנייה, כספים — אותו תהליך במחזורים שונים. המערכת בנויה ככה מהיסוד." },
  { n: "04", title: "מבינה איך ועדות עובדות", desc: "לא תיק מסמכים גנרי — מודל של ישיבה, סדר יום, החלטה, משימה ואישור. בדיוק כמו שהעירייה עובדת." },
];
function UniqueSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "31vh", bottom: "8vh", right: "5vw", left: "5vw", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 18 }}>
        {UNIQUE.map((c, i) => (
          <Card key={i} active={active} delay={0.15 + i * 0.1} style={{ padding: "22px 30px", display: "flex", alignItems: "flex-start", gap: 20, flexDirection: "row-reverse" }}>
            <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: "clamp(34px,3vw,46px)", fontWeight: 800, color: B.orange, lineHeight: 1, letterSpacing: "-0.02em", flexShrink: 0 }}>{c.n}</div>
            <div style={{ textAlign: "right", direction: "rtl", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: B.bigStone, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 14, color: B.gullGray, lineHeight: 1.65 }}>{c.desc}</div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

/* ── SLIDE 10 — מי כבר איתנו (stats + sectors + logos + badge) ── */
const WHO_STATS = [
  { n: 5, suffix: "+", label: "שנות פעילות" },
  { n: 1000, suffix: "+", label: "ועדות מנוהלות", comma: true },
  { n: 3000, suffix: "+", label: "משתמשים פעילים", comma: true },
  { n: 50, suffix: "+", label: "לקוחות פעילים" },
];
const SECTORS = [
  { icon: "bank", label: "ממשלה ורשויות מקומיות", active: true },
  { icon: "briefcase", label: "בנקאות וביטוח" },
  { icon: "activity", label: "חברות ציבוריות" },
  { icon: "bolt", label: "תעשייה ואנרגיה" },
  { icon: "graduation", label: "אקדמיה" },
  { icon: "heart", label: "בריאות" },
];
const WHO_LOGOS = ["discount.png", "web_hapoalim.svg", "Bar_Ilan_logo 1.png", "elal.png", "leumi.svg", "אקסלנס-לוגו-002 1.png", "Migdal_Logo.svg 1.png", "web_bezeq.svg"];
function WhoStat({ c, active, delay }) {
  const v = useCountUp(c.n, active, 1600);
  return (
    <div style={{ flex: 1, textAlign: "center", direction: "rtl", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`, padding: "6px 0" }}>
      <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontWeight: 800, fontSize: "clamp(34px,3.6vw,54px)", color: B.bigStone, letterSpacing: "-0.03em", lineHeight: 1, direction: "ltr", unicodeBidi: "isolate" }}>
        {c.comma ? fmt(v) : Math.round(v)}<span style={{ color: B.orange }}>{c.suffix}</span>
      </div>
      <div style={{ fontSize: 14, color: B.gullGray, marginTop: 8 }}>{c.label}</div>
    </div>
  );
}
function WhoSlide({ slide, active }) {
  return (
    <Shell slide={slide} active={active}>
      <div style={{ position: "absolute", top: "31vh", right: "5vw", left: "5vw", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* stats row */}
        <div style={{ display: "flex", direction: "rtl", background: B.white, border: `1px solid ${B.athensGray}`, borderRadius: 16, boxShadow: "0 18px 40px -30px rgba(23,33,52,0.5)", padding: "18px 10px" }}>
          {WHO_STATS.map((c, i) => (
            <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: i < WHO_STATS.length - 1 ? `1px solid ${B.athensGray}` : "none" }}>
              <WhoStat c={c} active={active} delay={0.2 + i * 0.12} />
            </div>
          ))}
        </div>
        {/* sectors */}
        <div style={{ display: "flex", direction: "rtl", flexWrap: "wrap", gap: 10, justifyContent: "flex-start", background: B.white, border: `1px solid ${B.athensGray}`, borderRadius: 14, padding: "14px 18px", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.gullGray, alignSelf: "center", marginInlineEnd: 4 }}>בכל המגזרים</span>
          {SECTORS.map((s, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: s.active ? 700 : 500, color: s.active ? B.orange : B.bigStone, background: s.active ? `${B.orange}12` : "transparent", border: s.active ? `1px solid ${B.orange}44` : `1px solid ${B.athensGray}`, padding: "7px 13px", borderRadius: 20 }}>
              <Icon name={s.icon} size={15} color={s.active ? B.orange : B.gullGray} /> {s.label}
            </span>
          ))}
        </div>
        {/* logos */}
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-start", background: B.white, border: `1px solid ${B.athensGray}`, borderRadius: 14, padding: "12px 18px", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.62s" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.gullGray, marginInlineEnd: 4 }}>בין לקוחותינו</span>
          {WHO_LOGOS.map((f, i) => (
            <div key={i} style={{ height: 44, width: 96, display: "flex", alignItems: "center", justifyContent: "center", padding: "6px 10px" }}>
              <img src={encodeURI(A(`/logos/${f}`))} alt="" style={{ maxHeight: 32, maxWidth: "100%", objectFit: "contain", display: "block" }} />
            </div>
          ))}
        </div>
        {/* security banner */}
        <div style={{ display: "flex", direction: "rtl", alignItems: "center", gap: 12, background: `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`, borderRadius: 14, padding: "16px 24px", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.74s", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: -30, right: -10, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${B.royalBlue}33, transparent 70%)`, filter: "blur(8px)" }} />
          <Icon name="shield" size={20} color={B.orangeLight} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>סטנדרט אבטחה</span>
          <div style={{ display: "flex", gap: 8, marginInlineStart: "auto" }}>
            {["ISO 27001", "SOC 2", "תואם רגולציה ישראלית"].map((b, i) => (<span key={i} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", padding: "6px 14px", borderRadius: 20 }}>{b}</span>))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ── CLOSING ── */
function ClosingSlide({ active }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Orbs />
      <div style={{ position: "relative", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 }}><BDLogo height={70} light /></div>
        <h2 style={{ color: "#fff", fontSize: "clamp(48px,7vw,92px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>תודה</h2>
        <p style={{ color: B.gullGray, fontSize: "clamp(18px,2vw,24px)", marginTop: 18, fontWeight: 300 }}>נשמח להראות את זה חי — על הוועדות של עיריית רמת גן.</p>
        <div style={{ marginTop: 38, color: B.cadetBlue, fontSize: 14, direction: "rtl" }}>Bar Lev · Sales &amp; BD · <span style={{ fontWeight: 700, letterSpacing: "0.06em" }}>SQLINK</span></div>
      </div>
    </div>
  );
}

/* ─── Slides list ─── */
const SLIDES = [
  { type: "hero" },
  { type: "what", index: "01", section: "מה זה Boardirector", page: "02", line1: "במקום מספר כלים, מערכת אחת.", line2: "לכל מחזור החיים של הוועדה." },
  { type: "reality", index: "02", section: "המציאות היום", page: "03", line1: "יומיים לפני ישיבת ועדת מכרזים.", line2: "איפה באמת נמצאים החומרים?" },
  { type: "results", index: "03", section: "התוצאות בשטח", page: "04", dark: true, line1: "תוצאות מדידות,", line2: "קצת במספרים:" },
  { type: "friction", index: "04", section: "מה אנחנו פותרים", page: "05", line1: "מה אנחנו פותרים", line2: "חמש נקודות חיכוך, מערכת אחת." },
  { type: "caps", index: "05", section: "היכולות המרכזיות", page: "06", line1: "ארבעה תחומים מרכזיים,", line2: "תהליך אחד מקצה לקצה." },
  { type: "security", index: "06", section: "אבטחה וריבונות מידע", page: "07", line1: "אבטחה וריבונות מידע,", line2: "ברמה שהרגולציה דורשת." },
  { type: "onboard", index: "07", section: "הטמעה וליווי", page: "08", line1: "הטמעה קלה.", line2: "עומס מינימלי על ה-IT." },
  { type: "unique", index: "08", section: "מה ייחודי לנו", page: "09", line1: "לא עוד מערכת ניהול מסמכים.", line2: "מערכת שמבינה איך ועדות עובדות." },
  { type: "who", index: "09", section: "מי כבר איתנו", page: "10", line1: "המקומות שאנחנו פועלים בהם", line2: "מממשלה ורשויות עד בנקאות ואקדמיה." },
  { type: "closing" },
];

function renderSlide(slide, i, active) {
  const wrap = (node) => (
    <div key={i} style={{ position: "absolute", inset: 0, pointerEvents: active ? "auto" : "none", zIndex: active ? 2 : 1 }}>{node}</div>
  );
  switch (slide.type) {
    case "hero": return wrap(<HeroSlide active={active} />);
    case "what": return wrap(<WhatSlide slide={slide} active={active} />);
    case "reality": return wrap(<RealitySlide slide={slide} active={active} />);
    case "results": return wrap(<ResultsSlide slide={slide} active={active} />);
    case "friction": return wrap(<FrictionSlide slide={slide} active={active} />);
    case "caps": return wrap(<CapsSlide slide={slide} active={active} />);
    case "security": return wrap(<SecuritySlide slide={slide} active={active} />);
    case "onboard": return wrap(<OnboardSlide slide={slide} active={active} />);
    case "unique": return wrap(<UniqueSlide slide={slide} active={active} />);
    case "who": return wrap(<WhoSlide slide={slide} active={active} />);
    case "closing": return wrap(<ClosingSlide active={active} />);
    default: return null;
  }
}

/* ─── App shell ─── */
export default function PresentationRamatGan() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback((dir) => {
    if (isTransitioning) return;
    const next = dir === "forward" ? Math.min(current + 1, SLIDES.length - 1) : Math.max(current - 1, 0);
    if (next === current) return;
    setIsTransitioning(true);
    setCurrent(next);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [current, isTransitioning]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); navigate("forward"); }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); navigate("backward"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    <div dir="rtl" onClick={() => navigate("forward")} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: B.white, fontFamily: `'${B.font}', 'SF Pro Display', -apple-system, sans-serif`, cursor: "pointer", userSelect: "none", color: B.bigStone }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes floatCard { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-9px) rotate(var(--r,0deg)); } }
        @keyframes blinkCaret { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        ::selection { background: rgba(254,117,1,0.2); }
      `}</style>

      {/* top progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: B.athensGray, zIndex: 200 }}>
        <div style={{ height: "100%", width: `${((current + 1) / SLIDES.length) * 100}%`, background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* slides */}
      <div style={{ position: "absolute", inset: 0 }}>
        {SLIDES.map((slide, i) => renderSlide(slide, i, current === i))}
      </div>

      {/* nav dots */}
      <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 201 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={(e) => { e.stopPropagation(); if (!isTransitioning) { setIsTransitioning(true); setCurrent(i); setTimeout(() => setIsTransitioning(false), 500); } }}
            style={{ width: current === i ? 24 : 7, height: 7, borderRadius: 4, background: current === i ? `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})` : B.athensGray, transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", cursor: "pointer" }} />
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 22, left: 28, fontSize: 12, color: B.cadetBlue, zIndex: 201, direction: "ltr", opacity: 0.5, fontFamily: `'${B.fontEn}', sans-serif` }}>← → to navigate</div>
      <div style={{ position: "fixed", bottom: 22, right: 28, fontSize: 12, color: B.cadetBlue, zIndex: 201, direction: "ltr", opacity: 0.6, fontFamily: `'${B.fontEn}', sans-serif` }}>
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
