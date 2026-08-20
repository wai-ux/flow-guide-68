import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "mm";

type Dict = Record<string, { en: string; mm: string }>;

export const dict: Dict = {
  appName: { en: "Gatekeeper", mm: "Gatekeeper" },
  tagline: {
    en: "Know what deserves your attention",
    mm: "ဘာကို အရင်ဆုံး အာရုံစိုက်သင့်လဲ သိလိုက်ပါ",
  },
  // nav
  today: { en: "Today", mm: "ဒီနေ့" },
  plan: { en: "Plan", mm: "အစီအစဉ်" },
  library: { en: "Library", mm: "အရင်းအမြစ်" },
  back: { en: "Back", mm: "ပြန်သွား" },
  // onboarding
  step: { en: "Step", mm: "အဆင့်" },
  of: { en: "of", mm: "/" },
  goalTitle: { en: "What are you learning toward?", mm: "ဘာအတွက် သင်ယူနေတာလဲ?" },
  goalHelp: {
    en: "One sentence. The exam, project, or skill that matters right now.",
    mm: "စာမေးပွဲ၊ project သို့မဟုတ် အခု အရေးကြီးတဲ့ skill ကို တစ်ကြောင်းတည်း ရေးပါ။",
  },
  goalPlaceholder: {
    en: "e.g. Pass the Machine Learning midterm on Friday",
    mm: "ဥပမာ - သောကြာနေ့ Machine Learning midterm အောင်ရန်",
  },
  goalError: { en: "Please describe your goal to continue.", mm: "ဆက်လက်ရန် ရည်မှန်းချက်ကို ရေးပေးပါ။" },
  deadline: { en: "Deadline", mm: "နောက်ဆုံးရက်" },
  hoursPerDay: { en: "Study hours per day", mm: "တစ်ရက် သင်ယူချိန် (နာရီ)" },
  next: { en: "Continue", mm: "ဆက်လုပ်" },
  resourcesTitle: { en: "Add the material you already have", mm: "လက်ရှိ ရှိပြီးသား အရင်းအမြစ်များ ထည့်ပါ" },
  resourcesHelp: {
    en: "Drop files or paste links. The gatekeeper reads context, not just titles.",
    mm: "ဖိုင်တင်ပါ (သို့) link ကူးထည့်ပါ။ Gatekeeper က ခေါင်းစဉ်တင်မဟုတ်ဘဲ အကြောင်းအရာကို ဖတ်ပါတယ်။",
  },
  dropzone: { en: "Click to add a file", mm: "ဖိုင်ထည့်ရန် နှိပ်ပါ" },
  pasteLink: { en: "Paste a link (YouTube, article, docs)", mm: "Link ကူးထည့်ပါ (YouTube, article, docs)" },
  add: { en: "Add", mm: "ထည့်" },
  remove: { en: "Remove", mm: "ဖျက်" },
  resourceEmpty: {
    en: "Nothing added yet. Even 3 sources are enough to start.",
    mm: "မထည့်ရသေးပါ။ အရင်းအမြစ် ၃ ခုဆိုလည်း စလို့ရပါတယ်။",
  },
  needOne: { en: "Add at least one resource to continue.", mm: "ဆက်လုပ်ရန် အရင်းအမြစ် အနည်းဆုံး ၁ ခု ထည့်ပါ။" },
  prioritize: { en: "Prioritise for me", mm: "ကျွန်ုပ်အတွက် အစီအစဉ်ချပါ" },
  analyzing: { en: "Reading your material…", mm: "သင့်အရင်းအမြစ်များကို ဖတ်နေသည်…" },
  analyzingSub: {
    en: "Filtering noise, mapping dependencies, ranking by urgency.",
    mm: "မလိုအပ်တာ ဖယ်၊ အခြေခံ ဆက်နွယ်မှု ရှာ၊ အရေးပေါအလိုက် အစီအစဉ်ချနေသည်။",
  },
  // dashboard
  greeting: { en: "Good morning, Su", mm: "မင်္ဂလာနံနက်ခင်းပါ စု" },
  todayQuestion: { en: "What should I do today?", mm: "ဒီနေ့ ဘာလုပ်ရမလဲ?" },
  todayAnswer: { en: "Start here", mm: "ဒီကနေ စပါ" },
  todayWhy: { en: "Why this first", mm: "ဘာလို့ ဒါကို အရင်လုပ်ရမလဲ" },
  startNow: { en: "Start this", mm: "ဒါကို စလုပ်" },
  minutes: { en: "min", mm: "မိနစ်" },
  filteredOut: { en: "Filtered out", mm: "ဖယ်ထားသည်" },
  filteredOutHelp: {
    en: "Not relevant to your goal right now.",
    mm: "အခု ရည်မှန်းချက်နဲ့ မသက်ဆိုင်သေးပါ။",
  },
  goalLabel: { en: "Goal", mm: "ရည်မှန်းချက်" },
  editGoal: { en: "Edit", mm: "ပြင်" },
  daysLeft: { en: "days left", mm: "ရက် ကျန်" },
  progress: { en: "Understanding", mm: "နားလည်မှု" },
  attention: { en: "Your attention today", mm: "ဒီနေ့ အာရုံစိုက်ရမည်" },
  // priority buckets
  urgent: { en: "Urgent", mm: "အရေးပေါ" },
  urgentWhy: { en: "Graded soon", mm: "မကြာမီ အမှတ်ပေးမည်" },
  priority: { en: "Priority", mm: "အရေးကြီး" },
  priorityWhy: { en: "Core to your goal", mm: "ရည်မှန်းချက်၏ အဓိက" },
  foundation: { en: "Foundation", mm: "အခြေခံ" },
  foundationWhy: { en: "Other topics depend on it", mm: "အခြားအကြောင်းအရာများ မှီနေသည်" },
  later: { en: "Later", mm: "နောက်မှ" },
  laterWhy: { en: "Safe to postpone", mm: "ဆိုင်းထားလို့ ရသည်" },
  topics: { en: "topics", mm: "အကြောင်းအရာ" },
  // topic
  branch: { en: "Learning branch", mm: "သင်ယူမှု အကိုင်းအခက်" },
  branchHelp: {
    en: "Concepts in dependency order. Open one to see its sources.",
    mm: "အခြေခံမှ အစီအစဉ်တကျ။ တစ်ခုကို ဖွင့်ကြည့်ပါ။",
  },
  sources: { en: "Relevant sources", mm: "သက်ဆိုင်ရာ အရင်းအမြစ်" },
  sourcesHelp: {
    en: "The right resource for this concept — not all 20.",
    mm: "ဒီအကြောင်းအရာအတွက် သင့်တော်တဲ့ အရင်းအမြစ်သာ။",
  },
  markRead: { en: "Mark as studied", mm: "သင်ယူပြီး မှတ်" },
  studied: { en: "Studied", mm: "သင်ယူပြီး" },
  check: { en: "Check my understanding", mm: "နားလည်မှု စစ်ပါ" },
  checkTitle: { en: "Understanding check", mm: "နားလည်မှု စစ်ဆေးမှု" },
  checkHelp: {
    en: "Explain in your own words. There is no score, only direction.",
    mm: "သင့်စကားလုံးနဲ့ ရှင်းပြပါ။ အမှတ်မဟုတ်ဘဲ လမ်းကြောင်းပဲ ပြပါမည်။",
  },
  answerPlaceholder: { en: "Write your explanation…", mm: "သင့်ရှင်းလင်းချက်ကို ရေးပါ…" },
  answerTooShort: {
    en: "Write a little more so we can find the real gap.",
    mm: "ချို့တဲ့ချက် အမှန်ကို ရှာနိုင်ရန် ထပ်ရေးပေးပါ။",
  },
  submitAnswer: { en: "Submit", mm: "တင်ပါ" },
  checking: { en: "Reading your explanation…", mm: "သင့်အဖြေကို ဖတ်နေသည်…" },
  gapFound: { en: "Knowledge gap found", mm: "ချို့တဲ့ချက် တွေ့ပါသည်" },
  solid: { en: "That holds up", mm: "ကောင်းပါသည်" },
  solidBody: {
    en: "You connected the idea to why it exists. This concept is marked understood.",
    mm: "အကြောင်းရင်းနှင့် ချိတ်ဆက်ပြနိုင်ပါသည်။ ဒီအကြောင်းအရာကို နားလည်ပြီးအဖြစ် မှတ်ထားပါမည်။",
  },
  microBranch: { en: "Micro-branch created", mm: "အသေးစား အကိုင်းအခက် ဖန်တီးပြီး" },
  recommended: { en: "Recommended next step", mm: "အကြံပြု နောက်တစ်ဆင့်" },
  closeGap: { en: "Close this gap", mm: "ဒီချို့တဲ့ချက် ဖြေရှင်း" },
  continueBranch: { en: "Continue the branch", mm: "အကိုင်းအခက် ဆက်လုပ်" },
  done: { en: "Done for now", mm: "ခေတ္တ ပြီးပါပြီ" },
  retry: { en: "Try again", mm: "ပြန်စမ်း" },
  // states
  loading: { en: "Loading", mm: "ဖွင့်နေသည်" },
  errorTitle: { en: "That didn't go through", mm: "မအောင်မြင်ပါ" },
  errorBody: {
    en: "Your work is saved. Try once more.",
    mm: "သင့်အလုပ်ကို သိမ်းထားပါသည်။ ထပ်စမ်းကြည့်ပါ။",
  },
  emptyPlan: { en: "No plan yet", mm: "အစီအစဉ် မရှိသေးပါ" },
  emptyPlanBody: {
    en: "Add your goal and materials and the gatekeeper will decide what comes first.",
    mm: "ရည်မှန်းချက်နှင့် အရင်းအမြစ်များ ထည့်ပါ။ Gatekeeper က ဘာအရင်လုပ်ရမည် ဆုံးဖြတ်ပေးပါမည်။",
  },
  buildPlan: { en: "Build my plan", mm: "အစီအစဉ် ဆောက်ပါ" },
  reset: { en: "Reset prototype", mm: "Prototype ပြန်စ" },
  savedToast: { en: "Saved", mm: "သိမ်းပြီး" },
  lightMode: { en: "Light", mm: "အလင်း" },
  darkMode: { en: "Dark", mm: "အမည်း" },
  langLabel: { en: "Language", mm: "ဘာသာစကား" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("gk-lang");
    if (stored === "mm" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "mm" ? "my" : "en";
    document.documentElement.dataset["lang"] = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("gk-lang", l);
  };

  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Pick a localized field from content data. */
export function useL() {
  const { lang } = useLang();
  return (pair: { en: string; mm: string }) => pair[lang];
}
