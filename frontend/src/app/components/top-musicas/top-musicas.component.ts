import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs'; // 🚨 IMPORTADO para usar async/await

// 🚨 IMPORTANTE: Ajuste o caminho de acordo com onde você salvou o service!
import { SpotifyService } from '../../core/services/spotify.service';
import { PlayerService } from '../../core/services/player.service'; // 🚨 IMPORTADO PLAYER

interface Musica {
  posicao: number;
  titulo: string;
  artista: string;
  capa: string;
  reproducoes: number;
  tendencia: 'sobe' | 'desce' | 'nova' | 'estavel';
  valorTendencia?: number;
  uri: string; // 🚨 [NOVO] O RG da música no Spotify
}

@Component({
  selector: 'app-top-musicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-musicas.component.html',
  styleUrl: './top-musicas.component.scss'
})
export class TopMusicasComponent implements OnInit {
  mesAtual: string = '';
  ultimaAtualizacao: string = '';
  
  // Começamos com a lista vazia
  musicas: Musica[] = [];
  
  // Variável para mostrar um "Carregando..." no HTML se você quiser depois
  carregando: boolean = true; 

  // Variáveis para controlar o estado da UI de reprodução
  faixaTocandoUri: string | null = null;
  faixaPausada: boolean = false;

  // Variável para travar o botão e dar feedback visual enquanto carrega
  criandoPlaylist: boolean = false;

  // Injetamos os nossos carteiros
  private spotifyService = inject(SpotifyService);
  private playerService = inject(PlayerService); // 🚨 Injetado o motor do player

  ngOnInit() {
    this.mesAtual = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(new Date());
    this.calcularUltimaAtualizacao();
    
    // Chama a função que busca no Backend
    this.buscarDadosDoBackend();

    // 🚨 Escuta o Rádio do Player para saber quem está tocando em tempo real
    this.playerService.playerState$.subscribe(state => {
      if (state && state.track_window && state.track_window.current_track) {
         this.faixaTocandoUri = state.track_window.current_track.uri;
         this.faixaPausada = state.paused;
      } else {
         this.faixaTocandoUri = null;
      }
    });
  }

  // 🚨 [NOVO] Função disparada no HTML ao clicar na música
  tocarFaixa(index: number) {
    const uris = this.musicas.map(m => m.uri);
    
    // Se a música clicada já é a que está tocando, a gente apenas pausa ou despausa
    if (this.faixaTocandoUri === uris[index]) {
       this.playerService.togglePlay();
       return;
    }

    // Dispara a fila inteira pro player, começando do index clicado!
    this.playerService.tocarFila(uris, index);
  }

  buscarDadosDoBackend() {
    // 🚨 1. Pega o pacote inteiro do usuário que salvamos no login
    const userInfoString = localStorage.getItem('tunify_user_info'); 

    if (!userInfoString) {
      console.error('Nenhum usuário logado encontrado!');
      return;
    }

    // 🚨 2. Transforma o texto de volta em objeto e pega o email
    const usuario = JSON.parse(userInfoString);
    const emailLogado = usuario.email;

    if (!emailLogado) {
      console.error('O objeto do usuário não tem um e-mail!');
      return;
    }

    // Passa o e-mail para o carteiro!
    this.spotifyService.getTopMensal(emailLogado).subscribe({
      next: (resposta) => {
        // A MÁGICA DA TRADUÇÃO: Transformamos o JSON do backend na nossa Interface!
        this.musicas = resposta.dados.map((item: any) => ({
          posicao: item.rank,
          titulo: item.nome,
          artista: item.artista,
          capa: item.capa_url,
          reproducoes: item.total_plays,
          tendencia: 'nova',
          uri: item.uri || `spotify:track:${item.id}` // 🚨 Pegamos o URI!
        }));
        
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar o Top Mensal da API', erro);
        this.carregando = false;
      }
    });
  }

  getLarguraRegua(reproducoes: number): string {
    // Proteção: Se a lista estiver vazia, não faz a conta para evitar erro de divisão
    if (this.musicas.length === 0) return '0%';
    
    const maxPlays = this.musicas[0].reproducoes;
    return `${(reproducoes / maxPlays) * 100}%`;
  }

  calcularUltimaAtualizacao() {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    const dia = String(ontem.getDate()).padStart(2, '0');
    const mes = String(ontem.getMonth() + 1).padStart(2, '0');
    
    // Formata para DD/MM às 12:00
    this.ultimaAtualizacao = `Atualizado: ${dia}/${mes} às 12:00`;
  }

