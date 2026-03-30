import Link from "next/link";
import { addWeeks, format, parseISO, subWeeks } from "date-fns";
import { AthleteSummary } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandLockup } from "@/components/brand/brand-lockup";

type Props = {
  athletes: AthleteSummary[];
  selectedAthleteId?: string;
  weekStart: string;
};

export function AthletePicker({ athletes, selectedAthleteId, weekStart }: Props) {
  const weekDate = parseISO(weekStart);

  return (
    <Card className="space-y-4">
      <div className="space-y-3">
        <BrandLockup compact subtitle="Coach workspace" />
        <h1 className="text-2xl font-semibold">Plan semanal</h1>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-[color:var(--muted)]">Selecciona atleta</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {athletes.map((athlete) => {
            const active = athlete.id === selectedAthleteId;

            return (
              <Link
                key={athlete.id}
                href={`/coach?athleteId=${athlete.id}&weekStart=${weekStart}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  active ? "bg-[color:var(--accent)] text-white" : "bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
                }`}
              >
                {athlete.displayName}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-3xl bg-[color:var(--surface-strong)] p-3">
        <Link href={`/coach?athleteId=${selectedAthleteId}&weekStart=${format(subWeeks(weekDate, 1), "yyyy-MM-dd")}`}>
          <Button variant="ghost" type="button">
            Anterior
          </Button>
        </Link>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">Semana</p>
          <p className="font-semibold">{format(weekDate, "d MMM yyyy")}</p>
        </div>
        <Link href={`/coach?athleteId=${selectedAthleteId}&weekStart=${format(addWeeks(weekDate, 1), "yyyy-MM-dd")}`}>
          <Button variant="ghost" type="button">
            Siguiente
          </Button>
        </Link>
      </div>
    </Card>
  );
}