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
  { params }: { params: { sizeId: string; } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("size  id is required", { status: 400 });
    }

    const size = await prismadb.size.findFirst({
      where: { id: params.sizeId,},
      select: { id: true, name: true, value: true, storeId: true },
    });

    if (!size) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.error("[SIZE_GET]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}

/**
 * PATCH /api/stores/:storeId/billboards/:billboardId
 * يعدّل البيلبورد (مع تحقّق ملكية المتجر)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    const { name, value } = await req.json();
    if (!name?.trim()) return new NextResponse("name is required", { status: 400 });
    if (!value?.trim()) return new NextResponse("value is required", { status: 400 });

    // تحقّق ملكية المتجر
    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
      select: { id: true },
    });
    if (!store) return new NextResponse("Unauthorized", { status: 403 });

    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId, storeId: params.storeId },
      data: { name: name.trim(), value: value.trim() },
    });

    if (size.count === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ updated: size.count }, { status: 200 });
    // بديل: رجّع الكائن المعدّل:
    // const b = await prismadb.billboard.update({ where: { id: params.billboardId }, data: {...} });
    // return NextResponse.json(b);
  } catch (error) {
    console.error("[SIZE_PATCH]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}

/**
 * DELETE /api/stores/:storeId/billboards/:billboardId
 * يحذف البيلبورد (مع تحقّق ملكية المتجر)
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    const size = await prismadb.size.deleteMany({
      where: { id: params.sizeId, storeId: params.storeId },
    });

    if (size.count === 0) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ deleted: size.count }, { status: 200 });
  } catch (error) {
    console.error("[SIZE_DELETE]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
