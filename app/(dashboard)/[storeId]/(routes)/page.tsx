import { SizeForm } from "./sizes/[sizeId]/components/size-form";
export const runtime = "nodejs";

export default async function NewSizePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  await params; // بس لنلتزم بقواعد Next 15
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={null} />
      </div>
    </div>
  );
}
