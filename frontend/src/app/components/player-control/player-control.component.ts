import { FastAverageColor } from 'fast-average-color';
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-player-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-control.component.html',
  styleUrl: './player-control.component.scss'
})
export class PlayerControlComponent implements OnInit, OnDestroy {
  private playerService = inject(PlayerService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('albumImage', { static: false }) albumImage!: ElementRef<HTMLImageElement>;

  trackName: string = 'Nenhuma música tocando';
  artistName: string = 'Tunify Player';
  albumCover: string = 'assets/default-cover.png';
  isPlaying: boolean = false;
  
  // 🚨 Variáveis novas para o cronômetro funcionar
  progress: number = 0;
  currentTime: string = '0:00';
  duration: string = '0:00';
  private positionMs: number = 0; // Guarda os milissegundos atuais
  private durationMs: number = 0; // Guarda os milissegundos totais
  private progressTimer: any;     // O nosso cronômetro

  albumColorRGB: string = '11, 17, 32'; 

  // 🚨 Variáveis do Letreiro Inteligente (Separadas em duas linhas!)
  @ViewChild('trackContainer', { static: false }) trackContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('trackContent', { static: false }) trackContent!: ElementRef<HTMLDivElement>;
  @ViewChild('artistContainer', { static: false }) artistContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('artistContent', { static: false }) artistContent!: ElementRef<HTMLDivElement>;

  isTrackOverflowing: boolean = false;
  isArtistOverflowing: boolean = false;

  // 🚨 Variáveis para o Swipe (Arrastar no celular)
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private readonly SWIPE_THRESHOLD: number = 50; // Distância mínima (em pixels) para considerar um arrasto
  
  // 🚨 O que o HTML vai ler pra mover as coisas:
  swipeTransform: string = 'translateX(0px)';
  swipeTransition: string = 'transform 0.3s ease, opacity 0.3s ease';
  swipeOpacity: number = 1;

  // 🚨 Guarda as músicas que vêm antes e depois na fila
  private nextTrackCache: any = null;
  private prevTrackCache: any = null;

  // 🚨 Controle da Tela Cheia
  isFullScreenMobile: boolean = false;

  abrirTelaCheia() {
    // Só abre se for tela de celular!
    if (window.innerWidth <= 768) {
      this.isFullScreenMobile = true;
      // 🚨 TRAVA A TELA: Impede o site de rolar por trás do player
      document.body.style.overflow = 'hidden';
    }
  }

  fecharTelaCheia() {
    this.isFullScreenMobile = false;
    // 🚨 DESTRAVA A TELA: Devolve a rolagem normal pro dashboard
    document.body.style.overflow = '';
  }

  // 🚨 VARIÁVEIS DA FÍSICA DO TELA CHEIA
  fsStartX: number = 0;
  fsStartY: number = 0;
  fsCurrentX: number = 0;
  fsCurrentY: number = 0;
  fsSwipeTransform: string = 'translateX(0)';
  fsSwipeTransition: string = '0.3s ease';
  fsSwipeOpacity: number = 1;
  fsIsDragging: boolean = false;

  // 1. O Dedo encosta na tela
  onTouchStartFS(event: TouchEvent) {
    this.fsStartX = event.touches[0].clientX;
    this.fsStartY = event.touches[0].clientY;
    this.fsIsDragging = true;
    this.fsSwipeTransition = 'none'; // Tira o delay para a capa grudar no dedo
  }

  // 2. O Dedo arrasta na tela
  onTouchMoveFS(event: TouchEvent) {
    if (!this.fsIsDragging) return;
    this.fsCurrentX = event.touches[0].clientX;
    this.fsCurrentY = event.touches[0].clientY;

    const deltaX = this.fsCurrentX - this.fsStartX;
    const deltaY = this.fsCurrentY - this.fsStartY;

    // Se o usuário estiver arrastando para BAIXO, não move a capa pros lados
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 20) {
      return; 
    }

    // Se for um movimento HORIZONTAL, a capa e texto escorregam acompanhando o dedo
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.fsSwipeTransform = `translateX(${deltaX}px)`;
      this.fsSwipeOpacity = 1 - (Math.abs(deltaX) / window.innerWidth);
    }
  }

  // 3. O Dedo solta a tela
  onTouchEndFS(event: TouchEvent) {
    if (!this.fsIsDragging) return;
    this.fsIsDragging = false;
    
    // Devolve a suavidade para a capa voltar pro lugar
    this.fsSwipeTransition = 'transform 0.3s ease, opacity 0.3s ease'; 

    const deltaX = this.fsCurrentX - this.fsStartX;
    const deltaY = this.fsCurrentY - this.fsStartY;

    // GESTO: Arrastou bastante para BAIXO? Fecha o player!
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 70) {
      this.fecharTelaCheia();
    } 
    // GESTO: Arrastou para a DIREITA? Música anterior!
    else if (deltaX > 80) {
      this.previous();
    } 
    // GESTO: Arrastou para a ESQUERDA? Próxima música!
    else if (deltaX < -80) {
      this.next();
    }

    // Efeito elástico: a capa sempre volta pro meio quando solta
    this.fsSwipeTransform = 'translateX(0)';
    this.fsSwipeOpacity = 1;
  }

  ngOnInit() {
    this.playerService.playerState$.subscribe((state: any) => {
      if (!state) return;

      const track = state.track_window.current_track;

      // 🚨 PEGANDO A FILA AQUI! (Salva a primeira música da lista de próximas e anteriores)
      this.nextTrackCache = state.track_window.next_tracks.length > 0 ? state.track_window.next_tracks[0] : null;
      this.prevTrackCache = state.track_window.previous_tracks.length > 0 ? state.track_window.previous_tracks[0] : null;

      const novaCapa = track.album.images[0].url;

      if (this.albumCover !== novaCapa) {
        this.albumCover = novaCapa;
        setTimeout(() => this.extrairCorDaCapa(), 50); 
      }

      this.trackName = track.name;
      this.artistName = track.artists.map((a: any) => a.name).join(', ');

      // 🚨 Checa o tamanho do texto sempre que a música atualiza
      setTimeout(() => this.verificarOverflowDeTexto(), 100);

      this.isPlaying = !state.paused;
      
      // 🚨 Sincroniza o relógio interno com a realidade do Spotify
      // SÓ SINCRONIZA SE NÃO ESTIVER ARRASTANDO, senão a bolinha pula!
      if (!this.isDraggingProgress) {
        this.durationMs = state.duration;
        this.positionMs = state.position;
        
        this.duration = this.formatTime(this.durationMs);
        this.atualizarProgressoVisual(); 
      }
      
      // 🚨 Liga ou desliga o cronômetro baseado no play/pause
      this.gerenciarCronometro();

      this.cdr.detectChanges();
    });
  }

  // 🚨 Desliga o cronômetro se o componente for destruído (boa prática de Angular)
  ngOnDestroy() {
    this.pararCronometro();
  }

  // ==========================================
  // ⏱️ A MÁGICA DO TEMPO (O Cronômetro)
  // ==========================================
  private gerenciarCronometro() {
    this.pararCronometro(); // Limpa se já tiver um rodando

    if (this.isPlaying) {
      // Cria um relógio que roda a cada 1 segundo (1000ms)
      this.progressTimer = setInterval(() => {
        this.positionMs += 100; // Soma 100 milissegundos

        // Se passar do limite da música, ele trava no final e desliga
        if (this.positionMs >= this.durationMs) {
          this.positionMs = this.durationMs;
          this.pararCronometro();
        }

        this.atualizarProgressoVisual();
        this.cdr.detectChanges(); // Avisa o HTML pra atualizar a tela
      }, 100);
    }
  }

  private pararCronometro() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
    }
  }

  private atualizarProgressoVisual() {
    if (this.durationMs > 0) {
      // 🚨 A MORDAÇA ENTRA AQUI! 
      // Só atualiza a barrinha e o texto do tempo se o dedo NÃO estiver na tela
      if (!this.isDraggingProgress) {
        this.progress = (this.positionMs / this.durationMs) * 100;
        this.currentTime = this.formatTime(this.positionMs);
      }
    }
  }


  extrairCorDaCapa() {
    try {
      const imgEl = this.albumImage.nativeElement;

      const processColor = () => {
        const fac = new FastAverageColor();
        
        // A mágica acontece aqui de forma assíncrona pra não travar o celular
        fac.getColorAsync(imgEl)
          .then(color => {
            // color.value retorna um array com [R, G, B, Alpha]
            this.albumColorRGB = `${color.value[0]}, ${color.value[1]}, ${color.value[2]}`;
            this.cdr.detectChanges();
          })
          .catch(err => {
            console.warn("Erro na biblioteca de cor:", err);
            this.albumColorRGB = '11, 17, 32'; // Cor padrão de fallback
            this.cdr.detectChanges();
          });
      };

      if (imgEl.complete) {
        processColor();
      } else {
        imgEl.addEventListener('load', processColor); 
      }
    } catch (error) {
      console.warn("Erro geral ao extrair cor:", error);
      this.albumColorRGB = '11, 17, 32'; 
    }
  }

  togglePlay() { this.playerService.togglePlay(); }
  next() { this.playerService.nextTrack(); }
  previous() { this.playerService.previousTrack(); }
  
  private formatTime(ms: number) {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return min + ":" + (Number(sec) < 10 ? '0' : '') + sec;
  }

  // ==========================================
  // 👆 MÁGICA DO SWIPE (Com Física em Tempo Real)
  // ==========================================
  onTouchStart(event: TouchEvent) {
    if (window.innerWidth > 768) return;
    this.touchStartX = event.touches[0].screenX;
    this.swipeTransition = 'none'; // Desliga a animação pra "grudar" no dedo
  }

  onTouchMove(event: TouchEvent) {
    if (window.innerWidth > 768) return;
    const currentX = event.touches[0].screenX;
    const deltaX = currentX - this.touchStartX;

    // Movemos a capa e o texto, mas com 70% da força pra não sair voando da tela
    const moveX = deltaX * 0.7;

    this.swipeTransform = `translateX(${moveX}px)`;
    // A mágica do Fade Out: quanto mais você arrasta, mais invisível fica
    this.swipeOpacity = Math.max(0.1, 1 - Math.abs(deltaX) / 150);
  }

  onTouchEnd(event: TouchEvent) {
    if (window.innerWidth > 768) return;
    const deltaX = event.changedTouches[0].screenX - this.touchStartX;

    this.swipeTransition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';

    if (deltaX > this.SWIPE_THRESHOLD) {
      // ➡️ Arrastou pra DIREITA (Música Anterior)
      this.swipeTransform = 'translateX(100%)';
      this.swipeOpacity = 0;
      
      // 🚨 INJETA A ILUSÃO AQUI!
      this.aplicarIlusaoDeOtica(this.prevTrackCache);

      setTimeout(() => {
        this.previous(); // Manda o comando real pro Spotify
        this.resetarPosicaoSwipe('esquerda'); 
      }, 200);

    } else if (deltaX < -this.SWIPE_THRESHOLD) {
      // ⬅️ Arrastou pra ESQUERDA (Próxima Música)
      this.swipeTransform = 'translateX(-100%)';
      this.swipeOpacity = 0;

      // 🚨 INJETA A ILUSÃO AQUI TAMBÉM!
      this.aplicarIlusaoDeOtica(this.nextTrackCache);

      setTimeout(() => {
        this.next(); // Manda o comando real pro Spotify
        this.resetarPosicaoSwipe('direita'); 
      }, 200);

    } else {
      this.swipeTransform = 'translateX(0px)';
      this.swipeOpacity = 1;
    }
  }

  // Joga os elementos pro lado oposto invisíveis e traz pro meio com estilo
  private resetarPosicaoSwipe(ladoOposto: 'esquerda' | 'direita') {
    this.swipeTransition = 'none';
    this.swipeTransform = ladoOposto === 'esquerda' ? 'translateX(-50%)' : 'translateX(50%)';

    setTimeout(() => {
      this.swipeTransition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease';
      this.swipeTransform = 'translateX(0px)';
      this.swipeOpacity = 1;
      this.cdr.detectChanges();
    }, 50);
  }

  // 🚨 O Truque de Mestre: Troca a tela antes da música tocar de verdade
  private aplicarIlusaoDeOtica(trackFutura: any) {
    if (!trackFutura) return;
    this.trackName = trackFutura.name;
    this.artistName = trackFutura.artists.map((a: any) => a.name).join(', ');
    this.albumCover = trackFutura.album.images[0].url;
    this.progress = 0; // Zera a barrinha
    this.currentTime = '0:00';
    this.extrairCorDaCapa(); // Já puxa a cor da música nova antecipadamente!
  }

  // 🚨 Checa linha por linha independentemente!
  verificarOverflowDeTexto() {
    if (this.trackContainer && this.trackContent) {
      const cWidth = this.trackContainer.nativeElement.clientWidth;
      const tWidth = this.trackContent.nativeElement.scrollWidth;
      this.isTrackOverflowing = tWidth > cWidth;
    }
    
    if (this.artistContainer && this.artistContent) {
      const cWidth = this.artistContainer.nativeElement.clientWidth;
      const tWidth = this.artistContent.nativeElement.scrollWidth;
      this.isArtistOverflowing = tWidth > cWidth;
    }
    this.cdr.detectChanges();
  }

  // 🚨 VARIÁVEL DE CONTROLE
  isDraggingProgress: boolean = false;

  // 1. O dedo tocou na barra: Pausa a atualização automática!
  onSeekStart() {
    this.isDraggingProgress = true;
  }

  // 2. O dedo está arrastando: Atualiza só a barrinha visualmente
  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.progress = Number(input.value); 
  }

  // 3. O dedo soltou a barra: Dá o comando pro Spotify!
  onSeekEnd(event: Event) {
    const input = event.target as HTMLInputElement;
    const novoProgresso = Number(input.value);

    // 🚨 CÁLCULO EXATO DOS MILISSEGUNDOS!
    const tempoDestinoMs = Math.round((novoProgresso / 100) * this.durationMs);
    
    // 🔗 Chama o serviço que acabamos de criar!
    this.playerService.seek(tempoDestinoMs); 

    // Dá meio segundo de folga pro Spotify processar antes de religar o cronômetro do seu app
    setTimeout(() => {
      this.isDraggingProgress = false;
    }, 500);
  }
}