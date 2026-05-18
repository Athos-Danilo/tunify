import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🚨 IMPORTANTE: Ajuste o caminho de acordo com onde você salvou o service!
import { SpotifyService } from '../../core/services/spotify.service';

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
  
  // Começamos com a lista vazia
  musicas: Musica[] = [];
  
  // Variável para mostrar um "Carregando..." no HTML se você quiser depois
  carregando: boolean = true; 

  // Injetamos o nosso carteiro
  private spotifyService = inject(SpotifyService);

  ngOnInit() {
    this.mesAtual = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(new Date());
    this.calcularUltimaAtualizacao();
    
    // Chama a função que busca no Backend
    this.buscarDadosDoBackend();
  }

  buscarDadosDoBackend() {
    // 🚨 1. Pega o pacote inteiro do usuário que salvamos no login
    const userInfoString = localStorage.getItem('tunify_user_info'); 

    if (!userInfoString) {
      console.error('Nenhum usuário logado encontrado!');
      return;
    }

    // 🚨 2. Transforma o texto de volta em objeto e pega o email
    const usuario = JSON.parse(userInfoString);
    const emailLogado = usuario.email;

    if (!emailLogado) {
      console.error('O objeto do usuário não tem um e-mail!');
      return;
    }

    // Passa o e-mail para o carteiro!
    this.spotifyService.getTopMensal(emailLogado).subscribe({
      next: (resposta) => {
        // A MÁGICA DA TRADUÇÃO: Transformamos o JSON do backend na nossa Interface!
        this.musicas = resposta.dados.map((item: any) => ({
          posicao: item.rank,
          titulo: item.nome,
          artista: item.artista,
          capa: item.capa_url,
          reproducoes: item.total_plays,
          tendencia: 'nova' 
        }));
        
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar o Top Mensal da API', erro);
        this.carregando = false;
      }
    });
  }

  getLarguraRegua(reproducoes: number): string {
    // Proteção: Se a lista estiver vazia, não faz a conta para evitar erro de divisão
    if (this.musicas.length === 0) return '0%';
    
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