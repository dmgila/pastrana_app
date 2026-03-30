import { saveWorkoutFeedback } from "@/features/athlete/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseWorkoutStructure } from "@/lib/workout-structure";
import { DayCardItem } from "@/types/domain";

export function FeedbackForm({ athleteId, workout }: { athleteId: string; workout: DayCardItem }) {
  const blocks = parseWorkoutStructure(workout.structure);

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold">{workout.dateLabel}</p>
        <h2 className="mt-1 text-2xl font-semibold">{workout.title}</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{workout.summary}</p>
      </div>

      <div className="rounded-3xl bg-[color:var(--surface-strong)] p-4 text-sm">
        <p>{workout.durationMinutes ? `${workout.durationMinutes} km` : "Duracion libre"}</p>
        {blocks.length ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Sesion</p>
            {blocks.map((block) => (
              <p key={block} className="rounded-2xl bg-white px-3 py-2 text-[color:var(--foreground)]">
                {block}
              </p>
            ))}
          </div>
        ) : null}
        {workout.notes ? <p className="mt-3 text-[color:var(--muted)]">{workout.notes}</p> : null}
      </div>

      <form action={saveWorkoutFeedback} className="space-y-4">
        <input type="hidden" name="workoutId" value={workout.workoutId} />
        <input type="hidden" name="athleteId" value={athleteId} />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Completado</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="rounded-2xl border border-[color:var(--line)] bg-white p-3 text-center">
              <input
                className="mr-2"
                type="radio"
                name="completed"
                value="yes"
                defaultChecked={workout.feedback ? workout.feedback.completed : true}
              />
              Si
            </label>
            <label className="rounded-2xl border border-[color:var(--line)] bg-white p-3 text-center">
              <input
                className="mr-2"
                type="radio"
                name="completed"
                value="no"
                defaultChecked={workout.feedback ? !workout.feedback.completed : false}
              />
              No
            </label>
          </div>
        </fieldset>

        <label className="block space-y-2">
          <span className="text-sm font-medium">RPE</span>
          <input
            type="number"
            name="rpe"
            min="1"
            max="10"
            required
            defaultValue={workout.feedback?.rpe ?? 5}
            className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Comentario</span>
          <textarea
            name="comment"
            rows={4}
            defaultValue={workout.feedback?.comment ?? ""}
            placeholder="Sensaciones, molestias o notas rapidas"
            className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3"
          />
        </label>

        <Button className="w-full" type="submit">
          Guardar feedback
        </Button>
      </form>
    </Card>
  );
}