  // ==========================================================
  // 🎨 FÁBRICA DE ARTES (A MÁGICA DO CANVAS COM PILL E DEGRADÊ)
  // ==========================================================
  async gerarArteCapaPersonalizadaBase64(): Promise<string | null> {
    return new Promise((resolve) => {
      // 1. O Sorteio das Imagens Base "Limpas" que você preparou
      const imagensDisponiveis = [
        '/capas_playlists/playlist_fones.jpg',
        '/capas_playlists/playlist_show.jpg'
      ];
      const imagemSorteada = imagensDisponiveis[Math.floor(Math.random() * imagensDisponiveis.length)];

      const img = new Image();
      // 🚨 IMPORTANTE para Canvas: Evita bloqueios de segurança do navegador ao desenhar fotos locais
      img.crossOrigin = "Anonymous"; 
      img.src = imagemSorteada;

      img.onload = () => {
        // 2. Criamos a "Tela de Pintura"
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(null);
          return;
        }

        // Desenha a imagem base sorteada no fundo
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // ==========================================================
        // 🚨 O DESENHO DA PÍLULA (BRANCA)
        // ==========================================================
        const ano = new Date().getFullYear();
        const textoPersonalizado = `${this.mesAtual.toUpperCase()} • ${ano}`;

        // 🚨 COORDENADAS E TAMANHOS QUE VOCÊ PASSOU
        // Nós vamos desenhar a pílula centralizada na largura (X: 145px como início) e altura (Y: 790px)
        const eixoX = 145; // Coordenada X de início que você passou
        const eixoY = 790; // Coordenada Y que você passou
        
        // Estiliza a fonte (Mude a fonte ou o tamanho se precisar que caiba melhor na pílula)
        // Usando Montserrat que você gosta, e duplicando o tamanho (24px -> 48px)
        ctx.font = "bold 48px 'Montserrat', sans-serif";
        ctx.textAlign = "start"; // Texto começa no X que passamos
        ctx.textBaseline = "middle"; // Texto centralizado verticalmente na pílula

        // Calcula o tamanho da pílula com base no texto
        const medidasTexto = ctx.measureText(textoPersonalizado);
        const paddingHorizontal = 40; // Espaço nas laterais
        const pillWidth = medidasTexto.width + (paddingHorizontal * 2);
        const pillHeight = medidasTexto.actualBoundingBoxAscent + medidasTexto.actualBoundingBoxDescent + 40; // Altura baseada no texto + espaço

        // 3. Desenha o contorno da pílula (BRANCO)
        ctx.beginPath();
        ctx.lineWidth = 4; // Espessura do contorno
        ctx.strokeStyle = '#FFFFFF'; // Cor branca
        
        // Desenha o Rounded Rectangle (Pílula)
        const raio = pillHeight / 2;
        ctx.moveTo(eixoX + raio, eixoY);
        ctx.lineTo(eixoX + pillWidth - raio, eixoY);
        ctx.quadraticCurveTo(eixoX + pillWidth, eixoY, eixoX + pillWidth, eixoY + raio);
        ctx.lineTo(eixoX + pillWidth, eixoY + pillHeight - raio);
        ctx.quadraticCurveTo(eixoX + pillWidth, eixoY + pillHeight, eixoX + pillWidth - raio, eixoY + pillHeight);
        ctx.lineTo(eixoX + raio, eixoY + pillHeight);
        ctx.quadraticCurveTo(eixoX, eixoY + pillHeight, eixoX, eixoY + pillHeight - raio);
        ctx.lineTo(eixoX, eixoY + raio);
        ctx.quadraticCurveTo(eixoX, eixoY, eixoX + raio, eixoY);
        ctx.closePath();
        ctx.stroke(); // Pinta apenas o contorno

        // ==========================================================
        // 🚨 O DEGRADÊ DO TEXTO (AZUL TUNIFY + VERDE SPOTIFY)
        // ==========================================================
        // 4. Cria o degradê linear cobrindo a largura do texto
        const gradient = ctx.createLinearGradient(eixoX, eixoY, eixoX + pillWidth, eixoY);
        
        // Definindo as cores exatas do seu dashboard (Substitua se tiver códigos hexa exatos)
        gradient.addColorStop(0, '#347CD4');   // Começa com Azul Tunify
        gradient.addColorStop(1, '#1DB954');   // Termina com Verde Spotify
        
        // Aplica o degradê como cor de preenchimento
        ctx.fillStyle = gradient; 

        // 🚨 AJUSTE FINO: Como o Canvas joga fontes Uppercase um pouco para cima, 
        // nós empurramos o texto "na mão" para baixo para igualar o padding.
        const ajusteVerticalTexto = 4;

        // 5. Escreve o texto com degradê DENTRO da pílula
        ctx.fillText(textoPersonalizado, eixoX + paddingHorizontal, eixoY + (pillHeight / 2) + ajusteVerticalTexto);

        // 6. Exporta para JPEG convertendo para Base64 (0.8 = boa compressão para manter abaixo de 256KB)
        const base64Completo = canvas.toDataURL('image/jpeg', 0.8);
        
        // O Spotify recusa a tag inicial, então cortamos apenas a chave pura!
        const base64Puro = base64Completo.split(',')[1];
        
        resolve(base64Puro);
      };

      img.onerror = (err) => {
        console.error('[TUNIFY] Falha ao carregar a imagem base no Canvas para a arte', err);
        // Retornamos nulo para que a playlist ainda seja criada, mesmo se a foto falhar
        resolve(null); 
      };
    });
  }

  // ==========================================================
  // 🚨 FUNÇÃO DISPARADA PELO BOTÃO (A GRANDE MÁGICA)
  // ==========================================================
  async criarNovaPlaylistNoSpotify() {
    // Trava o botão para o usuário não clicar 2 vezes por ansiedade kkkk
    if (this.criandoPlaylist) return;
    
    // Verifica se a lista já carregou
    const uris = this.musicas.map(m => m.uri);
    if (uris.length === 0) {
      alert('Ainda não há músicas para salvar!');
      return;
    }

    this.criandoPlaylist = true;

    try {
      // 🚨 AGORA SIM: Pegando o token diretamente da chave correta!
      const userInfoString = localStorage.getItem('tunify_user_info');
      let token = localStorage.getItem('spotify_token'); 
      if (userInfoString) {
        const usuario = JSON.parse(userInfoString);
        token = usuario.spotify_token || token;
      }

      if (!token) throw new Error('Token do Spotify não encontrado na sessão');

      // 1. DADOS DINÂMICOS DA PLAYLIST
      const mesNome = this.mesAtual.charAt(0).toUpperCase() + this.mesAtual.slice(1); // Ex: "Junho"
      const hoje = new Date();
      const dia = String(hoje.getDate()).padStart(2, '0');
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      const ano = hoje.getFullYear();
      
      // As variáveis exatas que decidimos!
      const nomePlaylist = `As Mais Ouvidas - ${mesNome}`;
      const descricaoPlaylist = `O seu histórico sonoro: as músicas mais reproduzidas por você. Criada em ${dia}/${mes}/${ano} via Tunify.`;

      console.log('[TUNIFY] 1/4 - Buscando perfil do usuário para pegar o ID...');
      const perfil = await firstValueFrom(this.spotifyService.obterPerfilSpotify(token));
      const userId = perfil.id;

      console.log('[TUNIFY] 2/4 - Criando a Playlist vazia...');
      const novaPlaylist = await firstValueFrom(this.spotifyService.criarPlaylist(userId, token, nomePlaylist, descricaoPlaylist));
      const playlistId = novaPlaylist.id;

      console.log('[TUNIFY] 3/4 - Gerando arte e anexando capa personalizada...');
      try {
        const capaBase64 = await this.gerarArteCapaPersonalizadaBase64();
        if (capaBase64) {
          // 🚨 Chamada para a quarta função do seu spotify.service.ts
          await firstValueFrom(this.spotifyService.uploadCapaPlaylist(playlistId, token, capaBase64));
          console.log('[TUNIFY] 🎨 Arte de capa personalizada anexada com sucesso!');
        }
      } catch (erroCapa) {
        console.warn('[TUNIFY] Aviso: A capa falhou, mas o processo vai continuar!', erroCapa);
      }

      console.log('[TUNIFY] 4/4 - Injetando as faixas na playlist...');
      await firstValueFrom(this.spotifyService.adicionarMusicasPlaylist(playlistId, token, uris));

      console.log('✅ [SUCESSO] Playlist criada, populada e com arte personalizada!');
      
      // Sucesso na interface!
      alert('Playlist criada com sucesso! Abra o seu Spotify para conferir. 🎧');

    } catch (erro) {
      console.error('❌ [ERRO] Falha na operação da Playlist:', erro);
      alert('Ops! Não foi possível criar a playlist. Verifique se o token não expirou.');
    } finally {
      // Destrava o botão aconteça o que acontecer
      this.criandoPlaylist = false; 
    }
  }
}