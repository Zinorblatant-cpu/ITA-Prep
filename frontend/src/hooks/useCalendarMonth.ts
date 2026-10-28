import { useQuery } from "@tanstack/react-query";
import { calendarApi } from "../services/calendar.service";

export function useCalendarMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => calendarApi.getMonth(year, month),
  });
}
