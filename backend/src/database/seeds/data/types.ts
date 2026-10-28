import type { SubjectSlug } from "@ita/shared-types";

export interface TopicSeed {
  name: string;
  description?: string;
  order: number;
  difficulty?: "facil" | "medio" | "dificil";
  priority?: "baixa" | "media" | "alta";
}

export interface SubjectSeed {
  slug: SubjectSlug;
  name: string;
  color: string;
  icon: string;
  topics: TopicSeed[];
}
