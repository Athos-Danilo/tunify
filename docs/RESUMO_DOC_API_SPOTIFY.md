# Resumo Oficial e Completo: Documentação da API do Spotify

Este documento reúne todas as informações cruciais, endpoints atualizados, regras de negócio e boas práticas baseadas na documentação oficial do Spotify (Web API, Web Playback SDK e Acessibilidade), com atenção especial para as grandes mudanças de Fevereiro de 2026.

---

## 1. Spotify Web API
A Web API permite consultar dados de músicas, artistas, álbuns, gerenciar playlists e controlar o playback de usuários. Ela é baseada em REST e retorna dados em JSON.

### Regras Gerais e Autenticação
* **Base URL:** `https://api.spotify.com/v1`
* **Autenticação:** Baseada em OAuth 2.0. Todas as requisições exigem um cabeçalho `Authorization: Bearer {token}`.
* **Scopes (Escopos):** Você deve pedir permissão explícita para o que deseja fazer.
  * Para criar playlists: `playlist-modify-public` ou `playlist-modify-private`
  * Para ler dados do usuário: `user-read-private`, `user-read-email`
  * Para playback: `user-modify-playback-state`, `user-read-playback-state`, `streaming`
* **Rate Limits (Limite de Requisições):** O Spotify aplica limites de taxa baseados no aplicativo (Client ID) e no usuário. Quando você excede o limite, a API retorna o status `429 Too Many Requests`. O cabeçalho `Retry-After` informará quantos segundos você deve aguardar antes de tentar novamente.

### Endpoints Cruciais (Atualizados - 2026)

**ATENÇÃO:** Várias rotas foram descontinuadas ou restritas por questões de privacidade. Siga as rotas mais modernas.

#### Perfil de Usuário
* `GET /me` - Retorna detalhes do usuário autenticado atual.
* `GET /users/{user_id}` - Retorna o perfil público de um usuário específico.

#### Playlists (CUIDADO COM AS MUDANÇAS)
* **Criar Playlist:** `POST /me/playlists`
  * *Regra de 2026:* Não use mais `/users/{user_id}/playlists` (retorna 403 Forbidden).
  * Payload: `{"name": "Nome", "description": "Desc", "public": false}`
* **Adicionar Itens à Playlist:** `POST /playlists/{playlist_id}/items`
  * *Regra de 2026:* A rota antiga `/tracks` foi substituída por `/items` para acomodar episódios de podcast e outros formatos.
  * Payload: `{"uris": ["spotify:track:123...", "spotify:episode:456..."]}`
* **Obter Playlists do Usuário:** `GET /me/playlists`
* **Obter Playlist Específica:** `GET /playlists/{playlist_id}`

#### Busca e Catálogo
* **Buscar:** `GET /search?q={query}&type={track,artist,album,playlist}`
* **Obter Artista:** `GET /artists/{id}`
* **Obter Faixa (Track):** `GET /tracks/{id}`
* **Recomendações:** `GET /recommendations?seed_artists={id}&seed_tracks={id}&seed_genres={genre}` (Excelente para gerar playlists baseadas no gosto musical).

#### Controle de Playback (Requer Premium)
* **Tocar/Resumir:** `PUT /me/player/play`
* **Pausar:** `PUT /me/player/pause`
* **Pular para próxima:** `POST /me/player/next`
* **Dispositivos Ativos:** `GET /me/player/devices`

---

## 2. Web Playback SDK
O Web Playback SDK permite que sua aplicação web toque músicas do Spotify diretamente no navegador como se fosse o app oficial. Ele cria um novo "Dispositivo" (Device) associado à conta do usuário.

### Requisitos e Regras Estritas
* **Conta Premium:** O SDK de reprodução de áudio só funciona para usuários autenticados que tenham o Spotify Premium. Usuários Free não podem usar o SDK (recebem erro de inicialização).
* **Navegadores Suportados:** Funciona primariamente em navegadores com suporte a *Encrypted Media Extensions (EME)* (ex: Chrome, Firefox, Edge, Safari).
* **Interação do Usuário:** Navegadores bloqueiam reprodução automática de áudio. A primeira vez que a música tocar, DEVE ser originada por um clique do usuário (ex: botão "Play").

### Configuração e Ciclo de Vida
Para instanciar o Player, você precisa carregar o script oficial (`https://sdk.scdn.co/spotify-player.js`) e inicializar a classe `Spotify.Player`.

* **Token:** O Player exige uma função `getOAuthToken` que deve repassar o token de acesso (Bearer) válido.
* **Eventos Principais:**
  * `ready`: Disparado quando o Web Player é criado com sucesso e ganha um `device_id`. Você precisa desse `device_id` para mandar a música tocar nele usando a Web API (`PUT /me/player/play?device_id=...`).
  * `not_ready`: Disparado quando o dispositivo fica offline.
  * `player_state_changed`: Evento mais importante. Retorna o estado atual (qual música está tocando, posição em milissegundos, se está pausado). Útil para atualizar a interface do Tunify.
  * `initialization_error` / `authentication_error`: Disparado por tokens inválidos ou se o usuário não for Premium.

---

## 3. Diretrizes de Acessibilidade (Accessibility)
O Spotify leva acessibilidade muito a sério e exige que integrações de terceiros que simulem a experiência do Spotify sigam rígidos padrões (WCAG - Web Content Accessibility Guidelines).

### Semântica e HTML
* Use elementos nativos sempre que possível (`<button>`, `<a>`, `<nav>`, `<main>`). Um erro comum é criar botões usando `<div>` ou `<span>`.
* Todo botão de controle de áudio (Play, Pause, Next) deve ter o atributo `aria-label` bem descritivo (ex: `aria-label="Tocar a música atual"`).

### Navegação por Teclado
* Todo elemento interativo DEVE ser acessível pela tecla `Tab`.
* O indicador de foco (focus ring) deve ser claramente visível. Nunca use `outline: none` no CSS sem providenciar um estilo visual alternativo para o foco (`:focus` ou `:focus-visible`).

### Contraste e Cores
* A relação de contraste entre o texto e o fundo deve ser no mínimo **4.5:1** (nível AA) para textos normais e **3:1** para textos grandes ou elementos de interface (como ícones de play/pause).
* **Não dependa apenas da cor:** Se uma música estiver "selecionada" ou "tocando", não mude apenas a cor do texto para verde. Adicione um ícone, ou sublinhado, ou texto alternativo para daltônicos.

### Tratamento de Imagens (Capas de Álbuns)
* Todas as capas de álbuns (`<img>`) devem ter o atributo `alt` preenchido descrevendo a imagem ou o álbum, por exemplo: `alt="Capa do álbum Abbey Road dos The Beatles"`.

---

## Resumo e Dicas para o Tunify
1. **Tokens sempre frescos:** Como o Tunify cria playlists, ele tem poder de modificação de conta. Se um token expirar, a API retornará `401 Unauthorized`. Certifique-se de tratar esse erro redirecionando o usuário para o login.
2. **Separação:** A Web API é para *buscar e comandar*. O Playback SDK é para *emitir som localmente*. Muitas vezes você usa os dois juntos (ex: O SDK diz que está pronto, e você usa a Web API para mandar o som para ele).
3. **Erros 403:** Sempre que ver um `403 Forbidden`, verifique duas coisas: a rota que está usando (lembre-se do `/me/playlists`) e os *Scopes* solicitados no momento do Login.
