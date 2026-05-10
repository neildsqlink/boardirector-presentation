import { useState, useEffect, useCallback, useRef } from "react";

const SLIDES = [
  // ─── OPENING ───
  {
    id: "hero",
    type: "hero",
    subtitle: "הכירו את",
    title: "BoardDirector 2.0",
    tagline: "חווית ניהול דירקטוריון שלא הכרתם.",
    footnote: "2026 · הגרסה החדשה",
  },
  {
    id: "vision",
    type: "statement",
    text: "בנינו מחדש כל פיקסל.\nכל תהליך. כל חוויה.",
    subtitle: "מהיסוד.",
  },

  // ─── CHAPTER 01: DESIGN ───
  {
    id: "ch01",
    type: "chapter",
    chapter: "01",
    title: "עיצוב חדש לחלוטין",
    subtitle: "ממשק שמרגיש כמו הבית שלכם",
  },
  {
    id: "dashboard",
    type: "showcase",
    title: "דשבורד חכם ואינטואיטיבי",
    subtitle: "כל מה שצריך — במבט אחד",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Dashboard",
      sections: [
        { label: "156", desc: "Total Open Tasks", color: "#5877E6" },
        { label: "24", desc: "Committees", color: "#34C759" },
        { label: "18", desc: "Upcoming Meetings", color: "#FF9F0A" },
        { label: "27", desc: "Total Topics", color: "#AF52DE" },
      ],
    },
    highlights: [
      "Task Analytics עם מבט-על על כל המשימות",
      "Actions to Take — פעולות נדרשות בזמן אמת",
      "לוח ישיבות עם תצוגת חודש מלא",
      "הודעות ועדכונים ארגוניים",
    ],
  },

  // ─── CHAPTER 02: MEETINGS ───
  {
    id: "ch02",
    type: "chapter",
    chapter: "02",
    title: "ניהול ישיבות\nמקצה לקצה",
    subtitle: "מסדר יום ועד פרוטוקול — הכל במקום אחד",
  },
  {
    id: "agenda",
    type: "showcase",
    title: "בונה סדר יום חכם",
    subtitle: "Agenda Builder",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Meetings",
      sections: [
        { label: "20", desc: "Topics", color: "#5877E6" },
        { label: "2", desc: "Breaks", color: "#9AA2B3" },
        { label: "05:30", desc: "Hours", color: "#FF9F0A" },
      ],
    },
    highlights: [
      "שכפול סדר יום מישיבה קודמת בלחיצה",
      "תבניות מוכנות לסדר יום — לפי סוג ועדה",
      "תזמון אוטומטי או ידני עם Drag & Drop",
      "שיתוף סדר יום ו-Meeting Book באימייל",
    ],
  },
  {
    id: "minutes",
    type: "showcase",
    title: "פרוטוקול חי — מהישיבה לפעולה",
    subtitle: "Minutes & Approvals",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Meetings",
      sections: [
        { label: "✓", desc: "Auto-Save", color: "#34C759" },
        { label: "📝", desc: "Decisions", color: "#5877E6" },
        { label: "✅", desc: "Tasks", color: "#FF9F0A" },
      ],
    },
    highlights: [
      "יצירת פרוטוקול מתוך סדר היום — אוטומטית",
      "הוספת החלטות ומשימות ישירות מהנושא",
      "מעקב אישור — שליחה לעיון, הערות וחתימות",
      "עריכה ב-Microsoft Word עם סנכרון מלא",
    ],
  },

  // ─── CHAPTER 03: TASKS & DECISIONS ───
  {
    id: "ch03",
    type: "chapter",
    chapter: "03",
    title: "משימות והחלטות",
    subtitle: "מעקב חכם מהחלטה ועד ביצוע",
  },
  {
    id: "tasks",
    type: "showcase",
    title: "ניהול משימות — Kanban & Table",
    subtitle: "שתי תצוגות, שליטה מלאה",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Tasks",
      sections: [
        { label: "To Do", desc: "45 Tasks", color: "#9AA2B3" },
        { label: "In Progress", desc: "28 Tasks", color: "#5877E6" },
        { label: "Done", desc: "62 Tasks", color: "#34C759" },
      ],
    },
    highlights: [
      "תצוגת Kanban עם Drag & Drop בין עמודות",
      "פילטרים מהירים — Overdue, השבוע, מהחלטות",
      "Subtasks עם מד התקדמות ויזואלי",
      "פעולות בכמות — שינוי סטטוס, העברה לארכיון",
    ],
  },
  {
    id: "decisions",
    type: "showcase",
    title: "מעקב החלטות מרכזי",
    subtitle: "Decision Tracker",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Meetings",
      sections: [
        { label: "●", desc: "Committee", color: "#5877E6" },
        { label: "📅", desc: "Meeting Date", color: "#9AA2B3" },
        { label: "2/5", desc: "Tasks Progress", color: "#FF9F0A" },
      ],
    },
    highlights: [
      "ריכוז כל ההחלטות מכל הישיבות והוועדות",
      "מד ביצוע משימות per-decision (gauge ויזואלי)",
      "יצירת נושא חדש ישירות מהחלטה",
      "פילטרים לפי ועדה, תאריך ישיבה ומצב משימות",
    ],
  },

  // ─── CHAPTER 04: WORK PLAN & REGULATIONS ───
  {
    id: "ch04",
    type: "chapter",
    chapter: "04",
    title: "תכנון שנתי\nורגולציה",
    subtitle: "Work Plan — מנושא ועד דיון, הכל מתוכנן",
  },
  {
    id: "workplan",
    type: "showcase",
    title: "תוכנית עבודה שנתית",
    subtitle: "Work Plan",
    mockup: {
      sidebar: ["Dashboard", "Committees", "Meetings", "Topics", "Resources", "Tasks"],
      activePage: "Topics",
      sections: [
        { label: "Overdue", desc: "3 Topics", color: "#FF3B30" },
        { label: "Due Soon", desc: "8 Topics", color: "#FF9F0A" },
        { label: "Scheduled", desc: "42 Topics", color: "#34C759" },
        { label: "To Schedule", desc: "12 Topics", color: "#9AA2B3" },
      ],
    },
    highlights: [
      "תצוגת שנה עם חלוקה לרבעונים וחודשים",
      "מעקב סטטוס — Overdue, Due Soon, Scheduled",
      "תדירות דיון חוזר — שבועי, חודשי, רבעוני, שנתי",
      "שיבוץ נושאים לישיבות עתידיות בלחיצה",
    ],
  },
  {
    id: "regulations",
    type: "features",
    title: "רגולציה ומקורות נורמטיביים",
    features: [
      {
        icon: "⚖",
        title: "מקורות נורמטיביים",
        desc: "צירוף חוקים, תקנות והנחיות לכל נושא — עם סוג, תיאור ותאריך תחילת תוקף",
      },
      {
        icon: "🔄",
        title: "תדירות דיון רגולטורית",
        desc: "הגדרת תדירות חוזרת לדיון בנושאים רגולטוריים — המערכת מחשבת אוטומטית את התאריך הבא",
      },
      {
        icon: "⏰",
        title: "התראות חריגה ועיכוב",
        desc: "זיהוי אוטומטי של נושאים שחרגו מלוח הזמנים — Overdue ו-Due Soon עם חישוב ימים",
      },
    ],
  },

  // ─── CHAPTER 05: AI ───
  {
    id: "ch05",
    type: "chapter",
    chapter: "05",
    title: "בינה מלאכותית",
    subtitle: "AI שעובד בשבילכם — לא במקומכם",
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

  // ─── CLOSING ───
  {
    id: "stats",
    type: "stats",
    title: "ביצועים שמרגישים",
    stats: [
      { value: 200, suffix: "ms", label: "זמן תגובה ממוצע" },
      { value: 99.99, suffix: "%", label: "זמינות מערכת" },
      { value: 10, suffix: "×", label: "שיפור במהירות העלאה" },
    ],
  },
  {
    id: "closing",
    type: "closing",
    subtitle: "זה לא רק עדכון.",
    title: "זה הדור הבא.",
    tagline: "BoardDirector 2.0 — זמין עכשיו.",
  },
];

