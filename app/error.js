"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Ceva a mers prost</h2>
        <p className="text-slate-500 text-sm mb-6">
          {error?.message?.includes("fetch") ? "Probleme de conexiune. Verifică internetul." : "A apărut o eroare neașteptată."}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity">
            Încearcă din nou
          </button>
          <Link href="/"
            className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
            Acasă
          </Link>
        </div>
      </div>
    </div>
  );
}
