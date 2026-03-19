**Nome do Projeto:** Tunify 

**Slogan:** "A matemática da sua vibe."

**Versão:** 1.0.3

**Status:** Desenvolvimento

**Data da Atualização:** 19/03/2026

---

## **1. Visão Geral do Produto**

O **Tunify** é uma plataforma de "Engenharia Musical" e curadoria algorítmica que estende as capacidades nativas do ecossistema Spotify. Enquanto plataformas de streaming tradicionais focam em recomendações baseadas em popularidade ou gênero, o Tunify utiliza **Ciência de Dados (Data Science)** e **Teoria dos Grafos** para oferecer controle granular sobre a experiência auditiva.

O sistema empodera o usuário ("Power User") a atuar como um arquiteto de suas próprias playlists. Através de ferramentas que traduzem sentimentos abstratos em vetores matemáticos (Valência, Energia, Tempo), o Tunify permite a criação de jornadas sonoras coesas, descoberta de artistas "Lado B" através de similaridade vetorial e automação de playlists baseadas em contexto (clima, localização e tempo).

---

## **2. Decisões Técnicas e Arquitetura**

O Tunify adota uma arquitetura **Client-Server Desacoplada**, operando com um frontend SPA (Single Page Application) reativo e um backend estruturado como um **Monolito Modular em Camadas** (N-Tier). Essa abordagem garante a separação estrita de responsabilidades — isolando a interface de usuário, as rotas, as complexas regras de negócio matemáticas e o acesso a dados — sem a sobrecarga inicial de infraestrutura de microsserviços puros. A persistência de dados utiliza uma abordagem híbrida, combinando a integridade relacional do PostgreSQL com a altíssima velocidade em memória do Redis para cache de vetores e controle de tráfego, formando um ecossistema escalável, testável e de alta coesão.

### **2.1. Stack Tecnológica**

#### **Frontend: Angular (v17+) com TypeScript**

* **Justificativa Arquitetural:** O Angular foi escolhido por ser um framework "opinado" e estruturado, ideal para aplicações empresariais complexas. Diferente de bibliotecas focadas apenas em visualização, o Angular oferece um ecossistema completo.  
* **Gerenciamento de Estado Reativo (RxJS):** A aplicação exige manipulação de fluxos de dados em tempo real (progresso do player, atualizações de WebSocket, mudança de estado de autenticação). O uso de Observables e Signals permite que a interface reaja a essas mudanças de forma fluida e performática, sem "prop drilling" excessivo.  
* **Design System:** Utilização do **Angular Material** para garantir acessibilidade, responsividade e consistência visual profissional.

#### **Backend: Python 3.12+ (FastAPI)**

* **Processamento de Dados e IA:** Python é a linguagem nativa da Ciência de Dados. O uso de bibliotecas como **Pandas** e **Scikit-learn** é mandatório para realizar cálculos vetoriais complexos (Distância Euclidiana, K-Means Clustering) necessários para a recomendação de músicas.  
* **Alta Performance (ASGI):** O framework FastAPI permite processamento assíncrono real. Isso é crucial para lidar com I/O bound (milhares de requisições externas à API do Spotify) sem bloquear a thread principal do servidor, garantindo baixa latência.  
* **Tipagem e Documentação:** O uso de **Pydantic** garante validação rigorosa de dados em tempo de execução e gera automaticamente a documentação Swagger (OpenAPI), facilitando a integração com o Frontend.

#### **Banco de Dados: PostgreSQL**

* **Integridade Relacional:** O sistema lida com entidades fortemente conectadas (Usuários, Playlists, Histórico de Gerações). O modelo relacional (SQL) garante a integridade referencial dos dados e permite consultas analíticas complexas (ex: "Quais gêneros o usuário mais rejeitou no último mês?").

#### **Cache e Filas: Redis**

* **Cache de Metadados:** Armazenamento temporário de *Audio Features* (dados imutáveis de músicas) para reduzir drasticamente o consumo de cota da API do Spotify e acelerar a geração de playlists.  
* **Gerenciamento de Rate Limit:** Controle centralizado de requisições para evitar o bloqueio (429 Too Many Requests) por parte do Spotify.

