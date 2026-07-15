-- ==============================================================================
-- SEED DE SELOS MENSAIS (CATÁLOGO INICIAL) - TUNIFY
-- Este script insere os selos mensais (gerais e de ranking de artistas) no banco.
-- ==============================================================================

INSERT INTO selos_catalog (name, description, badge_type, icon_path, criteria_type, criteria_value) VALUES
-- ==============================================================================,
-- SELOS GERAIS MENSAIS,
-- ==============================================================================,
(
    'Fora do Radar - Nível 1',
    'Você começou a garimpar faixas menos conhecidas e alternativas este mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'low_popularity_tracks_ratio_month',
    15
),
(
    'Fora do Radar - Nível 2',
    'Sua playlist mensal reservou um espaço notável para faixas menos conhecidas e alternativas.',
    'monthly',
    'assets/selos/placeholder.svg',
    'low_popularity_tracks_ratio_month',
    30
),
(
    'Fora do Radar - Nível 3',
    'Metade do seu mês foi dominado por faixas menos conhecidas e tesouros escondidos.',
    'monthly',
    'assets/selos/placeholder.svg',
    'low_popularity_tracks_ratio_month',
    50
),
(
    'Fora do Radar - Nível 4',
    'Seu gosto musical este mês foi quase inteiramente alternativo, focado em faixas fora do radar comercial.',
    'monthly',
    'assets/selos/placeholder.svg',
    'low_popularity_tracks_ratio_month',
    70
),
(
    'Viciado em Hits - Nível 1',
    'Você acompanhou algumas das paradas de sucesso mais ouvidas do momento.',
    'monthly',
    'assets/selos/placeholder.svg',
    'high_popularity_tracks_ratio_month',
    40
),
(
    'Viciado em Hits - Nível 2',
    'As faixas mais quentes e populares dominaram boa parte do seu histórico este mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'high_popularity_tracks_ratio_month',
    60
),
(
    'Viciado em Hits - Nível 3',
    'Seu mês foi dominado quase por completo pelas paradas de sucesso e hits globais.',
    'monthly',
    'assets/selos/placeholder.svg',
    'high_popularity_tracks_ratio_month',
    80
),
(
    'Viciado em Hits - Nível 4',
    'Obsessão pelo topo! Quase todas as faixas que você ouviu no mês estão no topo absoluto das paradas.',
    'monthly',
    'assets/selos/placeholder.svg',
    'high_popularity_tracks_ratio_month',
    95
),

-- ==============================================================================,
-- SELOS MENSAIS DE RANKING DE ARTISTAS,
-- ==============================================================================,

-- Bruno Mars,
(
    'Ouvinte Número 1: Bruno Mars',
    'Você foi o ouvinte número 1 de Bruno Mars no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_bruno_mars',
    1
),
(
    'Top Fan: Bruno Mars',
    'Você ficou no Top 1% de ouvintes de Bruno Mars no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_bruno_mars',
    1
),

-- Justin Bieber,
(
    'Ouvinte Número 1: Justin Bieber',
    'Você foi o ouvinte número 1 de Justin Bieber no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_justin_bieber',
    1
),
(
    'Top Fan: Justin Bieber',
    'Você ficou no Top 1% de ouvintes de Justin Bieber no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_justin_bieber',
    1
),

-- The Weeknd,
(
    'Ouvinte Número 1: The Weeknd',
    'Você foi o ouvinte número 1 de The Weeknd no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_the_weeknd',
    1
),
(
    'Top Fan: The Weeknd',
    'Você ficou no Top 1% de ouvintes de The Weeknd no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_the_weeknd',
    1
),

-- Michael Jackson,
(
    'Ouvinte Número 1: Michael Jackson',
    'Você foi o ouvinte número 1 de Michael Jackson no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_michael_jackson',
    1
),
(
    'Top Fan: Michael Jackson',
    'Você ficou no Top 1% de ouvintes de Michael Jackson no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_michael_jackson',
    1
),

-- Rihanna,
(
    'Ouvinte Número 1: Rihanna',
    'Você foi o ouvinte número 1 de Rihanna no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_rihanna',
    1
),
(
    'Top Fan: Rihanna',
    'Você ficou no Top 1% de ouvintes de Rihanna no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_rihanna',
    1
),

-- Taylor Swift,
(
    'Ouvinte Número 1: Taylor Swift',
    'Você foi o ouvinte número 1 de Taylor Swift no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_taylor_swift',
    1
),
(
    'Top Fan: Taylor Swift',
    'Você ficou no Top 1% de ouvintes de Taylor Swift no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_taylor_swift',
    1
),

