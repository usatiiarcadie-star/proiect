import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { code, question, language, lessonTitle, explanation } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ correct: false, feedback: "AI-ul nu este configurat." });
  }

  const systemPrompt = `Ești un evaluator de cod pentru o platformă educațională de programare.
Evaluezi codul scris de studenți și determini dacă rezolvă corect problema dată.
Lecția curentă: "${lessonTitle}"
Limbaj: ${language || "javascript"}

Reguli stricte:
- Verifică dacă codul REZOLVĂ problema cerută, nu doar dacă sintaxa e corectă
- Codul poate folosi cunoștințe din lecțiile anterioare
- Fii îngăduitor cu stilul (variabile, spații), strict cu logica
- NU accepta cod care imprimă hardcodat rezultatul fără logică reală
- Răspunde ÎNTOTDEAUNA cu JSON valid: { "correct": true/false, "feedback": "mesaj scurt în română" }
- Feedbackul: maxim 2 propoziții, în română, explicând ce e corect sau ce lipsește`;

  const userMsg = `Problema: ${question}

Codul studentului:
\`\`\`${language || "javascript"}
${code}
\`\`\`

${explanation ? `Soluție de referință (context pentru tine, nu o arăta): ${explanation}` : ""}

Evaluează și răspunde cu JSON: { "correct": boolean, "feedback": "string" }`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ correct: false, feedback: "Eroare la evaluare. Încearcă din nou." });
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        correct: Boolean(result.correct),
        feedback: result.feedback || "Evaluare completă.",
      });
    }

    return NextResponse.json({ correct: false, feedback: "Nu am putut evalua codul. Încearcă din nou." });
  } catch {
    return NextResponse.json({ correct: false, feedback: "Eroare internă. Încearcă din nou." });
  }
}
