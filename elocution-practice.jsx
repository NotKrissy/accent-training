import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, BookOpen, BarChart3, GraduationCap, ChevronRight, ChevronDown, Check, Clock, RotateCcw, Filter, X, Play, Pause, ArrowLeft, Flame, Target, Volume2 } from "lucide-react";

// ─── COLOUR & DESIGN TOKENS ───
const T = {
  bg: "#FAF8F4", card: "#FFFFFF", primary: "#4A6741", primaryLight: "#E8EDE6",
  accent: "#C67B5C", accentLight: "#F5E6DE", text: "#2D2926", muted: "#8A8580",
  border: "#E8E4DF", success: "#4A6741", successLight: "#E8EDE6",
  warn: "#D4A03C", warnLight: "#FDF5E6",
};

// ─── WARM-UP STEPS ───
const WARMUP = [
  { id: "w1", title: "Masseter massage", desc: "Clench jaw briefly to locate muscle. Massage both sides.", duration: 30, type: "timer" },
  { id: "w2", title: "Tongue route massage", desc: "Push tongue tip against roof of mouth. Massage the muscle beneath in circular motions.", duration: 30, type: "timer" },
  { id: "w3", title: "Tongue directional stretches", desc: "Tongue out, up, down, left, right, in. Be specific – it should feel tense.", reps: 5, type: "reps" },
  { id: "w4", title: "Tongue out and in", desc: "Extend and retract. Only as far as comfortable.", reps: 5, type: "reps" },
  { id: "w5", title: "Lip stretch and squeeze", desc: "Stretch lip muscles wide, then squeeze together.", reps: 5, type: "reps" },
  { id: "w6", title: "Consonant clusters", desc: "PTK, BDG, MNL – five times each, three rounds through.", reps: 3, type: "reps", detail: "Round: PTK ×5 → BDG ×5 → MNL ×5" },
];

// ─── WEEKLY SCHEDULE ───
const SCHEDULE = [
  { label: "Rest Day", area: null, icon: "☀️" },
  { label: "Crunching", area: "crunching", icon: "🔗" },
  { label: "Vowels", area: "vowels", icon: "🔊" },
  { label: "Dark L & Finals", area: "darkl", icon: "🎯" },
  { label: "Crunching", area: "crunching", icon: "🔗" },
  { label: "Inflection", area: "inflection", icon: "🎵" },
  { label: "Mixed Review", area: "mixed", icon: "🔄" },
];

