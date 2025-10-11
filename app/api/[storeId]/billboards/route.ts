// app/api/stores/[storeId]/billboards/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

const CreateBillboardSchema = z.object({
  label: z.string().min(1, "label is required"),
  imageUrl: z.string().min(1, "imageUrl is required"),
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
    const parsed = CreateBillboardSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 400 });
    }
    const { label, imageUrl } = parsed.data;

    // تأكد إن المتجر يخص المستخدم
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.create({
      data: { label, imageUrl, storeId: params.storeId },
    });

    return NextResponse.json(billboard, { status: 201 });
  } catch (err) {
    console.error("[BILLBOARDS_POST]", err);
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

    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, imageUrl: true, storeId: true },
    });

    return NextResponse.json(billboards);
  } catch (err) {
    console.error("[BILLBOARDS_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
