# Plano de Implementação: Tunify Sync - Fase 1 (Sistema de Convites com Permissões Granulares)

Este documento registra o roadmap, decisões de engenharia, arquitetura de dados e o progresso em tempo real da implementação da Fase 1 do **Tunify Sync (Conexão Social e Match de Vibe)**.

---

## 1. Visão Geral da Fase 1

O objetivo desta fase é permitir que os usuários se conectem de forma segura e privada através de **links de convite exclusivos (Deep Links P2P)**. A grande inovação desta entrega é a **Privacidade por Design (Privacy by Design)**: quem gera o convite escolhe exatamente quais métricas musicais deseja compartilhar, e quem recebe o convite também define suas preferências de volta antes de selar a conexão.

### Permissões Ativas na Fase 1:
- ⏱️ `share_minutes`: Compartilhar minutos totais ouvidos (base para o futuro Pódio da Casa).
- 🎵 `share_top_tracks`: Compartilhar o Top 10 de músicas mensais.
- 🎤 `share_top_artists`: Compartilhar o Top 15 de artistas mensais.
- 🌙 `share_peak_time`: Compartilhar o período de maior imersão auditiva (Madrugada, Manhã, Tarde, Noite).

*(Nota: O schema já é desenhado de forma extensível com JSONB, pronto para receber no futuro as flags de Pentágono de Vibe, Geração de Playlists e Selos sem quebrar o banco de dados).*

---

## 2. Checklist de Execução & Progresso

- [x] **Passo 1: Modelagem de Dados no Backend (PostgreSQL & Alembic)**
  - [x] Criar modelos `SyncInvite` e `SyncConnection` em `backend/app/models/sync.py`.
  - [x] Exportar novos modelos em `backend/app/models/__init__.py`.
  - [x] Gerar e aplicar a migração automática via Alembic no banco de dados.

- [x] **Passo 2: Schemas e Regras de Negócio (Backend)**
  - [x] Criar DTOs Pydantic em `backend/app/schemas/sync.py` com validação de permissões granulares.
  - [x] Criar serviço `backend/app/services/sync_service.py`:
    - [x] Geração de token criptograficamente seguro (`secrets.token_urlsafe`).
    - [x] Validação de tempo de expiração (7 dias).
    - [x] Prevenção de auto-convite e proteção contra conexões duplicadas.
    - [x] Lógica transacional atômica de aceitação e revogação.

- [x] **Passo 3: Endpoints REST da API (Backend)**
  - [x] Criar rotas em `backend/app/api/v1/endpoints/sync.py`:
    - `POST /api/v1/sync/convites` (Criação do convite com permissões).
    - `GET /api/v1/sync/convites/meus-ativos` (Listagem de convites pendentes do usuário).
    - `GET /api/v1/sync/convites/{codigo}` (Consulta pública para exibir o remetente).
    - `POST /api/v1/sync/convites/{codigo}/aceitar` (Aceite do convite com permissões mútuas).
    - `DELETE /api/v1/sync/convites/{codigo}` (Revogação de convite pendente).
    - `GET /api/v1/sync/conexoes` (Lista de amigos conectados).
  - [x] Registrar roteador `sync` no `backend/main.py`.

- [x] **Passo 4: Integração no Frontend (Angular 21)**
  - [x] Criar serviço `SyncService` em `frontend/src/app/core/services/sync.service.ts`.
  - [x] Tipar interfaces de dados TypeScript (`SyncPermissions`, `SyncInvite`, `SyncConnection`).

- [x] **Passo 5: Componente Visual do Dashboard (Página Inicial)**
  - [x] Criar componente `SyncCardComponent` em `frontend/src/app/components/sync-card/`.
  - [x] Aplicar design system oficial (paleta Dark/Light, glassmorphism, tipografia Urbanist/MuseoModerno, neon glow).
  - [x] Painel interativo com switches/toggles elegantes para configuração das 4 permissões.
  - [x] Botão de geração com animação, cópia em 1 clique e botão direto de envio via WhatsApp.
  - [x] Inserir o componente no `dashboard.component.html` logo abaixo do grid atual.

- [x] **Passo 6: Tela de Recepção e Aceite de Convite**
  - [x] Criar página/rota dedicada `/sync/convite/:codigo`.
  - [x] Experiência de boas-vindas com dados do amigo remetente e permissões concedidas.
  - [x] Seleção de permissões de volta antes do aceite.
  - [x] Redirecionamento com feedback comemorativo para o Dashboard.

- [x] **Passo 7: Testes Integrados e Validação**
  - [x] Testar fluxo completo de ponta a ponta (Geração -> Envio -> Recepção -> Aceite).
  - [x] Validar responsividade e alternância entre Modo Claro e Escuro.
