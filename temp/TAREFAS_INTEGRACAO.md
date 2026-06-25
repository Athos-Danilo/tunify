# 📋 Tarefas de Desenvolvimento: Integração Padrão Ouro (Backend Principal ↔ Microserviço Tunify Letras)

Este documento detalha o plano de ação granular para integrar o ecossistema central (Backend em FastAPI e Frontend em Angular) ao microserviço **Tunify Letras**. Seguindo o **Padrão Ouro do Mercado**, a arquitetura será focada em alta resiliência (tolerância a falhas), desacoplamento e comunicação reativa.

> **💡 Diretriz de Arquitetura (Vertical Slicing):** Todo o código e infraestrutura (Schemas, Repositories, Services, etc.) referentes a esta integração (e as futuras que virão) devem ser preferencialmente centralizados e isolados dentro de pastas de domínio próprio, como `app/api_tunify_liricys/`. O objetivo é evitar espalhar a lógica pelo projeto e manter as responsabilidades altamente coesas e organizadas.

---

## 🎯 Épico 1: Setup da Camada de Dados e Modelagem Estrita (Backend FastAPI)
**Objetivo:** Integrar o MongoDB ao backend atual (que hoje roda apenas PostgreSQL) e isolar o acesso a dados, garantindo validação de tipos com Pydantic.

- [x] **Instalação do Driver MongoDB:**
  - Adicionar e instalar a biblioteca assíncrona `motor` no `requirements.txt` para conectar o FastAPI ao MongoDB do microserviço.
  - Atualizar o arquivo `.env` do backend principal para receber a variável `MONGO_URI`.
- [x] **Padrão Repository (Data Access):**
  - Criar um `LetrasRepository` para encapsular todas as operações do MongoDB (`motor`). O resto da aplicação não deve saber os detalhes do driver.
- [x] **Validação de Schema (Pydantic):**
  - Implementar a validação estrita usando o **Pydantic** (`BaseModel`), garantindo o espelho perfeito do schema da coleção `Letras`:
    ```python
    from pydantic import BaseModel
    from typing import Optional, Literal
    from datetime import datetime

    class LetraSchema(BaseModel):
        id_musica_spotify: str
        id_usuario: str
        nome_musica: str
        nome_artista: str
        status: Literal["PENDENTE", "PROCESSANDO", "CONCLUIDO", "NAO_ENCONTRADA"]
        texto_letra: Optional[str] = None
        sincronizada: bool = False
        fonte_letra: Optional[str] = None
        tentativas_processamento: int = 0
        criado_em: datetime
        atualizado_em: datetime
    ```
- [x] **Connection Pooling e Índices:**
  - Garantir o reaproveitamento do client MongoDB via ciclo de vida (`lifespan`) do FastAPI.
  - Verificar se a coleção `Letras` possui índices no campo `id_musica_spotify` para garantir a busca instantânea em `O(1)`.

## 🎯 Épico 2: Orquestração, Semeamento e Mensageria (Backend FastAPI)
**Objetivo:** Coordenar o "semeamento" no banco e a chamada tolerante a falhas para a API em Go.

- [ ] **Serviço de Semeamento (Seeding Service):**
  - Interceptar o evento de "Música Tocada". Se não existir na coleção, o FastAPI salva o documento com `status: PENDENTE` usando `motor`.
- [ ] **Client HTTP Resiliente com HTTPX:**
  - Criar o serviço usando `httpx` (já presente no projeto) para chamar o `POST /trigger` do microserviço Go.
  - **Retries e Tolerância a Falhas:** Configurar retries assíncronos. Se o microserviço Go na nuvem cair ou der timeout, o FastAPI não deve quebrar a execução; ele absorve o erro e deixa a música na fila para o Cron Job (que roda sozinho de tempos em tempos) buscar depois.
- [ ] **Endpoints RESTful Padronizados:**
  - Criar rota `GET /api/v1/letras/{id_musica}`: Retorna a letra cacheada do banco (<10ms). Responde `404` caso seja `NAO_ENCONTRADA` ou `202 Accepted` caso esteja `PENDENTE/PROCESSANDO`.

