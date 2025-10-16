// app/api/stores/[storeId]/billboards/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

const CreateSizeSchema = z.object({
  name: z.string().min(1, "name is required"),
  value: z.string().min(1, "value is required"),
});

// POST /api/stores/:storeId/billboards
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const json = await req.json();
    const parsed = CreateSizeSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const { name, value } = parsed.data;

    // تأكد إن المتجر يخص المستخدم
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const color = await prismadb.color.create({
      data: { name, value, storeId: params.storeId },
    });

    return NextResponse.json(color, { status: 201 });
  } catch (err) {
    console.error("[COLORS_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// GET /api/stores/:storeId/billboards
export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store id is required", { status: 400 });

    const colors = await prismadb.color.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, value: true, storeId: true },
    });

    return NextResponse.json(colors);
  } catch (err) {
    console.error("[COLORS_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