---

## **3. Requisitos Funcionais (RF)**

As funcionalidades foram organizadas em módulos lógicos para facilitar o desenvolvimento.

### **Módulo 1: Core, Autenticação & UI**

* **RF01 - Autenticação OAuth2 (Authorization Code):** O sistema deve realizar login exclusivamente via Spotify, sem armazenamento de senhas locais. Deve-se solicitar escopos para leitura de biblioteca, criação de playlists e controle de playback.  
* **RF02 - Sincronização de Perfil:** Ao logar, o sistema deve calcular e exibir o "Vibe Profile" inicial do usuário (média matemática de suas últimas 50 reproduções).  
* **RF03 - Logout e Revogação:** Capacidade de desconectar a sessão e limpar dados sensíveis do armazenamento local.
* **RF04 - Theme Switcher (Modo Claro/Escuro):** O sistema deve oferecer um toggle na interface do usuário (ex: no cabeçalho ou menu de perfil) permitindo alternar dinamicamente entre a paleta "Dark Mode" (padrão) e "Light Mode". A preferência escolhida deve ser persistida localmente (via localStorage do navegador) para garantir que a escolha seja mantida em acessos futuros.

### **Módulo 2: Vibe Architect (O Criador de Jornadas)**

* **RF05 - Curva de Energia Dinâmica:** O usuário deve definir, via interface gráfica (gráfico interativo ou sliders), o ponto de partida (ex: Calmo) e o ponto de chegada (ex: Agitado) da playlist.  
* **RF06 - Filtros de Exclusão:** Opção para "banir" gêneros ou artistas específicos da geração atual.  
* **RF07 - Seletor de "Lado B" (Discovery Mode):** Um controle que altera o peso do algoritmo para priorizar faixas com baixo índice de popularidade (popularity < 30), ignorando hits comerciais.  
* **RF08 - Preview Interativo:** Listagem prévia das faixas sugeridas com player de áudio (30s) embutido e opção de remoção manual de faixas indesejadas antes do salvamento.
* **RF09 - Modo Caos (Montanha-Russa Matemática):** A interface de criação de playlists deve incluir um toggle "Modo Caos". Ao ativá-lo, o sistema alertará o usuário de que a playlist terá níveis de agitação extremamente variáveis. O usuário poderá selecionar as "Sementes" (artistas/gêneros base), e o sistema montará uma jornada de alto contraste emocional. Antes de salvar, o frontend exibirá um gráfico de linha ilustrando os picos e vales de energia da playlist gerada.

### **Módulo 3: Discovery (Exploração Avançada)**

* **RF10 - Deep Dive Discovery (Espelho do Artista):** O usuário seleciona "Sementes" (ex: 3 músicas do Justin Bieber). O sistema deve buscar artistas relacionados, mas filtrar apenas aqueles que correspondem à assinatura acústica das sementes e possuem baixa popularidade (artistas similares desconhecidos).  
* **RF11 - Sonic Time Travel (Túnel do Tempo):** Funcionalidade que preserva o gosto musical atual do usuário (gêneros/vibe), mas restringe a busca a um intervalo de anos específico (ex: "Meu gosto Pop atual, mas apenas músicas de 1980-1989").  
* **RF12 - Refinamento de Tendências:** Capacidade de importar uma playlist pública (ex: "Top 50 Brasil") e regenerá-la mantendo apenas as faixas que possuem similaridade matemática com o perfil do usuário, removendo o que foge do seu gosto.
* **RF13 - Enciclopédia de Gêneros:** O sistema deve oferecer um dicionário interativo e visual de gêneros musicais. Ao clicar em um gênero no Dashboard, o usuário verá um "Flashcard" ou "Card de Trivia" contendo informações de consumo rápido: Origem (década/região), BPM médio, instrumentos característicos e uma curiosidade histórica. O objetivo é ser educativo de forma dinâmica, evitando textos acadêmicos longos.

### **Módulo 4: Context & Automation (Contexto e Automação)**

