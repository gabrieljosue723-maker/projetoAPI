import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environment/environmente";
import { LoginResponse, Usuario } from "../models/auth";

const CHAVE_TOKEN = 'produtos_app_token';

@Injectable({ providedIn: 'root' })
export class authService {
    private http = inject(HttpClient);
    private router = inject(Router);

    usuarioAtual = signal<Usuario | null>(null);

    estaAutenticado = computed(() => this.usuarioAtual() !== null);

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }).pipe(tap((resposta) => localStorage.setItem(CHAVE_TOKEN, resposta.access_token)));
    }

    registar(name: string, email: string, password: string, password_confirmation: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/register`, { name, email, password, password_confirmation })
            .pipe(tap((resposta) => localStorage.setItem(CHAVE_TOKEN, resposta.access_token)));
    }

    carregarPerfil(): Observable<Usuario> {
        return this.http.get<Usuario>(`${environment.apiUrl}/perfil`).pipe(tap((usuario) => this.usuarioAtual.set(usuario)));
    }

    logout(): void {
        this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
            next: () => this.limparSessaoESair(),
            error: () => this.limparSessaoESair(),
        })
    }

    limparSessaoESair(): void {
        localStorage.removeItem(CHAVE_TOKEN);
        this.usuarioAtual.set(null);
        this.router.navigate(['/login']);
    }

    obterToken(): string | null {
        return localStorage.getItem(CHAVE_TOKEN);
    }
}