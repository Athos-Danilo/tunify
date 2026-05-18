import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // 🚨 Verifique se este caminho chega no seu auth.service.ts

export const authGuard: CanActivateFn = (route, state) => {
  // Injetamos as ferramentas que precisamos
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pergunta pro AuthService se o usuário tem o passaporte (token)
  if (authService.estaLogado()) {
    return true; // Passaporte carimbado, pode entrar na Área VIP!
  }

  // Se não tem o token, barra na porta e manda de volta pro Login
  console.warn('🚧 Acesso bloqueado pelo Guarda-Costas! Redirecionando para o login...');
  router.navigate(['/login']); 
  return false;
};