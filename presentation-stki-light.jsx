import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  // 1. HERO
  {
    id: "hero",
    type: "hero",
    subtitle: "A Product of SQLink Group",
    title: "Boardirector",
    tagline: "הפלטפורמה המובילה לניהול הדירקטוריון, ההנהלה ומזכירות החברה בעידן הדיגיטלי",
    footnote: "יציבות של קבוצת טכנולוגיה גדולה עם חדשנות של מוצר SaaS ייעודי",
  },

  // 2. VISION (statement hidden for now)
  // {
  //   id: "vision",
  //   type: "statement",
  //   text: "החזון שלנו",
  //   subtitle:
  //     "להוביל את עולם הממשל התאגידי והרגולציה\nלסביבה דיגיטלית חכמה, המאפשרת ניהול\nאפקטיבי, שקוף ומאובטח.",
  // },
  {
    id: "vision-pillars",
    type: "features",
    title: "שלושת העמודים של Boardirector",
    features: [
      {
        icon: "⚙️",
        title: "אוטומציה מלאה",
        desc: "אוטומציה מלאה של עבודת מזכירות החברה",
      },
      {
        icon: "✅",
        title: "ציות ואכיפה",
        desc: "הגברת רמת הציות והאכיפה (Compliance) בארגון",
      },
      {
        icon: "🛡️",
        title: "אבטחה וניהול המידע",
        desc: "אחסון מאובטח וניהול חכם של כל המידע הארגוני הרגיש",
      },
    ],
  },

  // 3. WHY ENTERPRISE
  {
    id: "ch-why",
    type: "chapter",
    chapter: "01",
    title: "למה ארגוני Enterprise\nזקוקים ל-Boardirector?",
    subtitle: "האתגרים שמחייבים פתרון מקצועי",
  },
  {
    id: "pain-points",
    type: "features",
    title: "אתגרי הממשל התאגידי",
    features: [
      {
        icon: "⚖️",
        title: "חשיפה משפטית",
        desc: "קושי במעקב אחר החלטות וניהול פרוטוקולים ידני",
      },
      {
        icon: "🔒",
        title: "סיכוני סייבר",
        desc: "מידע רגיש שמופץ בערוצים לא מאובטחים (מיילים / וואטסאפ)",
      },
      {
        icon: "⏱️",
        title: "חוסר יעילות",
        desc: "בזבוז משאבים קריטיים על הכנת תיקי ישיבה באופן ידני",
      },
      {
        icon: "📂",
        title: "היעדר ריכוזיות",
        desc: "היעדר מקור אמת אחד (Single Source of Truth) למסמכי הדירקטוריון",
      },
    ],
  },

  // 4. MEETING LIFECYCLE
  {
    id: "ch-meetings",
    type: "chapter",
    chapter: "02",
    title: "ניהול מעגל החיים\nהמלא של הישיבה",
    subtitle: "מערכת Boardirector מספקת מענה מקצה לקצה",
  },
  {
    id: "meeting-lifecycle",
    type: "process",
    title: "מסדר יום ועד מעקב ביצוע",
    phases: [
      {
        icon: "📋",
        label: "Pre-Meeting",
        items: [
          "בניית סדר יום",
          "זימונים אוטומטיים",
          "הפצת חומרים בלחיצת כפתור",
        ],
      },
      {
        icon: "🎯",
        label: "In-Meeting",
        items: [
          "גישה מהירה למסמכים",
          "ניהול אישורים",
          "תיעוד בזמן אמת",
        ],
      },
      {
        icon: "📊",
        label: "Post-Meeting",
        items: [
          "כתיבת פרוטוקולים",
          "הפצת החלטות",
          "מעקב ביצוע משימות",
        ],
      },
    ],
  },

  // 4b. SCREENSHOT: MEETINGS
  {
    id: "screenshot-meetings",
    type: "screenshot",
    title: "ניהול ישיבות חכם",
    subtitle: "סביבת עבודה אינטואיטיבית לניהול מלא של מעגל החיים של הישיבה",
    src: "/screenshots/meetings.png",
    side: "left",
    aiFeature: {
      label: "AI Agenda Builder",
      title: "סדר יום חכם לפי סקטור",
      desc: "המערכת בונה סדר יום מותאם אוטומטית לפי סוג הארגון, הוועדה והרגולציה — כולל נושאי חובה, תדירויות ותבניות מוכנות לכל ענף.",
    },
  },

  // 4c. SCREENSHOT: MEETING BOOK
  {
    id: "screenshot-meeting-book",
    type: "screenshot",
    title: "Meeting Book",
    subtitle: "תיק ישיבה דיגיטלי מקצועי — כל החומרים, המסמכים וסדר היום במקום אחד",
    src: "/screenshots/meeting-book.png",
    side: "right",
    aiFeature: {
      label: "AI Meeting Assistant",
      title: "סוכן AI חכם לניתוח מסמכים",
      desc: "שאלו שאלות על כל מסמך בתיק הישיבה וקבלו תשובות מיידיות — ה-AI מנתח את כלל חומרי הישיבה ומציג תובנות, סיכומים והשוואות בזמן אמת.",
    },
  },

  // 5. SECRETARY REVOLUTION
  {
    id: "secretary",
    type: "features",
    title: "מהפכה בעבודת מזכירות החברה והיועמ\"ש",
    features: [
      {
        icon: "📚",
        title: "Board Books",
        desc: "הפקה אוטומטית של תיקי ישיבה מרובי מסמכים",
      },
      {
        icon: "🔍",
        title: "ארכיון חכם",
        desc: "חיפוש טקסטואלי מלא בכל הפרוטוקולים והמסמכים ההיסטוריים",
      },
      {
        icon: "🏛️",
        title: "ניהול ועדות",
        desc: "שליטה ובקרה על כל סוגי הוועדות בארגון במקום אחד",
      },
      {
        icon: "✍️",
        title: "סבבי חתימות",
        desc: "מנגנון מובנה לאישור פרוטוקולים וחתימה דיגיטלית",
      },
    ],
  },

  // 5b. SCREENSHOT: RESOURCES
  {
    id: "screenshot-resources",
    type: "screenshot",
    title: "מרכז המשאבים",
    subtitle: "ארכיון חכם וניהול מסמכים מרכזי עם חיפוש טקסטואלי מלא",
    src: "/screenshots/recources.png",
    side: "left",
  },

  // 6. UX & ACCESSIBILITY
  {
    id: "ch-ux",
    type: "chapter",
    chapter: "03",
    title: "נגישות מכל מקום",
    subtitle: "חוויית משתמש פרימיום",
  },
  {
    id: "ux-features",
    type: "features",
    title: "חוויית משתמש פרימיום",
    features: [
      {
        icon: "📱",
        title: "התאמה לכל מכשיר",
        desc: "ממשק אינטואיטיבי המותאם לטאבלט, מובייל ודסקטופ",
      },
      {
        icon: "✈️",
        title: "עבודה ב-Offline",
        desc: "צפייה במסמכים גם ללא חיבור לרשת (בטיסות / נסיעות)",
      },
      {
        icon: "📝",
        title: "הערות אישיות",
        desc: "כלי Annotations אישיים על גבי מסמכי הישיבה",
      },
      {
        icon: "📊",
        title: "Dashboard אישי",
        desc: "ריכוז משימות והחלטות לביצוע ב-Dashboard אישי",
      },
    ],
  },

  // 6b. SCREENSHOT: DASHBOARD
  {
    id: "screenshot-dashboard",
    type: "screenshot",
    title: "Dashboard אישי",
    subtitle: "תצוגה מרכזית של כל המשימות, ההחלטות והישיבות הקרובות",
    src: "/screenshots/dashboard.png",
    side: "right",
  },

  // 7. SECURITY
  {
    id: "ch-security",
    type: "chapter",
    chapter: "04",
    title: "המידע הכי רגיש בארגון\nבידיים בטוחות",
    subtitle: "אבטחת מידע — ה-DNA שלנו",
  },
  {
    id: "security-features",
    type: "features",
    title: "אבטחה ברמה הגבוהה ביותר",
    features: [
      {
        icon: "☁️",
        title: "ענן מאובטח",
        desc: "אירוח בענן מאובטח (SaaS) בתקינה המחמירה ביותר",
      },
      {
        icon: "🔑",
        title: "הרשאות פרטניות",
        desc: "ניהול הרשאות פרטני (Granular Access Control) ברמת מסמך",
      },
      {
        icon: "🛡️",
        title: "אימות דו-שלבי",
        desc: "מנגנוני אימות MFA והצפנה מקצה לקצה (End-to-End Encryption)",
      },
      {
        icon: "🏢",
        title: "הגב של SQLink",
        desc: "עמידה בסטנדרטים של גוף הטכנולוגיה המוביל בישראל",
      },
    ],
  },

  // 8. AI
  {
    id: "ch-ai",
    type: "chapter",
    chapter: "05",
    title: "בינה מלאכותית",
    subtitle: "AI שעובד בשבילכם",
  },
  {
    id: "ai-agenda",
    type: "ai-feature",
    icon: "🗓",
    title: "סדר יום חכם לפי סקטור",
    subtitle: "AI Agenda Builder",
    description: "המערכת מזהה את סוג הארגון, הוועדה והרגולציה הרלוונטית — ובונה סדר יום מותאם עם נושאים, תדירויות ודגשים ייחודיים לענף.",
    bullets: [
      "זיהוי אוטומטי של נושאים רגולטוריים חובה",
      "התאמת תבניות לפי סקטור — פיננסי, ציבורי, תעשייתי",
      "המלצות נושאים על בסיס היסטוריית דיונים",
    ],
  },
  {
    id: "ai-minutes",
    type: "ai-feature",
    icon: "📝",
    title: "סיכום פרוטוקול אוטומטי",
    subtitle: "AI Minutes Summary",
    description: "ה-AI מנתח את הפרוטוקול, מזהה החלטות מפתח, ויוצר סיכום מובנה — כולל הפקת החלטות ומשימות אוטומטית.",
    bullets: [
      "הפקת החלטות מתוך דיון — Generate Decisions with AI",
      "סיכום נושאים ותת-נושאים בפרוטוקול",
      "AI Assistant למסמכי Meeting Book — שאל שאלות על כל מסמך",
    ],
  },
  {
    id: "ai-tasks",
    type: "ai-feature",
    icon: "✅",
    title: "משימות מהחלטות — אוטומטית",
    subtitle: "AI Task Generation",
    description: "מכל החלטה שנרשמת בפרוטוקול — המערכת מציעה אוטומטית משימות עם שם, אחראי, תאריך יעד ותיאור.",
    bullets: [
      "Create Task with AI — מכל החלטה בפרוטוקול",
      "הצעת אחראים על בסיס הרכב הוועדה",
      "חיבור אוטומטי של משימה להחלטה, ועדה וישיבה",
    ],
  },

  // 9. SOCIAL PROOF
  {
    id: "customers",
    type: "customers",
    title: "הארגונים הגדולים בישראל כבר כאן",
    subtitle: "בשלות מוכחת במגזר הפיננסי, הציבורי והעסקי",
    newClients: [
      { name: "G-City", src: "/logos/gcity.png" },
      { name: "Clalit", src: "/logos/clalit.svg" },
      { name: "More", src: "/logos/more.svg" },
      { name: "Delek", src: "/logos/delek.png" },
      { name: "Wesure", src: "/logos/wesure.png" },
    ],
    logos: [
      { name: "בנק לאומי", src: "/logos/leumi.svg" },
      { name: "בנק דיסקונט", src: "/logos/discount.png" },
      { name: "Amdocs", src: "/logos/amdocs.png" },
      { name: "איילון", src: "/logos/ayalon.png" },
      { name: "אל על", src: "/logos/elal.png" },
      { name: "שטראוס", src: "/logos/strauss.png" },
      { name: "מגדל", src: "/logos/migdal.png" },
      { name: "תנובה", src: "/logos/tnuva.png" },
      { name: "אגד", src: "/logos/egged.svg" },
      { name: "הבנק הבינלאומי", src: "/logos/הבנק_הבינלאומי.svg 1.png" },
      { name: "בנק מזרחי טפחות", src: "/logos/לוגו_של_בנק_מזרחי-טפחות.svg 1.png" },
      { name: "מנורה מבטחים", src: "/logos/מנורה_מבטחים_לוגו.svg 1.png" },
      { name: "מיטב", src: "/logos/לוגו_מיטב_בית_השקעות.svg 1.png" },
      { name: "אקסלנס", src: "/logos/אקסלנס-לוגו-002 1.png" },
      { name: "אלטשולר שחם", src: "/logos/אלטשולר_שחם 1.png" },
      { name: "ישראכרט", src: "/logos/isracard-logo-print-1024x996 1.png" },
      { name: "Partner", src: "/logos/Partner_logo.svg 1.png" },
      { name: "פלאפון", src: "/logos/פלאפון-שירות-לקוחות-לוגו-757x1024 1.png" },
      { name: "Electra Power", src: "/logos/אלקטרה-פאוור-סופר-גז-חשמל 1.png" },
      { name: "GenCell", src: "/logos/images (4) 1.png" },
      { name: "Avgol", src: "/logos/428_main 1.png" },
      { name: "מליסרון", src: "/logos/מליסרון.svg 1.png" },
      { name: "שיכון ובינוי", src: "/logos/ShikunBinuy.svg 1.png" },
      { name: "עמיתים", src: "/logos/Amitim_Logo_Tagline_RGB-2 1.png" },
      { name: "Israel Canada", src: "/logos/logo-n 1.png" },
      { name: "אסותא", src: "/logos/assuta-2 1.png" },
      { name: "קבוצת עזריאלי", src: "/logos/AzrieliGroup.svg 1.png" },
      { name: "רמי לוי", src: "/logos/RAMILEVI 1.png" },
      { name: "שופרסל", src: "/logos/81149260100099640360no 1.png" },
      { name: "Medica", src: "/logos/לוגו-מדיקה 1.png" },
      { name: "Ilex Medical", src: "/logos/ilex-308x200 1.png" },
      { name: "בר אילן", src: "/logos/Bar_Ilan_logo 1.png" },
      { name: "קבוצת בן", src: "/logos/logo-header 1.png" },
      { name: "פז", src: "/logos/pet-logo--e1617786424211 1.png" },
      { name: "UMI", src: "/logos/images (3) 1.png" },
      { name: "Bezeq", src: "/logos/images (2) 1.png" },
    ],
  },

  // 9. CLOSING
  {
    id: "bottom-line",
    type: "bottom-line",
    title: "למה Boardirector?",
    subtitle: "השורה התחתונה",
    reasons: [
      {
        icon: "🎓",
        title: "מומחיות",
        desc: "שילוב בין הבנה רגולטורית עמוקה לטכנולוגיה עילית",
      },
      {
        icon: "🇮🇱",
        title: "לוקליזציה",
        desc: "התאמה מלאה לדין הישראלי ולצרכי השוק המקומי",
      },
      {
        icon: "📈",
        title: "ROI",
        desc: "שיפור איכות קבלת ההחלטות וצמצום משמעותי בחשיפה המשפטית",
      },
    ],
    cta: "בואו נדבר — נשמח להציג לכם את המערכת בפעולה",
  },
];