* **RF14 - DJ do Clima (Weather Integration):** O sistema deve capturar a geolocalização do usuário, consultar uma API de Clima (OpenWeatherMap) e traduzir a condição (Chuva, Sol, Neve) em parâmetros de áudio (Acústico, Valência alta, etc.) para gerar uma playlist instantânea.  
* **RF15 - Smart Limits (Limites Inteligentes):** O usuário define o tamanho da playlist por **Quantidade de Faixas** (ex: 50 músicas) OU por **Duração Temporal** (ex: "Quero uma playlist de exatamente 2 horas e 15 minutos").  
* **RF16 - Playlists Vivas (Cron Jobs):** O usuário pode marcar uma playlist gerada como "Viva". O sistema deve agendar uma tarefa semanal para atualizar automaticamente o conteúdo dessa playlist no Spotify com novas recomendações, sem intervenção manual.
* **RF17 - Relógio Biológico (Time-of-Day Context):** O sistema deve oferecer suporte à geração de playlists baseadas no horário local do usuário (Manhã, Tarde, Noite, Madrugada). Esta funcionalidade pode atuar de forma isolada ou em conjunto com o "DJ do Clima" (RF13), criando contextos altamente específicos (ex: "Madrugada Chuvosa" vs. "Tarde Ensolarada").

### **Módulo 5: Gestão e Player**

* **RF18 - Exportação para o Spotify:** Botão para efetivar a criação da playlist na conta do usuário.  
* **RF19 - Web Player SDK:** Controle remoto completo (Play, Pause, Skip, Seek) de qualquer dispositivo ativo do usuário diretamente pelo dashboard do Tunify.  
* **RF20 - Controle de Visibilidade (Privacy Toggle):** No painel de configuração antes da geração final da playlist, o sistema deve fornecer um toggle (interruptor booleano) permitindo ao usuário definir se a playlist criada no Spotify será Pública ou Privada (public: true ou false).
* **RF21 - Módulo de Compartilhamento (Social Share):** Após a criação com sucesso, se a playlist for marcada como Pública, a interface deve exibir um componente de compartilhamento. Este componente deve utilizar a Clipboard API (para copiar o link direto) e a Web Share API (para deep links com WhatsApp, X/Twitter e Instagram Stories). Se a playlist for Privada, o módulo de compartilhamento deve ficar desabilitado visualmente, exibindo um tooltip explicativo para o usuário.
* **RF22 - Tratamento de Contas Free (Fallback de Playback):** O sistema deve verificar o status da assinatura do usuário (parâmetro product do Spotify). Para contas "Premium", o RF18 (Web Player) funcionará normalmente. Para contas "Free", o sistema deve ocultar o player embutido e exibir um botão de ação primária (Deep Link) redirecionando o usuário para escutar a playlist gerada diretamente no aplicativo oficial do Spotify.

### **Módulo 6: Analytics & Insights (Dashboard)**

Ferramentas de visualização de dados para o usuário entender seus próprios hábitos.

* **RF23 - Dashboard "DNA Musical":** Visualização de dados (Spider Charts) comparando o gosto do usuário com a média global ou com a playlist gerada.
* **RF24 - Vibe Radar (Gráfico de Aranha):** Visualização pentagonal comparando os 5 atributos médios do usuário (Energia, Valência, Dançabilidade, Acústica, Instrumentalidade) contra a média global do sistema.  
* **RF25 - Top Genres (Pie Chart):** Como o Spotify não fornece gênero por *música*, o sistema deve calcular isso agregando os gêneros dos *artistas* das 50 faixas mais ouvidas.  
* **RF26 - Calculadora de Tempo (Library Stats):** O sistema deve percorrer as faixas salvas do usuário (paginação de 50 em 50) para somar a duração total (`duration_ms`) e exibir: *"Você levaria 14 dias ininterruptos para ouvir toda sua biblioteca"*.  
* **RF27 - Linha do Tempo de Popularidade:** Um gráfico de linha mostrando se o gosto do usuário tem ficado mais "Mainstream" (Popularidade alta) ou mais "Underground" ao longo dos últimos 6 meses.
* **RF28 - Tunify Festival Pass (Social Share Ticket):** O sistema deve possuir um gerador de imagens dinâmico que transforma as estatísticas do usuário em um ingresso virtual de festival. O componente visual deve exibir: O "Line-up" (Top 5 Artistas ou Gêneros), O "Tempo de Show" (Minutos ouvidos) e O "Palco/Vibe" (Média de energia/valência). O usuário poderá alternar entre variantes de cores predefinidas (Temas do ingresso) na interface. O Angular deverá converter este componente HTML/CSS em um arquivo de imagem (.png/.jpeg) para download e compartilhamento nas redes sociais.
* **RF29 - Métrica "Super Fã" (Loyalty Score):** O Dashboard deve exibir uma métrica de lealdade para os artistas mais ouvidos, indicando a concentração de faixas daquele artista na biblioteca pessoal do usuário.
* **RF30 - Análise Demográfica de Artistas (Gender Breakdown):** O sistema deve analisar as faixas mais ouvidas/curtidas do usuário e apresentar a distribuição demográfica dos artistas (Masculino, Feminino, Banda/Grupo, Não-Binário/Outros) através de um gráfico de rosca (Donut Chart) no Dashboard. A interface deve gerar um *insight* dinâmico em texto baseado na predominância (ex: "Seu fone de ouvido é dominado por vozes femininas!").

