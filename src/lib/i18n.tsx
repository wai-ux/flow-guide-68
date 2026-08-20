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
  examples: { en: "Tap an example — no typing needed", mm: "ဥပမာတစ်ခု နှိပ်ပါ — ရေးစရာမလိုပါ" },
  example1: {
    en: "Pass the Machine Learning midterm on Friday",
    mm: "သောကြာနေ့ Machine Learning midterm အောင်ရန်",
  },
  example2: {
    en: "Understand neural networks well enough to build one",
    mm: "Neural network တစ်ခု တည်ဆောက်နိုင်အောင် နားလည်ရန်",
  },
  example3: {
    en: "Finish Assignment 3 on backpropagation this week",
    mm: "ဒီအတိတ်အတွင်း backpropagation Assignment 3 အပြီးသတ်ရန်",
  },
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
  focusToday: { en: "Your focus today", mm: "ဒီနေ့ အာရုံစိုက်ရမည့်အရာ" },
  everythingElse: { en: "Everything else", mm: "အခြားအရာများ" },

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
  searchSources: { en: "Search material…", mm: "အချက်အလက် ရှာရန်…" },
  allKinds: { en: "All", mm: "အားလုံး" },
  yourUploads: { en: "Your uploads", mm: "သင်တင်ထားသည်" },
  itemsCount: { en: "items", mm: "ခု" },
  noMatches: { en: "Nothing matches that filter.", mm: "ကိုက်ညီသည် မရှိပါ။" },
  // topic
  branch: { en: "Learning branch", mm: "သင်ယူမှု အကိုင်းအခက်" },
  branchHelp: {
    en: "Concepts in dependency order. Open one to see its sources.",
    mm: "အခြေခံမှ အစီအစဉ်တကျ။ တစ်ခုကို ဖွင့်ကြည့်ပါ။",
  },
  sources: { en: "Relevant sources", mm: "သက်ဆိုင်ရာ အရင်းအမြစ်" },
  sourcesHelp: {
    en: "Videos, articles and your own files — only the ones this concept needs.",
    mm: "ဗီဒီယို၊ ဆောင်းပါးနှင့် သင့်ဖိုင် — ဒီအကြောင်းအရာအတွက် လိုအပ်တာသာ။",
  },
  kindVideo: { en: "Video", mm: "ဗီဒီယို" },
  kindArticle: { en: "Article", mm: "ဆောင်းပါး" },
  kindPdf: { en: "PDF", mm: "PDF" },
  kindSlides: { en: "Slides", mm: "Slides" },
  kindNotes: { en: "Notes", mm: "မှတ်စု" },
  watch: { en: "Watch", mm: "ကြည့်ရန်" },
  read: { en: "Read", mm: "ဖတ်ရန်" },
  yourFile: { en: "Your file", mm: "သင့်ဖိုင်" },

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
  // concept checkpoints + recovery path
  cpTitle: { en: "Concept checkpoints", mm: "အကြောင်းအရာ စစ်ဆေးချက်များ" },
  cpHelp: {
    en: "Two quick checks before you explain it yourself.",
    mm: "ကိုယ်တိုင် ရှင်းပြခင် အမြန်စစ်ဆေးချက် ၂ ခု။" ,
  },
  cpProgress: { en: "Checkpoint", mm: "စစ်ဆေးချက်" },
  cpCorrect: { en: "Correct", mm: "မှန်ပါသည်" },
  cpWrong: { en: "Not quite", mm: "မမှန်သေးပါ" },
  cpTests: { en: "Tests", mm: "စစ်သည်" },
  cpNext: { en: "Next checkpoint", mm: "နောက်စစ်ဆေးချက်" },
  cpToRecall: { en: "Explain it yourself", mm: "ကိုယ်တိုင် ရှင်းပြပါ" },
  recoveryTitle: { en: "Recovery path", mm: "ပြန်လည်ကုစားလမ်းကြောင်း" },
  recoveryHelp: {
    en: "Built from the checkpoint you missed.",
    mm: "မှားသွားသော စစ်ဆေးချက်အပေါ် အခြေခံ ဖန်တီးထားသည်။",
  },
  recoveryStart: { en: "Start recovery", mm: "ကုစားမှု စတင်" },
  recoveryRecheck: { en: "Re-check now", mm: "အခု ပြန်စစ်ပါ" },
  recoveryOpen: { en: "Open source", mm: "အရင်းအမြစ် ဖွင့်" },
  recovered: { en: "Gap closed", mm: "ချို့တဲ့ချက် ပိတ်ပြီး" },
  recoveredBody: {
    en: "You cleared the checkpoint that broke. Continue where you left off.",
    mm: "မှားသွားသော စစ်ဆေးချက်ကို ဖြေရှင်းပြီးပါပြီ။ ဆက်လုပ်နိုင်ပါသည်။",
  },
  continueLearning: { en: "Continue", mm: "ဆက်လုပ်" },
  skipRecovery: { en: "Skip for now", mm: "ခေတ္တ ကျော်" },
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
  resourcesCount: { en: "sources", mm: "အရင်းအမြစ်" },
  perDay: { en: "hrs/day", mm: "နာရီ/ရက်" },
  lightMode: { en: "Light", mm: "အလင်း" },
  darkMode: { en: "Dark", mm: "အမည်း" },
  langLabel: { en: "Language", mm: "ဘာသာစကား" },
  // learning branch session
  session: { en: "Session", mm: "သင်ခန်းစာ" },
  stepOf: { en: "Step", mm: "အဆင့်" },
  goDeeper: { en: "Go deeper", mm: "ပိုအနက် ဆက်ကြည့်" },
  deeperBranches: { en: "Deeper branches", mm: "အနက်ပိုသော အကိုင်းအခက်" },
  deeperHelp: {
    en: "Unlocked once you understand this concept.",
    mm: "ဒီအကြောင်းအရာ နားလည်ပြီးမှ ဖွင့်ပေးမည်။",
  },
  prevConcept: { en: "Previous", mm: "အရင်တစ်ခု" },
  nextConcept: { en: "Next", mm: "နောက်တစ်ခု" },
  levelLabel: { en: "Level", mm: "အဆင့်" },
  expandAll: { en: "Expand all", mm: "အားလုံး ဖွင့်" },
  collapseAll: { en: "Collapse all", mm: "အားလုံး ပိတ်" },
  branchDone: { en: "Branch complete", mm: "အကိုင်းအခက် ပြီးပါသည်" },
  branchDoneBody: {
    en: "Every concept in this branch is understood. Back to the plan for the next priority.",
    mm: "ဒီအကိုင်းအခက်ရဲ့ အကြောင်းအရာ အားလုံး နားလည်ပြီးပါသည်။ နောက်ထပ် ဦးစားပေးအတွက် အစီအစဉ်ဆီ ပြန်သွားပါ။",
  },
  remaining: { en: "left", mm: "ကျန်" },
  understood: { en: "Understood", mm: "နားလည်ပြီး" },
  toReview: { en: "Needs review", mm: "ပြန်ကြည့်ရန်" },
  notStarted: { en: "Not started", mm: "မစသေးပါ" },
  subCount: { en: "sub-concepts", mm: "အခွဲ အကြောင်းအရာ" },
  // auth
  signIn: { en: "Sign in", mm: "အကောင့်ဝင်" },
  signOut: { en: "Sign out", mm: "ထွက်" },
  signInTitle: { en: "Welcome back", mm: "ပြန်လာတာ ကြိုဆိုပါတယ်" },
  signUpTitle: { en: "Create your account", mm: "အကောင့် အသစ်ဖွင့်ပါ" },
  authSub: {
    en: "Your goal, sources and understanding progress are saved to your account.",
    mm: "သင့်ရည်မှန်းချက်၊ အရင်းအမြစ်နှင့် နားလည်မှု တိုးတက်မှုကို အကောင့်တွင် သိမ်းထားပါမည်။",
  },
  createAccount: { en: "Create account", mm: "အကောင့် ဖွင့်" },
  demoLogin: { en: "Continue with demo account", mm: "Demo အကောင့်နှင့် ဆက်လုပ်" },
  googleLogin: { en: "Continue with Google", mm: "Google နှင့် ဆက်လုပ်" },
  demoHint: {
    en: "No typing needed — one tap signs you into a ready-made account.",
    mm: "ရေးစရာမလိုပါ — တစ်ချက်နှိပ်ရုံနှင့် အသင့်အကောင့်ထဲ ဝင်ရောက်နိုင်ပါသည်။",
  },
  orEmail: { en: "or with email", mm: "သို့မဟုတ် အီးမေးလ်" },
  nameLabel: { en: "Name", mm: "အမည်" },
  namePlaceholder: { en: "Su Su", mm: "စုစု" },
  emailLabel: { en: "Email", mm: "အီးမေးလ်" },
  passwordLabel: { en: "Password", mm: "စကားဝှက်" },
  authInvalid: {
    en: "Enter a valid email and a password of at least 6 characters.",
    mm: "မှန်ကန်သော အီးမေးလ်နှင့် အနည်းဆုံး ၆ လုံးရှိသော စကားဝှက် ထည့်ပါ။",
  },
  noAccount: { en: "New here?", mm: "အသစ်လာသူလား?" },
  haveAccount: { en: "Already have an account?", mm: "အကောင့် ရှိပြီးသားလား?" },
  account: { en: "Account", mm: "အကောင့်" },
  // settings & subscription
  settings: { en: "Settings", mm: "ဆက်တင်" },
  settingsSub: {
    en: "Manage your account and your Gatekeeper plan.",
    mm: "သင့်အကောင့်နှင့် Gatekeeper အစီအစဉ်ကို စီမံပါ။",
  },
  subscription: { en: "Subscription", mm: "အသင်းဝင်ခ" },
  currentPlan: { en: "current plan", mm: "လက်ရှိ အစီအစဉ်" },
  planFree: { en: "Free", mm: "အခမဲ့" },
  planPro: { en: "Pro", mm: "Pro" },
  perMonth: { en: "month", mm: "လ" },
  yourPlanNow: { en: "This is your plan right now.", mm: "ဒါက သင့်လက်ရှိ အစီအစဉ်ပါ။" },
  featFree1: { en: "1 learning goal at a time", mm: "တစ်ချိန်တည်း ရည်မှန်းချက် ၁ ခု" },
  featFree2: { en: "Up to 5 resources", mm: "အရင်းအမြစ် ၅ ခုအထိ" },
  featFree3: { en: "Basic understanding checks", mm: "အခြေခံ နားလည်မှု စစ်ဆေးမှု" },
  featPro1: { en: "Unlimited goals and resources", mm: "ရည်မှန်းချက်နှင့် အရင်းအမြစ် အကန့်အသတ်မရှိ" },
  featPro2: { en: "Deep learning branches with sub-concepts", mm: "အခွဲအကြောင်းအရာပါ နက်ရိုင်းသော သင်ယူမှု ခွဲများ" },
  featPro3: { en: "Unlimited understanding checks & gap coaching", mm: "နားလည်မှု စစ်ဆေးမှုနှင့် အသိကွာဟမှု လမ်းညွှန် အကန့်အသတ်မရှိ" },
  featPro4: { en: "Cloud sync across devices", mm: "စက်အားလုံးတွင် Cloud sync" },
  upgradeCta: { en: "Upgrade for {price}/month", mm: "တစ်လ {price} နှင့် အဆင့်တင်ပါ" },
  confirmUpgrade: {
    en: "You will be billed {price} every month. You can cancel any time.",
    mm: "တစ်လတိုင်း {price} ကောက်ခံပါမည်။ အချိန်မရွေး ရပ်နိုင်ပါသည်။",
  },
  confirmPay: { en: "Confirm and subscribe", mm: "အတည်ပြု၍ စာရင်းသွင်း" },
  cancelAction: { en: "Cancel", mm: "မလုပ်တော့" },
  upgradeSuccess: {
    en: "You're on Pro. All features are unlocked.",
    mm: "Pro ဖြစ်ပါပြီ။ feature အားလုံး ဖွင့်ပြီးပါပြီ။",
  },
  billingNote: {
    en: "Prototype billing — no real payment is taken yet.",
    mm: "စမ်းသပ် ကောက်ခံမှု — အမှန်တကယ် ငွေ မကောက်ခံပါ။",
  },
  renewsOn: { en: "Renews on {date}", mm: "{date} တွင် သက်တမ်းတိုးမည်" },
  endsOn: { en: "Ends on {date}", mm: "{date} တွင် ရပ်မည်" },
  cancelPlan: { en: "Cancel subscription", mm: "အသင်းဝင်မှု ရပ်" },
  resumePlan: { en: "Resume subscription", mm: "အသင်းဝင်မှု ပြန်စ" },
  proBadge: { en: "Pro", mm: "Pro" },
  planOneTime: { en: "One-time AI assessment", mm: "တစ်ကြိမ်သာ AI အဆင့်စစ်ဆေးမှု" },
  oneTimeTag: { en: "one-time", mm: "တစ်ကြိမ်သာ" },
  featOne1: { en: "One full AI assessment of your material", mm: "သင့်စာမေးမှုအားလုံးအတွက် AI အဆင့်စစ်ဆေးမှု တစ်ကြိမ်" },
  featOne2: { en: "Prioritised plan: urgent, priority, foundation, later", mm: "အရေးပေါ်၊ ဦးစား၊ အခြေခံ၊ နောက်မှ အစီအစဉ်" },
  featOne3: { en: "One learning branch with understanding check", mm: "နားလည်မှု စစ်ဆေးမှုပါ သင်ယူမှုခွဲ ၁ ခု" },
  featOne4: { en: "No subscription, no auto-renewal", mm: "အသင်းဝင်ခ မလို၊ အလိုအလျောက် မတိုးပါ" },
  buyOneTime: { en: "Buy once for {price}", mm: "{price} နှင့် တစ်ကြိမ်သာ ဝယ်ပါ" },
  confirmOneTime: {
    en: "You will be charged {price} once. Nothing renews.",
    mm: "{price} တစ်ကြိမ်သာ ကောက်ခံပါမည်။ သက်တမ်း မတိုးပါ။",
  },
  confirmBuy: { en: "Confirm and pay", mm: "အတည်ပြု၍ ပေးရန်" },
  oneTimeSuccess: {
    en: "Your one-time AI assessment is unlocked.",
    mm: "သင့် တစ်ကြိမ်သာ AI အဆင့်စစ်ဆေးမှု ဖွင့်ပြီးပါပြီ။",
  },
  oneTimeOwned: { en: "Purchased on {date} · 1 assessment available", mm: "{date} တွင် ဝယ်ပြီး · အဆင့်စစ်ဆေးမှု ၁ ခု ရနိုင်" },
  oneTimeIncluded: { en: "Included in your Pro plan.", mm: "သင့် Pro အစီအစဉ်တွင် ပါဝင်ပြီးပါပြီ။" },

  upgrade: { en: "Upgrade", mm: "အဆင့်တင်" },
  getStarted: { en: "Get started", mm: "စတင်ပါ" },
  stepPrioritise: {
    en: "Add your goal and material — the gatekeeper prioritises it",
    mm: "ရည်မှန်းချက်နှင့် အရင်းအမြစ် ထည့်ပါ — Gatekeeper က အစီအစဉ်ချပေးမည်",
  },
  stepBranch: {
    en: "Follow a learning branch in dependency order",
    mm: "အခြေခံမှ အစီအစဉ်တကျ သင်ယူမှု အကိုင်းအခက်ကို လိုက်ပါ",
  },
  stepCheck: {
    en: "Explain it back — the understanding check finds the gap",
    mm: "ပြန်ရှင်းပြပါ — နားလည်မှု စစ်ဆေးမှုက ချို့တဲ့ချက်ကို ရှာပေးမည်",
  },
  stepClose: {
    en: "Close the gap, then continue with confidence",
    mm: "ချို့တဲ့ချက်ကို ဖြေရှင်းပြီး စိတ်ချလက်ချ ဆက်လုပ်ပါ",
  },
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