/* ─── Brand Tokens ─── */
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
  font: "Rubik",
  fontEn: "Inter",
};

/* ─── Circle accent colors per slide ─── */
const CIRCLE_COLORS = {
  hero: B.royalBlue,
  statement: B.orange,
  "vision-pillars": B.teal,
  "ch-why": B.orange,
  "pain-points": B.royalBlue,
  "ch-meetings": B.royalBlue,
  "meeting-lifecycle": B.teal,
  "screenshot-meetings": B.orange,
  "screenshot-meeting-book": B.royalBlue,
  secretary: B.teal,
  "screenshot-resources": B.orange,
  "ch-ux": B.teal,
  "ux-features": B.royalBlue,
  "screenshot-dashboard": B.teal,
  "ch-security": B.royalBlue,
  "security-features": B.orange,
  "ch-ai": B.orange,
  "ai-agenda": B.teal,
  "ai-minutes": B.royalBlue,
  "ai-tasks": B.orange,
  customers: B.royalBlue,
  "bottom-line": B.orange,
};

/* ─── Circle position per slide ─── */
const CIRCLE_POS = {
  hero: { top: "-120px", right: "-120px", left: "auto" },
  statement: { top: "-140px", left: "-140px", right: "auto" },
  "vision-pillars": { top: "-100px", right: "-100px", left: "auto" },
  "ch-why": { top: "-130px", right: "-130px", left: "auto" },
  "pain-points": { top: "-110px", left: "-110px", right: "auto" },
  "ch-meetings": { top: "-120px", left: "-120px", right: "auto" },
  "meeting-lifecycle": { top: "-100px", right: "-100px", left: "auto" },
  "screenshot-meetings": { top: "-120px", right: "-120px", left: "auto" },
  "screenshot-meeting-book": { top: "-130px", left: "-130px", right: "auto" },
  secretary: { top: "-100px", right: "-100px", left: "auto" },
  "screenshot-resources": { top: "-120px", left: "-120px", right: "auto" },
  "ch-ux": { top: "-120px", right: "-120px", left: "auto" },
  "ux-features": { top: "-110px", left: "-110px", right: "auto" },
  "screenshot-dashboard": { top: "-100px", right: "-100px", left: "auto" },
  "ch-security": { top: "-130px", left: "-130px", right: "auto" },
  "security-features": { top: "-100px", right: "-100px", left: "auto" },
  "ch-ai": { top: "-130px", right: "-130px", left: "auto" },
  "ai-agenda": { top: "-110px", left: "-110px", right: "auto" },
  "ai-minutes": { top: "-120px", right: "-120px", left: "auto" },
  "ai-tasks": { top: "-100px", left: "-100px", right: "auto" },
  customers: { top: "-120px", right: "-120px", left: "auto" },
  "bottom-line": { top: "-140px", left: "-140px", right: "auto" },
};