-- Lady Gaga,
(
    'Ouvinte Número 1: Lady Gaga',
    'Você foi o ouvinte número 1 de Lady Gaga no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_lady_gaga',
    1
),
(
    'Top Fan: Lady Gaga',
    'Você ficou no Top 1% de ouvintes de Lady Gaga no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_lady_gaga',
    1
),

-- Bad Bunny,
(
    'Ouvinte Número 1: Bad Bunny',
    'Você foi o ouvinte número 1 de Bad Bunny no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_bad_bunny',
    1
),
(
    'Top Fan: Bad Bunny',
    'Você ficou no Top 1% de ouvintes de Bad Bunny no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_bad_bunny',
    1
),

-- Drake,
(
    'Ouvinte Número 1: Drake',
    'Você foi o ouvinte número 1 de Drake no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_drake',
    1
),
(
    'Top Fan: Drake',
    'Você ficou no Top 1% de ouvintes de Drake no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_drake',
    1
),

-- Ariana Grande,
(
    'Ouvinte Número 1: Ariana Grande',
    'Você foi o ouvinte número 1 de Ariana Grande no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_ariana_grande',
    1
),
(
    'Top Fan: Ariana Grande',
    'Você ficou no Top 1% de ouvintes de Ariana Grande no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_ariana_grande',
    1
),

-- Coldplay,
(
    'Ouvinte Número 1: Coldplay',
    'Você foi o ouvinte número 1 de Coldplay no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_coldplay',
    1
),
(
    'Top Fan: Coldplay',
    'Você ficou no Top 1% de ouvintes de Coldplay no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_coldplay',
    1
),

-- Pitbull,
(
    'Ouvinte Número 1: Pitbull',
    'Você foi o ouvinte número 1 de Pitbull no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_pitbull',
    1
),
(
    'Top Fan: Pitbull',
    'Você ficou no Top 1% de ouvintes de Pitbull no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_pitbull',
    1
),

-- David Guetta,
(
    'Ouvinte Número 1: David Guetta',
    'Você foi o ouvinte número 1 de David Guetta no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_david_guetta',
    1
),
(
    'Top Fan: David Guetta',
    'Você ficou no Top 1% de ouvintes de David Guetta no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_david_guetta',
    1
),

-- Calvin Harris,
(
    'Ouvinte Número 1: Calvin Harris',
    'Você foi o ouvinte número 1 de Calvin Harris no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_calvin_harris',
    1
),
(
    'Top Fan: Calvin Harris',
    'Você ficou no Top 1% de ouvintes de Calvin Harris no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_calvin_harris',
    1
),

-- Billie Eilish,
(
    'Ouvinte Número 1: Billie Eilish',
    'Você foi o ouvinte número 1 de Billie Eilish no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_billie_eilish',
    1
),
(
    'Top Fan: Billie Eilish',
    'Você ficou no Top 1% de ouvintes de Billie Eilish no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_billie_eilish',
    1
),

-- Maroon 5,
(
    'Ouvinte Número 1: Maroon 5',
    'Você foi o ouvinte número 1 de Maroon 5 no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_maroon_5',
    1
),
(
    'Top Fan: Maroon 5',
    'Você ficou no Top 1% de ouvintes de Maroon 5 no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_maroon_5',
    1
),

-- J Balvin,
(
    'Ouvinte Número 1: J Balvin',
    'Você foi o ouvinte número 1 de J Balvin no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_j_balvin',
    1
),
(
    'Top Fan: J Balvin',
    'Você ficou no Top 1% de ouvintes de J Balvin no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_j_balvin',
    1
),

-- Kanye West,
(
    'Ouvinte Número 1: Kanye West',
    'Você foi o ouvinte número 1 de Kanye West no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_kanye_west',
    1
),
(
    'Top Fan: Kanye West',
    'Você ficou no Top 1% de ouvintes de Kanye West no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_kanye_west',
    1
),

-- Kendrick Lamar,
(
    'Ouvinte Número 1: Kendrick Lamar',
    'Você foi o ouvinte número 1 de Kendrick Lamar no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_kendrick_lamar',
    1
),
(
    'Top Fan: Kendrick Lamar',
    'Você ficou no Top 1% de ouvintes de Kendrick Lamar no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_kendrick_lamar',
    1
),

