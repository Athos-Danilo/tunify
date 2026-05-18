import { Injectable } from '@angular/core';

// Isso diz pro TypeScript: "Confia em mim, essa variável vai existir quando o script carregar"
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

  constructor() { }

  // 🚨 Chama isso passando o access_token que tá salvo no localStorage
  iniciarPlayer(token: string) {
    console.log('[INFO] Iniciando a construção da Caixinha de Som do Tunify...');

    // 1. Injetamos o script oficial do Spotify no HTML da página dinamicamente
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    // 2. Quando o script terminar de baixar, o Spotify vai chamar essa função global
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('[SUCESSO] SDK do Spotify carregado! Montando o Player...');

      // 3. Criamos o nosso dispositivo (A Caixinha de Som)
      this.player = new Spotify.Player({
        name: 'Tunify Web Player 📻',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.5 // Volume de 0 a 1
      });

      // --- OUVINTES DE EVENTOS ---
      
      // Quando a caixinha liga e fica pronta pra tocar
      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('✅ [PRONTO] O Tunify Player está online! ID do Dispositivo:', device_id);
        this.deviceId = device_id;
        
        // Aqui a gente pode avisar pro backend que esse é o dispositivo oficial pra tocar a música
      });

      // Se a conexão cair ou der erro
      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.warn('❌ [OFFLINE] O dispositivo desconectou. ID:', device_id);
      });

      // Erros gerais pra gente ver no console
      this.player.addListener('initialization_error', ({ message }: any) => { console.error('Erro de Inicialização:', message); });
      this.player.addListener('authentication_error', ({ message }: any) => { console.error('Erro de Autenticação (Token velho?):', message); });
      this.player.addListener('account_error', ({ message }: any) => { console.error('Erro de Conta (Precisa ser Premium!):', message); });

      // O mais importante: Avisa sempre que a música mudar, pausar, ou andar pra frente
      this.player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        console.log('[MUDOU O STATUS] O que está tocando agora:', state.track_window.current_track.name);
      });

      // 4. LIGAR NA TOMADA!
      this.player.connect().then((success: boolean) => {
        if (success) {
          console.log('[LIGADO] Conectado com sucesso ao Spotify!');
        }
      });
    };
  }
}