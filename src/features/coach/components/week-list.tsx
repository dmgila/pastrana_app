import { publishDraftWeek } from "@/features/coach/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { CoachDayCard } from "./day-card";
import { CoachDashboardData } from "../types";

export function CoachWeekList({ data }: { data: CoachDashboardData }) {
  if (!data.selectedAthlete) {
    return null;
  }

  const selectedAthlete = data.selectedAthlete;

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] bg-[color:var(--accent-strong)] p-4 text-white">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-100">Atleta</p>
        <h2 className="mt-2 text-xl font-semibold">{selectedAthlete.displayName}</h2>
        <p className="mt-1 text-sm text-amber-100">{data.weekLabel}</p>
        <form action={publishDraftWeek} className="mt-4">
          <input type="hidden" name="athleteProfileId" value={selectedAthlete.id} />
          <input type="hidden" name="weekStart" value={data.weekStart} />
          <SubmitButton
            className="w-full bg-white !text-[color:var(--accent-strong)]"
            idleLabel="Publicar todos los borradores"
            pendingLabel="Publicando semana..."
          />
        </form>
      </div>

      {data.days.map((day) => (
        <CoachDayCard
          key={day.dayIndex}
          athleteProfileId={selectedAthlete.id}
          weekStart={data.weekStart}
          day={day}
          templates={data.templates}
        />
      ))}
    </section>
  );
}
