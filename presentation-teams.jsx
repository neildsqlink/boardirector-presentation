import { useState, useEffect, useCallback } from "react";

// Resolve a public-folder path to the deployed base URL so assets work both at
// "/" (npm run dev) and under a sub-path (GitHub Pages / /teams/).
const A = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ─── Brand Tokens (self-contained, matches the Nimbus app UI) ─── */
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
    calendar: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M21.5 20c0-2.8-1.6-4.9-4-5.6" />
      </>
    ),
    book: (
      <>
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3.5H6.5A2.5 2.5 0 0 1 4 20.5z" />
      </>
    ),
    checks: (
      <>
        <path d="M3 12.5l3.5 3.5L14 8.5" />
        <path d="M11 15l1.5 1.5L21 8" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="M8 20v-6M13 20V9M18 20v-9" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v5c0 5-3.3 8.3-7 10-3.7-1.7-7-5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3l8.5 4.5L12 12 3.5 7.5z" />
        <path d="M3.5 12L12 16.5 20.5 12M3.5 16.5L12 21l8.5-4.5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4-4" />
      </>
    ),
    arrow: <path d="M14 6l-6 6 6 6" />,
    spark: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
      </>
    ),
    file: (
      <>
        <path d="M6.5 2.5h7l4 4v13.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20V4a1.5 1.5 0 0 1 1.5-1.5z" />
        <path d="M13.5 2.5V7h4" />
        <path d="M8.5 12.5h7M8.5 16h5" />
      </>
    ),
    folder: <path d="M3 7a2 2 0 0 1 2-2h3.6l2 2.5H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    target: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="0.7" />
      </>
    ),
    flag: (
      <>
        <path d="M6 21V4" />
        <path d="M6 4.5h11l-2.2 3.5L17 11.5H6z" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        <path d="M12 14.8v2.4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    chevronDown: <path d="M6 9.5l6 6 6-6" />,
    pin: (
      <>
        <path d="M12 21c4.5-4.2 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 2.5 6.8 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M4 12.5l5 5L20 6.5" />,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
};

/* ─── Boardirector logo mark (orange rounded square + white "B") ─── */
const LogoMark = ({ size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 10px 28px ${B.orange}55`,
      flexShrink: 0,
    }}
  >
    <span
      style={{
        color: "#fff",
        fontFamily: `'${B.fontEn}', sans-serif`,
        fontWeight: 800,
        fontSize: size * 0.56,
        lineHeight: 1,
        marginTop: -size * 0.02,
      }}
    >
      B
    </span>
  </div>
);

/* ─── Browser-style frame around a real app screenshot ─── */
const AppFrame = ({ src, alt, label = "app.boardirector.com", delay = 0, focus = "top", overlay = null, overlayMode = "center", active = false }) => (
  <div
    style={{
      borderRadius: 16,
      overflow: "hidden",
      background: B.white,
      border: `1px solid ${B.athensGray}`,
      boxShadow: "0 40px 90px -30px rgba(23,33,52,0.45), 0 12px 30px -12px rgba(23,33,52,0.25)",
      animation: `floatCard 7s ease-in-out ${delay}s infinite`,
      width: "100%",
    }}
  >
    {/* chrome bar */}
    <div
      style={{
        height: 38,
        background: "#F4F5F8",
        borderBottom: `1px solid ${B.athensGray}`,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 8,
        direction: "ltr",
      }}
    >
      <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
      <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
      <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
      <div
        style={{
          marginLeft: 14,
          flex: 1,
          maxWidth: 320,
          height: 22,
          borderRadius: 11,
          background: B.white,
          border: `1px solid ${B.athensGray}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontSize: 11,
          color: B.gullGray,
          fontFamily: `'${B.fontEn}', sans-serif`,
        }}
      >
        <span style={{ width: 8, height: 8, marginTop: -1 }}>
          <Icon name="shield" size={11} color={B.green} />
        </span>
        {label}
      </div>
    </div>
    <div style={{ position: "relative", maxHeight: "62vh", overflow: "hidden", display: "flex", alignItems: focus === "top" ? "flex-start" : "center" }}>
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      {overlay && overlayMode === "free" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: active ? 1 : 0, transition: "opacity 0.5s ease 400ms" }}>{overlay}</div>
      )}
      {overlay && overlayMode === "side" && (
        <>
          {/* subtle dim (chat sits on the side) */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.22)", opacity: active ? 1 : 0, transition: "opacity 0.6s ease 800ms" }} />
          {/* right-anchored side panel */}
          <div
            style={{
              position: "absolute",
              top: "5%",
              bottom: "5%",
              right: "3.5%",
              width: "min(340px, 42%)",
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 950ms",
            }}
          >
            {overlay}
          </div>
        </>
      )}
      {overlay && overlayMode !== "side" && overlayMode !== "free" && (
        <>
          {/* dim backdrop so the popup pops (delayed so the screen shows first) */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.45)", opacity: active ? 1 : 0, transition: "opacity 0.6s ease 800ms" }} />
          {/* centered popup */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: active ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(0.9)",
              opacity: active ? 1 : 0,
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 950ms",
              width: "min(430px, 66%)",
            }}
          >
            {overlay}
          </div>
        </>
      )}
    </div>
  </div>
);

const _c01 = (x) => Math.max(0, Math.min(1, x));

/* ─── Create-meeting wizard bits (module-level so pop-in animations aren't
   remounted every animation tick). ─── */
