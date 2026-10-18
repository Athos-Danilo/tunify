# Correção da Jornada Diária

Implementada na branch developer. A fonte continua sendo `daily_minutes_listened`.

## Comportamento

- Robô e POST de histórico usam `record_play`: a identidade de uma reprodução é usuário, faixa e instante UTC. Reenvios não incrementam os minutos novamente.
- Histórico e acumulador são gravados na mesma transação. O acumulador usa incremento atômico no banco, agrupado pelo dia em UTC-3, independentemente do offset recebido.
- A leitura usa SUM por dia e usuário, tolerando as linhas legadas. A conversão para minutos ocorre depois da soma.
- O gráfico não mostra um máximo fictício de um minuto quando todos os dias têm zero. A mensagem de carregamento descreve leitura, não sincronização com Spotify.

## Migração necessária

`a71d9e2c4b10`, após `ede0ca8e1881`, consolida os totais diários no menor ID de cada usuário/dia e remove as outras linhas. Também consolida identidades repetidas no histórico e adiciona as duas restrições de unicidade exigidas pela nova gravação.

A soma diária existente é preservada; não há tentativa de reconstruir ou estimar dias ausentes. Duplicidades históricas eventualmente contadas antes desta correção não são subtraídas automaticamente dos acumuladores, pois a tabela não registra a origem de cada incremento.

O backend já executa `alembic upgrade head` durante a inicialização. Publicar código e migração juntos, com os escritores antigos interrompidos durante a atualização. Não executar a nova gravação contra um banco sem as restrições. A migração usa transação e bloqueio de escrita nas duas tabelas durante a consolidação. O downgrade remove as restrições, mas não recria as linhas duplicadas.

Nenhum banco real foi migrado nesta tarefa e nenhum deploy foi realizado.

## Validação

- Oito testes específicos: lote e incremento posterior, reenvio, fuso e virada de mês, rollback, POST repetido, POST inválido, leitura dos valores do export, consolidação e integração robô → frontend (alguns cenários compartilham um teste).
- Jornada + autenticação: 11 testes passaram.
- Suíte completa: 11 passaram e três testes de playlists falharam, fora dos arquivos alterados (mocks de `spotify.requests` inexistente e rota esperada pelos testes antigos).
- Build Angular em development concluído; avisos de Sass e RouterOutlet permanecem em arquivos não alterados.
- Export da nuvem analisado como dados, sem executar o arquivo SQL: 509 linhas → 80 grupos, com igualdade exata de todos os totais antes/depois; usuário 1 em 18/10 = 4.650.973 ms, ou 77 minutos inteiros.
- Testes de dados e rotas executados em SQLite temporário. A consolidação foi exercitada com os comandos da migração, substituindo o bloqueio e a criação de constraints por equivalentes de teste. Bloqueio/concorrência e DDL não foram executados em PostgreSQL real: Docker instalado, mas serviço indisponível.
