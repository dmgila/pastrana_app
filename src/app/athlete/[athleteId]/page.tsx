export const dynamic = "force-dynamic";

import Link from "next/link";
import { addWeeks, format, parseISO, subWeeks } from "date-fns";
import { AppShell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AthleteWorkoutCard } from "@/features/athlete/components/workout-card";
import { getAthleteWeekData } from "@/features/athlete/data";
import { toDateInputValue } from "@/lib/date";

export default async function AthletePage({
  params,
  searchParams,
}: {
  params: Promise<{ athleteId: string }>;
  searchParams: Promise<{ weekStart?: string }>;
}) {
  const { athleteId } = await params;
  const query = await searchParams;
  const data = await getAthleteWeekData(athleteId, query.weekStart);
  const weekDate = parseISO(toDateInputValue(new Date(data.weekStart)));

  return (
    <AppShell className="gap-4">
      <Card className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Athlete view</p>
          <h1 className="mt-2 text-2xl font-semibold">{data.athlete?.displayName ?? "Atleta"}</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{data.weekLabel}</p>
        </div>

        <div className="flex items-center justify-between rounded-3xl bg-[color:var(--surface-strong)] p-3">
          <Link href={`/athlete/${athleteId}?weekStart=${format(subWeeks(weekDate, 1), "yyyy-MM-dd")}`}>
            <Button variant="ghost" type="button">
              Anterior
            </Button>
          </Link>
          <p className="text-sm font-semibold">{format(weekDate, "d MMM yyyy")}</p>
          <Link href={`/athlete/${athleteId}?weekStart=${format(addWeeks(weekDate, 1), "yyyy-MM-dd")}`}>
            <Button variant="ghost" type="button">
              Siguiente
            </Button>
          </Link>
        </div>
      </Card>

      {data.days.length ? (
        data.days.map((day) => <AthleteWorkoutCard key={day.workoutId} athleteId={athleteId} day={day} />)
      ) : (
        <Card>
          <p className="text-sm text-[color:var(--muted)]">No hay entrenamientos publicados para esta semana.</p>
        </Card>
      )}
    </AppShell>
  );
}
