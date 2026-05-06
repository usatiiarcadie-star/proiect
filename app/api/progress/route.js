import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_USER_ID = "local-user";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: DEFAULT_USER_ID, lessonId } },
      });
      return NextResponse.json(progress || null);
    }

    const allProgress = await prisma.lessonProgress.findMany({
      where: { userId: DEFAULT_USER_ID },
    });
    return NextResponse.json(allProgress);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { lessonId, completedTasks, wrongTasks, currentTaskIdx, currentTheoryIdx, completed } = body;

    const data = {};
    if (completedTasks !== undefined) data.completedTasks = completedTasks;
    if (wrongTasks !== undefined) data.wrongTasks = wrongTasks;
    if (currentTaskIdx !== undefined) data.currentTaskIdx = currentTaskIdx;
    if (currentTheoryIdx !== undefined) data.currentTheoryIdx = currentTheoryIdx;
    if (completed !== undefined) data.completed = completed;

    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: DEFAULT_USER_ID, lessonId } },
      update: data,
      create: {
        userId: DEFAULT_USER_ID,
        lessonId,
        completedTasks: completedTasks || [],
        wrongTasks: wrongTasks || [],
        currentTaskIdx: currentTaskIdx ?? 0,
        currentTheoryIdx: currentTheoryIdx ?? 0,
        completed: completed ?? false,
      },
    });

    return NextResponse.json(progress);
  } catch (e) {
    return NextResponse.json({ error: "DB error: " + e.message }, { status: 503 });
  }
}