-- Dua Lipa,
(
    'Ouvinte Número 1: Dua Lipa',
    'Você foi o ouvinte número 1 de Dua Lipa no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_dua_lipa',
    1
),
(
    'Top Fan: Dua Lipa',
    'Você ficou no Top 1% de ouvintes de Dua Lipa no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_dua_lipa',
    1
),

-- Sia,
(
    'Ouvinte Número 1: Sia',
    'Você foi o ouvinte número 1 de Sia no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sia',
    1
),
(
    'Top Fan: Sia',
    'Você ficou no Top 1% de ouvintes de Sia no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sia',
    1
),

-- Black Eyed Peas,
(
    'Ouvinte Número 1: Black Eyed Peas',
    'Você foi o ouvinte número 1 de Black Eyed Peas no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_black_eyed_peas',
    1
),
(
    'Top Fan: Black Eyed Peas',
    'Você ficou no Top 1% de ouvintes de Black Eyed Peas no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_black_eyed_peas',
    1
),

-- SZA,
(
    'Ouvinte Número 1: SZA',
    'Você foi o ouvinte número 1 de SZA no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sza',
    1
),
(
    'Top Fan: SZA',
    'Você ficou no Top 1% de ouvintes de SZA no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sza',
    1
),

-- Harry Styles,
(
    'Ouvinte Número 1: Harry Styles',
    'Você foi o ouvinte número 1 de Harry Styles no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_harry_styles',
    1
),
(
    'Top Fan: Harry Styles',
    'Você ficou no Top 1% de ouvintes de Harry Styles no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_harry_styles',
    1
),

-- Daddy Yankee,
(
    'Ouvinte Número 1: Daddy Yankee',
    'Você foi o ouvinte número 1 de Daddy Yankee no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_daddy_yankee',
    1
),
(
    'Top Fan: Daddy Yankee',
    'Você ficou no Top 1% de ouvintes de Daddy Yankee no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_daddy_yankee',
    1
),

-- Zara Larsson,
(
    'Ouvinte Número 1: Zara Larsson',
    'Você foi o ouvinte número 1 de Zara Larsson no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_zara_larsson',
    1
),
(
    'Top Fan: Zara Larsson',
    'Você ficou no Top 1% de ouvintes de Zara Larsson no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_zara_larsson',
    1
),

-- Lana Del Rey,
(
    'Ouvinte Número 1: Lana Del Rey',
    'Você foi o ouvinte número 1 de Lana Del Rey no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_lana_del_rey',
    1
),
(
    'Top Fan: Lana Del Rey',
    'Você ficou no Top 1% de ouvintes de Lana Del Rey no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_lana_del_rey',
    1
),

-- Sabrina Carpenter,
(
    'Ouvinte Número 1: Sabrina Carpenter',
    'Você foi o ouvinte número 1 de Sabrina Carpenter no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sabrina_carpenter',
    1
),
(
    'Top Fan: Sabrina Carpenter',
    'Você ficou no Top 1% de ouvintes de Sabrina Carpenter no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sabrina_carpenter',
    1
),

-- Sean Paul,
(
    'Ouvinte Número 1: Sean Paul',
    'Você foi o ouvinte número 1 de Sean Paul no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sean_paul',
    1
),
(
    'Top Fan: Sean Paul',
    'Você ficou no Top 1% de ouvintes de Sean Paul no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sean_paul',
    1
),

-- Beyoncé,
(
    'Ouvinte Número 1: Beyoncé',
    'Você foi o ouvinte número 1 de Beyoncé no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_beyonce',
    1
),
(
    'Top Fan: Beyoncé',
    'Você ficou no Top 1% de ouvintes de Beyoncé no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_beyonce',
    1
),

-- Dominic Fike,
(
    'Ouvinte Número 1: Dominic Fike',
    'Você foi o ouvinte número 1 de Dominic Fike no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_dominic_fike',
    1
),
(
    'Top Fan: Dominic Fike',
    'Você ficou no Top 1% de ouvintes de Dominic Fike no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_dominic_fike',
    1
),

-- Miley Cyrus,
(
    'Ouvinte Número 1: Miley Cyrus',
    'Você foi o ouvinte número 1 de Miley Cyrus no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_miley_cyrus',
    1
),
(
    'Top Fan: Miley Cyrus',
    'Você ficou no Top 1% de ouvintes de Miley Cyrus no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_miley_cyrus',
    1
),

-- Adele,
(
    'Ouvinte Número 1: Adele',
    'Você foi o ouvinte número 1 de Adele no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_adele',
    1
),
(
    'Top Fan: Adele',
    'Você ficou no Top 1% de ouvintes de Adele no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_adele',
    1
),

