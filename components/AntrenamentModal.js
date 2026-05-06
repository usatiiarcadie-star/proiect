"use client";
import { useState } from "react";
import { X, Play, RotateCcw, Trophy, ChevronRight, Zap, CheckCircle, Sparkles, Globe, Library } from "lucide-react";

const DIFF = {
  easy:   { label: "Ușor",  cls: "bg-green-100 text-green-700 border-green-200" },
  medium: { label: "Mediu", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  hard:   { label: "Greu",  cls: "bg-red-100 text-red-700 border-red-200" },
};

const SCOPES = [
  { v: "completed-current", l: "Modul curent", icon: CheckCircle, desc: "Doar lecțiile finalizate din modulul ales" },
  { v: "completed-all", l: "Lecțiile mele", icon: Library, desc: "Din toate lecțiile finalizate" },
  { v: "all-lessons", l: "Toate lecțiile", icon: Globe, desc: "Din întreaga bibliotecă (modulul ales)" },
];

export default function AntrenamentModal({ modules, onClose }) {
  const [moduleSlug, setModuleSlug] = useState("python");
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState(5);
  const [scope, setScope] = useState("completed-current");
  const [tasks, setTasks] = useState(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const available = modules.filter(m => m.lessons.length > 0);

  async function start() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/training", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, difficulty, count, scope }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || "Eroare."); return; }
      setTasks(data); setIdx(0); setScore(0); setDone(false);
    } catch { setError("Eroare de rețea."); }
    finally { setLoading(false); }
  }

  function handleAnswer(opt) {
    if (submitted) return;
    setSelected(opt); setSubmitted(true);
    if (opt === tasks[idx].answer) setScore(s => s + 1);
  }

  function nextTask() {
    setSelected(null); setSubmitted(false);
    if (idx + 1 >= tasks.length) setDone(true);
    else setIdx(i => i + 1);
  }

  function restart() { setTasks(null); setDone(false); setScore(0); }

  const task = tasks?.[idx];
  const diff = DIFF[task?.difficulty ?? "easy"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl flex flex-col shadow-2xl max-h-[90vh] rounded-t-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-purple-600 text-white sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5"/>
            </div>
            <div>
              <h2 className="font-black text-base">Antrenament</h2>
              <p className="text-indigo-200 text-xs">Exersează ce ai învățat</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-5">
          {!tasks ? (
            <div className="space-y-5">
              {/* Scope selector */}
              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500"/> Sursa întrebărilor
                </label>
                <div className="space-y-2">
                  {SCOPES.map(s => {
                    const Icon = s.icon;
                    const active = scope === s.v;
                    return (
                      <button key={s.v} onClick={() => setScope(s.v)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left
                          ${active ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                          <Icon className="w-4 h-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black ${active ? "text-indigo-700" : "text-slate-700"}`}>{s.l}</p>
                          <p className="text-xs text-slate-400 truncate">{s.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3"/> Întrebările sunt generate AI — diferite de cele din lecții
                </p>
              </div>

              {/* Module selector */}
              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">Modul</label>
                <div className="grid grid-cols-2 gap-2">
                  {available.map(m => (
                    <button key={m.slug} onClick={() => setModuleSlug(m.slug)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all text-left
                        ${moduleSlug === m.slug ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-200"}`}>
                      {m.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">Dificultate</label>
                <div className="flex gap-2">
                  {[{v:"all",l:"Toate"},{v:"easy",l:"Ușor"},{v:"medium",l:"Mediu"},{v:"hard",l:"Greu"}].map(d => (
                    <button key={d.v} onClick={() => setDifficulty(d.v)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all
                        ${difficulty === d.v ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:border-indigo-200"}`}>
                      {d.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">
                  Număr de probleme: <span className="text-indigo-600">{count}</span>
                </label>
                <input type="range" min={1} max={10} value={count} onChange={e => setCount(Number(e.target.value))}
                  className="w-full accent-indigo-500"/>
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1</span><span>10</span></div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <button onClick={start} disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-black hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                <Play className="w-4 h-4"/> {loading ? "Se generează..." : "Începe antrenamentul"}
              </button>
            </div>
          ) : done ? (
            <div className="text-center py-6">
              <Trophy className={`w-16 h-16 mx-auto mb-4 ${score >= tasks.length * 0.8 ? "text-yellow-400" : "text-slate-400"}`}/>
              <h3 className="text-xl font-black text-slate-900 mb-2">Antrenament terminat!</h3>
              <p className="text-slate-500 mb-1">Scor: <span className="font-black text-indigo-600">{score}/{tasks.length}</span></p>
              <p className="text-sm text-slate-400 mb-6">{Math.round((score / tasks.length) * 100)}% corect</p>
              <div className="flex gap-3 justify-center">
                <button onClick={restart}
                  className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                  <RotateCcw className="w-4 h-4"/> Din nou
                </button>
                <button onClick={onClose}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  <CheckCircle className="w-4 h-4"/> Gata
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-semibold">{idx + 1} / {tasks.length}</span>
                <span className="text-xs text-emerald-600 font-black flex items-center gap-1">
                  <CheckCircle className="w-3 h-3"/> {score} corecte
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                  style={{ width: `${(idx / tasks.length) * 100}%` }}/>
              </div>

              {task?.lesson && <p className="text-xs text-slate-400 mb-2 font-semibold">{task.lesson.title}</p>}

              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-black text-slate-800 flex-1">{task?.name}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${diff.cls}`}>{diff.label}</span>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap bg-slate-50 rounded-xl p-3">
                {task?.question}
              </p>

              <div className="space-y-2.5">
                {task?.options.map(opt => {
                  const isSel = selected === opt;
                  const isCorrect = opt === task.answer;
                  let cls = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
                  if (submitted) {
                    if (isCorrect) cls = "border-emerald-400 bg-emerald-50";
                    else if (isSel) cls = "border-red-400 bg-red-50";
                    else cls = "border-slate-100 opacity-40";
                  }
                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)} disabled={submitted}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm ${cls}`}>
                      {opt}
                      {submitted && isCorrect && <span className="float-right text-emerald-600">✓</span>}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className={`mt-3 p-3 rounded-xl text-sm ${selected === task?.answer ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`font-bold text-xs ${selected === task?.answer ? "text-emerald-700" : "text-red-700"}`}>
                    {selected === task?.answer ? "✓ Corect!" : `✗ Corect era: ${task?.answer}`}
                  </p>
                  {task?.explanation && <p className="text-slate-600 text-xs mt-1">{task.explanation}</p>}
                  <button onClick={nextTask}
                    className="mt-2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-black hover:bg-indigo-600 transition-colors flex items-center gap-1">
                    {idx + 1 >= tasks.length ? <><Trophy className="w-3 h-3"/> Finalizează</> : <>Următoarea <ChevronRight className="w-3 h-3"/></>}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
