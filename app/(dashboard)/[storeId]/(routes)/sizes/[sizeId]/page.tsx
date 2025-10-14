import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";
export const runtime = "nodejs";

export default async function EditSizePage({
  params,
}: {
  params: Promise<{ storeId: string; sizeId: string }>;
}) {
  const { storeId, sizeId } = await params;

  // ✅ جيب الساير بالفلاتر الصح + الحقول اللي بدك ياها
  const size = await prismadb.size.findFirst({
    where: { id: sizeId, storeId },
    select: { id: true, name: true, value: true, storeId: true },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size ?? null} />
      </div>
    </div>
  );
}
