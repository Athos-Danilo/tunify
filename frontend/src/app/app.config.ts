import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// Ele vai importar as rotas do seu arquivo app.routes.ts
import { routes } from './app.routes'; 

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};