const Caret = () => (
  <span style={{ display: "inline-block", width: 1.5, height: 15, background: B.bigStone, marginInlineStart: 2, verticalAlign: "middle", animation: "blinkCaret 0.9s steps(2) infinite" }} />
);
const Pop = ({ children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, animation: "popIn 0.4s ease both" }}>{children}</span>
);
const CMField = ({ label, placeholder, filled, icon, flex, children }) => (
  <div style={{ flex: flex || "1 1 auto", minWidth: 0 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: B.bigStone, marginBottom: 6 }}>{label}</div>
    <div style={{ height: 40, borderRadius: 10, border: `1.5px solid ${B.athensGray}`, background: B.white, display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
      <span style={{ flex: 1, fontSize: 13.5, color: filled ? B.bigStone : B.cadetBlue, fontWeight: filled ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {filled ? children : placeholder}
      </span>
      {icon && <Icon name={icon} size={15} color={B.gullGray} />}
    </div>
  </div>
);

const CM_ATTENDEES = [
  { name: "דנה לוי", initials: "ד.ל" },
  { name: "אבי כהן", initials: "א.כ" },
  { name: "רונית גולן", initials: "ר.ג" },
  { name: "משה ברק", initials: "מ.ב" },
  { name: "שרה דוד", initials: "ש.ד" },
  { name: "יעל כהן", initials: "י.כ" },
];

const CMStepper = ({ step }) => {
  const labels = ["פרטים", "משתתפים", "סיכום ושליחה"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }}>
      {labels.map((label, i) => {
        const n = i + 1;
        const isActive = step === n;
        const done = step > n;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: done ? B.royalBlue : isActive ? B.whisper : B.athensGray,
                border: isActive ? `2px solid ${B.royalBlue}` : "none",
                color: done ? B.white : isActive ? B.royalBlue : B.cadetBlue,
                fontWeight: 800,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {done ? "✓" : n}
            </div>
            <span style={{ fontSize: 11.5, fontWeight: isActive || done ? 600 : 400, color: isActive || done ? B.bigStone : B.cadetBlue }}>{label}</span>
            {n < 3 && <div style={{ width: 22, height: 1, background: done ? B.royalBlue : B.athensGray }} />}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Animated "create meeting" popup — a 3-step wizard (פרטים → משתתפים →
   סיכום) that fills itself like the Nimbus deck, overlaid on the screenshot. ─── */
function CreateMeetingModal({ active }) {
  const TOTAL = 14000;
  const START_DELAY = 1100; // let the meetings screen show before the popup fills
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) {
      setT(0);
      return;
    }
    let iv;
    const to = setTimeout(() => {
      iv = setInterval(() => setT((x) => (x >= TOTAL ? 0 : x + 40)), 40);
    }, START_DELAY);
    return () => {
      clearTimeout(to);
      if (iv) clearInterval(iv);
    };
  }, [active]);

  const step = t < 5400 ? 1 : t < 9200 ? 2 : 3;

  // STEP 1 — details fill
  const TITLE = "ישיבת ועדת כספים – רבעון 3";
  const tp = _c01((t - 600) / 2400);
  const titleShown = TITLE.slice(0, Math.round(TITLE.length * tp));
  const titleTyping = t >= 600 && tp < 1;
  const commIn = t >= 3200;
  const dateIn = t >= 3700;
  const timeIn = t >= 4100;
  const locIn = t >= 4600;

  // STEP 2 — attendees populate
  const attN = t < 5900 ? 0 : Math.min(CM_ATTENDEES.length, Math.floor((t - 5900) / 430) + 1);

  // STEP 3 — summary + send
  const pub = t >= 9800;
  const send = t >= 10300;

  const nextPulse = (step === 1 && t >= 5000 && t < 5400) || (step === 2 && t >= 8700 && t < 9200);
  const createPress = step === 3 && t >= 11400 && t < 11900;
  const success = t >= 12100;

  const chk = (on) => (
    <span style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${on ? B.royalBlue : B.athensGray}`, background: on ? B.royalBlue : B.white, color: "#fff", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>
      {on ? "✓" : ""}
    </span>
  );
  const sumRow = { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: B.bigStone };

  return (
    <div
      style={{
        width: "100%",
        background: B.white,
        borderRadius: 16,
        boxShadow: "0 30px 70px -18px rgba(23,33,52,0.6)",
        border: `1px solid ${B.athensGray}`,
        padding: "20px 24px 18px",
        position: "relative",
        direction: "rtl",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: `${B.orange}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="calendar" size={19} color={B.orange} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: B.bigStone }}>יצירת ישיבה חדשה</div>
        </div>
        <Icon name="close" size={17} color={B.gullGray} />
      </div>

      {/* stepper */}
      <CMStepper step={step} />

      {/* body — fixed min height so the modal doesn't jump between steps */}
      <div style={{ minHeight: 232 }}>
        {step === 1 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <CMField label="שם הישיבה" placeholder="הקלידו שם ישיבה" filled={titleShown.length > 0}>
                {titleShown}
                {titleTyping && <Caret />}
              </CMField>
              <CMField label="ועדה" placeholder="בחרו ועדה" filled={commIn} icon="chevronDown">
                <Pop>ועדת כספים</Pop>
              </CMField>
              <div style={{ display: "flex", gap: 12 }}>
                <CMField label="תאריך" placeholder="בחרו תאריך" filled={dateIn} icon="calendar" flex="1 1 55%">
                  <Pop>04/07/2025</Pop>
                </CMField>
                <CMField label="שעה" placeholder="בחרו שעה" filled={timeIn} icon="clock" flex="1 1 45%">
                  <Pop><span dir="ltr" style={{ unicodeBidi: "isolate" }}>09:00–15:00</span></Pop>
                </CMField>
              </div>
              <CMField label="מיקום" placeholder="בחרו מיקום" filled={locIn} icon="pin">
                <Pop>רחוב רוטשילד 10, תל אביב</Pop>
              </CMField>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: B.bigStone, marginBottom: 10 }}>משתתפים ({attN})</div>
            <div style={{ height: 38, borderRadius: 10, border: `1.5px solid ${B.athensGray}`, background: B.white, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, fontSize: 13, color: B.cadetBlue, marginBottom: 12 }}>
              <Icon name="search" size={15} color={B.gullGray} /> הוסיפו משתתפים
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CM_ATTENDEES.slice(0, attN).map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", borderRadius: 10, border: `1px solid ${B.athensGray}`, background: B.white, animation: "popIn 0.4s ease both" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${B.royalBlue}, ${B.teal})`, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {a.initials}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: B.bigStone, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ borderRadius: 12, border: `1px solid ${B.athensGray}`, background: "#FBFCFE", padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.bigStone, marginBottom: 10 }}>ישיבת ועדת כספים – רבעון 3</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={sumRow}><Icon name="calendar" size={15} color={B.royalBlue} /> 04/07/2025</div>
                <div style={sumRow}><Icon name="clock" size={15} color={B.royalBlue} /> <span dir="ltr" style={{ unicodeBidi: "isolate" }}>09:00–15:00</span></div>
                <div style={sumRow}><Icon name="pin" size={15} color={B.royalBlue} /> רחוב רוטשילד 10, תל אביב</div>
                <div style={sumRow}><Icon name="users" size={15} color={B.royalBlue} /> {CM_ATTENDEES.length} משתתפים</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: B.bigStone }}>{chk(pub)} פרסום הישיבה ביומן</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: B.bigStone }}>{chk(send)} שליחת הזמנה למשתתפים</div>
            </div>
          </>
        )}
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
        <button style={{ border: `1px solid ${B.athensGray}`, borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: "inherit", color: B.gullGray, background: B.white }}>
          {step === 1 ? "ביטול" : "→ חזרה"}
        </button>
        {step < 3 ? (
          <button
            style={{
              border: "none",
              borderRadius: 10,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              color: "#fff",
              background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transform: nextPulse ? "scale(0.95)" : "scale(1)",
              boxShadow: nextPulse ? `0 0 0 4px ${B.orange}33` : `0 8px 20px -8px ${B.orange}88`,
              transition: "all 0.18s ease",
            }}
          >
            המשך <span>›</span>
          </button>
        ) : (
          <button
            style={{
              border: "none",
              borderRadius: 10,
              padding: "10px 22px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              color: "#fff",
              background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transform: createPress ? "scale(0.95)" : "scale(1)",
              boxShadow: createPress ? `0 0 0 4px ${B.orange}33` : `0 8px 20px -8px ${B.orange}88`,
              transition: "all 0.18s ease",
            }}
          >
            <Icon name="plus" size={15} color="#fff" /> צור ישיבה
          </button>
        )}
      </div>

      {/* success overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: B.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          opacity: success ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.4s ease",
        }}
      >
        <div style={{ width: 74, height: 74, borderRadius: "50%", background: `linear-gradient(135deg, #2FCB6E, ${B.green})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 34px ${B.green}66`, transform: success ? "scale(1)" : "scale(0.5)", transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <Icon name="check" size={38} color="#fff" stroke={2.6} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: B.bigStone }}>הישיבה נוצרה!</div>
      </div>
    </div>
  );
}


/* ─── AI Assistant chat panel — reused from the Nimbus deck, overlaid on the
   Meeting Book screenshot (side panel). Self-fills: user asks → AI answers. ─── */
function MeetingBookChatPanel({ active }) {
  const [t, setT] = useState(0);
  const TOTAL = 13000;
  useEffect(() => {
    if (!active) {
      setT(0);
      return;
    }
    const iv = setInterval(() => setT((x) => (x >= TOTAL ? 0 : x + 40)), 40);
    return () => clearInterval(iv);
  }, [active]);

  const Q = "סכם לי את עיקרי הפרוטוקול";
  const A = "הישיבה אישרה את סדר היום ואת הפרוטוקול הקודם. הוחלט על אישור התקציב לרבעון 3 ומינוי ועדת המשנה. נפתחו 3 משימות מעקב עם אחראים ותאריכי יעד.";

  // start after a beat so the screen shows first
  const qStart = 1300;
  const qp = _c01((t - qStart) / 2000);
  const qShown = Q.slice(0, Math.round(Q.length * qp));
  const qTyping = t >= qStart && qp < 1;
  const showTyping = t >= qStart + 2100 && t < qStart + 3500;
  const aStart = qStart + 3500;
  const ap = _c01((t - aStart) / 5200);
  const aShown = A.slice(0, Math.round(A.length * ap));
  const aTyping = t >= aStart && ap < 1;
  const aStarted = t >= aStart;

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: 14, background: B.white, boxShadow: "0 18px 60px rgba(23,33,52,0.32)", border: `1px solid ${B.athensGray}`, display: "flex", flexDirection: "column", overflow: "hidden", direction: "rtl" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`, borderBottom: `1px solid ${B.athensGray}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 800, fontSize: 11, fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 1 }}>AI</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.bigStone }}>AI Assistant</div>
          <div style={{ fontSize: 10, color: B.green, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.green }} /> פעיל
          </div>
        </div>
        <span style={{ fontSize: 16, color: B.cadetBlue }}>×</span>
      </div>
      {/* messages */}
      <div style={{ flex: 1, padding: "14px 14px 8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ alignSelf: "flex-start", maxWidth: "92%" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: B.gullGray, marginBottom: 4 }}>אתה</div>
          <div style={{ padding: "10px 12px", borderRadius: "12px 12px 12px 4px", background: B.bigStone, color: B.white, fontSize: 12.5, lineHeight: 1.5 }}>
            {qShown}
            {qTyping && <span style={{ display: "inline-block", width: 1.5, height: 12, background: B.white, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
          </div>
        </div>
        {showTyping && (
          <div style={{ alignSelf: "flex-end", maxWidth: "60%" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: B.orange, marginBottom: 4, textAlign: "left" }}>AI Assistant</div>
            <div style={{ padding: "10px 14px", borderRadius: "12px 12px 4px 12px", background: `${B.orange}12`, border: `1px solid ${B.orange}25`, display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: B.orange, animation: `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {aStarted && (
          <div style={{ alignSelf: "flex-end", maxWidth: "92%" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: B.orange, marginBottom: 4, textAlign: "left" }}>AI Assistant</div>
            <div style={{ padding: "10px 12px", borderRadius: "12px 12px 4px 12px", background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`, border: `1px solid ${B.orange}25`, fontSize: 12.5, color: B.bigStone, lineHeight: 1.55 }}>
              {aShown}
              {aTyping && <span style={{ display: "inline-block", width: 1.5, height: 12, background: B.orange, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
            </div>
          </div>
        )}
      </div>
      {/* input bar */}
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${B.athensGray}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, background: "#F4F5F8", border: `1px solid ${B.athensGray}`, fontSize: 11.5, color: B.cadetBlue }}>
          שאל שאלה על המסמכים...
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontSize: 14 }}>↑</div>
      </div>
    </div>
  );
}

/* ─── AI Agenda Builder popup — reused verbatim from the Nimbus deck, overlaid
   on the meeting-page (סדר יום) screenshot. Builds the agenda item by item. ─── */
const AGENDA_ITEMS = [
  "פתיחה והודעות יו״ר",
  "סקירת מכרזים פתוחים",
  "הערכת הצעות ספקים",
  "אישור המלצות הוועדה",
  "סיכום והחלטות",
];

function useAgendaCycle(active, totalItems, itemMs = 1400, pauseMs = 3000) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!active) {
      setShown(0);
      return;
    }
    const cycleLen = totalItems * itemMs + pauseMs;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) % cycleLen;
      setShown(Math.min(Math.floor(elapsed / itemMs), totalItems));
    }, 100);
    return () => clearInterval(id);
  }, [active, totalItems, itemMs, pauseMs]);
  return shown;
}

