import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[0_10px_30px_rgba(146,64,14,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
