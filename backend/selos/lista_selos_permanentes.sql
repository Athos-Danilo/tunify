-- ==============================================================================
-- SEED DE SELOS PERMANENTES (CATÁLOGO INICIAL) - TUNIFY
-- Este script insere 102 selos permanentes divididos por categorias no banco.
-- ==============================================================================

-- Limpa selos permanentes antigos do catálogo (opcional, para evitar duplicados durante testes)
-- DELETE FROM selos_catalog WHERE badge_type = 'permanent';

INSERT INTO selos_catalog (name, description, badge_type, icon_path, criteria_type, criteria_value) VALUES

-- ==============================================================================
-- CATEGORIA 1: TEMPO DE ESCUTA ACUMULADO (criteria_type: 'minutes_played')
-- ==============================================================================
(
    'Primeiro Player direto do Tunify',
    'Seu primeiro play foi registrado e sua jornada musical começou a ser mapeada pelo Tunify!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    1
),
-- Iniciante do Fone (1.000 a 9.000 minutos)
(
    'Iniciante do Fone - Nível 1',
    'O Tunify registrou seus primeiros 1.000 minutos de música sintonizados! Os primeiros acordes da sua jornada.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    1000
),
(
    'Iniciante do Fone - Nível 2',
    'O Tunify registrou 2.000 minutos de música sintonizados! Sua história musical está ganhando ritmo.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    2000
),
(
    'Iniciante do Fone - Nível 3',
    'O Tunify registrou 3.000 minutos de música sintonizados! Três mil minutos mapeados no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    3000
),
(
    'Iniciante do Fone - Nível 4',
    'O Tunify registrou 4.000 minutos de música sintonizados! Seus hábitos sonoros estão se consolidando.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    4000
),
(
    'Iniciante do Fone - Nível 5',
    'O Tunify registrou 5.000 minutos de música sintonizados! Cinco mil minutos de boas vibes sincronizadas.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    5000
),
(
    'Iniciante do Fone - Nível 6',
    'O Tunify registrou 6.000 minutos de música sintonizados! A trilha sonora do seu dia a dia está ativa.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    6000
),
(
    'Iniciante do Fone - Nível 7',
    'O Tunify registrou 7.000 minutos de música sintonizados! Seu histórico de áudio já tem história pra contar.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    7000
),
(
    'Iniciante do Fone - Nível 8',
    'O Tunify registrou 8.000 minutos de música sintonizados! Oito mil minutos divididos com seus artistas preferidos.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    8000
),
(
    'Iniciante do Fone - Nível 9',
    'O Tunify registrou 9.000 minutos de música sintonizados! Quase alcançando as grandes ligas da escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    9000
),
-- Maratonista de Bronze (10.000 a 29.000 minutos)
(
    'Maratonista de Bronze - Nível 10',
    'Mapeamos 10.000 minutos de escuta no seu histórico. O bronze musical brilha no seu perfil!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    10000
),
(
    'Maratonista de Bronze - Nível 11',
    'Mapeamos 11.000 minutos de escuta no seu histórico. O bronze musical brilha na sua estante!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    11000
),
(
    'Maratonista de Bronze - Nível 12',
    'Mapeamos 12.000 minutos de escuta no seu histórico. O seu som continua tocando forte!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    12000
),
(
    'Maratonista de Bronze - Nível 13',
    'Mapeamos 13.000 minutos de escuta no seu histórico. Treze mil minutos de fidelidade sonora registrada!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    13000
),
(
    'Maratonista de Bronze - Nível 14',
    'Mapeamos 14.000 minutos de escuta no seu histórico. Catorze mil minutos de pura música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    14000
),
(
    'Maratonista de Bronze - Nível 15',
    'Mapeamos 15.000 minutos de escuta no seu histórico. O Tunify é parceiro de todas as suas sessões de som!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    15000
),
(
    'Maratonista de Bronze - Nível 16',
    'Mapeamos 16.000 minutos de escuta no seu histórico. Dezesseis mil minutos acumulados na sua conta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    16000
),
(
    'Maratonista de Bronze - Nível 17',
    'Mapeamos 17.000 minutos de escuta no seu histórico. Dezessete mil minutos de puro áudio registrado.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    17000
),
(
    'Maratonista de Bronze - Nível 18',
    'Mapeamos 18.000 minutos de escuta no seu histórico. Dezoito mil minutos em perfeita sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    18000
),
(
    'Maratonista de Bronze - Nível 19',
    'Mapeamos 19.000 minutos de escuta no seu histórico. Dezenove mil minutos de música mapeados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    19000
),
(
    'Maratonista de Bronze - Nível 20',
    'Mapeamos 20.000 minutos de escuta no seu histórico. Vinte mil minutos de hits e clássicos sincronizados!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    20000
),
(
    'Maratonista de Bronze - Nível 21',
    'Mapeamos 21.000 minutos de escuta no seu histórico. O seu bronze está se consolidando no perfil!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    21000
),
(
    'Maratonista de Bronze - Nível 22',
    'Mapeamos 22.000 minutos de escuta no seu histórico. Vinte e dois mil minutos ouvidos e registrados!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    22000
),
(
    'Maratonista de Bronze - Nível 23',
    'Mapeamos 23.000 minutos de escuta no seu histórico. Vinte e três mil minutos de som mapeados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    23000
),
(
    'Maratonista de Bronze - Nível 24',
    'Mapeamos 24.000 minutos de escuta no seu histórico. Vinte e quatro mil minutos em sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    24000
),
(
    'Maratonista de Bronze - Nível 25',
    'Mapeamos 25.000 minutos de escuta no seu histórico. Vinte e cinco mil minutos de playlists rodadas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    25000
),
(
    'Maratonista de Bronze - Nível 26',
    'Mapeamos 26.000 minutos de escuta no seu histórico. Vinte e seis mil minutos de música gravada.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    26000
),
(
    'Maratonista de Bronze - Nível 27',
    'Mapeamos 27.000 minutos de escuta no seu histórico. Vinte e sete mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    27000
),
(
    'Maratonista de Bronze - Nível 28',
    'Mapeamos 28.000 minutos de escuta no seu histórico. Vinte e oito mil minutos de foco e ritmo.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    28000
),
(
    'Maratonista de Bronze - Nível 29',
    'Mapeamos 29.000 minutos de escuta no seu histórico. O bronze se despede para dar lugar à prata!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    29000
),
-- Sintonia de Prata (30.000 a 49.000 minutos)
(
    'Sintonia de Prata - Nível 30',
    'O Tunify registrou 30.000 minutos de som sintonizados no seu histórico. Suas playlists são puro metal precioso!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    30000
),
(
    'Sintonia de Prata - Nível 31',
    'O Tunify registrou 31.000 minutos de som no seu histórico. A prata brilha em cada play!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    31000
),
(
    'Sintonia de Prata - Nível 32',
    'O Tunify registrou 32.000 minutos de som no seu histórico. Trinta e dois mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    32000
),
(
    'Sintonia de Prata - Nível 33',
    'O Tunify registrou 33.000 minutos de som no seu histórico. A prata reluz na sua vitrine!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    33000
),
(
    'Sintonia de Prata - Nível 34',
    'O Tunify registrou 34.000 minutos de som no seu histórico. Trinta e quatro mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    34000
),
(
    'Sintonia de Prata - Nível 35',
    'O Tunify registrou 35.000 minutos de som no seu histórico. Trinta e cinco mil minutos de boas vibes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    35000
),
(
    'Sintonia de Prata - Nível 36',
    'O Tunify registrou 36.000 minutos de som no seu histórico. Trinta e seis mil minutos de música mapeada.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    36000
),
(
    'Sintonia de Prata - Nível 37',
    'O Tunify registrou 37.000 minutos de som no seu histórico. Trinta e sete mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    37000
),
(
    'Sintonia de Prata - Nível 38',
    'O Tunify registrou 38.000 minutos de som no seu histórico. Trinta e oito mil minutos em alta definição.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    38000
),
(
    'Sintonia de Prata - Nível 39',
    'O Tunify registrou 39.000 minutos de som no seu histórico. Trinta e nove mil minutos rodando no player.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    39000
),
(
    'Sintonia de Prata - Nível 40',
    'O Tunify registrou 40.000 minutos de som no seu histórico. Quarenta mil minutos de pura melodia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    40000
),
(
    'Sintonia de Prata - Nível 41',
    'O Tunify registrou 41.000 minutos de som no seu histórico. Quarenta e um mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    41000
),
(
    'Sintonia de Prata - Nível 42',
    'O Tunify registrou 42.000 minutos de som no seu histórico. Quarenta e dois mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    42000
),
(
    'Sintonia de Prata - Nível 43',
    'O Tunify registrou 43.000 minutos de som no seu histórico. Quarenta e três mil minutos de conexão.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    43000
),
(
    'Sintonia de Prata - Nível 44',
    'O Tunify registrou 44.000 minutos de som no seu histórico. Quarenta e quatro mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    44000
),
(
    'Sintonia de Prata - Nível 45',
    'O Tunify registrou 45.000 minutos de som no seu histórico. Quarenta e cinco mil minutos de música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    45000
),
(
    'Sintonia de Prata - Nível 46',
    'O Tunify registrou 46.000 minutos de som no seu histórico. Quarenta e seis mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    46000
),
(
    'Sintonia de Prata - Nível 47',
    'O Tunify registrou 47.000 minutos de som no seu histórico. Quarenta e sete mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    47000
),
(
    'Sintonia de Prata - Nível 48',
    'O Tunify registrou 48.000 minutos de som no seu histórico. Quarenta e oito mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    48000
),
(
    'Sintonia de Prata - Nível 49',
    'O Tunify registrou 49.000 minutos de som no seu histórico. A prata está pronta para dar lugar ao ouro!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    49000
),
-- Frequência de Ouro (50.000 a 79.000 minutos)
(
    'Frequência de Ouro - Nível 50',
    'Incrível! Já são 50.000 minutos de música computados no seu perfil. O padrão de ouro do Tunify!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    50000
),
(
    'Frequência de Ouro - Nível 51',
    'Incrível! Já são 51.000 minutos de música computados. O brilho dourado reluz na sua vitrine!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    51000
),
(
    'Frequência de Ouro - Nível 52',
    'Incrível! Já são 52.000 minutos de música computados. Cinquenta e dois mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    52000
),
(
    'Frequência de Ouro - Nível 53',
    'Incrível! Já são 53.000 minutos de música computados. O ouro brilha forte na sua conta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    53000
),
(
    'Frequência de Ouro - Nível 54',
    'Incrível! Já são 54.000 minutos de música computados. Cinquenta e quatro mil minutos de ritmo.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    54000
),
(
    'Frequência de Ouro - Nível 55',
    'Incrível! Já são 55.000 minutos de música computados. Cinquenta e cinco mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    55000
),
(
    'Frequência de Ouro - Nível 56',
    'Incrível! Já são 56.000 minutos de música computados. Cinquenta e escuta de seis mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    56000
),
(
    'Frequência de Ouro - Nível 57',
    'Incrível! Já são 57.000 minutos de música computados. Cinquenta e sete mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    57000
),
(
    'Frequência de Ouro - Nível 58',
    'Incrível! Já são 58.000 minutos de música computados. Cinquenta e oito mil minutos sincronizados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    58000
),
(
    'Frequência de Ouro - Nível 59',
    'Incrível! Já são 59.000 minutos de música computados. Cinquenta e nove mil minutos rodando no player.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    59000
),
(
    'Frequência de Ouro - Nível 60',
    'Incrível! Já são 60.000 minutos de música computados. Sessenta mil minutos de som histórico!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    60000
),
(
    'Frequência de Ouro - Nível 61',
    'Incrível! Já são 61.000 minutos de música computados. Sessenta e um mil minutos registrados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    61000
),
(
    'Frequência de Ouro - Nível 62',
    'Incrível! Já são 62.000 minutos de música computados. Sessenta e dois mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    62000
),
(
    'Frequência de Ouro - Nível 63',
    'Incrível! Já são 63.000 minutos de música computados. Sessenta e três mil minutos de melodia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    63000
),
(
    'Frequência de Ouro - Nível 64',
    'Incrível! Já são 64.000 minutos de música computados. Sessenta e quatro mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    64000
),
(
    'Frequência de Ouro - Nível 65',
    'Incrível! Já são 65.000 minutos de música computados. Sessenta e cinco mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    65000
),
(
    'Frequência de Ouro - Nível 66',
    'Incrível! Já são 66.000 minutos de música computados. Sessenta e seis mil minutos de música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    66000
),
(
    'Frequência de Ouro - Nível 67',
    'Incrível! Já são 67.000 minutos de música computados. Sessenta e sete mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    67000
),
(
    'Frequência de Ouro - Nível 68',
    'Incrível! Já são 68.000 minutos de música computados. Sessenta e oito mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    68000
),
(
    'Frequência de Ouro - Nível 69',
    'Incrível! Já são 69.000 minutos de música computados. Sessenta e nove mil minutos rodando no player.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    69000
),
(
    'Frequência de Ouro - Nível 70',
    'Incrível! Já são 70.000 minutos de música computados. Setenta mil minutos de pura melodia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    70000
),
(
    'Frequência de Ouro - Nível 71',
    'Incrível! Já são 71.000 minutos de música computados. Setenta e um mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    71000
),
(
    'Frequência de Ouro - Nível 72',
    'Incrível! Já são 72.000 minutos de música computados. Setenta e dois mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    72000
),
(
    'Frequência de Ouro - Nível 73',
    'Incrível! Já são 73.000 minutos de música computados. Setenta e três mil minutos de conexão.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    73000
),
(
    'Frequência de Ouro - Nível 74',
    'Incrível! Já são 74.000 minutos de música computados. Setenta e quatro mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    74000
),
(
    'Frequência de Ouro - Nível 75',
    'Incrível! Já são 75.000 minutos de música computados. Setenta e cinco mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    75000
),
(
    'Frequência de Ouro - Nível 76',
    'Incrível! Já são 76.000 minutos de música computados. Setenta e seis mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    76000
),
(
    'Incrível! Já são 77.000 minutos de música computados. Setenta e sete mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    77000
),
(
    'Frequência de Ouro - Nível 78',
    'Incrível! Já são 78.000 minutos de música computados. Setenta e oito mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    78000
),
(
    'Frequência de Ouro - Nível 79',
    'Incrível! Já são 79.000 minutos de música computados. O dourado está pronto para dar espaço ao brilho da platina!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    79000
),
-- Harmonia de Platina (80.000 a 99.000 minutos)
(
    'Harmonia de Platina - Nível 80',
    'Brilhante! Nosso sistema registrou 80.000 minutos de música na sua conta. Seus ouvidos são lapidados na platina mais pura!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    80000
),
(
    'Harmonia de Platina - Nível 81',
    'Brilhante! Nosso sistema registrou 81.000 minutos de música. O tom platinado brilha na sua galeria!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    81000
),
(
    'Harmonia de Platina - Nível 82',
    'Brilhante! Nosso sistema registrou 82.000 minutos de música. Oitenta e dois mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    82000
),
(
    'Harmonia de Platina - Nível 83',
    'Brilhante! Nosso sistema registrou 83.000 minutos de música. Oitenta e três mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    83000
),
(
    'Harmonia de Platina - Nível 84',
    'Brilhante! Nosso sistema registrou 84.000 minutos de música. Oitenta e quatro mil minutos de pura melodia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    84000
),
(
    'Harmonia de Platina - Nível 85',
    'Brilhante! Nosso sistema registrou 85.000 minutos de música. Oitenta e cinco mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    85000
),
(
    'Harmonia de Platina - Nível 86',
    'Brilhante! Nosso sistema registrou 86.000 minutos de música. Oitenta e seis mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    86000
),
(
    'Harmonia de Platina - Nível 87',
    'Brilhante! Nosso sistema registrou 87.000 minutos de música. Oitenta e sete mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    87000
),
(
    'Brilhante! Nosso sistema registrou 88.000 minutos de música na sua conta. Oitenta e oito mil minutos em alta definição.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    88000
),
(
    'Harmonia de Platina - Nível 89',
    'Brilhante! Nosso sistema registrou 89.000 minutos de música. Oitenta e nove mil minutos rodando no player.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    89000
),
(
    'Harmonia de Platina - Nível 90',
    'Brilhante! Nosso sistema registrou 90.000 minutos de música. Noventa mil minutos de pura melodia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    90000
),
(
    'Harmonia de Platina - Nível 91',
    'Brilhante! Nosso sistema registrou 91.000 minutos de música. Noventa e um mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    91000
),
(
    'Harmonia de Platina - Nível 92',
    'Brilhante! Nosso sistema registrou 92.000 minutos de música. Noventa e dois mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    92000
),
(
    'Harmonia de Platina - Nível 93',
    'Brilhante! Nosso sistema registrou 93.000 minutos de música. Noventa e três mil minutos de conexão.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    93000
),
(
    'Harmonia de Platina - Nível 94',
    'Brilhante! Nosso sistema registrou 94.000 minutos de música. Noventa e quatro mil minutos ouvidos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    94000
),
(
    'Harmonia de Platina - Nível 95',
    'Brilhante! Nosso sistema registrou 95.000 minutos de música. Noventa e cinco mil minutos de música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    95000
),
(
    'Harmonia de Platina - Nível 96',
    'Brilhante! Nosso sistema registrou 96.000 minutos de música. Noventa e sem mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    96000
),
(
    'Harmonia de Platina - Nível 97',
    'Brilhante! Nosso sistema registrou 97.000 minutos de música. Noventa e sete mil minutos acumulados.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    97000
),
(
    'Harmonia de Platina - Nível 98',
    'Brilhante! Nosso sistema registrou 98.000 minutos de música. Noventa e oito mil minutos de som.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    98000
),
(
    'Harmonia de Platina - Nível 99',
    'Brilhante! Nosso sistema registrou 99.000 minutos de música. Quase alcançando o topo absoluto do mito!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    99000
),
-- O Mito do Som (100.000 minutos)
(
    'O Mito do Som',
    'Você conquistou a marca lendária de 100.000 minutos de música registrados no Tunify! O silêncio é uma lenda distante no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    100000
),
-- Lenda Cósmica (110.000 a 190.000 minutos)
(
    'Lenda Cósmica - Nível 101',
    'Surreal! O Tunify registrou 110.000 minutos de música no seu histórico. Sua jornada ultrapassou a estratosfera sonora!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    110000
),
(
    'Lenda Cósmica - Nível 102',
    'Surreal! O Tunify registrou 120.000 minutos de música no seu histórico. Você brilha como uma superestrela no cosmos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    120000
),
(
    'Lenda Cósmica - Nível 103',
    'Surreal! O Tunify registrou 130.000 minutos de música no seu histórico. Uma galáxia inteira de faixas ouvidas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    130000
),
(
    'Lenda Cósmica - Nível 104',
    'Surreal! O Tunify registrou 140.000 minutos de música no seu histórico. Cento e quarenta mil minutos de áudio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    140000
),
(
    'Lenda Cósmica - Nível 105',
    'Surreal! O Tunify registrou 150.000 minutos de música no seu histórico. Seu player viaja na velocidade do som!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    150000
),
(
    'Lenda Cósmica - Nível 106',
    'Surreal! O Tunify registrou 160.000 minutos de música no seu histórico. Cento e sessenta mil minutos de música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    160000
),
(
    'Lenda Cósmica - Nível 107',
    'Surreal! O Tunify registrou 170.000 minutos de música no seu histórico. Cento e setenta mil minutos de sintonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    170000
),
(
    'Lenda Cósmica - Nível 108',
    'Surreal! O Tunify registrou 180.000 minutos de música no seu histórico. Cento e oitenta mil minutos em órbita!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    180000
),
(
    'Lenda Cósmica - Nível 109',
    'Surreal! O Tunify registrou 190.000 minutos de música no seu histórico. A gravidade sonora não te afeta mais!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    190000
),
-- Entidade do Tunify (200.000 minutos)
(
    'Entidade do Tunify',
    'A fantástica marca de 200.000 minutos registrados na sua conta! Você não apenas ouve música, você é a própria vibração do Tunify.',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    200000
),
-- Divindade do Som (225.000 a 275.000 minutos)
(
    'Divindade do Som - Nível 111',
    'Absoluto! Mapeamos 225.000 minutos no seu perfil do Tunify. Seu gosto musical dita as regras do universo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    225000
),
(
    'Divindade do Som - Nível 112',
    'Absoluto! Mapeamos 250.000 minutos no seu perfil do Tunify. Um quarto de milhão de minutos registrados!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    250000
),
(
    'Divindade do Som - Nível 113',
    'Absoluto! Mapeamos 275.000 minutos no seu perfil do Tunify. Sua galeria de áudio é lendária!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    275000
),
-- Imperador Eterno do Tunify (300.000 minutos)
(
    'Imperador Eterno do Tunify',
    'Você alcançou a marca mítica e definitiva de 300.000 minutos registrados. O trono da dinastia sonora do Tunify é inteiramente seu!',
    'permanent',
    'assets/selos/placeholder.svg',
    'minutes_played',
    300000
),