-- Justin Timberlake,
(
    'Ouvinte Número 1: Justin Timberlake',
    'Você foi o ouvinte número 1 de Justin Timberlake no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_justin_timberlake',
    1
),
(
    'Top Fan: Justin Timberlake',
    'Você ficou no Top 1% de ouvintes de Justin Timberlake no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_justin_timberlake',
    1
),

-- Linkin Park,
(
    'Ouvinte Número 1: Linkin Park',
    'Você foi o ouvinte número 1 de Linkin Park no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_linkin_park',
    1
),
(
    'Top Fan: Linkin Park',
    'Você ficou no Top 1% de ouvintes de Linkin Park no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_linkin_park',
    1
),

-- Doja Cat,
(
    'Ouvinte Número 1: Doja Cat',
    'Você foi o ouvinte número 1 de Doja Cat no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_doja_cat',
    1
),
(
    'Top Fan: Doja Cat',
    'Você ficou no Top 1% de ouvintes de Doja Cat no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_doja_cat',
    1
),

-- sombr,
(
    'Ouvinte Número 1: sombr',
    'Você foi o ouvinte número 1 de sombr no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sombr',
    1
),
(
    'Top Fan: sombr',
    'Você ficou no Top 1% de ouvintes de sombr no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sombr',
    1
),

-- Future,
(
    'Ouvinte Número 1: Future',
    'Você foi o ouvinte número 1 de Future no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_future',
    1
),
(
    'Top Fan: Future',
    'Você ficou no Top 1% de ouvintes de Future no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_future',
    1
),

-- Arijit Singh,
(
    'Ouvinte Número 1: Arijit Singh',
    'Você foi o ouvinte número 1 de Arijit Singh no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_arijit_singh',
    1
),
(
    'Top Fan: Arijit Singh',
    'Você ficou no Top 1% de ouvintes de Arijit Singh no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_arijit_singh',
    1
),

-- Arctic Monkeys,
(
    'Ouvinte Número 1: Arctic Monkeys',
    'Você foi o ouvinte número 1 de Arctic Monkeys no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_arctic_monkeys',
    1
),
(
    'Top Fan: Arctic Monkeys',
    'Você ficou no Top 1% de ouvintes de Arctic Monkeys no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_arctic_monkeys',
    1
),

-- Khalid,
(
    'Ouvinte Número 1: Khalid',
    'Você foi o ouvinte número 1 de Khalid no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_khalid',
    1
),
(
    'Top Fan: Khalid',
    'Você ficou no Top 1% de ouvintes de Khalid no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_khalid',
    1
),

-- Jennifer Lopez,
(
    'Ouvinte Número 1: Jennifer Lopez',
    'Você foi o ouvinte número 1 de Jennifer Lopez no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_jennifer_lopez',
    1
),
(
    'Top Fan: Jennifer Lopez',
    'Você ficou no Top 1% de ouvintes de Jennifer Lopez no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_jennifer_lopez',
    1
),

-- Madonna,
(
    'Ouvinte Número 1: Madonna',
    'Você foi o ouvinte número 1 de Madonna no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_madonna',
    1
),
(
    'Top Fan: Madonna',
    'Você ficou no Top 1% de ouvintes de Madonna no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_madonna',
    1
),

-- Olivia Dean,
(
    'Ouvinte Número 1: Olivia Dean',
    'Você foi o ouvinte número 1 de Olivia Dean no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_olivia_dean',
    1
),
(
    'Top Fan: Olivia Dean',
    'Você ficou no Top 1% de ouvintes de Olivia Dean no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_olivia_dean',
    1
),

-- Elton John,
(
    'Ouvinte Número 1: Elton John',
    'Você foi o ouvinte número 1 de Elton John no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_elton_john',
    1
),
(
    'Top Fan: Elton John',
    'Você ficou no Top 1% de ouvintes de Elton John no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_elton_john',
    1
),

-- Imagine Dragons,
(
    'Ouvinte Número 1: Imagine Dragons',
    'Você foi o ouvinte número 1 de Imagine Dragons no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_imagine_dragons',
    1
),
(
    'Top Fan: Imagine Dragons',
    'Você ficou no Top 1% de ouvintes de Imagine Dragons no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_imagine_dragons',
    1
),

