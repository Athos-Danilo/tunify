import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FastAverageColor } from 'fast-average-color';
import { PlayerService } from '../../core/services/player.service';

// 🚨 IMPORTAMOS O NOSSO FILHO AQUI
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { PlayerDesktopComponent } from '../player-desktop/player-desktop.component';

@Component({
  selector: 'app-player-container',
  standalone: true,
  // 🚨 AVISAMOS PRO ANGULAR QUE O FILHO FAZ PARTE DESSE COMPONENTE
  imports: [CommonModule, PlayerMobileComponent, PlayerDesktopComponent],
  template: `
    <ng-container *ngIf="hasSession">
        
        <app-player-mobile *ngIf="isMobile"
            [trackName]="trackName"
            [artistName]="artistName"
            [albumCover]="albumCover"
            [albumColorRGB]="albumColorRGB"
            [isPlaying]="isPlaying"
            [progress]="progress"
            [currentTime]="currentTime"
            [duration]="duration"
            [repeatMode]="repeatMode"
            [nextTrackCache]="nextTrackCache"
            [prevTrackCache]="prevTrackCache"
            [isLoadingLyrics]="isLoadingLyrics"
            [formattedLyrics]="formattedLyrics"

            (onTogglePlay)="togglePlay()"
            (onNext)="next()"
            (onPrevious)="previous()"
            (onSeek)="onSeek($event)"
            (onSeekStart)="onSeekStart()"
            (onChangeRepeat)="ciclarRepeat()"
            (onAbrirLetras)="buscarLetras()">
        </app-player-mobile>

        <app-player-desktop *ngIf="!isMobile"
            [trackName]="trackName"
            [artistName]="artistName"
            [albumCover]="albumCover"
            [albumColorRGB]="albumColorRGB"
            [isPlaying]="isPlaying"
            [progress]="progress"
            [currentTime]="currentTime"
            [duration]="duration"
            [repeatMode]="repeatMode"

            (onTogglePlay)="togglePlay()"
            (onNext)="next()"
            (onPrevious)="previous()"
            (onSeek)="onSeek($event)"
            (onSeekStart)="onSeekStart()"
            (onChangeRepeat)="ciclarRepeat()"
            (onAbrirLetras)="buscarLetras()">
        </app-player-desktop>

        </ng-container>
  `
})
export class PlayerContainerComponent implements OnInit, OnDestroy {
  private playerService = inject(PlayerService);
  private cdr = inject(ChangeDetectorRef);
  private breakpointObserver = inject(BreakpointObserver);

  // ==========================================
  // 🧠 VARIÁVEIS DE ESTADO GLOBAL
  // ==========================================
  hasSession: boolean = false;
  isMobile: boolean = false; 

  trackName: string = '';
  artistName: string = '';
  albumCover: string = '';
  albumColorRGB: string = '11, 17, 32';
  isPlaying: boolean = false;
  repeatMode: number = 0;
  
  progress: number = 0;
  currentTime: string = '0:00';
  duration: string = '0:00';
  positionMs: number = 0;
  durationMs: number = 0;
  private progressTimer: any;
  isDraggingProgress: boolean = false;

  nextTrackCache: any = null;
  prevTrackCache: any = null;