## 🎯 Épico 3: Arquitetura Reativa e Real-Time (SSE)
**Objetivo:** Eliminar o "refresh" manual pelo usuário e entregar uma experiência instantânea usando Server-Sent Events (SSE).

- [ ] **Infraestrutura Real-Time (SSE com sse-starlette):**
  - Adicionar a biblioteca `sse-starlette` ao backend FastAPI. SSE é ideal (unidirecional e leve) para enviar o aviso de conclusão ao Angular.
  - Criar uma rota (ex: `GET /api/v1/letras/stream/{id_musica}`) onde o Angular se conecta para ouvir os eventos em tempo real.
- [ ] **Push Notification via Change Streams:**
  - O FastAPI deve escutar o *Change Stream* do MongoDB. Quando o microserviço Go alterar o `status` daquela música para `CONCLUIDO`, o FastAPI dispara imediatamente o evento SSE avisando o Angular que a letra está pronta.

## 🎯 Épico 4: Gerenciamento de Estado e Reatividade (Frontend Angular)
**Objetivo:** Manter a consistência de dados no Angular e consumir o SSE perfeitamente usando a força do RxJS.

- [ ] **Conexão Resiliente (RxJS e SSE):**
  - Usar a API de `EventSource` integrada com `Observable` do `RxJS`. Quando o SSE avisar que a letra está pronta, fechar a conexão suavemente e engatilhar a atualização da tela.
- [ ] **Store / Cache Otimizado:**
  - Implementar sistema de cache em memória usando Services do Angular (`BehaviorSubject` ou Signals). Se o usuário tocar, pausar, e voltar para a mesma música, a letra já estará no cache do front, sem nova requisição HTTP.

## 🎯 Épico 5: Design System e Componentes Visuais (Frontend Angular)
**Objetivo:** Componentes desacoplados com alto desempenho e animações fluidas (usando GSAP).

- [ ] **UI States Ouro (Skeleton e Empty States):**
  - `PENDENTE/PROCESSANDO`: Nunca exibir texto estático "Carregando...". Usar **Skeleton Loaders** animados e brilhantes (Shimmer effect) imitando o desenho de blocos de texto.
  - `NAO_ENCONTRADA`: Arte ou ícone amigável informando ausência de dados, mantendo a tela limpa.
- [ ] **Motor de Parsing e Karaokê Otimizado:**
  - **Parsing LRC Seguro:** Algoritmo que quebra os blocos de tempo (`[00:10.50]`) de forma segura.
  - **Sincronia 60FPS com GSAP:** Usar o `gsap` (já instalado no projeto) para aplicar animações de `transform` e `opacity` no destaque da frase cantada, evitando reflows de navegador e garantindo que não haja engasgos durante a execução.

## 🎯 Épico 6: Bancada de Testes Automáticos (QA / Cultura DevOps)
**Objetivo:** Garantir a estabilidade de longo prazo integrando às ferramentas que o projeto já possui.

- [ ] **Testes Unitários (Pytest e Vitest):**
  - **Back (`pytest`):** Testar a resiliência do Client `httpx` forçando falhas (Mock) da API Go para garantir que o FastAPI não apresente pane e crie o registro PENDENTE corretamente (Mock do `motor`).
  - **Front (`vitest`):** Testar intensamente a função de Parsing LRC do Angular para garantir que os tempos extraídos estão corretos e que tags inválidas não quebram o visualizador.
- [ ] **Testes End-to-End (E2E) com Playwright:**
  - Expandir a infraestrutura existente do `playwright.config.ts`.
  - **Cenário de Sucesso Reativo:** Simular no navegador uma tela de música `PENDENTE`, mockar a chegada de um evento Web/SSE indicando `CONCLUIDO`, e usar asserções para provar que a letra colorida substituiu o *Skeleton Loader* magicamente.
