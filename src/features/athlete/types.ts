import { AthleteSummary, DayCardItem } from "@/types/domain";

export type AthleteWeekData = {
  athlete: AthleteSummary | null;
  weekLabel: string;
  weekStart: string;
  days: DayCardItem[];
};
