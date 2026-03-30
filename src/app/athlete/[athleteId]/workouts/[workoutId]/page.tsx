export const dynamic = "force-dynamic";

import Link from "next/link";
import { AppShell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "@/features/athlete/components/feedback-form";
import { getAthleteWeekData } from "@/features/athlete/data";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ athleteId: string; workoutId: string }>;
}) {
  const { athleteId, workoutId } = await params;
  const data = await getAthleteWeekData(athleteId);
  const workout = data.days.find((item) => item.workoutId === workoutId);

  if (!workout) {
    return (
      <AppShell className="gap-4">
        <Link href={`/athlete/${athleteId}`}>
          <Button variant="ghost" type="button">
            Volver
          </Button>
        </Link>
        <p>Entrenamiento no disponible.</p>
      </AppShell>
    );
  }

  return (
    <AppShell className="gap-4">
      <Link href={`/athlete/${athleteId}`}>
        <Button variant="ghost" type="button">
          Volver a la semana
        </Button>
      </Link>
      <FeedbackForm athleteId={athleteId} workout={workout} />
    </AppShell>
  );
}