-- Queen,
(
    'Ouvinte Número 1: Queen',
    'Você foi o ouvinte número 1 de Queen no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_queen',
    1
),
(
    'Top Fan: Queen',
    'Você ficou no Top 1% de ouvintes de Queen no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_queen',
    1
),

-- Rauw Alejandro,
(
    'Ouvinte Número 1: Rauw Alejandro',
    'Você foi o ouvinte número 1 de Rauw Alejandro no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_rauw_alejandro',
    1
),
(
    'Top Fan: Rauw Alejandro',
    'Você ficou no Top 1% de ouvintes de Rauw Alejandro no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_rauw_alejandro',
    1
),

-- Sam Smith,
(
    'Ouvinte Número 1: Sam Smith',
    'Você foi o ouvinte número 1 de Sam Smith no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_sam_smith',
    1
),
(
    'Top Fan: Sam Smith',
    'Você ficou no Top 1% de ouvintes de Sam Smith no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_sam_smith',
    1
),

-- Karol G,
(
    'Ouvinte Número 1: Karol G',
    'Você foi o ouvinte número 1 de Karol G no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_karol_g',
    1
),
(
    'Top Fan: Karol G',
    'Você ficou no Top 1% de ouvintes de Karol G no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_karol_g',
    1
),

-- Marshmello,
(
    'Ouvinte Número 1: Marshmello',
    'Você foi o ouvinte número 1 de Marshmello no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_marshmello',
    1
),
(
    'Top Fan: Marshmello',
    'Você ficou no Top 1% de ouvintes de Marshmello no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_marshmello',
    1
),

-- JENNIE,
(
    'Ouvinte Número 1: JENNIE',
    'Você foi o ouvinte número 1 de JENNIE no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_jennie',
    1
),
(
    'Top Fan: JENNIE',
    'Você ficou no Top 1% de ouvintes de JENNIE no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_jennie',
    1
),

-- Shawn Mendes,
(
    'Ouvinte Número 1: Shawn Mendes',
    'Você foi o ouvinte número 1 de Shawn Mendes no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_shawn_mendes',
    1
),
(
    'Top Fan: Shawn Mendes',
    'Você ficou no Top 1% de ouvintes de Shawn Mendes no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_shawn_mendes',
    1
),

-- Fleetwood Mac,
(
    'Ouvinte Número 1: Fleetwood Mac',
    'Você foi o ouvinte número 1 de Fleetwood Mac no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_fleetwood_mac',
    1
),
(
    'Top Fan: Fleetwood Mac',
    'Você ficou no Top 1% de ouvintes de Fleetwood Mac no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_fleetwood_mac',
    1
),

-- Ozuna,
(
    'Ouvinte Número 1: Ozuna',
    'Você foi o ouvinte número 1 de Ozuna no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_ozuna',
    1
),
(
    'Top Fan: Ozuna',
    'Você ficou no Top 1% de ouvintes de Ozuna no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_ozuna',
    1
),

-- Shreya Ghoshal,
(
    'Ouvinte Número 1: Shreya Ghoshal',
    'Você foi o ouvinte número 1 de Shreya Ghoshal no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_shreya_ghoshal',
    1
),
(
    'Top Fan: Shreya Ghoshal',
    'Você ficou no Top 1% de ouvintes de Shreya Ghoshal no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_shreya_ghoshal',
    1
),

-- Halsey,
(
    'Ouvinte Número 1: Halsey',
    'Você foi o ouvinte número 1 de Halsey no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_halsey',
    1
),
(
    'Top Fan: Halsey',
    'Você ficou no Top 1% de ouvintes de Halsey no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_halsey',
    1
),

-- The Chainsmokers,
(
    'Ouvinte Número 1: The Chainsmokers',
    'Você foi o ouvinte número 1 de The Chainsmokers no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_the_chainsmokers',
    1
),
(
    'Top Fan: The Chainsmokers',
    'Você ficou no Top 1% de ouvintes de The Chainsmokers no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_the_chainsmokers',
    1
),

-- Ellie Goulding,
(
    'Ouvinte Número 1: Ellie Goulding',
    'Você foi o ouvinte número 1 de Ellie Goulding no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_ellie_goulding',
    1
),
(
    'Top Fan: Ellie Goulding',
    'Você ficou no Top 1% de ouvintes de Ellie Goulding no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_ellie_goulding',
    1
),

-- Ne-Yo,
(
    'Ouvinte Número 1: Ne-Yo',
    'Você foi o ouvinte número 1 de Ne-Yo no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_ne_yo',
    1
),
(
    'Top Fan: Ne-Yo',
    'Você ficou no Top 1% de ouvintes de Ne-Yo no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_ne_yo',
    1
),