function AgendaBuilderPopup({ active }) {
  const shown = useAgendaCycle(active, AGENDA_ITEMS.length, 1400, 3000);
  const rimGradient = `conic-gradient(from var(--ai-angle, 0deg), ${B.orange}, ${B.royalBlue}, ${B.teal}, ${B.orangeLight}, ${B.orange})`;
  return (
    <div style={{ position: "relative", direction: "rtl" }}>
      {/* Soft outer glow */}
      <div className={active ? "ai-rim-glow" : ""} style={{ position: "absolute", inset: -10, borderRadius: 28, background: rimGradient, filter: "blur(16px)", opacity: 0.55, pointerEvents: "none" }} />
      {/* Crisp gradient rim */}
      <div className={active ? "ai-rim" : ""} style={{ position: "absolute", inset: 0, borderRadius: 20, padding: 2.5, background: rimGradient, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", pointerEvents: "none" }} />
      {/* Inner card */}
      <div style={{ position: "relative", borderRadius: 18, background: B.white, padding: "20px 22px 22px", boxShadow: "0 18px 60px rgba(23,33,52,0.32)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ padding: "4px 10px", borderRadius: 12, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: 10, fontWeight: 800, letterSpacing: 2, fontFamily: `'${B.fontEn}', sans-serif` }}>AI</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: B.bigStone }}>בונה סדר יום אוטומטי</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: B.royalBlue, animation: active ? `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` : "none" }} />
            ))}
          </div>
        </div>
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {AGENDA_ITEMS.map((it, i) => {
            const visible = i < shown;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, background: visible ? `${B.teal}10` : B.athensGray + "30", opacity: visible ? 1 : 0.35, transform: visible ? "translateX(0)" : "translateX(8px)", transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: visible ? B.teal : B.athensGray, color: B.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                  {visible ? "✓" : ""}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: visible ? B.bigStone : B.cadetBlue, flex: 1 }}>{it}</div>
                {i === shown - 1 && active && <div style={{ fontSize: 10, color: B.teal, fontWeight: 700 }}>חדש</div>}
              </div>
            );
          })}
          {shown < AGENDA_ITEMS.length && active && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px dashed ${B.cadetBlue}` }} />
              <div style={{ width: 2, height: 12, background: B.royalBlue, animation: "blinkCaret 0.9s steps(2) infinite" }} />
            </div>
          )}
        </div>
        {/* Caption */}
        <div style={{ marginTop: 14, fontSize: 11, color: B.gullGray, fontWeight: 400, textAlign: "center", borderTop: `1px solid ${B.athensGray}`, paddingTop: 10 }}>
          מבוסס על תוכנית עבודה ודרישות רגולציה
        </div>
      </div>
    </div>
  );
}

/* ─── Tasks module — coded Kanban board with a card that moves to "הושלם". ─── */
const KanbanCard = ({ tag, tagColor, title, avatar, date, done }) => (
  <div style={{ background: done ? `${B.green}0F` : B.white, border: `1px solid ${done ? B.green + "66" : B.athensGray}`, borderRadius: 10, padding: "9px 11px", boxShadow: "0 1px 4px rgba(23,33,52,0.06)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
      <span style={{ fontSize: 9.5, fontWeight: 700, color: tagColor, background: `${tagColor}18`, padding: "2px 7px", borderRadius: 6 }}>{tag}</span>
      {done && <span style={{ width: 15, height: 15, borderRadius: "50%", background: B.green, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>}
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: B.bigStone, lineHeight: 1.35 }}>{title}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg, ${B.royalBlue}, ${B.teal})`, color: "#fff", fontSize: 8.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{avatar}</span>
      <span style={{ fontSize: 9.5, color: B.gullGray }}>{date}</span>
    </div>
  </div>
);

