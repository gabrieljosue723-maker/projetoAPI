import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { authService } from '../../core/services/auth';
import { CarrinhoService } from '../../core/services/carrinho';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(authService);
  carrinhoService = inject(CarrinhoService);

  ngOnInit(): void {
    if (this.authService.estaAutenticado()) {
      this.carrinhoService.carregar().subscribe();
    }
  }

  sair(): void {
    this.authService.logout();
  }
}
