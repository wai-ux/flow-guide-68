export type Bucket = "urgent" | "priority" | "foundation" | "later" | "filtered";

export type L = { en: string; mm: string };

export type Source = {
  id: string;
  kind: "pdf" | "video" | "article" | "slides" | "notes";
  title: L;
  meta: L;
  minutes: number;
};

export type Concept = {
  id: string;
  title: L;
  question: L;
  summary: L;
  minutes: number;
  sourceIds: string[];
  /** Understanding-check prompt */
  prompt: L;
  /** What a strong answer must connect */
  expects: L;
  /** Gap surfaced when the answer is thin */
  gap: L;
  gapFix: L;
  children?: Concept[];
};

export type Topic = {
  id: string;
  title: L;
  bucket: Bucket;
  why: L;
  minutes: number;
  dueIn?: number;
  concepts: Concept[];
};

export const sources: Record<string, Source> = {
  s1: {
    id: "s1",
    kind: "pdf",
    title: { en: "Lecture 06 — Neural Networks (slides)", mm: "သင်ခန်းစာ ၆ — Neural Networks (slides)" },
    meta: { en: "Prof. Aung · 42 pages · your upload", mm: "ဆရာ အောင် · ၄၂ မျက်နှာ · သင်တင်ထားသည်" },
    minutes: 25,
  },
  s2: {
    id: "s2",
    kind: "video",
    title: { en: "But what is a neural network?", mm: "Neural network ဆိုတာ ဘာလဲ?" },
    meta: { en: "3Blue1Brown · 19 min · pasted link", mm: "3Blue1Brown · ၁၉ မိနစ် · link ထည့်ထားသည်" },
    minutes: 19,
  },
  s3: {
    id: "s3",
    kind: "article",
    title: { en: "Activation functions, compared", mm: "Activation functions နှိုင်းယှဉ်ချက်" },
    meta: { en: "Distill-style explainer · 8 min read", mm: "ရှင်းလင်းချက် ဆောင်းပါး · ၈ မိနစ်" },
    minutes: 8,
  },
  s4: {
    id: "s4",
    kind: "notes",
    title: { en: "Your tutorial notes — week 5", mm: "သင့် tutorial မှတ်စု — ၅ ပတ်" },
    meta: { en: "handwritten scan · 6 pages", mm: "လက်ရေးမူ scan · ၆ မျက်နှာ" },
    minutes: 10,
  },
  s5: {
    id: "s5",
    kind: "pdf",
    title: { en: "Assignment 3 brief — backprop by hand", mm: "Assignment ၃ — backprop လက်နှင့်တွက်" },
    meta: { en: "due Friday 5pm · graded 20%", mm: "သောကြာ ၅ နာရီ · အမှတ် ၂၀%" },
    minutes: 15,
  },
  s6: {
    id: "s6",
    kind: "slides",
    title: { en: "Calculus refresher — chain rule", mm: "Calculus ပြန်လှန်ခြင်း — chain rule" },
    meta: { en: "Maths dept · 12 slides", mm: "သင်္ချာဌာန · ၁၂ slides" },
    minutes: 12,
  },
  s7: {
    id: "s7",
    kind: "article",
    title: { en: "Why loss functions exist", mm: "Loss function ဘာလို့ လိုအပ်လဲ" },
    meta: { en: "blog · 6 min read", mm: "blog · ၆ မိနစ်" },
    minutes: 6,
  },
  s8: {
    id: "s8",
    kind: "video",
    title: { en: "Transformers explained", mm: "Transformers ရှင်းလင်းချက်" },
    meta: { en: "not in this exam scope", mm: "ဒီစာမေးပွဲ အတွင်း မပါဝင်" },
    minutes: 32,
  },
};