---

## **4. Regras de Negócio (RN)**

*As leis matemáticas, lógicas e restrições que o Backend (Python) deve seguir rigorosamente.*

### **Lógica de Autenticação e Segurança**

* **RN01 - Rotação de Tokens (Security):** O *Access Token* do Spotify expira em 1 hora. O sistema deve implementar um *Middleware* que verifica a validade do token antes de qualquer chamada à API externa. Se expirado, deve usar o *Refresh Token* (armazenado criptografado no banco) para obter um novo silenciosamente, garantindo sessão contínua.

### **Algoritmos de Recomendação ("The Vibe Math")**

* **RN02 - Cálculo de Similaridade (Distância Euclidiana):** Para encontrar músicas "parecidas" ou "Lado B", o sistema deve tratar cada música como um vetor multidimensional.  
  * *Fórmula:* d(A, B) = √((Energy_A - Energy_B)² + (Valence_A - Valence_B)² + (Dance_A - Dance_B)²)  
  * Quanto menor a distância d, mais similar é a vibe da música.  
* **RN03 - Interpolação Linear de Energia:** Quando o usuário define uma curva (ex: Começar em 0.2 e terminar em 0.8 ao longo de 10 músicas), o algoritmo deve calcular os "degraus" ideais.  
  * *Lógica:* TargetEnergy_i = Start + (End - Start) * (i / TotalTracks)  
  * O sistema buscará no banco de cache ou na API músicas que possuam energia próxima a TargetEnergy_i para a posição i da playlist.  
* **RN04 - Mixagem Harmônica (Camelot Wheel):** Para transições suaves (sem choque sonoro), o sistema deve respeitar a compatibilidade de Tonalidade (*Key* e *Mode*).  
  * *Regra:* Se a música atual é **8B** (Dó Maior), a próxima deve ser **8B** (Mesmo tom), **7B** (Quarta abaixo), **9B** (Quinta acima) ou **8A** (Relativa menor).  
  * *Conversão:* O sistema deve converter o integer da API do Spotify (0-11) para a notação Camelot antes de filtrar.
* **RN05 - Algoritmo do Modo Caos (Outlier Injection):** Quando o RF09 for ativado, o Backend não deve gerar uma lista aleatória. A lógica matemática consistirá em buscar músicas que correspondam às sementes do usuário, mas interpolando propositalmente faixas que sejam o inverso matemático (vetores opostos) da faixa anterior em termos de energy e valence. Exemplo: Uma faixa com Energy 0.9 deve ser imediatamente seguida por uma faixa com Energy < 0.3, criando um padrão de onda (senoide) de alto contraste.

### **Lógica de Contexto e Automação**

* **RN06 - Limites Inteligentes (Time-Boxing):** * *Por Quantidade:* Loop simples até atingir N faixas.  
  * *Por Duração:* O sistema deve somar o duration_ms de cada música adicionada. O loop encerra quando SomaAtual >= DuraçãoAlvo - MargemDeErro (ex: 2 min).  
