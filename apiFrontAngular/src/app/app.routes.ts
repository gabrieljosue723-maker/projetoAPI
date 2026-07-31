import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth';

export const routes: Routes = [

    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    },
    {
        path: 'registar',
        loadComponent: () => import('./pages/registar/registar').then((m) => m.Registar),
    },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
        path: 'produtos/novo',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/produto-form/produto-form').then((m) => m.ProdutoForm),
    },
    {
        path: 'produtos/:id/editar',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./pages/produto-editar/produto-editar').then((m) => m.ProdutoEditar),
    },
    {
        path: 'lixeira',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/lixeira/lixeira').then((m) => m.Lixeira),
    },

    { path: '**', redirectTo: 'home' },
];