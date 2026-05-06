import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const { messages, taskQuestion, taskOptions } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: "AI-ul nu este configurat. Adaugă ANTHROPIC_API_KEY în .env pentru a activa asistentul.",
    });
  }

  const systemPrompt = `Ești un asistent educațional prietenos pentru o platformă de învățat programare.
Ajuți studenții să înțeleagă concepte, dai indicii și explicații, dar NU dai direct răspunsul la probleme.
Întrebarea curentă este: "${taskQuestion}"
Opțiunile sunt: ${taskOptions?.join(", ") || "N/A"}
Răspunde în română, concis și clar.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ reply: "Eroare la conectarea cu AI-ul. Încearcă din nou." });
  }

  const data = await response.json();
  return NextResponse.json({ reply: data.content[0].text });
}
