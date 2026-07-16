import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import gsap from 'gsap';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { SpotifyService } from '../../core/services/spotify.service';
import { ReproducoesRecentes } from '../../components/reproducoes-recentes/reproducoes-recentes';

@Component({
  selector: 'app-estatisticas',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ReproducoesRecentes],
  templateUrl: './estatisticas.component.html',
  styleUrls: ['./estatisticas.component.scss']
})
export class EstatisticasComponent implements OnInit {
  modoEscuro: boolean = true;
  nomeUsuario: string = 'Carregando...';
  fotoPerfil: string = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  private authService = inject(AuthService);
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Sincroniza o modo claro/escuro com o restante da aplicação
    if (typeof window !== 'undefined') {
      const temaSalvo = localStorage.getItem('tunify_tema');
      if (temaSalvo === 'claro') {
        this.modoEscuro = false;
        document.body.classList.add('tema-claro');
      } else {
        this.modoEscuro = true;
        document.body.classList.remove('tema-claro');
      }
    }

    this.carregarDadosUsuario();
  }

  carregarDadosUsuario() {
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('tunify_user_info');
      const fotoSalva = localStorage.getItem('tunify_foto_perfil'); // 🚨 Tenta pegar a foto salva pelo Dashboard

      if (fotoSalva) {
        this.fotoPerfil = fotoSalva; // Foto carregada na hora!
      }

      if (userInfoStr) {
        try {
          const userObj = JSON.parse(userInfoStr);
          const email = userObj.email;
          
          if (userObj.nome) {
            this.nomeUsuario = userObj.nome;
          }

          if (email) {
            this.spotifyService.buscarResumoPerfil(email).subscribe({
              next: (resumo) => {
                this.nomeUsuario = resumo.dono_da_conta || this.nomeUsuario;
                if (resumo.foto_perfil) {
                  this.fotoPerfil = resumo.foto_perfil;
                  localStorage.setItem('tunify_foto_perfil', resumo.foto_perfil); // Salva/Atualiza
                }
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('[ERRO] Falha ao carregar perfil nas estatísticas', err);
                this.cdr.detectChanges();
              }
            });
          }
        } catch (e) {
          console.error('[ERRO] Falha ao ler tunify_user_info:', e);
        }
      }
    }
  }

  alternarTema() {
    this.modoEscuro = !this.modoEscuro;
    if (this.modoEscuro) {
      document.body.classList.remove('tema-claro');
      localStorage.setItem('tunify_tema', 'escuro');
    } else {
      document.body.classList.add('tema-claro');
      localStorage.setItem('tunify_tema', 'claro');
    }
  }

  fazerLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
