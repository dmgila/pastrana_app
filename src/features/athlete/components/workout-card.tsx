import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { parseWorkoutStructure } from "@/lib/workout-structure";
import { DayCardItem } from "@/types/domain";

export function AthleteWorkoutCard({ athleteId, day }: { athleteId: string; day: DayCardItem }) {
  const blocks = parseWorkoutStructure(day.structure).slice(0, 3);
  const showTitle = Boolean(day.title && day.title !== "Sesion compuesta");

  return (
    <Link href={`/athlete/${athleteId}/workouts/${day.workoutId}`}>
      <Card className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{day.dateLabel}</p>
            {showTitle ? <h3 className="mt-1 text-lg font-semibold">{day.title}</h3> : null}
          </div>
          {day.status ? <StatusBadge status={day.status} /> : null}
        </div>

        {blocks.length ? (
          <div className="space-y-2 rounded-3xl bg-[color:var(--surface-strong)] p-3 text-sm">
            {blocks.map((block) => (
              <p key={block}>{block}</p>
            ))}
          </div>
        ) : null}

        <p className="text-sm font-medium">{day.durationMinutes ? `${day.durationMinutes} km` : "Duracion abierta"}</p>

        {day.feedback ? (
          <div className="rounded-3xl bg-[color:var(--surface-strong)] p-3 text-sm">
            <p>RPE {day.feedback.rpe}</p>
            <p className="mt-1 text-[color:var(--muted)]">{day.feedback.comment || "Sin comentario"}</p>
          </div>
        ) : null}
      </Card>
    </Link>
  );
}
