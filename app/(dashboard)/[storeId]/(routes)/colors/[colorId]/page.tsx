// app/(dashboard)/[storeId]/(routes)/sizes/[sizeId]/page.tsx
import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";
export const runtime = "nodejs";

export default async function ColorPage({
  params,
}: {
  params: Promise<{ colorId: string }>;
}) {
  const {colorId} = await params;

  // ✅ لا تستخدم select حتى يرجّع   كامل (يطابق نوع الـ props)
  const color = await prismadb.color.findFirst({
    where: { id: colorId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color ?? null} />
      </div>
    </div>
  );
}