-- ==============================================================================
-- CATEGORIA 2: QUANTIDADE DE MÚSICAS ESCUTADAS (criteria_type: 'tracks_played')
-- ==============================================================================
(
    'Primeira Playlist Concluída',
    '10 músicas reproduzidas no Tunify. O catálogo começou a girar!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    10
),
(
    'Fita Cassete Cheia',
    'Você ouviu 50 faixas diferentes. Um lado A e um lado B de respeito!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    50
),
(
    'Cem por Cento Música',
    '100 faixas tocadas no player. Seu repertório musical está expandindo rápido!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    100
),
(
    'Jukebox Humana',
    '250 músicas reproduzidas. Você tem som guardado para qualquer situação!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    250
),
(
    'Meio Caminho para o Ouro',
    '500 faixas tocadas no Tunify. O som não para de rolar nos alto-falantes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    500
),
(
    'Mural do Som',
    'Você atingiu a marca de 1.000 faixas tocadas. Colecionador nato de ritmos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    1000
),
(
    'Biblioteca Musical',
    '2.500 faixas escutadas. Seu cérebro já é uma enciclopédia sonora ativa!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    2500
),
(
    'DJ Profissional',
    '5.000 músicas no currículo. Pode assumir as picapes da festa que você sabe o que faz!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    5000
),
(
    'Mestre das Playlists',
    '10.000 faixas tocadas. Cada música escutada é um pedaço da sua história!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    10000
),
(
    'Enciclopédia de Áudio',
    '15.000 faixas reproduzidas no Tunify. Um acervo de dar inveja a qualquer rádio!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    15000
),
(
    'Monstro da Reprodução',
    '20.000 faixas tocadas. Seu player trabalha em regime de escala integral de 24 horas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    20000
),
(
    'Ouvidos de Ouro',
    '30.000 faixas escutadas. Você conhece cada virada de bateria e solo de guitarra de ouvido!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    30000
),
(
    'Império do Som',
    '50.000 faixas tocadas. Você construiu um verdadeiro império musical no Tunify!',
    'permanent',
    'assets/selos/placeholder.svg',
    'tracks_played',
    50000
),

