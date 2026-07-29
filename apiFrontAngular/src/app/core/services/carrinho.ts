import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environmente';
import { ItemCarrinho, RespostaCarrinho } from '../models/carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/carrinho`;

    itens = signal<ItemCarrinho[]>([]);
    total = signal(0);

    // Soma das quantidades de todos os itens, usada no badge do carrinho na navbar.
    quantidadeTotal = computed(() =>
        this.itens().reduce((soma, item) => soma + item.quantidade, 0)
    );

    carregar(): Observable<RespostaCarrinho> {
        return this.http.get<RespostaCarrinho>(this.baseUrl).pipe(
            tap((resposta) => {
                this.itens.set(resposta.data);
                this.total.set(resposta.total);
            })
        );
    }

    adicionar(produtoId: number, quantidade: number = 1): Observable<ItemCarrinho> {
        return this.http
            .post<ItemCarrinho>(`${this.baseUrl}/adicionar`, {
                produto_id: produtoId,
                quantidade,
            })
            .pipe(tap(() => this.carregar().subscribe()));
    }

    atualizarQuantidade(id: number, quantidade: number): Observable<ItemCarrinho> {
        return this.http
            .put<ItemCarrinho>(`${this.baseUrl}/atualizar/${id}`, { quantidade })
            .pipe(tap(() => this.carregar().subscribe()));
    }

    remover(id: number): Observable<{ message: string }> {
        return this.http
            .delete<{ message: string }>(`${this.baseUrl}/remover/${id}`)
            .pipe(tap(() => this.carregar().subscribe()));
    }

    limpar(): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/limpar`).pipe(
            tap(() => {
                this.itens.set([]);
                this.total.set(0);
            })
        );
    }
}
