import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-player-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-control.component.html',
  styleUrl: './player-control.component.scss'
})
export class PlayerControlComponent implements OnInit {
  private playerService = inject(PlayerService);
  private cdr = inject(ChangeDetectorRef);

  // Variáveis para a UI
  trackName: string = 'Nenhuma música tocando';
  artistName: string = 'Tunify Player';
  albumCover: string = 'assets/default-cover.png'; // Coloca uma imagem padrão aqui
  isPlaying: boolean = false;
  progress: number = 0;
  currentTime: string = '0:00';
  duration: string = '0:00';
  volume: number = 50;

  ngOnInit() {
    // Vamos nos inscrever nas mudanças do player que criamos no Service
    this.playerService.playerState$.subscribe((state: any) => {
      if (!state) return;

      const track = state.track_window.current_track;
      this.trackName = track.name;
      this.artistName = track.artists.map((a: any) => a.name).join(', ');
      this.albumCover = track.album.images[0].url;
      this.isPlaying = !state.paused;
      
      // Cálculo de progresso
      this.duration = this.formatTime(state.duration);
      this.progress = (state.position / state.duration) * 100;
      this.currentTime = this.formatTime(state.position);
      
      this.cdr.detectChanges(); // Força o Angular a ver a mudança
    });
  }

  // Métodos que chamam o SDK
  togglePlay() { this.playerService.togglePlay(); }
  next() { this.playerService.nextTrack(); }
  previous() { this.playerService.previousTrack(); }
  
  private formatTime(ms: number) {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return min + ":" + (Number(sec) < 10 ? '0' : '') + sec;
  }
}