// ─── EXERCISES ───
// content uses **word** for target-sound bolding
const EXERCISES = [
  // ── CRUNCHING ──
  { id: "cr-du", title: "DU- Cluster Drill", area: "crunching", tag: "DU-", type: "wordlist",
    instruction: "Read each word 5 times slowly. Keep the D and \"yoo\" (/juː/) sounds clearly separate. Aim for \"d-yoo-ti\", not \"jooty\".",
    content: ["duty", "dune", "duke", "dutiful", "dupe", "due", "dew", "duplicate", "endure", "produce", "overdue", "duration", "during"] },
  { id: "cr-tu", title: "TU- Cluster Drill", area: "crunching", tag: "TU-", type: "wordlist",
    instruction: "Read each word 5 times slowly. Keep the T and \"yoo\" (/juː/) sounds separate. Aim for \"t-yoo-na\", not \"choona\".",
    content: ["tuna", "tube", "tune", "tuba", "tulip", "tutor", "tutorial", "Tuesday", "Tudor", "gratitude", "attitude", "opportunity", "stature"] },
  { id: "cr-stu", title: "STU- Cluster Drill", area: "crunching", tag: "STU-", type: "wordlist",
    instruction: "Read each word 5 times slowly. Three sounds layered: S, then T, then \"yoo\" (/juː/). Take your time with each.",
    content: ["student", "studio", "study", "stupid", "stupendous", "stew", "stewed", "strenuous"] },
  { id: "cr-dr-tr", title: "DR- & TR- Cluster Drill", area: "crunching", tag: "DR- / TR-", type: "wordlist",
    instruction: "Read each word 5 times. Keep D or T separate from R – resist merging them into one sound.",
    content: ["drain", "drive", "draw", "drew", "drop", "drink", "drizzle", "dramatic", "drift", "—", "train", "tree", "trip", "trail", "three", "trouble", "trust", "trained", "traditional"],
    note: "Divider (—) separates DR- from TR- words." },
  { id: "cr-str", title: "STR- Cluster Drill", area: "crunching", tag: "STR-", type: "wordlist",
    instruction: "Read each word 5 times. Articulate S, T, and R individually before letting them flow together.",
    content: ["street", "straight", "strange", "stream", "stretch", "strike", "strong", "structure", "strategy", "stroll", "streak"] },
  { id: "cr-mix", title: "Mixed Crunching Passage", area: "crunching", tag: "All clusters", type: "passage",
    instruction: "Read at a steady, measured pace. Focus on separating every consonant cluster clearly.",
    content: "The **student** had a **duty** to **produce** a **tutorial** on **strategy** for her **tutor**. She **drew** up a **structure** for the **studio** session. The **train** was **due** at noon, so she had to **drive** **straight** to the **street** where the **tube** station stood. She **strolled** along, humming a **tune**, appreciating the **opportunity**.",
    table: { "DU-": ["duty", "produce", "due"], "TU-": ["tutorial", "tutor", "tube", "tune", "opportunity"], "STU-": ["student", "studio"], "DR-": ["drew", "drive"], "TR-": ["train"], "STR-": ["strategy", "structure", "straight", "street", "strolled"] } },

  // ── VOWELS ──
  { id: "vw-foot-goose", title: "FOOT & GOOSE – Lip Rounding", area: "vowels", tag: "ʊ / uː", type: "wordlist",
    instruction: "Read each word 5 times. Focus on strong, deliberate lip rounding. Push lips forward into a firm circle.",
    content: ["foot", "good", "book", "look", "put", "could", "would", "should", "wood", "hook", "—", "goose", "food", "mood", "moon", "room", "school", "cool", "pool", "two", "blue"],
    note: "FOOT words (short ʊ) above the divider. GOOSE words (long uː) below." },
  { id: "vw-palm", title: "PALM, BATH, START – Jaw Drop", area: "vowels", tag: "ɑː", type: "wordlist",
    instruction: "Read each word 5 times. Drop the jaw fully and open up the back of the mouth. This vowel needs space.",
    content: ["palm", "bath", "start", "path", "past", "ask", "class", "glass", "grass", "laugh", "half", "father", "car", "far", "heart", "park", "dark", "art", "draft", "craft"] },
  { id: "vw-thought", title: "THOUGHT & FORCE – Back Space", area: "vowels", tag: "ɔː", type: "wordlist",
    instruction: "Read each word 5 times. Find space at the back of the mouth with a good jaw drop. Lips slightly rounded.",
    content: ["thought", "force", "caught", "bought", "taught", "walk", "talk", "wall", "all", "call", "fall", "ball", "law", "saw", "door", "floor", "more", "four", "north", "sort"] },
  { id: "vw-trap", title: "TRAP – Widening Drill", area: "vowels", tag: "æ", type: "wordlist",
    instruction: "Read each word 5 times. This vowel widens horizontally – spread, don't drop. Think of a slight smile shape.",
    content: ["trap", "cat", "hat", "map", "back", "hand", "man", "plan", "black", "flat", "sand", "land", "stand", "band", "track", "can", "ran"] },
  { id: "vw-sent", title: "Mixed Vowel Sentences", area: "vowels", tag: "Mixed", type: "sentences",
    instruction: "Read each sentence 3 times at a measured pace. Target vowels are bolded.",
    content: [
      "She **stood** in the **cool** **pool** and **looked** at the **moon**.",
      "My **father** parked the **car** by the **path** through the **grass**.",
      "I **thought** I **saw** him **walk** through the **door** on the **fourth** **floor**.",
      "The **cat** **sat** on the **mat** with a **black** **hat** in his **hand**.",
      "She **put** a **good** **book** on the **tall** **wall** and took a long **bath**."
    ] },
  { id: "vw-pass", title: "Vowel Focus Passage", area: "vowels", tag: "Mixed", type: "passage",
    instruction: "Read once through at a steady pace. Focus on giving each bolded vowel its full shape – lip rounding, jaw drop, or widening as needed.",
    content: "The **school** **stood** at the end of a long **path**, past the **dark** **park** and the old stone **wall**. Every **morning**, the children would **walk** through the **tall** iron gates and across the **flat** playing field. In the main **hall**, the **floor** shone, and you **could** hear the **sound** of **footsteps** on the polished **wood**. The head teacher **asked** the **class** to sit **still**, then read from a **book** about a man who sailed **far** across the **north** sea. It was a **good** story, **full** of heart." },

  // ── DARK L & FINAL CONSONANTS ──
  { id: "dl-words", title: "Dark L Word List", area: "darkl", tag: "Dark L", type: "wordlist",
    instruction: "Read each word 5 times. Sustain firm tip-of-tongue pressure on the L at the end. Don't let it vanish.",
    content: ["little", "bottle", "people", "table", "middle", "travel", "canal", "beautiful", "capital", "hospital", "careful", "special", "local", "all", "well", "still", "tell", "will", "call", "full"] },
  { id: "dl-sent", title: "Dark L in Sentences", area: "darkl", tag: "Dark L", type: "sentences",
    instruction: "Read each sentence 3 times. Hold every bolded dark L firmly – especially in connected speech.",
    content: [
      "The **little** **bottle** on the **table** was **still** nearly **full**.",
      "The **hospital** is in the **middle** of the **capital** city.",
      "He was **careful** to **tell** the **people** about the **special** **local** event.",
      "She could **still** see the **beautiful** **canal** from the **travel** office.",
      "**All** in **all**, it went quite **well**."
    ] },
  { id: "fc-words", title: "Final Consonant Drill", area: "darkl", tag: "Finals", type: "wordlist",
    instruction: "Read each word 5 times. Land firmly on the final sound – give it energy right to the end.",
    content: ["strict", "draft", "helped", "fact", "reflect", "expect", "accept", "craft", "project", "effect", "direct", "impact", "protect", "asked", "looked", "talked", "walked", "worked", "risked", "against"] },
  { id: "fc-sent", title: "Final Consonants in Sentences", area: "darkl", tag: "Finals", type: "sentences",
    instruction: "Read each sentence 3 times at a measured pace. Every word ending must land clearly.",
    content: [
      "She **asked** him to **reflect** on the **impact** of the **project**.",
      "He **walked** **straight** past and **looked** at the **draft**.",
      "They **worked** hard and **helped** **protect** the final **product**.",
      "The **strict** rules had a **direct** **effect** on the **craft**.",
      "She **risked** it **all** and **talked** her way **against** the current."
    ] },
  { id: "dl-fc-pass", title: "Dark L & Finals Passage", area: "darkl", tag: "Mixed", type: "passage",
    instruction: "Read once through at a steady, measured pace. Focus on sustaining dark Ls and landing final consonants firmly.",
    content: "The **little** **hospital** on the **hill** had a **special** reputation across the **capital**. **People** would **travel** from **all** over to visit. The **staff** **worked** hard and **helped** every patient with **careful** attention. The head doctor **looked** at the **draft** report and **asked** her team to **reflect** on the **impact** of the new **project**. The results were **still** being **collected**, but the early **effect** was **beautiful** to see. It was a **fact** that the **local** community **felt** the benefit." },

  // ── BOUNCING G ──
  { id: "bg-words", title: "Clean -ing Word List", area: "bouncing-g", tag: "-ing", type: "wordlist",
    instruction: "Read each word 5 times. Hold the back of your tongue against the roof of your mouth on the final /ŋ/ – do NOT release into a /ɡ/ bounce.",
    content: ["singing", "walking", "running", "talking", "thinking", "working", "going", "morning", "evening", "nothing", "something", "anything", "bringing", "feeling", "beginning"] },
  { id: "bg-sent", title: "-ing in Sentences", area: "bouncing-g", tag: "-ing", type: "sentences",
    instruction: "Read each sentence 3 times. Every -ing ending should be a clean, held /ŋ/ with no bounce.",
    content: [
      "She was **singing** while **walking** through the park this **morning**.",
      "He kept **thinking** about **nothing** in particular all **evening**.",
      "They were **working** hard and **feeling** good about **something**.",
      "I was **running** late and **going** as fast as I could.",
      "**Anything** worth **bringing** is worth **talking** about."
    ] },
  { id: "bg-pass", title: "-ing Connected Speech", area: "bouncing-g", tag: "-ing", type: "passage",
    instruction: "Read once through at a measured pace. In flowing speech, the bounce tends to creep back in – stay vigilant on every -ing ending.",
    content: "On a bright **morning**, she found herself **walking** along the river, **thinking** about **nothing** and **everything** at once. Birds were **singing** overhead. She was **feeling** calm for the first time in weeks. **Something** about the light kept **changing**, and she enjoyed **watching** it shift. She considered **going** home but decided **running** a few more minutes would do her good. There was **nothing** **stopping** her." },
  { id: "bg-contrast", title: "-ng vs -nger Contrast", area: "bouncing-g", tag: "-ng / -nger", type: "sentences",
    instruction: "Read each pair. The first word in each pair has a CLEAN /ŋ/ (no G sound). The second has a hard /ɡ/ because it's a different word – not an -ing form. Notice the difference.",
    content: [
      "**singing** vs **finger** – one ends clean, one has a real /ɡ/.",
      "**ringing** vs **linger** – hold the /ŋ/ on ringing, release into /ɡ/ on linger.",
      "**hanging** vs **anger** – clean ending vs hard G.",
      "**longing** vs **longer** – the -ing holds; the -ger releases.",
      "**bringing** vs **hunger** – same contrast. Train the ear to hear it."
    ] },

  // ── INFLECTION ──
  { id: "in-down", title: "Statements – Downward ↓", area: "inflection", tag: "Declarative", type: "sentences",
    instruction: "Read each sentence 3 times. Let your pitch DROP at the end – convey certainty and finality. These are facts, not questions.",
    content: [
      "The report is finished.",
      "We have made our decision.",
      "The meeting starts at nine.",
      "I will lead the European region.",
      "The strategy has been approved.",
      "This is the final version."
    ] },
  { id: "in-up", title: "Questions – Upward ↑", area: "inflection", tag: "Questions", type: "sentences",
    instruction: "Read each sentence 3 times. Let your pitch RISE naturally at the end – genuine curiosity.",
    content: [
      "Have you reviewed the proposal?",
      "Is the data ready for the client?",
      "Could we push the deadline back?",
      "Would that work for the whole team?",
      "Are you coming to the session?"
    ] },
  { id: "in-pair", title: "Statement vs Question Pairs", area: "inflection", tag: "Contrast", type: "sentences",
    instruction: "Read each pair. First as a firm statement (pitch down ↓), then as a genuine question (pitch up ↑). Feel the difference in your voice.",
    content: [
      "The project is on track. ↓  —  The project is on track? ↑",
      "She accepted the offer. ↓  —  She accepted the offer? ↑",
      "We're launching in April. ↓  —  We're launching in April? ↑",
      "The budget covers it. ↓  —  The budget covers it? ↑",
      "He agreed to the terms. ↓  —  He agreed to the terms? ↑"
    ] },
  { id: "in-emphasis", title: "Emphasis Variation", area: "inflection", tag: "Flavouring", type: "sentences",
    instruction: "Read each sentence 4 times, stressing a DIFFERENT word each time. Notice how the meaning shifts.",
    content: [
      "I didn't say she took the file.",
      "We need this finished by Friday.",
      "The client wants a different approach.",
      "He told me the results were strong."
    ],
    note: "Example: \"I didn't say SHE took the file\" vs \"I didn't SAY she took the file\" – different stress, different implication." },
  { id: "in-pass", title: "Inflection Practice Passage", area: "inflection", tag: "Mixed", type: "passage",
    instruction: "Read once through. Statements should land with downward inflection. The two questions should rise. Vary your tone to match the intention of each sentence.",
    content: "The team gathered in the boardroom at nine. The quarterly figures were stronger than expected. Revenue had climbed steadily since January. The head of sales presented the regional breakdown with confidence. Europe had outperformed North America for the second consecutive quarter. \"Does anyone have questions about the methodology?\" she asked. The room stayed quiet for a moment. Then the finance director spoke. \"The margins look solid, but can we sustain this into the second half?\" It was a fair challenge. She nodded and walked the room through the forecast." },

  // ── SPEED & BREATH ──
  { id: "sb-1", title: "Paced Reading – The Garden", area: "speed", tag: "Breath", type: "passage",
    instruction: "Read at a deliberately slower pace than feels natural. Breathe at every full stop and comma. Sustain energy through to the end of each sentence.",
    content: "The garden had been neglected for years. Weeds covered the paths, and the old wooden bench had started to rot. But in the far corner, beneath a tangle of ivy, a single rose bush had survived. Its flowers were small but vivid – a deep, stubborn red that refused to fade. She knelt beside it and cleared the ground around its roots. The soil was dry. She fetched water from the kitchen and poured it slowly, watching it soak into the earth." },
  { id: "sb-2", title: "Paced Reading – The Station", area: "speed", tag: "Breath", type: "passage",
    instruction: "Read at a measured pace. Let each sentence breathe. Don't rush through to the next one – pause at every full stop.",
    content: "The station was quiet at this hour. A single train stood at the platform, its engine humming softly. The departure board showed two destinations. She checked her ticket and walked towards the front carriage. The doors opened with a gentle hiss. Inside, the seats were mostly empty. She chose a window seat facing forward and placed her bag on the rack above. The train pulled away without announcement. Fields appeared on both sides, stretching out under a pale grey sky." },
  { id: "sb-3", title: "Paced Reading – The Presentation", area: "speed", tag: "Breath + Finals", type: "passage",
    instruction: "This passage mirrors a work context. Read as if presenting to a room. Measured pace, clear final consonants, breath at natural pause points.",
    content: "Good morning. Thank you for joining at short notice. I want to walk you through the regional performance data for the first quarter. The European market has shown consistent growth across all segments. Client retention improved by twelve per cent, driven largely by the revised onboarding process we introduced in January. The feedback from the sales team has been positive, though there are two areas I want to flag. First, the pipeline in the Nordic region is thinner than expected. Second, we are still waiting on regulatory approval in two markets. I will cover both in more detail on the next slide." },
  { id: "sb-4", title: "Paced Reading – The Coast", area: "speed", tag: "Breath", type: "passage",
    instruction: "Read slowly and steadily. Focus on deep diaphragmatic breathing between sentences. No gasping.",
    content: "The coastal path curved along the cliff edge, high above the water. Below, the sea was calm and dark, broken only by the occasional white crest of a wave. Seabirds circled overhead, riding the wind without effort. She walked at an even pace, breathing in the salt air. The lighthouse stood at the far point, its white tower bright against the grey rock. She had walked this route many times before, but the view still held her attention. There was something settling about the rhythm of the sea." },
  { id: "sb-5", title: "Paced Reading – The Brief", area: "speed", tag: "Breath + All targets", type: "passage",
    instruction: "This passage is designed to test multiple target areas at once. Read at a measured, professional pace. Land every final consonant. Hold every dark L. Keep -ing endings clean.",
    content: "The **student** completed her **tutorial** and **walked** to the **little** office at the end of the **hall**. She was **feeling** confident about the **draft** she had **produced**. The **structure** was **still** being refined, but the core **strategy** was **strong**. Her **tutor** had **asked** her to **reflect** on the **impact** of each section. She sat at the **table**, opened her notes, and began **working** through the feedback **carefully**. **Nothing** needed **drastic** change. The **opportunity** to present it to the **full** board was only a week away, and she intended to be ready." },
];

