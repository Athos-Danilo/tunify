import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms'; 
import { LogoComponent } from '../../components/logo.component';

interface TrackData {
  spotify_id: string;
  artist_name: string;
  name: string;
  duration_ms: number;
  popularity: number;
  genres: string[];
  audio_features: { energy: number; acousticness: number; tempo: number; };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LogoComponent], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  
  modoEscuro = true;
  email = '';
  senha = '';
  carregando = false;
  mensagemErro = '';

  // Variáveis do Scanner
  musicaAtual: TrackData | null = null;
  mostrarScanner = true; 
  cicloInterval: any;

  private musicasSimuladas: TrackData[] = [
    { spotify_id: '4uLU6hQGQe9', artist_name: 'Post Malone', name: 'Chemical', duration_ms: 184000, popularity: 92, genres: ['pop', 'rap'], audio_features: { energy: 0.89, acousticness: 0.12, tempo: 130.5 } },
    { spotify_id: '3En4qM71v2lX3N7P6K5T6X', artist_name: 'The Weeknd', name: 'Blinding Lights', duration_ms: 200040, popularity: 98, genres: ['synthwave', 'pop'], audio_features: { energy: 0.73, acousticness: 0.00, tempo: 171.0 } },
    { spotify_id: '3j80Gq3f7O05bA7R2T1S0J', artist_name: 'Ariana Grande', name: 'positions', duration_ms: 172000, popularity: 91, genres: ['pop', 'r&b'], audio_features: { energy: 0.80, acousticness: 0.46, tempo: 144.0 } },
    { spotify_id: '56gGq3f7O05bA7R2T1S0J', artist_name: 'Dua Lipa', name: 'Levitating', duration_ms: 203000, popularity: 94, genres: ['dance-pop', 'pop'], audio_features: { energy: 0.82, acousticness: 0.02, tempo: 103.0 } },
    { spotify_id: '86gGq3f7O05bA7R2T1S0J', artist_name: 'Ed Sheeran', name: 'Shivers', duration_ms: 207000, popularity: 93, genres: ['pop', 'acoustic'], audio_features: { energy: 0.85, acousticness: 0.28, tempo: 110.0 } },
    { spotify_id: '06gGq3f7O05bA7R2T1S0J', artist_name: 'Billie Eilish', name: 'bad guy', duration_ms: 194000, popularity: 95, genres: ['electropop', 'pop'], audio_features: { energy: 0.44, acousticness: 0.32, tempo: 135.0 } }
  ];

  // 🚨 Injetamos o ChangeDetectorRef aqui
  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const temaSalvo = localStorage.getItem('tunify_tema');
    if (temaSalvo === 'claro') { this.modoEscuro = false; }
    this.iniciarCicloDeMusicas();
  }

  iniciarCicloDeMusicas() {
    this.trocarMusica(); 
    
    this.cicloInterval = setInterval(() => {
      this.mostrarScanner = false; 
      this.cdr.detectChanges(); 
      
      setTimeout(() => {
        this.trocarMusica(); 
        this.mostrarScanner = true; 
        this.cdr.detectChanges(); 
      }, 800); 
      
    }, 12000); // 🚨 AUMENTADO PARA 12 SEGUNDOS! O tempo exato da nossa coreografia.
  }

  trocarMusica() {
    let novaMusica;
    do {
      const index = Math.floor(Math.random() * this.musicasSimuladas.length);
      novaMusica = this.musicasSimuladas[index];
    } while (this.musicaAtual && novaMusica.spotify_id === this.musicaAtual.spotify_id); 
    
    this.musicaAtual = novaMusica;
  }

  ngOnDestroy() {
    if (this.cicloInterval) { clearInterval(this.cicloInterval); } 
  }

  entrarNoSistema() {
    this.mensagemErro = '';
    if (!this.email || !this.senha) { this.mensagemErro = 'Preencha todos os campos, boy!'; return; }
    this.carregando = true;
    setTimeout(() => {
      this.carregando = false;
      this.mensagemErro = 'A API do backend ainda não está conectada kkkk!';
    }, 1500);
  }
}