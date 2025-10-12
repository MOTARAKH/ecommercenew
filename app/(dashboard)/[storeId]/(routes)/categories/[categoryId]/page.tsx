import prismadb from "@/lib/prismadb";
import { CategoryForm} from "./components/category-form";

export const runtime = "nodejs";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{categoryId: string, storeId: string }>;
}) {
  const { categoryId } = await params; // 👈 لازم await

  const category = await prismadb.category.findFirst({
    where: { id: categoryId },
  });

  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId: (await params).storeId 
    }
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category ?? null} />
      </div>
    </div>
  );
}