// ── CURRICULUM ──
const CURRICULUM = [
  { id: "s1", title: "Articulation & Pronunciation", icon: "🗣️", lessons: [
    "Benefits of Good Articulation", "Daily Articulation Regime", "Daily Articulation Regime (PDF)",
    "Articulation Regime Extension", "Using Your Articulation Day-to-Day",
    "Crunching (Part 1)", "Crunching (Part 2)", "Crunching (Part 3)", "Pillow Patting"
  ]},
  { id: "s2", title: "Long Vowels", icon: "✏️", lessons: [
    "What are major vowels?", "uː – Technique, Words, Sentences, Worksheet",
    "ɑː – Technique, Words, Sentences, Worksheet", "ɔː – Technique, Words, Sentences, Worksheet",
    "iː – Technique, Words, Sentences, Worksheet", "ɜː – Technique, Words, Sentences, Worksheet"
  ]},
  { id: "s3", title: "Short Vowels", icon: "🏺", lessons: [
    "ə – Technique, Words, Sentences, Worksheet", "æ – Technique, Words, Sentences, Worksheet",
    "ɪ – Technique, Words, Sentences, Worksheet", "ʌ – Technique, Words, Sentences, Worksheet",
    "ʊ – Technique, Words, Sentences, Worksheet", "e – Technique, Words, Sentences, Worksheet",
    "ɒ – Technique, Words, Sentences, Worksheet"
  ]},
  { id: "s4", title: "Diphthongs", icon: "🎭", lessons: [
    "What is a diphthong?", "əʊ – Technique, Words, Sentences, Worksheet",
    "ɪə – Technique, Words, Sentences, Worksheet", "eə – Technique, Words, Sentences, Worksheet",
    "aʊ – Technique, Words, Sentences, Worksheet", "ʊə – Technique, Words, Sentences, Worksheet",
    "eɪ – Technique, Words, Sentences, Worksheet", "aɪ – Technique, Words, Sentences, Worksheet",
    "ɔɪ – Technique, Words, Sentences, Worksheet"
  ]},
  { id: "s5", title: "Plosive Consonants", icon: "💥", lessons: [
    "p (Technique)", "b (Technique)", "t (Technique)", "d (Technique)", "k (Technique)", "g (Technique)"
  ], comingSoon: true },
  { id: "s6", title: "Fricative Consonants", icon: "🎶", lessons: [
    "TH – Technique, Words, Sentences, Worksheet", "v – Technique, Words, Sentences, Worksheet"
  ]},
  { id: "s7", title: "Affricative & Nasal Consonants", icon: "🤚", lessons: [
    "ŋ – Technique, Words, Sentences, Worksheet"
  ]},
  { id: "s8", title: "Lateral & Approximant Consonants", icon: "🎧", lessons: [
    "The R Sound", "The Rules of r", "r – Technique, Words, Sentences, Worksheet",
    "w – Technique, Words, Sentences, Worksheet", "L – Technique, Words, Sentences, Worksheet",
    "j (Technique) – COMING SOON"
  ]},
  { id: "s9", title: "Intonation & Implementation", icon: "🎵", lessons: [
    "Intonation", "Intonation (Exercise 1)", "Intonation (Exercise 2)", "Intonation (Exercise 3)",
    "Intonation (Exercise 4)", "Intonation Practice Text (No Prompts)", "Intonation Practice Text (With Prompts)",
    "Implementation", "Implementation (Exercise 1)", "Implementation (Exercise 2)", "Implementation (Exercise 3)",
    "Implementation (Exercise 4)", "Implementation (Exercise 5)", "Implementation Text (PDF)",
    "Implementation Text (Audio)", "Prosody"
  ]},
  { id: "s10", title: "Next Steps & Reflection", icon: "🎯", lessons: [
    "Certificate", "Congratulations!", "What's Next?"
  ]},
  { id: "s11", title: "Additional Resources", icon: "🧰", lessons: [
    "Toolkit Builder", "Quick Fix Guide"
  ]},
];

