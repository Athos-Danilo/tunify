import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-desktop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-desktop.component.html',
  styleUrl: './player-desktop.component.scss'
})
export class PlayerDesktopComponent {
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

  // ==========================================
  // 📤 OUTPUTS (Os cliques que mandamos pro Pai)
  // ==========================================
  @Output() onTogglePlay = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onSeek = new EventEmitter<number>(); 
  @Output() onSeekStart = new EventEmitter<void>(); 
  @Output() onChangeRepeat = new EventEmitter<void>();
  @Output() onAbrirLetras = new EventEmitter<void>();

  // ==========================================
  // 🔗 REPASSADORES RÁPIDOS
  // ==========================================
  clicouPlay() { this.onTogglePlay.emit(); }
  clicouNext() { this.onNext.emit(); }
  clicouPrevious() { this.onPrevious.emit(); }
  ciclarRepeat() { this.onChangeRepeat.emit(); }
  abrirAbaLetras() { this.onAbrirLetras.emit(); }

  // Lógica da barra de progresso com mouse
  onSeekVisual(event: Event) {
    const input = event.target as HTMLInputElement;
    this.progress = Number(input.value); 
  }

  onSeekEnd(event: any) {
    let novoProgresso = this.progress; 
    if (event && event.target && event.target.value) {
      novoProgresso = Number(event.target.value);
    }
    this.onSeek.emit(novoProgresso);
  }
}