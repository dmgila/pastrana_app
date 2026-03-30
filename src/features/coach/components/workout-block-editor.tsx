"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { parseWorkoutStructure } from "@/lib/workout-structure";
import { TemplateOption } from "@/types/domain";

type Props = {
  templates: TemplateOption[];
  name: string;
  initialValue?: string | null;
};

export function WorkoutBlockEditor({ templates, name, initialValue }: Props) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? "");
  const [blocks, setBlocks] = useState(() => parseWorkoutStructure(initialValue));

  const addSelectedTemplate = () => {
    const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);

    if (!selectedTemplate) {
      return;
    }

    setBlocks((current) => [...current, selectedTemplate.name]);
  };

  const removeBlock = (indexToRemove: number) => {
    setBlocks((current) => current.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={blocks.join("\n")} />

      <div className="flex items-end gap-2">
        <label className="block flex-1 space-y-2">
          <span className="text-sm font-medium">Bloques del entrenamiento</span>
          <select
            value={selectedTemplateId}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-[color:var(--line)] bg-white px-3"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <Button type="button" onClick={addSelectedTemplate} className="h-11 w-11 rounded-2xl px-0 text-lg" aria-label="Anadir bloque">
          +
        </Button>
      </div>

      {blocks.length ? (
        <div className="space-y-2 rounded-3xl bg-[color:var(--surface-strong)] p-3">
          {blocks.map((block, index) => (
            <div key={`${block}-${index}`} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <p className="flex-1 text-sm text-[color:var(--foreground)]">{block}</p>
              <Button
                type="button"
                variant="danger"
                onClick={() => removeBlock(index)}
                className="h-9 min-h-9 w-9 rounded-xl px-0 text-base"
                aria-label={`Eliminar ${block}`}
              >
                -
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[color:var(--line)] px-3 py-3 text-sm text-[color:var(--muted)]">
          Anade bloques pulsando el simbolo +.
        </p>
      )}
    </div>
  );
}