import { WorkoutStatus } from "@prisma/client";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatWeekRange, getWeekDates, getWeekStart, weekDays } from "@/lib/date";
import { CoachDashboardData } from "./types";

async function getOrCreateWeeklyPlan(athleteProfileId: string, weekStart: Date) {
  return prisma.weeklyPlan.upsert({
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
    include: {
      plannedWorkouts: {
        include: {
          feedback: true,
        },
      },
    },
  });
}

export async function getCoachDashboardData(selectedAthleteId?: string, weekStartValue?: string): Promise<CoachDashboardData> {
  const coach = await prisma.user.findFirst({
    where: { role: "COACH" },
    include: {
      athletes: {
        orderBy: { displayName: "asc" },
      },
      templates: {
        orderBy: [{ category: "asc" }, { name: "asc" }],
      },
    },
  });

  if (!coach) {
    throw new Error("No se encontro coach demo");
  }

  const athletes = coach.athletes.map((athlete) => ({
    id: athlete.id,
    displayName: athlete.displayName,
    notes: athlete.notes,
  }));

  const selectedAthlete = athletes.find((athlete) => athlete.id === selectedAthleteId) ?? athletes[0] ?? null;
  const weekStart = getWeekStart(weekStartValue);

  let days = getWeekDates(weekStart).map((date, index) => ({
    dayIndex: index,
    dateLabel: `${weekDays[index]} - ${format(date, "d MMM")}`,
    isoDate: date.toISOString(),
  }));

  if (selectedAthlete) {
    const plan = await getOrCreateWeeklyPlan(selectedAthlete.id, weekStart);

    days = getWeekDates(weekStart).map((date, index) => {
      const workout = plan.plannedWorkouts.find((item) => item.dayOfWeek === index);

      return {
        dayIndex: index,
        dateLabel: `${weekDays[index]} - ${format(date, "d MMM")}`,
        isoDate: date.toISOString(),
        workoutId: workout?.id,
        title: workout?.title,
        summary: workout?.summary,
        notes: workout?.notes,
        structure: workout?.structure,
        durationMinutes: workout?.durationMinutes,
        status: workout?.status as WorkoutStatus | undefined,
        templateId: workout?.workoutTemplateId,
        feedback: workout?.feedback
          ? {
              completed: workout.feedback.completed,
              rpe: workout.feedback.rpe,
              comment: workout.feedback.comment,
            }
          : null,
      };
    });
  }

  return {
    coachId: coach.id,
    athletes,
    selectedAthlete,
    weekLabel: formatWeekRange(weekStart),
    weekStart: weekStart.toISOString(),
    templates: coach.templates.map((template) => ({
      id: template.id,
      name: template.name,
      category: template.category,
      summary: template.summary,
      defaultDuration: template.defaultDuration,
    })),
    days,
  };
}