const backprop: Concept = {
  id: "c-backprop",
  title: { en: "Backpropagation", mm: "Backpropagation" },
  question: { en: "How does a network learn from its mistake?", mm: "Network က အမှားကနေ ဘယ်လို သင်ယူလဲ?" },
  summary: {
    en: "Error at the output is pushed backwards through the layers so every weight learns how much it contributed.",
    mm: "အထွက်မှ အမှားကို layer အလိုက် ပြန်တွန်းပို့ခြင်းဖြင့် weight တစ်ခုချင်း သူ့ပါဝင်မှုကို သိရသည်။",
  },
  minutes: 30,
  sourceIds: ["s5", "s1", "s6"],
  prompt: {
    en: "Why is backpropagation necessary when training a neural network?",
    mm: "Neural network တစ်ခု သင်ကြားရာမှာ backpropagation ဘာလို့ လိုအပ်တာလဲ?",
  },
  expects: {
    en: "Connect the loss to each weight via the chain rule — credit assignment, not just 'it updates weights'.",
    mm: "Loss ကို weight တစ်ခုချင်းနှင့် chain rule မှတဆင့် ချိတ်ဆက်ပြပါ — 'weight ကို update လုပ်တယ်' ဆိုတာထက် ပိုလိုသည်။",
  },
  gap: {
    en: "You described what backprop does, but not why gradients must be chained layer by layer.",
    mm: "Backprop ဘာလုပ်သည်ကို ပြောပြနိုင်သော်လည်း gradient ကို layer အလိုက် ဘာလို့ ချိတ်ရသည်ကို မရှင်းပြရသေးပါ။",
  },
  gapFix: { en: "Chain rule → credit assignment", mm: "Chain rule → ပါဝင်မှု ခွဲခြားခြင်း" },
  children: [
    {
      id: "c-chain",
      title: { en: "Chain rule, intuitively", mm: "Chain rule ကို အလိုလို နားလည်ခြင်း" },
      question: { en: "Why can derivatives be multiplied through layers?", mm: "Derivative များကို layer တွေမှတဆင့် ဘာလို့ မြှောက်လို့ရလဲ?" },
      summary: {
        en: "Each layer is a function of the previous one, so a small nudge travels through as a product of local slopes.",
        mm: "Layer တစ်ခုစီ သူ့မတိုင်ခင်၏ function ဖြစ်သဖြင့် အသေးအမွှား ပြောင်းလဲမှုသည် local slope များ၏ ရလဒ်အဖြစ် ကူးသွားသည်။",
      },
      minutes: 12,
      sourceIds: ["s6"],
      prompt: {
        en: "In one nudge: if a weight deep in the network changes slightly, how does the loss feel it?",
        mm: "Network အတွင်းပိုင်း weight တစ်ခု အနည်းငယ် ပြောင်းလိုက်လျှင် loss က ဘယ်လို သိလဲ?",
      },
      expects: { en: "Product of local derivatives along the path.", mm: "လမ်းကြောင်းတစ်လျှောက် local derivative များ၏ မြှောက်လဒ်။" },
      gap: { en: "The path from weight to loss is still missing.", mm: "Weight မှ loss သို့ လမ်းကြောင်း မပါသေးပါ။" },
      gapFix: { en: "Trace one path end to end", mm: "လမ်းကြောင်းတစ်ခုကို အစမှအဆုံး ဆွဲကြည့်ပါ" },
      children: [
        {
          id: "c-local-deriv",
          title: { en: "Local derivatives at one node", mm: "Node တစ်ခု၏ local derivative" },
          question: { en: "What does one node contribute?", mm: "Node တစ်ခု ဘာပါဝင်မှု ပေးလဲ?" },
          summary: {
            en: "Every node only needs to know its own slope; backprop stitches those slopes together.",
            mm: "Node တစ်ခုစီ သူ့ slope ကိုသာ သိရသည်။ Backprop က ထို slope များကို ချိတ်ဆက်ပေးသည်။",
          },
          minutes: 8,
          sourceIds: ["s6"],
          prompt: {
            en: "Why is it enough for a node to know only its own derivative?",
            mm: "Node တစ်ခုက သူ့ derivative ကိုသာ သိရင် ဘာလို့ လုံလောက်လဲ?",
          },
          expects: { en: "Because the incoming gradient carries everything downstream.", mm: "အဝင် gradient သည် အောက်ပိုင်းအားလုံးကို သယ်လာသဖြင့်။" },
          gap: { en: "The incoming gradient's role isn't explained.", mm: "အဝင် gradient ၏ အခန်းကနေ မရှင်းပြရသေးပါ။" },
          gapFix: { en: "Follow one gradient into a node", mm: "Gradient တစ်ခု node အထဲ ဝင်သွားပုံ ကြည့်ပါ" },
        },
        {
          id: "c-two-paths",
          title: { en: "When two paths meet", mm: "လမ်းကြောင်း နှစ်ခု ဆုံသည့်အခါ" },
          question: { en: "Why do gradients add?", mm: "Gradient များ ဘာလို့ ပေါင်းလဲ?" },
          summary: {
            en: "If a weight influences the loss through two routes, its total effect is the sum of both routes.",
            mm: "Weight တစ်ခုက loss ကို လမ်းကြောင်း နှစ်ခုမှ ထိခိုက်လျှင် စုစုပေါင်း အကျိုးသက်ရောက်မှုသည် နှစ်ခု၏ ပေါင်းလဒ် ဖြစ်သည်။",
          },
          minutes: 10,
          sourceIds: ["s6", "s5"],
          prompt: {
            en: "A hidden unit feeds two outputs. How is its gradient formed?",
            mm: "Hidden unit တစ်ခု အထွက် နှစ်ခုကို ပေးနေလျှင် သူ့ gradient ဘယ်လို ဖြစ်လာလဲ?",
          },
          expects: { en: "Sum the contributions from both output paths.", mm: "အထွက် လမ်းကြောင်း နှစ်ခု၏ ပါဝင်မှုကို ပေါင်းရမည်။" },
          gap: { en: "You picked one path and stopped.", mm: "လမ်းကြောင်းတစ်ခုသာ ရွေးပြီး ရပ်လိုက်ပါသည်။" },
          gapFix: { en: "Add both routes, then compare", mm: "လမ်းကြောင်း နှစ်ခု ပေါင်းပြီး နှိုင်းယှဉ်ပါ" },
        },
      ],
    },
    {
      id: "c-credit",
      title: { en: "Credit assignment", mm: "ပါဝင်မှု ခွဲခြားခြင်း" },
      question: { en: "Which weight caused the error?", mm: "ဘယ် weight က အမှားကို ဖြစ်စေလဲ?" },
      summary: {
        en: "Backprop answers 'how much is this weight to blame?' — that number is the update.",
        mm: "Backprop က 'ဒီ weight ဘယ်လောက် တာဝန်ရှိလဲ' ကို ဖြေပေးသည်။ ထိုကိန်းသည် update ဖြစ်သည်။",
      },
      minutes: 14,
      sourceIds: ["s5", "s1"],
      prompt: {
        en: "Two weights get different updates from the same error. Why?",
        mm: "အမှားတူတူမှ weight နှစ်ခု update မတူတာ ဘာလို့လဲ?",
      },
      expects: { en: "Their sensitivity to the loss differs along their own paths.", mm: "သူတို့၏ လမ်းကြောင်းအလိုက် loss အပေါ် အထိခိုက်လွယ်မှု မတူသဖြင့်။" },
      gap: { en: "You treated the error as if it were shared equally.", mm: "အမှားကို အညီအမျှ မျှဝေထားသလို ယူဆထားပါသည်။" },
      gapFix: { en: "Compare two weights on one example", mm: "ဥပမာတစ်ခုတွင် weight နှစ်ခု နှိုင်းယှဉ်ပါ" },
    },
  ],

};

