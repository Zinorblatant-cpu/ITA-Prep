import type { SubjectSeed } from "./types";

export const inglesSeed: SubjectSeed = {
  slug: "ingles",
  name: "Inglês",
  color: "#8B5CF6",
  icon: "languages",
  topics: [
    { name: "Verb Tenses", order: 1, difficulty: "medio", priority: "alta" },
    { name: "Modal Verbs", order: 2, difficulty: "medio", priority: "media" },
    { name: "Conditionals", order: 3, difficulty: "medio", priority: "media" },
    { name: "Passive Voice", order: 4, difficulty: "medio", priority: "media" },
    { name: "Phrasal Verbs", order: 5, difficulty: "dificil", priority: "media" },
    { name: "False Cognates (False Friends)", order: 6, difficulty: "medio", priority: "media" },
    { name: "Vocabulary Building", order: 7, difficulty: "medio", priority: "media" },
    { name: "Reading Comprehension", order: 8, difficulty: "dificil", priority: "alta" },
    { name: "Text Interpretation (Técnico-Científico)", order: 9, difficulty: "dificil", priority: "alta" },
  ],
};
