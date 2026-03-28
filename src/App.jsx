import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, BookOpen, BarChart3, GraduationCap, ChevronRight, ChevronDown, Check, Clock, RotateCcw, Filter, X, Play, Pause, ArrowLeft, Flame, Target, Volume2, Settings, Shuffle } from "lucide-react";
import { useRegisterSW } from 'virtual:pwa-register/react';
import {
  CRUNCHING_DU, CRUNCHING_TU, CRUNCHING_STU, CRUNCHING_DR, CRUNCHING_TR, CRUNCHING_STR,
  VOWEL_FOOT_GOOSE, VOWEL_PALM, VOWEL_THOUGHT, VOWEL_TRAP,
  DARK_L_WORDS, FINAL_CONSONANTS, BOUNCING_G,
  READING_PASSAGES,
  CURRICULUM_SCHWA, CURRICULUM_DIPHTHONG_EI, CURRICULUM_DIPHTHONG_AI,
  CURRICULUM_DIPHTHONG_OI, CURRICULUM_DIPHTHONG_AU, CURRICULUM_DIPHTHONG_OU,
  CURRICULUM_R_SOUND, CURRICULUM_W_SOUND, CURRICULUM_PLOSIVES,
  CURRICULUM_SCHWA_SENTENCES, CURRICULUM_DIPHTHONG_SENTENCES, CURRICULUM_R_SENTENCES,
} from './data/exercises-data.js';

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
// Wordlist exercises use pool: [{ word, ipa }] from the data file
const EXERCISES = [
  // ── CRUNCHING (wordlists from data file) ──
  CRUNCHING_DU, CRUNCHING_TU, CRUNCHING_STU, CRUNCHING_DR, CRUNCHING_TR, CRUNCHING_STR,
  { id: "cr-mix", title: "Mixed Crunching Passage", area: "crunching", tag: "All clusters", type: "passage",
    instruction: "Read at a steady, measured pace. Focus on separating every consonant cluster clearly.",
    content: "The **student** had a **duty** to **produce** a **tutorial** on **strategy** for her **tutor**. She **drew** up a **structure** for the **studio** session. The **train** was **due** at noon, so she had to **drive** **straight** to the **street** where the **tube** station stood. She **strolled** along, humming a **tune**, appreciating the **opportunity**.",
    table: { "DU-": ["duty", "produce", "due"], "TU-": ["tutorial", "tutor", "tube", "tune", "opportunity"], "STU-": ["student", "studio"], "DR-": ["drew", "drive"], "TR-": ["train"], "STR-": ["strategy", "structure", "straight", "street", "strolled"] } },

  // ── VOWELS (wordlists from data file) ──
  VOWEL_FOOT_GOOSE, VOWEL_PALM, VOWEL_THOUGHT, VOWEL_TRAP,
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

  // ── DARK L & FINAL CONSONANTS (wordlists from data file) ──
  DARK_L_WORDS, FINAL_CONSONANTS,
  { id: "dl-sent", title: "Dark L in Sentences", area: "darkl", tag: "Dark L", type: "sentences",
    instruction: "Read each sentence 3 times. Hold every bolded dark L firmly – especially in connected speech.",
    content: [
      "The **little** **bottle** on the **table** was **still** nearly **full**.",
      "The **hospital** is in the **middle** of the **capital** city.",
      "He was **careful** to **tell** the **people** about the **special** **local** event.",
      "She could **still** see the **beautiful** **canal** from the **travel** office.",
      "**All** in **all**, it went quite **well**."
    ] },
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

  // ── BOUNCING G (wordlist from data file) ──
  BOUNCING_G,
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

  // ── SPEED & BREATH (20 passages from data file) ──
  ...READING_PASSAGES,

  // ── CURRICULUM (from data file) ──
  CURRICULUM_SCHWA,
  CURRICULUM_DIPHTHONG_EI, CURRICULUM_DIPHTHONG_AI, CURRICULUM_DIPHTHONG_OI,
  CURRICULUM_DIPHTHONG_AU, CURRICULUM_DIPHTHONG_OU,
  CURRICULUM_R_SOUND, CURRICULUM_W_SOUND, CURRICULUM_PLOSIVES,
  CURRICULUM_SCHWA_SENTENCES, CURRICULUM_DIPHTHONG_SENTENCES, CURRICULUM_R_SENTENCES,
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
  crunching:   { label: "Crunching",       color: T.accent,  bg: T.accentLight },
  vowels:      { label: "Vowels",           color: "#6B5CA5", bg: "#EEEAF5" },
  darkl:       { label: "Dark L & Finals",  color: "#3B7A9E", bg: "#E3F0F6" },
  "bouncing-g":{ label: "Bouncing G",       color: "#9B6B3D", bg: "#F5EDE3" },
  inflection:  { label: "Inflection",       color: "#7A5CA5", bg: "#F0EAF5" },
  speed:       { label: "Speed & Breath",   color: T.primary, bg: T.primaryLight },
  curriculum:  { label: "Curriculum",       color: "#2A8F82", bg: "#E0F2F0" },
};

