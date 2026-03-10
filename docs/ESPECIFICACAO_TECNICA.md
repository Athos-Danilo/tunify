**Nome do Projeto:** Tunify 

**Slogan:** "A matemática da sua vibe."

**Versão:** 1.0.5

**Status:** Desenvolvimento

**Data da Atualização:** 10/03/2026

---

## **1\. Visão Geral do Produto**

O **Tunify** é uma plataforma de "Engenharia Musical" e curadoria algorítmica que estende as capacidades nativas do ecossistema Spotify. Enquanto plataformas de streaming tradicionais focam em recomendações baseadas em popularidade ou gênero, o Tunify utiliza **Ciência de Dados (Data Science)** e **Teoria dos Grafos** para oferecer controle granular sobre a experiência auditiva.

O sistema empodera o usuário ("Power User") a atuar como um arquiteto de suas próprias playlists. Através de ferramentas que traduzem sentimentos abstratos em vetores matemáticos (Valência, Energia, Tempo), o Tunify permite a criação de jornadas sonoras coesas, descoberta de artistas "Lado B" através de similaridade vetorial e automação de playlists baseadas em contexto (clima, localização e tempo).

---

## **2\. Decisões Técnicas e Arquitetura**

A arquitetura do projeto segue o padrão de **Microsserviços Monolíticos (Modular Monolith)**, garantindo um desacoplamento total entre a interface de usuário e a lógica de processamento de dados.

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

## **3\. Requisitos Funcionais (RF)**

As funcionalidades foram organizadas em módulos lógicos para facilitar o desenvolvimento.

### **Módulo 1: Core & Autenticação**

* **RF01 \- Autenticação OAuth2 (Authorization Code):** O sistema deve realizar login exclusivamente via Spotify, sem armazenamento de senhas locais. Deve-se solicitar escopos para leitura de biblioteca, criação de playlists e controle de playback.  
* **RF02 \- Sincronização de Perfil:** Ao logar, o sistema deve calcular e exibir o "Vibe Profile" inicial do usuário (média matemática de suas últimas 50 reproduções).  
* **RF03 \- Logout e Revogação:** Capacidade de desconectar a sessão e limpar dados sensíveis do armazenamento local.

### **Módulo 2: Vibe Architect (O Criador de Jornadas)**

* **RF04 \- Curva de Energia Dinâmica:** O usuário deve definir, via interface gráfica (gráfico interativo ou sliders), o ponto de partida (ex: Calmo) e o ponto de chegada (ex: Agitado) da playlist.  
* **RF05 \- Filtros de Exclusão:** Opção para "banir" gêneros ou artistas específicos da geração atual.  
* **RF06 \- Seletor de "Lado B" (Discovery Mode):** Um controle que altera o peso do algoritmo para priorizar faixas com baixo índice de popularidade (popularity \< 30), ignorando hits comerciais.  
* **RF07 \- Preview Interativo:** Listagem prévia das faixas sugeridas com player de áudio (30s) embutido e opção de remoção manual de faixas indesejadas antes do salvamento.

### **Módulo 3: Discovery (Exploração Avançada)**

* **RF08 \- Deep Dive Discovery (Espelho do Artista):** O usuário seleciona "Sementes" (ex: 3 músicas do Justin Bieber). O sistema deve buscar artistas relacionados, mas filtrar apenas aqueles que correspondem à assinatura acústica das sementes e possuem baixa popularidade (artistas similares desconhecidos).  
* **RF09 \- Sonic Time Travel (Túnel do Tempo):** Funcionalidade que preserva o gosto musical atual do usuário (gêneros/vibe), mas restringe a busca a um intervalo de anos específico (ex: "Meu gosto Pop atual, mas apenas músicas de 1980-1989").  
* **RF10 \- Refinamento de Tendências:** Capacidade de importar uma playlist pública (ex: "Top 50 Brasil") e regenerá-la mantendo apenas as faixas que possuem similaridade matemática com o perfil do usuário, removendo o que foge do seu gosto.

### **Módulo 4: Context & Automation (Contexto e Automação)**

* **RF11 \- DJ do Clima (Weather Integration):** O sistema deve capturar a geolocalização do usuário, consultar uma API de Clima (OpenWeatherMap) e traduzir a condição (Chuva, Sol, Neve) em parâmetros de áudio (Acústico, Valência alta, etc.) para gerar uma playlist instantânea.  
* **RF12 \- Smart Limits (Limites Inteligentes):** O usuário define o tamanho da playlist por **Quantidade de Faixas** (ex: 50 músicas) OU por **Duração Temporal** (ex: "Quero uma playlist de exatamente 2 horas e 15 minutos").  
* **RF13 \- Playlists Vivas (Cron Jobs):** O usuário pode marcar uma playlist gerada como "Viva". O sistema deve agendar uma tarefa semanal para atualizar automaticamente o conteúdo dessa playlist no Spotify com novas recomendações, sem intervenção manual.

### **Módulo 5: Gestão e Player**

