import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_USER_ID = "local-user";

export async function POST(request) {
  try {
    const body = await request.json();
    const { moduleSlug, difficulty, count, scope } = body;
    // scope: "completed-current" | "completed-all" | "all-lessons"
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
      // Fallback: serve random tasks from DB if no AI key
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

    // AI-generate fresh questions
    const lessonTitles = [...new Set(lessonsForContext.map(l => `${l.module.title} — ${l.title}`))];
    const moduleNames = [...new Set(lessonsForContext.map(l => l.module.title))];

    const diffText = difficulty === "all" ? "varietate (ușor/mediu/greu)" : difficulty;

    const systemPrompt = `Ești un creator de probleme pentru o platformă de învățat programare. Generezi probleme NOI, DIFERITE de cele standard, dar pe aceleași concepte.

Reguli stricte:
- Răspunzi DOAR cu JSON valid, fără markdown, fără explicații în afara JSON-ului
- Format: array de obiecte cu câmpurile: question, options (array de 4 string-uri), answer (unul din options), explanation, difficulty (easy/medium/hard), name (titlu scurt 2-4 cuvinte)
- Întrebările trebuie să fie ÎN LIMBA ROMÂNĂ
- Întrebările trebuie să acopere conceptele din lecțiile date, dar formulate diferit (cazuri practice, debugging, output, sintaxă)
- Variază tipurile: "Ce afișează codul X?", "Care e sintaxa corectă pentru Y?", "Identifică eroarea în Z", etc.
- Opțiunile trebuie să fie plauzibile (greșeli comune, nu absurde)`;

    const userPrompt = `Generează ${count} probleme noi de tip multiple-choice pentru un student care a învățat:

Module: ${moduleNames.join(", ")}
Lecții: ${lessonTitles.slice(0, 30).join("; ")}

Dificultate: ${diffText}

Returnează DOAR array-ul JSON cu cele ${count} probleme.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Eroare la generare. Încearcă din nou." }, { status: 500 });
    }

    const data = await response.json();
    let text = data.content[0].text.trim();
    // Strip markdown if present
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Răspuns AI invalid. Încearcă din nou." }, { status: 500 });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: "Format invalid de la AI." }, { status: 500 });
    }

    // Add fake IDs and lesson context
    const enriched = questions.map((q, i) => ({
      id: `ai-${Date.now()}-${i}`,
      number: i + 1,
      name: q.name || `Problema ${i + 1}`,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
      lesson: { title: "Generat AI" },
    }));

    return NextResponse.json(enriched);
  } catch (e) {
    return NextResponse.json({ error: "Eroare server: " + e.message }, { status: 500 });
  }
}
