import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { messages, taskQuestion, taskOptions, lessonTitle } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: "AI-ul nu este configurat. Adaugă ANTHROPIC_API_KEY în .env pentru a activa asistentul.",
    });
  }

  const hasTask = taskQuestion && taskQuestion.length > 10;
  const optionsText = Array.isArray(taskOptions) && taskOptions.length > 0
    ? taskOptions.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")
    : null;

  const systemPrompt = `Ești un mentor de programare prietenos, direct și eficient pe o platformă educațională.

${hasTask ? `Contextul curent:
- Lecția: "${lessonTitle || "necunoscut"}"
- Întrebarea la care lucrează studentul:
"${taskQuestion}"
${optionsText ? `- Opțiunile disponibile:\n${optionsText}` : ""}` : `Lecția curentă: "${lessonTitle || "programare generală"}"`}

Cum răspunzi:
- EXPLICI conceptul din spatele întrebării fără să dai direct litera/opțiunea corectă
- Dai o analogie scurtă din viața reală dacă ajută (ex: "variabilele sunt ca niște cutii cu etichete")
- Dacă studentul e complet blocat și cere insistent, poți da un hint progresiv ("gândește-te la ce face operatorul ===")
- Includezi un exemplu scurt de cod când e relevant (în backticks)
- Răspunsurile: scurte și clare, max 4-5 propoziții + eventual un snippet
- Ton: prietenos, ca un coleg mai experimentat, nu ca un profesor formal
- Răspunzi ÎNTOTDEAUNA în română
- Dacă studentul întreabă ceva complet în afara subiectului lecției, răspunzi scurt și îl redirectezi la subiect
- Nu repeta niciodată "Nu pot să îți dau răspunsul direct" — explică conceptul și lasă studentul să deducă`;

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
        max_tokens: 700,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: "Eroare la conectarea cu AI-ul. Încearcă din nou." });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.content[0].text });
  } catch {
    return NextResponse.json({ reply: "Eroare de rețea. Încearcă din nou." });
  }
}