* **RF14 \- Exportação para o Spotify:** Botão para efetivar a criação da playlist na conta do usuário.  
* **RF15 \- Web Player SDK:** Controle remoto completo (Play, Pause, Skip, Seek) de qualquer dispositivo ativo do usuário diretamente pelo dashboard do Tunify.  
* **RF16 \- Dashboard "DNA Musical:** Visualização de dados (Spider Charts) comparando o gosto do usuário com a média global ou com a playlist gerada.
* **RF17 \- Controle de Visibilidade (Privacy Toggle):** No painel de configuração antes da geração final da playlist, o sistema deve fornecer um toggle (interruptor booleano) permitindo ao usuário definir se a playlist criada no Spotify será Pública ou Privada (public: true ou false).
* **RF18 \- Módulo de Compartilhamento (Social Share):** Após a criação com sucesso, se a playlist for marcada como Pública, a interface deve exibir um componente de compartilhamento. Este componente deve utilizar a Clipboard API (para copiar o link direto) e a Web Share API (para deep links com WhatsApp, X/Twitter e Instagram Stories). Se a playlist for Privada, o módulo de compartilhamento deve ficar desabilitado visualmente, exibindo um tooltip explicativo para o usuário.

#### **Módulo 6: Analytics & Insights (Dashboard)**

Ferramentas de visualização de dados para o usuário entender seus próprios hábitos.

* **RF17 \- Vibe Radar (Gráfico de Aranha):** Visualização pentagonal comparando os 5 atributos médios do usuário (Energia, Valência, Dançabilidade, Acústica, Instrumentalidade) contra a média global do sistema.  
* **RF18 \- Top Genres (Pie Chart):** Como o Spotify não fornece gênero por *música*, o sistema deve calcular isso agregando os gêneros dos *artistas* das 50 faixas mais ouvidas.  
* **RF19 \- Calculadora de Tempo (Library Stats):** O sistema deve percorrer as faixas salvas do usuário (paginação de 50 em 50\) para somar a duração total (`duration_ms`) e exibir: *"Você levaria 14 dias ininterruptos para ouvir toda sua biblioteca"*.  
* **RF20 \- Linha do Tempo de Popularidade:** Um gráfico de linha mostrando se o gosto do usuário tem ficado mais "Mainstream" (Popularidade alta) ou mais "Underground" ao longo dos últimos 6 meses.
* **RF21 \- Theme Switcher (Modo Claro/Escuro):** O sistema deve oferecer um toggle na interface do usuário (ex: no cabeçalho ou menu de perfil) permitindo alternar dinamicamente entre a paleta "Dark Mode" (padrão) e "Light Mode". A preferência escolhida deve ser persistida localmente (via localStorage do navegador) para garantir que a escolha seja mantida em acessos futuros.

## **4\. Regras de Negócio (RN)**

*As leis matemáticas, lógicas e restrições que o Backend (Python) deve seguir rigorosamente.*

### **Lógica de Autenticação e Segurança**

* **RN01 \- Rotação de Tokens (Security):** O *Access Token* do Spotify expira em 1 hora. O sistema deve implementar um *Middleware* que verifica a validade do token antes de qualquer chamada à API externa. Se expirado, deve usar o *Refresh Token* (armazenado criptografado no banco) para obter um novo silenciosamente, garantindo sessão contínua.

### **Algoritmos de Recomendação ("The Vibe Math")**

* **RN02 \- Cálculo de Similaridade (Distância Euclidiana):** Para encontrar músicas "parecidas" ou "Lado B", o sistema deve tratar cada música como um vetor multidimensional.  
  * *Fórmula:* $d(A, B) \= \\sqrt{(Energy\_A \- Energy\_B)^2 \+ (Valence\_A \- Valence\_B)^2 \+ (Dance\_A \- Dance\_B)^2}$  
  * Quanto menor a distância $d$, mais similar é a vibe da música.  
* **RN03 \- Interpolação Linear de Energia:** Quando o usuário define uma curva (ex: Começar em 0.2 e terminar em 0.8 ao longo de 10 músicas), o algoritmo deve calcular os "degraus" ideais.  
  * *Lógica:* $TargetEnergy\_i \= Start \+ (End \- Start) \* \\frac{i}{TotalTracks}$  
  * O sistema buscará no banco de cache ou na API músicas que possuam energia próxima a $TargetEnergy\_i$ para a posição $i$ da playlist.  
* **RN04 \- Mixagem Harmônica (Camelot Wheel):** Para transições suaves (sem choque sonoro), o sistema deve respeitar a compatibilidade de Tonalidade (*Key* e *Mode*).  
  * *Regra:* Se a música atual é **8B** (Dó Maior), a próxima deve ser **8B** (Mesmo tom), **7B** (Quarta abaixo), **9B** (Quinta acima) ou **8A** (Relativa menor).  
  * *Conversão:* O sistema deve converter o integer da API do Spotify (0-11) para a notação Camelot antes de filtrar.

### **Lógica de Contexto e Automação**

* **RN05 \- Limites Inteligentes (Time-Boxing):**  
  * *Por Quantidade:* Loop simples até atingir $N$ faixas.  
  * *Por Duração:* O sistema deve somar o duration\_ms de cada música adicionada. O loop encerra quando SomaAtual \>= DuraçãoAlvo \- MargemDeErro (ex: 2 min).  
