import type { CalendarMonthDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const calendarApi = {
  async getMonth(year: number, month: number): Promise<CalendarMonthDTO> {
    const { data } = await apiClient.get<ApiEnvelope<CalendarMonthDTO>>("/calendar", {
      params: { year, month },
    });
    return data.data;
  },
};
