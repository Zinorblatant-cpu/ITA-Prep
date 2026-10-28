import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateBookInput,
  CreateCourseInput,
  CreateTeacherInput,
  CreateYoutubeChannelInput,
  UpdateAppSettingsInput,
  UpdateBookInput,
  UpdateCourseInput,
  UpdateTeacherInput,
  UpdateYoutubeChannelInput,
} from "@ita/shared-types";
import { settingsApi } from "../services/settings.service";

export function useBooks() {
  return useQuery({ queryKey: ["settings", "books"], queryFn: settingsApi.listBooks });
}
export function useCourses() {
  return useQuery({ queryKey: ["settings", "courses"], queryFn: settingsApi.listCourses });
}
export function useYoutubeChannels() {
  return useQuery({ queryKey: ["settings", "youtube-channels"], queryFn: settingsApi.listYoutubeChannels });
}
export function useTeachers() {
  return useQuery({ queryKey: ["settings", "teachers"], queryFn: settingsApi.listTeachers });
}
export function useAppSettings() {
  return useQuery({ queryKey: ["settings", "app"], queryFn: settingsApi.getAppSettings });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookInput) => settingsApi.createBook(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "books"] }),
  });
}
export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBookInput }) => settingsApi.updateBook(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "books"] }),
  });
}
export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsApi.deleteBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "books"] }),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCourseInput) => settingsApi.createCourse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "courses"] }),
  });
}
export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCourseInput }) => settingsApi.updateCourse(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "courses"] }),
  });
}
export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsApi.deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "courses"] }),
  });
}

export function useCreateYoutubeChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateYoutubeChannelInput) => settingsApi.createYoutubeChannel(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "youtube-channels"] }),
  });
}
export function useUpdateYoutubeChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateYoutubeChannelInput }) =>
      settingsApi.updateYoutubeChannel(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "youtube-channels"] }),
  });
}
export function useDeleteYoutubeChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsApi.deleteYoutubeChannel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "youtube-channels"] }),
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTeacherInput) => settingsApi.createTeacher(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "teachers"] }),
  });
}
export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTeacherInput }) => settingsApi.updateTeacher(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "teachers"] }),
  });
}
export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => settingsApi.deleteTeacher(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings", "teachers"] }),
  });
}

export function useUpdateAppSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAppSettingsInput) => settingsApi.updateAppSettings(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "app"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
