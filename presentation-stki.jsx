import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  // ─── 1. HERO ───
  {
    id: "hero",
    type: "hero",
    subtitle: "A Product of SQLink Group",
    title: "Boardirector",
    tagline: "ניהול חכם ומאובטח של הממשל התאגידי",
    description:
      "הפלטפורמה המובילה לניהול הדירקטוריון, ההנהלה ומזכירות החברה בעידן הדיגיטלי",
    footnote: "יציבות של קבוצת טכנולוגיה גדולה עם חדשנות של מוצר SaaS ייעודי",
  },

  // ─── 2. VISION ───
  {
    id: "vision",
    type: "statement",
    text: "החזון שלנו",
    subtitle:
      "להוביל את עולם הממשל התאגידי והרגולציה\nלסביבה דיגיטלית חכמה, המאפשרת ניהול\nאפקטיבי, שקוף ומאובטח.",
  },
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
        title: "ריבונות מידע",
        desc: "שמירה על ריבונות המידע והמשכיות עסקית",
      },
    ],
  },

  // ─── 3. WHY ENTERPRISE ───
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

  // ─── 4. MEETING LIFECYCLE ───
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
          "בניית אג'נדה",
          "זימונים אוטומטיים",
          "הפצת חומרים בלחיצת כפתור",
        ],
      },
      {
        icon: "🎯",
        label: "In-Meeting",
        items: [
          "גישה מהירה למסמכים",
          "ניהול הצבעות",
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

  // ─── 4b. SCREENSHOT: MEETINGS ───
  {
    id: "screenshot-meetings",
    type: "screenshot",
    title: "ניהול ישיבות חכם",
    subtitle: "סביבת עבודה אינטואיטיבית לניהול מלא של מעגל החיים של הישיבה",
    src: "/screenshots/meetings.png",
  },

  // ─── 4c. SCREENSHOT: MEETING BOOK ───
  {
    id: "screenshot-meeting-book",
    type: "screenshot",
    title: "Meeting Book",
    subtitle: "תיק ישיבה דיגיטלי מקצועי — כל החומרים, המסמכים וסדר היום במקום אחד",
    src: "/screenshots/meeting-book.png",
  },

  // ─── 5. SECRETARY REVOLUTION ───
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

  // ─── 5b. SCREENSHOT: RESOURCES ───
  {
    id: "screenshot-resources",
    type: "screenshot",
    title: "מרכז המשאבים",
    subtitle: "ארכיון חכם וניהול מסמכים מרכזי עם חיפוש טקסטואלי מלא",
    src: "/screenshots/recources.png",
  },

  // ─── 6. UX & ACCESSIBILITY ───
  {
    id: "ch-ux",
    type: "chapter",
    chapter: "03",
    title: "נגישות מכל מקום",
    subtitle: "חוויית משתמש פרימיום · Zero Learning Curve",
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

  // ─── 6b. SCREENSHOT: DASHBOARD ───
  {
    id: "screenshot-dashboard",
    type: "screenshot",
    title: "Dashboard אישי",
    subtitle: "תצוגה מרכזית של כל המשימות, ההחלטות והישיבות הקרובות",
    src: "/screenshots/dashboard.png",
  },

  // ─── 7. SECURITY ───
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

  // ─── 8. SOCIAL PROOF ───
  {
    id: "customers",
    type: "customers",
    title: "הארגונים הגדולים בישראל כבר כאן",
    subtitle: "בשלות מוכחת במגזר הפיננסי, הציבורי והעסקי",
    logos: [
      { name: "בנק לאומי", src: "/logos/leumi.svg" },
      { name: "בנק דיסקונט", src: "/logos/discount.png" },
      { name: "Amdocs", src: "/logos/amdocs.png" },
      { name: "איילון", src: "/logos/ayalon.png" },
      { name: "אל על", src: "/logos/elal.png" },
      { name: "שטראוס", src: "/logos/strauss.png" },
    ],
    stats: [
      { value: 50, suffix: "+", label: "ארגונים" },
      { value: 3000, suffix: "+", label: "משתמשים פעילים" },
      { value: 99.9, suffix: "%", label: "זמינות מערכת" },
    ],
  },

  // ─── 9. CLOSING ───
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
const BRAND = {
  bigStone: "#172134",
  royalBlue: "#5877E6",
  gullGray: "#9AA2B3",
  cadetBlue: "#ADB4C6",
  athensGray: "#E7E8EC",
  whisper: "#E7EEFF",
  white: "#FFFFFF",
  orange: "#FE7501",
  orangeLight: "#FF9A3E",
  blueBright: "#6B8EF0",
  bluePale: "#8FAAF5",
  font: "Rubik",
  fontEn: "Inter",
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

/* ─── Floating Particles ─── */
function Particles() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            borderRadius: "50%",
            background: `rgba(88, 119, 230, ${0.08 + Math.random() * 0.12})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatParticle ${15 + Math.random() * 20}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Background Logo Watermark ─── */
function LogoWatermark({ slideIndex, totalSlides, started }) {
  const progress = started ? slideIndex / (totalSlides - 1) : 0;
  const opacity = !started
    ? 0.025
    : slideIndex >= totalSlides - 1
      ? 0.15
      : slideIndex >= totalSlides - 2
        ? 0.1
        : 0.02 + progress * 0.05;
  const scale = !started
    ? 2.5
    : slideIndex >= totalSlides - 1
      ? 1.2
      : 2.5 - progress * 1.0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1,
        transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <svg width="400" height="322" viewBox="0 0 196 158" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_wm)">
          <path
            d="M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z"
            fill={BRAND.orange}
          />
        </g>
        <defs>
          <clipPath id="clip0_wm">
            <rect width="196" height="158" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
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
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${((current + 1) / total) * 100}%`,
          background: `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.royalBlue}, ${BRAND.blueBright})`,
          transition: "width 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "0 2px 2px 0",
          boxShadow: `0 0 20px rgba(247, 147, 30, 0.4)`,
        }}
      />
    </div>
  );
}

