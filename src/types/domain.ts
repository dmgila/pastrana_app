export type DayStatus = "DRAFT" | "PUBLISHED" | "COMPLETED" | "SKIPPED";

export type DayCardItem = {
  dayIndex: number;
  dateLabel: string;
  isoDate: string;
  workoutId?: string;
  title?: string;
  summary?: string;
  notes?: string | null;
  structure?: string | null;
  durationMinutes?: number | null;
  status?: DayStatus;
  templateId?: string | null;
  feedback?: {
    completed: boolean;
    rpe: number;
    comment?: string | null;
  } | null;
};

export type TemplateOption = {
  id: string;
  name: string;
  category: string;
  summary: string;
  defaultDuration: number | null;
};

export type AthleteSummary = {
  id: string;
  displayName: string;
  notes?: string | null;
};