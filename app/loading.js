export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"/>
        <p className="text-indigo-400 font-semibold text-sm animate-pulse">Se încarcă...</p>
      </div>
    </div>
  );
}