  isLoadingLyrics: boolean = false;
  formattedLyrics: string = '';
  private currentLyricsText: string = '';

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isMobile = result.matches;
      this.cdr.detectChanges();
    });

    this.playerService.playerState$.subscribe((state: any) => {
      if (!state) {
        this.hasSession = false;
        return;
      }

      this.hasSession = true;

      const track = state.track_window.current_track;
      
      this.nextTrackCache = state.track_window.next_tracks.length > 0 ? state.track_window.next_tracks[0] : null;
      this.prevTrackCache = state.track_window.previous_tracks.length > 0 ? state.track_window.previous_tracks[0] : null;

      const novaCapa = track.album.images[0].url;
      if (this.albumCover !== novaCapa) {
        this.albumCover = novaCapa;
        setTimeout(() => this.extrairCorDaCapa(novaCapa), 50); 
      }

      this.trackName = track.name;
      this.artistName = track.artists.map((a: any) => a.name).join(', ');
      
      this.currentLyricsText = '';
      this.formattedLyrics = '';

      this.isPlaying = !state.paused;
      this.repeatMode = state.repeat_mode;

      if (!this.isDraggingProgress) {
        this.durationMs = state.duration;
        this.positionMs = state.position;
        this.duration = this.formatTime(this.durationMs);
        this.atualizarProgressoVisual();
      }

      this.gerenciarCronometro();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.pararCronometro();
  }

  // ==========================================
  // 🎨 LÓGICA DE CORES
  // ==========================================
  extrairCorDaCapa(url: string) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      const fac = new FastAverageColor();
      fac.getColorAsync(img)
        .then(color => {
          this.albumColorRGB = `${color.value[0]}, ${color.value[1]}, ${color.value[2]}`;
          this.cdr.detectChanges();
        })
        .catch(() => this.albumColorRGB = '11, 17, 32');
    };
  }

  // ==========================================
  // ⏱️ LÓGICA DO CRONÔMETRO E BARRA
  // ==========================================
  private gerenciarCronometro() {
    this.pararCronometro();
    if (this.isPlaying) {
      this.progressTimer = setInterval(() => {
        this.positionMs += 100;
        if (this.positionMs >= this.durationMs) {
          this.positionMs = this.durationMs;
          this.pararCronometro();
        }
        this.atualizarProgressoVisual();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  private pararCronometro() {
    if (this.progressTimer) clearInterval(this.progressTimer);
  }

  private atualizarProgressoVisual() {
    if (this.durationMs > 0 && !this.isDraggingProgress) {
      this.progress = (this.positionMs / this.durationMs) * 100;
      this.currentTime = this.formatTime(this.positionMs);
    }
  }

  formatTime(ms: number): string {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return min + ":" + (Number(sec) < 10 ? '0' : '') + sec;
  }

  // Recebe o grito do Filho Mobile quando a barra é arrastada
  onSeekStart() {
    this.isDraggingProgress = true;
  }

  // Recebe o grito do Filho Mobile com o valor final da barra
  onSeek(novoProgresso: number) {
    const tempoDestinoMs = Math.round((novoProgresso / 100) * this.durationMs);
    this.positionMs = tempoDestinoMs;
    this.progress = novoProgresso;
    this.currentTime = this.formatTime(this.positionMs);

    this.playerService.seek(tempoDestinoMs); 

    setTimeout(() => {
      this.isDraggingProgress = false;
    }, 1500);
  }

  // ==========================================
  // 🎤 LÓGICA DE LETRAS (A Ponte para o Go)
  // ==========================================
  async buscarLetras() {
    if (this.currentLyricsText) return; 

    this.isLoadingLyrics = true;
    try {
      const letraReal = await this.playerService.buscarLetra(this.trackName, this.artistName);

      if (letraReal) {
        this.currentLyricsText = letraReal;
        this.formattedLyrics = letraReal.replace(/(\[.*?\])/g, '<span class="tunify-tag">$1</span>');
      } else {
        this.formattedLyrics = 'Letra não encontrada para esta música.';
      }
    } catch (error) {
      this.formattedLyrics = 'Erro ao conectar com o servidor de letras.';
    } finally {
      this.isLoadingLyrics = false;
      this.cdr.detectChanges();
    }
  }

  // ==========================================
  // 🎮 MÉTODOS DE CONTROLE (Spotify API)
  // ==========================================
  togglePlay() { this.playerService.togglePlay(); }
  next() { this.playerService.nextTrack(); }
  previous() { this.playerService.previousTrack(); }
  
  ciclarRepeat() {
    let newStateStr: 'off' | 'context' | 'track' = 'off';
    if (this.repeatMode === 0) {
      newStateStr = 'context';
      this.repeatMode = 1; 
    } else if (this.repeatMode === 1) {
      newStateStr = 'track';
      this.repeatMode = 2;
    } else {
      newStateStr = 'off';
      this.repeatMode = 0;
    }
    this.playerService.setRepeatMode(newStateStr);
  }
}