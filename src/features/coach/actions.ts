"use server";

import { revalidatePath } from "next/cache";
import { addDays, parseISO, startOfWeek } from "date-fns";
import { WorkoutStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getWeekStartDate(rawDate: string) {
  return startOfWeek(parseISO(rawDate), { weekStartsOn: 1 });
}

function buildWorkoutTitle(structure: string, fallbackTitle: string) {
  const blocks = structure
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return fallbackTitle;
  }

  if (blocks.length === 1) {
    return blocks[0];
  }

  return fallbackTitle;
}

export async function saveWorkoutDraft(formData: FormData) {
  const athleteProfileId = String(formData.get("athleteProfileId"));
  const weekStartRaw = String(formData.get("weekStart"));
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const templateId = String(formData.get("templateId"));
  const notes = String(formData.get("notes") ?? "").trim();
  const structure = String(formData.get("structure") ?? "").trim();
  const durationMinutesRaw = String(formData.get("durationMinutes") ?? "").trim();

  const weekStart = getWeekStartDate(weekStartRaw);

  const template = await prisma.workoutTemplate.findUnique({
    where: { id: templateId },
  });

  if (!template) {
    throw new Error("Plantilla no encontrada");
  }

  const weeklyPlan = await prisma.weeklyPlan.upsert({
    where: {
      athleteProfileId_weekStart: {
        athleteProfileId,
        weekStart,
      },
    },
    update: {},
    create: {
      athleteProfileId,
      weekStart,
    },
  });

  const finalStructure = structure || template.defaultStructure || "";

  await prisma.plannedWorkout.upsert({
    where: {
      weeklyPlanId_dayOfWeek: {
        weeklyPlanId: weeklyPlan.id,
        dayOfWeek,
      },
    },
    update: {
      workoutTemplateId: template.id,
      title: buildWorkoutTitle(finalStructure, template.name),
      summary: template.summary,
      notes: notes || null,
      structure: finalStructure || null,
      durationMinutes: durationMinutesRaw ? Number(durationMinutesRaw) : template.defaultDuration,
      status: WorkoutStatus.DRAFT,
      workoutDate: addDays(weekStart, dayOfWeek),
    },
    create: {
      weeklyPlanId: weeklyPlan.id,
      workoutTemplateId: template.id,
      title: buildWorkoutTitle(finalStructure, template.name),
      summary: template.summary,
      notes: notes || null,
      structure: finalStructure || null,
      durationMinutes: durationMinutesRaw ? Number(durationMinutesRaw) : template.defaultDuration,
      dayOfWeek,
      workoutDate: addDays(weekStart, dayOfWeek),
      status: WorkoutStatus.DRAFT,
    },
  });

  revalidatePath("/coach");
}

export async function publishWorkoutDay(formData: FormData) {
  const workoutId = String(formData.get("workoutId"));

  await prisma.plannedWorkout.update({
    where: { id: workoutId },
    data: { status: WorkoutStatus.PUBLISHED },
  });

  revalidatePath("/coach");
  revalidatePath("/athlete");
}

export async function publishDraftWeek(formData: FormData) {
  const athleteProfileId = String(formData.get("athleteProfileId"));
  const weekStart = getWeekStartDate(String(formData.get("weekStart")));

  const weeklyPlan = await prisma.weeklyPlan.findUnique({
    where: {
      athleteProfileId_weekStart: {
        athleteProfileId,
        weekStart,
      },
    },
  });

  if (!weeklyPlan) {
    return;
  }

  await prisma.plannedWorkout.updateMany({
    where: {
      weeklyPlanId: weeklyPlan.id,
      status: WorkoutStatus.DRAFT,
    },
    data: {
      status: WorkoutStatus.PUBLISHED,
    },
  });

  revalidatePath("/coach");
  revalidatePath("/athlete");
}
