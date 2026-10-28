import type { SubjectSeed } from "./types";

export const fisicaSeed: SubjectSeed = {
  slug: "fisica",
  name: "Física",
  color: "#F59E0B",
  icon: "atom",
  topics: [
    { name: "Cinemática Escalar e Vetorial", order: 1, difficulty: "medio", priority: "alta" },
    { name: "Leis de Newton e Dinâmica", order: 2, difficulty: "dificil", priority: "alta" },
    { name: "Estática", order: 3, difficulty: "medio", priority: "media" },
    { name: "Trabalho, Potência e Energia", order: 4, difficulty: "dificil", priority: "alta" },
    { name: "Impulso e Quantidade de Movimento", order: 5, difficulty: "dificil", priority: "alta" },
    { name: "Gravitação Universal", order: 6, difficulty: "medio", priority: "media" },
    { name: "Hidrostática", order: 7, difficulty: "medio", priority: "media" },
    { name: "Termologia", order: 8, difficulty: "medio", priority: "media" },
    { name: "Termodinâmica", order: 9, difficulty: "dificil", priority: "alta" },
    { name: "Óptica Geométrica", order: 10, difficulty: "medio", priority: "media" },
    { name: "Ondulatória", order: 11, difficulty: "dificil", priority: "alta" },
    { name: "Eletrostática", order: 12, difficulty: "dificil", priority: "alta" },
    { name: "Eletrodinâmica (Circuitos)", order: 13, difficulty: "dificil", priority: "alta" },
    { name: "Eletromagnetismo", order: 14, difficulty: "dificil", priority: "alta" },
    { name: "Física Moderna", order: 15, difficulty: "medio", priority: "baixa" },
  ],
};