const AREA_META = {
  crunching: { label: "Crunching", color: T.accent, bg: T.accentLight },
  vowels: { label: "Vowels", color: "#6B5CA5", bg: "#EEEAF5" },
  darkl: { label: "Dark L & Finals", color: "#3B7A9E", bg: "#E3F0F6" },
  "bouncing-g": { label: "Bouncing G", color: "#9B6B3D", bg: "#F5EDE3" },
  inflection: { label: "Inflection", color: "#7A5CA5", bg: "#F0EAF5" },
  speed: { label: "Speed & Breath", color: T.primary, bg: T.primaryLight },
};

// ─── STORAGE HELPERS ───
const STORE_KEY = "elocution-app-v1";

const defaultState = () => ({
  sessions: {},
  exercisesDone: {},
  curriculum: [],
  streakCurrent: 0,
  streakBest: 0,
  lastDate: null,
});

async function loadStore() {
  try {
    const r = await window.storage.get(STORE_KEY);
    return r ? JSON.parse(r.value) : defaultState();
  } catch { return defaultState(); }
}

async function saveStore(data) {
  try { await window.storage.set(STORE_KEY, JSON.stringify(data)); } catch (e) { console.error("Save failed", e); }
}

// ─── DATE HELPERS ───
const todayStr = () => new Date().toISOString().split("T")[0];
const dayOfWeek = () => new Date().getDay();
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const formatDate = (d) => {
  const date = new Date(d + "T12:00:00");
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
};
const last7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

