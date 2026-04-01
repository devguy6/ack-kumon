import { useState } from "react";

const subjects = [
  {
    id: "english", name: "English", code: "ENG", color: "#B5451B", bg: "#FDF4F0", desc: "75 questions · 45 min", icon: "✦",
    levels: [
      { num: "01", topic: "Punctuation Basics" },
      { num: "02", topic: "Sentence Structure" },
      { num: "03", topic: "Subject–Verb Agreement" },
      { num: "04", topic: "Pronoun Usage" },
      { num: "05", topic: "Modifier Placement" },
      { num: "06", topic: "Verb Tense & Consistency" },
      { num: "07", topic: "Transitions & Conjunctions" },
      { num: "08", topic: "Rhetorical Strategy" },
      { num: "09", topic: "Rhetorical Organization" },
      { num: "10", topic: "Style & Word Choice" },
    ],
  },
  {
    id: "math", name: "Mathematics", code: "MTH", color: "#1A5C9A", bg: "#F0F5FB", desc: "60 questions · 60 min", icon: "◆",
    levels: [
      { num: "01", topic: "Pre-Algebra Foundations" },
      { num: "02", topic: "Linear Equations" },
      { num: "03", topic: "Inequalities & Absolute Value" },
      { num: "04", topic: "Systems of Equations" },
      { num: "05", topic: "Polynomial & Quadratic Algebra" },
      { num: "06", topic: "Functions & Graphs" },
      { num: "07", topic: "Geometry: Lines & Triangles" },
      { num: "08", topic: "Geometry: Circles & Coordinate Plane" },
      { num: "09", topic: "Trigonometry" },
      { num: "10", topic: "Statistics & Probability" },
    ],
  },
  {
    id: "reading", name: "Reading", code: "RDG", color: "#2E7D52", bg: "#F0F7F3", desc: "40 questions · 35 min", icon: "▲",
    levels: [
      { num: "01", topic: "Main Idea & Central Purpose" },
      { num: "02", topic: "Author's Voice & Tone" },
      { num: "03", topic: "Supporting Detail Questions" },
      { num: "04", topic: "Vocabulary in Context" },
      { num: "05", topic: "Inference & Implication" },
      { num: "06", topic: "Comparative Passages" },
      { num: "07", topic: "Literary Narrative (Prose Fiction)" },
      { num: "08", topic: "Social Science Passages" },
      { num: "09", topic: "Humanities Passages" },
      { num: "10", topic: "Natural Science Passages" },
    ],
  },
  {
    id: "science", name: "Science", code: "SCI", color: "#6B3A9E", bg: "#F5F0FB", desc: "40 questions · 35 min", icon: "●",
    levels: [
      { num: "01", topic: "Reading Data Tables" },
      { num: "02", topic: "Interpreting Bar & Line Graphs" },
      { num: "03", topic: "Scientific Variables" },
      { num: "04", topic: "Research Summaries" },
      { num: "05", topic: "Conflicting Viewpoints" },
      { num: "06", topic: "Data Representation" },
      { num: "07", topic: "Scientific Notation & Units" },
      { num: "08", topic: "Drawing Conclusions" },
      { num: "09", topic: "Identifying Experimental Flaws" },
      { num: "10", topic: "Synthesizing Multiple Data Sets" },
    ],
  },
  {
    id: "writing", name: "Writing", code: "WRT", color: "#8B6914", bg: "#FBF8F0", desc: "1 essay · 40 min (optional)", icon: "◈",
    levels: [
      { num: "01", topic: "Decoding the Prompt" },
      { num: "02", topic: "Crafting a Thesis" },
      { num: "03", topic: "Developing Core Arguments" },
      { num: "04", topic: "Engaging the Perspectives" },
      { num: "05", topic: "Counterargument & Rebuttal" },
      { num: "06", topic: "Organization & Cohesion" },
      { num: "07", topic: "Language, Style & Scoring" },
    ],
  },
];

const worksheetTiers = [
  { id: "A", label: "Foundation", desc: "Core concept recognition", badge: "★☆☆☆" },
  { id: "B", label: "Developing", desc: "Guided application", badge: "★★☆☆" },
  { id: "C", label: "Advanced", desc: "Complex problem-solving", badge: "★★★☆" },
  { id: "D", label: "ACT Peak", desc: "Real-test difficulty", badge: "★★★★" },
];

