import { addDays, endOfWeek, format, parseISO, startOfWeek } from "date-fns";

export const weekDays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export function getWeekStart(dateValue?: string) {
  if (!dateValue) {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  }

  return startOfWeek(parseISO(dateValue), { weekStartsOn: 1 });
}

export function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function formatWeekRange(weekStart: Date) {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  return `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`;
}

export function toDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd");
}
