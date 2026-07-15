import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-estatisticas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './estatisticas.component.html',
  styleUrls: ['./estatisticas.component.scss']
})
export class EstatisticasComponent implements OnInit {
  modoEscuro: boolean = true;

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
  }
}
