import type { ISODateString } from "./common.types";

export interface CalendarDayDTO {
  date: ISODateString;
  studied: boolean;
  hours: number;
  reviewsCount: number;
  mockExamsCount: number;
  goalsAchievedCount: number;
}

export interface CalendarMonthDTO {
  year: number;
  month: number;
  days: CalendarDayDTO[];
}
