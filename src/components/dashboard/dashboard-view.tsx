"use client";

import { useFamily } from "@/context/family-context";
import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardView({ children }: { children: React.ReactNode }) {
  const { isLoading } = useFamily();
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-[180px]" />
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </header>
            <main className="flex flex-1 items-center justify-center p-4 md:p-8">
                <Skeleton className="h-[500px] w-full max-w-4xl" />
            </main>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
