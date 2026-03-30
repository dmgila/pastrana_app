"use server";

import { revalidatePath } from "next/cache";
import { WorkoutStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function saveWorkoutFeedback(formData: FormData) {
  const workoutId = String(formData.get("workoutId"));
  const completed = String(formData.get("completed")) === "yes";
  const rpe = Number(formData.get("rpe"));
  const comment = String(formData.get("comment") ?? "").trim();
  const athleteId = String(formData.get("athleteId"));

  await prisma.workoutFeedback.upsert({
    where: { plannedWorkoutId: workoutId },
    update: {
      completed,
      rpe,
      comment: comment || null,
    },
    create: {
      plannedWorkoutId: workoutId,
      completed,
      rpe,
      comment: comment || null,
    },
  });

  await prisma.plannedWorkout.update({
    where: { id: workoutId },
    data: {
      status: completed ? WorkoutStatus.COMPLETED : WorkoutStatus.SKIPPED,
    },
  });

  revalidatePath(`/athlete/${athleteId}`);
  revalidatePath("/coach");
}