// ─── CURRICULUM → EXERCISE AREA MAPPING ───
const CURRICULUM_AREA_MAP = {
  s1: ["crunching"],
  s2: ["vowels"],
  s3: ["vowels"],
  s4: ["vowels"],
  s7: ["bouncing-g"],
  s8: ["darkl"],
  s9: ["inflection"],
  // s5 (Plosives), s6 (Fricatives), s10, s11 have no matching exercise area yet
};

function getUnlockedAreas(curriculumKeys) {
  const touched = new Set((curriculumKeys || []).map(k => k.split("-")[0]));
  const areas = new Set(["speed"]); // speed always available (orphan — universal)
  touched.forEach(sId => {
    (CURRICULUM_AREA_MAP[sId] || []).forEach(a => areas.add(a));
  });
  return areas;
}

function pickFreePractice(curriculumKeys, count = 4) {
  const unlocked = getUnlockedAreas(curriculumKeys);
  const pool = EXERCISES.filter(e => e.area !== "curriculum" && unlocked.has(e.area));
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
}

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

function loadStore() {
  const raw = localStorage.getItem(STORE_KEY);
  return raw ? JSON.parse(raw) : defaultState();
}

function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
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
function Timer({ duration, onComplete }) {
  const [secs, setSecs] = useState(duration);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setTimeout(() => setSecs(s => s - 1), 1000);
    } else if (secs === 0) {
      setRunning(false);
      onComplete?.();
    }
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
const Card = React.forwardRef(function Card({ children, style, onClick }, ref) {
  return (
    <div ref={ref} onClick={onClick} style={{
      background: T.card, borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      border: `1px solid ${T.border}`, ...style
    }}>
      {children}
    </div>
  );
});

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
  const session = store.sessions[today] || { warmup: false, drill: false, passage: false, practice: false };

  const todayExercises = sched.area
    ? sched.area === "mixed"
      ? EXERCISES.filter(e => e.type === "passage").slice(0, 3)
      : EXERCISES.filter(e => e.area === sched.area)
    : [];

  // Pick a passage based on day of month
  const passageIdx = new Date().getDate() % READING_PASSAGES.length;
  const todayPassage = READING_PASSAGES[passageIdx];

  const [phase, setPhase] = useState(null); // 'warmup', 'drill', 'passage', 'practice', or null
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [practiceExs] = useState(() => pickFreePractice(store.curriculum));

  // Returns the expected previous practice day (skipping Sundays as rest days)
  const getExpectedPrevDay = (dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() - 1);
    while (d.getDay() === 0) d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const markPhase = (p) => {
    const updated = { ...store, sessions: { ...store.sessions, [today]: { ...session, [p]: true } } };
    const allDone = updated.sessions[today]?.warmup && updated.sessions[today]?.drill
      && updated.sessions[today]?.passage && updated.sessions[today]?.practice;
    if (allDone) {
      const expectedPrev = getExpectedPrevDay(today);
      if (updated.lastDate === expectedPrev || updated.lastDate === today) {
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
    saveStore(updated);
  };

  const isComplete = session.warmup && session.drill && session.passage && session.practice;

  if (phase === "warmup") return <WarmupView onBack={() => setPhase(null)} onDone={() => { markPhase("warmup"); setPhase(null); }} />;
  if (phase === "drill" && selectedDrill) return <ExerciseDetail ex={selectedDrill} onBack={() => { setPhase(null); setSelectedDrill(null); }} onDone={() => { markPhase("drill"); setPhase(null); setSelectedDrill(null); }} />;
  if (phase === "passage" && todayPassage) return <ExerciseDetail ex={todayPassage} onBack={() => setPhase(null)} onDone={() => { markPhase("passage"); setPhase(null); }} />;
  if (phase === "practice") return <FreePracticeView exercises={practiceExs} onBack={() => setPhase(null)} onDone={() => { markPhase("practice"); setPhase(null); }} />;

  return (
    <div style={{ padding: "0 20px 40px" }}>
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
          </div>

          {/* Phase 3: Passage */}
          <div style={{ marginTop: 12 }}>
            <SessionPhaseCard
              number="3" title="Reading Passage" subtitle="Speed & breath control" duration="5–8 min"
              done={session.passage} onStart={() => setPhase("passage")}
            />
          </div>

          {/* Phase 4: Free Practice */}
          <div style={{ marginTop: 12 }}>
            <SessionPhaseCard
              number="4" title="Free Practice" subtitle="Your unlocked areas" duration="10–15 min"
              done={session.practice} onStart={() => setPhase("practice")}
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
  const stepRefs = useRef({});
  const allDone = WARMUP.every(s => completed[s.id]);

  const handleTimerComplete = (stepId) => {
    setCompleted(prev => {
      const next = WARMUP.find(s => !prev[s.id] && s.id !== stepId);
      if (next) {
        setTimeout(() => {
          stepRefs.current[next.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
      return { ...prev, [stepId]: true };
    });
  };

  return (
    <div style={{ padding: "0 20px 40px" }}>
      <button onClick={onBack} style={{ ...btn, display: "flex", alignItems: "center", gap: 6, color: T.primary, background: "none", padding: "16px 0", fontSize: 15, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Warm-Up</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 20px" }}>Daily articulation regime · 5 minutes</p>

      {WARMUP.map((step) => (
        <Card key={step.id} ref={el => stepRefs.current[step.id] = el} style={{ marginBottom: 10, border: completed[step.id] ? `1px solid ${T.success}` : `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <button onClick={() => setCompleted(c => ({ ...c, [step.id]: !c[step.id] }))}
              style={{ ...btn, width: 28, height: 28, borderRadius: "50%", border: `2px solid ${completed[step.id] ? T.success : T.border}`, background: completed[step.id] ? T.success : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {completed[step.id] && <Check size={14} color="#fff" />}
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text }}>{step.title}</p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{step.desc}</p>
              {step.detail && <p style={{ margin: "4px 0 0", fontSize: 13, color: T.primary, fontWeight: 500 }}>{step.detail}</p>}
              {step.type === "timer" && !completed[step.id] && <Timer duration={step.duration} onComplete={() => handleTimerComplete(step.id)} />}
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

// ─── PICK WORDS (random balanced sample from pool) ───
function pickWords(pool, count = 10) {
  if (!pool || !pool.length) return [];
  const groups = {};
  pool.forEach(item => {
    const g = item.group || "__all";
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });
  const keys = Object.keys(groups);
  let result = [];
  if (keys.length === 1) {
    result = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  } else {
    const perGroup = Math.floor(count / keys.length);
    keys.forEach(g => {
      result.push(...[...groups[g]].sort(() => Math.random() - 0.5).slice(0, perGroup));
    });
    const needed = count - result.length;
    if (needed > 0) {
      const picked = new Set(result.map(w => w.word));
      const extra = pool.filter(w => !picked.has(w.word)).sort(() => Math.random() - 0.5).slice(0, needed);
      result.push(...extra);
    }
    result = result.sort(() => Math.random() - 0.5);
  }
  return result;
}

// ─── FREE PRACTICE VIEW ───
function FreePracticeView({ exercises, onBack, onDone }) {
  const [opened, setOpened] = useState({});
  const [viewing, setViewing] = useState(null);

  if (viewing) {
    return (
      <ExerciseDetail
        ex={viewing}
        onBack={() => setViewing(null)}
        onDone={() => { setOpened(o => ({ ...o, [viewing.id]: true })); setViewing(null); }}
      />
    );
  }

  const hasCurriculumGating = exercises.some(e => e.area !== "speed");

  return (
    <div style={{ padding: "0 20px 40px" }}>
      <button onClick={onBack} style={{ ...btn, display: "flex", alignItems: "center", gap: 6, color: T.primary, background: "none", padding: "16px 0", fontSize: 15, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back
      </button>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Free Practice</h2>
      <p style={{ fontSize: 14, color: T.muted, margin: "0 0 20px", lineHeight: 1.5 }}>
        {hasCurriculumGating
          ? "4 exercises from areas you've covered in the Course"
          : "Start the Course to unlock targeted practice · Speed drills available now"}
      </p>

      {exercises.map(ex => {
        const meta = AREA_META[ex.area] || {};
        const done = opened[ex.id];
        return (
          <Card key={ex.id} onClick={() => setViewing(ex)} style={{
            marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
            border: done ? `1px solid ${T.success}` : `1px solid ${T.border}`
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color || T.muted, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.title}</p>
              <div style={{ marginTop: 4 }}>
                <Pill label={meta.label || ex.area} color={meta.color} bg={meta.bg} small />
              </div>
            </div>
            {done ? <Check size={18} color={T.success} /> : <ChevronRight size={18} color={T.muted} />}
          </Card>
        );
      })}

      <button onClick={onDone} style={{
        ...btn, width: "100%", padding: "14px 0", borderRadius: 14, marginTop: 16,
        background: T.primary, color: "#fff", fontSize: 15, fontWeight: 600
      }}>
        ✓ Mark Free Practice Complete
      </button>
    </div>
  );
}

// ─── EXERCISE DETAIL VIEW ───
function ExerciseDetail({ ex, onBack, onDone }) {
  const meta = AREA_META[ex.area] || { label: ex.area, color: T.primary, bg: T.primaryLight };
  const [words, setWords] = useState(() => ex.pool ? pickWords(ex.pool) : null);

  return (
    <div style={{ padding: "0 20px 40px" }}>
      <button onClick={onBack} style={{ ...btn, display: "flex", alignItems: "center", gap: 6, color: T.primary, background: "none", padding: "16px 0", fontSize: 15, fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back
      </button>

      <Pill label={meta.label} color={meta.color} bg={meta.bg} />
      {ex.tag && <Pill label={ex.tag} color={T.muted} bg={T.border} small style={{ marginLeft: 6 }} />}

      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "10px 0 6px" }}>{ex.title}</h2>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>{ex.instruction}</p>

      <Card>
        {ex.type === "wordlist" && (
          <div>
            {ex.pool && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                <button onClick={() => setWords(pickWords(ex.pool))}
                  style={{ ...btn, display: "flex", alignItems: "center", gap: 5,
                    fontSize: 13, color: T.primary, background: T.primaryLight,
                    padding: "5px 12px", borderRadius: 16, fontWeight: 600 }}>
                  <Shuffle size={13} /> Shuffle
                </button>
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(words || ex.content || []).map((item, i) => {
                if (item === "—") return (
                  <div key={i} style={{ width: "100%", borderTop: `1px solid ${T.border}`, margin: "4px 0" }} />
                );
                const word = typeof item === "string" ? item : item.word;
                const ipa = typeof item === "object" ? item.ipa : null;
                return (
                  <div key={i} style={{ padding: "6px 12px", background: T.primaryLight,
                    borderRadius: 10, display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{word}</span>
                    {ipa && <span style={{ fontSize: 11, color: T.muted }}>/{ipa}/</span>}
                  </div>
                );
              })}
            </div>
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
  const mainExercises = filtered.filter(e => e.area !== "curriculum");
  const currExercises = filter === "curriculum"
    ? filtered
    : filter === null
      ? EXERCISES.filter(e => e.area === "curriculum")
      : [];

  if (selected) {
    return (
      <ExerciseDetail
        ex={selected}
        onBack={() => setSelected(null)}
        onDone={() => {
          const today = todayStr();
          const done = { ...store.exercisesDone };
          if (!done[selected.id]) done[selected.id] = [];
          if (!done[selected.id].includes(today)) done[selected.id].push(today);
          const updated = { ...store, exercisesDone: done };
          setStore(updated);
          saveStore(updated);
          setSelected(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: "0 20px 40px" }}>
      <div style={{ paddingTop: 20, marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Exercises</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: "4px 0 0" }}>{EXERCISES.length} exercises across {Object.keys(AREA_META).length} areas</p>
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
        {(filter === "curriculum" ? [] : mainExercises).map(ex => {
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

        {/* Curriculum section */}
        {currExercises.length > 0 && filter !== "curriculum" && (
          <p style={{ fontSize: 12, fontWeight: 700, color: T.muted, textTransform: "uppercase",
            letterSpacing: 0.8, margin: "6px 0 2px" }}>Curriculum</p>
        )}
        {currExercises.map(ex => {
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
    <div style={{ padding: "0 20px 40px" }}>
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

  const toggle = (lessonKey) => {
    let updated;
    if (completed.includes(lessonKey)) {
      updated = { ...store, curriculum: completed.filter(k => k !== lessonKey) };
    } else {
      updated = { ...store, curriculum: [...completed, lessonKey] };
    }
    setStore(updated);
    saveStore(updated);
  };

  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ padding: "0 20px 40px" }}>
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
// ─── SETTINGS TAB ───
// ═══════════════════════════════════════
function SettingsTab() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  return (
    <div style={{ padding: "0 20px 40px" }}>
      <div style={{ paddingTop: 20, marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>Settings</h1>
      </div>

      <Card>
        <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: T.text }}>App Version</p>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
          {needRefresh ? "A new version is available." : "You're on the latest version."}
        </p>
        <button
          onClick={() => updateServiceWorker(true)}
          style={{
            ...btn, width: "100%", padding: "13px 0", borderRadius: 14,
            background: needRefresh ? T.primary : T.primaryLight,
            color: needRefresh ? "#fff" : T.primary,
            fontSize: 15, fontWeight: 600,
          }}
        >
          {needRefresh ? "Update Available — Refresh Now" : "Refresh to Latest Version"}
        </button>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════
const TABS = [
  { id: "today",     label: "Today",     Icon: Calendar },
  { id: "exercises", label: "Exercises", Icon: BookOpen },
  { id: "progress",  label: "Progress",  Icon: BarChart3 },
  { id: "course",    label: "Course",    Icon: GraduationCap },
  { id: "settings",  label: "Settings",  Icon: Settings },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [store, setStore] = useState(defaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setLoaded(true);
  }, []);

  if (!loaded) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: T.muted }}>
      Loading…
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      background: T.bg, height: "100dvh", maxWidth: 480, margin: "0 auto",
      display: "flex", flexDirection: "column", overflow: "hidden",
      WebkitFontSmoothing: "antialiased", color: T.text,
    }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "env(safe-area-inset-top)" }}>
        {tab === "today"     && <TodayTab store={store} setStore={setStore} />}
        {tab === "exercises" && <ExercisesTab store={store} setStore={setStore} />}
        {tab === "progress"  && <ProgressTab store={store} />}
        {tab === "course"    && <CourseTab store={store} setStore={setStore} />}
        {tab === "settings"  && <SettingsTab />}
      </div>

      {/* Tab Bar — flex child, no position:fixed */}
      <div style={{
        flexShrink: 0,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-around",
        padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              ...btn, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "4px 10px", background: "none", color: active ? T.primary : T.muted,
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