-- ==============================================================================
-- CATEGORIA 3: ARTISTAS DIFERENTES EXPLORADOS (criteria_type: 'distinct_artists')
-- ==============================================================================
(
    'Primeiros Amigos',
    'O Tunify registrou 5 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    5
),
(
    'Roda de Conversa',
    'O Tunify registrou 10 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    10
),
(
    'Mini Festival',
    'O Tunify registrou 20 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    20
),
(
    'Explorador de Palcos',
    'O Tunify registrou 30 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    30
),
(
    'Descobridor de Talentos',
    'O Tunify registrou 50 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    50
),
(
    'Gosto Ampliado',
    'O Tunify registrou 75 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    75
),
(
    'Festival de Grande Porte',
    'O Tunify registrou 100 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    100
),
(
    'Colecionador de Autógrafos',
    'O Tunify registrou 150 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    150
),
(
    'Caçador de Raridades',
    'O Tunify registrou 200 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    200
),
(
    'Radar de Novidades',
    'O Tunify registrou 300 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    300
),
(
    'Mestrado em Biografias',
    'O Tunify registrou 400 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    400
),
(
    'Diretor de Gravadora',
    'O Tunify registrou 500 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    500
),
(
    'Império dos Concertos',
    'O Tunify registrou 600 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    600
),
(
    'Enciclopédia Humana de Bandas',
    'O Tunify registrou 700 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    700
),
(
    'Patrono da Diversidade',
    'O Tunify registrou 800 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    800
),
(
    'Arqueólogo das Melodias',
    'O Tunify registrou 900 artistas diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    900
),
(
    'Lenda Suprema do Catálogo',
    'O Tunify registrou a marca histórica de 1.000 artistas diferentes no seu histórico de escuta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    1000
),

-- ==============================================================================
-- CATEGORIA 4: GÊNEROS DIFERENTES EXPLORADOS (criteria_type: 'distinct_genres')
-- ==============================================================================
(
    'Foco Inicial',
    'O Tunify registrou seu primeiro gênero musical no histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    1
),
(
    'Eclético Iniciante',
    'O Tunify registrou 3 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    3
),
(
    'Crossover Sonoro',
    'O Tunify registrou 5 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    5
),
(
    'Sem Fronteiras',
    'O Tunify registrou 8 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    8
),
(
    'Nômade Musical',
    'O Tunify registrou 10 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    10
),
(
    'Explorador Cultural',
    'O Tunify registrou 12 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    12
),
(
    'Poliglota do Som',
    'O Tunify registrou 15 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    15
),
(
    'Enciclopédia de Ritmos',
    'O Tunify registrou 20 gêneros musicais diferentes no seu histórico de escuta. Uma diversidade absoluta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    20
),
(
    'Alquimista do Som',
    'O Tunify registrou 25 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    25
),
(
    'Ouvido Sem Fronteiras',
    'O Tunify registrou 30 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    30
),
(
    'Mapeador de Culturas',
    'O Tunify registrou 35 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    35
),
(
    'Colecionador de Frequências',
    'O Tunify registrou 40 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    40
),
(
    'Antropólogo do Som',
    'O Tunify registrou 45 gêneros musicais diferentes no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    45
),
(
    'Guru Musical Supremo',
    'O Tunify registrou a incrível marca de 50 gêneros musicais diferentes no seu histórico de escuta. Sua mente musical é infinita!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    50
),

-- ==============================================================================
-- CATEGORIA 5: PLAYLISTS CRIADAS NO TUNIFY (criteria_type: 'playlists_created')
-- ==============================================================================
(
    'Primeira Mixtape',
    'Você criou sua primeira playlist no Tunify. O início de um império de curadoria!',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    1
),
(
    'Trilogia Musical',
    '3 playlists criadas por você. Uma trilha sonora dedicada para cada humor principal!',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    3
),
(
    'Arquiteto de Vibes',
    'Você sabe exatamente como criar o clima perfeito para 5 vibes e ocasiões diferentes.',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    5
),
(
    'Diretor de Programação',
    '10 playlists criadas por você. A rádio particular do seu Tunify está pronta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    10
),
(
    'Curador de Fim de Semana',
    '15 playlists autorais. Seus amigos já podem te contratar para animar os churrascos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    15
),
(
    'Fábrica de Trilhas Sonoras',
    '20 playlists criadas no Tunify. Há uma trilha específica para cada cena da sua vida.',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    20
),
(
    'Mestre da Curadoria',
    '30 playlists autorais criadas! Suas seleções mereciam ser prensadas em vinil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    30
),
(
    'Patrimônio da Organização',
    '50 playlists criadas no Tunify. Organização impecável e bom gosto de sobra!',
    'permanent',
    'assets/selos/placeholder.svg',
    'playlists_created',
    50
),

-- ==============================================================================
-- CATEGORIA 6: MÚSICAS FAVORITADAS (criteria_type: 'songs_favorited')
-- ==============================================================================
(
    'Apenas o Começo',
    'Suas primeiras 5 músicas favoritadas. O início do seu cofre de relíquias!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    5
),
(
    'Top 10 Pessoal',
    '10 músicas favoritadas. Só as melhores faixas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    10
),
(
    'Favoritas do Ano',
    '25 músicas curtidas. O seu acervo já tem uma base sólida!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    25
),
(
    'Cofre de Relíquias',
    '50 músicas favoritadas. A sua pasta secreta de sucessos está crescendo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    50
),
(
    'Coleção de Clássicos',
    '100 músicas favoritadas. Um acervo pessoal recheado de hits inesquecíveis!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    100
),
(
    'Coração de Ouro',
    'Sua pasta de Favoritas é um verdadeiro tesouro musical com 200 faixas selecionadas.',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    200
),
(
    'Museu de Sentimentos',
    '300 músicas curtidas. Cada like é uma lembrança ou um arrepio diferente registrado.',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    300
),
(
    'Playlist do Coração',
    '500 músicas favoritadas. Uma playlist de reprodução contínua e apaixonada!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    500
),
(
    'Colecionador Obsessivo',
    '1.000 músicas favoritadas. Você ama música com todo o seu corpo e alma!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    1000
),
(
    'Coração Infinito',
    '2.000 músicas favoritadas. Seu amor pela música superou todas as barreiras e limites!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    2000
),
(
    'Guardião dos Favoritos',
    '3.000 músicas favoritadas. Uma biblioteca particular de hits escolhidos a dedo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    3000
),
(
    'Império dos Likes',
    '4.000 músicas favoritadas. O seu gosto musical é um império de boas escolhas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    4000
),
(
    'Arquivista Lendário',
    'Incrível! 5.000 músicas favoritadas. Metade do caminho para o topo absoluto!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    5000
),
(
    'Curadoria Impecável',
    '6.000 músicas favoritadas. Uma coleção gigante e com curadoria de mestre!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    6000
),
(
    'Sintonia Eterna',
    '7.000 músicas favoritadas. A música bate forte no seu coração!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    7000
),
(
    'Templo das Relíquias',
    '8.000 músicas favoritadas. Seu cofre de clássicos está quase transbordando!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    8000
),
(
    'Colecionador Imparável',
    '9.000 músicas favoritadas. Você está a apenas um passo da marca mítica definitiva!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    9000
),
(
    'Lenda do Coração de Ouro',
    'Surreal! Você atingiu a marca definitiva de 10.000 músicas favoritadas. O amor supremo pela música mora aqui!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    10000
),