// ─── TEXT RENDERING (bold targets) ───
function RichText({ text, style }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={style}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i} style={{ color: T.accent, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

// ─── TIMER COMPONENT ───
function Timer({ duration }) {
  const [secs, setSecs] = useState(duration);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setTimeout(() => setSecs(s => s - 1), 1000);
    } else if (secs === 0) setRunning(false);
    return () => clearTimeout(ref.current);
  }, [running, secs]);

  const reset = () => { setRunning(false); setSecs(duration); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
      <button onClick={() => setRunning(!running)} style={{
        ...btn, background: running ? T.muted : T.primary, color: "#fff", padding: "6px 14px", borderRadius: 20,
        display: "flex", alignItems: "center", gap: 6, fontSize: 13
      }}>
        {running ? <Pause size={14} /> : <Play size={14} />}
        {running ? "Pause" : secs < duration ? "Resume" : "Start"}
      </button>
      <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 18, fontWeight: 600, color: secs === 0 ? T.success : T.text, minWidth: 36 }}>
        {secs}s
      </span>
      {secs < duration && (
        <button onClick={reset} style={{ ...btn, background: "none", padding: 4 }}>
          <RotateCcw size={16} color={T.muted} />
        </button>
      )}
      {secs === 0 && <Check size={18} color={T.success} />}
    </div>
  );
}

const btn = { border: "none", cursor: "pointer", fontFamily: "inherit" };

// ─── CARD COMPONENT ───
function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      border: `1px solid ${T.border}`, ...style
    }}>
      {children}
    </div>
  );
}

// ─── PILL / TAG ───
function Pill({ label, color, bg, small }) {
  return (
    <span style={{
      display: "inline-block", padding: small ? "2px 8px" : "3px 10px", borderRadius: 20,
      fontSize: small ? 11 : 12, fontWeight: 600, color: color || T.primary, background: bg || T.primaryLight,
      letterSpacing: 0.2, whiteSpace: "nowrap"
    }}>{label}</span>
  );
}

