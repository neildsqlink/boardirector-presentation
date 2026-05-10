// Build a native PPTX where every element is a real PowerPoint shape/text/image.
// Editable on stage. Closest visual match to the React deck within PowerPoint's limits.
//
// Usage: node build-pptx-native.mjs

import pptxgen from "pptxgenjs";
import { resolve } from "path";

const OUTPUT = resolve("./Boardirector-NimbusSummIT2026-native.pptx");

// ─── Brand tokens (mirrors presentation-nimbus.jsx) ───
const B = {
  bigStone:   "172134",
  royalBlue:  "5877E6",
  gullGray:   "9AA2B3",
  cadetBlue:  "ADB4C6",
  athensGray: "E7E8EC",
  whisper:    "E7EEFF",
  white:      "FFFFFF",
  orange:     "FE7501",
  orangeLight:"FF9A3E",
  teal:       "2ABFBF",
  red:        "E54848",
  green:      "16A34A",
  paleGreen:  "EAF8EF",
  palePink:   "FCEFEF",
  fontHeb:    "Rubik",
  fontEn:     "Inter",
};

// ─── Slide dimensions (LAYOUT_WIDE = 13.333" x 7.5") ───
const W = 13.333;
const H = 7.5;
const FOOTER_H = 0.4;
const PAD_X = 0.6;
const TITLE_Y = 0.45;

// ─── Helpers ───
function addFooter(slide) {
  // Dark footer bar
  slide.addShape("rect", {
    x: 0, y: H - FOOTER_H, w: W, h: FOOTER_H,
    fill: { color: B.bigStone },
    line: { type: "none" },
  });
  // Left: brand text (no charSpacing — that inflated width too aggressively)
  slide.addText("Boardirector · Nimbus SummIT 2026", {
    x: 0.45, y: H - FOOTER_H, w: 8, h: FOOTER_H,
    fontSize: 10, fontFace: B.fontEn, color: B.white, transparency: 40,
    align: "left", valign: "middle",
  });
  // Right: "A PRODUCT OF" label + SQlink logo image
  slide.addText("A PRODUCT OF", {
    x: W - 4.7, y: H - FOOTER_H, w: 3, h: FOOTER_H,
    fontSize: 8, fontFace: B.fontEn, color: B.white, transparency: 50,
    align: "right", valign: "middle",
  });
  try {
    slide.addImage({
      path: "./public/sqlink-white.png",
      x: W - 1.5, y: H - FOOTER_H + 0.08, w: 1.1, h: FOOTER_H - 0.16,
      sizing: { type: "contain", w: 1.1, h: FOOTER_H - 0.16 },
    });
  } catch (e) {}
}

function addDeco(slide, color, side = "right", size = 3.5, opacity = 0.08) {
  // Soft decorative circle bleeding off-slide
  const x = side === "right" ? W - size * 0.55 : -size * 0.45;
  const y = -size * 0.45;
  slide.addShape("ellipse", {
    x, y, w: size, h: size,
    fill: { color, transparency: 100 - opacity * 100 },
    line: { type: "none" },
  });
}

function addTitle(slide, text, { y = TITLE_Y, color = B.bigStone, size = 30, align = "center" } = {}) {
  slide.addText(text, {
    x: PAD_X, y, w: W - PAD_X * 2, h: 0.7,
    fontSize: size, bold: true, fontFace: B.fontHeb,
    color, align, valign: "top",
  });
}

function addSubtitle(slide, text, { y = 1.15, size = 14, color = B.gullGray } = {}) {
  slide.addText(text, {
    x: PAD_X, y, w: W - PAD_X * 2, h: 0.5,
    fontSize: size, fontFace: B.fontHeb, color,
    align: "center", valign: "top",
  });
}

// Card with optional top accent stripe
function addCard(slide, { x, y, w, h, accent, fill = B.white, radius = 0.12, shadow = true }) {
  slide.addShape("roundRect", {
    x, y, w, h,
    fill: { color: fill },
    line: { color: B.athensGray, width: 0.75 },
    rectRadius: radius,
    ...(shadow && { shadow: { type: "outer", blur: 8, offset: 2, angle: 90, color: "000000", opacity: 0.06 } }),
  });
  if (accent) {
    // Top accent stripe — 4px tall (~0.04"), inset slightly
    slide.addShape("rect", {
      x: x + 0.04, y: y + 0.02, w: w - 0.08, h: 0.05,
      fill: { color: accent }, line: { type: "none" },
    });
  }
}

// Right-edge accent bar (for RTL list rows)
function addRightAccent(slide, { x, y, w, h, color }) {
  slide.addShape("rect", {
    x: x + w - 0.05, y, w: 0.05, h,
    fill: { color }, line: { type: "none" },
  });
}

// Filled circle "bullet"
function addBullet(slide, { cx, cy, r, color, fill }) {
  slide.addShape("ellipse", {
    x: cx - r, y: cy - r, w: r * 2, h: r * 2,
    fill: { color: fill || color },
    line: { type: "none" },
  });
}

// AI badge (small gradient pill with "AI" text)
function addAIBadge(slide, { x, y, w = 0.45, h = 0.22 }) {
  slide.addShape("roundRect", {
    x, y, w, h,
    fill: { color: B.orange }, // pptxgenjs only supports solid fills here; gradient via 2 stacked shapes is overkill
    line: { type: "none" },
    rectRadius: 0.05,
  });
  slide.addText("AI", {
    x, y, w, h,
    fontSize: 8, bold: true, fontFace: B.fontEn,
    color: B.white, align: "center", valign: "middle",
    charSpacing: 2,
  });
}

