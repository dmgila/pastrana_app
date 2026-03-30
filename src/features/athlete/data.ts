import { WorkoutStatus } from "@prisma/client";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatWeekRange, getWeekDates, getWeekStart, weekDays } from "@/lib/date";
import { AthleteWeekData } from "./types";

export async function getAthleteWeekData(athleteId: string, weekStartValue?: string): Promise<AthleteWeekData> {
  const weekStart = getWeekStart(weekStartValue);

  const athlete = await prisma.athleteProfile.findUnique({
    where: { id: athleteId },
    include: {
      weeklyPlans: {
        where: {
          weekStart,
        },
        include: {
          plannedWorkouts: {
            where: {
              status: {
                in: [WorkoutStatus.PUBLISHED, WorkoutStatus.COMPLETED, WorkoutStatus.SKIPPED],
              },
            },
            include: {
              feedback: true,
            },
          },
        },
      },
    },
  });

  if (!athlete) {
    return {
      athlete: null,
      weekLabel: formatWeekRange(weekStart),
      weekStart: weekStart.toISOString(),
      days: [],
    };
  }

  const plan = athlete.weeklyPlans[0];

  return {
    athlete: {
      id: athlete.id,
      displayName: athlete.displayName,
      notes: athlete.notes,
    },
    weekLabel: formatWeekRange(weekStart),
    weekStart: weekStart.toISOString(),
    days: getWeekDates(weekStart)
      .map((date, index) => {
        const workout = plan?.plannedWorkouts.find((item) => item.dayOfWeek === index);

        if (!workout) {
          return null;
        }

        return {
          dayIndex: index,
          dateLabel: `${weekDays[index]} - ${format(date, "d MMM")}`,
          isoDate: date.toISOString(),
          workoutId: workout.id,
          title: workout.title,
          summary: workout.summary,
          notes: workout.notes,
          structure: workout.structure,
          durationMinutes: workout.durationMinutes,
          status: workout.status,
          feedback: workout.feedback
            ? {
                completed: workout.feedback.completed,
                rpe: workout.feedback.rpe,
                comment: workout.feedback.comment,
              }
            : null,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
  };
}