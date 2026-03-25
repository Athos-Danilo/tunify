import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Importando o módulo de rotas
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // A casca fica vazia mesmo! Toda a lógica pesada foi pra sua Home.
}