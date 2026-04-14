import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Musica {
  posicao: number;
  titulo: string;
  artista: string;
  capa: string;
  reproducoes: number;
  tendencia: 'sobe' | 'desce' | 'nova' | 'estavel';
  valorTendencia?: number;
}

@Component({
  selector: 'app-top-musicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-musicas.component.html',
  styleUrl: './top-musicas.component.scss'
})
export class TopMusicasComponent implements OnInit {
  mesAtual: string = '';
  ultimaAtualizacao: string = '';
  musicas: Musica[] = [
    { posicao: 1, titulo: 'Starboy', artista: 'The Weeknd', capa: 'https://picsum.photos/50/50?random=1', reproducoes: 145, tendencia: 'estavel' },
    { posicao: 2, titulo: 'Blinding Lights', artista: 'The Weeknd', capa: 'https://picsum.photos/50/50?random=2', reproducoes: 128, tendencia: 'sobe', valorTendencia: 2 },
    { posicao: 3, titulo: 'Flowers', artista: 'Miley Cyrus', capa: 'https://picsum.photos/50/50?random=3', reproducoes: 112, tendencia: 'nova' },
    { posicao: 4, titulo: 'Cruel Summer', artista: 'Taylor Swift', capa: 'https://picsum.photos/50/50?random=4', reproducoes: 98, tendencia: 'desce', valorTendencia: 1 },
    { posicao: 5, titulo: 'Levitating', artista: 'Dua Lipa', capa: 'https://picsum.photos/50/50?random=5', reproducoes: 85, tendencia: 'sobe', valorTendencia: 3 },
    { posicao: 6, titulo: 'As It Was', artista: 'Harry Styles', capa: 'https://picsum.photos/50/50?random=6', reproducoes: 76, tendencia: 'estavel' },
    { posicao: 7, titulo: 'Do I Wanna Know?', artista: 'Arctic Monkeys', capa: 'https://picsum.photos/50/50?random=7', reproducoes: 65, tendencia: 'nova' },
    { posicao: 8, titulo: 'good 4 u', artista: 'Olivia Rodrigo', capa: 'https://picsum.photos/50/50?random=8', reproducoes: 58, tendencia: 'desce', valorTendencia: 2 },
    { posicao: 9, titulo: 'Locked Out of Heaven', artista: 'Bruno Mars', capa: 'https://picsum.photos/50/50?random=9', reproducoes: 49, tendencia: 'sobe', valorTendencia: 1 },
    { posicao: 10, titulo: 'Mr. Brightside', artista: 'The Killers', capa: 'https://picsum.photos/50/50?random=10', reproducoes: 42, tendencia: 'estavel' },
  ];

  ngOnInit() {
    this.mesAtual = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(new Date());
    this.calcularUltimaAtualizacao();
  }

  getLarguraRegua(reproducoes: number): string {
    const maxPlays = this.musicas[0].reproducoes;
    return `${(reproducoes / maxPlays) * 100}%`;
  }

  calcularUltimaAtualizacao() {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);
    
    const dia = String(ontem.getDate()).padStart(2, '0');
    const mes = String(ontem.getMonth() + 1).padStart(2, '0');
    
    // Formata para DD/MM às 12:00
    this.ultimaAtualizacao = `Atualizado: ${dia}/${mes} às 12:00`;
  }
}