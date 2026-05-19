import * as ColorThief from 'colorthief';
import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

  ngOnInit() {
    this.playerService.playerState$.subscribe((state: any) => {
      if (!state) return;

      const track = state.track_window.current_track;
      const novaCapa = track.album.images[0].url;

      if (this.albumCover !== novaCapa) {
        this.albumCover = novaCapa;
        setTimeout(() => this.extrairCorDaCapa(), 50); 
      }

      this.trackName = track.name;
      this.artistName = track.artists.map((a: any) => a.name).join(', ');
      this.isPlaying = !state.paused;
      
      // 🚨 Sincroniza o relógio interno com a realidade do Spotify
      this.durationMs = state.duration;
      this.positionMs = state.position;
      
      this.duration = this.formatTime(this.durationMs);
      this.atualizarProgressoVisual(); 
      
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
      this.progress = (this.positionMs / this.durationMs) * 100;
      this.currentTime = this.formatTime(this.positionMs);
    }
  }
  // ==========================================

  extrairCorDaCapa() {
    try {
      const imgEl = this.albumImage.nativeElement;
      const processColor = () => {
        // @ts-ignore
        const colorThief = new ColorThief();
        const color = colorThief.getColor(imgEl); 
        this.albumColorRGB = `${color[0]}, ${color[1]}, ${color[2]}`; 
        this.cdr.detectChanges();
      };

      if (imgEl.complete) {
        processColor();
      } else {
        imgEl.addEventListener('load', processColor); 
      }
    } catch (error) {
      console.warn("Erro ao extrair cor:", error);
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
}