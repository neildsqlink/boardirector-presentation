import { useState, useEffect, useCallback, useRef } from "react";

// Resolve a public-folder path to the deployed base URL so assets work both
// at "/" (npm run dev) and under "/nimbus2026/" (GitHub Pages).
const A = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

/* ─── Brand Tokens (matches STKI-light) ─── */
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

/* ─── 14 slides matching the speech script ─── */
const SLIDES = [
  // 1. HERO
  {
    id: "hero",
    type: "hero-event",
    eventTag: "Nimbus SummIT 2026",
    brand: "Boardirector",
    title: "ניהול חכם של ועדות וישיבות\nבעולם החדש",
    speaker: "ניל דהאן",
    role: "VP Product · Boardirector · SQLink Group",
  },
  // 2. PAIN
  {
    id: "pain",
    type: "pain-list",
    title: "המציאות שכולנו מכירים",
    intro: "כל גוף ציבורי מנהל עשרות ועדות. כל ועדה — ישיבות, החלטות, משימות.\nואיך כל זה מנוהל ברוב הארגונים?",
    items: [
      { icon: "document", label: "פרוטוקולים מפוזרים בוורד" },
      { icon: "envelope", label: "סדרי יום ומסמכים רגישים במייל" },
      { icon: "chart", label: "משימות באקסל" },
      { icon: "folder", label: "מסמכים בתיקייה שאף אחד לא מוצא" },
    ],
    footer: "זה עובד. איכשהו. עד שמישהו שואל שאלות.",
  },
  // 3. STATS
  {
    id: "stats",
    type: "stats4",
    title: "הבעיה במספרים",
    subtitle: "מה שקורה בארגון ציבורי ממוצע",
    stats: [
      { num: "30+", label: "ועדות קבועות", sub: "בארגון ממוצע", color: "royalBlue" },
      { num: "12+", label: "ישיבות בשנה", sub: "לכל ועדה", color: "teal" },
      { num: "100+", label: "ישיבות בשנה", sub: "בגוף ציבורי", color: "orange" },
      { num: "1000+", label: "החלטות ומשימות", sub: "בלי מקום אחד", color: "red" },
    ],
    footer: "ואין מקום אחד שאפשר להיכנס אליו ולראות תמונה מלאה.",
  },
  // 4. SCATTERED RESPONSIBILITY
  {
    id: "responsibility",
    type: "responsibility",
    title: "אחריות שמתפזרת",
    subtitle: "הבעיה הכי גדולה היא לא הפיזור — זה שהאחריות מתפזרת ביחד עם המידע",
    pairs: [
      { good: "החלטות מתקבלות", bad: "לא מגיעות לאנשים הנכונים" },
      { good: "דדליינים נקבעים", bad: "אף אחד לא עוקב" },
      { good: "נושאים רגולטוריים חובה", bad: "נשכחים עד שהביקורת מגיעה" },
    ],
  },
  // 5. RISK
  {
    id: "risk",
    type: "risk",
    title: "סיכון אמיתי",
    subtitle: "לא רק עניין של יעילות — סיכון משפטי, רגולטורי, ותדמיתי",
    risks: [
      { icon: "scale", sector: "מבקר המדינה", desc: "ממצאי ביקורת על תיעוד ומעקב", color: "red" },
      { icon: "newspaper", sector: "חופש המידע", desc: "חשיפה ציבורית של פערים בתהליך", color: "orange" },
      { icon: "shield", sector: "אבטחת מידע", desc: "שליחת חומרי ישיבה רגישים בערוצים לא מאובטחים", color: "royalBlue" },
    ],
    closing: "אז איך עושים את זה אחרת ב-2026?",
  },
  // 6. NEW APPROACH
  {
    id: "approach",
    type: "approach",
    eyebrow: "הגישה החדשה",
    title: "מקום אחד\nשמחזיק את הכול",
    subtitle: "מערכת אחת לכל מחזור החיים — מהגדרת הוועדה ועד מעקב כל החלטה ומשימה",
    pills: ["ועדות", "ישיבות", "סדרי יום", "פרוטוקולים", "החלטות", "משימות", "מסמכים", "דוחות", "AI"],
  },
  // 7. WHAT THE SYSTEM COVERS
  {
    id: "coverage",
    type: "coverage",
    title: "מה יש לכם במקום אחד",
    items: [
      { icon: "building", text: "ועדות מוגדרות עם חברים, הרשאות, ותוכנית עבודה שנתית — עם מעקב והתראות", color: "royalBlue" },
      { icon: "calendar", text: "ישיבות נוצרות בדקות — סדר יום, מסמכים, וספר ישיבה דיגיטלי למשתתפים", color: "teal" },
      { icon: "pencil", text: "פרוטוקולים במחזור חיים מסודר — טיוטה, אישור, חתימה דיגיטלית, והפצה", color: "orange" },
      { icon: "target", text: "החלטות מתועדות ומקושרות — ניתנות לאיתור תוך שניות", color: "royalBlue" },
      { icon: "check", text: "משימות עם אחראי, דדליין, ומעקב אוטומטי", color: "teal" },
      { icon: "chart", text: "דוחות וייצוא — נוכחות, החלטות, משימות, הרשאות. מוכנות מלאה לביקורת.", color: "orange" },
    ],
    screenshot: A("/screenshots/meetings.png"),
  },
  // 8. CREATE COMMITTEE — start of "from setup to send" flow
  {
    id: "create-committee",
    type: "create-committee",
    title: "הכל מתחיל בהקמת הוועדה",
    subtitle: "שם, צבע, מנהלים, חברים — בפחות מדקה. הרשאות נקבעות אוטומטית.",
    screenshot: A("/screenshots/committees.png"),
    panelTitle: "יצירת ועדה",
    aiTag: "AI מציע מנהלים וחברים מהארגון",
    cancelLabel: "ביטול",
    createLabel: "צור",
    createdLabel: "נוצרה",
    committee: {
      name: "ועדת ביקורת",
      description: "מעקב תהליכי בקרה ואיכות, סקירת דוחות תקופתיים, וטיפול בממצאי ביקורת.",
      prefix: "AUD-2026",
      category: "ועדת חובה",
      colors: ["#F4A6A6", "#9B7DEA", "#FFA940", "#FFD23F", "#34D399", "#5BC0EB", "#5877E6", "#FF6B6B", "#5BB8C9"],
      selectedColor: 6,
      managers: [{ initials: "ד.ל", name: "דנה לוי", bg: "#5877E6" }],
      editors: [{ initials: "א.כ", name: "אבי כהן", bg: "#16A34A" }],
      members: [
        { initials: "ר.ג", name: "רונית גולן", bg: "#FFA940" },
        { initials: "מ.ב", name: "משה ברק", bg: "#9B7DEA" },
        { initials: "ש.ד", name: "שרה דוד", bg: "#FF6B6B" },
        { initials: "י.כ", name: "יעל כהן", bg: "#5BC0EB" },
      ],
    },
  },
  // 9. CREATE MEETING — 3-step wizard with auto-fill
  {
    id: "create-meeting",
    type: "create-meeting",
    title: "ישיבה חדשה",
    subtitle: "פרטים, משתתפים, וזימון — בתהליך מנוהל אחד. שום דבר לא נשכח.",
    screenshot: A("/screenshots/meetings.png"),
    panelTitle: "יצירת ישיבה",
    aiTag: "AI ממלא ועדה, שעות, ומשתתפים",
    cancelLabel: "ביטול",
    nextLabel: "המשך",
    backLabel: "חזרה",
    createLabel: "צור",
    createdLabel: "נוצרה",
    steps: ["פרטים", "משתתפים", "סיכום ושליחה"],
    step1: {
      name: "ישיבת דירקטוריון — Q2 2026",
      committee: "דירקטוריון",
      organizer: "ניל דהאן",
      dateFrom: "20/05/2026",
      dateTo: "20/05/2026",
      timeFrom: "09:00",
      timeTo: "15:00",
      location: "אגף ראשי · 2 ז'בוטינסקי, רמת גן",
      remote: "Zoom",
      timezone: "(UTC+02:00) Jerusalem",
      repetition: "Does Not Repeat",
      description: "סקירה רבעונית של תוצאות, אישור תקציב Q2, דיון ברגולציה.",
    },
    step2: {
      attendees: [
        { name: "דנה לוי", email: "dana@example.com", initials: "ד.ל" },
        { name: "אבי כהן", email: "avi@example.com", initials: "א.כ" },
        { name: "רונית גולן", email: "ronit@example.com", initials: "ר.ג" },
        { name: "משה ברק", email: "moshe@example.com", initials: "מ.ב" },
        { name: "שרה דוד", email: "sarah@example.com", initials: "ש.ד" },
        { name: "יעל כהן", email: "yael@example.com", initials: "י.כ" },
        { name: "תומר אביב", email: "tomer@example.com", initials: "ת.א" },
        { name: "ליאת רן", email: "liat@example.com", initials: "ל.ר" },
      ],
    },
    step3: {
      summary: "ישיבת דירקטוריון — Q2 2026",
      date: "20/05/2026",
      time: "09:00 – 15:00",
      location: "אגף ראשי · 2 ז'בוטינסקי, רמת גן",
      publish: true,
      sendInvite: true,
      messageTitle: "הזמנה לישיבת דירקטוריון Q2 2026",
      message: "שלום,\nאתם מוזמנים לישיבת דירקטוריון Q2 2026 בתאריך 20/05/2026 בשעות 09:00–15:00.\n📍 אגף ראשי · 2 ז'בוטינסקי, רמת גן\n✅ אנא אשרו השתתפותכם.",
    },
  },
  // 10. MEETING PAGE + AI AGENDA POPUP — moved here as the agenda step of the flow
  {
    id: "meeting-page-ai",
    type: "meeting-page-ai",
    title: "סדר יום בנוי לפי תוכנית עבודה",
    subtitle: "ה-AI מציע סעיפים על בסיס תוכנית עבודה, רגולציה, וועדה",
    screenshot: A("/screenshots/meeting-page.png"),
    aiLabel: "AI Agenda Builder",
    aiHeadline: "בונה סדר יום אוטומטי",
    aiCaption: "מבוסס על תוכנית עבודה ודרישות רגולציה",
    agendaItems: [
      "פתיחה והודעות יו״ר",
      "דיווח רבעוני — Q1 2026",
      "אישור תקציב שנתי",
      "סקירה רגולטורית — דרישות חדשות",
      "סיכום והחלטות",
    ],
  },
  // 11. SEND MATERIALS — distribute meeting book to all attendees
  {
    id: "send-materials",
    type: "send-materials",
    title: "ושולחים לכולם — בלחיצה אחת",
    subtitle: "ספר ישיבה דיגיטלי לכל משתתף · סדר יום, מסמכים, החלטות, פרוטוקולים — נגיש מהנייד ומהדסקטופ",
    screenshot: A("/screenshots/meeting-page.png"),
    panelTitle: "שליחת חומרי ישיבה",
    meetingName: "ישיבת דירקטוריון · Q2 2026",
    aiTag: "ספר ישיבה דיגיטלי נשלח לכל משתתף",
    materials: [
      { icon: "calendar", label: "סדר יום מלא" },
      { icon: "document", label: "פרוטוקולים מקושרים" },
      { icon: "target", label: "החלטות לפתיחה" },
      { icon: "folder", label: "מסמכי רקע" },
    ],
    attendees: [
      { name: "דנה לוי", initials: "ד.ל", bg: "#5877E6" },
      { name: "אבי כהן", initials: "א.כ", bg: "#16A34A" },
      { name: "רונית גולן", initials: "ר.ג", bg: "#FFA940" },
      { name: "משה ברק", initials: "מ.ב", bg: "#9B7DEA" },
      { name: "שרה דוד", initials: "ש.ד", bg: "#FF6B6B" },
      { name: "יעל כהן", initials: "י.כ", bg: "#5BC0EB" },
    ],
    buttonLabel: "שלח לכל המשתתפים",
    sentLabel: "נשלח",
  },
  // 12. DECISION TRACKER — proves "everything connected"
  {
    id: "decision-tracker",
    type: "decision-tracker",
    title: "כל ההחלטות במקום אחד",
    subtitle: "מעקב מלא אחרי כל החלטה — מהדיון, דרך המשימות, ועד הביצוע",
    screenshot: A("/screenshots/decision-tracker.png"),
    highlights: [
      { icon: "target", text: "כל החלטה מקושרת לוועדה, לנושא ולישיבה" },
      { icon: "user", text: "אחראי, סטטוס, ותאריך יעד לכל פריט" },
      { icon: "check", text: "מעקב משימות שנגזרו מההחלטה" },
      { icon: "search", text: "סינון לפי ועדה, תאריך, ומצב ביצוע" },
    ],
    footer: "ביקורת ורגולציה? הכול מתועד, חתום, וזמין — בלחיצת כפתור.",
    task: {
      panelTitle: "צור משימה חדשה",
      aiTag: "AI ממלא טופס מההחלטה",
      status: "לעשות",
      name: "מעקב הקצאת תקציב 2026 — Q1",
      assignee: "ניל דהאן",
      dueDate: "30/06/2026",
      priority: "גבוהה",
      description: "מעקב אחרי הקצאת התקציב לרבעון הראשון לפי החלטת הדירקטוריון מ-12.4.2026. נדרש דיווח חודשי לוועדת הכספים.",
      connection: "החלטה · תקציב 2026 · דירקטוריון 12.4.2026",
      cancelLabel: "ביטול",
      createLabel: "צור",
      createdLabel: "נוצר",
    },
  },
  // 9. PERSONAL DASHBOARD
  {
    id: "dashboard",
    type: "dashboard",
    title: "הכול בתצוגה אחת",
    subtitle: "הדשבורד האישי — כל מה שדורש את תשומת הלב שלכם, במקום אחד",
    screenshot: A("/screenshots/dashboard.png"),
    highlights: [
      { icon: "calendar", text: "ישיבות קרובות עם גישה מהירה לחומרים" },
      { icon: "check", text: "המשימות שלי — לפי דחיפות וסטטוס" },
      { icon: "target", text: "החלטות שדורשות מעקב או אישור" },
      { icon: "chart", text: "מבט מלא על הפעילות בכל הוועדות" },
    ],
  },
  // 10. MINUTES APPROVAL — automated sign-off flow
  {
    id: "minutes-approval",
    type: "minutes-approval",
    title: "אישור פרוטוקול דיגיטלי",
    subtitle: "בחרו חברים — שלחו לחתימה דיגיטלית — קבלו עדכון בזמן אמת",
    screenshot: A("/screenshots/meeting-page.png"),
    panelTitle: "אישור פרוטוקול",
    meetingName: "ישיבת דירקטוריון · Q1 2026",
    members: [
      { name: "דנה לוי", role: "יו״ר" },
      { name: "אבי כהן", role: "דירקטור" },
      { name: "רונית גולן", role: "דירקטורית" },
      { name: "משה ברק", role: "דירקטור" },
      { name: "שרה דוד", role: "מבקרת" },
    ],
    buttonLabel: "שלח לחתימה דיגיטלית",
    sentLabel: "נשלח לחתימה",
  },
  // 15. MEETING BOOK + AI CHAT
  {
    id: "meeting-book-chat",
    type: "meeting-book-chat",
    title: "שאלו את המסמכים",
    subtitle: "AI Assistant בתוך תיק הישיבה — תשובות מיידיות על כל מסמך, פרוטוקול, או החלטה",
    screenshot: A("/screenshots/meeting-book.png"),
    aiLabel: "AI Document Assistant",
    question: "מה הוחלט בנושא תקציב 2026 בישיבה האחרונה?",
    answer: "בישיבת הדירקטוריון מ-12.4.2026 אושר תקציב של 47.3M ש״ח לשנת 2026. ההחלטה התקבלה ברוב של 7 מתוך 8 חברים.",
  },
  // 13. AI CAPABILITIES — recap of OTHER AI capabilities (beyond the two demos)
  {
    id: "ai-capabilities",
    type: "ai-capabilities",
    title: "וזה רק חלק מהיכולות",
    subtitle: "ראיתם את ה-AI בפעולה. הנה עוד דברים שהוא עושה ברקע — בכל ישיבה, בכל פרוטוקול, בכל החלטה.",
    capabilities: [
      {
        icon: "document",
        title: "סיכום פרוטוקול אוטומטי",
        desc: "מנתח את הדיון, מזהה החלטות מפתח, ומפיק סיכום מובנה — בלחיצה אחת.",
      },
      {
        icon: "target",
        title: "הפקת החלטות מהדיון",
        desc: "מזהה החלטות שנאמרו במהלך הישיבה ויוצר רשומות מובנות — נושא, ניסוח, תומכים ומתנגדים.",
      },
      {
        icon: "check",
        title: "משימות מהחלטות — אוטומטית",
        desc: "מכל החלטה המערכת מציעה משימה, אחראי, ותאריך יעד. אתם רק מאשרים.",
      },
      {
        icon: "user",
        title: "הצעות חכמות לאחראים",
        desc: "ה-AI מציע את האחראי המתאים על בסיס הרכב הוועדה והיסטוריית הפעולות.",
      },
    ],
    footer: "במקום לחפש ולכתוב — אתם מאשרים. AI שעובד לצידכם, לא במקומכם.",
  },
  // 14. FIELD RESULTS
  {
    id: "field",
    type: "field-results",
    title: "מה קורה בשטח",
    subtitle: "ארגונים שעבדו איתנו, עם עשרות ועדות פעילות",
    results: [
      { before: "שעות הכנה לישיבה", after: "דקות", color: "royalBlue" },
      { before: "ימים לאיתור החלטה ישנה", after: "שניות", color: "orange" },
      { before: "רדיפה אחרי חתימות", after: "תהליך אישור דיגיטלי חכם", color: "teal" },
    ],
  },
  // 15. WHY NOW
  {
    id: "why-now",
    type: "why-now",
    title: "למה דווקא עכשיו?",
    subtitle: "שלושה דברים שקורים במקביל ב-2026",
    reasons: [
      { icon: "scale", title: "הרגולציה מתהדקת", desc: "דרישות תיעוד ושקיפות הולכות וגדלות בכל המגזרים", color: "royalBlue" },
      { icon: "robot", title: "ה-AI הבשיל", desc: "מה שלפני שנתיים היה מילת באז — היום זה כלי עבודה אמיתי", color: "orange" },
      { icon: "chart", title: "הציפיות השתנו", desc: "ראשי רשויות, מנכ״לים, דירקטורים — רוצים דשבורד, לא אקסל במייל", color: "teal" },
    ],
    closing: "ארגון שמנהל ועדות בלי מערכת ייעודית ב-2026 — זה כמו ארגון שניהל פיננסים בלי ERP ב-2005.",
  },
  // 16. SUMMARY
  {
    id: "summary",
    type: "summary",
    title: "לסיכום",
    items: [
      { label: "הבעיה", text: "מידע מפוזר, אחריות שמתפזרת, סיכון שגדל", color: "red" },
      { label: "הפתרון", text: "מערכת אחת שמחברת הכול, עם AI ושקיפות מלאה", color: "royalBlue" },
      { label: "למה עכשיו", text: "הרגולציה, הטכנולוגיה, וציפיות הנהלות השתנו", color: "orange" },
    ],
    quote: "ההחלטות שמתקבלות בישיבות הן הלב הפועם של כל ארגון.",
    question: "השאלה היא רק אם אתם יודעים מה קורה איתן אחרי שכולם יוצאים מהחדר.",
  },
  // 17. CTA / END
  {
    id: "cta",
    type: "cta-end",
    headline: "תודה רבה",
    subtitle: "Boardirector · ניהול חכם של ועדות וישיבות",
    cta: "בואו לביתן שלנו לראות את המערכת בפעולה",
    cta2: "או תאמו דמו אישי מותאם לארגון שלכם",
    contact: { email: "neild@sqlink.com", site: "boardirector.com" },
    speaker: "ניל דהאן · VP Product",
  },
];

