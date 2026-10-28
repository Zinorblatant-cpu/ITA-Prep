# Prompt

Você é um Engenheiro de Software Sênior especializado em React, TypeScript, Node.js, UX/UI e arquitetura de aplicações.

Quero que você desenvolva uma aplicação completa para gerenciamento de estudos focada na preparação para o vestibular do ITA 2028.

## Objetivo

A aplicação deve funcionar como um painel de controle (dashboard) pessoal, permitindo acompanhar toda a evolução durante aproximadamente três anos de estudos.

A interface deve ser moderna, minimalista e inspirada em aplicações como GitHub, Notion e Linear, priorizando clareza, desempenho e ótima experiência de uso.

---

# Tecnologias

Frontend

* React
* TypeScript
* TailwindCSS
* React Router
* React Query
* Recharts
* Framer Motion

Backend

* Node.js
* Express
* TypeScript

Banco

SQLite inicialmente.

Toda a arquitetura deve permitir migração futura para PostgreSQL.

---

# Dashboard Principal

Mostrar:

* Horas estudadas hoje
* Horas da semana
* Horas do mês
* Horas totais
* Questões resolvidas
* Questões corretas
* Taxa de acerto
* Sequência de dias estudando (streak)
* Quantidade de simulados
* Progresso até o ITA 2028
* Calendário de estudos
* Próximas revisões

---

# Disciplinas

Criar:

* Matemática
* Física
* Química
* Português
* Inglês

Cada disciplina deve possuir:

* percentual concluído
* capítulos
* progresso
* revisões
* exercícios
* observações

---

# Conteúdos

Cada matéria terá:

Nome

Exemplo

Matemática

Álgebra

Funções

Trigonometria

Geometria

Matrizes

Determinantes

Complexos

Probabilidade

etc.

Cada conteúdo possui:

* porcentagem
* data de início
* data de conclusão
* dificuldade
* observações
* prioridade

---

# Sessão de Estudos

Ao iniciar um estudo o usuário poderá informar:

Matéria

Conteúdo

Livro

Canal

Tipo

* teoria
* exercícios
* revisão
* simulado

Tempo estudado

Quantidade de exercícios

Quantidade de acertos

Quantidade de erros

Observações

Ao finalizar, tudo deve ser salvo automaticamente.

---

# Revisões

Implementar repetição espaçada.

Após concluir um conteúdo gerar automaticamente revisões em:

* 1 dia
* 7 dias
* 30 dias
* 90 dias
* 180 dias

Mostrar essas revisões no dashboard.

---

# Caderno de Erros

Cada erro deve armazenar:

Questão

Assunto

Fonte

Tipo do erro

* distração
* conceito
* cálculo
* interpretação

Correção

Imagem opcional

Status

* pendente
* revisado
* dominado

---

# Questões

Registrar:

Origem

* ITA
* IME
* AFA
* EsPCEx
* ENEM
* Livro

Ano

Assunto

Subassunto

Tempo gasto

Correta ou incorreta

Comentários

---

# Metas

Metas diárias

Metas semanais

Metas mensais

Metas anuais

Exemplos

18 horas por semana

200 questões por semana

4 revisões por dia

1 simulado por mês

Mostrar progresso com barras.

---

# Estatísticas

Criar gráficos para:

Horas por semana

Horas por mês

Questões resolvidas

Questões corretas

Questões por disciplina

Taxa de acerto

Assuntos mais fracos

Assuntos mais fortes

Mapa de calor de estudos

---

# Simulados

Registrar:

Data

Tempo

Nota

Questões

Tempo médio por questão

Percentual de acerto

Comparação com simulados anteriores

---

# Gamificação

Adicionar:

Níveis

Experiência

Conquistas

Streak

Metas consecutivas

Badges

---

# Calendário

Mostrar:

Dias estudados

Dias sem estudo

Revisões

Simulados

Metas

---

# Configurações

Cadastrar:

Livros

Cursos

Canais do YouTube

Professores

Carga horária semanal

Data da prova

---

# Interface

Criar tema claro e escuro.

A interface deve ser extremamente responsiva.

Utilizar animações suaves.

Utilizar componentes reutilizáveis.

---

# Arquitetura

Utilizar arquitetura escalável.

Separar:

components

pages

hooks

services

contexts

utils

types

database

routes

models

controllers

middlewares

---

# Código

Escrever código limpo.

Utilizar boas práticas.

Aplicar princípios SOLID.

Utilizar TypeScript fortemente tipado.

Documentar funções importantes.

---

# Objetivo final

Quero que essa aplicação pareça um produto profissional, como se fosse uma plataforma comercial de gerenciamento de estudos para vestibulares de alto desempenho, com foco em produtividade, visualização de progresso e acompanhamento detalhado da evolução ao longo de três anos.