function buildPrompt(subject, levelTopic, tier, tierDesc) {
  const isWriting = subject.id === "writing";

  if (isWriting) {
    return `You are an expert ACT Writing tutor. Generate a worksheet for the ACT Writing section.

Subject: ACT Writing (Optional Essay)
Level Topic: ${levelTopic}
Worksheet Tier: ${tier.label} — ${tierDesc}
Difficulty: ${tier.id === "A" ? "beginner, concept recognition" : tier.id === "B" ? "intermediate, guided practice" : tier.id === "C" ? "advanced application" : "full ACT-level, real test difficulty"}

Return ONLY valid JSON. No markdown. No explanation. No backticks. Exactly this shape:
{
  "intro": "One sentence describing what this worksheet practices.",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "passage": "optional short passage or prompt excerpt (or null)",
      "question": "Question text",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A",
      "explanation": "Why this answer is correct and why the others are wrong."
    }
  ]
}

For Writing worksheets:
- Tier A & B: Include 4 MCQ questions about essay structure, argument analysis, or writing strategy
- Tier C: Include 3 MCQ questions plus 1 short-answer question (use type "short" with no options array, just "prompt" and "model_answer")
- Tier D (ACT Peak): Include a FULL ACT-style writing prompt with 3 perspectives, then 2 MCQ questions about strategy, and 1 short-answer asking the student to write a thesis

Generate exactly 4 questions total.`;
  }

  return `You are an expert ACT tutor. Generate a worksheet for the following:

Subject: ACT ${subject.name}
Level Topic: ${levelTopic}
Worksheet Tier: ${tier.label} — ${tierDesc}
Difficulty: ${tier.id === "A" ? "beginner, concept recognition, straightforward" : tier.id === "B" ? "intermediate, requires application" : tier.id === "C" ? "advanced, multi-step reasoning" : "full ACT difficulty, real test style with traps and distractors"}

Return ONLY valid JSON. No markdown, no backticks, no explanation. Exactly this shape:
{
  "intro": "One sentence describing what this worksheet practices.",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "passage": "A short passage, sentence, or scenario providing context (required for English/Reading/Science; null for Math)",
      "question": "The question text",
      "options": ["A. ...", "B. ...", "C. ...", "D. ...", "E. ..."],
      "answer": "B",
      "explanation": "Clear explanation of why this answer is correct and why each distractor is wrong."
    }
  ]
}

Rules:
- Generate exactly 4 questions
- For Math: no passage needed (null), 5 options (A–E), show the math problem clearly in the question field
- For English: include a short underlined/bracketed passage excerpt that the question refers to
- For Reading: the first 2 questions share a passage; questions 3–4 can be standalone or share another short passage
- For Science: include a brief table, graph description, or experimental setup in the passage field
- Tier D must feel exactly like a real ACT question with plausible, tricky distractors
- Vary question types within a worksheet (identification, application, error-correction, inference)`;
}

async function generateWorksheet(subject, levelTopic, tier) {
  const prompt = buildPrompt(subject, levelTopic, tier, worksheetTiers.find(t => t.id === tier.id)?.desc || "");
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  const raw = data.content?.map(b => b.text || "").join("").trim();
  const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(clean);
}

