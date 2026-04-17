import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common'; // O mágico do pontinho (4.422)
import { RouterModule } from '@angular/router'; // Para a setinha não quebrar

@Component({
  selector: 'app-minutes-listened',
  standalone: true, // Avisa que ele é independente
  imports: [DecimalPipe, RouterModule], // As ferramentas que o HTML precisa!
  templateUrl: './minutes-listened.component.html',
  styleUrls: ['./minutes-listened.component.scss']
})
export class MinutesListenedComponent {
  @Input() totalMinutos: number = 0;
}