-- ==============================================================================
-- CATEGORIA 7: REPRODUÇÕES DURANTE A MADRUGADA - 00H ÀS 05H (criteria_type: 'night_plays')
-- ==============================================================================
(
    'Insônia Leve',
    '5 músicas tocadas de madrugada. Uma suave companhia para a mente que não consegue dormir.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    5
),
(
    'Luzes Apagadas',
    '15 músicas tocadas na calada da noite. O som sempre parece fluir melhor no escuro absoluto.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    15
),
(
    'Coruja Solitária',
    '30 músicas de madrugada. Você e a sua playlist em perfeita sintonia noturna.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    30
),
(
    'Vampiro do Som',
    'Enquanto a cidade dorme, sua trilha sonora continua ligada. 50 músicas na madrugada.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    50
),
(
    'Clube da Luta Musical',
    '100 músicas tocadas entre 00h e 05h da manhã. Afinal, o sono é para os fracos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    100
),
(
    'Guardião da Madrugada',
    '250 músicas tocadas na madrugada. O silêncio noturno é o seu maior inimigo.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    250
),
(
    'Morcego de Fone de Ouvido',
    '500 músicas ouvidas na calada da noite. A escuridão é o seu palco de shows principal!',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    500
),
(
    'Estrela da Meia-Noite',
    '600 músicas tocadas na madrugada. Você encontrou a sua verdadeira trilha noturna!',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    600
),
(
    'Sombra Musical',
    '700 músicas tocadas na madrugada. A trilha perfeita para acompanhar seus pensamentos noturnos.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    700
),
(
    'Espectro da Noite',
    '800 músicas tocadas na madrugada. Os sons da noite se tornaram parte do seu ritmo diário.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    800
),
(
    'Alquimista Noturno',
    '900 músicas tocadas na madrugada. Apenas a lua e os melhores sons como testemunhas.',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    900
),
(
    'Lenda da Madrugada',
    'Surreal! 1.000 músicas ouvidas na calada da noite. O silêncio noturno é uma lenda distante no seu perfil!',
    'permanent',
    'assets/selos/placeholder.svg',
    'night_plays',
    1000
),

-- ==============================================================================
-- CATEGORIA 8: REPRODUÇÕES DURANTE O DIA - 06H ÀS 18H (criteria_type: 'day_plays')
-- ==============================================================================
(
    'Café com Música',
    '100 músicas ouvidas durante o dia. Perfeito para acompanhar o café da manhã e começar bem!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    100
),
(
    'Foco Matutino',
    '250 músicas ouvidas durante o dia. Uma bela trilha para guiar suas manhãs.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    250
),
(
    'Trabalho em Sintonia',
    '500 músicas ouvidas durante o horário comercial. A trilha sonora oficial do seu foco e produção.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    500
),
(
    'Ritmo do Expediente',
    '750 músicas ouvidas no período diurno. A produtividade segue em alta velocidade!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    750
),
(
    'Produtividade Sonora',
    '1.000 músicas tocadas de dia. Você trabalha, estuda e vive com o fone de ouvido colado!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    1000
),
(
    'Companhia Diária',
    '1.500 músicas tocadas durante o dia. O som de fundo perfeito para todas as horas.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    1500
),
(
    'Rotina Sonora',
    '2.000 músicas ouvidas à luz do dia. Seus dias são repletos de boas vibrações!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    2000
),
(
    'Energia Solar',
    '2.500 músicas ouvidas sob a luz do dia. A música é o seu principal combustível diário!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    2500
),
(
    'Brilho do Meio-Dia',
    '3.000 músicas tocadas durante o dia. O sol brilha no topo e sua música continua tocando!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    3000
),
(
    'Energia Constante',
    '4.000 músicas ouvidas no período diurno. Sua trilha sonora não tira folga!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    4000
),
(
    'Trilha Sonora do Cotidiano',
    '5.000 músicas tocadas durante o dia. Sua rotina diária é praticamente um filme musical!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    5000
),
(
    'Sintonia Diurna',
    '6.000 músicas tocadas durante o dia. Uma dedicação musical impecável de sol a sol.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    6000
),
(
    'Movimento Solar',
    '7.000 músicas ouvidas de dia. A luz do sol guia o compasso do seu gosto musical!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    7000
),
(
    'Radiante',
    '8.000 músicas ouvidas durante o dia. Seu perfil reluz com tantas faixas sintonizadas!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    8000
),
(
    'Fidelidade da Luz',
    '9.000 músicas tocadas no período diurno. Quase alcançando o topo definitivo dos ouvintes do dia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    9000
),
(
    'Luz do Dia Vitalícia',
    'O sol é o refletor oficial do seu palco! 10.000 músicas ouvidas durante o dia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    10000
),

-- ==============================================================================
-- CATEGORIA 9: DIAS CONSECUTIVOS ESCUTANDO MÚSICA (criteria_type: 'consecutive_days')
-- ==============================================================================
(
    'Fim de Semana Estendido',
    'Dois dias seguidos de música no histórico. O hábito saudável está se formando!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    2
),
(
    'Três é Demais',
    '3 dias consecutivos de som ativo. A trilha sonora da sua vida não pode parar por nada!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    3
),
(
    'Semana Quase Cheia',
    '5 dias seguidos ouvindo música. De segunda a sexta-feira em total e absoluta sintonia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    5
),
(
    'Semana Musical Concluída',
    'Sete dias seguidos de reprodução ativa. Um ciclo semanal de som completo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    7
),
(
    'Hábito Saudável',
    '10 dias consecutivos de música. Suas tarefas diárias rendem muito mais com uma melodia!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    10
),
(
    'Quinze Dias de Ritmo',
    'Metade do mês garantida! 15 dias seguidos sem passar um único dia no silêncio.',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    15
),
(
    'Foco Consistente',
    '20 dias consecutivos de música. Suas playlists já fazem parte da sua rotina diária!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    20
),
(
    'Mensalidade Sonora',
    '30 dias consecutivos ouvindo música. Um mês inteiro sem passar um dia sequer no silêncio!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    30
),
(
    'Hábito Inquebrável',
    '45 dias seguidos de música no histórico. A sintonia fina com o seu dia a dia é absoluta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    45
),
(
    'Dois Meses de Sintonia',
    '60 dias seguidos de música ativa! O silêncio foi completamente exilado do seu cotidiano.',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    60
),
(
    'Ritmo Ininterrupto',
    '75 dias seguidos de som ativo. Seus dias têm uma trilha sonora ininterrupta de alta qualidade!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    75
),
(
    'Estação Musical',
    '90 dias seguidos de som! Uma estação do ano inteirinha regada a muita música.',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    90
),
(
    'Quatro Estações',
    '120 dias consecutivos ouvindo música. Quadrimestre inteiro de batidas e melodias inesquecíveis!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    120
),
(
    'Sinfonia de Ferro',
    '150 dias seguidos de reproduções diárias. Sua persistência musical é de ferro!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    150
),
(
    'Semestre do Som',
    '180 dias consecutivos de música. Meio ano de fidelidade sonora absoluta!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    180
),
(
    'Viajante do Tempo',
    '240 dias seguidos de música no seu histórico. Quase oito meses de pura melodia diária!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    240
),
(
    'Grande Maestro',
    '300 dias seguidos ouvindo música. Você rege a trilha sonora da sua vida com maestria impecável!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    300
),
(
    'Um Ano Sem Silêncio',
    '365 dias seguidos ouvindo música! Você viveu um ano inteiro em perfeita harmonia.',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    365
),

-- ==============================================================================
-- CATEGORIA 10: COMPATIBILIDADE NO MATCH DE VIBE (criteria_type: 'match_vibe_compatibility')
-- ==============================================================================
(
    'Sintonia Inicial',
    'Conseguiu um Match de Vibe com 80% de compatibilidade. Vocês têm bastante som em comum!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    80
),
(
    'Bons Companheiros',
    'Match de Vibe com 85% de compatibilidade. Uma excelente trilha para dividirem em uma viagem!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    85
),
(
    'Almas Afins',
    'Match de Vibe com 90% de compatibilidade. O gosto musical de vocês é quase um espelho!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    90
),
(
    'Alma Gêmea Musical',
    'Match de Vibe com 95% de compatibilidade. Vocês dividem exatamente o mesmo DNA sonoro!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    95
),
(
    'Gêmeos Monozigóticos do Som',
    'Match de Vibe de 98%! É assustador o quanto vocês escutam as mesmas bandas e gêneros!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    98
),
(
    'Telepatia Acústica',
    'Match de Vibe lendário com 100% de compatibilidade! Vocês dividem literalmente a mesma mente musical!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_compatibility',
    100
),

-- ==============================================================================
-- CATEGORIA 11: QUANTIDADE DE MATCHES REALIZADOS (criteria_type: 'match_vibe_count')
-- ==============================================================================
(
    'Cupido do Som',
    'Fez o seu primeiro Match de Vibe no Tunify Sync. A conexão sonora começou!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    1
),
(
    'Socialite Musical',
    'Fez 5 Matches de Vibe diferentes. Você adora ver a sintonia musical com os outros!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    5
),
(
    'Colecionador de Vibes',
    '10 Matches de Vibe no currículo. Conectando pessoas e expandindo círculos pelo ritmo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    10
),
(
    'Influenciador de Sintonia',
    '25 Matches de Vibe realizados. Você já conhece a vibração de boa parte da galera!',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    25
),
(
    'Embaixador do Tunify Sync',
    '50 Matches de Vibe! A sua rede de conexões e amizades musicais é simplesmente gigantesca.',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    50
),
(
    'Lenda da Conexão',
    '100 Matches de Vibe completados! Você é o maior conector de almas sonoras da nossa história.',
    'permanent',
    'assets/selos/placeholder.svg',
    'match_vibe_count',
    100
),

