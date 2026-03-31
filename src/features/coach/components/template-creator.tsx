"use client";

import { useActionState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { createWorkoutTemplate } from "@/features/coach/actions";
import { TemplateOption } from "@/types/domain";

type TemplateActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type Props = {
  coachId: string;
  templates: TemplateOption[];
};

const initialState: TemplateActionState = {
  status: "idle",
};

export function TemplateCreator({ coachId, templates }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<TemplateActionState, FormData>(createWorkoutTemplate, initialState);

  const categoryOptions = Array.from(new Set(templates.map((template) => template.category))).sort((a, b) =>
    a.localeCompare(b),
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Biblioteca</p>
        <h2 className="mt-2 text-xl font-semibold">Nuevo entrenamiento</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Crea un template reusable para que aparezca en el selector de bloques del coach.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-3">
        <input type="hidden" name="coachId" value={coachId} />

        <label className="block space-y-2">
          <span className="text-sm font-medium">Nombre</span>
          <input
            name="name"
            required
            placeholder="Ej. Series 5x1000"
            className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Categoria</span>
          <input
            name="category"
            required
            list="template-categories"
            placeholder="Intervals, Tempo, Recovery..."
            className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
          />
          <datalist id="template-categories">
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Resumen corto</span>
          <textarea
            name="summary"
            required
            rows={2}
            placeholder="Que tipo de trabajo es o que objetivo tiene"
            className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3"
          />
        </label>

        <div className="grid grid-cols-[1fr_104px] gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Estructura por defecto</span>
            <textarea
              name="defaultStructure"
              rows={4}
              placeholder={"Calentamiento 4K\n5x1000 vivo / 90s suave\n1K vuelta a la calma"}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-white px-3 py-3"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Km</span>
            <input
              name="defaultDuration"
              type="number"
              min="0"
              placeholder="10"
              className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
            />
          </label>
        </div>

        {state.message ? (
          <p
            className={state.status === "error" ? "text-sm text-[color:var(--danger)]" : "text-sm text-[color:var(--success)]"}
          >
            {state.message}
          </p>
        ) : null}

        <SubmitButton className="w-full" idleLabel="Guardar entrenamiento" pendingLabel="Guardando entrenamiento..." />
      </form>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
          Templates disponibles: {templates.length}
        </p>
        <div className="flex flex-wrap gap-2">
          {templates.slice(0, 8).map((template) => (
            <span
              key={template.id}
              className="rounded-full bg-[color:var(--surface-strong)] px-3 py-1 text-xs font-medium text-[color:var(--accent-strong)]"
            >
              {template.name}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
