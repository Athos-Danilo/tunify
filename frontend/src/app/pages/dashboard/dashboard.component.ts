import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SpotifyService } from '../../core/services/spotify.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  // 🚨 A MUDANÇA: Agora apontamos para os arquivos externos!
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
  // Dados Básicos que já temos
  nomeUsuario: string | null = '';
  emailUsuario: string | null = '';
  
  // 🚨 Dados Demográficos (Mockados até a implementação de RN16 no Python)
  // Mas a estrutura já está pronta!
  dadosDemograficos: any = {
    carregando: true,
    // Foto do perfil padrão (pode ser uma silhueta se não tiver foto)
    foto_perfil: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 
    tipo_conta: 'PREMIUM', // ou 'FREE'
    total_playlists: 0,
    seguidores: 128, // Mock (image_5.png)
    seguindo: 350    // Mock (image_5.png)
  };
  
  private router = inject(Router);
  private spotifyService = inject(SpotifyService);
  private cdr = inject(ChangeDetectorRef); 

ngOnInit() {
    this.nomeUsuario = localStorage.getItem('usuario_nome');
    this.emailUsuario = localStorage.getItem('usuario_email');
    
    // 🚨 O LEÃO DE CHÁCARA: Se não tiver logado, chuta pra Home e para a função aqui!
    if (!localStorage.getItem('spotify_token') || !this.emailUsuario) {
      this.router.navigate(['/']);
      return; 
    }

    // A MÁGICA: Fazendo o pedido de Perfil usando o emailUsuario (agora o Angular tem certeza que não é nulo!)
    this.spotifyService.buscarResumoPerfil(this.emailUsuario).subscribe({
      next: (resumoReal) => {
        console.log('📦 [Angular] Dados Reais recebidos:', resumoReal);
        
        // Substituímos o nome do cofre pelo nome oficial do Spotify
        this.nomeUsuario = resumoReal.dono_da_conta; 
        
        // Atualizamos o objeto da tela com os dados do JSON que chegou do Python!
        this.dadosDemograficos = {
          carregando: false,
          foto_perfil: resumoReal.foto_perfil,
          tipo_conta: resumoReal.tipo_conta,
          total_playlists: resumoReal.total_playlists,
          seguidores: resumoReal.seguidores,
          seguindo: resumoReal.seguindo
        };

        // Acorda o Angular para pintar a tela!
        this.cdr.detectChanges(); 
      },
      error: (erro) => {
        console.error('[ERRO] Falha ao buscar perfil:', erro);
        this.dadosDemograficos.carregando = false;
        this.cdr.detectChanges();
        alert("Ops! O Back-end não conseguiu buscar o resumo do seu perfil.");
      }
    });
  }

  fazerLogout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}