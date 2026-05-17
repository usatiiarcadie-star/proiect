import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_USER_ID = "local-user";

export async function POST(request) {
  try {
    const body = await request.json();
    const { moduleSlug, difficulty, count, scope } = body;
    const effectiveScope = scope || "completed-current";

    let lessonsForContext = [];

    if (effectiveScope === "completed-current") {
      const mod = await prisma.module.findUnique({ where: { slug: moduleSlug } });
      if (!mod) return NextResponse.json({ error: "Modul negăsit." }, { status: 404 });
      const completed = await prisma.lessonProgress.findMany({
        where: { userId: DEFAULT_USER_ID, completed: true },
        select: { lessonId: true },
      });
      const completedIds = completed.map(p => p.lessonId);
      lessonsForContext = await prisma.lesson.findMany({
        where: { moduleId: mod.id, id: { in: completedIds } },
        select: { id: true, title: true, module: { select: { title: true, slug: true } } },
      });
    } else if (effectiveScope === "completed-all") {
      const completed = await prisma.lessonProgress.findMany({
        where: { userId: DEFAULT_USER_ID, completed: true },
        select: { lessonId: true },
      });
      const completedIds = completed.map(p => p.lessonId);
      lessonsForContext = await prisma.lesson.findMany({
        where: { id: { in: completedIds } },
        select: { id: true, title: true, module: { select: { title: true, slug: true } } },
      });
    } else if (effectiveScope === "all-lessons") {
      const mod = moduleSlug ? await prisma.module.findUnique({ where: { slug: moduleSlug } }) : null;
      lessonsForContext = await prisma.lesson.findMany({
        where: mod ? { moduleId: mod.id } : {},
        select: { id: true, title: true, module: { select: { title: true, slug: true } } },
      });
    }

    if (lessonsForContext.length === 0) {
      return NextResponse.json({ error: "Nu există lecții pentru acest scope." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const allTasks = await prisma.task.findMany({
        where: {
          lessonId: { in: lessonsForContext.map(l => l.id) },
          difficulty: difficulty === "all" ? undefined : difficulty,
        },
        include: { lesson: { select: { title: true } } },
      });
      const shuffled = allTasks.sort(() => Math.random() - 0.5);
      return NextResponse.json(shuffled.slice(0, Math.min(count, shuffled.length)));
    }

    const lessonTitles = [...new Set(lessonsForContext.map(l => `${l.module.title} — ${l.title}`))];
    const moduleNames = [...new Set(lessonsForContext.map(l => l.module.title))];
    const diffText = difficulty === "all" ? "mixtă (ușor/mediu/greu)" : difficulty;

    // Random seed so AI generates different questions each run
    const seed = Math.random().toString(36).slice(2, 10);

    const systemPrompt = `Ești un creator expert de exerciții practice pentru o platformă de programare. Misiunea ta: probleme PROASPETE, scenarii din viața reală, NICIODATĂ formularile clasice din lecții.

TIPURI OBLIGATORII de întrebări (variază-le în fiecare sesiune):
1. SCENARIU PRACTIC — "Construiești un site pentru o pizzerie și trebuie să... Ce folosești?"
2. DEBUG — "Codul de mai jos returnează NaN. Care e greșeala?" (include snippet de cod scurt în întrebare)
3. OUTPUT — "Ce afișează în consolă / browser codul următor?" (include cod scurt)
4. COMPARAȚIE APLICATĂ — "Site-ul tău are nevoie de X. Care variantă e mai potrivită și de ce?"
5. EROARE DE JUNIOR — "Un coleg a scris asta și primește eroare. Ce a greșit?"
6. BEST PRACTICE — "Dintre variantele de mai jos, care respectă bunele practici pentru Y?"

Scenarii de folosit (alege DIFERIT pentru fiecare întrebare):
pizzerie, cafenea, magazin online, blog personal, aplicație fitness, dashboard admin, site știri, app rețete, portfolio freelancer, platformă cursuri, app to-do, site imobiliare, magazin de haine, aplicație bancară, site restaurant

Reguli absolute:
- Răspunzi DOAR cu JSON valid, zero text în afara JSON-ului
- Format exact: [{ "question": "...", "options": ["opt1","opt2","opt3","opt4"], "answer": "opt_corect", "explanation": "...", "difficulty": "easy|medium|hard", "name": "titlu 2-4 cuvinte" }]
- Toate textele în ROMÂNĂ
- options: exact 4, toate plauzibile (greșeli reale, nu absurde)
- answer: copiată exact dintr-una din options
- Snippetele de cod în întrebare: scurte (max 5 linii), cu backtick inline sau pe linii noi
- NICIODATĂ același tip de întrebare de două ori consecutiv`;

    const userPrompt = `Generează ${count} probleme VARIATE (seed: ${seed}) pentru un student care stăpânește:

Module: ${moduleNames.join(", ")}
Lecții: ${lessonTitles.slice(0, 25).join("; ")}

Cerințe suplimentare:
- Cel puțin ${Math.ceil(count * 0.6)} probleme să fie scenarii practice sau debug/output
- Fiecare problemă cu context diferit (nu 2 probleme din același scenariu)
- Dificultate: ${diffText}
- Dacă modulele includ JavaScript/React/Next.js: include întrebări cu cod JS real
- Dacă includ CSS/Tailwind: include întrebări vizuale ("cum arată elementul?")

Returnează STRICT array-ul JSON, nimic altceva.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Eroare la generare. Încearcă din nou." }, { status: 500 });
    }

    const data = await response.json();
    let text = data.content[0].text.trim();
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    // Sometimes the model wraps in object instead of array
    if (text.startsWith("{")) {
      const obj = JSON.parse(text);
      const key = Object.keys(obj).find(k => Array.isArray(obj[k]));
      text = key ? JSON.stringify(obj[key]) : text;
    }

    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Răspuns AI invalid. Încearcă din nou." }, { status: 500 });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: "Format invalid de la AI." }, { status: 500 });
    }

    // Validate and clean each question
    const enriched = questions
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2 && q.answer)
      .map((q, i) => ({
        id: `ai-${Date.now()}-${i}`,
        number: i + 1,
        name: q.name || `Problema ${i + 1}`,
        question: q.question,
        options: q.options.slice(0, 4),
        answer: q.answer,
        explanation: q.explanation || `Răspunsul corect este: ${q.answer}`,
        difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium",
        lesson: { title: "Generat AI" },
      }));

    if (enriched.length === 0) {
      return NextResponse.json({ error: "AI-ul nu a generat probleme valide. Încearcă din nou." }, { status: 500 });
    }

    return NextResponse.json(enriched);
  } catch (e) {
    return NextResponse.json({ error: "Eroare server: " + e.message }, { status: 500 });
  }
}
