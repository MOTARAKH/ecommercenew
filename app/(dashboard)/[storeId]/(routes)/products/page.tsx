// app/(dashboard)/[storeId]/(routes)/billboards/page.tsx
import prismadb from "@/lib/prismadb";
import {format} from "date-fns";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./[billboardId]/components/columns";

export const runtime = "nodejs";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params; // ✅ لازم await

  const products = await prismadb.product.findMany({
    where: { storeId },
    include:{
      category:true,
      size:true,
      color:true,

    },
    orderBy: { createdAt: "desc" },
  });


  const formattedProducts: BillboardColumn[]= products.map((item)=>({
    id: item.id,
    name:item.name,
    isFeatured:item.isFeatured,
    isArchived:item.isArchived,
    price:item.price,
    createdAt:format(item.createdAt,"MMMM do , yyyy ")

  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedProducts} /> {/* ✅ الاسم مطابق */}
      </div>
    </div>
  );
}
