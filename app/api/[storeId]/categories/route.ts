// app/api/stores/[storeId]/billboards/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

const CreateCategorySchema = z.object({
  name: z.string().min(1, "name is required"),
  billboardId: z.string().min(1, "billboard id is required"),
});

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
    const parsed = CreateCategorySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const { name,billboardId } = parsed.data;

    // تأكد إن المتجر يخص المستخدم
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.error("[CATEGORIES_POST]", err);
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

    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      select: { storeId: true },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("[CATEGORIES_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
