import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      tasks: { orderBy: { number: "asc" } },
      theory: { orderBy: { order: "asc" } },
      module: { select: { id: true, title: true, slug: true } },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [prev, next] = await Promise.all([
    prisma.lesson.findFirst({
      where: { moduleId: lesson.moduleId, order: { lt: lesson.order } },
      orderBy: { order: "desc" },
      select: { id: true, title: true },
    }),
    prisma.lesson.findFirst({
      where: { moduleId: lesson.moduleId, order: { gt: lesson.order } },
      orderBy: { order: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  return NextResponse.json({ ...lesson, prevLesson: prev ?? null, nextLesson: next ?? null });
}
