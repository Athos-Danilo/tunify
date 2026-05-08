import { Routes } from '@angular/router';

// Imports das Telas (Components)
import { HomeComponent } from './pages/home/home.component'; 
import { PrivacidadeComponent } from './pages/privacidade/privacidade.component'; 
import { TermosComponent } from './pages/termos/termos.component'; 
import { ContatoComponent } from './pages/contato/contato.component'; 

// O Porteiro e a Área VIP
import { CallbackComponent } from './pages/callback/callback';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// 🚨 AQUI: Importação da nossa nova tela de configurações
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';

export const routes: Routes = [

  // ÁREA PÚBLICA (Qualquer um acessa)
  { path: '', component: HomeComponent }, // O caminho vazio '/' abre a Landing Page

  // Páginas do Rodapé
  { path: 'privacidade', component: PrivacidadeComponent }, // '/privacidade' abre a política
  { path: 'termos', component: TermosComponent }, // '/termos' abre os termos
  { path: 'contato', component: ContatoComponent }, // '/contato' abre os contatos

  // ---------------------------------------------------------
  // 🔑 AUTENTICAÇÃO (A Ponte Invisível)
  // ---------------------------------------------------------
  
  // '/callback' abre o Porteiro invisível que suga o token da URL
  { path: 'callback', component: CallbackComponent },

  // ---------------------------------------------------------
  // 🎧 ÁREA VIP (Logado com o Spotify)
  // ---------------------------------------------------------
  
  // '/dashboard' abre a tela oficial do Vibe Architect ( Área VIP)
  { path: 'dashboard', component: DashboardComponent },
  
  // 🚨 AQUI: '/configuracoes' abre a nossa nova tela do Modo de Contenção
  { path: 'configuracoes', component: ConfiguracoesComponent },

  // ---------------------------------------------------------
  // 🚧 SEGURANÇA (O Wildcard) - SEMPRE POR ÚLTIMO!
  // ---------------------------------------------------------
  
  // Se o usuário digitar qualquer link que não exista, joga ele pra Home
  { path: '**', redirectTo: '' } 
];