* **RN07 - Tradução Climática (Weather Mapping):** O Backend deve possuir uma tabela de conversão para a funcionalidade "DJ do Clima":  
  * *Chuva/Tempestade:* Energy < 0.5, Acousticness > 0.6, Valence < 0.4.  
  * *Sol/Céu Limpo:* Energy > 0.7, Valence > 0.8, Mode = 1 (Maior).  
  * *Neve/Frio:* Tempo < 100 BPM, Instrumentalness > 0.2.
* **RN08 - Captura Silenciosa de Localização (IP Geolocation):** Para viabilizar as funcionalidades de Clima (RF13) e a "Sede" do Festival Pass (RF27) sem prejudicar a experiência do usuário com pop-ups intrusivos, o Backend deve implementar um fallback de geolocalização por IP. O sistema consultará uma API externa (ex: ip-api) no momento do login para determinar a Cidade/Estado do usuário.
* **RN09 - Matemática do Tempo (Time-of-Day Weights):** Quando o RF16 for ativado, o algoritmo aplicará os seguintes modificadores aos vetores alvo:
  * *Manhã (06h-12h):* Bônus em energy (>0.7) e valence.
  * *Madrugada (00h-05h):* Redução drástica em energy (<0.4) e bônus em acousticness.

#### **Gestão Inteligente de Dados e Performance (Data Strategy)**

* **RN10 - Inferência de Gêneros (Data Aggregation):** * *Problema:* A API do Spotify não fornece o gênero musical diretamente no objeto "Música" (Track), apenas no objeto "Artista".  
  * *Lógica:* Para gerar estatísticas precisas (ex: "Você ouve 40% Pop"), o sistema deve aplicar um algoritmo de agregação:  
    1. Para cada música no histórico, identificar o Artista Principal.  
    2. Buscar a lista de gêneros desse artista (ex: `["pop", "canadian pop"]`).  
    3. Atribuir peso fracionado à música (se o artista tem 2 gêneros, a música conta 0.5 para cada um).  
    4. Consolidar os resultados no Gráfico de Pizza do Dashboard.  
* **RN11 - Estratégia Híbrida de Cache (Dataset & Lazy Loading):** * *Contexto:* O endpoint de `audio-features` (que fornece dados matemáticos como energia e valência) possui limites rígidos de requisições (Rate Limit), o que inviabilizaria a análise de grandes bibliotecas em tempo real.  
  * *Solução (Arquitetura de Dados):* O Tunify implementará uma estratégia de **Cold Start** baseada em Datasets.  
    1. **Seeding (ETL Inicial):** Na implantação do sistema, a tabela `tracks_cache` será pré-populada com o "Spotify 1 Million Tracks Dataset" (fonte externa/Kaggle), inserindo instantaneamente os vetores matemáticos de 1 milhão de músicas populares.  
    2. **Cache Look-aside Pattern:** Ao analisar uma playlist:  
       * **Passo A:** O Backend consulta o banco local (PostgreSQL). Se a música existir (Cache Hit), o retorno é imediato (latência zero).  
       * **Passo B:** Se a música for nova ou obscura (Cache Miss), o sistema consome a API do Spotify, entrega o dado ao usuário e, *assincronamente*, salva esse novo vetor no banco para consultas futuras.
* **RN12 - Hierarquia de Classificação de Gêneros (Genre Fallback):**
  * *Problema:* A API oficial classifica apenas Artistas, gerando imprecisão em faixas experimentais (ex: um Artista de Rock lançando uma balada acústica).  
  * *Lógica de Prioridade:* Ao classificar uma música para o Dashboard, o sistema deve seguir a ordem:  
    1. **Dataset Local (Preciso):** Se a música consta no "Spotify 1M Dataset" importado, usa-se o gênero específico da faixa (ex: "Classic Rock").  
    2. **Inferência de Artista (Aproximado):** Se a música não está no Dataset (é um lançamento novo), o sistema consulta a API do Spotify para pegar os gêneros do Artista e atribui à música (ex: Artista "Metallica" -> Música recebe "Metal").  
    3. **Tag "Unclassified":** Se nenhuma fonte tiver dados, marca como "Desconhecido" para não quebrar os gráficos.