const ACCENTS = {
  hero: "royalBlue",
  pain: "red",
  stats: "orange",
  responsibility: "red",
  risk: "orange",
  approach: "royalBlue",
  coverage: "teal",
  "create-committee": "royalBlue",
  "create-meeting": "orange",
  "meeting-page-ai": "orange",
  "send-materials": "teal",
  "meeting-book-chat": "royalBlue",
  "decision-tracker": "teal",
  dashboard: "orange",
  "minutes-approval": "teal",
  "ai-capabilities": "orange",
  field: "teal",
  "why-now": "royalBlue",
  summary: "orange",
  cta: "royalBlue",
};

const CIRCLE_POS = {
  hero: { top: "-130px", right: "-130px", left: "auto" },
  pain: { top: "-120px", left: "-120px", right: "auto" },
  stats: { top: "-110px", right: "-110px", left: "auto" },
  responsibility: { bottom: "-160px", right: "-160px", left: "auto", top: "auto" },
  risk: { top: "-130px", left: "-130px", right: "auto" },
  approach: { top: "-140px", right: "-140px", left: "auto" },
  coverage: { bottom: "-180px", left: "-180px", right: "auto", top: "auto" },
  "create-committee": { top: "-130px", left: "-130px", right: "auto" },
  "create-meeting": { top: "-130px", right: "-130px", left: "auto" },
  "meeting-page-ai": { top: "-130px", right: "-130px", left: "auto" },
  "send-materials": { bottom: "-170px", left: "-170px", right: "auto", top: "auto" },
  "meeting-book-chat": { bottom: "-170px", left: "-170px", right: "auto", top: "auto" },
  "decision-tracker": { top: "-110px", left: "-110px", right: "auto" },
  dashboard: { top: "-130px", right: "-130px", left: "auto" },
  "minutes-approval": { top: "-110px", left: "-110px", right: "auto" },
  "ai-capabilities": { top: "-140px", right: "-140px", left: "auto" },
  field: { top: "-120px", left: "-120px", right: "auto" },
  "why-now": { bottom: "-180px", right: "-180px", left: "auto", top: "auto" },
  summary: { top: "-130px", left: "-130px", right: "auto" },
  cta: { top: "-150px", right: "-150px", left: "auto" },
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
      {/* Left: Boardirector + event tag (LTR span inside RTL page) */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
        <BDLogo size={20} color={B.orange} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 2, fontWeight: 400 }}>
          Boardirector · Nimbus SummIT 2026
        </span>
      </div>
      {/* Right: SQLink logo (forced LTR so "A PRODUCT OF" sits left of the logo) */}
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

