import { Routes } from '@angular/router';

// Imports das Telas (Components)
import { HomeComponent } from './pages/home/home.component'; 
import { PrivacidadeComponent } from './pages/privacidade/privacidade.component'; 
import { TermosComponent } from './pages/termos/termos.component'; 
import { ContatoComponent } from './pages/contato/contato.component'; 

// O Porteiro e a Área VIP
import { CallbackComponent } from './pages/callback/callback';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConfiguracoesComponent } from './pages/configuracoes/configuracoes.component';
import { EstatisticasComponent } from './pages/estatisticas/estatisticas.component';

// 🚨 IMPORTA O SEU GUARD AQUI (Verifique se o caminho da pasta está correto!)
import { authGuard } from './core/guards/auth.guard'; 

export const routes: Routes = [
  // ÁREA PÚBLICA 
  { path: '', component: HomeComponent },
  { path: 'privacidade', component: PrivacidadeComponent },
  { path: 'termos', component: TermosComponent },
  { path: 'contato', component: ContatoComponent },

  // AUTENTICAÇÃO
  { path: 'callback', component: CallbackComponent },
  
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },

  // ---------------------------------------------------------
  // 🎧 ÁREA VIP (Protegida pelo authGuard)
  // ---------------------------------------------------------
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // 🚨 TRANCA O DASHBOARD
  },
  { 
    path: 'configuracoes', 
    component: ConfiguracoesComponent,
    canActivate: [authGuard] // 🚨 TRANCA AS CONFIGURAÇÕES
  },
  { 
    path: 'estatisticas', 
    component: EstatisticasComponent,
    canActivate: [authGuard] // 🚨 TRANCA AS ESTATÍSTICAS
  },

  // ---------------------------------------------------------
  // 🚧 SEGURANÇA (O Wildcard) - SEMPRE POR ÚLTIMO!
  // ---------------------------------------------------------
  { path: '**', redirectTo: '' }
];