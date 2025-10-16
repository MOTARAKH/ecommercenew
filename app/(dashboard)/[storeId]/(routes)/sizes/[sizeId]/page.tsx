// app/(dashboard)/[storeId]/(routes)/sizes/[sizeId]/page.tsx
import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";
export const runtime = "nodejs";

export default async function SizePage({
  params,
}: {
  params: Promise<{ storeId: string; sizeId: string }>;
}) {
  const { storeId, sizeId } = await params;

  // ✅ لا تستخدم select حتى يرجّع Size كامل (يطابق نوع الـ props)
  const size = await prismadb.size.findFirst({
    where: { id: sizeId, storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size ?? null} />
      </div>
    </div>
  );
}
