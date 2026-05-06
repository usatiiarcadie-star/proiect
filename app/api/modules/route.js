import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, slug: true, order: true },
        },
      },
    });
    return NextResponse.json(modules);
  } catch {
    return NextResponse.json([]);
  }
}
