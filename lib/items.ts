export type Answer = "api" | "no" | "dep";

export type Question = {
  en: string;
  ar: string;
  a: Answer;
  /** One-line reason, shown next to the verdict. */
  why?: string;
  /** For "dep" items: when it needs an API and when it doesn't. */
  sides?: { api: string; no: string };
};

export type Item = Question & {
  app: string;
  /** Asked right after this item, as part of it. */
  follow?: Question;
};

export const LABEL: Record<Answer, string> = {
  api: "يحتاج API",
  no: "ما يحتاج API",
  dep: "يعتمد",
};

export const ITEMS: Item[] = [
  { app: "أي تطبيق", en: "Add a dark-mode switch", ar: "زر الوضع الليلي", a: "no",
    why: "تغيير ألوان بس، داخل الجهاز." },
  { app: "طلبات", en: "Show the driver moving on the map", ar: "تتبّع المندوب على الخريطة", a: "api",
    why: "موقع المندوب يجيك من سيرفر طلبات." },
  { app: "أي موقع", en: "Check that a password is strong enough", ar: "التأكد إن كلمة السر قوية", a: "no",
    why: "شروط بسيطة تنفحص داخل الجهاز." },
  { app: "خرائط", en: "Show the distance between two locations", ar: "المسافة بين مكانين", a: "dep",
    sides: { api: "مسافة الطريق بالسيارة.", no: "خط مستقيم: معادلة رياضية." } },
  { app: "إنستغرام", en: "Preview a photo the user picks", ar: "عرض الصورة اللي اختارها المستخدم", a: "no",
    why: "الصورة ما طلعت من الجهاز." },
  { app: "أي بنك", en: "Send a login code by SMS", ar: "رمز تحقق برسالة SMS", a: "api",
    why: "الموقع ما يقدر يرسل SMS بنفسه." },
  { app: "بنك", en: "Convert KWD to USD at today's rate", ar: "تحويل الدينار للدولار بسعر اليوم", a: "api",
    why: "السعر يتغير ويجي من خدمة خارجية." },
  { app: "موسيقى", en: "Play music in the app", ar: "تشغيل أغنية", a: "dep",
    sides: { api: "أغاني من Spotify.", no: "ملف صوت في مشروعك." } },
  { app: "أي موقع", en: "Sign in with Google", ar: "تسجيل الدخول بحساب Google", a: "api",
    why: "Google هي اللي تتأكد منك." },
  { app: "مشروعك", en: "Create a simple quiz", ar: "سوّ اختبار بسيط", a: "no",
    why: "الأسئلة مكتوبة في الكود.",
    follow: { en: "What if you want new questions every game?", ar: "وإذا تبي أسئلة جديدة كل مرة تلعب؟", a: "api",
      why: "تحتاج AI أو قاعدة بيانات أسئلة." } },
];

export const TOTAL = ITEMS.length + ITEMS.filter((i) => i.follow).length;

export function points(q: Question, picked: Answer): number {
  if (picked === q.a) return 1;
  return q.a === "dep" ? 0.5 : 0;
}

export function verdict(q: Question, picked: Answer): ["ok" | "bad" | "half", string] {
  if (picked === q.a) return ["ok", "صح!"];
  if (q.a === "dep") return ["half", "نص صح: هذي تعتمد"];
  if (picked === "dep") return ["bad", "هنا الجواب واضح: " + LABEL[q.a]];
  return ["bad", "لا، الجواب " + LABEL[q.a]];
}
