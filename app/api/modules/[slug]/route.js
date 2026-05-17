import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const mod = await prisma.module.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: { id: true, title: true, slug: true, order: true },
        },
      },
    });
    if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mod);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
