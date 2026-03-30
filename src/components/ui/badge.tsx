import { cn } from "@/lib/utils";
import { DayStatus } from "@/types/domain";

const statusMap: Record<DayStatus, string> = {
  DRAFT: "bg-stone-200 text-stone-700",
  PUBLISHED: "bg-amber-100 text-amber-900",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  SKIPPED: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: { status: DayStatus }) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]", statusMap[status])}>
      {status.toLowerCase()}
    </span>
  );
}
