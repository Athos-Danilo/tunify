import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Ajuste o caminho se precisar
import { PrivacidadeComponent } from './pages/privacidade.component'; // Ajuste o caminho
import { TermosComponent } from './pages/termos.component'; // Ajuste o caminho

export const routes: Routes = [
  { path: '', component: HomeComponent }, // O caminho vazio '/' abre a Landing Page
  { path: 'privacidade', component: PrivacidadeComponent }, // '/privacidade' abre a política
  { path: 'termos', component: TermosComponent }, // '/termos' abre os termos
  { path: '**', redirectTo: '' } // Se o usuário digitar um link que não existe, joga ele pra Home
];
