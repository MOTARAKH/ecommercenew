// app/api/stores/[storeId]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

// PATCH /api/stores/[storeId]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ storeId: string }> } 
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    const { name } = await req.json();     
    if (!name?.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const { storeId } = await ctx.params;     
    if (!storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const result = await prismadb.store.updateMany({
      where: { id: storeId, userId },
      data: { name: name.trim() },            
    });

    if (result.count === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ updated: result.count }, { status: 200 });
  } catch (error) {
    console.error("[STORE_PATCH]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}


export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }   // ⬅️ params sync (بدون await)
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("unauthenticated", { status: 401 });

    if (!params.storeId) {
      return new NextResponse("store id is required", { status: 400 });
    }

    const result = await prismadb.store.deleteMany({
      where: { id: params.storeId, userId },    // ⬅️ الصح
    });

    if (result.count === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json({ deleted: result.count }, { status: 200 });
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("InternalError", { status: 500 });
  }
}
