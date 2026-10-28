import type { SubjectSeed } from "./types";

export const quimicaSeed: SubjectSeed = {
  slug: "quimica",
  name: "Química",
  color: "#10B981",
  icon: "flask-conical",
  topics: [
    { name: "Estrutura Atômica e Tabela Periódica", order: 1, difficulty: "facil", priority: "media" },
    { name: "Ligações Químicas", order: 2, difficulty: "medio", priority: "alta" },
    { name: "Funções Inorgânicas", order: 3, difficulty: "medio", priority: "media" },
    { name: "Reações Inorgânicas e Estequiometria", order: 4, difficulty: "dificil", priority: "alta" },
    { name: "Soluções", order: 5, difficulty: "medio", priority: "media" },
    { name: "Termoquímica", order: 6, difficulty: "medio", priority: "media" },
    { name: "Cinética Química", order: 7, difficulty: "medio", priority: "media" },
    { name: "Equilíbrio Químico", order: 8, difficulty: "dificil", priority: "alta" },
    { name: "Eletroquímica", order: 9, difficulty: "dificil", priority: "alta" },
    { name: "Química Orgânica: Introdução e Funções", order: 10, difficulty: "medio", priority: "alta" },
    { name: "Isomeria", order: 11, difficulty: "dificil", priority: "alta" },
    { name: "Reações Orgânicas", order: 12, difficulty: "dificil", priority: "alta" },
    { name: "Radioatividade", order: 13, difficulty: "facil", priority: "baixa" },
  ],
};
