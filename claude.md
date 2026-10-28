# ITA 2028 — Painel de Estudos

Aplicação pessoal (single-user, sem autenticação) para gerenciar ~3 anos de preparação para o vestibular do ITA. Monorepo com frontend React e backend Node/Express, banco SQLite com caminho de migração para PostgreSQL.

## Visão geral do stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS + React Router + TanStack Query + Recharts + Framer Motion.
- **Backend**: Node + Express + TypeScript.
- **Banco**: SQLite via **Drizzle ORM** (`better-sqlite3`) + `drizzle-kit` para migrations.
- **Tipos compartilhados**: `packages/shared-types` (DTOs de API usados por front e back, via npm workspaces).

## Comandos

Rodar tudo a partir da raiz do repo.

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências dos 3 workspaces (`packages/shared-types`, `backend`, `frontend`). |
| `npm run dev` | Sobe backend (porta 3333) e frontend (porta 5173) juntos via `concurrently`. |
| `npm run dev:backend` / `npm run dev:frontend` | Sobe só um dos dois. |
| `npm run db:generate` | Gera uma nova migration Drizzle a partir de mudanças em `backend/src/database/schema/`. |
| `npm run db:migrate` | Aplica as migrations no SQLite (`backend/data/ita.sqlite`). |
| `npm run db:seed` | Popula/atualiza disciplinas, syllabus do ITA, conquistas e configurações iniciais (idempotente). |
| `npm run db:studio` | Abre o Drizzle Studio para inspecionar o banco. |
| `npm run build` | Build de produção dos 3 workspaces. |
| `npm run lint` | ESLint (flat config, TypeScript + React Hooks) em backend e frontend. |
| `npm run typecheck` | `tsc --noEmit` nos 3 workspaces. |

Setup do zero: `npm install` → `npm run db:migrate` → `npm run db:seed` → `npm run dev`.

Variáveis de ambiente do backend em `backend/.env` (ver `backend/.env.example`): `PORT`, `DATABASE_URL`, `CORS_ORIGIN`.

## Estrutura de pastas

```
packages/shared-types/src/   # DTOs de API e enums compartilhados (contratos, não lógica)
backend/src/
  database/schema/           # Tabelas Drizzle, um arquivo por domínio
  database/migrations/       # Migrations geradas (não editar à mão)
  database/seeds/            # Seed idempotente (syllabus do ITA em seeds/data/*.seed.ts)
  repositories/              # Camada de acesso a dados (única a importar `db` diretamente)
  services/                  # Regra de negócio: spaced-repetition, gamification, statistics, dashboard
  controllers/, routes/      # HTTP, 1:1 entre controller e router
  middlewares/                # error-handler, not-found
  utils/                      # date, http-error, async-handler
frontend/src/
  components/ui/              # Design system: Button, Card, Badge, Modal, Table, Toast, etc.
  components/{dashboard,subjects,study-session,reviews,error-notebook,charts,layout}/
  pages/                       # Uma página por rota
  hooks/                       # React Query hooks, um arquivo por recurso
  services/                    # Clients HTTP (axios) por recurso, espelhando as rotas do backend
  contexts/                    # ThemeContext (tema claro/escuro)
  utils/                       # cn, format, icon-map
```

## Decisões de arquitetura (não reabrir sem motivo)