/* ─── Animated Counter ─── */
function Counter({ value, suffix, trigger }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1800;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(value * eased);
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [trigger, value]);

  const display = Number.isInteger(value)
    ? Math.round(count)
    : count.toFixed(count >= value ? 1 : 0);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* ─── Decorative Circle ─── */
function DecoCircle({ color, position }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: color,
        opacity: 0.08,
        ...position,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Progress Bar ─── */
function ProgressBar({ current, total }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 100,
        background: "rgba(0,0,0,0.04)",
      }}
    >
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

/* ─── Footer Bar ─── */
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
        justifyContent: "center",
        gap: 12,
        zIndex: 100,
        padding: "0 30px",
      }}
    >
      {/* BD Logo small */}
      <svg width="20" height="16" viewBox="0 0 196 158" fill="none">
        <path
          d="M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z"
          fill={B.orange}
        />
      </svg>
      <span
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          fontFamily: `'${B.fontEn}', sans-serif`,
          letterSpacing: 2,
          fontWeight: 400,
        }}
      >
        Boardirector by SQLink
      </span>
    </div>
  );
}

/* ─── Slide Wrapper ─── */
function SlideWrap({ active, children }) {
  return (
    <div
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

/* ─── Stagger Text Lines ─── */
function StaggerText({ text, active, baseDelay = 200, style = {} }) {
  const lines = text.split("\n");
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

/* ─── BD Logo SVG ─── */
function BDLogo({ size = 80, color = B.orange }) {
  const h = (size * 158) / 196;
  return (
    <svg width={size} height={h} viewBox="0 0 196 158" fill="none">
      <path
        d="M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z"
        fill={color}
      />
    </svg>
  );
}

/* ─── MAIN PRESENTATION ─── */
export default function PresentationSTKILight() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [started, setStarted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayInterval = 6000; // ms per slide

  const navigate = useCallback(
    (dir) => {
      if (isTransitioning) return;
      if (!started) {
        setStarted(true);
        return;
      }
      const next = dir === "forward" ? current + 1 : current - 1;
      if (next < 0 || next >= SLIDES.length) return;
      setIsTransitioning(true);
      setCurrent(next);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [current, isTransitioning, started]
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
      if (e.key === "p" || e.key === "P") {
        setAutoPlay((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  // Auto-play: advance slide every N seconds
  useEffect(() => {
    if (!autoPlay || !started) return;
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= SLIDES.length - 1) {
          setAutoPlay(false);
          return prev;
        }
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return prev + 1;
      });
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, started]);

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

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        ::selection { background: rgba(254,117,1,0.2); }
      `}</style>

      <ProgressBar current={started ? current : -1} total={SLIDES.length} />

      {/* Auto-play indicator */}
      {autoPlay && (
        <div style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          background: "rgba(88,119,230,0.9)",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: `'${B.fontEn}', sans-serif`,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s ease infinite" }} />
          AUTO-PLAY
        </div>
      )}

      {/* ─── INTRO SCREEN ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: started ? 0 : 1,
          transform: started ? "scale(1.05)" : "scale(1)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: started ? "none" : "auto",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        <DecoCircle
          color={B.orange}
          position={{ top: "-140px", right: "-140px", left: "auto" }}
        />
        <DecoCircle
          color={B.royalBlue}
          position={{ bottom: "-180px", left: "-180px", right: "auto", top: "auto" }}
        />
        <div style={{ animation: "fadeInUp 1s ease-out 0.2s both", zIndex: 2, marginBottom: 24 }}>
          <BDLogo size={90} />
        </div>
        <div
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 300,
            letterSpacing: "8px",
            color: B.gullGray,
            marginBottom: 20,
            animation: "fadeInUp 1s ease-out 0.4s both",
            textTransform: "uppercase",
            zIndex: 2,
            fontFamily: `'${B.fontEn}', sans-serif`,
          }}
        >
          Boardirector
        </div>
        <div
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.3,
            textAlign: "center",
            animation: "fadeInUp 1s ease-out 0.6s both",
            zIndex: 2,
            maxWidth: 700,
            color: B.bigStone,
          }}
        >
          ניהול חכם ומאובטח{"\n"}של הממשל התאגידי
        </div>
        <div
          style={{
            fontSize: "clamp(13px, 1.5vw, 16px)",
            fontWeight: 300,
            color: B.gullGray,
            marginTop: 20,
            animation: "fadeInUp 1s ease-out 0.8s both",
            zIndex: 2,
            fontFamily: `'${B.fontEn}', sans-serif`,
            letterSpacing: 2,
          }}
        >
          A Product of SQLink Group
        </div>
        <div
          style={{
            fontSize: "clamp(14px, 2vw, 20px)",
            fontWeight: 300,
            color: B.cadetBlue,
            marginTop: 50,
            animation: "breathe 2.5s ease-in-out infinite",
            zIndex: 2,
          }}
        >
          לחצו להתחיל ←
        </div>
      </div>

      {/* ─── SLIDE CONTAINER ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: started ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
        }}
      >
        {SLIDES.map((slide, i) => {
          const active = current === i && started;
          const circleColor = CIRCLE_COLORS[slide.id] || B.royalBlue;
          const circlePos = CIRCLE_POS[slide.id] || { top: "-120px", right: "-120px", left: "auto" };

          /* ─── HERO ─── */
          if (slide.type === "hero") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 900 }}>
                  <div style={{ marginBottom: 20 }}>
                    <BDLogo size={70} />
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 15px)",
                      fontWeight: 400,
                      color: B.gullGray,
                      letterSpacing: "4px",
                      marginBottom: 16,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                      fontFamily: `'${B.fontEn}', sans-serif`,
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(48px, 10vw, 100px)",
                      fontWeight: 900,
                      lineHeight: 1,
                      marginBottom: 24,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(30px)",
                      transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                      background: `linear-gradient(135deg, ${B.bigStone} 30%, ${B.royalBlue} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: `'${B.fontEn}', sans-serif`,
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2.2vw, 22px)",
                      fontWeight: 300,
                      color: B.gullGray,
                      maxWidth: 650,
                      margin: "0 auto",
                      lineHeight: 1.6,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                    }}
                  >
                    {slide.tagline}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: B.cadetBlue,
                      marginTop: 40,
                      opacity: active ? 1 : 0,
                      transition: "all 0.7s ease 1000ms",
                      fontWeight: 300,
                    }}
                  >
                    {slide.footnote}
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── STATEMENT ─── */
          if (slide.type === "statement") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800 }}>
                  <div
                    style={{
                      fontSize: "clamp(36px, 6vw, 64px)",
                      fontWeight: 800,
                      marginBottom: 30,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                      background: `linear-gradient(135deg, ${B.orange} 0%, ${B.royalBlue} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.text}
                  </div>
                  <StaggerText
                    text={slide.subtitle}
                    active={active}
                    baseDelay={500}
                    style={{
                      fontSize: "clamp(18px, 3vw, 28px)",
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: B.gullGray,
                    }}
                  />
                </div>
              </SlideWrap>
            );
          }

          /* ─── CHAPTER ─── */
          if (slide.type === "chapter") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800, position: "relative" }}>
                  {/* Big chapter number in background */}
                  <div
                    style={{
                      fontSize: "clamp(120px, 25vw, 260px)",
                      fontWeight: 900,
                      color: B.athensGray,
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -55%)",
                      opacity: 0.5,
                      lineHeight: 1,
                      fontFamily: `'${B.fontEn}', sans-serif`,
                      pointerEvents: "none",
                    }}
                  >
                    {slide.chapter}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: 4,
                      color: B.orange,
                      marginBottom: 30,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                      position: "relative",
                    }}
                  >
                    פרק {slide.chapter}
                  </div>
                  <div style={{ position: "relative" }}>
                    <StaggerText
                      text={slide.title}
                      active={active}
                      baseDelay={400}
                      style={{
                        fontSize: "clamp(32px, 6vw, 64px)",
                        fontWeight: 800,
                        lineHeight: 1.15,
                        color: B.bigStone,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2.5vw, 22px)",
                      fontWeight: 300,
                      color: B.gullGray,
                      marginTop: 24,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 800ms",
                      position: "relative",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── FEATURES ─── */
          if (slide.type === "features") {
            const cols = slide.features.length <= 3 ? "repeat(3, 1fr)" : "repeat(2, 1fr)";
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 38px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 44,
                      color: B.bigStone,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cols,
                      gap: 20,
                      maxWidth: slide.features.length <= 3 ? 900 : 800,
                      margin: "0 auto",
                    }}
                  >
                    {slide.features.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          padding: "32px 24px",
                          borderRadius: 16,
                          background: B.white,
                          border: `1px solid ${B.athensGray}`,
                          boxShadow: "0 2px 12px rgba(23,33,52,0.04)",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(30px)",
                          transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${350 + fi * 150}ms`,
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: B.whisper,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 26,
                            marginBottom: 16,
                          }}
                        >
                          {f.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(16px, 2vw, 19px)",
                            fontWeight: 600,
                            marginBottom: 8,
                            color: B.bigStone,
                          }}
                        >
                          {f.title}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(13px, 1.4vw, 15px)",
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: B.gullGray,
                          }}
                        >
                          {f.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── PROCESS (Meeting Lifecycle) ─── */
          if (slide.type === "process") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ zIndex: 2, maxWidth: 1100, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 38px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 50,
                      color: B.bigStone,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "stretch", gap: 0, justifyContent: "center" }}>
                    {slide.phases.map((phase, pi) => {
                      const phaseColors = [B.orange, B.royalBlue, B.teal];
                      const pc = phaseColors[pi] || B.royalBlue;
                      return (
                        <div key={pi} style={{ display: "flex", alignItems: "stretch" }}>
                          <div
                            style={{
                              flex: "0 0 auto",
                              width: "clamp(220px, 22vw, 280px)",
                              padding: "32px 24px",
                              borderRadius: 20,
                              background: B.white,
                              border: `1px solid ${B.athensGray}`,
                              boxShadow: "0 2px 16px rgba(23,33,52,0.05)",
                              opacity: active ? 1 : 0,
                              transform: active ? "translateY(0)" : "translateY(40px)",
                              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${350 + pi * 200}ms`,
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                background: `${pc}14`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 30,
                                margin: "0 auto 14px",
                              }}
                            >
                              {phase.icon}
                            </div>
                            <div
                              style={{
                                fontSize: "clamp(15px, 1.8vw, 18px)",
                                fontWeight: 700,
                                marginBottom: 18,
                                color: pc,
                                fontFamily: `'${B.fontEn}', sans-serif`,
                                letterSpacing: 1,
                              }}
                            >
                              {phase.label}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {phase.items.map((item, ii) => (
                                <div
                                  key={ii}
                                  style={{
                                    fontSize: "clamp(12px, 1.3vw, 14px)",
                                    fontWeight: 400,
                                    color: B.gullGray,
                                    lineHeight: 1.5,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    background: "#F8F9FB",
                                  }}
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Arrow between phases */}
                          {pi < slide.phases.length - 1 && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0 16px",
                                opacity: active ? 1 : 0,
                                transition: `all 0.7s ease ${700 + pi * 200}ms`,
                              }}
                            >
                              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M18 7L11 14L18 21" stroke={B.cadetBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── SCREENSHOT (Split Layout) ─── */
          if (slide.type === "screenshot") {
            const imgLeft = slide.side === "left";
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div
                  style={{
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(30px, 5vw, 80px)",
                    maxWidth: 1200,
                    width: "100%",
                    flexDirection: imgLeft ? "row-reverse" : "row",
                  }}
                >
                  {/* Text side */}
                  <div
                    style={{
                      flex: "0 0 35%",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(24px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {/* Chip tag */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: 20,
                        background: `${circleColor}14`,
                        color: circleColor,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 20,
                        letterSpacing: 0.5,
                      }}
                    >
                      {slide.id === "screenshot-meetings" && "ניהול ישיבות"}
                      {slide.id === "screenshot-meeting-book" && "תיק ישיבה"}
                      {slide.id === "screenshot-resources" && "ניהול מסמכים"}
                      {slide.id === "screenshot-dashboard" && "דשבורד"}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(26px, 4vw, 40px)",
                        fontWeight: 700,
                        color: B.bigStone,
                        lineHeight: 1.2,
                        marginBottom: 16,
                      }}
                    >
                      {slide.title}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(14px, 2vw, 17px)",
                        fontWeight: 300,
                        color: B.gullGray,
                        lineHeight: 1.7,
                      }}
                    >
                      {slide.subtitle}
                    </div>

                    {/* AI Feature callout */}
                    {slide.aiFeature && (
                      <div
                        style={{
                          marginTop: 24,
                          padding: "16px 20px",
                          borderRadius: 14,
                          background: `linear-gradient(135deg, ${B.orange}08, ${B.royalBlue}08)`,
                          border: `1px solid ${B.orange}18`,
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(16px)",
                          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div
                            style={{
                              padding: "3px 8px",
                              borderRadius: 8,
                              background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
                              fontSize: 9,
                              fontWeight: 700,
                              color: B.white,
                              fontFamily: `'${B.fontEn}', sans-serif`,
                              letterSpacing: 1,
                            }}
                          >
                            AI
                          </div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: B.orange,
                              fontFamily: `'${B.fontEn}', sans-serif`,
                              letterSpacing: 0.5,
                            }}
                          >
                            {slide.aiFeature.label}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(14px, 1.6vw, 17px)",
                            fontWeight: 600,
                            color: B.bigStone,
                            marginBottom: 6,
                          }}
                        >
                          {slide.aiFeature.title}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            fontWeight: 300,
                            color: B.gullGray,
                            lineHeight: 1.6,
                          }}
                        >
                          {slide.aiFeature.desc}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Screenshot side */}
                  <div
                    style={{
                      flex: 1,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                      transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(23,33,52,0.12), 0 2px 12px rgba(23,33,52,0.06)",
                        border: `1px solid ${B.athensGray}`,
                        lineHeight: 0,
                      }}
                    >
                      <img
                        src={slide.src}
                        alt={slide.title}
                        style={{
                          display: "block",
                          width: "100%",
                          maxHeight: "58vh",
                          objectFit: "contain",
                          background: "#FAFBFC",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── AI FEATURE ─── */
          if (slide.type === "ai-feature") {
            const aiAccent = circleColor;
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div
                  style={{
                    zIndex: 2,
                    maxWidth: 1000,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(30px, 5vw, 70px)",
                  }}
                >
                  {/* Left: AI visual icon area */}
                  <div
                    style={{
                      flex: "0 0 200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    <div
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: "50%",
                        background: `${aiAccent}0A`,
                        border: `1px solid ${aiAccent}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          background: `${aiAccent}12`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: 48 }}>{slide.icon}</span>
                      </div>
                      {/* Small AI badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          padding: "4px 10px",
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
                          fontSize: 10,
                          fontWeight: 700,
                          color: B.white,
                          fontFamily: `'${B.fontEn}', sans-serif`,
                          letterSpacing: 1,
                        }}
                      >
                        AI
                      </div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div style={{ flex: 1 }}>
                    {/* Subtitle badge */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 16px",
                        borderRadius: 20,
                        background: `${aiAccent}10`,
                        border: `1px solid ${aiAccent}20`,
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: 1,
                        color: aiAccent,
                        marginBottom: 16,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                        fontFamily: `'${B.fontEn}', sans-serif`,
                      }}
                    >
                      {slide.subtitle}
                    </div>
                    {/* Title */}
                    <div
                      style={{
                        fontSize: "clamp(26px, 4vw, 40px)",
                        fontWeight: 700,
                        marginBottom: 14,
                        lineHeight: 1.2,
                        color: B.bigStone,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                      }}
                    >
                      {slide.title}
                    </div>
                    {/* Description */}
                    <div
                      style={{
                        fontSize: "clamp(14px, 1.8vw, 17px)",
                        fontWeight: 300,
                        color: B.gullGray,
                        lineHeight: 1.8,
                        marginBottom: 24,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms",
                      }}
                    >
                      {slide.description}
                    </div>
                    {/* Bullet items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {slide.bullets.map((b, bi) => (
                        <div
                          key={bi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "12px 18px",
                            borderRadius: 12,
                            background: B.white,
                            border: `1px solid ${B.athensGray}`,
                            boxShadow: "0 1px 6px rgba(23,33,52,0.04)",
                            opacity: active ? 1 : 0,
                            transform: active ? "translateX(0)" : "translateX(20px)",
                            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${600 + bi * 120}ms`,
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
                              flexShrink: 0,
                            }}
                          />
                          <div
                            style={{
                              fontSize: "clamp(13px, 1.4vw, 15px)",
                              fontWeight: 400,
                              color: B.gullGray,
                              lineHeight: 1.5,
                            }}
                          >
                            {b}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SlideWrap>
            );
          }

          /* ─── CUSTOMERS ─── */
          if (slide.type === "customers") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 38px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 10,
                      color: B.bigStone,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      fontWeight: 300,
                      color: B.gullGray,
                      textAlign: "center",
                      marginBottom: 44,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(15px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>

                  {/* New Clients - logo row */}
                  {slide.newClients && (
                    <div
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                        marginBottom: 56,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "clamp(12px, 1.5vw, 15px)",
                          fontWeight: 300,
                          color: B.gullGray,
                          letterSpacing: 0,
                          marginBottom: 14,
                          textAlign: "center",
                        }}
                      >
                        לקוחות שהצטרפו לאחרונה
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {slide.newClients.map((c, ci) => (
                          <div
                            key={ci}
                            style={{
                              padding: "14px 28px",
                              borderRadius: 14,
                              background: `linear-gradient(135deg, ${B.orange}06, ${B.royalBlue}06)`,
                              border: `1px solid ${B.orange}18`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 130,
                              minHeight: 58,
                              opacity: active ? 1 : 0,
                              transform: active ? "translateY(0)" : "translateY(16px)",
                              transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${450 + ci * 100}ms`,
                            }}
                          >
                            <img
                              src={c.src}
                              alt={c.name}
                              style={{
                                maxWidth: 100,
                                maxHeight: 36,
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Logo Slider - infinite single row */}
                  {(() => {
                    const repeated = [...slide.logos, ...slide.logos];
                    return (
                      <div
                        style={{
                          overflow: "hidden",
                          direction: "ltr",
                          opacity: active ? 1 : 0,
                          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 700ms",
                          maskImage: "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
                          WebkitMaskImage: "linear-gradient(90deg, transparent, black 5%, black 95%, transparent)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            width: "max-content",
                            animation: "marqueeLeft 90s linear infinite",
                          }}
                        >
                          {repeated.map((logo, li) => (
                            <div
                              key={li}
                              style={{
                                padding: "14px 28px",
                                borderRadius: 14,
                                background: B.white,
                                border: `1px solid ${B.athensGray}`,
                                boxShadow: "0 2px 8px rgba(23,33,52,0.04)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 140,
                                minHeight: 58,
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={logo.src}
                                alt={logo.name}
                                style={{
                                  maxWidth: 100,
                                  maxHeight: 36,
                                  objectFit: "contain",
                                  opacity: 0.7,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </SlideWrap>
            );
          }

          /* ─── BOTTOM LINE / CLOSING ─── */
          if (slide.type === "bottom-line") {
            return (
              <SlideWrap key={slide.id} active={active}>
                <DecoCircle color={circleColor} position={circlePos} />
                <div style={{ zIndex: 2, maxWidth: 900, width: "100%", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2vw, 22px)",
                      fontWeight: 300,
                      color: B.gullGray,
                      marginBottom: 12,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(40px, 7vw, 76px)",
                      fontWeight: 900,
                      lineHeight: 1.05,
                      marginBottom: 44,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(30px)",
                      transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                      background: `linear-gradient(135deg, ${B.orange} 0%, ${B.royalBlue} 100%)`,
                      backgroundSize: "200% auto",
                      animation: active ? "shimmer 6s linear infinite" : "none",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.title}
                  </div>

                  {/* Reason cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 20,
                      marginBottom: 44,
                    }}
                  >
                    {slide.reasons.map((r, ri) => (
                      <div
                        key={ri}
                        style={{
                          padding: "28px 20px",
                          borderRadius: 16,
                          background: B.white,
                          border: `1px solid ${B.athensGray}`,
                          boxShadow: "0 2px 12px rgba(23,33,52,0.04)",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(30px)",
                          transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${600 + ri * 150}ms`,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: B.whisper,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            margin: "0 auto 12px",
                          }}
                        >
                          {r.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            fontWeight: 600,
                            marginBottom: 8,
                            color: B.bigStone,
                          }}
                        >
                          {r.title}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            fontWeight: 300,
                            color: B.gullGray,
                            lineHeight: 1.6,
                          }}
                        >
                          {r.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    style={{
                      fontSize: "clamp(16px, 2.5vw, 24px)",
                      fontWeight: 500,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1100ms",
                      background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.cta}
                  </div>
                </div>
              </SlideWrap>
            );
          }

          return null;
        })}
      </div>

      {/* ─── NAVIGATION DOTS ─── */}
      {started && (
        <div
          style={{
            position: "fixed",
            bottom: 62,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 7,
            zIndex: 101,
          }}
        >
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
                background:
                  current === i
                    ? `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`
                    : B.athensGray,
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* ─── KEYBOARD HINT ─── */}
      {started && (
        <div
          style={{
            position: "fixed",
            bottom: 64,
            left: 30,
            fontSize: 12,
            color: B.cadetBlue,
            zIndex: 101,
            direction: "ltr",
            opacity: 0.5,
          }}
        >
          ← → or click
        </div>
      )}

      {/* ─── SLIDE COUNTER ─── */}
      {started && (
        <div
          style={{
            position: "fixed",
            bottom: 64,
            right: 30,
            fontSize: 12,
            color: B.cadetBlue,
            zIndex: 101,
            direction: "ltr",
            fontVariantNumeric: "tabular-nums",
            opacity: 0.5,
          }}
        >
          {current + 1} / {SLIDES.length}
        </div>
      )}

      {/* ─── FOOTER BAR ─── */}
      {started && <FooterBar />}
    </div>
  );
}
