// app/(dashboard)/[storeId]/(routes)/billboards/page.tsx
import prismadb from "@/lib/prismadb";
import {format} from "date-fns";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./[categoryId]/components/columns";

export const runtime = "nodejs";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params; // ✅ لازم await

  const categories = await prismadb.category.findMany({
    where: { storeId },
    include:{
      billboard:true,
    },

    orderBy: { createdAt: "desc" },
  });


  const formattedCategories: CategoryColumn[]= categories.map((item)=>({
    id: item.id,
    name:item.name,
    billboardLabel: item.billboard.label,
    createdAt:format(item.createdAt,"MMMM do , yyyy ")

  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} /> {/* ✅ الاسم مطابق */}
      </div>
    </div>
  );
}

