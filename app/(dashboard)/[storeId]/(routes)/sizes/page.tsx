// app/(dashboard)/[storeId]/(routes)/billboards/page.tsx
import prismadb from "@/lib/prismadb";
import {format} from "date-fns";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./[sizeId]/components/columns";

export const runtime = "nodejs";

export default async function SizePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params; // ✅ لازم await

  const sizes = await prismadb.size.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });


  const formattedSize: SizeColumn[]= sizes.map((item)=>({
    id: item.id,
    name:item.name,
    value:item.value,
    createdAt:format(item.createdAt,"MMMM do , yyyy ")

  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSize} /> {/* ✅ الاسم مطابق */}
      </div>
    </div>
  );
}