// ─── SLIDES (mirror presentation-nimbus.jsx) ───
const SLIDES = [
  {
    id: "hero", type: "hero-event",
    eventTag: "NIMBUS SUMMIT 2026",
    title: "ניהול חכם של ועדות וישיבות בעולם החדש",
    speaker: "ניל דהאן",
    role: "VP Product · Boardirector · SQLink Group",
    avatar: "./public/avatar-neil.png",
  },
  {
    id: "pain", type: "pain-list",
    title: "המציאות שכולנו מכירים",
    intro: "כל גוף ציבורי מנהל עשרות ועדות. כל ועדה — ישיבות, החלטות, משימות. ואיך כל זה מנוהל ברוב הארגונים?",
    items: [
      "פרוטוקולים בוורד",
      "סדרי יום במייל",
      "משימות באקסל",
      "מסמכים בתיקייה שאף אחד לא מוצא",
    ],
    footer: "זה עובד. איכשהו. עד שמישהו שואל שאלות.",
  },
  {
    id: "stats", type: "stats4",
    title: "הבעיה במספרים",
    subtitle: "מה שקורה בארגון ציבורי ממוצע",
    stats: [
      { num: "10–30", label: "ועדות קבועות", sub: "בארגון ממוצע", color: B.royalBlue },
      { num: "4–12",  label: "ישיבות בשנה", sub: "לכל ועדה",     color: B.teal },
      { num: "מאות",  label: "ישיבות בשנה", sub: "בגוף ציבורי",   color: B.orange },
      { num: "אלפי",  label: "החלטות ומשימות", sub: "בלי מקום אחד", color: B.red },
    ],
    footer: "ואין מקום אחד שאפשר להיכנס אליו ולראות תמונה מלאה.",
  },
  {
    id: "responsibility", type: "responsibility",
    title: "אחריות שמתפזרת",
    subtitle: "הבעיה הכי גדולה היא לא הפיזור — זה שהאחריות מתפזרת ביחד עם המידע",
    pairs: [
      { good: "החלטות מתקבלות", bad: "לא מגיעות לאנשים הנכונים" },
      { good: "דדליינים נקבעים", bad: "אף אחד לא עוקב" },
      { good: "נושאים רגולטוריים חובה", bad: "נשכחים עד שהביקורת מגיעה" },
    ],
  },
  {
    id: "risk", type: "risk",
    title: "סיכון אמיתי",
    subtitle: "לא רק עניין של יעילות — סיכון משפטי, רגולטורי, ותדמיתי",
    risks: [
      { sector: "מבקר המדינה",   desc: "ממצאי ביקורת על תיעוד ומעקב",       color: B.red },
      { sector: "חופש המידע",     desc: "חשיפה ציבורית של פערים בתהליך",      color: B.orange },
      { sector: "עתירות",          desc: "פער בתיעוד הוא ממצא שמחכה לקרות",   color: B.royalBlue },
    ],
    closing: "אז איך עושים את זה אחרת ב-2026?",
  },
  {
    id: "approach", type: "approach",
    eyebrow: "הגישה החדשה",
    title: "מקום אחד שמחזיק את הכול",
    subtitle: "מערכת אחת לכל מחזור החיים — מהגדרת הוועדה ועד מעקב כל החלטה ומשימה",
    pills: ["ועדות","ישיבות","סדרי יום","פרוטוקולים","החלטות","משימות","מסמכים","דוחות","AI"],
  },
  {
    id: "coverage", type: "coverage",
    title: "מה יש לכם במקום אחד",
    items: [
      { text: "ועדות מוגדרות עם חברים, הרשאות, ותוכנית עבודה שנתית — עם מעקב והתראות", color: B.royalBlue },
      { text: "ישיבות נוצרות בדקות — סדר יום, מסמכים, וספר ישיבה דיגיטלי למשתתפים", color: B.teal },
      { text: "פרוטוקולים במחזור חיים מסודר — טיוטה, אישור, חתימה דיגיטלית, והפצה", color: B.orange },
      { text: "החלטות מתועדות ומקושרות — ניתנות לאיתור תוך שניות", color: B.royalBlue },
      { text: "משימות עם אחראי, דדליין, ומעקב אוטומטי", color: B.teal },
      { text: "דוחות וייצוא — נוכחות, החלטות, משימות, הרשאות. מוכנות מלאה לביקורת.", color: B.orange },
    ],
    screenshot: "./public/screenshots/meetings.png",
  },
  {
    id: "decision-tracker", type: "decision-tracker",
    title: "כל ההחלטות במקום אחד",
    subtitle: "מעקב מלא אחרי כל החלטה — מהדיון, דרך המשימות, ועד הביצוע",
    screenshot: "./public/screenshots/decision-tracker.png",
    badge: "Decision Tracker",
    badgeColor: B.teal,
    highlights: [
      "כל החלטה מקושרת לוועדה, לנושא ולישיבה",
      "אחראי, סטטוס, ותאריך יעד לכל פריט",
      "מעקב משימות שנגזרו מההחלטה",
      "סינון לפי ועדה, תאריך, ומצב ביצוע",
    ],
    footer: "ביקורת ורגולציה? הכול מתועד, חתום, וזמין — בלחיצת כפתור.",
  },
  {
    id: "dashboard", type: "dashboard",
    title: "הכול בתצוגה אחת",
    subtitle: "הדשבורד האישי — כל מה שדורש את תשומת הלב שלכם, במקום אחד",
    screenshot: "./public/screenshots/dashboard.png",
    badge: "Personal Dashboard",
    badgeColor: B.orange,
    highlights: [
      "ישיבות קרובות עם גישה מהירה לחומרים",
      "המשימות שלי — לפי דחיפות וסטטוס",
      "החלטות שדורשות מעקב או אישור",
      "מבט מלא על הפעילות בכל הוועדות",
    ],
  },
  {
    id: "before-after", type: "before-after",
    title: "לפני ואחרי",
    before: { label: "העולם הישן", items: ["פרוטוקולים בוורד","סדרי יום במייל","משימות באקסל","מסמכים בתיקייה משותפת","מעקב ידני (או בכלל לא)"] },
    after:  { label: "העולם החדש", items: ["מקום אחד לכל הוועדות","ספר ישיבה דיגיטלי","מעקב אוטומטי אחרי כל החלטה","הרשאות והפצה מבוקרת","שקיפות מלאה — בלחיצת כפתור"] },
    transition: "ועכשיו נוסיף לזה AI...",
  },
  {
    id: "meeting-page-ai", type: "meeting-page-ai",
    title: "ישיבה נוצרת בדקות",
    subtitle: "סדר היום נבנה אוטומטית — לפי תוכנית עבודה, רגולציה, וועדה",
    screenshot: "./slide-frames/slide-11.png",   // capture already shows the popup
  },
  {
    id: "meeting-book-chat", type: "meeting-book-chat",
    title: "שאלו את המסמכים",
    subtitle: "AI Assistant בתוך תיק הישיבה — תשובות מיידיות על כל מסמך, פרוטוקול, או החלטה",
    screenshot: "./slide-frames/slide-12.png",   // capture already shows the chat
  },
  {
    id: "ai-capabilities", type: "ai-capabilities",
    title: "וזה רק חלק מהיכולות",
    subtitle: "ראיתם את ה-AI בפעולה. הנה עוד דברים שהוא עושה ברקע — בכל ישיבה, בכל פרוטוקול, בכל החלטה.",
    capabilities: [
      { title: "סיכום פרוטוקול אוטומטי",    desc: "מנתח את הדיון, מזהה החלטות מפתח, ומפיק סיכום מובנה — בלחיצה אחת." },
      { title: "הפקת החלטות מהדיון",        desc: "מזהה החלטות שנאמרו במהלך הישיבה ויוצר רשומות מובנות — נושא, ניסוח, תומכים ומתנגדים." },
      { title: "משימות מהחלטות — אוטומטית",  desc: "מכל החלטה המערכת מציעה משימה, אחראי, ותאריך יעד. אתם רק מאשרים." },
      { title: "הצעות חכמות לאחראים",        desc: "ה-AI מציע את האחראי המתאים על בסיס הרכב הוועדה והיסטוריית הפעולות." },
    ],
    footer: "במקום לחפש ולכתוב — אתם מאשרים. AI שעובד לצידכם, לא במקומכם.",
  },
  {
    id: "field", type: "field-results",
    title: "מה קורה בשטח",
    subtitle: "ארגונים שעבדו איתנו, עם עשרות ועדות פעילות",
    results: [
      { before: "שעות הכנה לישיבה",         after: "דקות",                           color: B.royalBlue },
      { before: "ימים לאיתור החלטה ישנה",   after: "שניות",                          color: B.orange },
      { before: "רדיפה אחרי חתימות",         after: "תהליך אישור דיגיטלי חכם",        color: B.green },
    ],
  },
  {
    id: "why-now", type: "why-now",
    title: "למה דווקא עכשיו?",
    subtitle: "שלושה דברים שקורים במקביל ב-2026",
    reasons: [
      { title: "הרגולציה מתהדקת", desc: "דרישות תיעוד ושקיפות הולכות וגדלות בכל המגזרים", color: B.royalBlue },
      { title: "ה-AI הבשיל",      desc: "מה שלפני שנתיים היה מילת באז — היום זה כלי עבודה אמיתי", color: B.orange },
      { title: "הציפיות השתנו",    desc: "ראשי רשויות, מנכ״לים, דירקטורים — רוצים דשבורד, לא אקסל במייל", color: B.teal },
    ],
    closing: "ארגון שמנהל ועדות בלי מערכת ייעודית ב-2026 — זה כמו ארגון שניהל פיננסים בלי ERP ב-2005.",
  },
  {
    id: "summary", type: "summary",
    title: "לסיכום",
    items: [
      { label: "הבעיה",     text: "מידע מפוזר, אחריות שמתפזרת, סיכון שגדל",       color: B.red },
      { label: "הפתרון",     text: "מערכת אחת שמחברת הכול, עם AI ושקיפות מלאה",     color: B.royalBlue },
      { label: "למה עכשיו",  text: "הרגולציה, הטכנולוגיה, וציפיות הנהלות השתנו",   color: B.orange },
    ],
    quote: "ההחלטות שמתקבלות בישיבות הן הלב הפועם של כל ארגון.",
    question: "השאלה היא רק אם אתם יודעים מה קורה איתן אחרי שכולם יוצאים מהחדר.",
  },
  {
    id: "cta", type: "cta-end",
    headline: "תודה רבה",
    subtitle: "Boardirector · ניהול חכם של ועדות וישיבות",
    cta: "בואו לביתן שלנו לראות את המערכת בפעולה",
    cta2: "או תאמו דמו אישי מותאם לארגון שלכם",
    contact: { email: "neild@sqlink.com", site: "boardirector.com" },
    speaker: "ניל דהאן · VP Product",
  },
];

