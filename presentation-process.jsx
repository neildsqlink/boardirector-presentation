import { useState, useEffect, useCallback, useRef } from "react";

// Resolve a public-folder path to the deployed base URL so assets work both
// at "/" (npm run dev) and under a sub-path (GitHub Pages).
const A = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ─── Brand Tokens (matches the Nimbus deck) ─── */
const B = {
  bigStone: "#172134",
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

/* ─── Slides – a 6–7 minute keynote: "מכלים – לתהליך" ─── */
const SLIDES = [
  // 1. HERO
  {
    id: "hero",
    type: "hero",
    eyebrow: "Boardirector",
    title: "בעולם שבו כל כלי מייעל שלב אחר –\nאיך מנהלים את התהליך כולו?",
    subtitle: "ניהול ועדות והחלטות בעידן הדיגיטלי",
    speaker: "בר לב",
    role: "Boardirector · SQLink Group",
    avatar: "/bar-lev.jpeg",
  },
  // 2. WHAT CHANGED – the tools list (then → now)
  {
    id: "changed",
    type: "transform-list",
    title: "מה השתנה בעשר שנים",
    intro: "בואו נחזור רגע עשר שנים אחורה – ונחשוב על כל מה שהשתנה בדרך שבה אנחנו עובדים.",
    pairs: [
      { icon: "video", label: "הישיבות", from: "חדר הישיבות", to: "זום" },
      { icon: "cloud", label: "החומרים", from: "הקלסר", to: "הענן" },
      { icon: "signature", label: "החתימות", from: "הנייר", to: "דיגיטל" },
      { icon: "folder", label: "מסמכים והרשאות", from: "ניהול ידני", to: "מערכות ייעודיות" },
      { icon: "check", label: "משימות", from: "פתקים ואקסל", to: "מערכות ניהול" },
      { icon: "robot", label: "דיונים", from: "סיכום ידני", to: "AI שמתמלל ומסכם" },
    ],
    footer: "היינו בטוחים שהעבודה תהיה פשוטה יותר – וברובה, זה בדיוק מה שקרה. כל כלי פתר בעיה אמיתית. אבל קרה עוד משהו.",
  },
  // 3. PIVOT – the problem space moved
  {
    id: "pivot",
    type: "statement",
    eyebrow: "הנקודה המרכזית",
    headline: "מרחב הבעיה זז.",
    lines: [
      "הוא כבר לא נמצא בתוך המשימות.",
      "הוא נמצא בשלבים שביניהן.",
    ],
    footer: "שיפרנו כמעט כל שלב בנפרד – עכשיו הפוקוס צריך לעבור לתהליך.",
  },
  // 5. QUOTE – Russell Ackoff
  {
    id: "quote",
    type: "quote",
    quote: "שיפור של כל חלק במערכת בנפרד – לא מבטיח שיפור של המערכת כולה.",
    author: "ראסל אקוף",
    authorRole: "חוקר מערכות",
    footer: "הדיגיטציה שיפרה כמעט כל משימה בפני עצמה. האתגר עבר להיות ניהול התהליך שמחבר ביניהן.",
  },
  // 5. THE MEETING LIFECYCLE – before / during / after
  {
    id: "lifecycle",
    type: "lifecycle",
    title: "ישיבה לא מתחילה סביב השולחן",
    subtitle: "היא מתחילה הרבה קודם – וממשיכה הרבה אחרי.",
    columns: [
      {
        tag: "לפני",
        color: "royalBlue",
        items: ["תוכנית עבודה שנתית", "איסוף חומרים", "בניית סדרי יום", "הפצה ועדכונים", "הרשאות לכל משתתף"],
      },
      {
        tag: "הישיבה",
        color: "orange",
        items: ["דיון", "החלטות"],
      },
      {
        tag: "אחרי",
        color: "teal",
        items: ["הפקת פרוטוקול", "העברה להערות", "נעילה וחתימה", "החלטות → משימות", "מעקב ביצוע"],
      },
    ],
    footer: "ובעוד שנתיים, כשישאלו איך ולמה התקבלה החלטה – צריך להראות את התמונה המלאה. לא רק את הפרוטוקול.",
  },
  // 8. AN EXCELLENT TOOL FOR EVERY STAGE
  {
    id: "tools",
    type: "tools-grid",
    title: "כלי מצוין לכל שלב",
    subtitle: "מסתכלים על כל שלב בנפרד – וכמעט תמיד מוצאים כלי מצוין.",
    tools: [
      { icon: "folder", title: "ניהול מסמכים", color: "royalBlue" },
      { icon: "signature", title: "חתימות והצבעות", color: "orange" },
      { icon: "robot", title: "AI לסיכום דיונים", color: "teal" },
      { icon: "check", title: "ניהול משימות", color: "royalBlue" },
    ],
    footer: "כל מערכת עושה את שלה – אבל זה תהליך, לא אוסף משימות. האחריות נשארת אצל הארגון, אבל השליטה מתפזרת.",
  },
  // 7. FAILURES HAPPEN IN THE TRANSITIONS
  {
    id: "transitions",
    type: "transitions",
    title: "הכשלים קורים במעברים",
    subtitle: "כמעט אף פעם לא בתוך שלב – אלא במה שמחבר ביניהם.",
    examples: [
      { icon: "alert", text: "גרסה לא עדכנית – שהופצה" },
      { icon: "shield", text: "מסמך שלא ברור מי רשאי לראות" },
      { icon: "target", text: "החלטה שאושרה – אבל לא הפכה למשימה" },
    ],
    footer: "לא כי מישהו טעה. אלא כי אין גורם אחד שמאגד את התמונה כולה.",
  },
  // 11. WHEN THE AUDIT COMES
  {
    id: "audit",
    type: "audit",
    title: "וכשמגיעה ביקורת",
    subtitle: "השאלה כבר לא רק מה הוחלט –",
    questions: [
      { q: "איך?", desc: "התקבלה ההחלטה" },
      { q: "מי?", desc: "היה מעורב בדרך" },
      { q: "איך יושם?", desc: "לאורך כל הדרך" },
    ],
    footer: "ודווקא את זה – הכי קשה לשחזר.",
  },
  // 9. BRAND REVEAL
  {
    id: "brand",
    type: "brand-reveal",
    eyebrow: "וזאת בדיוק התפיסה שממנה בנינו את",
    brand: "Boardirector",
    lines: [
      "לא שאלנו איך בונים עוד כלי טוב לניהול ישיבות, מסמכים או משימות.",
      "שאלנו איך מנהלים את מחזור החיים המלא של החלטה.",
    ],
    transition: "ואיך זה נראה בפועל?",
  },
  // 10. IN PRACTICE — before the meeting (same title/subtitle, screen changes)
  {
    id: "practice-before",
    type: "practice-step",
    step: 1,
    title: "ואיך זה נראה בפועל?",
    subtitle: "מחזור החיים המלא של החלטה – רציף, מתועד ומפוקח. מהתכנון, דרך הדיון, ועד המעקב.",
    tag: "לפני הישיבה",
    color: "royalBlue",
    shot: A("/screenshots/committees.png"),
    stepTitle: "הכול מתחיל בתכנון",
    text: "תוכנית העבודה השנתית של הוועדה במערכת, וממנה נגזרים סדרי היום והזימונים. החומרים נאספים, מופצים ומתעדכנים במקום אחד – וההרשאות מבטיחות שכל משתתף רואה רק את מה שמותר לו, גם בניגוד עניינים.",
  },
  // 11. IN PRACTICE — during the meeting
  {
    id: "practice-during",
    type: "practice-step",
    step: 2,
    title: "ואיך זה נראה בפועל?",
    subtitle: "מחזור החיים המלא של החלטה – רציף, מתועד ומפוקח. מהתכנון, דרך הדיון, ועד המעקב.",
    tag: "במהלך הישיבה",
    color: "orange",
    shot: A("/screenshots/meeting-page.png"),
    stepTitle: "הכול מתועד ברצף אחד",
    text: "הדיון, ההצבעות וההחלטות מתועדים כחלק מאותו רצף עבודה. הפרוטוקול נבנה מתוך הדיון עצמו, עובר לאישור, ננעל ונחתם דיגיטלית.",
  },
  // 12. IN PRACTICE — after the meeting
  {
    id: "practice-after",
    type: "practice-step",
    step: 3,
    title: "ואיך זה נראה בפועל?",
    subtitle: "מחזור החיים המלא של החלטה – רציף, מתועד ומפוקח. מהתכנון, דרך הדיון, ועד המעקב.",
    tag: "אחרי הישיבה",
    color: "teal",
    shot: A("/screenshots/decision-tracker.png"),
    stepTitle: "מהחלטה למשימה",
    text: "ההחלטות לא נשארות בפרוטוקול – הן הופכות למשימות עם אחראי, לוחות זמנים ומעקב. בכל רגע רואים מה הושלם, מה בטיפול, ומה עדיין פתוח.",
  },
  // 16. CLOSING THOUGHT
  {
    id: "thought",
    type: "two-questions",
    eyebrow: "מחשבה אחת להשאיר אתכם איתה",
    intro: "בפעם הבאה שאתם בוחנים את תהליך קבלת ההחלטות בארגון שלכם –",
    dim: "אל תשאלו רק: האם יש כלי לכל שלב?",
    bright: "תשאלו: מי מנהל את התהליך שמחבר ביניהם?",
  },
  // 17. FINAL
  {
    id: "final",
    type: "final",
    lines: ["ניהול ועדות והחלטות", "הוא לא אוסף של כלים.", "הוא תהליך אחד."],
    thanks: "תודה",
    speaker: "בר לב · Boardirector",
    contact: { email: "barlev@sqlink.com", site: "boardirector.co.il" },
  },
];

const ACCENTS = {
  hero: "royalBlue",
  changed: "royalBlue",
  wins: "teal",
  pivot: "orange",
  quote: "royalBlue",
  challenge: "orange",
  lifecycle: "royalBlue",
  tools: "teal",
  process: "red",
  transitions: "orange",
  audit: "red",
  evolution: "royalBlue",
  system: "teal",
  brand: "royalBlue",
  chain: "teal",
  "practice-before": "royalBlue",
  "practice-during": "orange",
  "practice-after": "teal",
  thought: "orange",
  final: "royalBlue",
};

const CIRCLE_POS = {
  hero: { top: "-130px", right: "-130px", left: "auto" },
  changed: { top: "-120px", left: "-120px", right: "auto" },
  wins: { bottom: "-170px", right: "-170px", left: "auto", top: "auto" },
  pivot: { top: "-140px", right: "-140px", left: "auto" },
  quote: { top: "-130px", left: "-130px", right: "auto" },
  challenge: { bottom: "-180px", right: "-180px", left: "auto", top: "auto" },
  lifecycle: { top: "-120px", left: "-120px", right: "auto" },
  tools: { top: "-130px", right: "-130px", left: "auto" },
  process: { bottom: "-170px", left: "-170px", right: "auto", top: "auto" },
  transitions: { top: "-130px", right: "-130px", left: "auto" },
  audit: { top: "-120px", left: "-120px", right: "auto" },
  evolution: { bottom: "-180px", right: "-180px", left: "auto", top: "auto" },
  system: { top: "-140px", left: "-140px", right: "auto" },
  brand: { top: "-150px", right: "-150px", left: "auto" },
  chain: { bottom: "-180px", left: "-180px", right: "auto", top: "auto" },
  "practice-before": { top: "-120px", left: "-120px", right: "auto" },
  "practice-during": { top: "-120px", right: "-120px", left: "auto" },
  "practice-after": { bottom: "-180px", left: "-180px", right: "auto", top: "auto" },
  thought: { top: "-130px", right: "-130px", left: "auto" },
  final: { top: "-150px", left: "-150px", right: "auto" },
};

const tone = (k) => B[k] || k;

/* ─── Helpers ─── */
function DecoCircle({ color, position, size = 420, opacity = 0.08 }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        ...position,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function ProgressBar({ current, total }) {
  return (
    <div data-export-hide="true" style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 100, background: "rgba(0,0,0,0.04)" }}>
      <div
        style={{
          height: "100%",
          width: `${((current + 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`,
          transition: "width 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

const BD_LOGO_PATH =
  "M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z";

function BDLogo({ size = 80, color = B.orange }) {
  const h = (size * 158) / 196;
  return (
    <svg width={size} height={h} viewBox="0 0 196 158" fill="none">
      <path d={BD_LOGO_PATH} fill={color} />
    </svg>
  );
}

function FooterBar() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        background: B.bigStone,
        display: "flex",
        alignItems: "center",
        zIndex: 100,
        padding: "0 30px",
      }}
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
        <BDLogo size={20} color={B.orange} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 2, fontWeight: 400 }}>
          Boardirector · From Tools to Process
        </span>
      </div>
      <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 2, fontWeight: 400 }}>
          A PRODUCT OF
        </span>
        <img src={A("/sqlink-white.png")} alt="SQLink" style={{ height: 18, width: "auto", display: "block", opacity: 0.9 }} />
      </div>
    </div>
  );
}