* **RN13 - Janelas de Tempo de Estatísticas (Time Ranges):** A geração do "Festival Pass" (RF27) e dos gráficos do Dashboard não devem armazenar dados contínuos de playback no banco local para economizar processamento. O sistema deve consumir os endpoints /me/top/tracks e /me/top/artists do Spotify, utilizando estritamente os parâmetros nativos de time_range: short_term (Último mês), medium_term (Últimos 6 meses) e long_term (Histórico total).
* **RN14 - Cálculo Seguro de Lealdade (Anti-Rate Limit):** Para calcular a métrica "Super Fã" (RF28) sem estourar o limite de requisições da API buscando a discografia completa de um artista, o cálculo será estritamente interno. Fórmula: (Quantidade de músicas do Artista X salvas pelo usuário) / (Total de músicas na biblioteca do usuário) * 100.
* **RN15 - Agrupamento do Ingresso (Line-up Logic):** Para a renderização do RF27 (Festival Pass), o sistema utilizará a inferência de gêneros (RN10) para agrupar os Top Artistas sob o título do gênero musical que os representa, simulando os "Palcos" de um festival (ex: Palco Pop, Palco Sertanejo).
* **RN16 - Enriquecimento de Dados Demográficos (Artist Identity):** Como a API do Spotify não fornece o gênero ou pronome dos artistas, o Backend deve implementar um sistema de enriquecimento de dados. 
  * *Lógica:* Ao analisar o histórico do usuário, o sistema extrai os IDs dos artistas e consulta uma enciclopédia musical aberta (ex: MusicBrainz API ou Wikidata) para descobrir o `type` (Person, Group) e o `gender` (Male, Female, etc.).
  * *Estratégia de Cache:* Para evitar latência e bloqueios de requisições de terceiros, o resultado dessa consulta deve ser salvo permanentemente na tabela local `artists_cache`. Consultas futuras para o mesmo artista serão resolvidas instantaneamente via banco de dados relacional.
* **RN17 - Geração Dinâmica do Dicionário:** O Spotify possui milhares de micro-gêneros dinâmicos. O Backend não deve ser pré-populado com textos fixos. 
  * *Lógica:* Quando um usuário requisitar informações de um gênero específico, o Backend fará uma busca assíncrona em uma fonte externa (ex: Wikipedia API ou um prompt estruturado via LLM API) solicitando um resumo padronizado.
  * *Estratégia de Cache:* O resumo gerado será salvo na tabela `genres_dictionary`. Consultas subsequentes de qualquer usuário para aquele mesmo gênero consumirão apenas o banco de dados local (Cache Hit), garantindo alta velocidade e custo zero de API externa.
---

## **5. Requisitos Não-Funcionais (RNF)**

*Critérios de qualidade técnica e restrições de infraestrutura.*

### **Performance e Escalabilidade**

* **RNF01 - Latência de Resposta:** Endpoints de leitura local (Dashboard) devem responder em < 150ms. Endpoints de Geração de Playlist (que dependem da API externa) devem responder o *status* do Job em < 200ms, delegando o processamento para *Background Tasks*.  
* **RNF02 - Cache Strategy (Redis):** Dados imutáveis de músicas (*Audio Features*) devem ter TTL (Time-To-Live) de 30 dias no Redis. Perfis de usuário devem ter TTL de 1 hora.

### **Segurança**

* **RNF03 - Criptografia em Repouso:** Tokens sensíveis (*Refresh Token*) devem ser criptografados no banco de dados usando algoritmos robustos (ex: Fernet/AES-256) via biblioteca de criptografia do Python.  
* **RNF04 - Tratamento de Rate Limit (Circuit Breaker):** Se o Spotify retornar erro 429 (Too Many Requests), o sistema deve interromper chamadas externas para aquele usuário por X segundos (Exponential Backoff) e notificar o Frontend, em vez de falhar silenciosamente.

### **Acessibilidade e Experiência do Usuário (UI/UX)**

