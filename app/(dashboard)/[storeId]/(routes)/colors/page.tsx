// app/(dashboard)/[storeId]/(routes)/billboards/page.tsx
import prismadb from "@/lib/prismadb";
import {format} from "date-fns";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./[colorId]/components/columns";
export const runtime = "nodejs";

export default async function ColorPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params; // ✅ لازم await

  const colors = await prismadb.color.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });


  const formattedColors: ColorColumn[]= colors.map((item)=>({
    id: item.id,
    name:item.name,
    value:item.value,
    createdAt:format(item.createdAt,"MMMM do , yyyy ")

  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} /> {/* ✅ الاسم مطابق */}
      </div>
    </div>
  );
}
