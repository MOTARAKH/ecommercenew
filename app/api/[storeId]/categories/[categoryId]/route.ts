// app/api/stores/[storeId]/billboards/[billboardId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

/**
 * GET /api/stores/:storeId/billboards/:billboardId
 * يرجّع بيانات البيلبورد
 */
export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("category id is required", { status: 400 });
    }

    const category = await prismadb.category.findFirst({
      where: { id: params.categoryId},
      
    });

    if (!category) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}

/**
 * PATCH /api/stores/:storeId/billboards/:billboardId
 * يعدّل البيلبورد (مع تحقّق ملكية المتجر)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    const { label, imageUrl } = await req.json();
    if (!label?.trim()) return new NextResponse("label is required", { status: 400 });
    if (!imageUrl?.trim()) return new NextResponse("image url is required", { status: 400 });

    // تحقّق ملكية المتجر
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const updated = await prismadb.billboard.updateMany({
      where: { id: params.billboardId, storeId: params.storeId },
      data: { label: label.trim(), imageUrl: imageUrl.trim() },
    });

    if (updated.count === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ updated: updated.count }, { status: 200 });
    // بديل: رجّع الكائن المعدّل:
    // const b = await prismadb.billboard.update({ where: { id: params.billboardId }, data: {...} });
    // return NextResponse.json(b);
  } catch (error) {
    console.error("[BILLBOARD_PATCH]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}

/**
 * DELETE /api/stores/:storeId/billboards/:billboardId
 * يحذف البيلبورد (مع تحقّق ملكية المتجر)
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    // تحقّق ملكية المتجر
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const deleted = await prismadb.billboard.deleteMany({
      where: { id: params.billboardId, storeId: params.storeId },
    });

    if (deleted.count === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ deleted: deleted.count }, { status: 200 });
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
