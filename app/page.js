"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Dumbbell, CheckCircle, Clock, BookMarked, ChevronRight } from "lucide-react";
import AntrenamentModal from "@/components/AntrenamentModal";

const MOD_ICONS = {
  python: "🐍", javascript: "⚡", html: "🌐", css: "🎨", tailwind: "💨",
  react: "⚛", "nextjs-frontend": "▲", "nextjs-backend": "⬡",
  c: "©", cpp: "⊕", csharp: "◇", java: "☕", cybersecurity: "🛡",
};
const MOD_BG = {
  python: "from-blue-500 to-cyan-400", javascript: "from-yellow-400 to-orange-400",
  html: "from-orange-500 to-red-500", css: "from-blue-500 to-indigo-600",
  tailwind: "from-cyan-400 to-teal-500", react: "from-sky-400 to-blue-500",
  "nextjs-frontend": "from-gray-700 to-gray-900", "nextjs-backend": "from-slate-600 to-slate-800",
  c: "from-purple-500 to-violet-600", cpp: "from-violet-500 to-pink-600",
  csharp: "from-indigo-500 to-purple-700", java: "from-red-500 to-orange-600",
  cybersecurity: "from-emerald-500 to-green-700",
};

export default function Home() {
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/modules"), fetch("/api/progress")])
      .then(([m, p]) => Promise.all([m.json(), p.json()]))
      .then(([mods, prog]) => {
        setModules(Array.isArray(mods) ? mods : []);
        setProgress(Array.isArray(prog) ? prog : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function stats(mod) {
    const ids = mod.lessons.map(l => l.id);
    return {
      done: progress.filter(p => ids.includes(p.lessonId) && p.completed).length,
      inProgress: progress.filter(p => ids.includes(p.lessonId) && !p.completed && p.completedTasks?.length > 0).length,
      total: ids.length,
    };
  }

  const totalDone = progress.filter(p => p.completed).length;
  const totalInProgress = progress.filter(p => !p.completed && p.completedTasks?.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-black text-base">TF</div>
            <span className="font-black text-lg tracking-tight">TaskForge</span>
          </div>
          <button onClick={() => setModal(true)}
            className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-full font-black text-sm hover:bg-yellow-300 transition-colors shadow flex items-center gap-2">
            <Dumbbell className="w-4 h-4"/> Antrenament
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">C</div>
            <div className="flex-1">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Spațiul tău</p>
              <h1 className="text-2xl font-black">Salut, Cristi!</h1>
              <p className="text-indigo-200 text-sm">{totalDone + totalInProgress} lecții active</p>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <p className="text-2xl font-black text-yellow-300">{totalDone}</p>
                <p className="text-xs text-indigo-200 mt-0.5 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3"/> Finalizate
                </p>
              </div>
              <div className="bg-white/15 rounded-2xl px-5 py-3">
                <p className="text-2xl font-black text-emerald-300">{totalInProgress}</p>
                <p className="text-xs text-indigo-200 mt-0.5 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3"/> În curs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <h2 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-indigo-600"/> Module de învățare
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-36 animate-pulse"/>)}
          </div>
        ) : modules.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-slate-600 font-semibold">Baza de date nu e conectată.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map(mod => {
              const s = stats(mod);
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              const hasLessons = mod.lessons.length > 0;
              const bg = MOD_BG[mod.slug] || "from-slate-500 to-slate-700";
              const icon = MOD_ICONS[mod.slug] || "◆";
              return (
                <Link key={mod.id} href={hasLessons ? `/modules/${mod.slug}` : "#"}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group block ${!hasLessons ? "opacity-60 pointer-events-none" : ""}`}>
                  <div className={`bg-gradient-to-r ${bg} p-4 flex items-center gap-3`}>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-base">{mod.title}</h3>
                      <p className="text-white/70 text-xs truncate">{mod.description}</p>
                    </div>
                    {!hasLessons
                      ? <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">În curând</span>
                      : pct === 100
                      ? <CheckCircle className="w-5 h-5 text-white"/>
                      : <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"/>
                    }
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span>{s.done}/{s.total} lecții finalizate</span>
                      <span className="font-bold text-indigo-600">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${bg} transition-all`} style={{ width: `${pct}%` }}/>
                    </div>
                    {s.inProgress > 0 && (
                      <p className="text-xs text-amber-600 mt-1.5 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3"/> {s.inProgress} în curs
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {modal && <AntrenamentModal modules={modules} onClose={() => setModal(false)}/>}
    </div>
  );
}