// ─── WorksheetView ────────────────────────────────────────────────────────────
function WorksheetView({ subject, levelNum, levelTopic, tier, onBack }) {
  const [state, setState] = useState("loading"); // loading | ready | submitted
  const [wsData, setWsData] = useState(null);
  const [selected, setSelected] = useState({});
  const [shortAnswers, setShortAnswers] = useState({});
  const [error, setError] = useState(null);

  useState(() => {
    generateWorksheet(subject, levelTopic, tier)
      .then(d => { setWsData(d); setState("ready"); })
      .catch(e => { setError(e.message); setState("error"); });
  });

  const color = subject.color;
  const bg = subject.bg;

  const score = wsData
    ? wsData.questions.filter(q => q.type === "mcq" && selected[q.id] === q.answer).length
    : 0;
  const mcqTotal = wsData ? wsData.questions.filter(q => q.type === "mcq").length : 0;

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Back Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: "none", border: `1.5px solid ${color}`, color: color,
          padding: "6px 14px", cursor: "pointer", borderRadius: 2,
          fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.12em",
        }}>← BACK</button>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#888", letterSpacing: "0.1em" }}>
          {subject.code} · LVL {levelNum} · {levelTopic}
        </div>
      </div>

      {/* Worksheet Header */}
      <div style={{
        background: color, color: "#fff", padding: "16px 22px", borderRadius: "4px 4px 0 0",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, opacity: 0.7, letterSpacing: "0.2em", marginBottom: 4 }}>
            WORKSHEET {tier.id} · {tier.badge}
          </div>
          <div style={{ fontSize: 18, fontWeight: "600", letterSpacing: "-0.2px" }}>{tier.label}</div>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.8, textAlign: "right" }}>
          {tier.desc}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid #E5E5E0", borderTop: "none", borderRadius: "0 0 4px 4px", padding: "24px" }}>

        {state === "loading" && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#888", letterSpacing: "0.15em" }}>
              GENERATING WORKSHEET...
            </div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 6 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: color,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {state === "error" && (
          <div style={{ color: "#c0392b", fontFamily: "'Courier New', monospace", fontSize: 12, padding: "24px 0" }}>
            Error generating worksheet: {error}
          </div>
        )}

        {state !== "loading" && state !== "error" && wsData && (
          <>
            <p style={{ fontStyle: "italic", color: "#555", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              {wsData.intro}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {wsData.questions.map((q, qi) => {
                const isSelected = selected[q.id] !== undefined;
                const isCorrect = selected[q.id] === q.answer;
                const showResult = state === "submitted";

                return (
                  <div key={q.id} style={{
                    borderLeft: `3px solid ${showResult ? (isCorrect ? "#2E7D52" : "#c0392b") : color}`,
                    paddingLeft: 18,
                  }}>
                    {/* Passage */}
                    {q.passage && (
                      <div style={{
                        background: bg, border: `1px solid ${color}22`,
                        padding: "12px 16px", borderRadius: 3, marginBottom: 12,
                        fontSize: 13, color: "#333", lineHeight: 1.7, fontStyle: "italic",
                      }}>
                        {q.passage}
                      </div>
                    )}

                    {/* Question Number + Text */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      <span style={{
                        fontFamily: "'Courier New', monospace", fontSize: 11,
                        color: color, fontWeight: "bold", flexShrink: 0, marginTop: 2,
                      }}>{qi + 1}.</span>
                      <span style={{ fontSize: 14, color: "#1C1C1C", lineHeight: 1.6 }}>{q.question}</span>
                    </div>

                    {/* MCQ Options */}
                    {q.type === "mcq" && q.options && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingLeft: 20 }}>
                        {q.options.map((opt, oi) => {
                          const letter = opt.split(".")[0].trim();
                          const isThisSelected = selected[q.id] === letter;
                          const isCorrectOpt = letter === q.answer;
                          let optBg = "#FAFAF7";
                          let optBorder = "#E5E5E0";
                          let optColor = "#333";
                          if (showResult && isCorrectOpt) { optBg = "#F0F7F3"; optBorder = "#2E7D52"; optColor = "#1A4D33"; }
                          else if (showResult && isThisSelected && !isCorrectOpt) { optBg = "#FDF0EE"; optBorder = "#c0392b"; optColor = "#7B1D1D"; }
                          else if (!showResult && isThisSelected) { optBg = bg; optBorder = color; optColor = "#1C1C1C"; }

                          return (
                            <button
                              key={oi}
                              disabled={showResult}
                              onClick={() => setSelected(s => ({ ...s, [q.id]: letter }))}
                              style={{
                                background: optBg, border: `1.5px solid ${optBorder}`, color: optColor,
                                padding: "9px 14px", borderRadius: 3, cursor: showResult ? "default" : "pointer",
                                textAlign: "left", fontSize: 13, lineHeight: 1.5, transition: "all 0.12s ease",
                                fontFamily: "Georgia, serif",
                              }}
                            >
                              {opt}
                              {showResult && isCorrectOpt && <span style={{ float: "right", color: "#2E7D52", fontWeight: "bold" }}>✓</span>}
                              {showResult && isThisSelected && !isCorrectOpt && <span style={{ float: "right", color: "#c0392b", fontWeight: "bold" }}>✗</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer */}
                    {q.type === "short" && (
                      <div style={{ paddingLeft: 20 }}>
                        <div style={{ fontSize: 12, fontFamily: "'Courier New', monospace", color: "#888", marginBottom: 8, letterSpacing: "0.1em" }}>YOUR ANSWER:</div>
                        <textarea
                          disabled={showResult}
                          value={shortAnswers[q.id] || ""}
                          onChange={e => setShortAnswers(s => ({ ...s, [q.id]: e.target.value }))}
                          placeholder={q.prompt || "Write your response here..."}
                          style={{
                            width: "100%", minHeight: 100, padding: "10px 12px",
                            border: `1.5px solid ${showResult ? "#888" : "#E5E5E0"}`,
                            borderRadius: 3, fontSize: 13, fontFamily: "Georgia, serif",
                            lineHeight: 1.6, resize: "vertical", boxSizing: "border-box",
                            background: showResult ? "#FAFAF7" : "#fff", color: "#333",
                          }}
                        />
                      </div>
                    )}

                    {/* Explanation (after submit) */}
                    {showResult && q.explanation && (
                      <div style={{
                        marginTop: 12, marginLeft: 20, padding: "10px 14px",
                        background: "#1C1C1C", borderRadius: 3,
                      }}>
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#E8C84A", letterSpacing: "0.15em", marginBottom: 6 }}>EXPLANATION</div>
                        <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6 }}>{q.explanation}</div>
                      </div>
                    )}
                    {showResult && q.type === "short" && q.model_answer && (
                      <div style={{
                        marginTop: 12, marginLeft: 20, padding: "10px 14px",
                        background: "#1C1C1C", borderRadius: 3,
                      }}>
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#E8C84A", letterSpacing: "0.15em", marginBottom: 6 }}>STRONG RESPONSE EXAMPLE</div>
                        <div style={{ fontSize: 12, color: "#CCC", lineHeight: 1.6 }}>{q.model_answer}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit / Score */}
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #E5E5E0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              {state !== "submitted" ? (
                <button
                  onClick={() => setState("submitted")}
                  disabled={Object.keys(selected).length < wsData.questions.filter(q => q.type === "mcq").length}
                  style={{
                    background: color, color: "#fff", border: "none", padding: "12px 28px",
                    borderRadius: 3, cursor: "pointer", fontFamily: "'Courier New', monospace",
                    fontSize: 12, letterSpacing: "0.15em", opacity:
                      Object.keys(selected).length < wsData.questions.filter(q => q.type === "mcq").length ? 0.4 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  CHECK ANSWERS
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{
                    fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: "bold",
                    color: score === mcqTotal ? "#2E7D52" : score >= mcqTotal / 2 ? color : "#c0392b",
                  }}>
                    {score} / {mcqTotal}
                  </div>
                  <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>
                    {score === mcqTotal ? "Perfect score! Ready for the next worksheet." :
                      score >= mcqTotal * 0.75 ? "Strong work — review the explanations above." :
                        "Review this worksheet before advancing."}
                  </div>
                </div>
              )}
              {state === "submitted" && (
                <button
                  onClick={() => { setState("loading"); setSelected({}); setShortAnswers({}); setWsData(null); setError(null);
                    generateWorksheet(subject, levelTopic, tier)
                      .then(d => { setWsData(d); setState("ready"); })
                      .catch(e => { setError(e.message); setState("error"); });
                  }}
                  style={{
                    background: "none", border: `1.5px solid ${color}`, color: color,
                    padding: "10px 20px", cursor: "pointer", borderRadius: 3,
                    fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: "0.12em",
                  }}
                >
                  ↺ NEW QUESTIONS
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
      `}</style>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ACTKumon() {
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [activeWorksheet, setActiveWorksheet] = useState(null); // { levelIdx, tier }

  const handleSubjectChange = (s) => {
    setActiveSubject(s);
    setExpandedLevel(null);
    setActiveWorksheet(null);
  };

  const color = activeSubject.color;
  const bg = activeSubject.bg;

  return (
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", minHeight: "100vh", background: "#FAFAF7" }}>
      {/* Header */}
      <div style={{ background: "#1C1C1C", padding: "24px 40px 20px", borderBottom: "3px solid #E8C84A" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#E8C84A", textTransform: "uppercase", marginBottom: 4 }}>Progressive Mastery Series</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: "normal", margin: "0 0 2px", letterSpacing: "-0.3px" }}>ACT Curriculum Guide</h1>
          <p style={{ color: "#666", fontSize: 12, fontStyle: "italic", margin: 0 }}>Kumon-style levels · AI-generated worksheets · Foundation → ACT Peak</p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div style={{ background: "#1C1C1C", borderBottom: "1px solid #333" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", overflowX: "auto" }}>
          {subjects.map(s => (
            <button key={s.id} onClick={() => handleSubjectChange(s)} style={{
              background: activeSubject.id === s.id ? s.color : "transparent",
              color: activeSubject.id === s.id ? "#fff" : "#777",
              border: "none", padding: "13px 18px", cursor: "pointer",
              fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: "0.15em",
              textTransform: "uppercase", fontWeight: "bold", borderRight: "1px solid #2A2A2A",
              transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              <span style={{ marginRight: 5 }}>{s.icon}</span>{s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>

        {activeWorksheet ? (
          <WorksheetView
            subject={activeSubject}
            levelNum={activeSubject.levels[activeWorksheet.levelIdx].num}
            levelTopic={activeSubject.levels[activeWorksheet.levelIdx].topic}
            tier={worksheetTiers[activeWorksheet.tierIdx]}
            onBack={() => setActiveWorksheet(null)}
          />
        ) : (
          <>
            {/* Subject Header */}
            <div style={{
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              marginBottom: 24, borderBottom: `3px solid ${color}`, paddingBottom: 14, flexWrap: "wrap", gap: 8,
            }}>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: "0.2em", color, textTransform: "uppercase", marginBottom: 4 }}>
                  {activeSubject.code} · {activeSubject.levels.length} LEVELS · {worksheetTiers.length} WORKSHEETS EACH
                </div>
                <h2 style={{ fontSize: 24, fontWeight: "normal", color: "#1C1C1C", margin: 0 }}>ACT {activeSubject.name}</h2>
              </div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#888", letterSpacing: "0.1em" }}>{activeSubject.desc}</div>
            </div>

            {/* Levels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeSubject.levels.map((level, idx) => {
                const isOpen = expandedLevel === idx;
                return (
                  <div key={idx} style={{
                    border: `1.5px solid ${isOpen ? color : "#E5E5E0"}`,
                    borderRadius: 4, overflow: "hidden", background: isOpen ? bg : "#fff",
                    transition: "all 0.15s ease",
                  }}>
                    {/* Level Row */}
                    <button
                      onClick={() => setExpandedLevel(isOpen ? null : idx)}
                      style={{
                        width: "100%", background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", textAlign: "left",
                      }}
                    >
                      <div style={{
                        background: isOpen ? color : "#1C1C1C", color: "#fff",
                        fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: "bold",
                        padding: "3px 10px", borderRadius: 2, minWidth: 60, textAlign: "center",
                        flexShrink: 0, transition: "background 0.15s",
                      }}>LVL {level.num}</div>
                      <div style={{ flex: 1, fontSize: 14, color: "#1C1C1C", fontWeight: isOpen ? "600" : "normal" }}>{level.topic}</div>
                      <div style={{
                        fontFamily: "'Courier New', monospace", fontSize: 10, color, letterSpacing: "0.1em",
                        flexShrink: 0, display: "flex", gap: 4, alignItems: "center",
                      }}>
                        <span style={{ color: "#aaa" }}>4 worksheets</span>
                        <span style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", display: "inline-block", fontSize: 14 }}>▾</span>
                      </div>
                    </button>

                    {/* Worksheet Cards */}
                    {isOpen && (
                      <div style={{
                        padding: "4px 18px 18px",
                        borderTop: `1px dashed ${color}40`,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
                        gap: 10,
                        animation: "fadeIn 0.2s ease",
                      }}>
                        {worksheetTiers.map((tier, ti) => (
                          <button
                            key={tier.id}
                            onClick={() => setActiveWorksheet({ levelIdx: idx, tierIdx: ti })}
                            style={{
                              background: "#fff", border: `1.5px solid ${color}33`,
                              borderRadius: 4, padding: "14px 16px", cursor: "pointer",
                              textAlign: "left", transition: "all 0.15s ease",
                              fontFamily: "Georgia, serif",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = bg; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.background = "#fff"; }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{
                                fontFamily: "'Courier New', monospace", fontSize: 10,
                                background: color, color: "#fff", padding: "2px 7px", borderRadius: 2, letterSpacing: "0.1em",
                              }}>WS-{tier.id}</span>
                              <span style={{ fontSize: 11, color: "#bbb", letterSpacing: 1 }}>{tier.badge}</span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: "600", color: "#1C1C1C", marginBottom: 3 }}>{tier.label}</div>
                            <div style={{ fontSize: 11, color: "#777", fontStyle: "italic" }}>{tier.desc}</div>
                            <div style={{ marginTop: 10, fontSize: 10, fontFamily: "'Courier New', monospace", color, letterSpacing: "0.1em" }}>
                              4 questions →
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 32, padding: "14px 18px", borderLeft: `3px solid ${color}`, background: bg }}>
              <p style={{ margin: 0, fontSize: 12, color: "#555", fontStyle: "italic", lineHeight: 1.6 }}>
                <strong style={{ fontStyle: "normal", color: "#1C1C1C" }}>How to use:</strong> Open a level, then work through worksheets A → D in order.
                Each worksheet is AI-generated fresh, so you get new questions every time. Master WS-D before moving to the next level.
              </p>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}