function AIPulse({ active, accent = B.orange }) {
  return (
    <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            border: `2px solid ${accent}`,
            borderRadius: "50%",
            opacity: 0,
            animation: active ? `aiPulse 2.4s ease-out ${i * 0.8}s infinite` : "none",
          }}
        />
      ))}
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 28px ${accent}55`,
          color: B.white,
          fontWeight: 800,
          fontSize: 22,
          fontFamily: `'${B.fontEn}', sans-serif`,
          letterSpacing: 2,
        }}
      >
        AI
      </div>
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

/* ─── Flat icon library (replaces emojis) ─── */
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
      return (
        <svg {...p}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          <path d="M8 13h8M8 17h8M8 9h2" />
        </svg>
      );
    case "envelope":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 7 9-7" />
        </svg>
      );
    case "chart":
      return (
        <svg {...p}>
          <path d="M3 3v18h18" />
          <rect x="7" y="13" width="3" height="6" />
          <rect x="12" y="9" width="3" height="10" />
          <rect x="17" y="5" width="3" height="14" />
        </svg>
      );
    case "folder":
      return (
        <svg {...p}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "scale":
      return (
        <svg {...p}>
          <path d="M12 4v17" />
          <path d="M8 21h8" />
          <path d="M4 7h16" />
          <path d="M5 7l-2.5 5a3 3 0 0 0 5 0L5 7z" />
          <path d="M19 7l-2.5 5a3 3 0 0 0 5 0L19 7z" />
        </svg>
      );
    case "newspaper":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h10M7 16h7" />
        </svg>
      );
    case "petition":
      return (
        <svg {...p}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          <path d="M9 13.5l2 2 4-4" />
        </svg>
      );
    case "building":
      return (
        <svg {...p}>
          <path d="M3 21h18" />
          <path d="M5 21V9l7-4 7 4v12" />
          <path d="M9 21v-5h6v5" />
          <path d="M9 12h.01M15 12h.01" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8 14h2M14 14h2M8 18h2" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...p}>
          <path d="M16 3l5 5-12 12H4v-5z" />
          <path d="M13 6l5 5" />
        </svg>
      );
    case "target":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.6" fill={color} stroke="none" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l3 3 5-6" />
        </svg>
      );
    case "user":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21" />
        </svg>
      );
    case "robot":
      return (
        <svg {...p}>
          <rect x="4" y="8" width="16" height="12" rx="3" />
          <circle cx="9" cy="14" r="1.4" fill={color} stroke="none" />
          <circle cx="15" cy="14" r="1.4" fill={color} stroke="none" />
          <path d="M12 4v4M9 4h6" />
          <path d="M2 13v3M22 13v3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9" />
          <path d="M12 3a14 14 0 0 0-4 9 14 14 0 0 0 4 9" />
        </svg>
      );
    case "mail":
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 8l9 6 9-6" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...p}>
          <path d="M13 2L4 14h6l-2 8 9-12h-6z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── MAIN ─── */
export default function PresentationNimbus() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [started, setStarted] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayInterval = 7000;

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
      if (e.key === "p" || e.key === "P") setAutoPlay((a) => !a);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  useEffect(() => {
    if (!autoPlay || !started) return;
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

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes aiPulse { 0% { transform: scale(0.85); opacity: 0.65; } 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes particleFloat { 0%, 100% { transform: translate(0, 0); opacity: 0.15; } 50% { transform: translate(8px, -14px); opacity: 0.35; } }
        @keyframes scanLine { 0% { transform: translateY(-100%); opacity: 0; } 25% { opacity: 1; } 75% { opacity: 1; } 100% { transform: translateY(120%); opacity: 0; } }
        @keyframes spinGradient { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blinkCaret { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes typingDot { 0%, 80%, 100% { transform: translateY(0) scale(0.85); opacity: 0.4; } 40% { transform: translateY(-3px) scale(1.1); opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.06); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }

        /* Animated conic-gradient angle (no element rotation) */
        @property --ai-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes spinAngle { from { --ai-angle: 0deg; } to { --ai-angle: 360deg; } }
        .ai-rim, .ai-rim-glow { animation: spinAngle 3s linear infinite; }
        /* Fallback for browsers without @property — fall back to a static conic gradient */
        @supports not (background: conic-gradient(from var(--ai-angle, 0deg), red, blue)) {
          .ai-rim, .ai-rim-glow { animation: none; }
        }
        ::selection { background: rgba(254,117,1,0.2); }
      `}</style>

      <ProgressBar current={started ? current : -1} total={SLIDES.length} />

      {autoPlay && (
        <div style={{ position: "fixed", top: 16, left: 16, zIndex: 9999, background: "rgba(88,119,230,0.9)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: `'${B.fontEn}', sans-serif`, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "breathe 1.5s ease infinite" }} />
          AUTO-PLAY
        </div>
      )}


      {/* SLIDES */}
      <div style={{ position: "absolute", inset: 0, opacity: started ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
        {SLIDES.map((slide, i) => {
          const active = current === i && started;
          const accent = tone(ACCENTS[slide.id] || "royalBlue");
          const circlePos = CIRCLE_POS[slide.id] || { top: "-120px", right: "-120px", left: "auto" };
          return renderSlide(slide, i, active, accent, circlePos);
        })}
      </div>

      {/* NAV DOTS */}
      {started && (
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
      )}

      {started && (
        <div data-export-hide="true" style={{ position: "fixed", bottom: 64, left: 30, fontSize: 12, color: B.cadetBlue, zIndex: 101, direction: "ltr", opacity: 0.5 }}>
          ← → · P for autoplay
        </div>
      )}

      {started && (
        <div data-export-hide="true" style={{ position: "fixed", bottom: 64, right: 30, fontSize: 12, color: B.cadetBlue, zIndex: 101, fontFamily: `'${B.fontEn}', sans-serif`, opacity: 0.6 }}>
          {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </div>
      )}

      <FooterBar />
    </div>
  );
}

/* ─── Slide router ─── */
function renderSlide(slide, idx, active, accent, circlePos) {
  switch (slide.type) {
    case "hero-event": return <HeroEvent key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "pain-list": return <PainList key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "stats4": return <Stats4 key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "responsibility": return <Responsibility key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "risk": return <Risk key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "approach": return <Approach key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "coverage": return <Coverage key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "create-committee": return <CreateCommittee key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "create-meeting": return <CreateMeeting key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "send-materials": return <SendMaterials key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "meeting-page-ai": return <MeetingPageAI key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "meeting-book-chat": return <MeetingBookChat key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "decision-tracker": return <DecisionTracker key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "dashboard": return <DashboardSlide key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "minutes-approval": return <MinutesApproval key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "ai-capabilities": return <AICapabilities key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "field-results": return <FieldResults key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "why-now": return <WhyNow key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "summary": return <Summary key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    case "cta-end": return <CTAEnd key={slide.id} slide={slide} active={active} accent={accent} circlePos={circlePos} />;
    default: return null;
  }
}

/* ─── 1. HERO (matches intro layout — no big "Boardirector" word) ─── */
function HeroEvent({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-180px", left: "-180px", right: "auto", top: "auto" }} size={380} opacity={0.06} />
      <div style={{ textAlign: "center", zIndex: 2, maxWidth: 920 }}>
        <div style={{ marginBottom: 24 }}><BDLogo size={88} /></div>
        <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: 8, color: B.gullGray, marginBottom: 20, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms", textTransform: "uppercase", fontFamily: `'${B.fontEn}', sans-serif` }}>
          {slide.eventTag}
        </div>
        <StaggerText
          text={slide.title}
          active={active}
          baseDelay={400}
          style={{ fontSize: "clamp(30px, 5.5vw, 50px)", fontWeight: 700, lineHeight: 1.3, color: B.bigStone }}
        />
        <div style={{ marginTop: 50, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 900ms" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", boxShadow: `0 4px 14px rgba(23,33,52,0.18), 0 0 0 2px ${B.white}, 0 0 0 4px ${B.orange}30`, flexShrink: 0 }}>
            <img src={A("/avatar-neil.png")} alt={slide.speaker} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

/* ─── 2. PAIN LIST ─── */
function PainList({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 880, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <StaggerText text={slide.intro} active={active} baseDelay={350} style={{ fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, textAlign: "center", marginBottom: 36 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {slide.items.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 10px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 130}ms`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${B.red}, ${B.orange})` }} />
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${B.red}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FlatIcon name={it.icon} size={22} color={B.red} />
              </div>
              <div style={{ fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 500, color: B.bigStone, flex: 1 }}>{it.label}</div>
              <div style={{ fontSize: 22, color: B.red, opacity: 0.75 }}>✕</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30, textAlign: "center", fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 600, color: B.orange, fontStyle: "italic", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1300ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 3. STATS 4 ─── */
function Stats4({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1080, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 10, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 44, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {slide.stats.map((s, i) => {
            const c = tone(s.color);
            return (
              <div key={i} style={{ padding: "32px 20px 28px", borderRadius: 18, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 4px 18px rgba(23,33,52,0.05)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(35px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 150}ms`, textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: c }} />
                <div style={{ fontSize: "clamp(38px, 5.5vw, 64px)", fontWeight: 900, color: c, lineHeight: 1, marginBottom: 14, fontFamily: `'${B.fontEn}', 'Rubik', sans-serif` }}>{s.num}</div>
                <div style={{ fontSize: "clamp(14px, 1.6vw, 17px)", fontWeight: 600, color: B.bigStone, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: "clamp(11px, 1.2vw, 13px)", fontWeight: 300, color: B.gullGray }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 36, textAlign: "center", fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 600, color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1100ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 4. RESPONSIBILITY ─── */
function Responsibility({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 44, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {slide.pairs.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 180}ms` }}>
              <div style={{ flex: 1, padding: "20px 24px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 10px rgba(23,33,52,0.04)", textAlign: "right", fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 600, color: B.bigStone }}>
                {p.good}
              </div>
              <div style={{ padding: "8px 14px", borderRadius: 999, background: `${B.red}12`, color: B.red, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>אבל</div>
              <div style={{ flex: 1, padding: "20px 24px", borderRadius: 14, background: `${B.red}08`, border: `1px solid ${B.red}25`, textAlign: "right", fontSize: "clamp(14px, 1.6vw, 17px)", fontWeight: 500, color: B.red }}>
                {p.bad}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 5. RISK ─── */
function Risk({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 940, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 44, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {slide.risks.map((r, i) => {
            const c = tone(r.color);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 26px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 3px 14px rgba(23,33,52,0.05)", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(25px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 170}ms`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 4, background: c }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${c}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlatIcon name={r.icon} size={26} color={c} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 700, color: B.bigStone, marginBottom: 4 }}>{r.sector}</div>
                  <div style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 300, color: B.gullGray }}>{r.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 36, textAlign: "center", fontSize: "clamp(18px, 2.6vw, 26px)", fontWeight: 700, background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1200ms" }}>
          {slide.closing}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 6. APPROACH ─── */
function Approach({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-200px", left: "-200px", right: "auto", top: "auto" }} size={420} opacity={0.06} />
      <div style={{ zIndex: 2, maxWidth: 1000, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 5, color: B.orange, marginBottom: 22, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms", fontFamily: `'${B.fontEn}', sans-serif`, textTransform: "uppercase" }}>
          {slide.eyebrow}
        </div>
        <StaggerText text={slide.title} active={active} baseDelay={400} style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.05, color: B.bigStone, marginBottom: 28 }} />
        <div style={{ fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, maxWidth: 720, margin: "0 auto 38px", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 700ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 800, margin: "0 auto" }}>
          {slide.pills.map((p, i) => {
            const isAi = p === "AI";
            return (
              <div key={i} style={{ padding: "10px 22px", borderRadius: 999, background: isAi ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})` : B.white, border: isAi ? "none" : `1px solid ${B.athensGray}`, color: isAi ? B.white : B.bigStone, fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: 600, boxShadow: isAi ? `0 6px 18px ${B.orange}40` : "0 2px 8px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${850 + i * 80}ms`, fontFamily: isAi ? `'${B.fontEn}', sans-serif` : "inherit", letterSpacing: isAi ? 1.5 : 0 }}>
                {p}
              </div>
            );
          })}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 7. COVERAGE ─── */
function Coverage({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1320, width: "100%", display: "flex", alignItems: "center", gap: "clamp(24px, 3vw, 48px)" }}>
        <div style={{ flex: "0 0 38%" }}>
          <div style={{ fontSize: "clamp(24px, 3.4vw, 36px)", fontWeight: 800, color: B.bigStone, marginBottom: 22, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            {slide.title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {slide.items.map((it, i) => {
              const c = tone(it.color);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 8px rgba(23,33,52,0.03)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 120}ms`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 3, background: c }} />
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FlatIcon name={it.icon} size={17} color={c} />
                  </div>
                  <div style={{ fontSize: "clamp(12px, 1.2vw, 13.5px)", fontWeight: 400, color: B.bigStone, lineHeight: 1.45 }}>{it.text}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1, opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 600ms" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.14), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0 }}>
            <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "74vh", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── AI Animation Hooks ─── */
function useAgendaCycle(active, totalItems, itemMs = 750, pauseMs = 1800) {
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
      const idx = Math.floor(elapsed / itemMs);
      setShown(Math.min(idx, totalItems));
    }, 100);
    return () => clearInterval(id);
  }, [active, totalItems, itemMs, pauseMs]);
  return shown;
}

function useChatCycle(active) {
  // Phase 0: 0-1800ms user types question
  // Phase 1: 1800-3000ms typing dots
  // Phase 2: 3000-7800ms AI types answer
  // Phase 3: 7800-9800ms pause, then loop
  const [tick, setTick] = useState(0);
  const cycle = 9800;
  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      setTick((Date.now() - start) % cycle);
    }, 80);
    return () => clearInterval(id);
  }, [active]);
  return tick;
}

/* ─── 8. MEETING PAGE + AI AGENDA POPUP ─── */
function MeetingPageAI({ slide, active, accent, circlePos }) {
  const shown = useAgendaCycle(active, slide.agendaItems.length, 1400, 3000);
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1240, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "clamp(24px, 3.6vw, 38px)", fontWeight: 800, color: B.bigStone, marginBottom: 8, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 300, color: B.gullGray, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
            {slide.subtitle}
          </div>
        </div>
        {/* Screenshot + popup overlay */}
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.16), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0, opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 500ms" }}>
          <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "62vh", objectFit: "contain" }} />
          {/* Dim overlay to make popup pop */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.32)", opacity: active ? 1 : 0, transition: "opacity 0.7s ease 800ms" }} />
          {/* AI Agenda Popup */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: active ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.85)", opacity: active ? 1 : 0, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 950ms", width: "min(380px, 70%)", lineHeight: 1.4 }}>
            <AIAgendaPopup slide={slide} active={active} shown={shown} />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

function AIAgendaPopup({ slide, active, shown }) {
  const rimGradient = `conic-gradient(from var(--ai-angle, 0deg), ${B.orange}, ${B.royalBlue}, ${B.teal}, ${B.orangeLight}, ${B.orange})`;
  return (
    <div style={{ position: "relative" }}>
      {/* Soft outer glow — same gradient, blurred, slightly bigger */}
      <div
        className={active ? "ai-rim-glow" : ""}
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: 28,
          background: rimGradient,
          filter: "blur(16px)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      {/* Crisp gradient rim — masked so only a thin ring shows */}
      <div
        className={active ? "ai-rim" : ""}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          padding: 2.5,
          background: rimGradient,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      {/* Inner card */}
      <div style={{ position: "relative", borderRadius: 18, background: B.white, padding: "20px 22px 22px", boxShadow: "0 18px 60px rgba(23,33,52,0.32)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ padding: "4px 10px", borderRadius: 12, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: 10, fontWeight: 800, letterSpacing: 2, fontFamily: `'${B.fontEn}', sans-serif` }}>
            AI
          </div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: B.bigStone }}>
            {slide.aiHeadline}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: B.royalBlue,
                  animation: active ? `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` : "none",
                }}
              />
            ))}
          </div>
        </div>
        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {slide.agendaItems.map((it, i) => {
            const visible = i < shown;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 9,
                  background: visible ? `${B.teal}10` : B.athensGray + "30",
                  opacity: visible ? 1 : 0.35,
                  transform: visible ? "translateX(0)" : "translateX(8px)",
                  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div
                  style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: visible ? B.teal : B.athensGray,
                    color: B.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {visible ? "✓" : ""}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: visible ? B.bigStone : B.cadetBlue, flex: 1 }}>
                  {it}
                </div>
                {i === shown - 1 && active && (
                  <div style={{ fontSize: 10, color: B.teal, fontWeight: 700 }}>חדש</div>
                )}
              </div>
            );
          })}
          {/* Cursor on next line if still generating */}
          {shown < slide.agendaItems.length && active && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px dashed ${B.cadetBlue}` }} />
              <div style={{ width: 2, height: 12, background: B.royalBlue, animation: "blinkCaret 0.9s steps(2) infinite" }} />
            </div>
          )}
        </div>
        {/* Caption */}
        <div style={{ marginTop: 14, fontSize: 11, color: B.gullGray, fontWeight: 400, textAlign: "center", borderTop: `1px solid ${B.athensGray}`, paddingTop: 10 }}>
          {slide.aiCaption}
        </div>
      </div>
    </div>
  );
}

/* ─── 9. MEETING BOOK + AI CHAT ─── */
function MeetingBookChat({ slide, active, accent, circlePos }) {
  const tick = useChatCycle(active);
  const userQ = slide.question;
  const aiA = slide.answer;
  // Reveal progress
  const userProgress = Math.min(tick / 1800, 1);
  const showTyping = tick >= 1800 && tick < 3000;
  const aiStart = 3000;
  const aiProgress = tick >= aiStart ? Math.min((tick - aiStart) / 4500, 1) : 0;
  const userShown = userQ.slice(0, Math.floor(userQ.length * userProgress));
  const aiShown = aiA.slice(0, Math.floor(aiA.length * aiProgress));

  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1240, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "clamp(24px, 3.6vw, 38px)", fontWeight: 800, color: B.bigStone, marginBottom: 8, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 300, color: B.gullGray, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
            {slide.subtitle}
          </div>
        </div>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.16), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0, opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 500ms" }}>
          <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "62vh", objectFit: "contain" }} />
          {/* Dim overlay (subtle, since chat is on the side) */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.18)", opacity: active ? 1 : 0, transition: "opacity 0.7s ease 800ms" }} />
          {/* Chat panel — right side (RTL: appears on right edge) */}
          <div
            dir="rtl"
            style={{
              position: "absolute",
              top: "5%", bottom: "5%", right: "3%",
              width: "min(360px, 38%)",
              borderRadius: 16,
              background: B.white,
              boxShadow: "0 18px 60px rgba(23,33,52,0.32)",
              border: `1px solid ${B.athensGray}`,
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 950ms",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              lineHeight: 1.5,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`, borderBottom: `1px solid ${B.athensGray}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 800, fontSize: 11, fontFamily: `'${B.fontEn}', sans-serif`, letterSpacing: 1 }}>AI</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.bigStone }}>{slide.aiLabel}</div>
                <div style={{ fontSize: 10, color: B.green, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.green }} />
                  פעיל
                </div>
              </div>
              <div style={{ fontSize: 16, color: B.cadetBlue }}>×</div>
            </div>
            {/* Messages */}
            <div style={{ flex: 1, padding: "14px 14px 8px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* User question */}
              <div style={{ alignSelf: "flex-start", maxWidth: "92%" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: B.gullGray, marginBottom: 4 }}>אתה</div>
                <div style={{ padding: "10px 12px", borderRadius: "12px 12px 12px 4px", background: B.bigStone, color: B.white, fontSize: 12, fontWeight: 400, lineHeight: 1.5 }}>
                  {userShown}
                  {tick < 1800 && active && <span style={{ display: "inline-block", width: 1, height: 11, background: B.white, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
                </div>
              </div>
              {/* Typing indicator */}
              {showTyping && (
                <div style={{ alignSelf: "flex-end", maxWidth: "60%" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: B.orange, marginBottom: 4, textAlign: "left" }}>AI Assistant</div>
                  <div style={{ padding: "10px 14px", borderRadius: "12px 12px 4px 12px", background: `${B.orange}12`, border: `1px solid ${B.orange}25`, display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: B.orange,
                          animation: `typingDot 1.2s ease-in-out ${i * 0.18}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* AI answer */}
              {tick >= aiStart && (
                <div style={{ alignSelf: "flex-end", maxWidth: "92%" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: B.orange, marginBottom: 4, textAlign: "left" }}>AI Assistant</div>
                  <div style={{ padding: "10px 12px", borderRadius: "12px 12px 4px 12px", background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`, border: `1px solid ${B.orange}25`, fontSize: 12, fontWeight: 400, color: B.bigStone, lineHeight: 1.55 }}>
                    {aiShown}
                    {aiProgress < 1 && active && <span style={{ display: "inline-block", width: 1, height: 11, background: B.orange, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
                  </div>
                </div>
              )}
            </div>
            {/* Input bar */}
            <div style={{ padding: "10px 12px", borderTop: `1px solid ${B.athensGray}`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, padding: "8px 12px", borderRadius: 10, background: "#F4F5F8", border: `1px solid ${B.athensGray}`, fontSize: 11, color: B.cadetBlue }}>
                שאל שאלה על המסמכים...
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontSize: 14 }}>
                ↑
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 10. DECISION TRACKER ─── */
function useTaskCycle(active) {
  const [tick, setTick] = useState(0);
  const cycle = 19500;
  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => setTick((Date.now() - start) % cycle), 60);
    return () => clearInterval(id);
  }, [active]);
  return tick;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

function DecisionTracker({ slide, active, accent, circlePos }) {
  const tick = useTaskCycle(active);
  const t = slide.task;
  // Phases (viewer sees the decision-tracker page for ~3s before the drawer opens)
  const drawerIn = tick >= 3000;
  const nameProg = clamp01((tick - 4400) / 2400);
  const nameShown = t.name.slice(0, Math.floor(t.name.length * nameProg));
  const showAssignee = tick >= 7200;
  const showDate = tick >= 8000;
  const showPriority = tick >= 8800;
  const descProg = clamp01((tick - 9800) / 2800);
  const descShown = t.description.slice(0, Math.floor(t.description.length * descProg));
  const showConnection = tick >= 13200;
  const buttonPulse = tick >= 14000 && tick < 15100;
  const created = tick >= 15100;

  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1280, width: "100%", display: "flex", alignItems: "center", gap: "clamp(24px, 4vw, 56px)" }}>
        {/* Right column (RTL): text */}
        <div style={{ flex: "0 0 38%" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 999, background: `${B.teal}12`, border: `1px solid ${B.teal}30`, color: B.teal, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            Decision Tracker
          </div>
          <div style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: B.bigStone, marginBottom: 14, lineHeight: 1.2, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, marginBottom: 24, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms" }}>
            {slide.subtitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {slide.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 8px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(28px)", transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${650 + i * 130}ms` }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${B.teal}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlatIcon name={h.icon} size={18} color={B.teal} />
                </div>
                <div style={{ fontSize: "clamp(12px, 1.3vw, 14px)", fontWeight: 400, color: B.bigStone, lineHeight: 1.5 }}>{h.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, fontSize: "clamp(12px, 1.4vw, 14px)", fontWeight: 600, color: B.bigStone, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1300ms" }}>
            {slide.footer}
          </div>
        </div>
        {/* Left: screenshot + drawer overlay */}
        <div style={{ flex: 1, opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 600ms" }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.14), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0 }}>
            <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "62vh", objectFit: "contain" }} />
            {/* Dim layer */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.32)", opacity: active && drawerIn ? 1 : 0, transition: "opacity 0.7s ease" }} />
            {/* Drawer */}
            <TaskDrawer
              active={active}
              drawerIn={drawerIn}
              t={t}
              nameShown={nameShown}
              nameTyping={nameProg > 0 && nameProg < 1}
              showAssignee={showAssignee}
              showDate={showDate}
              showPriority={showPriority}
              descShown={descShown}
              descTyping={descProg > 0 && descProg < 1}
              showConnection={showConnection}
              buttonPulse={buttonPulse}
              created={created}
            />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

function TaskDrawer({ active, drawerIn, t, nameShown, nameTyping, showAssignee, showDate, showPriority, descShown, descTyping, showConnection, buttonPulse, created }) {
  const rimGradient = `conic-gradient(from var(--ai-angle, 0deg), ${B.orange}, ${B.royalBlue}, ${B.teal}, ${B.orangeLight}, ${B.orange})`;
  const labelStyle = { fontSize: 11, fontWeight: 600, color: B.bigStone, marginBottom: 5, display: "flex", alignItems: "center", gap: 4 };
  const fieldRow = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 11px", borderRadius: 8, border: `1px solid ${B.athensGray}`, background: B.white, fontSize: 12, lineHeight: 1.4 };

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: "5%",
        bottom: "5%",
        right: "5%",
        width: "min(420px, 72%)",
        opacity: active && drawerIn ? 1 : 0,
        transform: active && drawerIn ? "translateX(0) scale(1)" : "translateX(40px) scale(0.96)",
        transition: "all 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 4,
      }}
    >
      {/* AI gradient glow halo */}
      <div
        className={active ? "ai-rim-glow" : ""}
        style={{ position: "absolute", inset: -10, borderRadius: 22, background: rimGradient, filter: "blur(18px)", opacity: 0.45, pointerEvents: "none" }}
      />
      {/* AI rim */}
      <div
        className={active ? "ai-rim" : ""}
        style={{ position: "absolute", inset: 0, borderRadius: 16, padding: 2, background: rimGradient, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", pointerEvents: "none" }}
      />

      {/* Card */}
      <div style={{ position: "relative", height: "100%", borderRadius: 14, background: B.white, boxShadow: "0 24px 70px rgba(23,33,52,0.35)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.athensGray}`, background: "#FBFCFE" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: B.bigStone }}>{t.panelTitle}</div>
            <div style={{ padding: "5px 11px", borderRadius: 8, border: `1px solid ${B.athensGray}`, fontSize: 11, color: B.bigStone, fontWeight: 500 }}>
              {t.cancelLabel}
            </div>
            <div
              style={{
                padding: "5px 12px 5px 6px",
                borderRadius: 8,
                background: created ? `${B.green}15` : `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
                border: created ? `1px solid ${B.green}40` : "none",
                color: created ? B.green : B.white,
                fontSize: 11.5,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 7,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: buttonPulse ? "scale(1.08)" : "scale(1)",
                boxShadow: buttonPulse ? `0 8px 22px ${B.orange}60` : "none",
              }}
            >
              {created ? (
                <>✓ {t.createdLabel}</>
              ) : (
                <>
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.22)",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      fontFamily: `'${B.fontEn}', sans-serif`,
                      lineHeight: 1,
                    }}
                  >
                    AI
                  </span>
                  {t.createLabel}
                </>
              )}
            </div>
          </div>
          {/* Status pill + AI tag */}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ padding: "3px 10px", borderRadius: 14, border: `1px solid ${B.athensGray}`, background: B.white, fontSize: 10, color: B.bigStone, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              {t.status}
              <span style={{ fontSize: 8, color: B.cadetBlue }}>▾</span>
            </div>
            {!created && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`, border: `1px solid ${B.orange}30`, fontSize: 10, fontWeight: 600, color: B.bigStone }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.orange, animation: active ? "breathe 1.4s ease-in-out infinite" : "none" }} />
                {t.aiTag}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "12px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
          {/* Task name */}
          <div>
            <div style={labelStyle}>שם המשימה <span style={{ color: B.red }}>*</span></div>
            <div style={{ ...fieldRow, padding: "9px 12px" }}>
              <span style={{ fontWeight: 500, color: B.bigStone }}>
                {nameShown}
                {nameTyping && <span style={{ display: "inline-block", width: 1, height: 11, background: B.bigStone, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
                {!nameShown && !nameTyping && <span style={{ color: B.cadetBlue, fontWeight: 400 }}>הקלד שם משימה</span>}
              </span>
            </div>
          </div>

          {/* Inline row: assignee + date + priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div>
              <div style={labelStyle}>אחראי <span style={{ color: B.red }}>*</span></div>
              <div style={{ ...fieldRow, padding: "6px 8px", minHeight: 30 }}>
                {showAssignee ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, animation: "popIn 0.4s ease both" }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>נ</div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: B.bigStone }}>{t.assignee}</span>
                  </div>
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px dashed ${B.cadetBlue}` }} />
                )}
              </div>
            </div>
            <div>
              <div style={labelStyle}>תאריך יעד <span style={{ color: B.red }}>*</span></div>
              <div style={{ ...fieldRow, padding: "6px 8px", minHeight: 30 }}>
                {showDate ? (
                  <span style={{ fontSize: 11, fontWeight: 600, color: B.bigStone, animation: "popIn 0.4s ease both", display: "flex", alignItems: "center", gap: 5 }}>
                    <FlatIcon name="calendar" size={11} color={B.royalBlue} />
                    {t.dueDate}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: B.cadetBlue, display: "flex", alignItems: "center", gap: 4 }}>
                    <FlatIcon name="calendar" size={11} color={B.cadetBlue} />
                    בחר תאריך
                  </span>
                )}
              </div>
            </div>
            <div>
              <div style={labelStyle}>עדיפות</div>
              <div style={{ ...fieldRow, padding: "6px 8px", minHeight: 30 }}>
                {showPriority ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: B.red, animation: "popIn 0.4s ease both" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.red }} />
                    {t.priority}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: B.cadetBlue }}>None</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={labelStyle}>תיאור</div>
            <div
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${B.athensGray}`,
                background: B.white,
                fontSize: 11.5,
                lineHeight: 1.55,
                color: B.bigStone,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {descShown}
              {descTyping && <span style={{ display: "inline-block", width: 1, height: 11, background: B.orange, marginInlineStart: 2, animation: "blinkCaret 0.9s steps(2) infinite", verticalAlign: "middle" }} />}
              {!descShown && !descTyping && <span style={{ color: B.cadetBlue }}>הוסף תיאור...</span>}
              {/* AI sparkle in corner */}
              <span style={{ position: "absolute", bottom: 6, left: 8, fontSize: 11, color: B.royalBlue, opacity: 0.7 }}>✦</span>
            </div>
          </div>

          {/* Connection */}
          <div>
            <div style={labelStyle}>קישור להחלטה</div>
            <div style={{ ...fieldRow, padding: "8px 11px" }}>
              {showConnection ? (
                <div style={{ display: "flex", alignItems: "center", gap: 7, animation: "popIn 0.4s ease both" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: `${B.teal}15`, color: B.teal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FlatIcon name="target" size={11} color={B.teal} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, color: B.bigStone }}>{t.connection}</span>
                </div>
              ) : (
                <span style={{ fontSize: 11, color: B.cadetBlue }}>אין קישור</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 11. DASHBOARD ─── */
function DashboardSlide({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1280, width: "100%", display: "flex", alignItems: "center", gap: "clamp(24px, 4vw, 56px)", flexDirection: "row-reverse" }}>
        {/* Left in RTL = text */}
        <div style={{ flex: "0 0 38%" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 999, background: `${B.orange}12`, border: `1px solid ${B.orange}30`, color: B.orange, fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            Personal Dashboard
          </div>
          <div style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: B.bigStone, marginBottom: 14, lineHeight: 1.2, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6, marginBottom: 24, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms" }}>
            {slide.subtitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {slide.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 8px rgba(23,33,52,0.04)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-28px)", transition: `all 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${650 + i * 130}ms` }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${B.orange}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlatIcon name={h.icon} size={18} color={B.orange} />
                </div>
                <div style={{ fontSize: "clamp(12px, 1.3vw, 14px)", fontWeight: 400, color: B.bigStone, lineHeight: 1.5 }}>{h.text}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Screenshot */}
        <div style={{ flex: 1, opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 600ms" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.14), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0 }}>
            <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "62vh", objectFit: "contain" }} />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 9. MINUTES APPROVAL FLOW ─── */
function useApprovalCycle(active) {
  const [tick, setTick] = useState(0);
  const cycle = 13500;
  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => setTick((Date.now() - start) % cycle), 60);
    return () => clearInterval(id);
  }, [active]);
  return tick;
}

function MinutesApproval({ slide, active, accent, circlePos }) {
  const tick = useApprovalCycle(active);
  const memberCount = slide.members.length;
  const checkStart = 1500;
  const checkInterval = 650;
  const checkedCount =
    tick < checkStart
      ? 0
      : Math.min(memberCount, Math.floor((tick - checkStart) / checkInterval) + 1);
  const allChecked = checkedCount >= memberCount;
  const allCheckedAt = checkStart + memberCount * checkInterval; // ~4750
  const sentStart = allCheckedAt + 1800; // ~6550
  const sendPulse = allChecked && tick >= allCheckedAt && tick < sentStart;
  const sent = tick >= sentStart;

  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1240, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "clamp(24px, 3.6vw, 38px)", fontWeight: 800, color: B.bigStone, marginBottom: 8, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
            {slide.title}
          </div>
          <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 300, color: B.gullGray, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
            {slide.subtitle}
          </div>
        </div>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: `1px solid ${B.athensGray}`, boxShadow: "0 14px 50px rgba(23,33,52,0.16), 0 4px 14px rgba(23,33,52,0.06)", background: "#FAFBFC", lineHeight: 0, opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(0.96)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 500ms" }}>
          <img src={slide.screenshot} alt={slide.title} style={{ display: "block", width: "100%", maxHeight: "62vh", objectFit: "contain" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(23,33,52,0.32)", opacity: active ? 1 : 0, transition: "opacity 0.7s ease 800ms" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: active ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.85)", opacity: active ? 1 : 0, transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 950ms", width: "min(440px, 78%)", lineHeight: 1.4 }}>
            <ApprovalPopup
              slide={slide}
              active={active}
              checkedCount={checkedCount}
              allChecked={allChecked}
              sendPulse={sendPulse}
              sent={sent}
            />
          </div>
        </div>
      </div>
    </SlideWrap>
  );
}

function ApprovalPopup({ slide, active, checkedCount, allChecked, sendPulse, sent }) {
  const rimGradient = `conic-gradient(from var(--ai-angle, 0deg), ${B.orange}, ${B.royalBlue}, ${B.teal}, ${B.orangeLight}, ${B.orange})`;
  return (
    <div style={{ position: "relative" }} dir="rtl">
      <div
        className={active ? "ai-rim-glow" : ""}
        style={{ position: "absolute", inset: -10, borderRadius: 28, background: rimGradient, filter: "blur(16px)", opacity: 0.55, pointerEvents: "none" }}
      />
      <div
        className={active ? "ai-rim" : ""}
        style={{ position: "absolute", inset: 0, borderRadius: 20, padding: 2.5, background: rimGradient, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", maskComposite: "exclude", pointerEvents: "none" }}
      />
      <div style={{ position: "relative", borderRadius: 18, background: B.white, padding: "20px 22px 22px", boxShadow: "0 18px 60px rgba(23,33,52,0.32)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, display: "flex", alignItems: "center", justifyContent: "center", color: B.white }}>
            <FlatIcon name="pencil" size={16} color={B.white} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.bigStone }}>{slide.panelTitle}</div>
            <div style={{ fontSize: 11, color: B.gullGray }}>{slide.meetingName}</div>
          </div>
          <div style={{ fontSize: 16, color: B.cadetBlue }}>×</div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: B.gullGray, marginBottom: 8, letterSpacing: 0.5 }}>
          חברים לחתימה ({slide.members.length})
        </div>

        {/* Member rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {slide.members.map((m, i) => {
            const checked = i < checkedCount;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 9,
                  background: checked ? `${B.teal}10` : `${B.athensGray}40`,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: checked ? B.teal : B.white,
                    border: checked ? "none" : `1.5px solid ${B.cadetBlue}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: B.white,
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  {checked && "✓"}
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: B.bigStone }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 10, color: B.gullGray }}>{m.role}</div>
                {sent && checked && (
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: B.orange,
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: `${B.orange}15`,
                      animation: "popIn 0.4s ease both",
                      flexShrink: 0,
                    }}
                  >
                    ממתין לחתימה
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: sent
              ? `${B.green}15`
              : allChecked
              ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`
              : `${B.athensGray}60`,
            border: sent ? `1px solid ${B.green}40` : "none",
            color: sent ? B.green : allChecked ? B.white : B.cadetBlue,
            fontSize: 13,
            fontWeight: 700,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: sendPulse ? "scale(1.03)" : "scale(1)",
            boxShadow: sendPulse ? `0 8px 22px ${B.orange}55` : "none",
          }}
        >
          {sent ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: B.green,
                  color: B.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                ✓
              </span>
              {slide.sentLabel}
            </>
          ) : (
            <>
              {slide.buttonLabel}
              <span style={{ fontSize: 14 }}>←</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── 13. AI CAPABILITIES (recap, no reports) ─── */
function AICapabilities({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      {active && <ParticleField count={18} color={B.royalBlue} />}
      <div style={{ zIndex: 2, maxWidth: 1120, width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          <AIPulse active={active} accent={B.orange} />
          <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, lineHeight: 1.1 }}>
            {slide.title}
          </div>
        </div>
        <div style={{ fontSize: "clamp(13px, 1.7vw, 17px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 34, lineHeight: 1.5, maxWidth: 780, marginInline: "auto", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms" }}>
          {slide.subtitle}
        </div>
        {/* 2x2 grid of capabilities */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {slide.capabilities.map((cap, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                padding: "22px 22px 20px",
                borderRadius: 18,
                background: B.white,
                border: `1px solid ${B.athensGray}`,
                boxShadow: "0 4px 18px rgba(23,33,52,0.06)",
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(28px)",
                transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${550 + i * 130}ms`,
                overflow: "hidden",
              }}
            >
              {/* Top gradient stripe */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${B.orange}12, ${B.royalBlue}12)`, border: `1px solid ${B.orange}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlatIcon name={cap.icon} size={22} color={B.orange} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ padding: "2px 8px", borderRadius: 8, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, fontFamily: `'${B.fontEn}', sans-serif` }}>AI</div>
                  <div style={{ fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 700, color: B.bigStone }}>{cap.title}</div>
                </div>
              </div>
              <div style={{ fontSize: "clamp(12px, 1.4vw, 14px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6 }}>
                {cap.desc}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 26, textAlign: "center", fontSize: "clamp(14px, 1.9vw, 18px)", fontWeight: 600, background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1300ms" }}>
          {slide.footer}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 11. FIELD RESULTS ─── */
function FieldResults({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 980, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 12, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 38, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {slide.results.map((r, i) => {
            const c = tone(r.color);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: 18,
                  opacity: active ? 1 : 0,
                  transform: active ? "translateX(0)" : "translateX(30px)",
                  transition: `all 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 200}ms`,
                }}
              >
                {/* BEFORE — light pink, right side in RTL */}
                <div
                  style={{
                    flex: 1,
                    padding: "22px 28px",
                    borderRadius: 14,
                    background: "#FCEFEF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minHeight: 78,
                  }}
                >
                  <span style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 700, color: B.red }}>
                    לפני:
                  </span>
                  <span style={{ fontSize: "clamp(14px, 1.7vw, 18px)", fontWeight: 500, color: B.bigStone }}>
                    {r.before}
                  </span>
                </div>
                {/* Arrow — accent-colored, points toward AFTER */}
                <div
                  style={{
                    alignSelf: "center",
                    fontSize: "clamp(26px, 3.4vw, 36px)",
                    fontWeight: 800,
                    color: c,
                    fontFamily: `'${B.fontEn}', sans-serif`,
                    lineHeight: 1,
                  }}
                >
                  {">"}
                </div>
                {/* AFTER — light green, left side in RTL */}
                <div
                  style={{
                    flex: 1,
                    padding: "22px 28px",
                    borderRadius: 14,
                    background: "#EAF8EF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    minHeight: 78,
                  }}
                >
                  <span style={{ fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 700, color: B.green }}>
                    אחרי:
                  </span>
                  <span style={{ fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 800, color: B.bigStone }}>
                    {r.after}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 15. WHY NOW ─── */
function WhyNow({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1040, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 12, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300, color: B.gullGray, textAlign: "center", marginBottom: 40, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {slide.reasons.map((r, i) => {
            const c = tone(r.color);
            return (
              <div key={i} style={{ padding: "32px 22px", borderRadius: 18, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 4px 18px rgba(23,33,52,0.05)", textAlign: "center", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(35px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 170}ms`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c }} />
                <div style={{ width: 60, height: 60, borderRadius: 16, background: `${c}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <FlatIcon name={r.icon} size={30} color={c} />
                </div>
                <div style={{ fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 700, color: B.bigStone, marginBottom: 8 }}>{r.title}</div>
                <div style={{ fontSize: "clamp(12px, 1.4vw, 14px)", fontWeight: 300, color: B.gullGray, lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 38, padding: "20px 26px", borderRadius: 14, background: B.bigStone, color: B.white, textAlign: "center", fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 500, lineHeight: 1.55, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1200ms" }}>
          {slide.closing}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 13. SUMMARY ─── */
function Summary({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 960, width: "100%" }}>
        <div style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: B.bigStone, textAlign: "center", marginBottom: 36, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms" }}>
          {slide.title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
          {slide.items.map((it, i) => {
            const c = tone(it.color);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 26px", borderRadius: 14, background: B.white, border: `1px solid ${B.athensGray}`, boxShadow: "0 2px 12px rgba(23,33,52,0.05)", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(30px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 200}ms`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 4, background: c }} />
                <div style={{ fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 800, color: c, minWidth: 90 }}>{it.label}</div>
                <div style={{ fontSize: "clamp(14px, 1.6vw, 17px)", fontWeight: 400, color: B.bigStone, flex: 1 }}>{it.text}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: B.bigStone, lineHeight: 1.4, marginBottom: 8, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1100ms" }}>
          {slide.quote}
        </div>
        <div style={{ textAlign: "center", fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 500, background: `linear-gradient(90deg, ${B.orange}, ${B.royalBlue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1300ms" }}>
          {slide.question}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ─── 14. CTA / END ─── */
function CTAEnd({ slide, active, accent, circlePos }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <DecoCircle color={B.orange} position={{ bottom: "-200px", left: "-200px", right: "auto", top: "auto" }} size={420} opacity={0.07} />
      <div style={{ zIndex: 2, textAlign: "center", maxWidth: 860, width: "100%" }}>
        <div style={{ marginBottom: 26 }}><BDLogo size={66} /></div>
        <div style={{ fontSize: "clamp(56px, 10vw, 110px)", fontWeight: 900, lineHeight: 1, marginBottom: 16, background: `linear-gradient(135deg, ${B.orange} 0%, ${B.royalBlue} 100%)`, backgroundSize: "200% auto", animation: active ? "shimmer 5s linear infinite" : "none", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 250ms" }}>
          {slide.headline}
        </div>
        <div style={{ fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 400, color: B.gullGray, marginBottom: 38, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 550ms" }}>
          {slide.subtitle}
        </div>
        <div style={{ padding: "20px 32px", borderRadius: 16, background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: "clamp(16px, 2.2vw, 20px)", fontWeight: 600, display: "inline-block", boxShadow: `0 14px 40px ${B.orange}40`, marginBottom: 14, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 750ms" }}>
          {slide.cta}
        </div>
        <div style={{ fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 400, color: B.cadetBlue, marginBottom: 36, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 900ms" }}>
          {slide.cta2}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(15px)", transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1050ms", fontFamily: `'${B.fontEn}', sans-serif` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: B.bigStone, fontWeight: 500 }}>
            <FlatIcon name="mail" size={16} color={B.orange} />
            {slide.contact.email}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: B.bigStone, fontWeight: 500 }}>
            <FlatIcon name="globe" size={16} color={B.royalBlue} />
            {slide.contact.site}
          </div>
        </div>
        <div style={{ marginTop: 30, fontSize: 13, color: B.gullGray, opacity: active ? 1 : 0, transition: "all 0.7s ease 1200ms" }}>
          {slide.speaker}
        </div>
      </div>
    </SlideWrap>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   FLOW SLIDES (after Coverage) — committee → meeting → agenda → send
   Shared hook drives a tick-based cycle so each slide can derive phases.
   ────────────────────────────────────────────────────────────────────── */

function useCycle(active, cycleMs) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) {
      setTick(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => setTick((Date.now() - start) % cycleMs), 60);
    return () => clearInterval(id);
  }, [active, cycleMs]);
  return tick;
}

const _clamp01 = (v) => Math.max(0, Math.min(1, v));

function FlowFrame({ slide, active, accent, circlePos, children }) {
  return (
    <SlideWrap active={active}>
      <DecoCircle color={accent} position={circlePos} />
      <div style={{ zIndex: 2, maxWidth: 1320, width: "100%" }}>
        {/* Title row */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              fontSize: "clamp(22px, 3.2vw, 34px)",
              fontWeight: 800,
              color: B.bigStone,
              marginBottom: 6,
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
            }}
          >
            {slide.title}
          </div>
          <div
            style={{
              fontSize: "clamp(12px, 1.4vw, 14.5px)",
              fontWeight: 300,
              color: B.gullGray,
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms",
            }}
          >
            {slide.subtitle}
          </div>
        </div>
        {/* Frame */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${B.athensGray}`,
            boxShadow: "0 14px 50px rgba(23,33,52,0.16), 0 4px 14px rgba(23,33,52,0.06)",
            background: "#FAFBFC",
            lineHeight: 0,
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.96)",
            transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 500ms",
          }}
        >
          <img
            src={slide.screenshot}
            alt={slide.title}
            style={{ display: "block", width: "100%", maxHeight: "66vh", objectFit: "contain" }}
          />
          {children}
        </div>
      </div>
    </SlideWrap>
  );
}

function GradientRim({ active, inset = 0, radius = 18, blur = 14 }) {
  const rim = `conic-gradient(from var(--ai-angle, 0deg), ${B.orange}, ${B.royalBlue}, ${B.teal}, ${B.orangeLight}, ${B.orange})`;
  return (
    <>
      <div
        className={active ? "ai-rim-glow" : ""}
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: radius + 6,
          background: rim,
          filter: `blur(${blur}px)`,
          opacity: 0.42,
          pointerEvents: "none",
        }}
      />
      <div
        className={active ? "ai-rim" : ""}
        style={{
          position: "absolute",
          inset,
          borderRadius: radius,
          padding: 2,
          background: rim,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function AIPill({ active, label, color = B.orange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 14,
        background: `linear-gradient(135deg, ${B.orange}10, ${B.royalBlue}10)`,
        border: `1px solid ${B.orange}30`,
        fontSize: 10.5,
        fontWeight: 600,
        color: B.bigStone,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          animation: active ? "breathe 1.4s ease-in-out infinite" : "none",
        }}
      />
      {label}
    </div>
  );
}

function PrimaryActionBtn({ active, pulse, done, doneLabel, label, onAI }) {
  return (
    <div
      style={{
        height: 23,
        padding: onAI ? "0 14px 0 6px" : "0 14px",
        borderRadius: 10,
        background: done ? `${B.green}15` : `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`,
        border: done ? `1px solid ${B.green}40` : "none",
        color: done ? B.green : B.white,
        fontSize: 11.5,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        lineHeight: 1,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: pulse ? "scale(1.08)" : "scale(1)",
        boxShadow: pulse ? `0 8px 22px ${B.orange}60` : "none",
      }}
    >
      {done ? (
        <>✓ {doneLabel}</>
      ) : (
        <>
          {onAI && (
            <span
              style={{
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.22)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 1.5,
                fontFamily: `'${B.fontEn}', sans-serif`,
                lineHeight: 1,
              }}
            >
              AI
            </span>
          )}
          {label}
        </>
      )}
    </div>
  );
}

/* ─── 8. CREATE COMMITTEE ─── */
function CreateCommittee({ slide, active, accent, circlePos }) {
  const tick = useCycle(active, 25000);
  const c = slide.committee;

  const drawerIn = tick >= 3500;
  const nameProg = _clamp01((tick - 5200) / 2400);
  const nameShown = c.name.slice(0, Math.floor(c.name.length * nameProg));
  const descProg = _clamp01((tick - 8000) / 3200);
  const descShown = c.description.slice(0, Math.floor(c.description.length * descProg));
  const showPrefix = tick >= 11800;
  const showCategory = tick >= 12800;
  const showColor = tick >= 13800;
  const showManager = tick >= 14800;
  const showEditor = tick >= 15800;
  const memberStart = 17000;
  const memberInterval = 500;
  const visibleMembers =
    tick < memberStart ? 0 : Math.min(c.members.length, Math.floor((tick - memberStart) / memberInterval) + 1);
  const allReadyAt = memberStart + c.members.length * memberInterval;
  const pulse = tick >= allReadyAt && tick < allReadyAt + 1500;
  const done = tick >= allReadyAt + 1500;

  return (
    <FlowFrame slide={slide} active={active} accent={accent} circlePos={circlePos}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(23,33,52,0.32)",
          opacity: active && drawerIn ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      />
      <CreateCommitteePopup
        slide={slide}
        active={active}
        drawerIn={drawerIn}
        c={c}
        nameShown={nameShown}
        nameTyping={nameProg > 0 && nameProg < 1}
        descShown={descShown}
        descTyping={descProg > 0 && descProg < 1}
        showPrefix={showPrefix}
        showCategory={showCategory}
        showColor={showColor}
        showManager={showManager}
        showEditor={showEditor}
        visibleMembers={visibleMembers}
        pulse={pulse}
        done={done}
      />
    </FlowFrame>
  );
}

function CreateCommitteePopup({
  slide,
  active,
  drawerIn,
  c,
  nameShown,
  nameTyping,
  descShown,
  descTyping,
  showPrefix,
  showCategory,
  showColor,
  showManager,
  showEditor,
  visibleMembers,
  pulse,
  done,
}) {
  const labelStyle = { fontSize: 11, fontWeight: 600, color: B.bigStone, marginBottom: 9, display: "flex", alignItems: "center", gap: 7 };
  const inputBox = {
    padding: "8px 11px",
    borderRadius: 8,
    border: `1px solid ${B.athensGray}`,
    background: B.white,
    fontSize: 12,
    lineHeight: 1.45,
    color: B.bigStone,
    minHeight: 32,
    display: "flex",
    alignItems: "center",
  };
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: "4%",
        bottom: "4%",
        left: "4%",
        right: "4%",
        opacity: active && drawerIn ? 1 : 0,
        transform: active && drawerIn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        transition: "all 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 4,
      }}
    >
      <GradientRim active={active} radius={16} />
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 14,
          background: B.white,
          boxShadow: "0 24px 70px rgba(23,33,52,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ padding: "12px 18px", borderBottom: `1px solid ${B.athensGray}`, background: "#FBFCFE" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: B.bigStone }}>{slide.panelTitle}</div>
            <div style={{ height: 23, padding: "0 14px", borderRadius: 10, border: `1px solid ${B.orange}40`, color: B.orange, fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", lineHeight: 1, boxSizing: "border-box" }}>
              {slide.cancelLabel}
            </div>
            <PrimaryActionBtn active={active} pulse={pulse} done={done} doneLabel={slide.createdLabel} label={slide.createLabel} onAI />
          </div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
            {!done && <AIPill active={active} label={slide.aiTag} />}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 28px", overflow: "hidden", alignContent: "start" }}>
          {/* Committee name (left/right col 1) */}
          <div>
            <div style={labelStyle}>שם הוועדה <span style={{ color: B.red }}>*</span></div>
            <div style={inputBox}>
              <span style={{ fontWeight: 500 }}>
                {nameShown}
                {nameTyping && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 1,
                      height: 11,
                      background: B.bigStone,
                      marginInlineStart: 2,
                      animation: "blinkCaret 0.9s steps(2) infinite",
                      verticalAlign: "middle",
                    }}
                  />
                )}
                {!nameShown && !nameTyping && <span style={{ color: B.cadetBlue, fontWeight: 400 }}>הקלידו שם ועדה</span>}
              </span>
            </div>
          </div>

          {/* Minutes prefix */}
          <div>
            <div style={labelStyle}>קידומת פרוטוקול</div>
            <div style={inputBox}>
              {showPrefix ? (
                <span style={{ fontWeight: 600, color: B.bigStone, fontFamily: `'${B.fontEn}', sans-serif`, animation: "popIn 0.4s ease both" }}>
                  {c.prefix}
                </span>
              ) : (
                <span style={{ color: B.cadetBlue }}>הקלידו מספר</span>
              )}
            </div>
          </div>

          {/* Description (left col 1) */}
          <div>
            <div style={labelStyle}>תיאור</div>
            <div style={{ ...inputBox, minHeight: 70, alignItems: "flex-start", padding: "10px 12px" }}>
              <span style={{ fontWeight: 400, lineHeight: 1.55 }}>
                {descShown}
                {descTyping && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 1,
                      height: 11,
                      background: B.bigStone,
                      marginInlineStart: 2,
                      animation: "blinkCaret 0.9s steps(2) infinite",
                      verticalAlign: "middle",
                    }}
                  />
                )}
                {!descShown && !descTyping && <span style={{ color: B.cadetBlue }}>הוסיפו תיאור...</span>}
              </span>
            </div>
          </div>

          {/* Category + color stacked */}
          <div>
            <div style={labelStyle}>קטגוריית ועדה</div>
            <div style={inputBox}>
              {showCategory ? (
                <span style={{ fontWeight: 500, color: B.bigStone, animation: "popIn 0.4s ease both" }}>{c.category}</span>
              ) : (
                <span style={{ color: B.cadetBlue }}>בחרו קטגוריה</span>
              )}
            </div>
            <div style={{ ...labelStyle, marginTop: 10 }}>צבע הוועדה</div>
            <div style={{ display: "flex", gap: 7, paddingTop: 2 }}>
              {c.colors.map((col, i) => {
                const isSel = showColor && i === c.selectedColor;
                return (
                  <div
                    key={i}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: col,
                      transition: "all 0.3s ease",
                      transform: isSel ? "scale(1.18)" : "scale(1)",
                      boxShadow: isSel ? `0 0 0 2px ${B.white}, 0 0 0 4px ${col}` : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ gridColumn: "1 / 3", height: 4, borderTop: `1px solid ${B.athensGray}`, marginTop: 6 }} />

          {/* Managers */}
          <div style={{ gridColumn: "1 / 3" }}>
            <div style={{ ...labelStyle, fontSize: 11.5, fontWeight: 700 }}>
              מנהלים <span style={{ color: B.red }}>*</span>
            </div>
            <div style={{ ...inputBox, padding: "6px 10px", minHeight: 34, gap: 6 }}>
              {showManager ? (
                c.managers.map((m, i) => (
                  <ChipPerson key={i} bg={m.bg} initials={m.initials} name={m.name} />
                ))
              ) : (
                <span style={{ color: B.cadetBlue, fontSize: 11 }}>🔍 הוסיפו מנהלים</span>
              )}
            </div>
          </div>

          {/* Editors */}
          <div>
            <div style={{ ...labelStyle, fontSize: 11.5, fontWeight: 700 }}>עורכים</div>
            <div style={{ ...inputBox, padding: "6px 10px", minHeight: 34, gap: 6 }}>
              {showEditor ? (
                c.editors.map((m, i) => (
                  <ChipPerson key={i} bg={m.bg} initials={m.initials} name={m.name} />
                ))
              ) : (
                <span style={{ color: B.cadetBlue, fontSize: 11 }}>🔍 הוסיפו עורכים</span>
              )}
            </div>
          </div>

          {/* Members */}
          <div>
            <div style={{ ...labelStyle, fontSize: 11.5, fontWeight: 700 }}>חברים</div>
            <div style={{ ...inputBox, padding: "6px 10px", minHeight: 34, gap: 6, flexWrap: "wrap" }}>
              {visibleMembers === 0 ? (
                <span style={{ color: B.cadetBlue, fontSize: 11 }}>🔍 הוסיפו חברים</span>
              ) : (
                c.members.slice(0, visibleMembers).map((m, i) => (
                  <ChipPerson key={i} bg={m.bg} initials={m.initials} name={m.name} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipPerson({ bg, initials, name }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        paddingBlock: 3,
        paddingInlineStart: 3,
        paddingInlineEnd: 12,
        borderRadius: 14,
        background: `${B.whisper}`,
        border: `1px solid ${B.athensGray}`,
        animation: "popIn 0.45s ease both",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: bg,
          color: B.white,
          fontSize: 9,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {initials}
      </span>
      <span style={{ fontSize: 11, fontWeight: 500, color: B.bigStone }}>{name}</span>
    </div>
  );
}

/* ─── 9. CREATE MEETING (3-step wizard) ─── */
function CreateMeeting({ slide, active, accent, circlePos }) {
  const tick = useCycle(active, 40500);

  // Phase plan (slower)
  // 0..3500       page visible
  // 3500..5200    modal slides in
  // 5200..14000   STEP 1 — field auto-fill
  // 14000..15000  advance to step 2
  // 15000..22000  STEP 2 — attendees populate
  // 22000..23200  advance to step 3
  // 23200..32000  STEP 3 — summary, checkboxes confirmed, message types
  // 32500..34500  Create pulses
  // 34500..38500  Created state
  // 38500..40500  pause / loop

  const modalIn = tick >= 3500;
  const step = tick < 15000 ? 1 : tick < 23200 ? 2 : 3;

  // Step 1 fills
  const s1 = slide.step1;
  const sName = _clamp01((tick - 5200) / 2300);
  const sNameShown = s1.name.slice(0, Math.floor(s1.name.length * sName));
  const sCommittee = tick >= 7700;
  const sOrganizer = tick >= 8500;
  const sDate = tick >= 9200;
  const sTime = tick >= 10000;
  const sLocation = tick >= 11000;
  const sDesc = _clamp01((tick - 11700) / 2300);
  const sDescShown = s1.description.slice(0, Math.floor(s1.description.length * sDesc));

  // Step 2 fills attendees
  const attStart = 15300;
  const attInterval = 600;
  const visibleAttendees =
    tick < attStart ? 0 : Math.min(slide.step2.attendees.length, Math.floor((tick - attStart) / attInterval) + 1);

  // Step 3 fills
  const s3 = slide.step3;
  const s3Publish = tick >= 24200;
  const s3Send = tick >= 25000;
  const msgProg = _clamp01((tick - 26200) / 5700);
  const msgShown = s3.message.slice(0, Math.floor(s3.message.length * msgProg));
  const pulse = tick >= 32500 && tick < 34500;
  const done = tick >= 34500;

  return (
    <FlowFrame slide={slide} active={active} accent={accent} circlePos={circlePos}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(23,33,52,0.34)",
          opacity: active && modalIn ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: "4%",
          bottom: "4%",
          left: "50%",
          transform: active && modalIn ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.93)",
          opacity: active && modalIn ? 1 : 0,
          transition: "all 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          width: "min(640px, 80%)",
          zIndex: 4,
        }}
      >
        <GradientRim active={active} radius={16} />
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: 14,
            background: B.white,
            boxShadow: "0 24px 70px rgba(23,33,52,0.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            lineHeight: 1.45,
          }}
        >
          {/* Header */}
          <div style={{ padding: "12px 18px 8px", borderBottom: `1px solid ${B.athensGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: B.bigStone }}>{slide.panelTitle}</div>
              <div style={{ fontSize: 16, color: B.cadetBlue }}>×</div>
            </div>
            {/* Stepper */}
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {slide.steps.map((label, i) => {
                const n = i + 1;
                const active2 = step === n;
                const completed = step > n;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: completed ? B.royalBlue : active2 ? B.whisper : B.athensGray,
                        border: active2 ? `2px solid ${B.royalBlue}` : "none",
                        color: completed ? B.white : active2 ? B.royalBlue : B.cadetBlue,
                        fontWeight: 800,
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {completed ? "✓" : n}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: active2 || completed ? 600 : 400, color: active2 || completed ? B.bigStone : B.cadetBlue }}>{label}</span>
                    {n < slide.steps.length && (
                      <div style={{ width: 28, height: 1, background: completed ? B.royalBlue : B.athensGray }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: "12px 18px", overflow: "hidden" }}>
            {step === 1 && <CMStep1 s1={s1} sNameShown={sNameShown} sNameTyping={sName > 0 && sName < 1} sCommittee={sCommittee} sOrganizer={sOrganizer} sDate={sDate} sTime={sTime} sLocation={sLocation} sDescShown={sDescShown} sDescTyping={sDesc > 0 && sDesc < 1} />}
            {step === 2 && <CMStep2 step2={slide.step2} visibleAttendees={visibleAttendees} />}
            {step === 3 && <CMStep3 s3={s3} s3Publish={s3Publish} s3Send={s3Send} msgShown={msgShown} msgTyping={msgProg > 0 && msgProg < 1} />}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 18px", borderTop: `1px solid ${B.athensGray}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FBFCFE" }}>
            <div style={{ height: 23, padding: "0 14px", borderRadius: 10, border: `1px solid ${B.orange}40`, color: B.orange, fontSize: 11.5, fontWeight: 600, display: "inline-flex", alignItems: "center", lineHeight: 1, boxSizing: "border-box" }}>
              {step === 1 ? slide.cancelLabel : `← ${slide.backLabel}`}
            </div>
            {step < 3 ? (
              <div style={{ height: 23, padding: "0 16px", borderRadius: 10, background: B.orange, color: B.white, fontSize: 11.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1, boxSizing: "border-box" }}>
                {slide.nextLabel} <span>›</span>
              </div>
            ) : (
              <PrimaryActionBtn active={active} pulse={pulse} done={done} doneLabel={slide.createdLabel} label={slide.createLabel} />
            )}
          </div>
        </div>
      </div>
    </FlowFrame>
  );
}

function CMStep1({ s1, sNameShown, sNameTyping, sCommittee, sOrganizer, sDate, sTime, sLocation, sDescShown, sDescTyping }) {
  const lbl = { fontSize: 10.5, fontWeight: 600, color: B.bigStone, marginBottom: 7, display: "flex", alignItems: "center", gap: 6 };
  const field = {
    padding: "7px 10px",
    borderRadius: 7,
    border: `1px solid ${B.athensGray}`,
    background: B.white,
    fontSize: 11.5,
    color: B.bigStone,
    minHeight: 30,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };
  const placeholder = (txt) => <span style={{ color: B.cadetBlue }}>{txt}</span>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", alignContent: "start" }}>
      <div style={{ gridColumn: "1 / 3" }}>
        <div style={lbl}>שם ישיבה <span style={{ color: B.red }}>*</span></div>
        <div style={field}>
          {sNameShown}
          {sNameTyping && <Caret />}
          {!sNameShown && !sNameTyping && placeholder("הקלידו שם ישיבה")}
        </div>
      </div>
      <div>
        <div style={lbl}>ועדה</div>
        <div style={field}>{sCommittee ? <Pop>{s1.committee}</Pop> : placeholder("בחרו ועדה")}</div>
      </div>
      <div>
        <div style={lbl}>מארגן</div>
        <div style={field}>
          {sOrganizer ? (
            <Pop>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`, color: B.white, fontSize: 9, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginInlineEnd: 6 }}>נ</span>
              {s1.organizer}
            </Pop>
          ) : (
            placeholder("בחרו מארגן")
          )}
        </div>
      </div>
      <div>
        <div style={lbl}>תאריך</div>
        <div style={field}>
          {sDate ? (
            <Pop>
              <FlatIcon name="calendar" size={11} color={B.royalBlue} /> {s1.dateFrom}
            </Pop>
          ) : (
            placeholder("בחרו תאריך")
          )}
        </div>
      </div>
      <div>
        <div style={lbl}>שעות</div>
        <div style={field}>
          {sTime ? (
            <Pop>
              {s1.timeFrom} – {s1.timeTo}
            </Pop>
          ) : (
            placeholder("בחרו שעה")
          )}
        </div>
      </div>
      <div>
        <div style={lbl}>מיקום</div>
        <div style={field}>{sLocation ? <Pop>{s1.location}</Pop> : placeholder("בחרו מיקום")}</div>
      </div>
      <div>
        <div style={lbl}>מפגש מרוחק</div>
        <div style={field}>
          {sLocation ? (
            <Pop>
              <FlatIcon name="globe" size={11} color={B.royalBlue} /> {s1.remote}
            </Pop>
          ) : (
            placeholder("בחרו סוג מפגש")
          )}
        </div>
      </div>
      <div style={{ gridColumn: "1 / 3" }}>
        <div style={lbl}>תיאור</div>
        <div style={{ ...field, minHeight: 56, alignItems: "flex-start", padding: "8px 10px", position: "relative" }}>
          <span style={{ flex: 1 }}>
            {sDescShown}
            {sDescTyping && <Caret />}
            {!sDescShown && !sDescTyping && placeholder("תארו את מטרת הישיבה...")}
          </span>
          <span style={{ position: "absolute", bottom: 5, left: 8, color: B.royalBlue, fontSize: 11 }}>✦</span>
        </div>
      </div>
    </div>
  );
}

function CMStep2({ step2, visibleAttendees }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: B.bigStone, marginBottom: 8 }}>
        משתתפים ({visibleAttendees})
      </div>
      <div
        style={{
          padding: "7px 10px",
          borderRadius: 7,
          border: `1px solid ${B.athensGray}`,
          background: B.white,
          fontSize: 11,
          color: B.cadetBlue,
          marginBottom: 10,
        }}
      >
        🔍 הוסיפו משתתפים
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxHeight: 200, overflow: "hidden" }}>
        {step2.attendees.slice(0, visibleAttendees).map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              borderRadius: 7,
              border: `1px solid ${B.athensGray}`,
              background: B.white,
              animation: "popIn 0.4s ease both",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${B.royalBlue}, ${B.teal})`,
                color: B.white,
                fontSize: 9,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {a.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.bigStone }}>{a.name}</div>
              <div style={{ fontSize: 9.5, color: B.gullGray, overflow: "hidden", textOverflow: "ellipsis" }}>{a.email}</div>
            </div>
            <span style={{ fontSize: 13, color: B.cadetBlue }}>×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CMStep3({ s3, s3Publish, s3Send, msgShown, msgTyping }) {
  return (
    <div>
      {/* Summary card */}
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          background: B.whisper,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: B.bigStone, marginBottom: 4 }}>סיכום הישיבה</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: B.bigStone, marginBottom: 6 }}>{s3.summary}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, color: B.gullGray }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <FlatIcon name="calendar" size={11} color={B.royalBlue} /> {s3.date}
          </span>
          <span>{s3.time}</span>
          <span>📍 {s3.location}</span>
        </div>
      </div>

      {/* Two checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        <CheckboxRow checked={s3Publish} title="פרסם ישיבה" desc="לאחר פרסום, פרטי הישיבה נחשפים לכל המשתתפים" />
        <CheckboxRow checked={s3Send} title="שלח הזמנה במייל" desc="הזמנה במייל לכל המשתתפים ברשימה" />
      </div>

      {/* Title */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: B.bigStone, marginBottom: 7 }}>כותרת</div>
        <div
          style={{
            padding: "7px 10px",
            borderRadius: 7,
            border: `1px solid ${B.athensGray}`,
            fontSize: 11.5,
            color: B.bigStone,
            background: B.white,
          }}
        >
          {s3.messageTitle}
        </div>
      </div>

      {/* Message */}
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: B.bigStone, marginBottom: 7 }}>תוכן הודעה</div>
        <div
          style={{
            padding: "9px 11px",
            borderRadius: 7,
            border: `1px solid ${B.athensGray}`,
            fontSize: 11,
            color: B.bigStone,
            background: B.white,
            whiteSpace: "pre-line",
            lineHeight: 1.55,
            minHeight: 88,
          }}
        >
          {msgShown}
          {msgTyping && <Caret />}
        </div>
      </div>
    </div>
  );
}

function CheckboxRow({ checked, title, desc }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          background: checked ? B.royalBlue : B.white,
          border: checked ? "none" : `1.5px solid ${B.cadetBlue}`,
          color: B.white,
          fontSize: 11,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          transition: "all 0.3s ease",
        }}
      >
        {checked && "✓"}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: B.bigStone }}>{title}</div>
        <div style={{ fontSize: 10.5, color: B.gullGray, marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

function Caret() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 1,
        height: 11,
        background: B.bigStone,
        marginInlineStart: 2,
        animation: "blinkCaret 0.9s steps(2) infinite",
        verticalAlign: "middle",
      }}
    />
  );
}

function Pop({ children }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, animation: "popIn 0.4s ease both" }}>{children}</span>;
}

/* ─── 11. SEND MATERIALS — distribute meeting book to attendees ─── */
function SendMaterials({ slide, active, accent, circlePos }) {
  const tick = useCycle(active, 19500);

  const panelIn = tick >= 2400;
  const matStart = 3800;
  const matInterval = 700;
  const visibleMaterials =
    tick < matStart ? 0 : Math.min(slide.materials.length, Math.floor((tick - matStart) / matInterval) + 1);
  const allMaterialsAt = matStart + slide.materials.length * matInterval;
  const buttonPulse = tick >= allMaterialsAt + 400 && tick < allMaterialsAt + 1900;
  const sendStart = allMaterialsAt + 1900;
  const attInterval = 450;
  const sentAttendees =
    tick < sendStart ? 0 : Math.min(slide.attendees.length, Math.floor((tick - sendStart) / attInterval) + 1);
  const allSent = sentAttendees >= slide.attendees.length;

  return (
    <FlowFrame slide={slide} active={active} accent={accent} circlePos={circlePos}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(23,33,52,0.34)",
          opacity: active && panelIn ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: "5%",
          bottom: "5%",
          left: "50%",
          transform: active && panelIn ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.94)",
          opacity: active && panelIn ? 1 : 0,
          transition: "all 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          width: "min(700px, 84%)",
          zIndex: 4,
        }}
      >
        <GradientRim active={active} radius={16} />
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: 14,
            background: B.white,
            boxShadow: "0 24px 70px rgba(23,33,52,0.35)",
            display: "flex",
            overflow: "hidden",
            lineHeight: 1.45,
          }}
        >
          {/* Left: materials checklist + send button */}
          <div style={{ flex: "0 0 44%", padding: "16px 18px", borderInlineEnd: `1px solid ${B.athensGray}`, display: "flex", flexDirection: "column", background: "#FBFCFE" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: B.bigStone, marginBottom: 4 }}>{slide.panelTitle}</div>
            <div style={{ fontSize: 11, color: B.gullGray, marginBottom: 12 }}>{slide.meetingName}</div>

            <div style={{ fontSize: 10.5, fontWeight: 700, color: B.gullGray, marginBottom: 6, letterSpacing: 0.4 }}>
              חומרים לשליחה
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {slide.materials.map((m, i) => {
                const on = i < visibleMaterials;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 9,
                      background: on ? `${B.teal}10` : `${B.athensGray}40`,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        background: on ? B.teal : B.white,
                        border: on ? "none" : `1.5px solid ${B.cadetBlue}`,
                        color: B.white,
                        fontSize: 11,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {on && "✓"}
                    </div>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `${B.teal}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FlatIcon name={m.icon} size={14} color={B.teal} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: B.bigStone }}>{m.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12 }}>
              <AIPill active={active} label={slide.aiTag} />
            </div>

            <div
              style={{
                marginTop: 14,
                padding: "11px 14px",
                borderRadius: 10,
                background: allSent
                  ? `${B.green}15`
                  : visibleMaterials >= slide.materials.length
                  ? `linear-gradient(135deg, ${B.orange}, ${B.royalBlue})`
                  : `${B.athensGray}60`,
                border: allSent ? `1px solid ${B.green}40` : "none",
                color: allSent ? B.green : visibleMaterials >= slide.materials.length ? B.white : B.cadetBlue,
                fontSize: 12.5,
                fontWeight: 700,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: buttonPulse ? "scale(1.03)" : "scale(1)",
                boxShadow: buttonPulse ? `0 8px 22px ${B.orange}55` : "none",
              }}
            >
              {allSent ? (
                <>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: B.green, color: B.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>✓</span>
                  נשלח לכל המשתתפים
                </>
              ) : (
                <>
                  {slide.buttonLabel}
                  <span>←</span>
                </>
              )}
            </div>
          </div>

          {/* Right: attendees getting "Sent" badges */}
          <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.bigStone, marginBottom: 10 }}>
              משתתפים ({slide.attendees.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1, overflow: "hidden" }}>
              {slide.attendees.map((a, i) => {
                const sent = i < sentAttendees;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 9,
                      background: sent ? `${B.green}10` : `${B.athensGray}30`,
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: a.bg,
                        color: B.white,
                        fontSize: 10,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {a.initials}
                    </div>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: B.bigStone }}>{a.name}</div>
                    {sent ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 12,
                          background: `${B.green}18`,
                          color: B.green,
                          fontSize: 10,
                          fontWeight: 700,
                          animation: "popIn 0.45s ease both",
                        }}
                      >
                        <FlatIcon name="mail" size={11} color={B.green} />
                        {slide.sentLabel}
                      </div>
                    ) : (
                      <span style={{ fontSize: 10, color: B.cadetBlue }}>—</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </FlowFrame>
  );
}
