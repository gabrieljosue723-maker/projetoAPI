import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'Usados Úteis';
  private readonly router = inject(Router);
  readonly esconderLayout = computed(() => {
    const url = this.router.url;
    return url === '/login' || url.startsWith('/login/');
  });
}