/* ─── Slide Wrapper with Transition ─── */
function SlideWrapper({ active, direction, children }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: active ? 1 : 0,
        transform: active
          ? "scale(1) translateY(0)"
          : direction === "forward"
            ? "scale(0.92) translateY(40px)"
            : "scale(1.08) translateY(-40px)",
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: active ? "auto" : "none",
        padding: "40px",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Staggered Text Lines ─── */
function StaggerText({ text, active, baseDelay = 200, style = {} }) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * 150}ms`,
            ...style,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/* ─── Glow Orb Background ─── */
function GlowOrbs({ variant }) {
  const configs = {
    blue: [
      { color: "rgba(88,119,230,0.15)", size: 500, x: "20%", y: "30%" },
      { color: "rgba(107,142,240,0.1)", size: 400, x: "70%", y: "60%" },
    ],
    navy: [
      { color: "rgba(88,119,230,0.12)", size: 500, x: "60%", y: "25%" },
      { color: "rgba(23,33,52,0.3)", size: 400, x: "25%", y: "65%" },
    ],
    warm: [
      { color: "rgba(254,117,1,0.1)", size: 500, x: "30%", y: "40%" },
      { color: "rgba(88,119,230,0.08)", size: 400, x: "70%", y: "30%" },
    ],
    deep: [
      { color: "rgba(143,170,245,0.1)", size: 500, x: "50%", y: "30%" },
      { color: "rgba(254,117,1,0.06)", size: 400, x: "30%", y: "60%" },
    ],
  };
  const orbs = configs[variant] || configs.blue;
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            animation: `pulseOrb ${8 + i * 3}s ease-in-out infinite alternate`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </>
  );
}

/* ─── MAIN PRESENTATION ─── */
export default function PresentationSTKI() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.02, 0.35);
          if (audioRef.current) audioRef.current.volume = vol;
          if (vol >= 0.35) clearInterval(fadeIn);
        }, 40);
      }).catch(() => {});
    }
  }, [started]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

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
      setDirection(dir);
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
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const glowVariants = [
    "blue", "navy", "blue", "navy", "warm",
    "navy", "deep", "deep", "warm", "deep",
    "deep", "navy", "deep", "navy", "warm",
    "deep", "navy", "blue", "navy",
  ];

  return (
    <div
      dir="rtl"
      onClick={() => navigate("forward")}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: BRAND.bigStone,
        fontFamily: "'Rubik', 'SF Pro Display', -apple-system, sans-serif",
        cursor: "pointer",
        userSelect: "none",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-10px) translateX(-20px); }
          75% { transform: translateY(-40px) translateX(10px); }
        }

        @keyframes pulseOrb {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes ringPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
        }

        @keyframes flowArrow {
          0% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(6px); }
          100% { opacity: 0.3; transform: translateX(0); }
        }

        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(254,117,1,0); }
          50% { box-shadow: 0 0 30px rgba(254,117,1,0.08); }
        }

        @keyframes screenFloat {
          0%, 100% { transform: perspective(1200px) rotateX(2deg) translateY(0); }
          50% { transform: perspective(1200px) rotateX(2deg) translateY(-6px); }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }

        ::selection { background: rgba(254,117,1,0.3); }
      `}</style>

      <Particles />
      <LogoWatermark slideIndex={current} totalSlides={SLIDES.length} started={started} />
      <ProgressBar current={started ? current : -1} total={SLIDES.length} />

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
          transform: started ? "scale(1.1)" : "scale(1)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: started ? "none" : "auto",
          zIndex: 50,
        }}
      >
        <GlowOrbs variant="navy" />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            border: "1px solid rgba(254,117,1,0.12)",
            borderRadius: "50%",
            left: "50%",
            top: "50%",
            animation: "ringPulse 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            border: "1px solid rgba(88,119,230,0.08)",
            borderRadius: "50%",
            left: "50%",
            top: "50%",
            animation: "ringPulse 8s ease-in-out infinite 1s",
          }}
        />
        {/* BD Logo */}
        <div style={{ animation: "fadeInUp 1s ease-out 0.2s both", zIndex: 2, marginBottom: 20 }}>
          <svg width="80" height="64" viewBox="0 0 196 158" fill="none">
            <path
              d="M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z"
              fill={BRAND.orange}
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 300,
            letterSpacing: "8px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 20,
            animation: "fadeInUp 1s ease-out 0.4s both",
            textTransform: "uppercase",
            zIndex: 2,
            fontFamily: `'${BRAND.fontEn}', sans-serif`,
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
          }}
        >
          ניהול חכם ומאובטח{"\n"}של הממשל התאגידי
        </div>
        <div
          style={{
            fontSize: "clamp(13px, 1.5vw, 16px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
            marginTop: 20,
            animation: "fadeInUp 1s ease-out 0.8s both",
            zIndex: 2,
            fontFamily: `'${BRAND.fontEn}', sans-serif`,
            letterSpacing: 2,
          }}
        >
          A Product of SQLink Group
        </div>
        <div
          style={{
            fontSize: "clamp(14px, 2vw, 20px)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
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
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        {SLIDES.map((slide, i) => {
          const active = current === i && started;

          /* ─── HERO SLIDE ─── */
          if (slide.type === "hero") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="blue" />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 900 }}>
                  <div
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 15px)",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "4px",
                      marginBottom: 16,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                      fontFamily: `'${BRAND.fontEn}', sans-serif`,
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(48px, 10vw, 110px)",
                      fontWeight: 900,
                      lineHeight: 1,
                      marginBottom: 24,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                      background: `linear-gradient(135deg, #fff 30%, ${BRAND.orangeLight} 60%, ${BRAND.orange} 100%)`,
                      backgroundSize: "200% auto",
                      animation: active ? "shimmer 6s linear infinite" : "none",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontFamily: `'${BRAND.fontEn}', sans-serif`,
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(20px, 3vw, 32px)",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: 16,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 650ms",
                    }}
                  >
                    {slide.tagline}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      maxWidth: 600,
                      margin: "0 auto",
                      lineHeight: 1.6,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 850ms",
                    }}
                  >
                    {slide.description}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.2)",
                      marginTop: 50,
                      letterSpacing: 1,
                      opacity: active ? 1 : 0,
                      transition: "all 0.8s ease 1100ms",
                      fontWeight: 300,
                    }}
                  >
                    {slide.footnote}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── STATEMENT SLIDE ─── */
          if (slide.type === "statement") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="navy" />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800 }}>
                  <div
                    style={{
                      fontSize: "clamp(36px, 6vw, 64px)",
                      fontWeight: 800,
                      marginBottom: 30,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                      transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                      background: `linear-gradient(135deg, #fff 20%, ${BRAND.orangeLight} 60%, ${BRAND.orange} 100%)`,
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
                      color: "rgba(255,255,255,0.65)",
                    }}
                  />
                </div>
              </SlideWrapper>
            );
          }

          /* ─── CHAPTER SLIDE ─── */
          if (slide.type === "chapter") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={glowVariants[i] || "navy"} />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800 }}>
                  <div
                    style={{
                      fontSize: "clamp(60px, 12vw, 140px)",
                      fontWeight: 100,
                      color: "rgba(255,255,255,0.06)",
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      letterSpacing: -5,
                      fontFamily: "'Rubik', sans-serif",
                    }}
                  >
                    {slide.chapter}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: 4,
                      color: BRAND.orangeLight,
                      marginBottom: 30,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    פרק {slide.chapter}
                  </div>
                  <StaggerText
                    text={slide.title}
                    active={active}
                    baseDelay={400}
                    style={{
                      fontSize: "clamp(36px, 7vw, 72px)",
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "clamp(16px, 2.5vw, 22px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      marginTop: 24,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 900ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── FEATURES SLIDE ─── */
          if (slide.type === "features") {
            const cols = slide.features.length <= 3 ? "repeat(3, 1fr)" : "repeat(auto-fit, minmax(220px, 1fr))";
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={glowVariants[i] || "blue"} />
                <div style={{ zIndex: 2, maxWidth: 1050, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 40px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 50,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: cols,
                      gap: 24,
                    }}
                  >
                    {slide.features.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          padding: "36px 28px",
                          borderRadius: 16,
                          background: "rgba(23,33,52,0.6)",
                          border: "1px solid rgba(88,119,230,0.1)",
                          backdropFilter: "blur(20px)",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(40px)",
                          transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${400 + fi * 200}ms`,
                          animation: active ? "cardGlow 4s ease-in-out infinite" : "none",
                          animationDelay: `${fi * 0.5}s`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 36,
                            marginBottom: 16,
                            filter: "drop-shadow(0 0 8px rgba(254,117,1,0.3))",
                          }}
                        >
                          {f.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            fontWeight: 600,
                            marginBottom: 10,
                          }}
                        >
                          {f.title}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(13px, 1.5vw, 15px)",
                            fontWeight: 300,
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.5)",
                          }}
                        >
                          {f.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── PROCESS SLIDE (Meeting Lifecycle) ─── */
          if (slide.type === "process") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="deep" />
                <div style={{ zIndex: 2, maxWidth: 1100, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 40px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 60,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "stretch", gap: 0, justifyContent: "center" }}>
                    {slide.phases.map((phase, pi) => (
                      <div key={pi} style={{ display: "flex", alignItems: "stretch" }}>
                        {/* Phase Card */}
                        <div
                          style={{
                            flex: "0 0 auto",
                            width: "clamp(220px, 22vw, 280px)",
                            padding: "36px 28px",
                            borderRadius: 20,
                            background:
                              pi === 1
                                ? `linear-gradient(135deg, rgba(254,117,1,0.12), rgba(88,119,230,0.12))`
                                : "rgba(23,33,52,0.6)",
                            border: `1px solid ${pi === 1 ? "rgba(254,117,1,0.2)" : "rgba(88,119,230,0.1)"}`,
                            backdropFilter: "blur(20px)",
                            opacity: active ? 1 : 0,
                            transform: active ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
                            transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${400 + pi * 250}ms`,
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 42, marginBottom: 14, filter: "drop-shadow(0 0 10px rgba(254,117,1,0.3))" }}>
                            {phase.icon}
                          </div>
                          <div
                            style={{
                              fontSize: "clamp(15px, 1.8vw, 19px)",
                              fontWeight: 700,
                              marginBottom: 20,
                              color: pi === 1 ? BRAND.orangeLight : "#fff",
                              fontFamily: `'${BRAND.fontEn}', sans-serif`,
                              letterSpacing: 1,
                            }}
                          >
                            {phase.label}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {phase.items.map((item, ii) => (
                              <div
                                key={ii}
                                style={{
                                  fontSize: "clamp(12px, 1.3vw, 14px)",
                                  fontWeight: 300,
                                  color: "rgba(255,255,255,0.55)",
                                  lineHeight: 1.5,
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid rgba(255,255,255,0.04)",
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
                              transition: `all 0.8s ease ${800 + pi * 200}ms`,
                            }}
                          >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ transform: "scaleX(-1)", animation: active ? "flowArrow 2s ease-in-out infinite" : "none", animationDelay: `${pi * 0.5}s` }}>
                              <path d="M20 8L12 16L20 24" stroke={BRAND.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                              <path d="M26 8L18 16L26 24" stroke={BRAND.royalBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── SCREENSHOT SHOWCASE SLIDE ─── */
          if (slide.type === "screenshot") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="deep" />
                <div style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 40px)",
                      fontWeight: 700,
                      marginBottom: 10,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      marginBottom: 36,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(15px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      opacity: active ? 1 : 0,
                      transform: active
                        ? "perspective(1200px) rotateX(2deg) scale(1)"
                        : "perspective(1200px) rotateX(8deg) scale(0.88) translateY(60px)",
                      transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 500ms",
                      animation: active ? "screenFloat 6s ease-in-out infinite 1.5s" : "none",
                      borderRadius: 16,
                      padding: 3,
                      background: "linear-gradient(135deg, rgba(88,119,230,0.25), rgba(254,117,1,0.15), rgba(88,119,230,0.2))",
                    }}
                  >
                    {/* Glow behind */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "-30px",
                        borderRadius: 30,
                        background: `radial-gradient(ellipse at center, rgba(88,119,230,0.12) 0%, rgba(254,117,1,0.04) 40%, transparent 70%)`,
                        filter: "blur(25px)",
                        zIndex: -1,
                        pointerEvents: "none",
                      }}
                    />
                    <div style={{ borderRadius: 13, overflow: "hidden", position: "relative", lineHeight: 0 }}>
                      <img
                        src={slide.src}
                        alt={slide.title}
                        style={{
                          display: "block",
                          maxWidth: "min(82vw, 960px)",
                          maxHeight: "56vh",
                          objectFit: "contain",
                        }}
                      />
                      {/* Bottom fade */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "25%",
                          background: "linear-gradient(to top, rgba(23,33,52,0.5) 0%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── CUSTOMERS / SOCIAL PROOF SLIDE ─── */
          if (slide.type === "customers") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="warm" />
                <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(24px, 4vw, 40px)",
                      fontWeight: 700,
                      textAlign: "center",
                      marginBottom: 12,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 18px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      textAlign: "center",
                      marginBottom: 50,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(15px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 350ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>

                  {/* Customer Logo Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 20,
                      maxWidth: 700,
                      margin: "0 auto 50px",
                    }}
                  >
                    {slide.logos.map((logo, li) => (
                      <div
                        key={li}
                        style={{
                          padding: "20px 28px",
                          borderRadius: 14,
                          background: "rgba(23,33,52,0.5)",
                          border: "1px solid rgba(88,119,230,0.1)",
                          backdropFilter: "blur(20px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 70,
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                          transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${450 + li * 120}ms`,
                        }}
                      >
                        <img
                          src={logo.src}
                          alt={logo.name}
                          style={{
                            maxWidth: 110,
                            maxHeight: 40,
                            objectFit: "contain",
                            filter: "brightness(0) invert(1)",
                            opacity: 0.75,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "clamp(30px, 6vw, 80px)",
                      flexWrap: "wrap",
                    }}
                  >
                    {slide.stats.map((s, si) => (
                      <div
                        key={si}
                        style={{
                          textAlign: "center",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                          transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${900 + si * 200}ms`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "clamp(40px, 7vw, 72px)",
                            fontWeight: 800,
                            lineHeight: 1,
                            background: `linear-gradient(135deg, #fff 20%, ${BRAND.orangeLight} 60%, ${BRAND.orange} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginBottom: 8,
                            direction: "ltr",
                          }}
                        >
                          <Counter value={s.value} suffix={s.suffix} trigger={active} />
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(13px, 1.5vw, 16px)",
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.45)",
                          }}
                        >
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          /* ─── BOTTOM LINE / CLOSING SLIDE ─── */
          if (slide.type === "bottom-line") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="navy" />
                <div
                  style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    border: "1px solid rgba(254,117,1,0.08)",
                    borderRadius: "50%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    animation: active ? "ringPulse 6s ease-in-out infinite" : "none",
                  }}
                />
                <div style={{ zIndex: 2, maxWidth: 900, width: "100%", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2vw, 22px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 12,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(40px, 7vw, 80px)",
                      fontWeight: 900,
                      lineHeight: 1.05,
                      marginBottom: 50,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                      background: `linear-gradient(135deg, #fff 0%, ${BRAND.orangeLight} 35%, ${BRAND.orange} 60%, ${BRAND.royalBlue} 100%)`,
                      backgroundSize: "300% auto",
                      animation: active ? "shimmer 8s linear infinite" : "none",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.title}
                  </div>

                  {/* Three reason cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 24,
                      marginBottom: 50,
                    }}
                  >
                    {slide.reasons.map((r, ri) => (
                      <div
                        key={ri}
                        style={{
                          padding: "28px 20px",
                          borderRadius: 16,
                          background: "rgba(23,33,52,0.6)",
                          border: "1px solid rgba(88,119,230,0.1)",
                          backdropFilter: "blur(20px)",
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(40px)",
                          transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${600 + ri * 200}ms`,
                        }}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>{r.icon}</div>
                        <div
                          style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          {r.title}
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(12px, 1.3vw, 14px)",
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.5)",
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
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1300ms",
                      background: `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.royalBlue})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.cta}
                  </div>
                </div>
              </SlideWrapper>
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
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 100,
          }}
        >
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (!isTransitioning) {
                  setDirection(i > current ? "forward" : "backward");
                  setCurrent(i);
                  setIsTransitioning(true);
                  setTimeout(() => setIsTransitioning(false), 600);
                }
              }}
              style={{
                width: current === i ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  current === i
                    ? `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.royalBlue})`
                    : "rgba(255,255,255,0.15)",
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
            bottom: 30,
            left: 30,
            fontSize: 12,
            color: "rgba(255,255,255,0.15)",
            zIndex: 100,
            direction: "ltr",
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
            bottom: 30,
            right: 30,
            fontSize: 12,
            color: "rgba(255,255,255,0.15)",
            zIndex: 100,
            direction: "ltr",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {current + 1} / {SLIDES.length}
        </div>
      )}

      {/* ─── BRANDING FOOTER ─── */}
      {started && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: -8,
            fontSize: 10,
            color: "rgba(255,255,255,0.08)",
            zIndex: 99,
            direction: "ltr",
            fontFamily: `'${BRAND.fontEn}', sans-serif`,
            letterSpacing: 2,
            marginTop: 20,
            paddingTop: 30,
          }}
        >
          Boardirector by SQLink
        </div>
      )}

      {/* ─── BACKGROUND MUSIC ─── */}
      <audio ref={audioRef} loop preload="auto" src="/bg-music.mp3" />

      {/* ─── MUTE TOGGLE ─── */}
      {started && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMuted(!muted);
          }}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(23,33,52,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 200,
            transition: "all 0.3s ease",
          }}
          title={muted ? "Unmute" : "Mute"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {muted ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.15)" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.15)" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