-- DJ Snake,
(
    'Ouvinte Número 1: DJ Snake',
    'Você foi o ouvinte número 1 de DJ Snake no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_dj_snake',
    1
),
(
    'Top Fan: DJ Snake',
    'Você ficou no Top 1% de ouvintes de DJ Snake no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_dj_snake',
    1
),

-- OneRepublic,
(
    'Ouvinte Número 1: OneRepublic',
    'Você foi o ouvinte número 1 de OneRepublic no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_onerepublic',
    1
),
(
    'Top Fan: OneRepublic',
    'Você ficou no Top 1% de ouvintes de OneRepublic no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_onerepublic',
    1
),

-- Pritam,
(
    'Ouvinte Número 1: Pritam',
    'Você foi o ouvinte número 1 de Pritam no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_pritam',
    1
),
(
    'Top Fan: Pritam',
    'Você ficou no Top 1% de ouvintes de Pritam no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_pritam',
    1
),

-- Don Omar,
(
    'Ouvinte Número 1: Don Omar',
    'Você foi o ouvinte número 1 de Don Omar no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_don_omar',
    1
),
(
    'Top Fan: Don Omar',
    'Você ficou no Top 1% de ouvintes de Don Omar no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_don_omar',
    1
),

-- Maluma,
(
    'Ouvinte Número 1: Maluma',
    'Você foi o ouvinte número 1 de Maluma no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_maluma',
    1
),
(
    'Top Fan: Maluma',
    'Você ficou no Top 1% de ouvintes de Maluma no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_maluma',
    1
),

-- Charlie Puth,
(
    'Ouvinte Número 1: Charlie Puth',
    'Você foi o ouvinte número 1 de Charlie Puth no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_charlie_puth',
    1
),
(
    'Top Fan: Charlie Puth',
    'Você ficou no Top 1% de ouvintes de Charlie Puth no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_charlie_puth',
    1
),

-- Britney Spears,
(
    'Ouvinte Número 1: Britney Spears',
    'Você foi o ouvinte número 1 de Britney Spears no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_britney_spears',
    1
),
(
    'Top Fan: Britney Spears',
    'Você ficou no Top 1% de ouvintes de Britney Spears no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_britney_spears',
    1
),

-- A.R. Rahman,
(
    'Ouvinte Número 1: A.R. Rahman',
    'Você foi o ouvinte número 1 de A.R. Rahman no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_ar_rahman',
    1
),
(
    'Top Fan: A.R. Rahman',
    'Você ficou no Top 1% de ouvintes de A.R. Rahman no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_ar_rahman',
    1
),

-- Fuerza Regida,
(
    'Ouvinte Número 1: Fuerza Regida',
    'Você foi o ouvinte número 1 de Fuerza Regida no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_fuerza_regida',
    1
),
(
    'Top Fan: Fuerza Regida',
    'Você ficou no Top 1% de ouvintes de Fuerza Regida no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_fuerza_regida',
    1
),

-- Nicki Minaj,
(
    'Ouvinte Número 1: Nicki Minaj',
    'Você foi o ouvinte número 1 de Nicki Minaj no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_nicki_minaj',
    1
),
(
    'Top Fan: Nicki Minaj',
    'Você ficou no Top 1% de ouvintes de Nicki Minaj no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_nicki_minaj',
    1
),

-- Usher,
(
    'Ouvinte Número 1: Usher',
    'Você foi o ouvinte número 1 de Usher no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_usher',
    1
),
(
    'Top Fan: Usher',
    'Você ficou no Top 1% de ouvintes de Usher no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_usher',
    1
),

-- One Direction,
(
    'Ouvinte Número 1: One Direction',
    'Você foi o ouvinte número 1 de One Direction no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_one_direction',
    1
),
(
    'Top Fan: One Direction',
    'Você ficou no Top 1% de ouvintes de One Direction no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_one_direction',
    1
),

-- RAYE,
(
    'Ouvinte Número 1: RAYE',
    'Você foi o ouvinte número 1 de RAYE no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_raye',
    1
),
(
    'Top Fan: RAYE',
    'Você ficou no Top 1% de ouvintes de RAYE no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_raye',
    1
),

-- Alex Warren,
(
    'Ouvinte Número 1: Alex Warren',
    'Você foi o ouvinte número 1 de Alex Warren no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_alex_warren',
    1
),
(
    'Top Fan: Alex Warren',
    'Você ficou no Top 1% de ouvintes de Alex Warren no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_alex_warren',
    1
),

