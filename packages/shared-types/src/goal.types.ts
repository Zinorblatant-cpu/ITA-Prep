import type { ISODateString } from "./common.types";

export type GoalType = "diaria" | "semanal" | "mensal" | "anual";
export type GoalMetric = "horas_estudo" | "questoes_resolvidas" | "revisoes" | "simulados";

export interface GoalDTO {
  id: number;
  type: GoalType;
  metric: GoalMetric;
  targetValue: number;
  periodStart: ISODateString;
  periodEnd: ISODateString;
  createdAt: ISODateString;
}

export interface CreateGoalInput {
  type: GoalType;
  metric: GoalMetric;
  targetValue: number;
  periodStart: ISODateString;
  periodEnd: ISODateString;
}

export interface GoalProgressDTO {
  goal: GoalDTO;
  currentValue: number;
  percentage: number;
  achieved: boolean;
}