* **RNF05 - Arquitetura de Theming:** A alternância de temas deve ser desenvolvida utilizando variáveis CSS nativas (Custom Properties) e as capacidades de Theming do Angular Material. A arquitetura deve garantir que não haja recarregamento da página ao trocar o tema e que ambas as paletas respeitem as regras de contraste visual para leitura confortável.

### **Segurança**

* **RNF06 - Estratégia de Keep-Alive (Prevenção de Cold Start):** Para garantir a execução ininterrupta das rotas de automação e Playlists Vivas (RF15) em ambientes de hospedagem com planos gratuitos (como o Render), o Backend deve expor um endpoint de Health Check (ex: GET /health). Um serviço externo de monitoramento (ex: UptimeRobot ou cron-job.org) será configurado para realizar pings HTTP periódicos (ex: a cada 14 minutos) neste endpoint, impedindo a hibernação por inatividade do contêiner da aplicação.

---

## **6. Qualidade de Software e Testes Automatizados**

Para garantir a estabilidade do ecossistema, prevenção de regressões e segurança do código, o Tunify implementa a estratégia da Pirâmide de Testes.

### **6.1. Backend (Python/FastAPI)**
* **Ferramenta Principal:** `pytest` integrado ao `TestClient` do FastAPI.
* **Testes Unitários:** Focados nos serviços core, especialmente nos algoritmos de recomendação (`recommendation.py`), cálculos de distância euclidiana e conversões de tonalidade (Camelot Wheel). A meta é garantir que a lógica matemática responda com precisão aos vetores de entrada.
* **Testes de Integração:** Simulação de chamadas aos endpoints (ex: `POST /generate-playlist`) e testes de resiliência utilizando `mocking` para simular as respostas e falhas (Rate Limits, 500) da API externa do Spotify, garantindo que o `Circuit Breaker` funcione.

### **6.2. Frontend (Angular 17+)**
* **Testes de Componente/Unidade (Jasmine/Jest):** Isolamento de componentes visuais e testes de serviços RxJS (Observables) para garantir que o estado da aplicação (ex: progresso do player, tema selecionado) seja atualizado corretamente sem depender do backend real.
* **Testes End-to-End / E2E (Cypress ou Playwright):** Automação de fluxos críticos de usuário interagindo com o navegador real. Cobertura obrigatória para:
  1. Fluxo de Autenticação OAuth.
  2. Ajuste de sliders no "Vibe Architect" e submissão.
  3. Renderização correta dos gráficos (Donut Charts/Radar) no Dashboard após o recebimento dos dados.

---

## **7\. Arquitetura do Sistema**

O projeto segue uma arquitetura baseada em **Camadas (Layered Architecture)** dentro de um contexto de microsserviço monolítico, separando claramente responsabilidades.

### **Backend (Python / FastAPI)**

*Foco: Regras de Negócio, Processamento Matemático e Orquestração de APIs.*

Plaintext  
/backend  
  /app  
    /api                 \# Interface Pública (Controllers)  
      /v1  
        /endpoints  
          auth.py        \# Rotas de Login/Callback  
          generator.py   \# Rota para criar playlists (Curves, Weather)  
          discovery.py   \# Rota para "Lado B" e "Seeds"  
          users.py       \# Dados do Dashboard  
      
    /core                \# Configurações Globais  
      config.py          \# Variáveis de Ambiente (.env)  
      security.py        \# Criptografia de Tokens e Hashing  
      database.py        \# Conexão SQLAlchemy e Sessão DB  
      
    /models              \# Tabelas do Banco (ORM)  
      user.py            \# Model User  
      generation.py      \# Model PlaylistHistory  
      track\_cache.py     \# Model TrackFeatures  
      
    /schemas             \# Validação de Dados (Pydantic / DTOs)  
      playlist\_req.py    \# Schema de entrada (Curve settings)  
      user\_dto.py        \# Schema de saída (Profile data)  
      
    /services            \# A Lógica Pesada (Regras de Negócio Isoladas)  
      spotify.py         \# Cliente HTTP para falar com o Spotify  
      recommendation.py  \# Algoritmos (Euclidiana, K-Means)  
      camelot.py         \# Conversão de Tonalidades  
      weather.py         \# Integração OpenWeatherMap  
      
    main.py              \# Inicialização do App