// ─── Slide renderers ───
function slideHero(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.royalBlue, "right", 4);
  addDeco(s, B.orange, "left", 3.5, 0.06);

  // Event tag
  s.addText(d.eventTag, {
    x: 0, y: 1.4, w: W, h: 0.4,
    fontSize: 11, bold: false, fontFace: B.fontEn,
    color: B.gullGray, align: "center", charSpacing: 8,
  });
  // Title
  s.addText(d.title, {
    x: 1.0, y: 2.0, w: W - 2.0, h: 1.6,
    fontSize: 36, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "center", valign: "top",
  });
  // Avatar (using image)
  try {
    s.addImage({ path: d.avatar, x: W / 2 - 0.35, y: 4.6, w: 0.7, h: 0.7,
      sizing: { type: "cover", w: 0.7, h: 0.7 } });
  } catch (e) {}
  // Speaker
  s.addText(d.speaker, {
    x: 0, y: 5.45, w: W, h: 0.32,
    fontSize: 16, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "center",
  });
  s.addText(d.role, {
    x: 0, y: 5.78, w: W, h: 0.3,
    fontSize: 11, fontFace: B.fontEn,
    color: B.gullGray, align: "center",
  });

  addFooter(s);
  return s;
}

function slidePainList(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.red, "left", 3.5);

  addTitle(s, d.title, { size: 32 });
  s.addText(d.intro, {
    x: 1.5, y: 1.2, w: W - 3, h: 0.8,
    fontSize: 13, fontFace: B.fontHeb, color: B.gullGray,
    align: "center", valign: "top",
  });

  const rowH = 0.62;
  const rowGap = 0.14;
  const startY = 2.4;
  const rowW = 8.2;
  const rowX = (W - rowW) / 2;

  d.items.forEach((item, i) => {
    const y = startY + i * (rowH + rowGap);
    addCard(s, { x: rowX, y, w: rowW, h: rowH, fill: B.white });
    addRightAccent(s, { x: rowX, y, w: rowW, h: rowH, color: B.red });
    // Icon placeholder — colored circle
    addBullet(s, { cx: rowX + rowW - 0.45, cy: y + rowH / 2, r: 0.12, fill: B.red });
    // Label (RTL)
    s.addText(item, {
      x: rowX + 0.3, y, w: rowW - 0.9, h: rowH,
      fontSize: 14, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
    // X mark on the left
    s.addText("✕", {
      x: rowX + 0.15, y, w: 0.3, h: rowH,
      fontSize: 16, color: B.red, align: "center", valign: "middle",
    });
  });

  // Footer line
  s.addText(d.footer, {
    x: 1, y: H - FOOTER_H - 0.7, w: W - 2, h: 0.4,
    fontSize: 14, italic: true, bold: true,
    fontFace: B.fontHeb, color: B.orange, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideStats4(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.orange, "right");

  addTitle(s, d.title);
  addSubtitle(s, d.subtitle);

  const cardW = 2.5;
  const cardH = 2.4;
  const gap = 0.2;
  const totalW = cardW * 4 + gap * 3;
  const startX = (W - totalW) / 2;
  const startY = 2.4;

  d.stats.forEach((st, i) => {
    const x = startX + i * (cardW + gap);
    addCard(s, { x, y: startY, w: cardW, h: cardH, accent: st.color });
    s.addText(st.num, {
      x, y: startY + 0.45, w: cardW, h: 1.0,
      fontSize: 44, bold: true, fontFace: B.fontEn,
      color: st.color, align: "center", valign: "middle",
    });
    s.addText(st.label, {
      x, y: startY + 1.45, w: cardW, h: 0.4,
      fontSize: 13, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "center",
    });
    s.addText(st.sub, {
      x, y: startY + 1.85, w: cardW, h: 0.4,
      fontSize: 10, fontFace: B.fontHeb, color: B.gullGray,
      align: "center",
    });
  });

  s.addText(d.footer, {
    x: 1, y: H - FOOTER_H - 0.7, w: W - 2, h: 0.4,
    fontSize: 14, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideResponsibility(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.red, "right");

  addTitle(s, d.title);
  addSubtitle(s, d.subtitle);

  const rowH = 0.7;
  const gap = 0.18;
  const startY = 2.4;
  const colW = 4.2;
  const arrowW = 0.7;
  const totalW = colW * 2 + arrowW;
  const startX = (W - totalW) / 2;

  d.pairs.forEach((p, i) => {
    const y = startY + i * (rowH + gap);
    // GOOD (right side in RTL flow — visually = first column from left for English layout, but Hebrew text aligns right naturally)
    addCard(s, { x: startX + colW + arrowW, y, w: colW, h: rowH });
    s.addText(p.good, {
      x: startX + colW + arrowW + 0.2, y, w: colW - 0.4, h: rowH,
      fontSize: 14, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
    // "אבל" pill in middle
    s.addShape("roundRect", {
      x: startX + colW + 0.05, y: y + rowH / 2 - 0.15, w: arrowW - 0.1, h: 0.3,
      fill: { color: B.red, transparency: 88 },
      line: { type: "none" }, rectRadius: 0.15,
    });
    s.addText("אבל", {
      x: startX + colW, y: y + rowH / 2 - 0.15, w: arrowW, h: 0.3,
      fontSize: 10, bold: true, fontFace: B.fontHeb,
      color: B.red, align: "center", valign: "middle",
    });
    // BAD (left side)
    s.addShape("roundRect", {
      x: startX, y, w: colW, h: rowH,
      fill: { color: B.red, transparency: 92 },
      line: { color: B.red, width: 0.5, transparency: 70 },
      rectRadius: 0.12,
    });
    s.addText(p.bad, {
      x: startX + 0.2, y, w: colW - 0.4, h: rowH,
      fontSize: 13, fontFace: B.fontHeb,
      color: B.red, align: "right", valign: "middle",
    });
  });

  addFooter(s);
  return s;
}

function slideRisk(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.orange, "left");

  addTitle(s, d.title);
  addSubtitle(s, d.subtitle);

  const rowH = 0.85;
  const gap = 0.14;
  const startY = 2.4;
  const rowW = 9;
  const rowX = (W - rowW) / 2;

  d.risks.forEach((r, i) => {
    const y = startY + i * (rowH + gap);
    addCard(s, { x: rowX, y, w: rowW, h: rowH });
    addRightAccent(s, { x: rowX, y, w: rowW, h: rowH, color: r.color });
    // Sector
    s.addText(r.sector, {
      x: rowX + 0.4, y: y + 0.1, w: rowW - 0.6, h: 0.4,
      fontSize: 16, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
    // Description
    s.addText(r.desc, {
      x: rowX + 0.4, y: y + 0.45, w: rowW - 0.6, h: 0.35,
      fontSize: 12, fontFace: B.fontHeb,
      color: B.gullGray, align: "right", valign: "middle",
    });
  });

  s.addText(d.closing, {
    x: 1, y: H - FOOTER_H - 0.75, w: W - 2, h: 0.5,
    fontSize: 18, bold: true, fontFace: B.fontHeb,
    color: B.orange, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideApproach(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.royalBlue, "right");
  addDeco(s, B.orange, "left", 3.5, 0.06);

  // Eyebrow
  s.addText(d.eyebrow, {
    x: 0, y: 1.0, w: W, h: 0.4,
    fontSize: 11, bold: true, fontFace: B.fontEn,
    color: B.orange, align: "center", charSpacing: 5,
  });
  // Big title
  s.addText(d.title, {
    x: 0.5, y: 1.5, w: W - 1, h: 1.6,
    fontSize: 50, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "center", valign: "top",
  });
  // Subtitle
  s.addText(d.subtitle, {
    x: 1.5, y: 3.4, w: W - 3, h: 0.7,
    fontSize: 14, fontFace: B.fontHeb,
    color: B.gullGray, align: "center", valign: "top",
  });
  // Pills — wrap into 2 rows so they don't overflow
  const pillH = 0.5;
  const pillGap = 0.14;
  const rowGap = 0.16;
  const pillWidths = d.pills.map((p) => Math.max(1.05, p.length * 0.2 + 0.7));
  // Split into 2 roughly-equal rows by total width
  const totalAll = pillWidths.reduce((a, b) => a + b, 0);
  const targetRow = totalAll / 2;
  let acc = 0;
  let splitIdx = d.pills.length;
  for (let i = 0; i < d.pills.length; i++) {
    acc += pillWidths[i];
    if (acc >= targetRow) { splitIdx = i + 1; break; }
  }
  const rows = [
    { items: d.pills.slice(0, splitIdx), widths: pillWidths.slice(0, splitIdx) },
    { items: d.pills.slice(splitIdx),     widths: pillWidths.slice(splitIdx) },
  ];

  rows.forEach((row, rIdx) => {
    if (row.items.length === 0) return;
    const rowTotalW = row.widths.reduce((a, b) => a + b, 0) + pillGap * (row.items.length - 1);
    let curX = (W - rowTotalW) / 2;
    const pillY = 4.35 + rIdx * (pillH + rowGap);
    row.items.forEach((p, i) => {
      const w = row.widths[i];
      const isAi = p === "AI";
      s.addShape("roundRect", {
        x: curX, y: pillY, w, h: pillH,
        fill: { color: isAi ? B.orange : B.white },
        line: { color: isAi ? B.orange : B.athensGray, width: 0.75 },
        rectRadius: 0.25,
        shadow: { type: "outer", blur: isAi ? 8 : 4, offset: isAi ? 2 : 1, angle: 90, color: "000000", opacity: isAi ? 0.18 : 0.05 },
      });
      s.addText(p, {
        x: curX, y: pillY, w, h: pillH,
        fontSize: 13, bold: true,
        fontFace: isAi ? B.fontEn : B.fontHeb,
        color: isAi ? B.white : B.bigStone,
        align: "center", valign: "middle",
        charSpacing: isAi ? 3 : 0,
      });
      curX += w + pillGap;
    });
  });

  addFooter(s);
  return s;
}

function slideCoverage(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.teal, "left");

  // Title at top
  addTitle(s, d.title, { size: 28, align: "right", y: 0.4 });

  const rowH = 0.55;
  const gap = 0.1;
  const listW = 6.4;
  const listX = W - listW - PAD_X;
  const startY = 1.2;

  d.items.forEach((it, i) => {
    const y = startY + i * (rowH + gap);
    addCard(s, { x: listX, y, w: listW, h: rowH });
    addRightAccent(s, { x: listX, y, w: listW, h: rowH, color: it.color });
    addBullet(s, { cx: listX + listW - 0.35, cy: y + rowH / 2, r: 0.1, fill: it.color });
    s.addText(it.text, {
      x: listX + 0.2, y, w: listW - 0.6, h: rowH,
      fontSize: 12, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
  });

  // Screenshot on left
  if (d.screenshot) {
    try {
      s.addImage({ path: d.screenshot,
        x: 0.5, y: 1.2, w: 5.4, h: 4.5,
        sizing: { type: "contain", w: 5.4, h: 4.5 } });
    } catch (e) {}
  }

  addFooter(s);
  return s;
}

function slideScreenshotWithHighlights(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, d.badgeColor, "left");

  // Right column: badge + title + highlights
  const rightW = 5.6;
  const rightX = W - rightW - PAD_X;

  // Badge pill
  s.addShape("roundRect", {
    x: rightX + rightW - 2, y: 0.7, w: 1.8, h: 0.32,
    fill: { color: d.badgeColor, transparency: 88 },
    line: { color: d.badgeColor, width: 0.5, transparency: 70 },
    rectRadius: 0.16,
  });
  s.addText(d.badge, {
    x: rightX + rightW - 2, y: 0.7, w: 1.8, h: 0.32,
    fontSize: 10, bold: true, fontFace: B.fontEn,
    color: d.badgeColor, align: "center", valign: "middle",
  });
  // Title
  s.addText(d.title, {
    x: rightX, y: 1.15, w: rightW, h: 0.85,
    fontSize: 28, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "right", valign: "top",
  });
  // Subtitle
  s.addText(d.subtitle, {
    x: rightX, y: 2.05, w: rightW, h: 0.6,
    fontSize: 13, fontFace: B.fontHeb,
    color: B.gullGray, align: "right", valign: "top",
  });
  // Highlights
  const rowH = 0.5;
  const gap = 0.1;
  const startY = 2.85;
  d.highlights.forEach((h, i) => {
    const y = startY + i * (rowH + gap);
    addCard(s, { x: rightX, y, w: rightW, h: rowH });
    addBullet(s, { cx: rightX + rightW - 0.3, cy: y + rowH / 2, r: 0.09, fill: d.badgeColor });
    s.addText(h, {
      x: rightX + 0.2, y, w: rightW - 0.6, h: rowH,
      fontSize: 12, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
  });
  // Footer (under highlights)
  if (d.footer) {
    s.addText(d.footer, {
      x: rightX, y: 5.85, w: rightW, h: 0.4,
      fontSize: 12, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
  }

  // Screenshot on left
  if (d.screenshot) {
    try {
      s.addImage({ path: d.screenshot,
        x: 0.4, y: 0.6, w: 6.6, h: 5.5,
        sizing: { type: "contain", w: 6.6, h: 5.5 } });
    } catch (e) {}
  }

  addFooter(s);
  return s;
}

function slideBeforeAfter(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.teal, "right");

  addTitle(s, d.title, { size: 32 });

  const colW = 5.2;
  const arrowW = 0.7;
  const totalW = colW * 2 + arrowW;
  const startX = (W - totalW) / 2;
  const startY = 1.5;
  const colH = 4.2;

  // BEFORE (bad) on the right — first thing read in Hebrew RTL
  drawColumn(s, startX + colW + arrowW, startY, colW, colH, d.before, false);
  // Arrow ← points from BEFORE (right) toward AFTER (left)
  s.addText("←", {
    x: startX + colW, y: startY, w: arrowW, h: colH,
    fontSize: 30, fontFace: B.fontEn, color: B.cadetBlue,
    align: "center", valign: "middle",
  });
  // AFTER (good) on the left
  drawColumn(s, startX, startY, colW, colH, d.after, true);

  // Transition line
  s.addText(d.transition, {
    x: 1, y: 6.0, w: W - 2, h: 0.5,
    fontSize: 22, bold: true, fontFace: B.fontHeb,
    color: B.orange, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function drawColumn(s, x, y, w, h, data, isGood) {
  const accent = isGood ? B.green : B.red;
  s.addShape("roundRect", {
    x, y, w, h,
    fill: { color: B.white },
    line: { color: accent, width: 0.5, transparency: 70 },
    rectRadius: 0.18,
    shadow: { type: "outer", blur: 8, offset: 2, angle: 90, color: "000000", opacity: 0.06 },
  });
  // Top accent stripe
  s.addShape("rect", {
    x: x + 0.04, y: y + 0.03, w: w - 0.08, h: 0.05,
    fill: { color: accent }, line: { type: "none" },
  });
  // Label
  s.addText(data.label, {
    x: x + 0.3, y: y + 0.3, w: w - 0.6, h: 0.5,
    fontSize: 20, bold: true, fontFace: B.fontHeb,
    color: accent, align: "right", valign: "middle",
  });
  // Items — each with a circular marker on the right (RTL natural)
  const markerR = 0.13;
  const markerCx = x + w - 0.35;
  data.items.forEach((item, i) => {
    const ity = y + 1.05 + i * 0.55;
    // Circular marker
    s.addShape("ellipse", {
      x: markerCx - markerR, y: ity + 0.18 - markerR, w: markerR * 2, h: markerR * 2,
      fill: { color: accent, transparency: isGood ? 80 : 88 },
      line: { type: "none" },
    });
    s.addText(isGood ? "✓" : "✕", {
      x: markerCx - markerR, y: ity + 0.18 - markerR, w: markerR * 2, h: markerR * 2,
      fontSize: 11, bold: true, fontFace: B.fontEn,
      color: accent, align: "center", valign: "middle",
    });
    // Item text — to the left of the marker
    s.addText(item, {
      x: x + 0.3, y: ity, w: w - 0.95, h: 0.4,
      fontSize: 13, fontFace: B.fontHeb,
      color: isGood ? B.bigStone : B.gullGray,
      align: "right", valign: "middle",
      bold: isGood,
    });
  });
}

function slideAIScreenshot(pres, d) {
  // The captured PNG already contains the React title, popup/chat, and React footer.
  // Render it full-bleed without adding native title/footer to avoid duplication.
  const s = pres.addSlide();
  s.background = { color: B.white };
  if (d.screenshot) {
    try {
      s.addImage({ path: d.screenshot, x: 0, y: 0, w: W, h: H });
    } catch (e) {}
  }
  return s;
}

function slideAICapabilities(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.orange, "right");

  addTitle(s, d.title, { size: 30, y: 0.45 });
  s.addText(d.subtitle, {
    x: 1, y: 1.2, w: W - 2, h: 0.7,
    fontSize: 13, fontFace: B.fontHeb, color: B.gullGray,
    align: "center", valign: "top",
  });

  // 2x2 grid
  const cardW = 5.4;
  const cardH = 1.7;
  const gap = 0.2;
  const totalW = cardW * 2 + gap;
  const totalH = cardH * 2 + gap;
  const startX = (W - totalW) / 2;
  const startY = 2.4;

  d.capabilities.forEach((cap, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    addCard(s, { x, y, w: cardW, h: cardH, accent: B.orange });
    // AI badge
    addAIBadge(s, { x: x + cardW - 0.6, y: y + 0.18, w: 0.45, h: 0.25 });
    // Title
    s.addText(cap.title, {
      x: x + 0.25, y: y + 0.18, w: cardW - 0.95, h: 0.4,
      fontSize: 16, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "right", valign: "middle",
    });
    // Description
    s.addText(cap.desc, {
      x: x + 0.25, y: y + 0.65, w: cardW - 0.5, h: 0.95,
      fontSize: 12, fontFace: B.fontHeb, color: B.gullGray,
      align: "right", valign: "top",
    });
  });

  // Footer line in gradient color (single color since pptxgenjs gradient text is limited)
  s.addText(d.footer, {
    x: 1, y: H - FOOTER_H - 0.6, w: W - 2, h: 0.4,
    fontSize: 14, bold: true, fontFace: B.fontHeb,
    color: B.orange, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideFieldResults(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.teal, "left");

  addTitle(s, d.title, { size: 32 });
  addSubtitle(s, d.subtitle);

  const rowH = 0.95;
  const gap = 0.18;
  const startY = 2.5;
  const colW = 4.4;
  const arrowW = 0.6;
  const totalW = colW * 2 + arrowW;
  const startX = (W - totalW) / 2;

  d.results.forEach((r, i) => {
    const y = startY + i * (rowH + gap);
    // BEFORE — light pink, right side in Hebrew RTL flow
    s.addShape("roundRect", {
      x: startX + colW + arrowW, y, w: colW, h: rowH,
      fill: { color: B.palePink },
      line: { type: "none" }, rectRadius: 0.12,
    });
    s.addText([
      { text: "לפני: ", options: { fontSize: 14, bold: true, color: B.red } },
      { text: r.before, options: { fontSize: 14, color: B.bigStone } },
    ], {
      x: startX + colW + arrowW, y, w: colW, h: rowH,
      fontFace: B.fontHeb, align: "center", valign: "middle",
    });
    // Arrow
    s.addText(">", {
      x: startX + colW, y, w: arrowW, h: rowH,
      fontSize: 28, bold: true, fontFace: B.fontEn,
      color: r.color, align: "center", valign: "middle",
    });
    // AFTER — light green, left side
    s.addShape("roundRect", {
      x: startX, y, w: colW, h: rowH,
      fill: { color: B.paleGreen },
      line: { type: "none" }, rectRadius: 0.12,
    });
    s.addText([
      { text: "אחרי: ", options: { fontSize: 14, bold: true, color: B.green } },
      { text: r.after, options: { fontSize: 22, bold: true, color: B.bigStone } },
    ], {
      x: startX, y, w: colW, h: rowH,
      fontFace: B.fontHeb, align: "center", valign: "middle",
    });
  });

  addFooter(s);
  return s;
}

function slideWhyNow(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.royalBlue, "right");

  addTitle(s, d.title);
  addSubtitle(s, d.subtitle);

  const cardW = 3.3;
  const cardH = 2.2;
  const gap = 0.2;
  const totalW = cardW * 3 + gap * 2;
  const startX = (W - totalW) / 2;
  const startY = 2.5;

  d.reasons.forEach((r, i) => {
    const x = startX + i * (cardW + gap);
    addCard(s, { x, y: startY, w: cardW, h: cardH, accent: r.color });
    // Title (centered, vertically positioned higher without icon)
    s.addText(r.title, {
      x, y: startY + 0.55, w: cardW, h: 0.5,
      fontSize: 18, bold: true, fontFace: B.fontHeb,
      color: B.bigStone, align: "center", valign: "middle",
    });
    // Description
    s.addText(r.desc, {
      x: x + 0.25, y: startY + 1.2, w: cardW - 0.5, h: 0.85,
      fontSize: 12, fontFace: B.fontHeb, color: B.gullGray,
      align: "center", valign: "top",
    });
  });

  // Closing line in dark callout box
  s.addShape("roundRect", {
    x: 1, y: H - FOOTER_H - 1.1, w: W - 2, h: 0.7,
    fill: { color: B.bigStone },
    line: { type: "none" }, rectRadius: 0.1,
  });
  s.addText(d.closing, {
    x: 1.2, y: H - FOOTER_H - 1.1, w: W - 2.4, h: 0.7,
    fontSize: 13, bold: true, fontFace: B.fontHeb,
    color: B.white, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideSummary(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.orange, "left");

  addTitle(s, d.title, { size: 32 });

  const rowH = 0.7;
  const gap = 0.14;
  const startY = 1.6;
  const rowW = 9.4;
  const rowX = (W - rowW) / 2;

  d.items.forEach((it, i) => {
    const y = startY + i * (rowH + gap);
    addCard(s, { x: rowX, y, w: rowW, h: rowH });
    addRightAccent(s, { x: rowX, y, w: rowW, h: rowH, color: it.color });
    s.addText([
      { text: it.label + "  ", options: { fontSize: 16, bold: true, color: it.color } },
      { text: it.text, options: { fontSize: 14, color: B.bigStone } },
    ], {
      x: rowX + 0.3, y, w: rowW - 0.5, h: rowH,
      fontFace: B.fontHeb, align: "right", valign: "middle",
    });
  });

  // Closing quote
  s.addText(d.quote, {
    x: 1, y: 4.4, w: W - 2, h: 0.6,
    fontSize: 22, bold: true, fontFace: B.fontHeb,
    color: B.bigStone, align: "center", valign: "middle",
  });
  s.addText(d.question, {
    x: 1, y: 5.1, w: W - 2, h: 0.6,
    fontSize: 16, bold: true, fontFace: B.fontHeb,
    color: B.orange, align: "center", valign: "middle",
  });

  addFooter(s);
  return s;
}

function slideCTAEnd(pres, d) {
  const s = pres.addSlide();
  s.background = { color: B.white };
  addDeco(s, B.royalBlue, "right");
  addDeco(s, B.orange, "left", 4, 0.07);

  // Headline (gradient-style — using orange as primary)
  s.addText(d.headline, {
    x: 0, y: 1.4, w: W, h: 1.4,
    fontSize: 80, bold: true, fontFace: B.fontHeb,
    color: B.orange, align: "center", valign: "top",
  });
  // Subtitle
  s.addText(d.subtitle, {
    x: 0, y: 2.95, w: W, h: 0.4,
    fontSize: 14, fontFace: B.fontHeb,
    color: B.gullGray, align: "center",
  });
  // CTA button
  s.addShape("roundRect", {
    x: W / 2 - 3, y: 3.65, w: 6, h: 0.65,
    fill: { color: B.orange },
    line: { type: "none" }, rectRadius: 0.12,
    shadow: { type: "outer", blur: 14, offset: 4, angle: 90, color: "000000", opacity: 0.18 },
  });
  s.addText(d.cta, {
    x: W / 2 - 3, y: 3.65, w: 6, h: 0.65,
    fontSize: 16, bold: true, fontFace: B.fontHeb,
    color: B.white, align: "center", valign: "middle",
  });
  // Secondary CTA
  s.addText(d.cta2, {
    x: 0, y: 4.45, w: W, h: 0.35,
    fontSize: 13, fontFace: B.fontHeb,
    color: B.cadetBlue, align: "center",
  });
  // Contact (LTR)
  s.addText([
    { text: "✉  " + d.contact.email + "    ", options: { fontSize: 13, color: B.bigStone } },
    { text: "🌐  " + d.contact.site, options: { fontSize: 13, color: B.bigStone } },
  ], {
    x: 0, y: 5.1, w: W, h: 0.4,
    fontFace: B.fontEn, align: "center",
  });
  // Speaker
  s.addText(d.speaker, {
    x: 0, y: 5.55, w: W, h: 0.32,
    fontSize: 11, fontFace: B.fontHeb,
    color: B.gullGray, align: "center",
  });

  addFooter(s);
  return s;
}

// ─── Slide router ───
function renderSlide(pres, d) {
  switch (d.type) {
    case "hero-event":         return slideHero(pres, d);
    case "pain-list":          return slidePainList(pres, d);
    case "stats4":             return slideStats4(pres, d);
    case "responsibility":     return slideResponsibility(pres, d);
    case "risk":               return slideRisk(pres, d);
    case "approach":           return slideApproach(pres, d);
    case "coverage":           return slideCoverage(pres, d);
    case "decision-tracker":   return slideScreenshotWithHighlights(pres, d);
    case "dashboard":          return slideScreenshotWithHighlights(pres, d);
    case "before-after":       return slideBeforeAfter(pres, d);
    case "meeting-page-ai":    return slideAIScreenshot(pres, d);
    case "meeting-book-chat":  return slideAIScreenshot(pres, d);
    case "ai-capabilities":    return slideAICapabilities(pres, d);
    case "field-results":      return slideFieldResults(pres, d);
    case "why-now":            return slideWhyNow(pres, d);
    case "summary":            return slideSummary(pres, d);
    case "cta-end":            return slideCTAEnd(pres, d);
    default: console.warn("unknown slide type", d.type);
  }
}

// ─── Main ───
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
pres.author = "Neil Dahan";
pres.title = "Boardirector — Nimbus SummIT 2026";
pres.subject = "ניהול חכם של ועדות וישיבות בעולם החדש";

console.log("Building native PPTX...");
for (const slide of SLIDES) {
  console.log("  +", slide.id);
  const s = renderSlide(pres, slide);
  // Slide-level fade transition (gives smooth flow even without element animations)
  if (s) s.transition = { type: "fade", duration: 0.4 };
}

await pres.writeFile({ fileName: OUTPUT });
console.log(`\n✓ Wrote ${OUTPUT}`);
