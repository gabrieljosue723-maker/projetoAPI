import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
        const tokenSalvo = localStorage.getItem(CHAVE_TOKEN);
        const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

        if (tokenSalvo && usuarioSalvo) {
            try {
                const usuario = JSON.parse(usuarioSalvo);
                this.usuarioAtual.set(usuario);
            } catch {
                this.limparSessaoESair();
            }
        } else if (tokenSalvo) {
            // Tem token mas não tem usuário - carrega do servidor
            this.carregarPerfil().subscribe({
                error: () => this.limparSessaoESair()
            });
        }
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }).pipe(
            tap((resposta) => {
                localStorage.setItem(CHAVE_TOKEN, resposta.access_token);
                this.carregarPerfil().subscribe();
            })
        );
    }

    registar(name: string, email: string, password: string, password_confirmation: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(`${environment.apiUrl}/register`, { name, email, password, password_confirmation })
            .pipe(
                tap((resposta) => {
                    localStorage.setItem(CHAVE_TOKEN, resposta.access_token);
                    this.carregarPerfil().subscribe();
                })
            );
    }

    carregarPerfil(): Observable<Usuario> {
        const token = this.obterToken();
        const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
        
        return this.http.get<Usuario>(`${environment.apiUrl}/perfil`, { headers }).pipe(
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