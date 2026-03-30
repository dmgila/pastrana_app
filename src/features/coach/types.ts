import { AthleteSummary, DayCardItem, TemplateOption } from "@/types/domain";

export type CoachDashboardData = {
  coachId: string;
  athletes: AthleteSummary[];
  selectedAthlete: AthleteSummary | null;
  weekLabel: string;
  weekStart: string;
  templates: TemplateOption[];
  days: DayCardItem[];
};