-- Red Hot Chili Peppers,
(
    'Ouvinte Número 1: Red Hot Chili Peppers',
    'Você foi o ouvinte número 1 de Red Hot Chili Peppers no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_red_hot_chili_peppers',
    1
),
(
    'Top Fan: Red Hot Chili Peppers',
    'Você ficou no Top 1% de ouvintes de Red Hot Chili Peppers no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_red_hot_chili_peppers',
    1
),

-- Wiz Khalifa,
(
    'Ouvinte Número 1: Wiz Khalifa',
    'Você foi o ouvinte número 1 de Wiz Khalifa no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_wiz_khalifa',
    1
),
(
    'Top Fan: Wiz Khalifa',
    'Você ficou no Top 1% de ouvintes de Wiz Khalifa no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_wiz_khalifa',
    1
),

-- Peso Pluma,
(
    'Ouvinte Número 1: Peso Pluma',
    'Você foi o ouvinte número 1 de Peso Pluma no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_peso_pluma',
    1
),
(
    'Top Fan: Peso Pluma',
    'Você ficou no Top 1% de ouvintes de Peso Pluma no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_peso_pluma',
    1
),

-- The Neighbourhood,
(
    'Ouvinte Número 1: The Neighbourhood',
    'Você foi o ouvinte número 1 de The Neighbourhood no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_the_neighbourhood',
    1
),
(
    'Top Fan: The Neighbourhood',
    'Você ficou no Top 1% de ouvintes de The Neighbourhood no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_the_neighbourhood',
    1
),

-- Kesha,
(
    'Ouvinte Número 1: Kesha',
    'Você foi o ouvinte número 1 de Kesha no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_kesha',
    1
),
(
    'Top Fan: Kesha',
    'Você ficou no Top 1% de ouvintes de Kesha no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_kesha',
    1
),

-- Jay-Z,
(
    'Ouvinte Número 1: Jay-Z',
    'Você foi o ouvinte número 1 de Jay-Z no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_jay_z',
    1
),
(
    'Top Fan: Jay-Z',
    'Você ficou no Top 1% de ouvintes de Jay-Z no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_jay_z',
    1
),

-- Lil Wayne,
(
    'Ouvinte Número 1: Lil Wayne',
    'Você foi o ouvinte número 1 de Lil Wayne no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_lil_wayne',
    1
),
(
    'Top Fan: Lil Wayne',
    'Você ficou no Top 1% de ouvintes de Lil Wayne no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_lil_wayne',
    1
),

-- Diplo,
(
    'Ouvinte Número 1: Diplo',
    'Você foi o ouvinte número 1 de Diplo no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_diplo',
    1
),
(
    'Top Fan: Diplo',
    'Você ficou no Top 1% de ouvintes de Diplo no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_diplo',
    1
),

-- Farruko,
(
    'Ouvinte Número 1: Farruko',
    'Você foi o ouvinte número 1 de Farruko no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_farruko',
    1
),
(
    'Top Fan: Farruko',
    'Você ficou no Top 1% de ouvintes de Farruko no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_farruko',
    1
),

-- Radiohead,
(
    'Ouvinte Número 1: Radiohead',
    'Você foi o ouvinte número 1 de Radiohead no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_radiohead',
    1
),
(
    'Top Fan: Radiohead',
    'Você ficou no Top 1% de ouvintes de Radiohead no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_radiohead',
    1
),

-- Flo Rida,
(
    'Ouvinte Número 1: Flo Rida',
    'Você foi o ouvinte número 1 de Flo Rida no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_flo_rida',
    1
),
(
    'Top Fan: Flo Rida',
    'Você ficou no Top 1% de ouvintes de Flo Rida no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_flo_rida',
    1
),

-- Don Toliver,
(
    'Ouvinte Número 1: Don Toliver',
    'Você foi o ouvinte número 1 de Don Toliver no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_don_toliver',
    1
),
(
    'Top Fan: Don Toliver',
    'Você ficou no Top 1% de ouvintes de Don Toliver no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_don_toliver',
    1
),

-- Anuel AA,
(
    'Ouvinte Número 1: Anuel AA',
    'Você foi o ouvinte número 1 de Anuel AA no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_anuel_aa',
    1
),
(
    'Top Fan: Anuel AA',
    'Você ficou no Top 1% de ouvintes de Anuel AA no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_anuel_aa',
    1
),