### **Frontend (Angular 17+)**

*Foco: Experiência do Usuário, Gestão de Estado e Visualização de Dados.*

Plaintext  
/frontend  
  /src  
    /app  
      /core              \# Serviços Singleton (Escopo Global)  
        /guards          \# AuthGuard (Proteção de Rotas)  
        /interceptors    \# TokenInterceptor (Injeção de Bearer Token)  
        /services        \# AuthService, SpotifyService, GeneratorService  
        /models          \# Interfaces TypeScript (Tipagem forte)  
        
      /features          \# Módulos de Funcionalidade (Lazy Loaded)  
        /auth            \# Login e Callback  
        /dashboard       \# Gráficos e Stats  
        /vibe-architect  \# A ferramenta de criação (Sliders, Gráficos)  
        /player          \# O componente visual de playback  
        
      /shared            \# Componentes Reutilizáveis  
        /ui              \# Botões, Cards, Inputs (Angular Material)  
        /pipes           \# Formatadores (MsToMinutes, CamelotKey)

---

## **8\. Modelagem de Dados (PostgreSQL Schema)**

Esquema relacional otimizado para performance e integridade.

**Tabela: users**

* id (UUID, PK): Identificador único.  
* spotify\_id (String, Unique, Index): ID imutável do usuário no Spotify.  
* email (String): E-mail da conta.  
* display\_name (String): Nome público.  
* refresh\_token (Text, Encrypted): Token para renovação de acesso.  
* vibe\_profile (JSONB): Vetor médio do gosto do usuário (ex: {"energy": 0.8, "valence": 0.4}).  
* created\_at (Timestamp): Data de registro.

**Tabela: generations** (Histórico de Playlists Criadas)

* id (UUID, PK): Identificador da geração.  
* user\_id (UUID, FK \-\> users.id): Quem criou.  
* type (Enum): Tipo da geração (CURVE, DISCOVERY, WEATHER, TIME\_TRAVEL).  
* parameters (JSONB): Configurações usadas (ex: {"target\_duration": 3600, "seed\_genres": \["rock"\]}).  
* spotify\_playlist\_id (String): ID da playlist criada no Spotify.  
* is\_public (Boolean): Define se a playlist foi salva como pública ou privada no Spotify.
* is\_alive (Boolean): Se true, será atualizada pelo Cron Job semanalmente.  
* created\_at (Timestamp).

**Tabela: tracks\_cache** (Cache de Músicas)

* `spotify_track_id` (String, PK): ID da música no Spotify.  
* `name` (String): Título.  
* `artist_name` (String): Artista principal.  
* `audio_features` (JSONB): O "DNA" da música (`{"energy": 0.5, "key": 1...}`).  
* **`genres` (JSONB): Lista de gêneros específicos da faixa (ex: `["indie rock", "alternative"]`). Prioridade: Dataset \> Inferência do Artista.**  
* `popularity` (Integer): 0-100.  
* `updated_at` (Timestamp).

**Tabela: artists_cache** (Cache de Identidade e Metadados)

* `spotify_artist_id` (String, PK): ID do artista no Spotify. 
* `name` (String): Nome do artista ou banda. 
* `artist_type` (Enum): Classificação da entidade (PERSON, GROUP, OTHER). 
* `gender` (Enum): Gênero do artista (MALE, FEMALE, NON_BINARY, UNKNOWN). Aplica-se apenas se `artist_type` for PERSON.
* `updated_at` (Timestamp): Última vez que o dado foi sincronizado.

**Tabela: genres_dictionary** (Wiki Interna do Tunify)

* `genre_name` (String, PK): Nome do gênero (ex: "synthwave"). 
* `origin_era` (String): Década ou ano de surgimento.
* `description` (Text): Resumo curto e direto (máximo de 2 parágrafos).
* `trivia` (String): Fato curioso ou trivia rápida sobre o gênero para engajamento.
* `updated_at` (Timestamp): Data da última atualização do registro.

**Data de Criação do Projeto:** 18/02/2026