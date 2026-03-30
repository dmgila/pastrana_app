import { PrismaClient, UserRole, WorkoutStatus } from "@prisma/client";
import { addDays, startOfWeek } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.workoutFeedback.deleteMany();
  await prisma.plannedWorkout.deleteMany();
  await prisma.weeklyPlan.deleteMany();
  await prisma.workoutTemplate.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.user.deleteMany();

  const coach = await prisma.user.create({
    data: {
      role: UserRole.COACH,
      fullName: "Demo Coach",
      email: "coach@demo.app",
    },
  });

  const athleteUsers = await Promise.all([
    prisma.user.create({
      data: {
        role: UserRole.ATHLETE,
        fullName: "Lucia Navarro",
        email: "lucia@demo.app",
      },
    }),
    prisma.user.create({
      data: {
        role: UserRole.ATHLETE,
        fullName: "Diego Martin",
        email: "diego@demo.app",
      },
    }),
  ]);

  const athleteProfiles = await Promise.all(
    athleteUsers.map((user, index) =>
      prisma.athleteProfile.create({
        data: {
          userId: user.id,
          coachId: coach.id,
          displayName: user.fullName,
          notes: index === 0 ? "Objetivo 10K primavera" : "Preparando media maraton",
        },
      }),
    ),
  );

  const templates = [
    { name: "Descanso", category: "Recovery", summary: "Dia libre sin carga", defaultDuration: 0, defaultStructure: "Descanso total" },
    { name: "Rodaje suave 40 min", category: "Easy", summary: "Ritmo conversacional y muy comodo", defaultDuration: 40, defaultStructure: "10 min calentamiento\n25 min rodaje suave\n5 min soltura" },
    { name: "Rodaje suave 50 min", category: "Easy", summary: "Rodaje aerobico controlado", defaultDuration: 50, defaultStructure: "10 min calentamiento\n35 min rodaje suave\n5 min soltura" },
    { name: "Series 6x400", category: "Intervals", summary: "6 repeticiones de 400m con recuperacion corta", defaultDuration: 45, defaultStructure: "15 min calentamiento\n6x400m fuerte / 200m suave\n10 min vuelta a la calma" },
    { name: "Series 8x200", category: "Intervals", summary: "8 repeticiones de 200m con buena tecnica", defaultDuration: 35, defaultStructure: "15 min calentamiento\n8x200m vivo / 200m suave\n10 min vuelta a la calma" },
    { name: "Series 10x1000m", category: "Intervals", summary: "Bloque principal de 10 repeticiones de 1000m", defaultDuration: 55, defaultStructure: "Series 10x1000m" },
    { name: "Tempo 20 min", category: "Tempo", summary: "Bloque continuo a ritmo sostenido", defaultDuration: 50, defaultStructure: "15 min calentamiento\n20 min tempo\n15 min vuelta a la calma" },
    { name: "Tirada larga 75 min", category: "Long Run", summary: "Salida larga constante", defaultDuration: 75, defaultStructure: "15 min suave\n50 min ritmo estable\n10 min soltura final" },
    { name: "Fuerza general 30 min", category: "Strength", summary: "Circuito basico de fuerza general", defaultDuration: 30, defaultStructure: "10 min activacion\n15 min circuito de fuerza\n5 min movilidad" },
    { name: "Movilidad 20 min", category: "Mobility", summary: "Rutina de movilidad y activacion", defaultDuration: 20, defaultStructure: "5 min activacion\n10 min movilidad principal\n5 min respiracion y descarga" },
    { name: "Calentamiento 4K", category: "Warm Up", summary: "Bloque de calentamiento previo", defaultDuration: 20, defaultStructure: "Calentamiento 4K" },
    { name: "1K vuelta a la calma", category: "Cool Down", summary: "Bloque final de descarga", defaultDuration: 10, defaultStructure: "1K vuelta a la calma" },
  ];

  const createdTemplates = await Promise.all(
    templates.map((template) =>
      prisma.workoutTemplate.create({
        data: {
          coachId: coach.id,
          ...template,
        },
      }),
    ),
  );

  const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  for (const athlete of athleteProfiles) {
    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        athleteProfileId: athlete.id,
        weekStart: currentWeek,
      },
    });

    const demoAssignments = [
      { dayOfWeek: 0, templateName: "Descanso", status: WorkoutStatus.PUBLISHED, structure: "Descanso total" },
      { dayOfWeek: 1, templateName: "Rodaje suave 40 min", status: WorkoutStatus.PUBLISHED, structure: "Calentamiento 4K\n30 min rodaje suave\n1K vuelta a la calma" },
      { dayOfWeek: 2, templateName: "Series 6x400", status: WorkoutStatus.DRAFT, structure: "Calentamiento 4K\nSeries 10x1000m\n1K vuelta a la calma" },
      { dayOfWeek: 3, templateName: "Movilidad 20 min", status: WorkoutStatus.DRAFT, structure: "5 min activacion\n10 min movilidad cadera y tobillo\n5 min descarga" },
      { dayOfWeek: 4, templateName: "Tempo 20 min", status: WorkoutStatus.DRAFT, structure: "Calentamiento 4K\n20 min tempo\n1K vuelta a la calma" },
      { dayOfWeek: 5, templateName: "Descanso", status: WorkoutStatus.DRAFT, structure: "Descanso total" },
      { dayOfWeek: 6, templateName: "Tirada larga 75 min", status: WorkoutStatus.DRAFT, structure: "20 min suave\n45 min ritmo estable\n10 min soltura" },
    ];

    for (const assignment of demoAssignments) {
      const template = createdTemplates.find((item) => item.name === assignment.templateName);

      if (!template) {
        continue;
      }

      await prisma.plannedWorkout.create({
        data: {
          weeklyPlanId: weeklyPlan.id,
          workoutTemplateId: template.id,
          workoutDate: addDays(currentWeek, assignment.dayOfWeek),
          dayOfWeek: assignment.dayOfWeek,
          title: template.name,
          summary: template.summary,
          structure: assignment.structure,
          durationMinutes: template.defaultDuration,
          status: assignment.status,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });