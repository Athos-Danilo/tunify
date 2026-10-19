# Convites e permissões do Tunify Sync

O frontend de desenvolvimento usa `http://localhost:8000/api/v1` ao iniciar com
`npm start`. O build padrão (`npm run build`) usa a API publicada definida em
`frontend/src/environments/environment.ts`. Não é necessário trocar URLs no código
ao integrar a branch na main.

## Configuração do backend

Além das variáveis já utilizadas pelo projeto, configure no `.env` local:

```dotenv
FRONTEND_URL=http://localhost:4200
SPOTIFY_REDIRECT_URI=http://localhost:8000/api/v1/auth/callback
```

Para produção, configure no ambiente do serviço de API:

```dotenv
FRONTEND_URL=https://tunify-pearl.vercel.app
SPOTIFY_REDIRECT_URI=https://tunify-api-do4o.onrender.com/api/v1/auth/callback
```

Cadastre os endereços de callback correspondentes no painel do aplicativo Spotify.
O backend encaminha o início do login para o host configurado no callback antes
de criar o cookie de validação. Isso permite iniciar pelo frontend que aponta para
`localhost` mesmo quando o callback cadastrado usa `127.0.0.1`.

Configure também `TUNIFY_SECRET_KEY` com um segredo aleatório de pelo menos 32
caracteres, persistente e igual em todas as instâncias da API. Não o versione.
Em localhost, quando a variável está ausente, o servidor gera uma chave temporária:
reiniciar o processo invalida as sessões. Em produção, a ausência de uma chave
válida impede a inicialização. O login continua válido por sete dias.

## Contrato social

- Criar, listar e cancelar convites, aceitar, listar conexões, alterar permissões
  e desconectar exigem `Authorization: Bearer <JWT do Tunify>`.
- O servidor identifica o usuário pelo JWT validado; parâmetros de e-mail não
  determinam quem está executando a operação.
- A inspeção do convite é pública e não expõe e-mail nem tokens do remetente.
- O Spotify e o login local emitem uma sessão Tunify. O token Spotify fica
  separado e continua disponível para o player.
- O retorno do Spotify usa o fragmento da URL, removido pela navegação seguinte,
  e valida o `state` com cookie HttpOnly antes de trocar o código de autorização.
- O convite pendente fica na sessão da aba. Após qualquer tipo de login, o usuário
  retorna à página do convite e confirma o aceite e suas permissões explicitamente.
- Cada link vale sete dias e serve para uma conexão. Ele não é vinculado a um
  destinatário: a primeira pessoa autenticada que o aceitar consome o convite.
- As quatro permissões são obrigatórias e booleanas na criação, no aceite e na
  edição. Uma pessoa só consegue editar as permissões que ela própria concede.
- As permissões de um link já criado são imutáveis. Para mudar antes do aceite,
  cancele e gere outro. Depois do aceite, use a edição da conexão.
- Desconectar pausa o vínculo para ambos. Um novo convite e um novo aceite
  permitem reconectar com permissões novas. Não há desbloqueio de vínculos `BLOCKED`.
- Aceite e cancelamento bloqueiam a linha do convite no PostgreSQL. A criação do
  vínculo também serializa o par de usuários, evitando aceites simultâneos do
  mesmo link e duplicações por convites diferentes.
- O dashboard atualiza convites e conexões a cada 30 segundos enquanto aberto.

A atualização exige um novo login para sessões antigas que guardavam somente o
token Spotify. Não requer migração de banco adicional. As tabelas e a migração
social já existentes são reutilizadas.

Esta etapa não consulta estatísticas musicais dos amigos e não altera as rotas
de leitura do dashboard. Quando essa consulta for implementada, ela precisará
validar a conexão ativa e a permissão correspondente em cada requisição.

## Validação

Os testes sociais usam SQLite em memória e Spotify simulado, sem acessar contas
ou bancos reais. Cobrem identidade, isolamento entre contas, permissões nos dois
sentidos, expiração, revogação, reutilização, reconexão e validação do login.
SQLite não reproduz os bloqueios de linha do PostgreSQL; concorrência real exige
validação de integração em um PostgreSQL de testes.

```text
backend/venv/Scripts/python.exe -m pytest backend/tests/test_sync.py backend/tests/test_auth.py -q
```

No frontend, execute os testes de sessão, callback e página de convite. O build
de desenvolvimento e o de produção verificam os respectivos ambientes.