const KanbanColumn = ({ left, title, dot, count, reserve, children }) => (
  <div style={{ position: "absolute", top: 0, bottom: 0, left, width: "30%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, height: 24, marginBottom: 12 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
      <span style={{ fontSize: 12.5, fontWeight: 700, color: B.bigStone }}>{title}</span>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: B.gullGray, background: B.athensGray, borderRadius: 8, padding: "1px 7px" }}>{count}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: reserve ? 66 : 0 }}>{children}</div>
  </div>
);

function TasksKanbanBoard({ active }) {
  const CYCLE = 6000;
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) {
      setT(0);
      return;
    }
    const iv = setInterval(() => setT((x) => (x >= CYCLE ? 0 : x + 40)), 40);
    return () => clearInterval(iv);
  }, [active]);
  const moved = t >= 1500 && t < 5300;
  const doneLook = t >= 2500 && t < 5300;
  const snapping = t >= 5250 && t < 5450;
  const faded = t >= 5000 && t < 5480;

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 40px 90px -30px rgba(23,33,52,0.45), 0 12px 30px -12px rgba(23,33,52,0.25)", width: "100%", animation: "floatCard 7s ease-in-out infinite" }}>
      {/* chrome bar */}
      <div style={{ height: 38, background: "#F4F5F8", borderBottom: `1px solid ${B.athensGray}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8, direction: "ltr" }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        <div style={{ marginLeft: 14, flex: 1, maxWidth: 300, height: 22, borderRadius: 11, background: B.white, border: `1px solid ${B.athensGray}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: B.gullGray, fontFamily: `'${B.fontEn}', sans-serif` }}>
          <Icon name="shield" size={11} color={B.green} /> Boardirector · Tasks
        </div>
      </div>
      {/* board */}
      <div style={{ height: "56vh", background: "#F4F6FA", padding: "16px 20px", direction: "rtl", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Icon name="checks" size={19} color={B.royalBlue} />
            <span style={{ fontSize: 17, fontWeight: 700, color: B.bigStone }}>משימות</span>
          </div>
          <div style={{ padding: "6px 14px", borderRadius: 9, background: `linear-gradient(135deg, ${B.orangeLight}, ${B.orange})`, color: "#fff", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="plus" size={13} color="#fff" /> משימה חדשה
          </div>
        </div>
        <div style={{ position: "relative", flex: 1 }}>
          <KanbanColumn left="68%" title="לביצוע" dot={B.royalBlue} count={2}>
            <KanbanCard tag="ועדת ביקורת" tagColor={B.royalBlue} title="אישור דוח כספי Q3" avatar="ד.כ" date="15/07" />
            <KanbanCard tag="ועדת כספים" tagColor={B.royalBlue} title="עדכון מדיניות השקעות" avatar="א.כ" date="18/07" />
          </KanbanColumn>
          <KanbanColumn left="35%" title="בתהליך" dot={B.orange} count={moved ? 1 : 2} reserve>
            <KanbanCard tag="ועדת מכרזים" tagColor={B.orange} title="בדיקת מסמכי ספקים" avatar="ר.ג" date="14/07" />
          </KanbanColumn>
          <KanbanColumn left="2%" title="הושלם" dot={B.green} count={moved ? 3 : 2} reserve>
            <KanbanCard tag="דירקטוריון" tagColor={B.green} title="אישור פרוטוקול קודם" avatar="מ.ב" date="10/07" done />
            <KanbanCard tag="ועדת כספים" tagColor={B.green} title="מינוי ועדת משנה" avatar="ש.ד" date="09/07" done />
          </KanbanColumn>
          {/* flying card */}
          <div
            style={{
              position: "absolute",
              top: 36,
              width: "30%",
              left: moved ? "2%" : "35%",
              opacity: faded ? 0 : 1,
              transition: snapping ? "opacity 0.3s ease" : "left 1.1s cubic-bezier(0.34,1.15,0.6,1), opacity 0.3s ease",
              zIndex: 5,
            }}
          >
            <KanbanCard tag="ועדת מכרזים" tagColor={doneLook ? B.green : B.orange} title="סקירת מכרזים פתוחים" avatar="נ.ד" date="12/07" done={doneLook} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksSlide({ slide, active }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: B.white, display: "flex", alignItems: "center", padding: "0 5vw", gap: "4vw" }}>
      <div style={{ flex: "0 0 34%", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 54, height: 54, borderRadius: 15, background: `${slide.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="checks" size={27} color={slide.accent} />
          </div>
          <div>
            <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: 14, fontWeight: 700, color: slide.accent, letterSpacing: "0.1em" }}>{slide.index}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.bigStone }}>{slide.kicker}</div>
          </div>
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3.1vw, 44px)", fontWeight: 800, color: B.bigStone, lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>{slide.title}</h2>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 22 }}>
          {slide.bullets.map((bl, i) => (
            <div key={i} style={{ display: "flex", gap: 15, opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(20px)", transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s` }}>
              <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: B.whisper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={bl.icon} size={20} color={slide.accent} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: B.bigStone }}>{bl.head}</div>
                <div style={{ fontSize: 15, color: B.gullGray, lineHeight: 1.55, marginTop: 3, fontWeight: 300 }}>{bl.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
        <TasksKanbanBoard active={active} />
      </div>
    </div>
  );
}
/* ─── Soft glow orbs for dark slides ─── */
const Orbs = () => (
  <>
    <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${B.royalBlue}33, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${B.orange}22, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
    <div style={{ position: "absolute", top: "30%", left: "20%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${B.teal}1f, transparent 70%)`, filter: "blur(20px)", pointerEvents: "none" }} />
  </>
);

/* ─── Full capabilities map — every module the system covers ─── */
const MODULES = [
  { icon: "users", name: "ועדות", desc: "כל הוועדות והחברים", accent: B.royalBlue },
  { icon: "calendar", name: "ישיבות", desc: "לוח ישיבות ויומן", accent: B.royalBlue },
  { icon: "book", name: "ספר הישיבה", desc: "כל חומרי הישיבה", accent: B.teal },
  { icon: "layers", name: "סדר יום", desc: "נושאים וזמנים", accent: B.teal },
  { icon: "file", name: "פרוטוקול", desc: "מטיוטה עד אישור", accent: B.teal },
  { icon: "checks", name: "משימות", desc: "אחראי, סטטוס ויעד", accent: B.orange },
  { icon: "target", name: "תוכנית עבודה", desc: "משימות שנתיות", accent: B.royalBlue },
  { icon: "flag", name: "מעקב החלטות", desc: "חוצה־ועדות", accent: B.orange },
  { icon: "folder", name: "מסמכים ומשאבים", desc: "ספרייה מרכזית", accent: B.royalBlue },
  { icon: "chart", name: "דוחות", desc: "תמונת מצב", accent: B.teal },
  { icon: "search", name: "חיפוש חכם", desc: "בכל המערכת", accent: B.royalBlue },
  { icon: "lock", name: "הרשאות ותפקידים", desc: "מי רואה מה", accent: B.orange },
];

/* ─── Slides ─── */
const SLIDES = [
  // 1. HERO
  { type: "hero" },

  // 2. CAPABILITIES MAP – the full breadth at a glance
  {
    type: "map",
    eyebrow: "מה המערכת יודעת",
    title: "מערכת אחת — לכל מה שקורה בוועדות",
    intro: "מהתכנון, דרך הישיבה עצמה, ועד המעקב אחרי ההחלטות — הכל בסביבה אחת.",
    modules: MODULES,
  },

  // 3. FEATURE – Committees & Meetings (create-meeting popup animates on the shot)
  {
    type: "feature",
    index: "01",
    accent: B.royalBlue,
    icon: "calendar",
    kicker: "ועדות וישיבות",
    title: "כל הפעילות של הוועדות — במקום אחד",
    bullets: [
      { icon: "users", head: "כל הוועדות בתמונה אחת", text: "ועדת ביקורת, כספים, תגמול ועוד — עם חברים, מנהלים וסטטוס." },
      { icon: "calendar", head: "לוח ישיבות ויומן", text: "ישיבות קרובות ותצוגה לפי ועדה — הכל מסונכרן." },
      { icon: "plus", head: "יצירת ישיבה בכמה קליקים", text: "פרטים, ועדה, מועד ומשתתפים — בתהליך מנוהל אחד." },
    ],
    shots: [
      { src: "/screenshots/meetings.png", alt: "מסך ניהול ישיבות", label: "Boardirector · Meetings", overlay: "createMeeting" },
    ],
  },

  // 4. FEATURE – Agenda & Minutes
  {
    type: "feature",
    index: "02",
    accent: B.teal,
    icon: "layers",
    kicker: "סדר יום ופרוטוקול",
    title: "בונים את הישיבה — נושא אחר נושא",
    bullets: [
      { icon: "layers", head: "נושאים, זמנים והפסקות", text: "גוררים, מסדרים ומחלקים זמן לכל סעיף בסדר היום." },
      { icon: "file", head: "פרוטוקול מטיוטה עד אישור", text: "כתיבה, גרסאות ואישור חתום — הכל בתוך המערכת." },
      { icon: "clock", head: "חלוקת זמנים חכמה", text: "רואים בדיוק כמה זמן מוקצה לכל נושא בישיבה." },
    ],
    shots: [
      { src: "/screenshots/meeting-page.png", alt: "מסך סדר יום של ישיבה", label: "Boardirector · Agenda", overlay: "agenda" },
    ],
  },

  // 5. FEATURE – Meeting Book
  {
    type: "feature",
    index: "03",
    accent: B.orange,
    icon: "book",
    kicker: "ספר הישיבה",
    title: "כל חומרי הישיבה — בתצוגה אחת נקייה",
    bullets: [
      { icon: "layers", head: "הכל במקום אחד", text: "סדר יום, מסמכים, מצגות ופרוטוקול — בלי לחפש בין מיילים." },
      { icon: "shield", head: "הרשאות חכמות", text: "כל חבר ועדה רואה בדיוק את מה שמותר לו לראות." },
      { icon: "search", head: "ניווט וחיפוש מהיר", text: "מעבר בין נושאים, סימון לא-נקרא וחיפוש בתוך הקבצים." },
    ],
    shots: [
      { src: "/screenshots/meeting-book.png", alt: "מסך ספר הישיבה", label: "Boardirector · Meeting Book", overlay: "chat" },
    ],
  },

  // 5a. TASKS – coded Kanban board with a card moving to "הושלם"
  {
    type: "tasks",
    index: "04",
    accent: B.teal,
    kicker: "משימות · Kanban",
    title: "כל המשימות על לוח אחד",
    bullets: [
      { icon: "checks", head: "לוח קנבן חזותי", text: "לביצוע, בתהליך והושלם — גוררים משימה בין העמודות וממשיכים." },
      { icon: "users", head: "אחראי ותאריך יעד לכל משימה", text: "כל משימה משויכת לאדם, לוועדה ולמועד יעד." },
      { icon: "bell", head: "מעקב אחר התקדמות", text: "רואים בכל רגע מה נשאר לביצוע ומה כבר הושלם." },
    ],
  },

  // 5b. FEATURE – BD Drive (Resources)
  {
    type: "feature",
    index: "05",
    accent: B.royalBlue,
    icon: "folder",
    kicker: "BD Drive",
    title: "כל המסמכים של הארגון — בכונן אחד",
    bullets: [
      { icon: "folder", head: "ספרייה מרכזית לכל הארגון", text: "תיקיות אישיות, משותפות וארכיון — הכל מסודר במקום אחד." },
      { icon: "file", head: "כל סוגי הקבצים", text: "DOCX, XLSX, PDF ועוד — עם תצוגה מקדימה, גרסאות ומועדפים." },
      { icon: "lock", head: "הרשאות חכמות לכל קובץ", text: "כל קובץ נגיש רק למי שמורשה — לפי ועדה ותפקיד." },
    ],
    shots: [
      { src: "/screenshots/recources.png", alt: "מסך BD Drive", label: "Boardirector · BD Drive" },
    ],
  },

  // 6. FEATURE – Decisions & Tasks
  {
    type: "feature",
    index: "06",
    accent: B.orange,
    icon: "flag",
    kicker: "החלטות ומשימות",
    title: "מהחלטה — למשימה — למעקב",
    bullets: [
      { icon: "flag", head: "כל ההחלטות במקום אחד", text: "יומן החלטות חוצה־ועדות עם אחראי, סטטוס ותאריך." },
      { icon: "checks", head: "החלטות הופכות למשימות", text: "מה שסוכם בישיבה נפתח כמשימה עם אחראי ותאריך יעד." },
      { icon: "chart", head: "אחוזי התקדמות בזמן אמת", text: "רואים לכל ועדה מה בוצע, מה בתהליך ומה עוד פתוח." },
    ],
    shots: [
      { src: "/screenshots/decision-tracker.png", alt: "מסך מעקב החלטות", label: "Boardirector · Decision Tracker" },
    ],
  },

  // 7. CLIENTS – logos marquee (reused from the process deck)
  {
    type: "clients",
    title: "וזה כבר עובד היום – במאות ארגונים",
    subtitle: "חברות ציבוריות וממשלתיות, רשויות מקומיות, מוסדות אקדמיים ועוד – כולם מנהלים את התהליך בצורה אחת, רציפה ומתועדת.",
    logos: [
      "leumi.svg",
      "web_hapoalim.svg",
      "discount.png",
      "הבנק_הבינלאומי.svg 1.png",
      "לוגו_של_בנק_מזרחי-טפחות.svg 1.png",
      "Migdal_Logo.svg 1.png",
      "מנורה_מבטחים_לוגו.svg 1.png",
      "ayalon.png",
      "אלטשולר_שחם 1.png",
      "לוגו_מיטב_בית_השקעות.svg 1.png",
      "אקסלנס-לוגו-002 1.png",
      "Amitim_Logo_Tagline_RGB-2 1.png",
      "more.svg",
      "isracard-logo-print-1024x996 1.png",
      "web_bezeq.svg",
      "Partner_logo.svg 1.png",
      "פלאפון-שירות-לקוחות-לוגו-757x1024 1.png",
      "amdocs.png",
      "elal.png",
      "egged.svg",
      "RAMILEVI 1.png",
      "tnuva.png",
      "strauss.png",
      "delek.png",
      "אלקטרה-פאוור-סופר-גז-חשמל 1.png",
      "428_main 1.png",
      "gcity.png",
      "מליסרון.svg 1.png",
      "AzrieliGroup.svg 1.png",
      "path42.png",
      "ShikunBinuy.svg 1.png",
      "wesure.png",
      "assuta-2 1.png",
      "לוגו-מדיקה 1.png",
      "ilex-308x200 1.png",
      "clalit.svg",
      "Bar_Ilan_logo 1.png",
    ],
  },

  // 8. LIVE DEMO CUE
  { type: "demo" },

  // 8. CLOSING
  { type: "closing" },
];

/* ─── Slide renderers ─── */
function HeroSlide({ active }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Orbs />
      <div style={{ position: "relative", textAlign: "center", padding: "0 6vw", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <img
          src={A("/bd-logo-full-white.svg")}
          alt="Boardirector by SQlink"
          style={{ height: 132, width: "auto", marginBottom: 34, display: "block", marginInline: "auto" }}
        />
        <h1 style={{ color: "#fff", fontSize: "clamp(42px, 6vw, 84px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
          ניהול חכם של
          <br />
          <span
            style={{
              background: `linear-gradient(90deg, ${B.orangeLight}, ${B.orange} 40%, ${B.royalBlue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ועדות, פרוטוקולים והחלטות
          </span>
        </h1>
        <p style={{ color: B.gullGray, fontSize: "clamp(18px, 2vw, 24px)", marginTop: 28, fontWeight: 300, maxWidth: 720, marginInline: "auto", lineHeight: 1.5 }}>
          מוועדות וישיבות, דרך ספר הישיבה, ועד המעקב אחרי ההחלטות — בסביבה אחת.
        </p>
      </div>
    </div>
  );
}

function MapSlide({ slide, active }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: B.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6vw" }}>
      <div style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ color: B.orange, fontWeight: 700, fontSize: 16, letterSpacing: "0.08em", marginBottom: 12 }}>{slide.eyebrow}</div>
        <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: B.bigStone, letterSpacing: "-0.02em", margin: 0 }}>{slide.title}</h2>
        <p style={{ color: B.gullGray, fontSize: "clamp(15px, 1.6vw, 19px)", marginTop: 12, fontWeight: 300, maxWidth: 780 }}>{slide.intro}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 40 }}>
        {slide.modules.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 18px",
              borderRadius: 16,
              border: `1px solid ${B.athensGray}`,
              background: B.white,
              boxShadow: "0 12px 28px -22px rgba(23,33,52,0.45)",
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(22px)",
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.04}s`,
            }}
          >
            <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 12, background: `${m.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={m.icon} size={23} color={m.accent} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: B.bigStone, whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontSize: 13, color: B.gullGray, marginTop: 2, fontWeight: 300, whiteSpace: "nowrap" }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureSlide({ slide, active }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: B.white, display: "flex", alignItems: "center", padding: "0 5vw", gap: "4vw" }}>
      {/* text side (RTL: right) */}
      <div style={{ flex: "0 0 34%", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 54, height: 54, borderRadius: 15, background: `${slide.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={slide.icon} size={27} color={slide.accent} />
          </div>
          <div>
            <div style={{ fontFamily: `'${B.fontEn}', sans-serif`, fontSize: 14, fontWeight: 700, color: slide.accent, letterSpacing: "0.1em" }}>{slide.index}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.bigStone }}>{slide.kicker}</div>
          </div>
        </div>
        <h2 style={{ fontSize: "clamp(28px, 3.1vw, 44px)", fontWeight: 800, color: B.bigStone, lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>{slide.title}</h2>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 22 }}>
          {slide.bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 15,
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(20px)",
                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s`,
              }}
            >
              <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 12, background: B.whisper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={b.icon} size={20} color={slide.accent} />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: B.bigStone }}>{b.head}</div>
                <div style={{ fontSize: 15, color: B.gullGray, lineHeight: 1.55, marginTop: 3, fontWeight: 300 }}>{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* screenshot side (RTL: left) */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}>
        {slide.shots.map((s, i) => (
          <AppFrame
            key={i}
            src={A(s.src)}
            alt={s.alt}
            label={s.label}
            delay={i * 0.6}
            active={active}
            overlay={
              s.overlay === "createMeeting" ? <CreateMeetingModal active={active} /> : s.overlay === "chat" ? <MeetingBookChatPanel active={active} /> : s.overlay === "agenda" ? <AgendaBuilderPopup active={active} /> : null
            }
            overlayMode={s.overlay === "chat" ? "side" : "center"}
          />
        ))}
      </div>
    </div>
  );
}

function ClientsSlide({ slide, active }) {
  const logos = slide.logos.map((f) => A(`/logos/${f}`));
  return (
    <div style={{ position: "absolute", inset: 0, background: B.white, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5vw", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 36, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 800, color: B.bigStone, letterSpacing: "-0.02em", margin: 0 }}>{slide.title}</h2>
        <p style={{ color: B.gullGray, fontSize: "clamp(15px, 1.7vw, 20px)", marginTop: 16, fontWeight: 300, maxWidth: 900, marginInline: "auto", lineHeight: 1.6 }}>{slide.subtitle}</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 1280, marginInline: "auto" }}>
        {logos.map((src, i) => (
          <div
            key={i}
            style={{
              height: 78,
              width: 168,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: B.white,
              border: `1px solid ${B.athensGray}`,
              borderRadius: 14,
              boxShadow: "0 2px 10px rgba(23,33,52,0.04)",
              padding: "12px 20px",
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
              transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.03}s`,
            }}
          >
            <img src={encodeURI(src)} alt="" style={{ maxHeight: 46, maxWidth: "100%", objectFit: "contain", display: "block" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoSlide({ active }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Orbs />
      <div style={{ position: "relative", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.94)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 40px" }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: B.green, opacity: 0.25, animation: "pulseRing 2s ease-out infinite" }} />
          <span style={{ position: "absolute", inset: 18, borderRadius: "50%", background: B.green, opacity: 0.35, animation: "pulseRing 2s ease-out 0.4s infinite" }} />
          <div style={{ position: "absolute", inset: 38, borderRadius: "50%", background: `linear-gradient(135deg, #2FCB6E, ${B.green})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${B.green}88` }}>
            <div style={{ width: 0, height: 0, borderTop: "16px solid transparent", borderBottom: "16px solid transparent", borderRight: "26px solid #fff", marginRight: 6 }} />
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 18px", borderRadius: 30, background: "rgba(22,163,74,0.15)", border: `1px solid ${B.green}66`, color: "#8FE9B4", fontSize: 15, fontWeight: 600, marginBottom: 24, fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: "0.06em" }}>
          LIVE DEMO
        </div>
        <h2 style={{ color: "#fff", fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>עכשיו — נעבור למערכת עצמה</h2>
        <p style={{ color: B.gullGray, fontSize: "clamp(17px, 2vw, 22px)", marginTop: 22, fontWeight: 300 }}>בואו נראה את זה חי — ישיבות, ספר הישיבה והמשימות.</p>
      </div>
    </div>
  );
}

function ClosingSlide({ active }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(150deg, ${B.bigStone} 0%, ${B.bigStone2} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Orbs />
      <div style={{ position: "relative", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
        <LogoMark size={80} />
        <h2 style={{ color: "#fff", fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "36px 0 0" }}>תודה</h2>
        <p style={{ color: B.gullGray, fontSize: "clamp(18px, 2.2vw, 26px)", marginTop: 20, fontWeight: 300 }}>שאלות? בואו נדבר.</p>
        <div style={{ marginTop: 40, color: B.cadetBlue, fontSize: 15, fontFamily: `'${B.fontEn}', sans-serif`, opacity: 0.7 }}>Boardirector · SQLink Group</div>
      </div>
    </div>
  );
}

function renderSlide(slide, i, active) {
  const wrap = (node) => (
    <div key={i} style={{ position: "absolute", inset: 0, pointerEvents: active ? "auto" : "none", zIndex: active ? 2 : 1 }}>
      {node}
    </div>
  );
  switch (slide.type) {
    case "hero":
      return wrap(<HeroSlide active={active} />);
    case "map":
      return wrap(<MapSlide slide={slide} active={active} />);
    case "feature":
      return wrap(<FeatureSlide slide={slide} active={active} />);
    case "tasks":
      return wrap(<TasksSlide slide={slide} active={active} />);
    case "clients":
      return wrap(<ClientsSlide slide={slide} active={active} />);
    case "demo":
      return wrap(<DemoSlide active={active} />);
    case "closing":
      return wrap(<ClosingSlide active={active} />);
    default:
      return null;
  }
}

/* ─── App shell ─── */
export default function PresentationTeams() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback(
    (dir) => {
      if (isTransitioning) return;
      const next = dir === "forward" ? Math.min(current + 1, SLIDES.length - 1) : Math.max(current - 1, 0);
      if (next === current) return;
      setIsTransitioning(true);
      setCurrent(next);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [current, isTransitioning]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        navigate("forward");
      }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        navigate("backward");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  return (
    <div
      dir="rtl"
      onClick={() => navigate("forward")}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: B.white,
        fontFamily: `'${B.font}', 'SF Pro Display', -apple-system, sans-serif`,
        cursor: "pointer",
        userSelect: "none",
        color: B.bigStone,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes blinkCaret { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes typingDot { 0%, 80%, 100% { transform: translateY(0) scale(0.85); opacity: 0.4; } 40% { transform: translateY(-3px) scale(1.1); opacity: 1; } }
        @keyframes marqueeLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @property --ai-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes spinAngle { from { --ai-angle: 0deg; } to { --ai-angle: 360deg; } }
        .ai-rim, .ai-rim-glow { animation: spinAngle 3s linear infinite; }
        @supports not (background: conic-gradient(from var(--ai-angle, 0deg), red, blue)) {
          .ai-rim, .ai-rim-glow { animation: none; }
        }
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
      <div style={{ position: "fixed", bottom: 34, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 201 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrent(i);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            style={{
              width: current === i ? 24 : 7,
              height: 7,
              borderRadius: 4,
              background: current === i ? `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})` : B.athensGray,
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div style={{ position: "fixed", bottom: 34, left: 28, fontSize: 12, color: B.cadetBlue, zIndex: 201, direction: "ltr", opacity: 0.5, fontFamily: `'${B.fontEn}', sans-serif` }}>
        ← → to navigate
      </div>

      <div style={{ position: "fixed", bottom: 34, right: 28, fontSize: 12, color: B.cadetBlue, zIndex: 201, direction: "ltr", opacity: 0.6, fontFamily: `'${B.fontEn}', sans-serif` }}>
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>
    </div>
  );
}