/* ─── Brand Tokens (from Figma design variables + logo) ─── */
const BRAND = {
  bigStone: "#172134",       // color/azure/15 — base dark
  royalBlue: "#5877E6",      // color/blue/62 — primary blue
  gullGray: "#9AA2B3",       // color/azure/65 — secondary text
  cadetBlue: "#ADB4C6",      // color/azure/73 — tertiary text
  athensGray: "#E7E8EC",     // color/grey/92 — light border
  whisper: "#E7EEFF",        // color/grey/95 — light blue bg
  white: "#FFFFFF",
  // Logo orange
  orange: "#FE7501",         // logo primary orange
  orangeLight: "#FF9A3E",    // lighter variant for gradients
  // Presentation-specific (derived from brand)
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
    const increment = value / steps;
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
    : count.toFixed(count >= value ? 2 : 1);

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

/* ─── Background Logo Watermark (Apple-style reveal) ─── */
function LogoWatermark({ slideIndex, totalSlides, started }) {
  // Progress from 0 to 1 across all slides
  const progress = started ? slideIndex / (totalSlides - 1) : 0;

  // Opacity: starts barely visible, builds up, full on closing
  const opacity = !started
    ? 0.025
    : slideIndex >= totalSlides - 1
      ? 0.15
      : slideIndex >= totalSlides - 2
        ? 0.1
        : 0.02 + progress * 0.05;

  // Scale: starts huge, shrinks to normal on closing
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
      <svg
        width="400"
        height="322"
        viewBox="0 0 196 158"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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
export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Start music when presentation starts
  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        // Fade in over 2 seconds
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(vol + 0.02, 0.35);
          if (audioRef.current) audioRef.current.volume = vol;
          if (vol >= 0.35) clearInterval(fadeIn);
        }, 40);
      }).catch(() => {});
    }
  }, [started]);

  // Mute/unmute
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

  const glowVariants = ["blue", "blue", "navy", "navy", "warm", "warm", "warm", "deep", "deep", "deep", "deep", "navy", "navy", "navy", "warm", "warm", "warm", "blue", "navy"];

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

        @keyframes aiNodePulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes aiOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes aiDash {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes aiGlowPulse {
          0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.9); }
          50% { opacity: 0.35; transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes aiBulletLine {
          0% { width: 0; }
          100% { width: 100%; }
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
        {/* Large ring */}
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            border: `1px solid rgba(254,117,1,0.12)`,
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
        <div
          style={{
            fontSize: "clamp(14px, 2vw, 18px)",
            fontWeight: 300,
            letterSpacing: "8px",
            color: "rgba(255,255,255,0.4)",
            marginBottom: 30,
            animation: "fadeInUp 1s ease-out 0.3s both",
            textTransform: "uppercase",
            zIndex: 2,
            fontFamily: `'${BRAND.fontEn}', sans-serif`,
          }}
        >
          BoardDirector
        </div>
        <div
          style={{
            fontSize: "clamp(40px, 8vw, 90px)",
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: "center",
            animation: "fadeInUp 1s ease-out 0.6s both",
            background: `linear-gradient(135deg, #fff 0%, ${BRAND.orangeLight} 50%, ${BRAND.orange} 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            zIndex: 2,
          }}
        >
          גרסה 2.0
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

          if (slide.type === "hero") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="blue" />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 900 }}>
                  <div
                    style={{
                      fontSize: "clamp(14px, 2vw, 20px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "6px",
                      marginBottom: 20,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
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
                      fontSize: "clamp(18px, 3vw, 28px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.55)",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 700ms",
                    }}
                  >
                    {slide.tagline}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.2)",
                      marginTop: 60,
                      letterSpacing: 3,
                      opacity: active ? 1 : 0,
                      transition: "all 0.8s ease 1000ms",
                      fontFamily: `'${BRAND.fontEn}', sans-serif`,
                    }}
                  >
                    {slide.footnote}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          if (slide.type === "statement") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="navy" />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800 }}>
                  <StaggerText
                    text={slide.text}
                    active={active}
                    baseDelay={300}
                    style={{
                      fontSize: "clamp(28px, 5vw, 52px)",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "clamp(20px, 3vw, 36px)",
                      fontWeight: 700,
                      marginTop: 20,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 800ms",
                      background: `linear-gradient(90deg, ${BRAND.orange}, ${BRAND.royalBlue})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          if (slide.type === "chapter") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={i < 5 ? "navy" : i < 8 ? "warm" : "deep"} />
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
                      color: i < 5 ? BRAND.orangeLight : i < 8 ? BRAND.blueBright : BRAND.bluePale,
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

          if (slide.type === "features") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={glowVariants[i] || "blue"} />
                <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
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
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
                        }}
                      >
                        <div
                          style={{
                            fontSize: 32,
                            marginBottom: 16,
                            opacity: 0.8,
                            color: BRAND.orangeLight,
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

          if (slide.type === "stats") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={i < 5 ? "blue" : "deep"} />
                <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
                  <div
                    style={{
                      fontSize: "clamp(20px, 3vw, 32px)",
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
                          transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${400 + si * 250}ms`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "clamp(48px, 9vw, 88px)",
                            fontWeight: 800,
                            lineHeight: 1,
                            background: `linear-gradient(135deg, #fff 20%, ${BRAND.orangeLight} 60%, ${BRAND.orange} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginBottom: 12,
                            direction: "ltr",
                          }}
                        >
                          <Counter
                            value={s.value}
                            suffix={s.suffix}
                            trigger={active}
                          />
                        </div>
                        <div
                          style={{
                            fontSize: "clamp(13px, 1.5vw, 16px)",
                            fontWeight: 300,
                            color: "rgba(255,255,255,0.45)",
                            maxWidth: 180,
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

          if (slide.type === "closing") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="navy" />
                {/* Large decorative ring */}
                <div
                  style={{
                    position: "absolute",
                    width: 500,
                    height: 500,
                    border: `1px solid rgba(254,117,1,0.08)`,
                    borderRadius: "50%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    animation: active ? "ringPulse 6s ease-in-out infinite" : "none",
                  }}
                />
                <div style={{ textAlign: "center", zIndex: 2, maxWidth: 800 }}>
                  <div
                    style={{
                      fontSize: "clamp(20px, 3vw, 30px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.55)",
                      marginBottom: 16,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                    }}
                  >
                    {slide.subtitle}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(48px, 9vw, 100px)",
                      fontWeight: 900,
                      lineHeight: 1.05,
                      marginBottom: 30,
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
                      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 600ms",
                      background: `linear-gradient(135deg, #fff 0%, ${BRAND.orangeLight} 35%, ${BRAND.orange} 60%, ${BRAND.royalBlue} 100%)`,
                      backgroundSize: "300% auto",
                      animation: active ? "shimmer 8s linear infinite" : "none",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {slide.title}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2vw, 22px)",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.4)",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(20px)",
                      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1000ms",
                      fontFamily: `'${BRAND.fontEn}', '${BRAND.font}', sans-serif`,
                    }}
                  >
                    {slide.tagline}
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          if (slide.type === "showcase") {
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant={glowVariants[i] || "blue"} />
                <div style={{ zIndex: 2, maxWidth: 1200, width: "100%", display: "flex", gap: 40, alignItems: "center" }}>
                  {/* Left: Mockup */}
                  <div
                    style={{
                      flex: "1 1 55%",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.95)",
                      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 300ms",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(15, 23, 42, 0.8)",
                        borderRadius: 16,
                        border: "1px solid rgba(88,119,230,0.15)",
                        overflow: "hidden",
                        boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 40px rgba(88,119,230,0.08)",
                      }}
                    >
                      {/* Browser Chrome */}
                      <div style={{ padding: "10px 16px", background: "rgba(23,33,52,0.9)", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
                        <div style={{ flex: 1, marginRight: 8, marginLeft: 8, padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.05)", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center", direction: "ltr" }}>
                          app.boardirector.com
                        </div>
                      </div>
                      {/* App Content */}
                      <div style={{ display: "flex", minHeight: 260 }}>
                        {/* Sidebar */}
                        <div style={{ width: 52, background: "rgba(23,33,52,0.95)", padding: "12px 0", borderLeft: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          {/* Logo */}
                          <div style={{ width: 28, height: 28, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="16" viewBox="0 0 196 158" fill="none">
                              <path d="M162.809 62.006C163.821 58.0261 164.355 53.8443 164.355 49.5472C164.355 22.178 142.749 0 116.086 0H48.3477H0C0 2.68212 0 155.534 0 158H147.989C174.455 158 195.92 135.966 195.92 108.799C195.92 86.9382 182.027 68.4229 162.823 62.006H162.809ZM147.792 118.691H39.7364V39.2945H115.89C121.34 39.2945 125.92 43.6926 126.046 49.2876C126.173 55.0411 121.649 59.7709 116.072 59.7709L59.5956 60.04V99.0133L147.975 98.8924C153.369 98.8924 157.738 103.464 157.612 109.03C157.485 114.437 153.06 118.691 147.792 118.691Z" fill={BRAND.orange} />
                            </svg>
                          </div>
                          {slide.mockup.sidebar.map((item, si) => (
                            <div
                              key={si}
                              style={{
                                width: 36,
                                height: 28,
                                borderRadius: 6,
                                background: item === slide.mockup.activePage ? "rgba(88,119,230,0.2)" : "transparent",
                                borderRight: item === slide.mockup.activePage ? `2px solid ${BRAND.royalBlue}` : "2px solid transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div style={{ width: 14, height: 2.5, borderRadius: 1, background: item === slide.mockup.activePage ? BRAND.royalBlue : "rgba(255,255,255,0.15)" }} />
                            </div>
                          ))}
                        </div>
                        {/* Main content area */}
                        <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                          {/* Stats row */}
                          <div style={{ display: "flex", gap: 10 }}>
                            {slide.mockup.sections.map((s, si) => (
                              <div key={si} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, marginBottom: 2, direction: "ltr" }}>{s.label}</div>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", direction: "ltr" }}>{s.desc}</div>
                              </div>
                            ))}
                          </div>
                          {/* Content blocks */}
                          <div style={{ display: "flex", gap: 10, flex: 1 }}>
                            <div style={{ flex: 2, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: 14 }}>
                              {[1, 2, 3].map((_, li) => (
                                <div key={li} style={{ height: 8, borderRadius: 4, background: `rgba(255,255,255,${0.06 - li * 0.015})`, marginBottom: 10, width: `${90 - li * 15}%` }} />
                              ))}
                            </div>
                            <div style={{ flex: 1, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", padding: 14 }}>
                              {[1, 2].map((_, li) => (
                                <div key={li} style={{ height: 8, borderRadius: 4, background: `rgba(88,119,230,${0.15 - li * 0.05})`, marginBottom: 10, width: `${80 - li * 10}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right: Content */}
                  <div style={{ flex: "1 1 40%" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: 2,
                        color: BRAND.royalBlue,
                        marginBottom: 12,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms",
                        fontFamily: `'${BRAND.fontEn}', sans-serif`,
                      }}
                    >
                      {slide.subtitle}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(22px, 3.5vw, 34px)",
                        fontWeight: 700,
                        marginBottom: 24,
                        lineHeight: 1.2,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 500ms",
                      }}
                    >
                      {slide.title}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {slide.highlights.map((h, hi) => (
                        <div
                          key={hi}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            opacity: active ? 1 : 0,
                            transform: active ? "translateX(0)" : "translateX(20px)",
                            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${600 + hi * 150}ms`,
                          }}
                        >
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.orange}, ${BRAND.royalBlue})`, marginTop: 7, flexShrink: 0 }} />
                          <div style={{ fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: 300, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                            {h}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SlideWrapper>
            );
          }

          if (slide.type === "ai-feature") {
            // Each AI slide gets a unique neural-network style visual
            const aiVisualIndex = ["ai-agenda", "ai-minutes", "ai-tasks"].indexOf(slide.id);
            return (
              <SlideWrapper key={slide.id} active={active} direction={direction}>
                <GlowOrbs variant="warm" />
                {/* Large ambient AI glow behind everything */}
                <div
                  style={{
                    position: "absolute",
                    width: 600,
                    height: 600,
                    left: "50%",
                    top: "45%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(254,117,1,0.08) 0%, rgba(88,119,230,0.04) 50%, transparent 70%)`,
                    animation: active ? "aiGlowPulse 4s ease-in-out infinite" : "none",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ zIndex: 2, maxWidth: 900, width: "100%", display: "flex", alignItems: "center", gap: 50 }}>
                  {/* Left: AI Neural Visual */}
                  <div
                    style={{
                      flex: "0 0 220px",
                      height: 220,
                      position: "relative",
                      opacity: active ? 1 : 0,
                      transform: active ? "translateX(0) scale(1)" : "translateX(-30px) scale(0.85)",
                      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
                    }}
                  >
                    {/* Orbiting rings */}
                    {[0, 1, 2].map((ri) => (
                      <div
                        key={ri}
                        style={{
                          position: "absolute",
                          inset: `${ri * 20}px`,
                          borderRadius: "50%",
                          border: `1px solid rgba(${ri === 0 ? "254,117,1" : ri === 1 ? "88,119,230" : "143,170,245"},${0.12 - ri * 0.03})`,
                          animation: active ? `aiOrbit ${12 + ri * 8}s linear infinite ${ri % 2 === 0 ? "" : "reverse"}` : "none",
                        }}
                      >
                        {/* Orbiting node */}
                        <div
                          style={{
                            position: "absolute",
                            top: -4,
                            left: "50%",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: ri === 0 ? BRAND.orange : ri === 1 ? BRAND.royalBlue : BRAND.bluePale,
                            boxShadow: `0 0 12px ${ri === 0 ? "rgba(254,117,1,0.5)" : ri === 1 ? "rgba(88,119,230,0.5)" : "rgba(143,170,245,0.4)"}`,
                          }}
                        />
                      </div>
                    ))}
                    {/* Center core */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(254,117,1,0.2) 0%, rgba(88,119,230,0.15) 60%, transparent 100%)`,
                        border: "1px solid rgba(254,117,1,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${BRAND.orange}, ${BRAND.royalBlue})`,
                          animation: active ? "aiNodePulse 3s ease-in-out infinite" : "none",
                          boxShadow: `0 0 30px rgba(254,117,1,0.3), 0 0 60px rgba(88,119,230,0.15)`,
                        }}
                      />
                    </div>
                    {/* Neural connection lines (SVG) */}
                    <svg
                      width="220"
                      height="220"
                      viewBox="0 0 220 220"
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <defs>
                        <linearGradient id={`aiGrad${aiVisualIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={BRAND.orange} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={BRAND.royalBlue} stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      {/* Connection paths from center to edge nodes */}
                      {[
                        "M110,110 Q140,60 170,45",
                        "M110,110 Q60,80 40,50",
                        "M110,110 Q150,140 185,160",
                        "M110,110 Q70,150 35,175",
                        "M110,110 Q110,60 110,20",
                        "M110,110 Q110,160 110,200",
                      ].map((d, pi) => (
                        <path
                          key={pi}
                          d={d}
                          fill="none"
                          stroke={`url(#aiGrad${aiVisualIndex})`}
                          strokeWidth="1"
                          strokeDasharray="4,6"
                          style={{
                            animation: active ? `aiDash ${3 + pi * 0.5}s linear infinite` : "none",
                            animationDelay: `${pi * 0.3}s`,
                          }}
                        />
                      ))}
                      {/* Scattered nodes */}
                      {[
                        { cx: 170, cy: 45 }, { cx: 40, cy: 50 },
                        { cx: 185, cy: 160 }, { cx: 35, cy: 175 },
                        { cx: 110, cy: 20 }, { cx: 110, cy: 200 },
                        { cx: 195, cy: 100 }, { cx: 25, cy: 110 },
                      ].map((n, ni) => (
                        <circle
                          key={ni}
                          cx={n.cx}
                          cy={n.cy}
                          r={3}
                          fill={ni % 2 === 0 ? BRAND.orange : BRAND.royalBlue}
                          opacity={0.5}
                          style={{
                            animation: active ? `aiNodePulse ${2 + ni * 0.4}s ease-in-out infinite` : "none",
                            animationDelay: `${ni * 0.2}s`,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Right: Content */}
                  <div style={{ flex: 1, textAlign: "right" }}>
                    {/* Subtitle badge */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "5px 16px",
                        borderRadius: 20,
                        background: "rgba(254,117,1,0.08)",
                        border: "1px solid rgba(254,117,1,0.15)",
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: 2,
                        color: BRAND.orangeLight,
                        marginBottom: 16,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms",
                        fontFamily: `'${BRAND.fontEn}', sans-serif`,
                      }}
                    >
                      {slide.subtitle}
                    </div>
                    {/* Title */}
                    <div
                      style={{
                        fontSize: "clamp(26px, 4.5vw, 42px)",
                        fontWeight: 700,
                        marginBottom: 16,
                        lineHeight: 1.2,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(20px)",
                        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 450ms",
                        background: `linear-gradient(135deg, #fff 20%, ${BRAND.orangeLight} 70%, ${BRAND.orange} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {slide.title}
                    </div>
                    {/* Description */}
                    <div
                      style={{
                        fontSize: "clamp(14px, 1.8vw, 17px)",
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.8,
                        marginBottom: 28,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(15px)",
                        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 550ms",
                      }}
                    >
                      {slide.description}
                    </div>
                    {/* Bullets as horizontal feature cards */}
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
                            background: "rgba(15, 23, 42, 0.6)",
                            border: "1px solid rgba(88,119,230,0.1)",
                            backdropFilter: "blur(10px)",
                            opacity: active ? 1 : 0,
                            transform: active ? "translateX(0)" : "translateX(25px)",
                            transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${650 + bi * 140}ms`,
                          }}
                        >
                          {/* Animated dot with ring */}
                          <div style={{ position: "relative", width: 20, height: 20, flexShrink: 0 }}>
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                border: `1px solid ${bi === 0 ? BRAND.orange : bi === 1 ? BRAND.royalBlue : BRAND.blueBright}`,
                                opacity: 0.3,
                                animation: active ? `aiNodePulse ${2.5 + bi * 0.3}s ease-in-out infinite` : "none",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${BRAND.orange}, ${BRAND.royalBlue})`,
                                boxShadow: `0 0 8px rgba(254,117,1,0.3)`,
                              }}
                            />
                          </div>
                          <div style={{ fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                            {b}
                          </div>
                        </div>
                      ))}
                    </div>
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
