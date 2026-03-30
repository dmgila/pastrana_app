import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
  subtitle?: string;
};

export function BrandLockup({ className, compact = false, subtitle = "by Jose Cordoba Pastrana" }: Props) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[22px] bg-white/80 p-1 shadow-[0_10px_30px_rgba(146,64,14,0.18)] ring-1 ring-[color:var(--line)]",
          compact ? "h-12 w-12" : "h-16 w-16",
        )}
      >
        <Image
          src="/pastrana_round.png"
          alt="Logo de PastranaRun App"
          fill
          className="object-contain p-1"
          sizes={compact ? "48px" : "64px"}
          priority
        />
      </div>

      <div>
        <p className={cn("font-semibold tracking-[0.02em]", compact ? "text-lg" : "text-2xl")}>PastranaRun App</p>
        <p className={cn("text-[color:var(--muted)]", compact ? "text-xs" : "text-sm")}>{subtitle}</p>
      </div>
    </div>
  );
}