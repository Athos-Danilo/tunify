import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // 🚨 [NOVO] Importante para transmitir o status da música!

// Isso diz pro TypeScript: "Confia em mim, essa variável vai existir"
declare var Spotify: any;
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private player: any;
  private deviceId: string = '';

  // 🚨 1. GUARDANDO O TOKEN: Precisamos dele para falar com a API da Repetição
  private accessToken: string = ''; 

  // 🚨 O "Rádio" que transmite os dados da música atual para o HTML
  private playerStateSubject = new BehaviorSubject<any>(null);
  playerState$ = this.playerStateSubject.asObservable();

  constructor() { }

  iniciarPlayer(token: string) {
    // 🚨 2. SALVANDO O TOKEN assim que o player é iniciado
    this.accessToken = token;

    console.log('[INFO] Iniciando a construção da Caixinha de Som do Tunify...');

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('[SUCESSO] SDK do Spotify carregado! Montando o Player...');

      this.player = new Spotify.Player({
        name: 'Tunify Web Player 📻',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.5 
      });

      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('✅ [PRONTO] O Tunify Player está online! ID do Dispositivo:', device_id);
        this.deviceId = device_id;
      });

      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.warn('❌ [OFFLINE] O dispositivo desconectou. ID:', device_id);
      });

      this.player.addListener('initialization_error', ({ message }: any) => { console.error('Erro:', message); });
      this.player.addListener('authentication_error', ({ message }: any) => { console.error('Erro Token:', message); });
      this.player.addListener('account_error', ({ message }: any) => { console.error('Erro Conta:', message); });

      // 🚨 O MAIS IMPORTANTE: Avisa o nosso Componente que a música mudou!
      this.player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        this.playerStateSubject.next(state); // <--- Transmite a fofoca da música pro Angular
      });

      this.player.connect().then((success: boolean) => {
        if (success) {
          console.log('[LIGADO] Conectado com sucesso ao Spotify!');
        }
      });
    };
  }

  // ==========================================
  // 🎮 OS CONTROLES (Os pedais do nosso carro)
  // ==========================================
  togglePlay() {
    if (this.player) this.player.togglePlay();
  }

  nextTrack() {
    if (this.player) this.player.nextTrack();
  }

  previousTrack() {
    if (this.player) this.player.previousTrack();
  }

  // O pedal de avançar/voltar a música na barra!
  seek(positionMs: number) {
    if (this.player) {
      // Manda a ordem pro SDK do Spotify
      this.player.seek(positionMs).then(() => {
        console.log(`[TUNIFY] Pulou para o milissegundo: ${positionMs}`);
      });
    }
  }

  // 🚨 3. O COMUNICADOR DA REPETIÇÃO: Chama a API direto
  setRepeatMode(state: 'off' | 'context' | 'track') {
    if (!this.accessToken) return;
    
    // Fazemos um PUT na API Web oficial do Spotify passando o estado desejado e o ID do nosso Tunify
    fetch(`https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    }).then(response => {
      // O Spotify geralmente responde com 204 (No Content) quando dá certo
      if (response.ok || response.status === 204) {
        console.log(`[TUNIFY] Repetição alterada com sucesso para: ${state}`);
      } else {
        console.warn(`[TUNIFY] A API retornou status ${response.status} ao tentar mudar a repetição.`);
      }
    }).catch(err => console.error('[TUNIFY] Erro ao tentar mudar repetição:', err));
  }

  // 🚨 NOVA FUNÇÃO: Busca a letra da música
  async buscarLetra(musica: string, artista: string): Promise<string | null> {
    try {
      // Limpando os nomes para a URL (tirando espaços extras e caracteres estranhos)
      const trackClean = encodeURIComponent(musica.split('-')[0].trim()); // Tira o "- Remix", etc.
      const artistClean = encodeURIComponent(artista.split(',')[0].trim()); // Pega só o primeiro artista

      // 🔗 AQUI VOCÊ PLUGA A SUA API!
      // Se for usar a pública do lyrics.ovh (Ideal para testes puramente Front-end):
      const url = `https://api.lyrics.ovh/v1/${artistClean}/${trackClean}`;
      
      // Se for usar o seu próprio backend Node.js/Java que faz o scraping do Genius:
      // const url = `https://sua-api-no-render.com/lyrics?artist=${artistClean}&track=${trackClean}`;

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        // A lyrics.ovh retorna no campo 'lyrics'. Ajuste se a sua API retornar diferente!
        return data.lyrics || null; 
      }
      return null;
    } catch (err) {
      console.error('[TUNIFY] Erro ao buscar letra:', err);
      return null;
    }
  }

  // 🚨 Busca a Fila completa direto dos servidores do Spotify
  async getQueue() {
    if (!this.accessToken) return null;
    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('[TUNIFY] Erro ao buscar a fila:', err);
    }
    return null;
  }
}