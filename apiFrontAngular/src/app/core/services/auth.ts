import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environment/environmente";
import { LoginResponse, Usuario } from "../models/auth";

const CHAVE_TOKEN = 'produtos_app_token';
const CHAVE_USUARIO = 'produtos_app_user';

@Injectable({ providedIn: 'root' })
export class authService {
    private http = inject(HttpClient);
    private router = inject(Router);

    usuarioAtual = signal<Usuario | null>(null);
    estaAutenticado = computed(() => this.usuarioAtual() !== null);

    constructor() {
        // Recupera sessão ao iniciar a app (F5 / atualizar página)
        const tokenSalvo = localStorage.getItem(CHAVE_TOKEN);
        const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);
        
        if (tokenSalvo && usuarioSalvo) {
            try {
                this.usuarioAtual.set(JSON.parse(usuarioSalvo));
            } catch {
                this.limparSessaoESair();
            }
        }
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }).pipe(
            tap((resposta) => {
                localStorage.setItem(CHAVE_TOKEN, resposta.access_token);
                // Se o backend retornar o usuário no login, guarda direto:
                if (resposta.user) {
                    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.user));
                    this.usuarioAtual.set(resposta.user);
                } else {
                    // Senão, carrega do perfil
                    this.carregarPerfil().subscribe();
                }
            })
        );
    }

    registar(name: string, email: string, password: string, password_confirmation: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/register`, { name, email, password, password_confirmation })
            .pipe(
                tap((resposta) => {
                    localStorage.setItem(CHAVE_TOKEN, resposta.access_token);
                    if (resposta.user) {
                        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.user));
                        this.usuarioAtual.set(resposta.user);
                    } else {
                        this.carregarPerfil().subscribe();
                    }
                })
            );
    }

    carregarPerfil(): Observable<Usuario> {
        return this.http.get<Usuario>(`${environment.apiUrl}/perfil`).pipe(
            tap((usuario) => {
                this.usuarioAtual.set(usuario);
                localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
            })
        );
    }

    logout(): void {
        this.http.post(`${environment.apiUrl}/logout`, {}).subscribe({
            next: () => this.limparSessaoESair(),
            error: () => this.limparSessaoESair(),
        });
    }

    limparSessaoESair(): void {
        localStorage.removeItem(CHAVE_TOKEN);
        localStorage.removeItem(CHAVE_USUARIO);
        this.usuarioAtual.set(null);
        this.router.navigate(['/login']);
    }

    obterToken(): string | null {
        return localStorage.getItem(CHAVE_TOKEN);
    }
}