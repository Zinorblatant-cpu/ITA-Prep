export interface AchievementSeed {
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  criteriaType: "streak" | "total_hours" | "questions" | "mock_exams" | "topics_completed";
  criteriaValue: number;
}

export const achievementsSeed: AchievementSeed[] = [
  { code: "streak_7", name: "Uma Semana Firme", description: "Estude por 7 dias seguidos.", icon: "flame", xpReward: 100, criteriaType: "streak", criteriaValue: 7 },
  { code: "streak_30", name: "Constância de Ferro", description: "Estude por 30 dias seguidos.", icon: "flame", xpReward: 400, criteriaType: "streak", criteriaValue: 30 },
  { code: "streak_100", name: "Rumo ao ITA", description: "Estude por 100 dias seguidos.", icon: "flame", xpReward: 1000, criteriaType: "streak", criteriaValue: 100 },
  { code: "hours_50", name: "Primeiras 50 Horas", description: "Acumule 50 horas de estudo.", icon: "clock", xpReward: 150, criteriaType: "total_hours", criteriaValue: 50 },
  { code: "hours_200", name: "200 Horas de Dedicação", description: "Acumule 200 horas de estudo.", icon: "clock", xpReward: 500, criteriaType: "total_hours", criteriaValue: 200 },
  { code: "hours_1000", name: "Mil Horas", description: "Acumule 1000 horas de estudo.", icon: "clock", xpReward: 2000, criteriaType: "total_hours", criteriaValue: 1000 },
  { code: "questions_500", name: "500 Questões", description: "Resolva 500 questões.", icon: "list-checks", xpReward: 200, criteriaType: "questions", criteriaValue: 500 },
  { code: "questions_2000", name: "2000 Questões", description: "Resolva 2000 questões.", icon: "list-checks", xpReward: 600, criteriaType: "questions", criteriaValue: 2000 },
  { code: "mock_exams_5", name: "Veterano de Simulados", description: "Complete 5 simulados.", icon: "clipboard-list", xpReward: 250, criteriaType: "mock_exams", criteriaValue: 5 },
  { code: "mock_exams_20", name: "Mestre dos Simulados", description: "Complete 20 simulados.", icon: "clipboard-list", xpReward: 700, criteriaType: "mock_exams", criteriaValue: 20 },
  { code: "topics_10", name: "Primeiros Passos", description: "Conclua 10 conteúdos.", icon: "check-circle", xpReward: 150, criteriaType: "topics_completed", criteriaValue: 10 },
  { code: "topics_50", name: "Metade do Caminho", description: "Conclua 50 conteúdos.", icon: "check-circle", xpReward: 500, criteriaType: "topics_completed", criteriaValue: 50 },
];