export const topics: Topic[] = [
  {
    id: "t-assignment",
    title: { en: "Assignment 3 — backprop by hand", mm: "Assignment ၃ — backprop လက်နှင့်တွက်" },
    bucket: "urgent",
    why: {
      en: "Graded 20% and due in 2 days. It also forces the exact skill your midterm tests.",
      mm: "အမှတ် ၂၀% ဖြစ်၍ ၂ ရက်အတွင်း ပေးရမည်။ Midterm စစ်မည့် skill နှင့်လည် တူသည်။",
    },
    minutes: 45,
    dueIn: 2,
    concepts: [backprop],
  },
  {
    id: "t-neurons",
    title: { en: "Neurons & activation", mm: "Neuron နှင့် Activation" },
    bucket: "foundation",
    why: {
      en: "Three later topics depend on it, and your last quiz showed it isn't solid yet.",
      mm: "နောက်ပိုင်း အကြောင်းအရာ ၃ ခု ဒါကို မှီသည်။ ပြီးခဲ့သည့် quiz မှာ မခိုင်သေးဟု ပြသည်။",
    },
    minutes: 35,
    concepts: [
      {
        id: "c-neuron",
        title: { en: "What a neuron actually computes", mm: "Neuron တစ်ခု တွက်နေတာ ဘာလဲ" },
        question: { en: "Weights, bias, and one number out", mm: "Weight, bias နှင့် အထွက် ကိန်းတစ်ခု" },
        summary: {
          en: "A weighted sum plus a bias, squeezed through a non-linear function.",
          mm: "Weight ပေါင်းလဒ်နှင့် bias ကို non-linear function ဖြင့် ဖိထုတ်လိုက်ခြင်း။",
        },
        minutes: 15,
        sourceIds: ["s2", "s1"],
        prompt: {
          en: "Why isn't a neuron just a straight line function?",
          mm: "Neuron က မျဉ်းဖြောင့် function မဟုတ်တာ ဘာလို့လဲ?",
        },
        expects: { en: "Non-linearity lets stacked layers learn more than a single line.", mm: "Non-linearity ရှိမှ layer စုထားခြင်းက မျဉ်းဖြောင့်ထက် ပိုသင်ယူနိုင်သည်။" },
        gap: { en: "Non-linearity is mentioned but not justified.", mm: "Non-linearity ကို ဖော်ပြသော်လည် အကြောင်းရင်း မပါပါ။" },
        gapFix: { en: "Stack two linear layers and see", mm: "Linear layer နှစ်ခု စုပြီး ကြည့်ပါ" },
      },
      {
        id: "c-activation",
        title: { en: "Activation functions", mm: "Activation functions" },
        question: { en: "Why ReLU over sigmoid?", mm: "Sigmoid ထက် ReLU ဘာလို့ ရွေးလဲ?" },
        summary: {
          en: "Sigmoid saturates and kills gradients; ReLU keeps them flowing in deep stacks.",
          mm: "Sigmoid သည် ပြည့်သွား၍ gradient ပျောက်သည်။ ReLU သည် layer များစွာမှာ ဆက်စီးဆင်းပေးသည်။",
        },
        minutes: 20,
        sourceIds: ["s3", "s4"],
        prompt: {
          en: "What breaks in a deep network if every activation is a sigmoid?",
          mm: "Activation အားလုံး sigmoid ဆိုရင် deep network မှာ ဘာပျက်လဲ?",
        },
        expects: { en: "Vanishing gradients in early layers.", mm: "အစပိုင်း layer များတွင် gradient ပျောက်ကွယ်ခြင်း။" },
        gap: { en: "Saturation is named, its effect on early layers isn't.", mm: "ပြည့်သွားခြင်းကို ဖော်ပြသော်လည် အစပိုင်း layer အပေါ် အကျိုးသက်ရောက်မှု မပါပါ။" },
        gapFix: { en: "Vanishing gradient, one layer at a time", mm: "Gradient ပျောက်ကွယ်မှု — layer တစ်ခုချင်း" },
        children: [
          {
            id: "c-dead-relu",
            title: { en: "Dying ReLU", mm: "ReLU သေခြင်း" },
            question: { en: "When does ReLU stop learning?", mm: "ReLU က ဘယ်အခါ သင်ယူရပ် သွားလဲ?" },
            summary: {
              en: "A unit stuck on the negative side outputs zero forever, so no gradient reaches it.",
              mm: "အနုတ်ဘက်မှာ ကျန်နေသော unit သည် သုညသာ ထုတ်သဖြင့် gradient မရောက်တော့ပါ။",
            },
            minutes: 9,
            sourceIds: ["s3"],
            prompt: {
              en: "Why can a ReLU unit become permanently inactive?",
              mm: "ReLU unit တစ်ခု အမြဲတမ် မလုပ်ဆောင်တော့တာ ဘာလို့ ဖြစ်နိုင်လဲ?",
            },
            expects: { en: "Zero gradient in the negative region freezes its weights.", mm: "အနုတ်နယ်ပယ်တွင် gradient သုည ဖြစ်၍ weight များ ရပ်တန့်သည်။" },
            gap: { en: "You named the symptom, not the zero-gradient cause.", mm: "လက္ခဏာကိုသာ ဖော်ပြပြီး gradient သုည အကြောင်းရင်း မပါပါ။" },
            gapFix: { en: "Plot the ReLU slope on both sides", mm: "ReLU slope ကို နှစ်ဘက် ဆွဲကြည့်ပါ" },
          },
        ],

      },
    ],
  },
  {
    id: "t-loss",
    title: { en: "Loss functions & gradient descent", mm: "Loss function နှင့် Gradient descent" },
    bucket: "priority",
    why: {
      en: "Half the midterm's short answers live here, and it builds directly on the foundation topic.",
      mm: "Midterm အဖြေတိုများ တစ်ဝက် ဒီမှာ ရှိသည်။ အခြေခံ အကြောင်းအရာအပေါ် တိုက်ရိုက် တည်သည်။",
    },
    minutes: 40,
    concepts: [
      {
        id: "c-loss",
        title: { en: "Why loss functions exist", mm: "Loss function ဘာလို့ ရှိရလဲ" },
        question: { en: "Turning 'wrong' into a number", mm: "'မှားတယ်' ကို ကိန်းဂဏန်း ဖြစ်လာစေခြင်း" },
        summary: {
          en: "Learning needs a single number to reduce; the loss is that number.",
          mm: "သင်ယူမှုက လျှော့ချရမည့် ကိန်းတစ်ခု လိုသည်။ Loss သည် ထိုကိန်းဖြစ်သည်။",
        },
        minutes: 18,
        sourceIds: ["s7", "s1"],
        prompt: {
          en: "Why can't we train a network by looking at accuracy alone?",
          mm: "Accuracy တစ်မျိုးတည်း ကြည့်ပြီး network ကို ဘာလို့ သင်ကြားလို့ မရလဲ?",
        },
        expects: { en: "Accuracy is a step function — no usable gradient.", mm: "Accuracy သည် step function ဖြစ်၍ gradient မရပါ။" },
        gap: { en: "Missing why accuracy gives no gradient.", mm: "Accuracy က gradient မပေးတာ ဘာလို့လဲ မပါပါ။" },
        gapFix: { en: "Smooth vs step objectives", mm: "Smooth နှင့် step ရည်မှန်းချက် နှိုင်းယှဉ်" },
      },
    ],
  },
  {
    id: "t-cnn",
    title: { en: "Convolutional networks", mm: "Convolutional networks" },
    bucket: "later",
    why: {
      en: "Only the last exam question touches it, and it needs the foundation topic first.",
      mm: "စာမေးပွဲ နောက်ဆုံးမေးခွန်းသာ ထိသည်။ အခြေခံ အရင်လိုသည်။",
    },
    minutes: 50,
    concepts: [
      {
        id: "c-conv",
        title: { en: "Filters as shared weights", mm: "Filter များ = မျှဝေထားသော weight" },
        question: { en: "Why reuse the same weights across an image?", mm: "ပုံတစ်ပုံလုံးမှာ weight တူတူ ဘာလို့ ပြန်သုံးလဲ?" },
        summary: {
          en: "A pattern is a pattern anywhere in the image, so the same filter slides across it.",
          mm: "ပုံစံတစ်ခုသည် ပုံ၏ မည်သည့်နေရာမှာမဆို ပုံစံတူဖြစ်သဖြင့် filter တူတူ ရွေ့သုံးသည်။",
        },
        minutes: 22,
        sourceIds: ["s1"],
        prompt: { en: "What does weight sharing buy you?", mm: "Weight မျှဝေခြင်းက ဘာအကျိုးရလဲ?" },
        expects: { en: "Fewer parameters, translation invariance.", mm: "Parameter နည်းခြင်း၊ နေရာမရွေး ဖမ်းနိုင်ခြင်း။" },
        gap: { en: "Parameter count covered, invariance missing.", mm: "Parameter အရေအတွက် ပါသော်လည် invariance မပါပါ။" },
        gapFix: { en: "Translation invariance in one example", mm: "ဥပမာတစ်ခုနှင့် translation invariance" },
      },
    ],
  },
  {
    id: "t-transformers",
    title: { en: "Transformers & attention", mm: "Transformers နှင့် attention" },
    bucket: "filtered",
    why: {
      en: "Outside the midterm syllabus. Kept, not deleted — you can revisit after the exam.",
      mm: "Midterm သင်ရိုးအတွင်း မပါပါ။ ဖျက်မထားပါ — စာမေးပွဲပြီးမှ ပြန်ကြည့်လို့ရသည်။",
    },
    minutes: 60,
    concepts: [],
  },
];

export const bucketOrder: Bucket[] = ["urgent", "priority", "foundation", "later"];

export function findTopic(id: string) {
  return topics.find((t) => t.id === id);
}

export function flatConcepts(topic: Topic): Concept[] {
  const out: Concept[] = [];
  const walk = (cs: Concept[]) => cs.forEach((c) => { out.push(c); if (c.children) walk(c.children); });
  walk(topic.concepts);
  return out;
}
