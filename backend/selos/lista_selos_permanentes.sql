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
    'Você ouviu 5 artistas diferentes. A diversidade sonora começou!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    5
),
(
    'Roda de Conversa',
    '10 artistas diferentes tocados. Seu gosto musical está se espalhando!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    10
),
(
    'Mini Festival',
    'Você escutou 20 artistas diferentes. Um line-up modesto, mas de muita qualidade!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    20
),
(
    'Explorador de Palcos',
    '30 artistas no seu histórico. Você adora dar uma chance a novas vozes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    30
),
(
    'Descobridor de Talentos',
    '50 artistas diferentes ouvidos. Sua busca por novas frequências é insaciável!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    50
),
(
    'Gosto Ampliado',
    '75 artistas diferentes escutados. Sua mente musical está aberta a novas ideias!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    75
),
(
    'Festival de Grande Porte',
    '100 artistas diferentes tocados no seu Tunify. Uma verdadeira multidão de talentos!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    100
),
(
    'Colecionador de Autógrafos',
    '150 artistas diferentes no seu histórico de escuta acumulada!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    150
),
(
    'Caçador de Raridades',
    '200 artistas diferentes ouvidos. Você garimpa novas bandas como ninguém!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    200
),
(
    'Radar de Novidades',
    '300 artistas diferentes escutados. Você está sempre à frente do seu tempo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    300
),
(
    'Mestrado em Biografias',
    'Você ouviu 400 artistas diferentes. Quase um historiador da música moderna!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    400
),
(
    'Diretor de Gravadora',
    '500 artistas diferentes tocados no Tunify. O mercado da música precisa das suas análises!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_artists',
    500
),

-- ==============================================================================
-- CATEGORIA 4: GÊNEROS DIFERENTES EXPLORADOS (criteria_type: 'distinct_genres')
-- ==============================================================================
(
    'Eclético Iniciante',
    'Você ouviu 3 gêneros diferentes. Dando os primeiros passos fora da zona de conforto!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    3
),
(
    'Crossover Sonoro',
    '5 gêneros musicais diferentes explorados. Uma mistura bem peculiar no seu player!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    5
),
(
    'Sem Fronteiras',
    '8 gêneros diferentes escutados. Você se recusa a se prender a rótulos limitantes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    8
),
(
    'Nômade Musical',
    'Do Pop ao Heavy Metal, do Jazz ao Funk. Seu ouvido viaja por 12 gêneros diferentes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    12
),
(
    'Cultura Pura',
    '15 gêneros musicais diferentes experimentados. Você aprecia a arte em todas as vertentes!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    15
),
(
    'Camaleão do Som',
    '20 gêneros diferentes no seu histórico. Seu gosto se adapta a qualquer ambiente e humor!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    20
),
(
    'Poliglota Musical',
    '25 gêneros diferentes! Você entende e respeita a linguagem de quase toda tribo sonora!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    25
),
(
    'Samba & Sertanejo',
    'Conquistado ao escutar as grandes paixões populares nacionais: Samba, Pagode e Sertanejo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    30
),
(
    'DNA Brasileiro',
    'Escutou Samba, MPB, Bossa Nova, Forró e Axé. O suor e a ginga do Brasil estão no seu som!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    35
),
(
    'Sommelier de Ritmos',
    '40 gêneros musicais diferentes explorados no Tunify. Você é um profundo estudioso da música!',
    'permanent',
    'assets/selos/placeholder.svg',
    'distinct_genres',
    40
),
(
    'Antropólogo Musical',
    '50 gêneros diferentes! Você mapeou todas as vertentes e expressões sonoras da nossa história.',
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
    'Você favoritou suas primeiras 5 músicas. O início do seu cofre de relíquias!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    5
),
(
    'Top 10 Pessoal',
    '10 músicas marcadas com o coração no Tunify. Apenas o filé mignon do seu gosto!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    10
),
(
    'Favoritas do Ano',
    '25 músicas curtidas. O seu resumo pessoal já tem uma base sólida para tocar!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    25
),
(
    'Cofre de Relíquias',
    '50 músicas favoritadas no Tunify. A sua pasta secreta de sucessos está crescendo!',
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
    '500 músicas favoritadas no Tunify. Uma playlist de reprodução contínua e apaixonada!',
    'permanent',
    'assets/selos/placeholder.svg',
    'songs_favorited',
    500
),
(
    'Colecionador Obsessivo',
    '1.000 músicas favoritadas no Tunify. Você ama música com todo o seu corpo e alma!',
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
    '250 músicas tocadas na madrugada do Tunify. O silêncio noturno é o seu maior inimigo.',
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
    'Trabalho em Sintonia',
    '500 músicas ouvidas durante o horário comercial. A trilha sonora oficial do seu foco e produção.',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    500
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
    'Energia Solar',
    '2.500 músicas ouvidas sob a luz do dia. A música é o seu principal combustível diário!',
    'permanent',
    'assets/selos/placeholder.svg',
    'day_plays',
    2500
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
    'Luz do Dia Vitalícia',
    '10.000 músicas ouvidas durante o dia. O sol é o refletor oficial do seu palco!',
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
    'Você ouviu música por 2 dias seguidos no Tunify. O hábito saudável está se formando!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    2
),
(
    'Três é Demais',
    '3 dias consecutivos de som active. A trilha sonora da sua vida não pode parar por nada!',
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
    'Você passou 7 dias seguidos com o Tunify ligado. Um ciclo semanal de som completo!',
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
    'Mensalidade Sonora',
    '30 dias consecutivos ouvindo música. O Tunify faz parte da sua rotina diária de cabo a rabo!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    30
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
    'Estação Musical',
    '90 dias seguidos de som! Uma estação do ano inteirinha regada a muita música no Tunify.',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    90
),
(
    'Semestre do Som',
    '180 dias consecutivos de música. Meio ano de fidelidade sonora absoluta com a plataforma!',
    'permanent',
    'assets/selos/placeholder.svg',
    'consecutive_days',
    180
),
(
    'Um Ano Sem Silêncio',
    '365 dias seguidos ouvindo música no Tunify! Você viveu um ano inteiro em perfeita harmonia.',
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
);
