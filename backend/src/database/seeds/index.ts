import { eq } from "drizzle-orm";
import { db } from "../client";
import {
  achievements,
  appSettings,
  subjects,
  topics,
  userProfile,
} from "../schema";
import { achievementsSeed } from "./data/achievements.seed";
import { fisicaSeed } from "./data/fisica.seed";
import { inglesSeed } from "./data/ingles.seed";
import { matematicaSeed } from "./data/matematica.seed";
import { portuguesSeed } from "./data/portugues.seed";
import { quimicaSeed } from "./data/quimica.seed";
import type { SubjectSeed } from "./data/types";

const subjectSeeds: SubjectSeed[] = [
  matematicaSeed,
  fisicaSeed,
  quimicaSeed,
  portuguesSeed,
  inglesSeed,
];

function seedSubjectsAndTopics() {
  for (const subjectSeed of subjectSeeds) {
    const existing = db
      .select()
      .from(subjects)
      .where(eq(subjects.slug, subjectSeed.slug))
      .get();

    const subjectId =
      existing?.id ??
      db
        .insert(subjects)
        .values({
          slug: subjectSeed.slug,
          name: subjectSeed.name,
          color: subjectSeed.color,
          icon: subjectSeed.icon,
        })
        .returning({ id: subjects.id })
        .get().id;

    for (const topicSeed of subjectSeed.topics) {
      const existingTopic = db
        .select()
        .from(topics)
        .where(eq(topics.name, topicSeed.name))
        .get();

      if (existingTopic) continue;

      db.insert(topics)
        .values({
          subjectId,
          name: topicSeed.name,
          description: topicSeed.description,
          orderIndex: topicSeed.order,
          difficulty: topicSeed.difficulty,
          priority: topicSeed.priority,
        })
        .run();
    }
    console.log(`Disciplina "${subjectSeed.name}" seedada com ${subjectSeed.topics.length} tópicos.`);
  }
}

function seedAchievements() {
  for (const achievementSeed of achievementsSeed) {
    const existing = db
      .select()
      .from(achievements)
      .where(eq(achievements.code, achievementSeed.code))
      .get();
    if (existing) continue;

    db.insert(achievements).values(achievementSeed).run();
  }
  console.log(`${achievementsSeed.length} conquistas seedadas.`);
}

function seedSingletons() {
  const existingProfile = db.select().from(userProfile).get();
  if (!existingProfile) {
    db.insert(userProfile).values({}).run();
    console.log("Perfil de usuário inicial criado.");
  }

  const existingSettings = db.select().from(appSettings).get();
  if (!existingSettings) {
    db.insert(appSettings)
      .values({ examDate: new Date("2028-12-01") })
      .run();
    console.log("Configurações iniciais criadas (data da prova: placeholder 2028-12-01, editável em Configurações).");
  }
}

function runSeed() {
  seedSubjectsAndTopics();
  seedAchievements();
  seedSingletons();
  console.log("Seed concluído com sucesso.");
}

runSeed();
