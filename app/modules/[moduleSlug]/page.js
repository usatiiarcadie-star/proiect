"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from "lucide-react";

const MOD_BG = {
  python: "from-blue-500 to-cyan-400", javascript: "from-yellow-400 to-orange-400",
  html: "from-orange-500 to-red-500", css: "from-blue-500 to-indigo-600",
  tailwind: "from-cyan-400 to-teal-500", react: "from-sky-400 to-blue-500",
  "nextjs-frontend": "from-gray-700 to-gray-900", "nextjs-backend": "from-slate-600 to-slate-800",
  c: "from-purple-500 to-violet-600", cpp: "from-violet-500 to-pink-600",
  csharp: "from-indigo-500 to-purple-700", java: "from-red-500 to-orange-600",
  cybersecurity: "from-emerald-500 to-green-700",
  sql: "from-blue-600 to-cyan-700", php: "from-violet-600 to-indigo-700",
};

export default function ModulePage() {
  const { moduleSlug } = useParams();
  const [module, setModule] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/modules"), fetch("/api/progress")])
      .then(([m, p]) => Promise.all([m.json(), p.json()]))
      .then(([mods, prog]) => {
        setModule(mods.find(m => m.slug === moduleSlug) || null);
        setProgress(Array.isArray(prog) ? prog : []);
      })
      .finally(() => setLoading(false));
  }, [moduleSlug]);

  function getStatus(id) {
    const p = progress.find(pr => pr.lessonId === id);
    if (!p) return "none";
    if (p.completed) return "done";
    if (p.completedTasks?.length > 0) return "progress";
    return "none";
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="text-indigo-400 animate-pulse font-semibold">Se încarcă...</div>
    </div>
  );
  if (!module) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/" className="text-indigo-600 flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> Acasă</Link>
    </div>
  );

  const bg = MOD_BG[moduleSlug] || "from-indigo-500 to-purple-600";
  const done = module.lessons.filter(l => getStatus(l.id) === "done").length;
  const pct = module.lessons.length > 0 ? Math.round((done / module.lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <header className={`bg-gradient-to-r ${bg} text-white shadow-lg`}>
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-white/70 hover:text-white transition-colors p-1">
              <ChevronLeft className="w-5 h-5"/>
            </Link>
            <div className="flex-1">
              <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Modul</p>
              <h1 className="text-xl font-black">{module.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Progres</p>
              <p className="text-2xl font-black text-yellow-300">{pct}%</p>
              <p className="text-white/60 text-xs">{done}/{module.lessons.length} lecții</p>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="h-2 rounded-full bg-yellow-300 transition-all" style={{ width: `${pct}%` }}/>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {module.lessons.map((lesson, idx) => {
            const status = getStatus(lesson.id);
            return (
              <Link key={lesson.id} href={`/modules/${moduleSlug}/lessons/${lesson.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3 group border-2 border-transparent hover:border-indigo-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all
                  ${status === "done" ? "bg-emerald-500 text-white"
                    : status === "progress" ? "bg-amber-400 text-white"
                    : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white"}`}>
                  {status === "done" ? <CheckCircle className="w-5 h-5"/> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-700 transition-colors truncate">
                    {lesson.title}
                  </p>
                  <div className="mt-1">
                    {status === "done" && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/> Gata
                      </span>
                    )}
                    {status === "progress" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3"/> În curs
                      </span>
                    )}
                    {status === "none" && (
                      <span className="text-xs text-slate-400">Neînceput</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"/>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
