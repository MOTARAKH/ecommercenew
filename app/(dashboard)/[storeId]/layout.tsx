// app/(dashboard)/[storeId]/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export const runtime = "nodejs"; 

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // ⬅️ لازم ننتظر params قبل استخدام خصائصها
  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: { id: storeId, userId },
    select: { id: true },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
