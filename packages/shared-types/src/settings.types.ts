import type { ISODateString } from "./common.types";

export interface BookDTO {
  id: number;
  title: string;
  author: string | null;
  subjectId: number | null;
  totalPages: number | null;
  notes: string | null;
  createdAt: ISODateString;
}

export type CreateBookInput = Omit<BookDTO, "id" | "createdAt">;
export type UpdateBookInput = Partial<CreateBookInput>;

export interface CourseDTO {
  id: number;
  name: string;
  platform: string | null;
  url: string | null;
  subjectId: number | null;
  notes: string | null;
}

export type CreateCourseInput = Omit<CourseDTO, "id">;
export type UpdateCourseInput = Partial<CreateCourseInput>;

export interface YoutubeChannelDTO {
  id: number;
  name: string;
  url: string | null;
  subjectId: number | null;
}

export type CreateYoutubeChannelInput = Omit<YoutubeChannelDTO, "id">;
export type UpdateYoutubeChannelInput = Partial<CreateYoutubeChannelInput>;

export interface MissingTopicSearchResultDTO {
  topicId: number;
  topicName: string;
  subjectName: string;
  searchUrl: string;
}

export interface TeacherDTO {
  id: number;
  name: string;
  subjectId: number | null;
  notes: string | null;
}

export type CreateTeacherInput = Omit<TeacherDTO, "id">;
export type UpdateTeacherInput = Partial<CreateTeacherInput>;

export interface AppSettingsDTO {
  id: number;
  weeklyHourTarget: number;
  examDate: ISODateString;
  themePreference: "light" | "dark" | "system";
  updatedAt: ISODateString;
}

export type UpdateAppSettingsInput = Partial<
  Omit<AppSettingsDTO, "id" | "updatedAt">
>;
