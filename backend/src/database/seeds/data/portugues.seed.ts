import type { SubjectSeed } from "./types";

export const portuguesSeed: SubjectSeed = {
  slug: "portugues",
  name: "Português",
  color: "#EF4444",
  icon: "book-open",
  topics: [
    { name: "Fonética e Fonologia", order: 1, difficulty: "facil", priority: "baixa" },
    { name: "Morfologia (Classes de Palavras)", order: 2, difficulty: "medio", priority: "media" },
    { name: "Sintaxe (Período Simples e Composto)", order: 3, difficulty: "dificil", priority: "alta" },
    { name: "Concordância Verbal e Nominal", order: 4, difficulty: "medio", priority: "alta" },
    { name: "Regência Verbal e Nominal", order: 5, difficulty: "medio", priority: "media" },
    { name: "Crase", order: 6, difficulty: "medio", priority: "media" },
    { name: "Semântica e Figuras de Linguagem", order: 7, difficulty: "medio", priority: "media" },
    { name: "Interpretação de Texto", order: 8, difficulty: "medio", priority: "alta" },
    { name: "Coesão e Coerência Textual", order: 9, difficulty: "medio", priority: "media" },
    { name: "Estilos de Época e Literatura Brasileira", order: 10, difficulty: "dificil", priority: "alta" },
    { name: "Redação Dissertativa-Argumentativa", order: 11, difficulty: "dificil", priority: "alta" },
  ],
};
