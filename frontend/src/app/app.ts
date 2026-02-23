import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',  // <-- Ajustado para o nome do seu arquivo
  styleUrl: './app.scss'      // <-- Ajustado para o nome do seu arquivo
})
export class App {            // <-- Aqui estava AppComponent, agora é só App!
  title = 'Tunify';

  fazerLogin() {
    // Redireciona o usuário para a porta do seu backend
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login';
  }
}