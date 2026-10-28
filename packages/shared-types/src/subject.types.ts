import type { Difficulty, ISODateString, Priority } from "./common.types";

export type SubjectSlug = "matematica" | "fisica" | "quimica" | "portugues" | "ingles";

export interface SubjectDTO {
  id: number;
  slug: SubjectSlug;
  name: string;
  color: string;
  icon: string;
  targetPercentage: number;
  createdAt: ISODateString;
}

export type TopicStatus = "nao_iniciado" | "em_andamento" | "concluido" | "revisao";

export interface TopicDTO {
  id: number;
  subjectId: number;
  name: string;
  description: string | null;
  orderIndex: number;
  difficulty: Difficulty | null;
  priority: Priority | null;
  progressPercentage: number;
  status: TopicStatus;
  startedAt: ISODateString | null;
  completedAt: ISODateString | null;
  notes: string | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SubjectStatsDTO {
  subjectId: number;
  totalTopics: number;
  completedTopics: number;
  progressPercentage: number;
  totalHours: number;
  totalExercises: number;
  correctExercises: number;
  accuracyRate: number;
}

export interface CreateTopicInput {
  subjectId: number;
  name: string;
  description?: string;
  orderIndex?: number;
  difficulty?: Difficulty;
  priority?: Priority;
  notes?: string;
}

export type UpdateTopicInput = Partial<Omit<CreateTopicInput, "subjectId">> & {
  progressPercentage?: number;
  status?: TopicStatus;
};