* **RN06 \- Tradução Climática (Weather Mapping):** O Backend deve possuir uma tabela de conversão para a funcionalidade "DJ do Clima":  
  * *Chuva/Tempestade:* Energy \< 0.5, Acousticness \> 0.6, Valence \< 0.4.  
  * *Sol/Céu Limpo:* Energy \> 0.7, Valence \> 0.8, Mode \= 1 (Maior).  
  * *Neve/Frio:* Tempo \< 100 BPM, Instrumentalness \> 0.2.

#### **Gestão Inteligente de Dados e Performance (Data Strategy)**

* **RN08 \- Inferência de Gêneros (Data Aggregation):**  
  * *Problema:* A API do Spotify não fornece o gênero musical diretamente no objeto "Música" (Track), apenas no objeto "Artista".  
  * *Lógica:* Para gerar estatísticas precisas (ex: "Você ouve 40% Pop"), o sistema deve aplicar um algoritmo de agregação:  
    1. Para cada música no histórico, identificar o Artista Principal.  
    2. Buscar a lista de gêneros desse artista (ex: `["pop", "canadian pop"]`).  
    3. Atribuir peso fracionado à música (se o artista tem 2 gêneros, a música conta 0.5 para cada um).  
    4. Consolidar os resultados no Gráfico de Pizza do Dashboard.  
* **RN09 \- Estratégia Híbrida de Cache (Dataset & Lazy Loading):**  
  * *Contexto:* O endpoint de `audio-features` (que fornece dados matemáticos como energia e valência) possui limites rígidos de requisições (Rate Limit), o que inviabilizaria a análise de grandes bibliotecas em tempo real.  
  * *Solução (Arquitetura de Dados):* O Tunify implementará uma estratégia de **Cold Start** baseada em Datasets.  
    1. **Seeding (ETL Inicial):** Na implantação do sistema, a tabela `tracks_cache` será pré-populada com o "Spotify 1 Million Tracks Dataset" (fonte externa/Kaggle), inserindo instantaneamente os vetores matemáticos de 1 milhão de músicas populares.  
    2. **Cache Look-aside Pattern:** Ao analisar uma playlist:  
       * **Passo A:** O Backend consulta o banco local (PostgreSQL). Se a música existir (Cache Hit), o retorno é imediato (latência zero).  
       * **Passo B:** Se a música for nova ou obscura (Cache Miss), o sistema consome a API do Spotify, entrega o dado ao usuário e, *assincronamente*, salva esse novo vetor no banco para consultas futuras.
**RN10 \- Hierarquia de Classificação de Gêneros (Genre Fallback):**
* *Problema:* A API oficial classifica apenas Artistas, gerando imprecisão em faixas experimentais (ex: um Artista de Rock lançando uma balada acústica).  
* *Lógica de Prioridade:* Ao classificar uma música para o Dashboard, o sistema deve seguir a ordem:  
  1. **Dataset Local (Preciso):** Se a música consta no "Spotify 1M Dataset" importado, usa-se o gênero específico da faixa (ex: "Classic Rock").  
  2. **Inferência de Artista (Aproximado):** Se a música não está no Dataset (é um lançamento novo), o sistema consulta a API do Spotify para pegar os gêneros do Artista e atribui à música (ex: Artista "Metallica" \-\> Música recebe "Metal").  
  3. **Tag "Unclassified":** Se nenhuma fonte tiver dados, marca como "Desconhecido" para não quebrar os gráficos.

## **5\. Requisitos Não-Funcionais (RNF)**

*Critérios de qualidade técnica e restrições de infraestrutura.*

### **Performance e Escalabilidade**

* **RNF01 \- Latência de Resposta:** Endpoints de leitura local (Dashboard) devem responder em \< 150ms. Endpoints de Geração de Playlist (que dependem da API externa) devem responder o *status* do Job em \< 200ms, delegando o processamento para *Background Tasks*.  
* **RNF02 \- Cache Strategy (Redis):** Dados imutáveis de músicas (*Audio Features*) devem ter TTL (Time-To-Live) de 30 dias no Redis. Perfis de usuário devem ter TTL de 1 hora.

### **Segurança**

* **RNF03 \- Criptografia em Repouso:** Tokens sensíveis (*Refresh Token*) devem ser criptografados no banco de dados usando algoritmos robustos (ex: Fernet/AES-256) via biblioteca de criptografia do Python.  
* **RNF04 \- Tratamento de Rate Limit (Circuit Breaker):** Se o Spotify retornar erro 429 (Too Many Requests), o sistema deve interromper chamadas externas para aquele usuário por X segundos (Exponential Backoff) e notificar o Frontend, em vez de falhar silenciosamente.

### **Segurança**

* **RNF05 \- Arquitetura de Theming:** A alternância de temas deve ser desenvolvida utilizando variáveis CSS nativas (Custom Properties) e as capacidades de Theming do Angular Material. A arquitetura deve garantir que não haja recarregamento da página ao trocar o tema e que ambas as paletas respeitem as regras de contraste visual para leitura confortável.

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

**Data:** 18/02/2026