-- 50 Cent,
(
    'Ouvinte Número 1: 50 Cent',
    'Você foi o ouvinte número 1 de 50 Cent no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_50_cent',
    1
),
(
    'Top Fan: 50 Cent',
    'Você ficou no Top 1% de ouvintes de 50 Cent no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_50_cent',
    1
),

-- Tate McRae,
(
    'Ouvinte Número 1: Tate McRae',
    'Você foi o ouvinte número 1 de Tate McRae no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_tate_mcrae',
    1
),
(
    'Top Fan: Tate McRae',
    'Você ficou no Top 1% de ouvintes de Tate McRae no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_tate_mcrae',
    1
),

-- Bebe Rexha,
(
    'Ouvinte Número 1: Bebe Rexha',
    'Você foi o ouvinte número 1 de Bebe Rexha no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_bebe_rexha',
    1
),
(
    'Top Fan: Bebe Rexha',
    'Você ficou no Top 1% de ouvintes de Bebe Rexha no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_bebe_rexha',
    1
),

-- 21 Savage,
(
    'Ouvinte Número 1: 21 Savage',
    'Você foi o ouvinte número 1 de 21 Savage no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_21_savage',
    1
),
(
    'Top Fan: 21 Savage',
    'Você ficou no Top 1% de ouvintes de 21 Savage no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_21_savage',
    1
),

-- Selena Gomez,
(
    'Ouvinte Número 1: Selena Gomez',
    'Você foi o ouvinte número 1 de Selena Gomez no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_selena_gomez',
    1
),
(
    'Top Fan: Selena Gomez',
    'Você ficou no Top 1% de ouvintes de Selena Gomez no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_selena_gomez',
    1
),

-- Burna Boy,
(
    'Ouvinte Número 1: Burna Boy',
    'Você foi o ouvinte número 1 de Burna Boy no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_burna_boy',
    1
),
(
    'Top Fan: Burna Boy',
    'Você ficou no Top 1% de ouvintes de Burna Boy no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_burna_boy',
    1
),

-- ABBA,
(
    'Ouvinte Número 1: ABBA',
    'Você foi o ouvinte número 1 de ABBA no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_abba',
    1
),
(
    'Top Fan: ABBA',
    'Você ficou no Top 1% de ouvintes de ABBA no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_abba',
    1
),

-- Green Day,
(
    'Ouvinte Número 1: Green Day',
    'Você foi o ouvinte número 1 de Green Day no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_green_day',
    1
),
(
    'Top Fan: Green Day',
    'Você ficou no Top 1% de ouvintes de Green Day no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_green_day',
    1
),

-- Myke Towers,
(
    'Ouvinte Número 1: Myke Towers',
    'Você foi o ouvinte número 1 de Myke Towers no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_myke_towers',
    1
),
(
    'Top Fan: Myke Towers',
    'Você ficou no Top 1% de ouvintes de Myke Towers no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_myke_towers',
    1
),

-- Empire of the Sun,
(
    'Ouvinte Número 1: Empire of the Sun',
    'Você foi o ouvinte número 1 de Empire of the Sun no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_empire_of_the_sun',
    1
),
(
    'Top Fan: Empire of the Sun',
    'Você ficou no Top 1% de ouvintes de Empire of the Sun no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_empire_of_the_sun',
    1
),

-- Teddy Swims,
(
    'Ouvinte Número 1: Teddy Swims',
    'Você foi o ouvinte número 1 de Teddy Swims no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_teddy_swims',
    1
),
(
    'Top Fan: Teddy Swims',
    'Você ficou no Top 1% de ouvintes de Teddy Swims no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_teddy_swims',
    1
),

-- Hozier,
(
    'Ouvinte Número 1: Hozier',
    'Você foi o ouvinte número 1 de Hozier no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_hozier',
    1
),
(
    'Top Fan: Hozier',
    'Você ficou no Top 1% de ouvintes de Hozier no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_hozier',
    1
),

-- Daniel Caesar,
(
    'Ouvinte Número 1: Daniel Caesar',
    'Você foi o ouvinte número 1 de Daniel Caesar no Tunify este mês! Um feito histórico.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_listener_month_daniel_caesar',
    1
),
(
    'Top Fan: Daniel Caesar',
    'Você ficou no Top 1% de ouvintes de Daniel Caesar no Tunify durante o mês.',
    'monthly',
    'assets/selos/placeholder.svg',
    'artist_top_fan_percentile_month_daniel_caesar',
    1
);
