import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

export const runtime = "nodejs";

export default async function BillboardPage({
  params,
}: {
  params: Promise<{ storeId: string; billboardId: string }>;
}) {
  const { storeId, billboardId } = await params; // 👈 لازم await

  const billboard = await prismadb.billboard.findFirst({
    where: { id: billboardId, storeId },
    select: { id: true, label: true, imageUrl: true },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard ?? null} />
      </div>
    </div>
  );
}