- **npm workspaces + `packages/shared-types` só para DTOs**, nunca lógica — evita drift de tipos entre front/back sem virar uma dependência pesada tipo Nx/Turborepo, desnecessária para este porte.
- **Drizzle ORM + repository pattern fino.** Controllers/services nunca importam `db` diretamente — só os `repositories/*`. Caminho de migração SQLite → PostgreSQL: trocar `sqliteTable` → `pgTable` em `database/schema/*.ts` e o driver em `database/client.ts`. Atenção especial a colunas `text(mode:'json')` (viram `jsonb` manualmente) e enums (`text({enum:[...]})` vira `pgEnum` ou se mantém como `text`).
- **Datas armazenadas como `integer(mode:'timestamp')`** (epoch), nunca string solta — mapeia limpo para `timestamp` no Postgres.
- **Estatísticas de disciplina, progresso de metas e visão de calendário são calculadas on-the-fly** (queries agregadas em `services/statistics.service.ts` e nos controllers de goals/calendar), não cacheadas em tabela — evita dessincronia. Se performance virar problema (banco grande), considerar cache com invalidação explícita, não antes.
- **Repetição espaçada vive inteiramente no backend** (`services/spaced-repetition.service.ts`), nunca no client. Gatilho: `POST /api/topics/:id/complete` gera 5 revisões (1/7/30/90/180 dias) na mesma operação. Revisão avaliada como "ruim" agenda um reforço extra em +3 dias (`rescheduleIfPoor`).
- **Streak e XP centralizados em `services/gamification.service.ts`** com regras explícitas em `XP_RULES`. `calculateStreak` e `xpToLevel`/`xpForLevel` são funções puras testáveis, sem side effects escondidos. Achievements são verificadas (`checkAchievements`) após cada evento relevante (sessão finalizada, revisão concluída, simulado registrado).
- **Sem cron/scheduler.** Status "atrasada" de uma revisão é calculado na leitura (`scheduledDate < hoje`), não em job de background — desnecessário para app single-user local.
- **Tema claro/escuro via Tailwind `darkMode: 'class'` + `ThemeContext`**, fonte de verdade é `localStorage` (não depende de round-trip ao backend). `app_settings.themePreference` no banco é só espelho opcional.
- **Sem autenticação.** App local, single-user. Se um dia for hospedado multi-dispositivo, adicionar auth é um trabalho à parte (não decidir a forma agora).
- **Validação de request com Zod** nos controllers, reaproveitando os tipos de `shared-types` como fonte de verdade do shape.
- **Padrão de resposta de API**: sucesso `{ data }`, erro `{ error: { message, code, details? } }` (ver `middlewares/error-handler.ts`).
- **Design system em `components/ui/`** usa `class-variance-authority` (cva) para variantes (Button, Badge). Construído antes das páginas para todas reaproveitarem.
- **Timer de sessão de estudo persiste em `localStorage`** (`hooks/useActiveSessionTimer.ts`) para sobreviver a refresh da página — a duração real é sempre recalculada no backend a partir de `startedAt`/`endedAt` ao finalizar, nunca confiada ao client.
- **Code-splitting por rota** (`React.lazy` em `App.tsx`) — a página de Estatísticas (Recharts) é o maior chunk e fica isolada do bundle inicial.

## Onde editar o syllabus

Os tópicos de cada disciplina (seed inicial, baseado no edital real do ITA/IEA) estão em `backend/src/database/seeds/data/{matematica,fisica,quimica,portugues,ingles}.seed.ts`. Editar esses arquivos e rodar `npm run db:seed` novamente é seguro — o seed é idempotente (não duplica tópicos já existentes pelo nome).

## Estado atual / backlog para próximas iterações

Núcleo (Dashboard, Disciplinas/Conteúdos, Sessão de Estudo, Revisões, Caderno de Erros) está completo e testado ponta a ponta. Os módulos abaixo têm schema + API completos e telas funcionais básicas (CRUD real), mas podem ser aprofundados:

- **Questões / Metas / Simulados**: CRUD funcional; falta refinar filtros avançados e paginação se o volume de dados crescer muito.
- **Estatísticas**: gráficos principais implementados (horas, taxa de acerto, heatmap, radar por disciplina, questões por disciplina, assuntos fortes/fracos). Poderia ganhar filtro de intervalo de datas customizado.
- **Gamificação**: perfil, XP log e conquistas funcionam; achievements de `total_hours`/`questions`/`mock_exams`/`topics_completed` recalculam a métrica inteira a cada evento (aceitável no porte atual — revisar se o histórico crescer muito).
- **Configurações**: CRUD simples de livros/cursos/canais/professores (formulário inline, um campo por vez); poderia ganhar edição inline e vínculo mais rico com disciplina.
- **Calendário**: visão mensal funcional; poderia ganhar visão anual resumida.

Nenhum teste automatizado (unit/integration) foi criado ainda — validação até aqui foi manual via typecheck, lint, build e chamadas de API. Se o projeto crescer, vale adicionar testes para `spaced-repetition.service.ts` e `gamification.service.ts` (funções puras, fáceis de testar).
