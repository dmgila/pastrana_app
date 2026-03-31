export const dynamic = "force-dynamic";

import { AppShell } from "@/components/ui/shell";
import { AthletePicker } from "@/features/coach/components/athlete-picker";
import { TemplateCreator } from "@/features/coach/components/template-creator";
import { CoachWeekList } from "@/features/coach/components/week-list";
import { getCoachDashboardData } from "@/features/coach/data";
import { toDateInputValue } from "@/lib/date";

export default async function CoachPage({
  searchParams,
}: {
  searchParams: Promise<{ athleteId?: string; weekStart?: string }>;
}) {
  const params = await searchParams;
  const data = await getCoachDashboardData(params.athleteId, params.weekStart);

  return (
    <AppShell className="gap-4">
      <AthletePicker
        athletes={data.athletes}
        selectedAthleteId={data.selectedAthlete?.id}
        weekStart={toDateInputValue(new Date(data.weekStart))}
      />
      <TemplateCreator coachId={data.coachId} templates={data.templates} />
      <CoachWeekList data={data} />
    </AppShell>
  );
}
