import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-mobile.component.html',
  styleUrl: './player-mobile.component.scss'
})
export class PlayerMobileComponent {
  private cdr = inject(ChangeDetectorRef);

  // ==========================================
  // 📥 INPUTS (O que o Pai manda pra cá)
  // ==========================================
  @Input() trackName: string = '';
  @Input() artistName: string = '';
  @Input() albumCover: string = '';
  @Input() albumColorRGB: string = '11, 17, 32';
  @Input() isPlaying: boolean = false;
  @Input() progress: number = 0;
  @Input() currentTime: string = '0:00';
  @Input() duration: string = '0:00';
  @Input() repeatMode: number = 0;
  
  // O Mobile precisa de algumas caches que o Pai manda para poder fazer a ilusão de ótica do Swipe
  @Input() nextTrackCache: any = null;
  @Input() prevTrackCache: any = null;

  // Letras (Agora também vem do Pai)
  @Input() isLoadingLyrics: boolean = false;
  @Input() formattedLyrics: string = '';

  // ==========================================
  // 📤 OUTPUTS (Os gritos que mandamos pro Pai)
  // ==========================================
  @Output() onTogglePlay = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onSeek = new EventEmitter<number>(); 
  @Output() onSeekStart = new EventEmitter<void>(); 
  @Output() onChangeRepeat = new EventEmitter<void>();
  @Output() onAbrirLetras = new EventEmitter<void>(); // Avisa o pai que precisamos buscar a letra!

  // ==========================================
  // 🎨 ESTADOS VISUAIS (Menus)
  // ==========================================
  isFullScreenMobile: boolean = false;
  isLyricsOpen: boolean = false;
  isQueueOpen: boolean = false;

  abrirTelaCheia() {
    this.isFullScreenMobile = true;
    document.body.style.overflow = 'hidden';
  }

  fecharTelaCheia() {
    this.isFullScreenMobile = false;
    document.body.style.overflow = '';
  }

  abrirAbaLetras() {
    this.isLyricsOpen = true;
    this.onAbrirLetras.emit(); // Grita pro Pai: "Busca as letras lá no Go!"
  }

  // ==========================================
  // 🧠 O LETREIRO INTELIGENTE
  // ==========================================
  @ViewChild('trackContainer', { static: false }) trackContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('trackContent', { static: false }) trackContent!: ElementRef<HTMLDivElement>;
  @ViewChild('artistContainer', { static: false }) artistContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('artistContent', { static: false }) artistContent!: ElementRef<HTMLDivElement>;

  isTrackOverflowing: boolean = false;
  isArtistOverflowing: boolean = false;

  // Como o Angular chama essa função repetidamente, o Angular 16+ pede que usemos ngAfterViewChecked para monitorar isso
  ngAfterViewChecked() {
    this.verificarOverflowDeTexto();
  }

  verificarOverflowDeTexto() {
    if (this.trackContainer && this.trackContent) {
      const cWidth = this.trackContainer.nativeElement.clientWidth;
      const tWidth = this.trackContent.nativeElement.scrollWidth;
      if (this.isTrackOverflowing !== (tWidth > cWidth)) {
        this.isTrackOverflowing = tWidth > cWidth;
        this.cdr.detectChanges();
      }
    }
    
    if (this.artistContainer && this.artistContent) {
      const cWidth = this.artistContainer.nativeElement.clientWidth;
      const tWidth = this.artistContent.nativeElement.scrollWidth;
      if (this.isArtistOverflowing !== (tWidth > cWidth)) {
        this.isArtistOverflowing = tWidth > cWidth;
        this.cdr.detectChanges();
      }
    }
  }