function SlideWrap({ active, children }) {
  return (
    <div
      data-slide-wrap="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(28px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: active ? "auto" : "none",
        padding: "40px 60px 88px 60px",
      }}
    >
      {children}
    </div>
  );
}

function StaggerText({ text, active, baseDelay = 200, style = {} }) {
  const lines = (text || "").split("\n");
  return (
    <div>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * 120}ms`,
            ...style,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/* Reusable centered title + subtitle */
function SlideHead({ title, subtitle, active, eyebrow }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 38 }}>
      {eyebrow && (
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 5, color: B.orange, marginBottom: 16, textTransform: "uppercase", fontFamily: `'${B.fontEn}', sans-serif`, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 150ms" }}>
          {eyebrow}
        </div>
      )}
      <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, marginBottom: subtitle ? 14 : 0, lineHeight: 1.25, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 250ms" }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, maxWidth: 760, margin: "0 auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 380ms" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function ParticleField({ count = 14, color = B.royalBlue }) {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: 4 + Math.random() * 8,
      delay: Math.random() * 4,
      dur: 5 + Math.random() * 4,
    }))
  ).current;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.d,
            height: p.d,
            borderRadius: "50%",
            background: color,
            opacity: 0.15,
            animation: `particleFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Flat icon library ─── */
function FlatIcon({ name, size = 22, color = "currentColor", strokeWidth = 1.75 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "document":
      return (<svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h8M8 9h2" /></svg>);
    case "envelope":
      return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></svg>);
    case "chart":
      return (<svg {...p}><path d="M3 3v18h18" /><rect x="7" y="13" width="3" height="6" /><rect x="12" y="9" width="3" height="10" /><rect x="17" y="5" width="3" height="14" /></svg>);
    case "folder":
      return (<svg {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>);
    case "scale":
      return (<svg {...p}><path d="M12 4v17" /><path d="M8 21h8" /><path d="M4 7h16" /><path d="M5 7l-2.5 5a3 3 0 0 0 5 0L5 7z" /><path d="M19 7l-2.5 5a3 3 0 0 0 5 0L19 7z" /></svg>);
    case "newspaper":
      return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h7" /></svg>);
    case "building":
      return (<svg {...p}><path d="M3 21h18" /><path d="M5 21V9l7-4 7 4v12" /><path d="M9 21v-5h6v5" /><path d="M9 12h.01M15 12h.01" /></svg>);
    case "calendar":
      return (<svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><path d="M8 14h2M14 14h2M8 18h2" /></svg>);
    case "pencil":
      return (<svg {...p}><path d="M16 3l5 5-12 12H4v-5z" /><path d="M13 6l5 5" /></svg>);
    case "target":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill={color} stroke="none" /></svg>);
    case "check":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></svg>);
    case "user":
      return (<svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
    case "search":
      return (<svg {...p}><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>);
    case "robot":
      return (<svg {...p}><rect x="4" y="8" width="16" height="12" rx="3" /><circle cx="9" cy="14" r="1.4" fill={color} stroke="none" /><circle cx="15" cy="14" r="1.4" fill={color} stroke="none" /><path d="M12 4v4M9 4h6" /><path d="M2 13v3M22 13v3" /></svg>);
    case "shield":
      return (<svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6z" /></svg>);
    case "globe":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9" /><path d="M12 3a14 14 0 0 0-4 9 14 14 0 0 0 4 9" /></svg>);
    case "mail":
      return (<svg {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 8l9 6 9-6" /></svg>);
    case "lightning":
      return (<svg {...p}><path d="M13 2L4 14h6l-2 8 9-12h-6z" /></svg>);
    case "video":
      return (<svg {...p}><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3z" /></svg>);
    case "cloud":
      return (<svg {...p}><path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 18 18z" /></svg>);
    case "signature":
      return (<svg {...p}><path d="M3 17c2 0 3-8 5-8s1 6 3 6 2-9 4-9 2 7 3.5 7" /><path d="M3 21h18" /></svg>);
    case "alert":
      return (<svg {...p}><path d="M12 3l9 16H3z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>);
    case "scatter":
      return (<svg {...p}><circle cx="6" cy="7" r="1.6" fill={color} stroke="none" /><circle cx="17" cy="6" r="1.6" fill={color} stroke="none" /><circle cx="12" cy="13" r="1.6" fill={color} stroke="none" /><circle cx="6" cy="17" r="1.6" fill={color} stroke="none" /><circle cx="18" cy="17" r="1.6" fill={color} stroke="none" /></svg>);
    case "link":
      return (<svg {...p}><path d="M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1" /><path d="M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1" /></svg>);
    case "clock":
      return (<svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    default:
      return null;
  }
}

/* ─── MAIN ─── */
export default function PresentationProcess() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [started] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayInterval = 7000;

  const navigate = useCallback(
    (dir) => {
      if (isTransitioning) return;
      const next = dir === "forward" ? current + 1 : current - 1;
      if (next < 0 || next >= SLIDES.length) return;
      setIsTransitioning(true);
      setCurrent(next);
      setTimeout(() => setIsTransitioning(false), 600);
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
      if (e.key === "p" || e.key === "P") setAutoPlay((a) => !a);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      setCurrent((p) => {
        if (p >= SLIDES.length - 1) {
          setAutoPlay(false);
          return p;
        }
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return p + 1;
      });
    }, autoPlayInterval);
    return () => clearInterval(t);
  }, [autoPlay]);

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

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes aiPulse { 0% { transform: scale(0.85); opacity: 0.65; } 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes particleFloat { 0%, 100% { transform: translate(0, 0); opacity: 0.15; } 50% { transform: translate(8px, -14px); opacity: 0.35; } }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes dashFlow { to { stroke-dashoffset: -28; } }
        @keyframes driftLeak { 0% { transform: translate(0,0) scale(0.7); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(var(--lx,-50px), var(--ly,30px)) rotate(var(--lr,-20deg)) scale(0.9); opacity: 0; } }
        ::selection { background: rgba(254,117,1,0.2); }
      `}</style>

      <ProgressBar current={current} total={SLIDES.length} />

      {autoPlay && (
        <div style={{ position: "fixed", top: 16, left: 16, zIndex: 9999, background: "rgba(88,119,230,0.9)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: `'${B.fontEn}', sans-serif`, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "breathe 1.5s ease infinite" }} />
          AUTO-PLAY
        </div>
      )}

      {/* SLIDES */}
      <div style={{ position: "absolute", inset: 0 }}>
        {SLIDES.map((slide, i) => {
          const active = current === i;
          const accent = tone(ACCENTS[slide.id] || "royalBlue");
          const circlePos = CIRCLE_POS[slide.id] || { top: "-120px", right: "-120px", left: "auto" };
          return renderSlide(slide, i, active, accent, circlePos);
        })}
      </div>

      {/* NAV DOTS */}
      <div data-export-hide="true" style={{ position: "fixed", bottom: 62, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7, zIndex: 101 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (!isTransitioning) {
                setCurrent(i);
                setIsTransitioning(true);
                setTimeout(() => setIsTransitioning(false), 600);
              }
            }}
            style={{
              width: current === i ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: current === i ? `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})` : B.athensGray,
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div data-export-hide="true" style={{ position: "fixed", bottom: 64, left: 30, fontSize: 12, color: B.cadetBlue, zIndex: 101, direction: "ltr", opacity: 0.5 }}>
        ← → · P for autoplay
      </div>

      <div data-export-hide="true" style={{ position: "fixed", bottom: 64, right: 30, fontSize: 12, color: B.cadetBlue, zIndex: 101, fontFamily: `'${B.fontEn}', sans-serif`, opacity: 0.6 }}>
        {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
      </div>

      <FooterBar />
    </div>
  );
}

/* ─── Slide router ─── */
function renderSlide(slide, idx, active, accent, circlePos) {
  const common = { slide, active, accent, circlePos };
  const k = slide.id;
  switch (slide.type) {
    case "hero": return <Hero key={k} {...common} />;
    case "transform-list": return <TransformList key={k} {...common} />;
    case "wins": return <Wins key={k} {...common} />;
    case "statement": return <Statement key={k} {...common} />;
    case "quote": return <Quote key={k} {...common} />;
    case "before-after": return <BeforeAfter key={k} {...common} />;
    case "lifecycle": return <Lifecycle key={k} {...common} />;
    case "tools-grid": return <ToolsGrid key={k} {...common} />;
    case "split-contrast": return <SplitContrast key={k} {...common} />;
    case "transitions": return <Transitions key={k} {...common} />;
    case "audit": return <Audit key={k} {...common} />;
    case "evolution": return <Evolution key={k} {...common} />;
    case "approach": return <Approach key={k} {...common} />;
    case "brand-reveal": return <BrandReveal key={k} {...common} />;
    case "practice-step": return <PracticeStep key={k} {...common} />;
    case "chain": return <Chain key={k} {...common} />;
    case "two-questions": return <TwoQuestions key={k} {...common} />;
    case "final": return <Final key={k} {...common} />;
    default: return null;
  }
}

/* ─── 1. HERO ─── */
function Hero({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-180px", left: "-180px", right: "auto", top: "auto" }} size={380} opacity={0.06} />
      <ParticleField count={12} color={accent} />
      <div style={{ textAlign: "center", zIndex: 2, maxWidth: 940 }}>
        <div style={{ marginBottom: 26 }}><BDLogo size={88} /></div>
        <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: 8, color: B.gullGray, marginBottom: 22, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms", textTransform: "uppercase", fontFamily: `'${B.fontEn}', sans-serif` }}>
          {slide.eyebrow}
        </div>
        <div style={{ fontSize: "clamp(28px, 4.8vw, 54px)", fontWeight: 900, lineHeight: 1.25, color: B.bigStone, marginBottom: 24, whiteSpace: "pre-line", maxWidth: 900, marginInline: "auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.title}
        </div>
        <StaggerText
          text={slide.subtitle}
          active={active}
          baseDelay={600}
          style={{ fontSize: "clamp(16px, 2.4vw, 22px)", fontWeight: 300, lineHeight: 1.6, color: B.gullGray }}
        />
        <div style={{ marginTop: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 950ms" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", boxShadow: `0 4px 14px rgba(23,33,52,0.18), 0 0 0 2px ${B.white}, 0 0 0 4px ${B.orange}30`, flexShrink: 0 }}>
            <img src={A(slide.avatar || "/avatar-neil.png")} alt={slide.speaker} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.bigStone }}>{slide.speaker}</div>
            <div style={{ fontSize: 12, color: B.gullGray, fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 0.5 }}>{slide.role}</div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 2. TRANSFORM LIST (then → now) ─── */
function TransformList({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 940, width: "100%" }}>
        <div style={{ fontSize: "clamp(26px, 4.2vw, 40px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 12, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, textAlign: "center", marginBottom: 32, maxWidth: 720, marginInline: "auto", opacity: active ? 1 : 0, transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 380ms" }}>
          {slide.intro}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {slide.pairs.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 10px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 110}ms` }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FlatIcon name={it.icon} size={21} color={accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: B.bigStone, marginBottom: 3 }}>{it.label}</div>
                <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                  <span style={{ color: B.cadetBlue, textDecoration: "line-through", textDecorationColor: `${B.red}80` }}>{it.from}</span>
                  <span style={{ color: B.gullGray, fontSize: 14 }}>←</span>
                  <span style={{ color: B.green, fontWeight: 600 }}>{it.to}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: "center", fontSize: "clamp(14px, 1.9vw, 19px)", fontWeight: 500, color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1250ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 3. WINS ─── */
function Wins({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 980, width: "100%" }}>
        <SlideHead title={slide.title} subtitle={slide.subtitle} active={active} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {slide.items.map((it, i) => (
            <div key={i} style={{ padding: "28px 18px", borderRadius: 18, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 4px 18px rgba(23,33,52,0.05)", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 140}ms`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FlatIcon name={it.icon} size={28} color={accent} />
              </div>
              <div style={{ fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 600, color: B.bigStone }}>{it.text}</div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: B.green, letterSpacing: 1 }}>קל יותר ✓</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 38, textAlign: "center", fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 700, color: B.orange, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1150ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 4. STATEMENT (big pivot) ─── */
function Statement({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.royalBlue} position={{ bottom: "-200px", left: "-200px", right: "auto", top: "auto" }} size={420} opacity={0.05} />
      <div style={{ zIndex: 2, maxWidth: 960, width: "100%", textAlign: "center" }}>
        {slide.eyebrow && (
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 5, color: B.orange, marginBottom: 26, textTransform: "uppercase", fontFamily: `'${B.fontEn}', sans-serif`, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 150ms" }}>
            {slide.eyebrow}
          </div>
        )}
        <div style={{ fontSize: "clamp(48px, 9vw, 96px)", fontWeight: 900, lineHeight: 1.02, marginBottom: 30, background: `linear-gradient(135deg, ${B.bigStone} 0%, ${B.royalBlue} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(28px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 320ms" }}>
          {slide.headline}
        </div>
        <StaggerText
          text={slide.lines.join("\n")}
          active={active}
          baseDelay={650}
          style={{ fontSize: "clamp(20px, 3.2vw, 32px)", fontWeight: 500, lineHeight: 1.5, color: B.bigStone }}
        />
        {slide.footer && (
          <div style={{ marginTop: 40, display: "inline-block", padding: "16px 28px", borderRadius: 14, background: B.bigStone, color: B.white, fontSize: "clamp(14px, 1.9vw, 19px)", fontWeight: 500, lineHeight: 1.5, maxWidth: 780, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(18px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1050ms" }}>
            {slide.footer}
          </div>
        )}
      </div>
    </SlideWrap>
  );
}

/* ─── 5. QUOTE ─── */
function Quote({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 920, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 120, lineHeight: 0.6, fontWeight: 900, color: `${accent}30`, fontFamily: `'${B.fontEn}', Georgia, serif`, marginBottom: 8, opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.7)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          „
        </div>
        <div style={{ fontSize: "clamp(28px, 4.8vw, 48px)", fontWeight: 700, lineHeight: 1.35, color: B.bigStone, marginBottom: 30, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.quote}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 700ms" }}>
          <div style={{ width: 40, height: 2, background: accent }} />
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: B.bigStone }}>{slide.author}</span>
            <span style={{ fontSize: 14, fontWeight: 400, color: B.gullGray, marginInlineStart: 8 }}>· {slide.authorRole}</span>
          </div>
          <div style={{ width: 40, height: 2, background: accent }} />
        </div>
        <div style={{ fontSize: "clamp(14px, 1.9vw, 19px)", fontWeight: 400, color: B.gullGray, lineHeight: 1.6, maxWidth: 760, margin: "0 auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 950ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 6. BEFORE / AFTER ─── */
function BeforeAfter({ slide, active, accent, circlePos }) {
  const cards = [
    { ...slide.before, c: B.cadetBlue, faded: true },
    { ...slide.after, c: accent, faded: false },
  ];
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1040, width: "100%" }}>
        <div style={{ fontSize: "clamp(26px, 4.2vw, 42px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 46, lineHeight: 1.25, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 20 }}>
          {cards.map((card, i) => (
            <div key={i} style={{ flex: card.faded ? "0 0 34%" : 1, padding: "30px 28px", borderRadius: 20, background: card.faded ? "#FAFBFC" : B.white, border: `1px solid ${card.faded ? B.athensGray : card.c + "40"}`, boxShadow: card.faded ? "none" : `0 12px 38px ${card.c}18`, opacity: active ? (card.faded ? 0.85 : 1) : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 220}ms`, position: "relative", overflow: "hidden", textAlign: "right" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 5, background: card.c }} />
              <div style={{ display: "inline-block", padding: "5px 16px", borderRadius: 999, background: `${card.c}14`, color: card.c, fontSize: 13, fontWeight: 800, letterSpacing: 1, marginBottom: 18 }}>
                {card.tag}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: B.gullGray, marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: card.faded ? "clamp(22px, 3vw, 30px)" : "clamp(20px, 2.6vw, 30px)", fontWeight: card.faded ? 800 : 700, color: B.bigStone, lineHeight: 1.4 }}>
                {card.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 7. LIFECYCLE (before / during / after) ─── */
function Lifecycle({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1180, width: "100%" }}>
        <SlideHead title={slide.title} subtitle={slide.subtitle} active={active} />
        <div style={{ display: "flex", alignItems: "stretch", gap: 14 }}>
          {slide.columns.map((col, ci) => {
            const c = tone(col.color);
            const isMeeting = ci === 1;
            return (
              <div key={ci} style={{ display: "flex", alignItems: "stretch", flex: isMeeting ? "0 0 auto" : 1 }}>
                <div style={{ flex: 1, minWidth: isMeeting ? 150 : 0, padding: "22px 20px", borderRadius: 18, background: isMeeting ? c : B.white, border: `1px solid ${isMeeting ? c : B.athensGray}`, boxShadow: isMeeting ? `0 12px 34px ${c}30` : "0 3px 14px rgba(23,33,52,0.05)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${450 + ci * 200}ms` }}>
                  <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 999, background: isMeeting ? "rgba(255,255,255,0.22)" : `${c}14`, color: isMeeting ? B.white : c, fontSize: 13, fontWeight: 800, letterSpacing: 1, marginBottom: 16 }}>
                    {col.tag}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {col.items.map((it, ii) => (
                      <div key={ii} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "clamp(12px, 1.4vw, 15px)", fontWeight: isMeeting ? 700 : 500, color: isMeeting ? B.white : B.bigStone }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isMeeting ? B.white : c, flexShrink: 0 }} />
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
                {ci < slide.columns.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 4px", fontSize: 24, color: B.cadetBlue, opacity: active ? 1 : 0, transition: `all 0.6s ease ${700 + ci * 200}ms` }}>
                    ←
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 30, padding: "16px 26px", borderRadius: 14, background: B.bigStone, color: B.white, textAlign: "center", fontSize: "clamp(13px, 1.7vw, 17px)", fontWeight: 500, lineHeight: 1.55, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(18px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1150ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 8. TOOLS GRID ─── */
function ToolsGrid({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1040, width: "100%" }}>
        <SlideHead title={slide.title} subtitle={slide.subtitle} active={active} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {slide.tools.map((t, i) => {
            const c = tone(t.color);
            return (
              <div key={i} style={{ padding: "30px 18px", borderRadius: 18, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 4px 18px rgba(23,33,52,0.05)", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 130}ms`, position: "relative" }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: `${c}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <FlatIcon name={t.icon} size={30} color={c} />
                </div>
                <div style={{ fontSize: "clamp(14px, 1.7vw, 17px)", fontWeight: 700, color: B.bigStone, marginBottom: 10 }}>{t.title}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: B.green }}>
                  <FlatIcon name="check" size={13} color={B.green} /> עושה את העבודה
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 36, textAlign: "center", fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 500, color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1100ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 9. SPLIT CONTRAST (responsibility / control) ─── */
function SplitContrast({ slide, active, accent, circlePos }) {
  const blocks = [
    { ...slide.good },
    { ...slide.bad },
  ];
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: B.bigStone, marginBottom: 14, lineHeight: 1.25, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 300, color: B.gullGray, marginBottom: 44, opacity: active ? 1 : 0, transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 380ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", gap: 22, justifyContent: "center" }}>
          {blocks.map((bl, i) => {
            const c = tone(bl.color);
            return (
              <div key={i} style={{ flex: 1, maxWidth: 420, padding: "34px 28px", borderRadius: 20, background: B.white, border: `2px solid ${c}30`, boxShadow: `0 12px 38px ${c}14`, opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 230}ms` }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `${c}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <FlatIcon name={bl.icon} size={32} color={c} />
                </div>
                <div style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 800, color: B.bigStone, marginBottom: 6 }}>{bl.label}</div>
                <div style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 600, color: c }}>{bl.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 10. TRANSITIONS (failures in the gaps) ─── */
function Transitions({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 920, width: "100%" }}>
        <SlideHead title={slide.title} subtitle={slide.subtitle} active={active} />
        {/* Visual: tool blocks with a "gap" where things fall through */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {slide.examples.map((ex, i) => (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 14, background: B.white, border: `1px dashed ${B.red}45`, boxShadow: "0 2px 10px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 160}ms` }}>
              {/* gap markers – two tool edges with a break between */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <div style={{ width: 16, height: 32, borderRadius: 5, background: `${B.royalBlue}22` }} />
                <div style={{ width: 28, height: 2, borderTop: `2px dashed ${B.red}`, background: "transparent" }} />
                <div style={{ width: 16, height: 32, borderRadius: 5, background: `${B.teal}22` }} />
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${B.red}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FlatIcon name={ex.icon} size={22} color={B.red} />
              </div>
              <div style={{ fontSize: "clamp(15px, 1.9vw, 20px)", fontWeight: 600, color: B.bigStone, flex: 1 }}>{ex.text}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: B.red, letterSpacing: 1, padding: "4px 10px", borderRadius: 8, background: `${B.red}10` }}>נופל בין הכיסאות</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30, textAlign: "center", fontSize: "clamp(14px, 1.9vw, 19px)", fontWeight: 600, color: B.bigStone, lineHeight: 1.5, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1100ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 11. AUDIT ─── */
function Audit({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 12, display: "inline-flex", width: "100%", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlatIcon name="scale" size={26} color={accent} />
            </div>
            <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone }}>{slide.title}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 400, color: B.gullGray, marginBottom: 42, opacity: active ? 1 : 0, transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 380ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {slide.questions.map((q, i) => (
            <div key={i} style={{ padding: "30px 22px", borderRadius: 18, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 4px 18px rgba(23,33,52,0.05)", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 180}ms`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
              <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: accent, marginBottom: 8 }}>{q.q}</div>
              <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 400, color: B.gullGray }}>{q.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 38, textAlign: "center", fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 700, background: `linear-gradient(90deg, ${B.red}, ${B.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1150ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 12. EVOLUTION (3-step progression) ─── */
function Evolution({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1120, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 48, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {slide.steps.map((s, i) => {
            const c = tone(s.color);
            const last = i === slide.steps.length - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, padding: "30px 22px", borderRadius: 20, background: last ? B.white : "#FAFBFC", border: `${last ? 2 : 1}px solid ${last ? c + "55" : B.athensGray}`, boxShadow: last ? `0 14px 40px ${c}1F` : "none", textAlign: "center", opacity: active ? (last ? 1 : 0.9) : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${450 + i * 230}ms` }}>
                  <div style={{ display: "inline-block", padding: "5px 16px", borderRadius: 999, background: `${c}14`, color: c, fontSize: 12.5, fontWeight: 800, letterSpacing: 0.5, marginBottom: 14 }}>
                    {s.era}
                  </div>
                  <div style={{ fontSize: last ? "clamp(18px, 2.4vw, 25px)" : "clamp(15px, 2vw, 20px)", fontWeight: last ? 800 : 600, color: B.bigStone, lineHeight: 1.35 }}>
                    {s.text}
                  </div>
                </div>
                {!last && (
                  <div style={{ flexShrink: 0, padding: "0 6px", fontSize: 28, color: B.cadetBlue, opacity: active ? 1 : 0, transition: `all 0.6s ease ${650 + i * 230}ms` }}>←</div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 40, textAlign: "center", fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 700, color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1200ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 13. APPROACH (system, not tool) ─── */
function Approach({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-200px", left: "-200px", right: "auto", top: "auto" }} size={420} opacity={0.06} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 5, color: B.orange, marginBottom: 24, textTransform: "uppercase", fontFamily: `'${B.fontEn}', sans-serif`, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.eyebrow}
        </div>
        <StaggerText text={slide.title} active={active} baseDelay={380} style={{ fontSize: "clamp(26px, 4.6vw, 46px)", fontWeight: 800, lineHeight: 1.3, color: B.bigStone, marginBottom: 24 }} />
        <div style={{ fontSize: "clamp(16px, 2.2vw, 21px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, maxWidth: 700, margin: "0 auto 40px", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 720ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 760, margin: "0 auto" }}>
          {slide.pills.map((p, i) => {
            const primary = i === 0;
            return (
              <div key={i} style={{ padding: "12px 28px", borderRadius: 999, background: primary ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})` : B.white, border: primary ? "none" : `1px solid ${B.athensGray}`, color: primary ? B.white : B.bigStone, fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 700, boxShadow: primary ? `0 8px 22px ${B.orange}40` : "0 2px 8px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${880 + i * 100}ms` }}>
                {p}
              </div>
            );
          })}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 14. BRAND REVEAL ─── */
function BrandReveal({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-200px", left: "-200px", right: "auto", top: "auto" }} size={400} opacity={0.07} />
      <ParticleField count={12} color={accent} />
      <div style={{ zIndex: 2, maxWidth: 980, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 400, color: B.gullGray, marginBottom: 22, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.eyebrow}
        </div>
        <div style={{ marginBottom: 14 }}>
          <img src={A("/bd-logo-full.svg")} alt="Boardirector" style={{ height: "clamp(72px, 12vw, 120px)", width: "auto", display: "inline-block", opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.88)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }} />
        </div>
        <div style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 900, lineHeight: 1, marginBottom: 34, background: `linear-gradient(135deg, ${B.orange} 0%, ${B.royalBlue} 100%)`, backgroundSize: "200% auto", animation: active ? "shimmer 5s linear infinite" : "none", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(24px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 480ms" }}>
          {slide.brand}
        </div>
        <StaggerText
          text={slide.lines.join("\n")}
          active={active}
          baseDelay={780}
          style={{ fontSize: "clamp(16px, 2.3vw, 22px)", fontWeight: 400, lineHeight: 1.7, color: B.bigStone, maxWidth: 820, margin: "0 auto" }}
        />
        {slide.transition && (
          <div style={{ marginTop: 34, display: "inline-block", padding: "13px 30px", borderRadius: 999, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 700, boxShadow: `0 10px 28px ${B.orange}38`, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1200ms" }}>
            {slide.transition}
          </div>
        )}
      </div>
    </SlideWrap>
  );
}

/* ─── 10–12. PRACTICE STEP (constant title/subtitle, screen changes) ─── */
function PracticeStep({ slide, active, accent, circlePos }) {
  const c = tone(slide.color);
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1160, width: "100%" }}>
        {/* Constant header — same on all three slides */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: "clamp(22px, 3.4vw, 34px)", fontWeight: 800, color: B.bigStone, marginBottom: 7, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(12px, 1.5vw, 15px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.5, maxWidth: 760, margin: "0 auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 320ms" }}>
            {slide.subtitle}
          </div>
        </div>

        {/* Changing middle — phase caption */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 450ms" }}>
            <div style={{ padding: "5px 14px", borderRadius: 999, background: c, color: B.white, fontSize: 12.5, fontWeight: 800, letterSpacing: 0.3, boxShadow: `0 4px 12px ${c}50` }}>
              {slide.tag}
            </div>
            <div style={{ fontSize: "clamp(16px, 2vw, 21px)", fontWeight: 800, color: B.bigStone }}>{slide.stepTitle}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginInlineStart: 4 }}>
              {[1, 2, 3].map((n) => (
                <span key={n} style={{ width: n === slide.step ? 16 : 7, height: 7, borderRadius: 4, background: n === slide.step ? c : B.athensGray, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: "clamp(12px, 1.45vw, 15px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.55, maxWidth: 840, textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(12px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 600ms" }}>
            {slide.text}
          </div>
        </div>

        {/* Changing middle — the screen */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 16px 50px rgba(23,33,52,0.16), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0, maxWidth: "100%", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 700ms" }}>
            <img src={slide.shot} alt={slide.stepTitle} style={{ display: "block", maxHeight: "50vh", maxWidth: "100%", width: "auto", height: "auto" }} />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 15. CHAIN (full connected lifecycle) ─── */
function Chain({ slide, active, accent, circlePos }) {
  const c = accent;
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1180, width: "100%" }}>
        <SlideHead title={slide.title} subtitle={slide.subtitle} active={active} />
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 8 }}>
          {slide.stages.map((s, i) => {
            const last = i === slide.stages.length - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ padding: "13px 22px", borderRadius: 999, background: last ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})` : B.white, border: last ? "none" : `1.5px solid ${c}40`, color: last ? B.white : B.bigStone, fontSize: "clamp(13px, 1.6vw, 17px)", fontWeight: 700, boxShadow: last ? `0 8px 22px ${B.orange}40` : `0 3px 12px ${c}14`, whiteSpace: "nowrap", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${450 + i * 120}ms` }}>
                  {s}
                </div>
                {!last && (
                  <span style={{ fontSize: 18, color: c, fontWeight: 800, opacity: active ? 0.7 : 0, transition: `all 0.5s ease ${520 + i * 120}ms` }}>←</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 30, textAlign: "center", fontSize: "clamp(14px, 1.9vw, 19px)", fontWeight: 500, color: B.bigStone, lineHeight: 1.55, maxWidth: 820, marginInline: "auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1500ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 16. TWO QUESTIONS (closing thought) ─── */
function TwoQuestions({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 960, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 4, color: B.orange, marginBottom: 24, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.eyebrow}
        </div>
        <div style={{ fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 500, color: B.bigStone, lineHeight: 1.5, marginBottom: 44, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(18px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.intro}
        </div>
        {/* dim question (crossed out) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "18px 26px", borderRadius: 14, background: "#FAFBFC", border: `1px solid ${B.athensGray}`, marginBottom: 16, opacity: active ? 0.7 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 600ms" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${B.cadetBlue}20`, display: "flex", alignItems: "center", justifyContent: "center", color: B.cadetBlue, fontSize: 16, fontWeight: 800, flexShrink: 0 }}>✕</div>
          <div style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 500, color: B.gullGray }}>{slide.dim}</div>
        </div>
        {/* bright question */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "24px 28px", borderRadius: 16, background: B.white, border: `2px solid ${accent}45`, boxShadow: `0 14px 40px ${accent}1F`, opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 850ms" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontSize: 18, fontWeight: 800, flexShrink: 0 }}>?</div>
          <div style={{ fontSize: "clamp(18px, 2.8vw, 28px)", fontWeight: 800, color: B.bigStone }}>{slide.bright}</div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 17. FINAL ─── */
function Final({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-200px", right: "-200px", left: "auto", top: "auto" }} size={420} opacity={0.07} />
      <ParticleField count={14} color={accent} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: 30 }}><BDLogo size={70} /></div>
        <div style={{ marginBottom: 40 }}>
          {slide.lines.map((ln, i) => (
            <div
              key={i}
              style={{
                fontSize: "clamp(30px, 5.6vw, 60px)",
                fontWeight: 900,
                lineHeight: 1.18,
                color: i === slide.lines.length - 1 ? "transparent" : B.bigStone,
                background: i === slide.lines.length - 1 ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})` : "none",
                WebkitBackgroundClip: i === slide.lines.length - 1 ? "text" : "border-box",
                WebkitTextFillColor: i === slide.lines.length - 1 ? "transparent" : B.bigStone,
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 180}ms`,
              }}
            >
              {ln}
            </div>
          ))}
        </div>
        <div style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, color: B.bigStone, marginBottom: 28, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1000ms" }}>
          {slide.thanks}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 16, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1200ms", fontFamily: `'${B.fontEn}', sans-serif` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: B.bigStone, fontWeight: 500 }}>
            <FlatIcon name="mail" size={16} color={B.orange} />
            {slide.contact.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: B.bigStone, fontWeight: 500 }}>
            <FlatIcon name="globe" size={16} color={B.royalBlue} />
            {slide.contact.site}
          </div>
        </div>
        <div style={{ fontSize: 13, color: B.gullGray, opacity: active ? 1 : 0, transition: "all 0.7s ease 1350ms" }}>
          {slide.speaker}
        </div>
      </div>
    </SlideWrap>
  );
}
