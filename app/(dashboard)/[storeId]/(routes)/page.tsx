// app/(dashboard)/[storeId]/(routes)/page.tsx
import prismadb from "@/lib/prismadb";

export const runtime = "nodejs";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ storeId: string }>; // params صارت Promise
}) {
  const { storeId } = await params;     // ✅ انتظر params مرّة وحدة

  // إذا id مفتاح أساسي، استخدم findUnique
  const store = await prismadb.store.findUnique({
    where: { id: storeId },
    select: { name: true },
  });

  return <div>Active Store: {store?.name ?? "—"}</div>;
}
