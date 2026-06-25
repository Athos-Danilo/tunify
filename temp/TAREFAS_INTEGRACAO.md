# 📋 Tarefas de Desenvolvimento: Integração Padrão Ouro (Backend Principal ↔ Microserviço Tunify Letras)

Este documento detalha o plano de ação granular para integrar o ecossistema central (Backend em FastAPI e Frontend em Angular) ao microserviço **Tunify Letras**. Seguindo o **Padrão Ouro do Mercado**, a arquitetura será focada em processamento assíncrono (Trabalhador Calmo), tolerância a falhas e comunicação em background para respeitar os limites de infraestrutura Free Tier.

> **💡 Diretriz de Arquitetura (Vertical Slicing):** Todo o código e infraestrutura (Schemas, Repositories, Services, etc.) referentes a esta integração (e as futuras que virão) devem ser preferencialmente centralizados e isolados dentro de pastas de domínio próprio, como `app/api_tunify_liricys/`. O objetivo é evitar espalhar a lógica pelo projeto e manter as responsabilidades altamente coesas e organizadas.

---

## 🎯 Épico 1: Setup da Camada de Dados e Modelagem Estrita (Backend FastAPI)
**Objetivo:** Integrar o MongoDB ao backend atual e isolar o acesso a dados com validação. *(Status: CONCLUÍDO)*

- [x] **Instalação do Driver MongoDB:** Adicionada a biblioteca `motor` e variável `MONGO_URI`.
- [x] **Padrão Repository (Data Access):** Criado `LetrasRepository` isolado na pasta de domínio.
- [x] **Validação de Schema (Pydantic):** Criado `LetraSchema` com tipagem rigorosa.
- [x] **Connection Pooling e Índices:** Reuso do client MongoDB via ciclo de vida (`lifespan`) e índice de busca em `O(1)`.

## 🎯 Épico 2: Orquestração e Semeamento 100% Background (Backend FastAPI)
**Objetivo:** Alimentar a fila do MongoDB estritamente via robô rodando em background (trabalho assíncrono), respeitando o limite diário de processamento do Go.

- [ ] **O Robô Semeador Aleatório (`tasks.py`):**
  - Criar a função `robo_semeador_letras()` agendada para rodar diariamente às **05:00 da manhã**.
  - O robô selecionará **aleatoriamente** até 100 faixas da tabela `tracks_cache` do PostgreSQL que ainda não existam na coleção de letras do MongoDB.
  - Inserir essas músicas selecionadas no MongoDB com o status inicial de `PENDENTE`.
  - Disparar um `POST` para o endpoint `/trigger` da API em Go, avisando que o lote diário está pronto para raspagem lenta.
- [ ] **Endpoint de Leitura Simples (`GET /api/v1/letras/{id_musica}`):**
  - O endpoint de consumo fará **apenas** leitura passiva. Não haverá inserção reativa desencadeada pelo clique do usuário.
  - Se a letra existir no Mongo e estiver `CONCLUIDO`, retorna a letra imediatamente (<10ms).
  - Se estiver `PENDENTE/PROCESSANDO`, retorna `202 Accepted`.
  - Se não existir na base de dados ou estiver `NAO_ENCONTRADA`, retorna `404 Not Found`. O frontend exibirá uma mensagem genérica amigável e aguardará até que o robô faça a varredura no futuro.

## 🎯 Épico 3: Consumo e Gerenciamento de Estado (Frontend Angular)
**Objetivo:** Eliminar o antigo fluxo "Real-time" (SSE) em favor de um consumo HTTP simples e assíncrono ("Fire and Forget").

- [ ] **Consumo Simples e Resiliente:**
  - O Angular fará uma única requisição HTTP para a API ao abrir a aba de letras.
  - Se receber um `202 Accepted` (processando) ou `404 Not Found`, a UI deve aceitar isso como estado final daquela requisição, sem usar conexões abertas (WebSockets ou SSE).
- [ ] **Store / Cache Otimizado:**
  - Salvar as respostas no cache em memória (RxJS/Signals) para evitar novas requisições se o usuário fechar e abrir a mesma letra na mesma sessão.

## 🎯 Épico 4: UI/UX e Design System de "Encomenda" (Frontend Angular)
**Objetivo:** Informar o usuário de maneira elegante que o sistema opera em segundo plano.

- [ ] **UI States Ouro (Feedback Assíncrono):**
  - `PENDENTE/PROCESSANDO` (Status 202): Substituir o antigo *Skeleton Loader* infinito por uma arte agradável ou ícone amigável com a mensagem: *"Ainda não temos essa letra, mas nossos robôs já foram escalados para caçá-la. Volte em breve!"*
  - `NAO_ENCONTRADA` (Status 404): Arte informando indisponibilidade definitiva na internet.
- [ ] **Motor de Parsing e Karaokê:**
  - Manter o algoritmo de Parsing LRC e a sincronia 60FPS com o GSAP para reproduzir perfeitamente as letras que possuem `sincronizada: true`.

## 🎯 Épico 5: Bancada de Testes Automáticos (QA / Cultura DevOps)
**Objetivo:** Garantir a estabilidade da orquestração de cotas.

- [ ] **Testes Unitários (Pytest e Vitest):**
  - **Back:** Testar a lógica do `robo_semeador_letras` garantindo que o teto diário nunca seja furado.
  - **Front:** Testar a renderização condicional do novo Card de "Letra Encomendada".
- [ ] **Testes E2E (Playwright):**
  - Simular o clique em uma música inexistente no Mongo, garantindo a exibição do UI State adequado.
