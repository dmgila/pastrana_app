import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-12 pt-6", className)}>
      {children}
    </main>
  );
}
