import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para o [ngClass] funcionar

@Component({
  selector: 'app-card-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-perfil.component.html',
  styleUrls: ['./card-perfil.component.scss'] // ou styleUrl, dependendo da sua versão do Angular
})
export class CardPerfilComponent {
  // As três "portas de entrada" que conectamos lá no HTML do Dashboard
  @Input() nomeUsuario: string | null = '';
  @Input() dadosDemograficos: any = {};
  @Input() modoEscuro: boolean = true;
}