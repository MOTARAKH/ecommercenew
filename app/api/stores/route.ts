import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

const BodySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();          
    const { name } = BodySchema.parse(body);

    const store = await prismadb.store.create({
      data: { name: name.trim(), userId },
      select: { id: true },
    });

    return NextResponse.json(store, { status: 201 }); 
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new NextResponse("Invalid body", { status: 400 });
    }
    console.error("[STORES_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