-- ==============================================================================,
-- CATEGORIA 12: DOMÍNIO E ESPECIALIZAÇÃO POR GÊNERO,
-- ==============================================================================
,
-- Sertanejo,
(
    'Sertanejo: Plays - 100',
    'O Tunify registrou 100 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    100
),
(
    'Sertanejo: Plays - 250',
    'O Tunify registrou 250 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    250
),
(
    'Sertanejo: Plays - 500',
    'O Tunify registrou 500 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    500
),
(
    'Sertanejo: Plays - 750',
    'O Tunify registrou 750 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    750
),
(
    'Sertanejo: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    1000
),
(
    'Sertanejo: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    1500
),
(
    'Sertanejo: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    2000
),
(
    'Sertanejo: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    2500
),
(
    'Sertanejo: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de sertanejo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_sertanejo',
    3000
),
(
    'Sertanejo: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    50
),
(
    'Sertanejo: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    100
),
(
    'Sertanejo: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    150
),
(
    'Sertanejo: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    200
),
(
    'Sertanejo: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    250
),
(
    'Sertanejo: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    300
),
(
    'Sertanejo: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    350
),
(
    'Sertanejo: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    400
),
(
    'Sertanejo: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    450
),
(
    'Sertanejo: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    500
),
(
    'Sertanejo: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    600
),
(
    'Sertanejo: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    700
),
(
    'Sertanejo: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    800
),
(
    'Sertanejo: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    900
),
(
    'Sertanejo: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de sertanejo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_sertanejo',
    1000
),
(
    'Sertanejo: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    3
),
(
    'Sertanejo: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    5
),
(
    'Sertanejo: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    10
),
(
    'Sertanejo: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    12
),
(
    'Sertanejo: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    15
),
(
    'Sertanejo: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    17
),
(
    'Sertanejo: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    20
),
(
    'Sertanejo: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    25
),
(
    'Sertanejo: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    30
),
(
    'Sertanejo: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    35
),
(
    'Sertanejo: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    40
),
(
    'Sertanejo: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    45
),
(
    'Sertanejo: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    50
),
(
    'Sertanejo: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    60
),
(
    'Sertanejo: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    70
),
(
    'Sertanejo: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    80
),
(
    'Sertanejo: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    90
),
(
    'Sertanejo: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de sertanejo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_sertanejo',
    100
),
-- Funk,
(
    'Funk: Plays - 100',
    'O Tunify registrou 100 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    100
),
(
    'Funk: Plays - 250',
    'O Tunify registrou 250 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    250
),
(
    'Funk: Plays - 500',
    'O Tunify registrou 500 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    500
),
(
    'Funk: Plays - 750',
    'O Tunify registrou 750 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    750
),
(
    'Funk: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    1000
),
(
    'Funk: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    1500
),
(
    'Funk: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    2000
),
(
    'Funk: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    2500
),
(
    'Funk: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de funk no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_funk',
    3000
),
(
    'Funk: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    50
),
(
    'Funk: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    100
),
(
    'Funk: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    150
),
(
    'Funk: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    200
),
(
    'Funk: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    250
),
(
    'Funk: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    300
),
(
    'Funk: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    350
),
(
    'Funk: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    400
),
(
    'Funk: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    450
),
(
    'Funk: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    500
),
(
    'Funk: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    600
),
(
    'Funk: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    700
),
(
    'Funk: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    800
),
(
    'Funk: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    900
),
(
    'Funk: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de funk no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_funk',
    1000
),
(
    'Funk: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    3
),
(
    'Funk: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    5
),
(
    'Funk: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    10
),
(
    'Funk: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    12
),
(
    'Funk: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    15
),
(
    'Funk: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    17
),
(
    'Funk: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    20
),
(
    'Funk: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    25
),
(
    'Funk: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    30
),
(
    'Funk: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    35
),
(
    'Funk: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    40
),
(
    'Funk: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    45
),
(
    'Funk: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    50
),
(
    'Funk: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    60
),
(
    'Funk: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    70
),
(
    'Funk: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    80
),
(
    'Funk: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    90
),
(
    'Funk: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de funk no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_funk',
    100
),
-- Samba,
(
    'Samba: Plays - 100',
    'O Tunify registrou 100 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    100
),
(
    'Samba: Plays - 250',
    'O Tunify registrou 250 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    250
),
(
    'Samba: Plays - 500',
    'O Tunify registrou 500 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    500
),
(
    'Samba: Plays - 750',
    'O Tunify registrou 750 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    750
),
(
    'Samba: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    1000
),
(
    'Samba: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    1500
),
(
    'Samba: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    2000
),
(
    'Samba: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    2500
),
(
    'Samba: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de samba no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_samba',
    3000
),
(
    'Samba: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    50
),
(
    'Samba: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    100
),
(
    'Samba: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    150
),
(
    'Samba: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    200
),
(
    'Samba: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    250
),
(
    'Samba: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    300
),
(
    'Samba: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    350
),
(
    'Samba: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    400
),
(
    'Samba: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    450
),
(
    'Samba: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    500
),
(
    'Samba: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    600
),
(
    'Samba: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    700
),
(
    'Samba: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    800
),
(
    'Samba: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    900
),
(
    'Samba: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de samba no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_samba',
    1000
),
(
    'Samba: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    3
),
(
    'Samba: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    5
),
(
    'Samba: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    10
),
(
    'Samba: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    12
),
(
    'Samba: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    15
),
(
    'Samba: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    17
),
(
    'Samba: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    20
),
(
    'Samba: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    25
),
(
    'Samba: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    30
),
(
    'Samba: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    35
),
(
    'Samba: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    40
),
(
    'Samba: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    45
),
(
    'Samba: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    50
),
(
    'Samba: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    60
),
(
    'Samba: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    70
),
(
    'Samba: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    80
),
(
    'Samba: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    90
),
(
    'Samba: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de samba no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_samba',
    100
),
-- Pagode,
(
    'Pagode: Plays - 100',
    'O Tunify registrou 100 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    100
),
(
    'Pagode: Plays - 250',
    'O Tunify registrou 250 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    250
),
(
    'Pagode: Plays - 500',
    'O Tunify registrou 500 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    500
),
(
    'Pagode: Plays - 750',
    'O Tunify registrou 750 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    750
),
(
    'Pagode: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    1000
),
(
    'Pagode: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    1500
),
(
    'Pagode: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    2000
),
(
    'Pagode: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    2500
),
(
    'Pagode: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de pagode no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pagode',
    3000
),
(
    'Pagode: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    50
),
(
    'Pagode: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    100
),
(
    'Pagode: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    150
),
(
    'Pagode: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    200
),
(
    'Pagode: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    250
),
(
    'Pagode: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    300
),
(
    'Pagode: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    350
),
(
    'Pagode: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    400
),
(
    'Pagode: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    450
),
(
    'Pagode: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    500
),
(
    'Pagode: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    600
),
(
    'Pagode: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    700
),
(
    'Pagode: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    800
),
(
    'Pagode: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    900
),
(
    'Pagode: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de pagode no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pagode',
    1000
),
(
    'Pagode: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    3
),
(
    'Pagode: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    5
),
(
    'Pagode: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    10
),
(
    'Pagode: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    12
),
(
    'Pagode: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    15
),
(
    'Pagode: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    17
),
(
    'Pagode: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    20
),
(
    'Pagode: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    25
),
(
    'Pagode: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    30
),
(
    'Pagode: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    35
),
(
    'Pagode: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    40
),
(
    'Pagode: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    45
),
(
    'Pagode: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    50
),
(
    'Pagode: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    60
),
(
    'Pagode: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    70
),
(
    'Pagode: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    80
),
(
    'Pagode: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    90
),
(
    'Pagode: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de pagode no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pagode',
    100
),
-- Hip-Hop,
(
    'Hip-Hop: Plays - 100',
    'O Tunify registrou 100 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    100
),
(
    'Hip-Hop: Plays - 250',
    'O Tunify registrou 250 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    250
),
(
    'Hip-Hop: Plays - 500',
    'O Tunify registrou 500 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    500
),
(
    'Hip-Hop: Plays - 750',
    'O Tunify registrou 750 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    750
),
(
    'Hip-Hop: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    1000
),
(
    'Hip-Hop: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    1500
),
(
    'Hip-Hop: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    2000
),
(
    'Hip-Hop: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    2500
),
(
    'Hip-Hop: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de hip-hop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_hiphop',
    3000
),
(
    'Hip-Hop: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    50
),
(
    'Hip-Hop: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    100
),
(
    'Hip-Hop: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    150
),
(
    'Hip-Hop: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    200
),
(
    'Hip-Hop: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    250
),
(
    'Hip-Hop: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    300
),
(
    'Hip-Hop: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    350
),
(
    'Hip-Hop: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    400
),
(
    'Hip-Hop: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    450
),
(
    'Hip-Hop: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    500
),
(
    'Hip-Hop: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    600
),
(
    'Hip-Hop: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    700
),
(
    'Hip-Hop: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    800
),
(
    'Hip-Hop: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    900
),
(
    'Hip-Hop: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de hip-hop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_hiphop',
    1000
),
(
    'Hip-Hop: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    3
),
(
    'Hip-Hop: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    5
),
(
    'Hip-Hop: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    10
),
(
    'Hip-Hop: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    12
),
(
    'Hip-Hop: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    15
),
(
    'Hip-Hop: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    17
),
(
    'Hip-Hop: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    20
),
(
    'Hip-Hop: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    25
),
(
    'Hip-Hop: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    30
),
(
    'Hip-Hop: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    35
),
(
    'Hip-Hop: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    40
),
(
    'Hip-Hop: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    45
),
(
    'Hip-Hop: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    50
),
(
    'Hip-Hop: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    60
),
(
    'Hip-Hop: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    70
),
(
    'Hip-Hop: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    80
),
(
    'Hip-Hop: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    90
),
(
    'Hip-Hop: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de hip-hop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_hiphop',
    100
),
-- Rap,
(
    'Rap: Plays - 100',
    'O Tunify registrou 100 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    100
),
(
    'Rap: Plays - 250',
    'O Tunify registrou 250 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    250
),
(
    'Rap: Plays - 500',
    'O Tunify registrou 500 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    500
),
(
    'Rap: Plays - 750',
    'O Tunify registrou 750 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    750
),
(
    'Rap: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    1000
),
(
    'Rap: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    1500
),
(
    'Rap: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    2000
),
(
    'Rap: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    2500
),
(
    'Rap: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de rap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rap',
    3000
),
(
    'Rap: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    50
),
(
    'Rap: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    100
),
(
    'Rap: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    150
),
(
    'Rap: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    200
),
(
    'Rap: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    250
),
(
    'Rap: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    300
),
(
    'Rap: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    350
),
(
    'Rap: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    400
),
(
    'Rap: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    450
),
(
    'Rap: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    500
),
(
    'Rap: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    600
),
(
    'Rap: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    700
),
(
    'Rap: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    800
),
(
    'Rap: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    900
),
(
    'Rap: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de rap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rap',
    1000
),
(
    'Rap: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    3
),
(
    'Rap: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    5
),
(
    'Rap: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    10
),
(
    'Rap: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    12
),
(
    'Rap: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    15
),
(
    'Rap: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    17
),
(
    'Rap: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    20
),
(
    'Rap: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    25
),
(
    'Rap: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    30
),
(
    'Rap: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    35
),
(
    'Rap: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    40
),
(
    'Rap: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    45
),
(
    'Rap: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    50
),
(
    'Rap: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    60
),
(
    'Rap: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    70
),
(
    'Rap: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    80
),
(
    'Rap: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    90
),
(
    'Rap: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de rap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rap',
    100
),
-- Trap,
(
    'Trap: Plays - 100',
    'O Tunify registrou 100 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    100
),
(
    'Trap: Plays - 250',
    'O Tunify registrou 250 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    250
),
(
    'Trap: Plays - 500',
    'O Tunify registrou 500 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    500
),
(
    'Trap: Plays - 750',
    'O Tunify registrou 750 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    750
),
(
    'Trap: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    1000
),
(
    'Trap: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    1500
),
(
    'Trap: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    2000
),
(
    'Trap: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    2500
),
(
    'Trap: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de trap no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_trap',
    3000
),
(
    'Trap: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    50
),
(
    'Trap: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    100
),
(
    'Trap: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    150
),
(
    'Trap: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    200
),
(
    'Trap: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    250
),
(
    'Trap: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    300
),
(
    'Trap: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    350
),
(
    'Trap: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    400
),
(
    'Trap: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    450
),
(
    'Trap: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    500
),
(
    'Trap: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    600
),
(
    'Trap: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    700
),
(
    'Trap: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    800
),
(
    'Trap: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    900
),
(
    'Trap: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de trap no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_trap',
    1000
),
(
    'Trap: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    3
),
(
    'Trap: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    5
),
(
    'Trap: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    10
),
(
    'Trap: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    12
),
(
    'Trap: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    15
),
(
    'Trap: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    17
),
(
    'Trap: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    20
),
(
    'Trap: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    25
),
(
    'Trap: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    30
),
(
    'Trap: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    35
),
(
    'Trap: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    40
),
(
    'Trap: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    45
),
(
    'Trap: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    50
),
(
    'Trap: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    60
),
(
    'Trap: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    70
),
(
    'Trap: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    80
),
(
    'Trap: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    90
),
(
    'Trap: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de trap no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_trap',
    100
),
-- Jazz,
(
    'Jazz: Plays - 100',
    'O Tunify registrou 100 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    100
),
(
    'Jazz: Plays - 250',
    'O Tunify registrou 250 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    250
),
(
    'Jazz: Plays - 500',
    'O Tunify registrou 500 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    500
),
(
    'Jazz: Plays - 750',
    'O Tunify registrou 750 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    750
),
(
    'Jazz: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    1000
),
(
    'Jazz: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    1500
),
(
    'Jazz: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    2000
),
(
    'Jazz: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    2500
),
(
    'Jazz: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de jazz no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_jazz',
    3000
),
(
    'Jazz: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    50
),
(
    'Jazz: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    100
),
(
    'Jazz: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    150
),
(
    'Jazz: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    200
),
(
    'Jazz: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    250
),
(
    'Jazz: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    300
),
(
    'Jazz: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    350
),
(
    'Jazz: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    400
),
(
    'Jazz: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    450
),
(
    'Jazz: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    500
),
(
    'Jazz: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    600
),
(
    'Jazz: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    700
),
(
    'Jazz: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    800
),
(
    'Jazz: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    900
),
(
    'Jazz: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de jazz no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_jazz',
    1000
),
(
    'Jazz: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    3
),
(
    'Jazz: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    5
),
(
    'Jazz: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    10
),
(
    'Jazz: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    12
),
(
    'Jazz: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    15
),
(
    'Jazz: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    17
),
(
    'Jazz: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    20
),
(
    'Jazz: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    25
),
(
    'Jazz: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    30
),
(
    'Jazz: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    35
),
(
    'Jazz: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    40
),
(
    'Jazz: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    45
),
(
    'Jazz: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    50
),
(
    'Jazz: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    60
),
(
    'Jazz: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    70
),
(
    'Jazz: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    80
),
(
    'Jazz: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    90
),
(
    'Jazz: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de jazz no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_jazz',
    100
),
-- Blues,
(
    'Blues: Plays - 100',
    'O Tunify registrou 100 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    100
),
(
    'Blues: Plays - 250',
    'O Tunify registrou 250 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    250
),
(
    'Blues: Plays - 500',
    'O Tunify registrou 500 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    500
),
(
    'Blues: Plays - 750',
    'O Tunify registrou 750 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    750
),
(
    'Blues: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    1000
),
(
    'Blues: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    1500
),
(
    'Blues: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    2000
),
(
    'Blues: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    2500
),
(
    'Blues: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de blues no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_blues',
    3000
),
(
    'Blues: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    50
),
(
    'Blues: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    100
),
(
    'Blues: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    150
),
(
    'Blues: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    200
),
(
    'Blues: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    250
),
(
    'Blues: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    300
),
(
    'Blues: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    350
),
(
    'Blues: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    400
),
(
    'Blues: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    450
),
(
    'Blues: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    500
),
(
    'Blues: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    600
),
(
    'Blues: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    700
),
(
    'Blues: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    800
),
(
    'Blues: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    900
),
(
    'Blues: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de blues no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_blues',
    1000
),
(
    'Blues: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    3
),
(
    'Blues: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    5
),
(
    'Blues: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    10
),
(
    'Blues: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    12
),
(
    'Blues: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    15
),
(
    'Blues: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    17
),
(
    'Blues: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    20
),
(
    'Blues: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    25
),
(
    'Blues: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    30
),
(
    'Blues: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    35
),
(
    'Blues: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    40
),
(
    'Blues: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    45
),
(
    'Blues: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    50
),
(
    'Blues: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    60
),
(
    'Blues: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    70
),
(
    'Blues: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    80
),
(
    'Blues: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    90
),
(
    'Blues: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de blues no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_blues',
    100
),
-- Clássica,
(
    'Clássica: Plays - 100',
    'O Tunify registrou 100 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    100
),
(
    'Clássica: Plays - 250',
    'O Tunify registrou 250 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    250
),
(
    'Clássica: Plays - 500',
    'O Tunify registrou 500 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    500
),
(
    'Clássica: Plays - 750',
    'O Tunify registrou 750 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    750
),
(
    'Clássica: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    1000
),
(
    'Clássica: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    1500
),
(
    'Clássica: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    2000
),
(
    'Clássica: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    2500
),
(
    'Clássica: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de clássica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_classica',
    3000
),
(
    'Clássica: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    50
),
(
    'Clássica: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    100
),
(
    'Clássica: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    150
),
(
    'Clássica: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    200
),
(
    'Clássica: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    250
),
(
    'Clássica: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    300
),
(
    'Clássica: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    350
),
(
    'Clássica: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    400
),
(
    'Clássica: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    450
),
(
    'Clássica: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    500
),
(
    'Clássica: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    600
),
(
    'Clássica: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    700
),
(
    'Clássica: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    800
),
(
    'Clássica: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    900
),
(
    'Clássica: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de clássica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_classica',
    1000
),
(
    'Clássica: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    3
),
(
    'Clássica: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    5
),
(
    'Clássica: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    10
),
(
    'Clássica: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    12
),
(
    'Clássica: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    15
),
(
    'Clássica: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    17
),
(
    'Clássica: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    20
),
(
    'Clássica: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    25
),
(
    'Clássica: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    30
),
(
    'Clássica: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    35
),
(
    'Clássica: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    40
),
(
    'Clássica: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    45
),
(
    'Clássica: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    50
),
(
    'Clássica: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    60
),
(
    'Clássica: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    70
),
(
    'Clássica: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    80
),
(
    'Clássica: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    90
),
(
    'Clássica: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de clássica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_classica',
    100
),
-- R&B,
(
    'R&B: Plays - 100',
    'O Tunify registrou 100 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    100
),
(
    'R&B: Plays - 250',
    'O Tunify registrou 250 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    250
),
(
    'R&B: Plays - 500',
    'O Tunify registrou 500 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    500
),
(
    'R&B: Plays - 750',
    'O Tunify registrou 750 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    750
),
(
    'R&B: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    1000
),
(
    'R&B: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    1500
),
(
    'R&B: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    2000
),
(
    'R&B: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    2500
),
(
    'R&B: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de r&b no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rnb',
    3000
),
(
    'R&B: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    50
),
(
    'R&B: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    100
),
(
    'R&B: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    150
),
(
    'R&B: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    200
),
(
    'R&B: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    250
),
(
    'R&B: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    300
),
(
    'R&B: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    350
),
(
    'R&B: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    400
),
(
    'R&B: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    450
),
(
    'R&B: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    500
),
(
    'R&B: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    600
),
(
    'R&B: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    700
),
(
    'R&B: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    800
),
(
    'R&B: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    900
),
(
    'R&B: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de r&b no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rnb',
    1000
),
(
    'R&B: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    3
),
(
    'R&B: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    5
),
(
    'R&B: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    10
),
(
    'R&B: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    12
),
(
    'R&B: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    15
),
(
    'R&B: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    17
),
(
    'R&B: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    20
),
(
    'R&B: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    25
),
(
    'R&B: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    30
),
(
    'R&B: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    35
),
(
    'R&B: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    40
),
(
    'R&B: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    45
),
(
    'R&B: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    50
),
(
    'R&B: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    60
),
(
    'R&B: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    70
),
(
    'R&B: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    80
),
(
    'R&B: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    90
),
(
    'R&B: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de r&b no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rnb',
    100
),
-- Gospel,
(
    'Gospel: Plays - 100',
    'O Tunify registrou 100 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    100
),
(
    'Gospel: Plays - 250',
    'O Tunify registrou 250 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    250
),
(
    'Gospel: Plays - 500',
    'O Tunify registrou 500 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    500
),
(
    'Gospel: Plays - 750',
    'O Tunify registrou 750 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    750
),
(
    'Gospel: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    1000
),
(
    'Gospel: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    1500
),
(
    'Gospel: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    2000
),
(
    'Gospel: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    2500
),
(
    'Gospel: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de gospel no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_gospel',
    3000
),
(
    'Gospel: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    50
),
(
    'Gospel: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    100
),
(
    'Gospel: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    150
),
(
    'Gospel: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    200
),
(
    'Gospel: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    250
),
(
    'Gospel: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    300
),
(
    'Gospel: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    350
),
(
    'Gospel: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    400
),
(
    'Gospel: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    450
),
(
    'Gospel: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    500
),
(
    'Gospel: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    600
),
(
    'Gospel: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    700
),
(
    'Gospel: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    800
),
(
    'Gospel: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    900
),
(
    'Gospel: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de gospel no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_gospel',
    1000
),
(
    'Gospel: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    3
),
(
    'Gospel: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    5
),
(
    'Gospel: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    10
),
(
    'Gospel: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    12
),
(
    'Gospel: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    15
),
(
    'Gospel: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    17
),
(
    'Gospel: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    20
),
(
    'Gospel: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    25
),
(
    'Gospel: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    30
),
(
    'Gospel: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    35
),
(
    'Gospel: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    40
),
(
    'Gospel: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    45
),
(
    'Gospel: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    50
),
(
    'Gospel: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    60
),
(
    'Gospel: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    70
),
(
    'Gospel: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    80
),
(
    'Gospel: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    90
),
(
    'Gospel: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de gospel no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_gospel',
    100
),
-- Bossa Nova,
(
    'Bossa Nova: Plays - 100',
    'O Tunify registrou 100 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    100
),
(
    'Bossa Nova: Plays - 250',
    'O Tunify registrou 250 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    250
),
(
    'Bossa Nova: Plays - 500',
    'O Tunify registrou 500 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    500
),
(
    'Bossa Nova: Plays - 750',
    'O Tunify registrou 750 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    750
),
(
    'Bossa Nova: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    1000
),
(
    'Bossa Nova: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    1500
),
(
    'Bossa Nova: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    2000
),
(
    'Bossa Nova: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    2500
),
(
    'Bossa Nova: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de bossa nova no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_bossanova',
    3000
),
(
    'Bossa Nova: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    50
),
(
    'Bossa Nova: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    100
),
(
    'Bossa Nova: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    150
),
(
    'Bossa Nova: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    200
),
(
    'Bossa Nova: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    250
),
(
    'Bossa Nova: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    300
),
(
    'Bossa Nova: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    350
),
(
    'Bossa Nova: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    400
),
(
    'Bossa Nova: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    450
),
(
    'Bossa Nova: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    500
),
(
    'Bossa Nova: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    600
),
(
    'Bossa Nova: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    700
),
(
    'Bossa Nova: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    800
),
(
    'Bossa Nova: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    900
),
(
    'Bossa Nova: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de bossa nova no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_bossanova',
    1000
),
(
    'Bossa Nova: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    3
),
(
    'Bossa Nova: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    5
),
(
    'Bossa Nova: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    10
),
(
    'Bossa Nova: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    12
),
(
    'Bossa Nova: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    15
),
(
    'Bossa Nova: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    17
),
(
    'Bossa Nova: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    20
),
(
    'Bossa Nova: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    25
),
(
    'Bossa Nova: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    30
),
(
    'Bossa Nova: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    35
),
(
    'Bossa Nova: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    40
),
(
    'Bossa Nova: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    45
),
(
    'Bossa Nova: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    50
),
(
    'Bossa Nova: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    60
),
(
    'Bossa Nova: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    70
),
(
    'Bossa Nova: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    80
),
(
    'Bossa Nova: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    90
),
(
    'Bossa Nova: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de bossa nova no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_bossanova',
    100
),
-- Forró,
(
    'Forró: Plays - 100',
    'O Tunify registrou 100 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    100
),
(
    'Forró: Plays - 250',
    'O Tunify registrou 250 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    250
),
(
    'Forró: Plays - 500',
    'O Tunify registrou 500 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    500
),
(
    'Forró: Plays - 750',
    'O Tunify registrou 750 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    750
),
(
    'Forró: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    1000
),
(
    'Forró: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    1500
),
(
    'Forró: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    2000
),
(
    'Forró: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    2500
),
(
    'Forró: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de forró no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_forro',
    3000
),
(
    'Forró: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    50
),
(
    'Forró: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    100
),
(
    'Forró: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    150
),
(
    'Forró: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    200
),
(
    'Forró: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    250
),
(
    'Forró: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    300
),
(
    'Forró: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    350
),
(
    'Forró: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    400
),
(
    'Forró: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    450
),
(
    'Forró: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    500
),
(
    'Forró: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    600
),
(
    'Forró: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    700
),
(
    'Forró: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    800
),
(
    'Forró: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    900
),
(
    'Forró: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de forró no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_forro',
    1000
),
(
    'Forró: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    3
),
(
    'Forró: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    5
),
(
    'Forró: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    10
),
(
    'Forró: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    12
),
(
    'Forró: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    15
),
(
    'Forró: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    17
),
(
    'Forró: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    20
),
(
    'Forró: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    25
),
(
    'Forró: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    30
),
(
    'Forró: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    35
),
(
    'Forró: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    40
),
(
    'Forró: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    45
),
(
    'Forró: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    50
),
(
    'Forró: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    60
),
(
    'Forró: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    70
),
(
    'Forró: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    80
),
(
    'Forró: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    90
),
(
    'Forró: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de forró no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_forro',
    100
),
-- Rock Nacional,
(
    'Rock Nacional: Plays - 100',
    'O Tunify registrou 100 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    100
),
(
    'Rock Nacional: Plays - 250',
    'O Tunify registrou 250 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    250
),
(
    'Rock Nacional: Plays - 500',
    'O Tunify registrou 500 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    500
),
(
    'Rock Nacional: Plays - 750',
    'O Tunify registrou 750 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    750
),
(
    'Rock Nacional: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    1000
),
(
    'Rock Nacional: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    1500
),
(
    'Rock Nacional: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    2000
),
(
    'Rock Nacional: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    2500
),
(
    'Rock Nacional: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de rock nacional no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rocknacional',
    3000
),
(
    'Rock Nacional: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    50
),
(
    'Rock Nacional: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    100
),
(
    'Rock Nacional: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    150
),
(
    'Rock Nacional: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    200
),
(
    'Rock Nacional: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    250
),
(
    'Rock Nacional: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    300
),
(
    'Rock Nacional: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    350
),
(
    'Rock Nacional: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    400
),
(
    'Rock Nacional: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    450
),
(
    'Rock Nacional: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    500
),
(
    'Rock Nacional: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    600
),
(
    'Rock Nacional: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    700
),
(
    'Rock Nacional: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    800
),
(
    'Rock Nacional: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    900
),
(
    'Rock Nacional: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de rock nacional no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rocknacional',
    1000
),
(
    'Rock Nacional: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    3
),
(
    'Rock Nacional: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    5
),
(
    'Rock Nacional: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    10
),
(
    'Rock Nacional: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    12
),
(
    'Rock Nacional: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    15
),
(
    'Rock Nacional: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    17
),
(
    'Rock Nacional: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    20
),
(
    'Rock Nacional: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    25
),
(
    'Rock Nacional: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    30
),
(
    'Rock Nacional: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    35
),
(
    'Rock Nacional: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    40
),
(
    'Rock Nacional: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    45
),
(
    'Rock Nacional: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    50
),
(
    'Rock Nacional: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    60
),
(
    'Rock Nacional: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    70
),
(
    'Rock Nacional: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    80
),
(
    'Rock Nacional: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    90
),
(
    'Rock Nacional: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de rock nacional no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rocknacional',
    100
),
-- Piseiro,
(
    'Piseiro: Plays - 100',
    'O Tunify registrou 100 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    100
),
(
    'Piseiro: Plays - 250',
    'O Tunify registrou 250 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    250
),
(
    'Piseiro: Plays - 500',
    'O Tunify registrou 500 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    500
),
(
    'Piseiro: Plays - 750',
    'O Tunify registrou 750 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    750
),
(
    'Piseiro: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    1000
),
(
    'Piseiro: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    1500
),
(
    'Piseiro: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    2000
),
(
    'Piseiro: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    2500
),
(
    'Piseiro: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de piseiro no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_piseiro',
    3000
),
(
    'Piseiro: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    50
),
(
    'Piseiro: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    100
),
(
    'Piseiro: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    150
),
(
    'Piseiro: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    200
),
(
    'Piseiro: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    250
),
(
    'Piseiro: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    300
),
(
    'Piseiro: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    350
),
(
    'Piseiro: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    400
),
(
    'Piseiro: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    450
),
(
    'Piseiro: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    500
),
(
    'Piseiro: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    600
),
(
    'Piseiro: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    700
),
(
    'Piseiro: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    800
),
(
    'Piseiro: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    900
),
(
    'Piseiro: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de piseiro no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_piseiro',
    1000
),
(
    'Piseiro: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    3
),
(
    'Piseiro: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    5
),
(
    'Piseiro: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    10
),
(
    'Piseiro: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    12
),
(
    'Piseiro: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    15
),
(
    'Piseiro: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    17
),
(
    'Piseiro: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    20
),
(
    'Piseiro: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    25
),
(
    'Piseiro: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    30
),
(
    'Piseiro: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    35
),
(
    'Piseiro: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    40
),
(
    'Piseiro: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    45
),
(
    'Piseiro: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    50
),
(
    'Piseiro: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    60
),
(
    'Piseiro: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    70
),
(
    'Piseiro: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    80
),
(
    'Piseiro: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    90
),
(
    'Piseiro: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de piseiro no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_piseiro',
    100
),
-- Rock,
(
    'Rock: Plays - 100',
    'O Tunify registrou 100 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    100
),
(
    'Rock: Plays - 250',
    'O Tunify registrou 250 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    250
),
(
    'Rock: Plays - 500',
    'O Tunify registrou 500 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    500
),
(
    'Rock: Plays - 750',
    'O Tunify registrou 750 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    750
),
(
    'Rock: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    1000
),
(
    'Rock: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    1500
),
(
    'Rock: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    2000
),
(
    'Rock: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    2500
),
(
    'Rock: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de rock no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_rock',
    3000
),
(
    'Rock: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    50
),
(
    'Rock: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    100
),
(
    'Rock: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    150
),
(
    'Rock: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    200
),
(
    'Rock: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    250
),
(
    'Rock: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    300
),
(
    'Rock: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    350
),
(
    'Rock: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    400
),
(
    'Rock: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    450
),
(
    'Rock: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    500
),
(
    'Rock: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    600
),
(
    'Rock: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    700
),
(
    'Rock: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    800
),
(
    'Rock: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    900
),
(
    'Rock: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de rock no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_rock',
    1000
),
(
    'Rock: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    3
),
(
    'Rock: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    5
),
(
    'Rock: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    10
),
(
    'Rock: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    12
),
(
    'Rock: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    15
),
(
    'Rock: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    17
),
(
    'Rock: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    20
),
(
    'Rock: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    25
),
(
    'Rock: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    30
),
(
    'Rock: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    35
),
(
    'Rock: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    40
),
(
    'Rock: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    45
),
(
    'Rock: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    50
),
(
    'Rock: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    60
),
(
    'Rock: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    70
),
(
    'Rock: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    80
),
(
    'Rock: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    90
),
(
    'Rock: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de rock no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_rock',
    100
),
-- Pop,
(
    'Pop: Plays - 100',
    'O Tunify registrou 100 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    100
),
(
    'Pop: Plays - 250',
    'O Tunify registrou 250 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    250
),
(
    'Pop: Plays - 500',
    'O Tunify registrou 500 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    500
),
(
    'Pop: Plays - 750',
    'O Tunify registrou 750 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    750
),
(
    'Pop: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    1000
),
(
    'Pop: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    1500
),
(
    'Pop: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    2000
),
(
    'Pop: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    2500
),
(
    'Pop: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de pop no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_pop',
    3000
),
(
    'Pop: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    50
),
(
    'Pop: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    100
),
(
    'Pop: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    150
),
(
    'Pop: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    200
),
(
    'Pop: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    250
),
(
    'Pop: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    300
),
(
    'Pop: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    350
),
(
    'Pop: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    400
),
(
    'Pop: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    450
),
(
    'Pop: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    500
),
(
    'Pop: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    600
),
(
    'Pop: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    700
),
(
    'Pop: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    800
),
(
    'Pop: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    900
),
(
    'Pop: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de pop no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_pop',
    1000
),
(
    'Pop: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    3
),
(
    'Pop: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    5
),
(
    'Pop: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    10
),
(
    'Pop: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    12
),
(
    'Pop: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    15
),
(
    'Pop: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    17
),
(
    'Pop: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    20
),
(
    'Pop: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    25
),
(
    'Pop: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    30
),
(
    'Pop: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    35
),
(
    'Pop: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    40
),
(
    'Pop: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    45
),
(
    'Pop: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    50
),
(
    'Pop: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    60
),
(
    'Pop: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    70
),
(
    'Pop: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    80
),
(
    'Pop: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    90
),
(
    'Pop: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de pop no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_pop',
    100
),
-- Country,
(
    'Country: Plays - 100',
    'O Tunify registrou 100 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    100
),
(
    'Country: Plays - 250',
    'O Tunify registrou 250 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    250
),
(
    'Country: Plays - 500',
    'O Tunify registrou 500 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    500
),
(
    'Country: Plays - 750',
    'O Tunify registrou 750 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    750
),
(
    'Country: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    1000
),
(
    'Country: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    1500
),
(
    'Country: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    2000
),
(
    'Country: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    2500
),
(
    'Country: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de country no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_country',
    3000
),
(
    'Country: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    50
),
(
    'Country: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    100
),
(
    'Country: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    150
),
(
    'Country: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    200
),
(
    'Country: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    250
),
(
    'Country: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    300
),
(
    'Country: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    350
),
(
    'Country: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    400
),
(
    'Country: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    450
),
(
    'Country: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    500
),
(
    'Country: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    600
),
(
    'Country: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    700
),
(
    'Country: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    800
),
(
    'Country: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    900
),
(
    'Country: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de country no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_country',
    1000
),
(
    'Country: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    3
),
(
    'Country: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    5
),
(
    'Country: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    10
),
(
    'Country: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    12
),
(
    'Country: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    15
),
(
    'Country: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    17
),
(
    'Country: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    20
),
(
    'Country: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    25
),
(
    'Country: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    30
),
(
    'Country: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    35
),
(
    'Country: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    40
),
(
    'Country: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    45
),
(
    'Country: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    50
),
(
    'Country: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    60
),
(
    'Country: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    70
),
(
    'Country: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    80
),
(
    'Country: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    90
),
(
    'Country: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de country no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_country',
    100
),
-- EDM / Eletrônica,
(
    'EDM / Eletrônica: Plays - 100',
    'O Tunify registrou 100 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    100
),
(
    'EDM / Eletrônica: Plays - 250',
    'O Tunify registrou 250 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    250
),
(
    'EDM / Eletrônica: Plays - 500',
    'O Tunify registrou 500 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    500
),
(
    'EDM / Eletrônica: Plays - 750',
    'O Tunify registrou 750 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    750
),
(
    'EDM / Eletrônica: Plays - 1.000',
    'O Tunify registrou 1.000 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    1000
),
(
    'EDM / Eletrônica: Plays - 1.500',
    'O Tunify registrou 1.500 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    1500
),
(
    'EDM / Eletrônica: Plays - 2.000',
    'O Tunify registrou 2.000 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    2000
),
(
    'EDM / Eletrônica: Plays - 2.500',
    'O Tunify registrou 2.500 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    2500
),
(
    'EDM / Eletrônica: Plays - 3.000',
    'O Tunify registrou 3.000 reproduções de edm / eletrônica no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_edm',
    3000
),
(
    'EDM / Eletrônica: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    50
),
(
    'EDM / Eletrônica: Músicas - 100',
    'O Tunify registrou 100 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    100
),
(
    'EDM / Eletrônica: Músicas - 150',
    'O Tunify registrou 150 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    150
),
(
    'EDM / Eletrônica: Músicas - 200',
    'O Tunify registrou 200 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    200
),
(
    'EDM / Eletrônica: Músicas - 250',
    'O Tunify registrou 250 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    250
),
(
    'EDM / Eletrônica: Músicas - 300',
    'O Tunify registrou 300 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    300
),
(
    'EDM / Eletrônica: Músicas - 350',
    'O Tunify registrou 350 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    350
),
(
    'EDM / Eletrônica: Músicas - 400',
    'O Tunify registrou 400 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    400
),
(
    'EDM / Eletrônica: Músicas - 450',
    'O Tunify registrou 450 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    450
),
(
    'EDM / Eletrônica: Músicas - 500',
    'O Tunify registrou 500 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    500
),
(
    'EDM / Eletrônica: Músicas - 600',
    'O Tunify registrou 600 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    600
),
(
    'EDM / Eletrônica: Músicas - 700',
    'O Tunify registrou 700 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    700
),
(
    'EDM / Eletrônica: Músicas - 800',
    'O Tunify registrou 800 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    800
),
(
    'EDM / Eletrônica: Músicas - 900',
    'O Tunify registrou 900 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    900
),
(
    'EDM / Eletrônica: Músicas - 1.000',
    'O Tunify registrou 1.000 músicas diferentes de edm / eletrônica no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_edm',
    1000
),
(
    'EDM / Eletrônica: Artistas - 3',
    'O Tunify registrou 3 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    3
),
(
    'EDM / Eletrônica: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    5
),
(
    'EDM / Eletrônica: Artistas - 10',
    'O Tunify registrou 10 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    10
),
(
    'EDM / Eletrônica: Artistas - 12',
    'O Tunify registrou 12 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    12
),
(
    'EDM / Eletrônica: Artistas - 15',
    'O Tunify registrou 15 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    15
),
(
    'EDM / Eletrônica: Artistas - 17',
    'O Tunify registrou 17 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    17
),
(
    'EDM / Eletrônica: Artistas - 20',
    'O Tunify registrou 20 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    20
),
(
    'EDM / Eletrônica: Artistas - 25',
    'O Tunify registrou 25 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    25
),
(
    'EDM / Eletrônica: Artistas - 30',
    'O Tunify registrou 30 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    30
),
(
    'EDM / Eletrônica: Artistas - 35',
    'O Tunify registrou 35 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    35
),
(
    'EDM / Eletrônica: Artistas - 40',
    'O Tunify registrou 40 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    40
),
(
    'EDM / Eletrônica: Artistas - 45',
    'O Tunify registrou 45 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    45
),
(
    'EDM / Eletrônica: Artistas - 50',
    'O Tunify registrou 50 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    50
),
(
    'EDM / Eletrônica: Artistas - 60',
    'O Tunify registrou 60 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    60
),
(
    'EDM / Eletrônica: Artistas - 70',
    'O Tunify registrou 70 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    70
),
(
    'EDM / Eletrônica: Artistas - 80',
    'O Tunify registrou 80 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    80
),
(
    'EDM / Eletrônica: Artistas - 90',
    'O Tunify registrou 90 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    90
),
(
    'EDM / Eletrônica: Artistas - 100',
    'O Tunify registrou 100 artistas diferentes de edm / eletrônica no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_edm',
    100
),
-- Frevo (Escala Compacta),
(
    'Frevo: Plays - 20',
    'O Tunify registrou 20 reproduções de frevo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_frevo',
    20
),
(
    'Frevo: Plays - 50',
    'O Tunify registrou 50 reproduções de frevo no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_frevo',
    50
),
(
    'Frevo: Músicas - 10',
    'O Tunify registrou 10 músicas diferentes de frevo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_frevo',
    10
),
(
    'Frevo: Músicas - 25',
    'O Tunify registrou 25 músicas diferentes de frevo no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_frevo',
    25
),
(
    'Frevo: Artistas - 5',
    'O Tunify registrou 5 artistas diferentes de frevo no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_frevo',
    5
),
-- Axé (Escala Compacta),
(
    'Axé: Plays - 50',
    'O Tunify registrou 50 reproduções de axé no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_axe',
    50
),
(
    'Axé: Plays - 150',
    'O Tunify registrou 150 reproduções de axé no seu histórico.',
    'permanent',
    'assets/selos/placeholder.svg',
    'genre_plays_axe',
    150
),
(
    'Axé: Músicas - 20',
    'O Tunify registrou 20 músicas diferentes de axé no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_axe',
    20
),
(
    'Axé: Músicas - 50',
    'O Tunify registrou 50 músicas diferentes de axé no seu perfil.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_tracks_axe',
    50
),
(
    'Axé: Artistas - 8',
    'O Tunify registrou 8 artistas diferentes de axé no seu histórico de escuta.',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genre_artists_axe',
    8
);