  // ==========================================
  // 👆 MÁGICA DO SWIPE (A Barrinha de Baixo)
  // ==========================================
  swipeTransform: string = 'translateX(0px)';
  swipeTransition: string = 'transform 0.3s ease, opacity 0.3s ease';
  swipeOpacity: number = 1;
  private touchStartX: number = 0;
  private readonly SWIPE_THRESHOLD: number = 50;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].screenX;
    this.swipeTransition = 'none';
  }

  onTouchMove(event: TouchEvent) {
    const currentX = event.touches[0].screenX;
    const deltaX = currentX - this.touchStartX;
    const moveX = deltaX * 0.7;
    this.swipeTransform = `translateX(${moveX}px)`;
    this.swipeOpacity = Math.max(0.1, 1 - Math.abs(deltaX) / 150);
  }

  onTouchEnd(event: TouchEvent) {
    const deltaX = event.changedTouches[0].screenX - this.touchStartX;
    this.swipeTransition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';

    if (deltaX > this.SWIPE_THRESHOLD) {
      this.swipeTransform = 'translateX(100%)';
      this.swipeOpacity = 0;
      this.aplicarIlusaoDeOtica(this.prevTrackCache);
      setTimeout(() => {
        this.onPrevious.emit(); // Manda a ordem real pro Pai!
        this.resetarPosicaoSwipe('esquerda'); 
      }, 200);

    } else if (deltaX < -this.SWIPE_THRESHOLD) {
      this.swipeTransform = 'translateX(-100%)';
      this.swipeOpacity = 0;
      this.aplicarIlusaoDeOtica(this.nextTrackCache);
      setTimeout(() => {
        this.onNext.emit(); // Manda a ordem real pro Pai!
        this.resetarPosicaoSwipe('direita'); 
      }, 200);

    } else {
      this.swipeTransform = 'translateX(0px)';
      this.swipeOpacity = 1;
    }
  }

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

  // ==========================================
  // 📱 MÁGICA DA TELA CHEIA (O Fundo que Arrasta)
  // ==========================================
  fsStartX: number = 0;
  fsStartY: number = 0;
  fsCurrentX: number = 0;
  fsCurrentY: number = 0;
  fsSwipeTransform: string = 'translateX(0)';
  fsSwipeTransition: string = '0.3s ease';
  fsSwipeOpacity: number = 1;
  fsIsDragging: boolean = false;

  onTouchStartFS(event: TouchEvent) {
    this.fsStartX = event.touches[0].clientX;
    this.fsStartY = event.touches[0].clientY;
    this.fsIsDragging = true;
    this.fsSwipeTransition = 'none';
  }

  onTouchMoveFS(event: TouchEvent) {
    if (!this.fsIsDragging) return;
    this.fsCurrentX = event.touches[0].clientX;
    this.fsCurrentY = event.touches[0].clientY;

    const deltaX = this.fsCurrentX - this.fsStartX;
    const deltaY = this.fsCurrentY - this.fsStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 20) return; 

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.fsSwipeTransform = `translateX(${deltaX}px)`;
      this.fsSwipeOpacity = 1 - (Math.abs(deltaX) / window.innerWidth);
    }
  }

  onTouchEndFS(event: TouchEvent) {
    if (!this.fsIsDragging) return;
    this.fsIsDragging = false;
    this.fsSwipeTransition = 'transform 0.3s ease, opacity 0.3s ease'; 

    const deltaX = this.fsCurrentX - this.fsStartX;
    const deltaY = this.fsCurrentY - this.fsStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 70) {
      this.fecharTelaCheia();
    } 
    else if (deltaX > 80) { this.onPrevious.emit(); } 
    else if (deltaX < -80) { this.onNext.emit(); }

    this.fsSwipeTransform = 'translateX(0)';
    this.fsSwipeOpacity = 1;
  }

  // ==========================================
  // 🎩 O TRUQUE DE ILUSÃO DE ÓTICA
  // ==========================================
  private aplicarIlusaoDeOtica(trackFutura: any) {
    if (!trackFutura) return;
    this.trackName = trackFutura.name;
    this.artistName = trackFutura.artists.map((a: any) => a.name).join(', ');
    this.albumCover = trackFutura.album.images[0].url;
    this.progress = 0; 
    this.currentTime = '0:00';
    // O Pai (Container) que fará a extração da cor oficial agora!
  }

  // ==========================================
  // 🔗 REPASSADORES RÁPIDOS
  // ==========================================
  clicouPlay() { this.onTogglePlay.emit(); }
  clicouNext() { this.onNext.emit(); }
  clicouPrevious() { this.onPrevious.emit(); }
  ciclarRepeat() { this.onChangeRepeat.emit(); }

  onSeekVisual(event: Event) {
    const input = event.target as HTMLInputElement;
    this.progress = Number(input.value); 
  }

  onSeekEnd(event: any) {
    let novoProgresso = this.progress; 
    if (event && event.target && event.target.value) {
      novoProgresso = Number(event.target.value);
    }
    // Agora sim ele avisa o Pai que o usuário soltou o dedo no valor X
    this.onSeek.emit(novoProgresso);
  }
}