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

  // 🚨 [NOVO] O "Rádio" que transmite os dados da música atual para o HTML
  private playerStateSubject = new BehaviorSubject<any>(null);
  playerState$ = this.playerStateSubject.asObservable();

  constructor() { }

  iniciarPlayer(token: string) {
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

  // 🚨 [NOVO] O pedal de avançar/voltar a música na barra!
  seek(positionMs: number) {
    if (this.player) {
      // Manda a ordem pro SDK do Spotify
      this.player.seek(positionMs).then(() => {
        console.log(`[TUNIFY] Pulou para o milissegundo: ${positionMs}`);
      });
    }
  }
}