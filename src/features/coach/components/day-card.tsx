import { saveWorkoutDraft, publishWorkoutDay } from "@/features/coach/actions";
import { StatusBadge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card } from "@/components/ui/card";
import { parseWorkoutStructure } from "@/lib/workout-structure";
import { DayCardItem, TemplateOption } from "@/types/domain";
import { WorkoutBlockEditor } from "./workout-block-editor";

type Props = {
  athleteProfileId: string;
  weekStart: string;
  day: DayCardItem;
  templates: TemplateOption[];
};

export function CoachDayCard({ athleteProfileId, weekStart, day, templates }: Props) {
  const blocks = parseWorkoutStructure(day.structure);
  const hasPreview = blocks.length || day.durationMinutes != null || day.notes;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">{day.dateLabel}</p>
        {day.status ? <StatusBadge status={day.status} /> : null}
      </div>

      {hasPreview ? (
        <div className="rounded-3xl bg-[color:var(--surface-strong)] p-3 text-sm">
          {blocks.length ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">Bloques</p>
              {blocks.map((block, index) => (
                <p key={`${block}-${index}`} className="rounded-2xl bg-white px-3 py-2 text-[color:var(--foreground)]">
                  {block}
                </p>
              ))}
            </div>
          ) : null}

          <p className={blocks.length ? "mt-3 text-[color:var(--muted)]" : "text-[color:var(--muted)]"}>
            {day.durationMinutes != null ? `${day.durationMinutes} km` : "Duracion libre"}
          </p>

          {day.notes ? <p className="mt-3 text-[color:var(--muted)]">{day.notes}</p> : null}
        </div>
      ) : null}

      {day.feedback ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <p className="font-semibold text-emerald-900">Feedback del atleta</p>
          <p className="mt-1 text-emerald-800">
            {day.feedback.completed ? "Completado" : "No completado"} - RPE {day.feedback.rpe}
          </p>
          <p className="mt-2 text-emerald-700">{day.feedback.comment || "Sin comentario"}</p>
        </div>
      ) : null}

      <form action={saveWorkoutDraft} className="space-y-3">
        <input type="hidden" name="athleteProfileId" value={athleteProfileId} />
        <input type="hidden" name="weekStart" value={weekStart} />
        <input type="hidden" name="dayOfWeek" value={day.dayIndex} />
        <input type="hidden" name="templateId" value={day.templateId ?? templates[0]?.id ?? ""} />

        <WorkoutBlockEditor name="structure" templates={templates} initialValue={day.structure} />

        <div className="grid grid-cols-[1fr_104px] gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Notas</span>
            <textarea
              name="notes"
              defaultValue={day.notes ?? ""}
              rows={3}
              placeholder="Indicaciones simples"
              className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Km</span>
            <input
              name="durationMinutes"
              type="number"
              min="0"
              defaultValue={day.durationMinutes ?? ""}
              className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
            />
          </label>
        </div>

        <SubmitButton
          className="w-full"
          idleLabel={day.title ? "Guardar cambios en borrador" : "Anadir entrenamiento"}
          pendingLabel="Guardando..."
        />
      </form>

      {day.workoutId ? (
        <form action={publishWorkoutDay}>
          <input type="hidden" name="workoutId" value={day.workoutId} />
          <SubmitButton
            className="w-full"
            variant="secondary"
            idleLabel="Publicar este dia"
            pendingLabel="Publicando..."
          />
        </form>
      ) : null}
    </Card>
  );
}