// ═══════════════════════════════════════
// ─── TODAY TAB ───
// ═══════════════════════════════════════
function TodayTab({ store, setStore }) {
  const today = todayStr();
  const dow = dayOfWeek();
  const sched = SCHEDULE[dow];
  const session = store.sessions[today] || { warmup: false, drill: false, passage: false };

  const todayExercises = sched.area
    ? sched.area === "mixed"
      ? EXERCISES.filter(e => e.type === "passage").slice(0, 3)
      : EXERCISES.filter(e => e.area === sched.area)
    : [];

  const passageExercises = EXERCISES.filter(e => e.area === "speed");
  // Pick a passage based on day of month
  const passageIdx = new Date().getDate() % passageExercises.length;
  const todayPassage = passageExercises[passageIdx];

  const [phase, setPhase] = useState(null); // 'warmup', 'drill', 'passage', or null
  const [selectedDrill, setSelectedDrill] = useState(null);

  const markPhase = async (p) => {
    const updated = { ...store, sessions: { ...store.sessions, [today]: { ...session, [p]: true } } };
    // Update streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    const allDone = updated.sessions[today]?.warmup && updated.sessions[today]?.drill && updated.sessions[today]?.passage;
    if (allDone) {
      if (updated.lastDate === yStr || updated.lastDate === today) {
        if (updated.lastDate !== today) updated.streakCurrent += 1;
      } else if (!updated.lastDate) {
        updated.streakCurrent = 1;
      } else {
        updated.streakCurrent = 1;
      }
      updated.streakBest = Math.max(updated.streakBest, updated.streakCurrent);
      updated.lastDate = today;
    }
    setStore(updated);
    await saveStore(updated);
  };

  const isComplete = session.warmup && session.drill && session.passage;

  if (phase === "warmup") return <WarmupView onBack={() => setPhase(null)} onDone={() => { markPhase("warmup"); setPhase(null); }} />;
  if (phase === "drill" && selectedDrill) return <ExerciseDetail ex={selectedDrill} onBack={() => { setPhase(null); setSelectedDrill(null); }} onDone={() => { markPhase("drill"); setPhase(null); setSelectedDrill(null); }} />;
  if (phase === "passage" && todayPassage) return <ExerciseDetail ex={todayPassage} onBack={() => setPhase(null)} onDone={() => { markPhase("passage"); setPhase(null); }} />;

  return (
    <div style={{ padding: "0 20px 120px" }}>
      {/* Header */}
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 4 }}>{formatDate(today)}</p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.2 }}>
          {sched.area ? `${sched.icon} ${sched.label}` : "☀️ Rest Day"}
        </h1>
        {isComplete && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, color: T.success }}>
            <Check size={18} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Session complete</span>
          </div>
        )}
      </div>

      {sched.area === null ? (
        <Card>
          <p style={{ color: T.muted, lineHeight: 1.6, margin: 0 }}>
            Rest day. No structured session – but if you want to practise, head to the Exercises tab and pick anything that interests you.
          </p>
        </Card>
      ) : (
        <>
          {/* Phase 1: Warm-up */}
          <SessionPhaseCard
            number="1" title="Warm-Up" subtitle="Articulation regime" duration="5 min"
            done={session.warmup} onStart={() => setPhase("warmup")}
          />

          {/* Phase 2: Focused Drill */}
          <div style={{ marginTop: 12 }}>
            <SessionPhaseCard
              number="2" title="Focused Drill" subtitle={sched.label} duration="5–7 min"
              done={session.drill}
              onStart={() => {
                if (todayExercises.length > 0) {
                  const idx = new Date().getDate() % todayExercises.length;
                  setSelectedDrill(todayExercises[idx]);
                  setPhase("drill");
                }
              }}
            />
            {!session.drill && todayExercises.length > 1 && (
              <div style={{ padding: "8px 0 0 52px" }}>
                <p style={{ fontSize: 12, color: T.muted, margin: "0 0 6px" }}>Or choose one:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {todayExercises.map(ex => (
                    <button key={ex.id} onClick={() => { setSelectedDrill(ex); setPhase("drill"); }}
                      style={{ ...btn, fontSize: 12, padding: "4px 10px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, color: T.text }}>
                      {ex.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phase 3: Passage */}
          <div style={{ marginTop: 12 }}>
            <SessionPhaseCard
              number="3" title="Reading Passage" subtitle="Speed & breath control" duration="5–8 min"
              done={session.passage} onStart={() => setPhase("passage")}
            />
          </div>
        </>
      )}

      {/* Streak */}
      <Card style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: store.streakCurrent > 0 ? T.accentLight : T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Flame size={24} color={store.streakCurrent > 0 ? T.accent : T.muted} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>{store.streakCurrent} day{store.streakCurrent !== 1 ? "s" : ""}</p>
          <p style={{ margin: 0, fontSize: 13, color: T.muted }}>Current streak{store.streakBest > 0 ? ` · Best: ${store.streakBest}` : ""}</p>
        </div>
      </Card>
    </div>
  );
}

function SessionPhaseCard({ number, title, subtitle, duration, done, onStart }) {
  return (
    <Card onClick={!done ? onStart : undefined} style={{
      display: "flex", alignItems: "center", gap: 14, cursor: done ? "default" : "pointer",
      opacity: done ? 0.7 : 1, border: done ? `1px solid ${T.success}` : `1px solid ${T.border}`
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: done ? T.success : T.primaryLight,
        color: done ? "#fff" : T.primary,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 700, flexShrink: 0
      }}>
        {done ? <Check size={18} /> : number}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>{title}</p>
        <p style={{ margin: 0, fontSize: 13, color: T.muted }}>{subtitle} · {duration}</p>
      </div>
      {!done && <ChevronRight size={20} color={T.muted} />}
    </Card>
  );
}

// ─── WARMUP VIEW ───
function WarmupView({ onBack, onDone }) {
  const [completed, setCompleted] = useState({});
  const allDone = WARMUP.every(s => completed[s.id]);

  return (
    <div style={{ padding: "0 20px 120px" }}>
      <button onClick={onBack} style={{ ...btn, display: "flex", alignItems: "center", gap: 6, color: T.primary, background: "none", padding: "16px 0", fontSize: 15, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Warm-Up</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 20px" }}>Daily articulation regime · 5 minutes</p>

      {WARMUP.map((step) => (
        <Card key={step.id} style={{ marginBottom: 10, border: completed[step.id] ? `1px solid ${T.success}` : `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <button onClick={() => setCompleted(c => ({ ...c, [step.id]: !c[step.id] }))}
              style={{ ...btn, width: 28, height: 28, borderRadius: "50%", border: `2px solid ${completed[step.id] ? T.success : T.border}`, background: completed[step.id] ? T.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {completed[step.id] && <Check size={14} color="#fff" />}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text }}>{step.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{step.desc}</p>
              {step.detail && <p style={{ margin: "4px 0 0", fontSize: 13, color: T.primary, fontWeight: 500 }}>{step.detail}</p>}
              {step.type === "timer" && !completed[step.id] && <Timer duration={step.duration} />}
              {step.type === "reps" && !completed[step.id] && (
                <p style={{ margin: "6px 0 0", fontSize: 13, color: T.accent, fontWeight: 600 }}>×{step.reps} {step.reps > 1 && step.id === "w6" ? "rounds" : "repetitions"}</p>
              )}
            </div>
          </div>
        </Card>
      ))}

      <button onClick={onDone} style={{
        ...btn, width: "100%", padding: "14px 0", borderRadius: 14, marginTop: 16,
        background: allDone ? T.primary : T.primaryLight, color: allDone ? "#fff" : T.primary,
        fontSize: 15, fontWeight: 600
      }}>
        {allDone ? "✓ Warm-Up Complete" : "Mark Warm-Up Complete"}
      </button>
    </div>
  );
}

// ─── EXERCISE DETAIL VIEW ───
function ExerciseDetail({ ex, onBack, onDone }) {
  const meta = AREA_META[ex.area] || { label: ex.area, color: T.primary, bg: T.primaryLight };

  return (
    <div style={{ padding: "0 20px 120px" }}>
      <button onClick={onBack} style={{ ...btn, display: "flex", alignItems: "center", gap: 6, color: T.primary, background: "none", padding: "16px 0", fontSize: 15, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back
      </button>

      <Pill label={meta.label} color={meta.color} bg={meta.bg} />
      {ex.tag && <Pill label={ex.tag} color={T.muted} bg={T.border} small style={{ marginLeft: 6 }} />}

      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 6px" }}>{ex.title}</h2>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>{ex.instruction}</p>

      <Card>
        {ex.type === "wordlist" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ex.content.map((w, i) =>
              w === "—"
                ? <div key={i} style={{ width: "100%", borderTop: `1px solid ${T.border}`, margin: "4px 0" }} />
                : <span key={i} style={{ fontSize: 18, fontWeight: 600, color: T.text, padding: "6px 12px", background: T.primaryLight, borderRadius: 10 }}>{w}</span>
            )}
          </div>
        )}
        {ex.type === "sentences" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ex.content.map((s, i) => (
              <div key={i} style={{ paddingBottom: i < ex.content.length - 1 ? 14 : 0, borderBottom: i < ex.content.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <RichText text={s} style={{ fontSize: 17, lineHeight: 1.7, color: T.text }} />
              </div>
            ))}
          </div>
        )}
        {ex.type === "passage" && (
          <div>
            <RichText text={ex.content} style={{ fontSize: 18, lineHeight: 1.85, color: T.text }} />
          </div>
        )}
      </Card>

      {ex.note && (
        <p style={{ fontSize: 13, color: T.muted, fontStyle: "italic", margin: "12px 0 0", lineHeight: 1.5 }}>{ex.note}</p>
      )}

      {ex.table && (
        <Card style={{ marginTop: 16 }}>
          <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: T.text }}>Reference Table</p>
          {Object.entries(ex.table).map(([cluster, words]) => (
            <div key={cluster} style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{cluster}: </span>
              <span style={{ fontSize: 13, color: T.muted }}>{words.join(", ")} ({words.length})</span>
            </div>
          ))}
        </Card>
      )}

      {onDone && (
        <button onClick={onDone} style={{
          ...btn, width: "100%", padding: "14px 0", borderRadius: 14, marginTop: 20,
          background: T.primary, color: "#fff", fontSize: 15, fontWeight: 600
        }}>
          ✓ Mark Complete
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// ─── EXERCISES TAB ───
// ═══════════════════════════════════════
function ExercisesTab({ store, setStore }) {
  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState(null);

  const areas = Object.entries(AREA_META);
  const filtered = filter ? EXERCISES.filter(e => e.area === filter) : EXERCISES;

  if (selected) {
    return (
      <ExerciseDetail
        ex={selected}
        onBack={() => setSelected(null)}
        onDone={async () => {
          const today = todayStr();
          const done = { ...store.exercisesDone };
          if (!done[selected.id]) done[selected.id] = [];
          if (!done[selected.id].includes(today)) done[selected.id].push(today);
          const updated = { ...store, exercisesDone: done };
          setStore(updated);
          await saveStore(updated);
          setSelected(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: "0 20px 120px" }}>
      <div style={{ paddingTop: 20, marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Exercises</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: "4px 0 0" }}>{EXERCISES.length} exercises across {areas.length} target areas</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => setFilter(null)} style={{
          ...btn, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
          background: !filter ? T.text : T.card, color: !filter ? "#fff" : T.text, border: `1px solid ${!filter ? T.text : T.border}`
        }}>All</button>
        {areas.map(([key, meta]) => (
          <button key={key} onClick={() => setFilter(filter === key ? null : key)} style={{
            ...btn, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            background: filter === key ? meta.color : T.card, color: filter === key ? "#fff" : meta.color, border: `1px solid ${filter === key ? meta.color : T.border}`
          }}>{meta.label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(ex => {
          const meta = AREA_META[ex.area] || {};
          const doneCount = (store.exercisesDone[ex.id] || []).length;
          return (
            <Card key={ex.id} onClick={() => setSelected(ex)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color || T.muted, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.title}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                  <Pill label={meta.label || ex.area} color={meta.color} bg={meta.bg} small />
                  {ex.tag && <span style={{ fontSize: 11, color: T.muted }}>{ex.tag}</span>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                {doneCount > 0 && <span style={{ fontSize: 12, color: T.success, fontWeight: 600 }}>{doneCount}×</span>}
                <ChevronRight size={18} color={T.muted} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── PROGRESS TAB ───
// ═══════════════════════════════════════
function ProgressTab({ store }) {
  const days = last7Days();
  const today = todayStr();

  // Count sessions per area this week
  const weekAreaCounts = {};
  Object.entries(store.exercisesDone).forEach(([exId, dates]) => {
    const ex = EXERCISES.find(e => e.id === exId);
    if (!ex) return;
    const thisWeek = dates.filter(d => days.includes(d));
    if (thisWeek.length > 0) {
      weekAreaCounts[ex.area] = (weekAreaCounts[ex.area] || 0) + thisWeek.length;
    }
  });

  const totalSessionsThisWeek = days.filter(d => {
    const s = store.sessions[d];
    return s && s.warmup && s.drill && s.passage;
  }).length;

  return (
    <div style={{ padding: "0 20px 120px" }}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Progress</h1>
      </div>

      {/* Streak + Sessions row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card style={{ textAlign: "center" }}>
          <Flame size={24} color={store.streakCurrent > 0 ? T.accent : T.muted} style={{ margin: "0 auto 6px" }} />
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: T.text }}>{store.streakCurrent}</p>
          <p style={{ margin: 0, fontSize: 12, color: T.muted }}>Day streak</p>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <Target size={24} color={T.primary} style={{ margin: "0 auto 6px" }} />
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: T.text }}>{totalSessionsThisWeek}<span style={{ fontSize: 16, color: T.muted }}>/7</span></p>
          <p style={{ margin: 0, fontSize: 12, color: T.muted }}>This week</p>
        </Card>
      </div>

      {/* Week calendar */}
      <Card style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: T.text }}>Last 7 days</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center" }}>
          {days.map(d => {
            const s = store.sessions[d];
            const complete = s && s.warmup && s.drill && s.passage;
            const partial = s && (s.warmup || s.drill || s.passage) && !complete;
            const isToday = d === today;
            return (
              <div key={d}>
                <p style={{ margin: 0, fontSize: 11, color: isToday ? T.primary : T.muted, fontWeight: isToday ? 700 : 400 }}>
                  {dayNames[new Date(d + "T12:00:00").getDay()]}
                </p>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", margin: "4px auto 0",
                  background: complete ? T.success : partial ? T.warnLight : "transparent",
                  border: isToday ? `2px solid ${T.primary}` : `2px solid ${complete ? T.success : partial ? T.warn : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {complete ? <Check size={14} color="#fff" /> : <span style={{ fontSize: 12, color: T.muted }}>{new Date(d + "T12:00:00").getDate()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Area coverage */}
      <Card>
        <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: T.text }}>Area coverage this week</p>
        {Object.entries(AREA_META).map(([key, meta]) => {
          const count = weekAreaCounts[key] || 0;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 14, color: T.text }}>{meta.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: count > 0 ? meta.color : T.muted }}>{count} session{count !== 1 ? "s" : ""}</span>
            </div>
          );
        })}
        {Object.keys(weekAreaCounts).length === 0 && (
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>No exercises logged this week yet. Complete a session to start tracking.</p>
        )}
      </Card>

      {/* Best streak */}
      {store.streakBest > 0 && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: T.muted }}>Personal best streak</p>
          <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: T.accent }}>{store.streakBest} days</p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// ─── COURSE TAB ───
// ═══════════════════════════════════════
function CourseTab({ store, setStore }) {
  const [expanded, setExpanded] = useState(null);
  const completed = store.curriculum || [];
  const totalLessons = CURRICULUM.reduce((a, s) => a + s.lessons.length, 0);
  const completedCount = completed.length;

  const toggle = async (lessonKey) => {
    let updated;
    if (completed.includes(lessonKey)) {
      updated = { ...store, curriculum: completed.filter(k => k !== lessonKey) };
    } else {
      updated = { ...store, curriculum: [...completed, lessonKey] };
    }
    setStore(updated);
    await saveStore(updated);
  };

  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ padding: "0 20px 120px" }}>
      <div style={{ paddingTop: 20, marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Course</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: "4px 0 0" }}>Foundations of Accent Softening</p>
      </div>

      {/* Overall progress */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Overall progress</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: T.primary }}>{pct}%</span>
        </div>
        <div style={{ width: "100%", height: 8, background: T.border, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: T.primary, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: T.muted }}>{completedCount} of {totalLessons} lessons completed</p>
      </Card>

      {/* Sections */}
      {CURRICULUM.map((section) => {
        const secLessons = section.lessons.map((l, i) => `${section.id}-${i}`);
        const secDone = secLessons.filter(k => completed.includes(k)).length;
        const secPct = section.lessons.length > 0 ? Math.round((secDone / section.lessons.length) * 100) : 0;
        const isOpen = expanded === section.id;

        return (
          <Card key={section.id} style={{ marginBottom: 10, padding: 0, overflow: "hidden" }}>
            <button onClick={() => setExpanded(isOpen ? null : section.id)} style={{
              ...btn, width: "100%", textAlign: "left", padding: 16, display: "flex", alignItems: "center", gap: 12, background: "none"
            }}>
              <span style={{ fontSize: 22 }}>{section.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text }}>{section.title}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 2, overflow: "hidden", maxWidth: 120 }}>
                    <div style={{ width: `${secPct}%`, height: "100%", background: T.primary, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: T.muted }}>{secDone}/{section.lessons.length}</span>
                </div>
              </div>
              {isOpen ? <ChevronDown size={18} color={T.muted} /> : <ChevronRight size={18} color={T.muted} />}
            </button>

            {isOpen && (
              <div style={{ padding: "0 16px 12px" }}>
                {section.lessons.map((lesson, i) => {
                  const key = `${section.id}-${i}`;
                  const isDone = completed.includes(key);
                  return (
                    <button key={key} onClick={() => toggle(key)} style={{
                      ...btn, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 0", borderBottom: i < section.lessons.length - 1 ? `1px solid ${T.border}` : "none",
                      background: "none"
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `2px solid ${isDone ? T.success : T.border}`,
                        background: isDone ? T.success : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {isDone && <Check size={12} color="#fff" />}
                      </div>
                      <span style={{
                        fontSize: 14, color: isDone ? T.muted : T.text,
                        textDecoration: isDone ? "line-through" : "none", flex: 1
                      }}>{lesson}</span>
                      {section.comingSoon && <Pill label="Soon" color={T.muted} bg={T.border} small />}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════
const TABS = [
  { id: "today", label: "Today", Icon: Calendar },
  { id: "exercises", label: "Exercises", Icon: BookOpen },
  { id: "progress", label: "Progress", Icon: BarChart3 },
  { id: "course", label: "Course", Icon: GraduationCap },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [store, setStore] = useState(defaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadStore().then(d => { setStore(d); setLoaded(true); });
  }, []);

  if (!loaded) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: T.muted }}>
      Loading…
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative",
      WebkitFontSmoothing: "antialiased", color: T.text
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Content */}
      <div style={{ paddingBottom: 80 }}>
        {tab === "today" && <TodayTab store={store} setStore={setStore} />}
        {tab === "exercises" && <ExercisesTab store={store} setStore={setStore} />}
        {tab === "progress" && <ProgressTab store={store} />}
        {tab === "course" && <CourseTab store={store} setStore={setStore} />}
      </div>

      {/* Tab Bar */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-around", padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
        zIndex: 100
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              ...btn, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "4px 16px", background: "none", color: active ? T.primary : T.muted,
              transition: "color 0.15s"
            }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
