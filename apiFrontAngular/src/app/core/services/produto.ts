import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environment/environmente";
import { Produto } from "../models/produto";

export interface FiltrosProduto {
    nome?: string;
    preco_min?: number | null;
    preco_max?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/produtos`;

    listar(filtros?: FiltrosProduto): Observable<{ data: Produto[] }> {
        let params = new HttpParams();

        if (filtros?.nome) {
            params = params.set('nome', filtros.nome);
        }
        if (filtros?.preco_min !== null && filtros?.preco_min !== undefined) {
            params = params.set('preco_min', filtros.preco_min);
        }
        if (filtros?.preco_max !== null && filtros?.preco_max !== undefined) {
            params = params.set('preco_max', filtros.preco_max);
        }

        return this.http.get<{ data: Produto[] }>(this.baseUrl, { params });
    }

    listarLixeira(): Observable<{ data: Produto[] }> {
        return this.http.get<{ data: Produto[] }>(`${this.baseUrl}/produtosDeletados`);
    }

    obter(id: number): Observable<{ data: Produto }> {
        return this.http.get<{ data: Produto }>(`${this.baseUrl}/show/${id}`);
    }

    criar(dados: { user_id: number; nome: string; descricao: string; preco: number; imagem: File }): Observable<any> {
        const formData = new FormData();
        formData.append('user_id', dados.user_id.toString());
        formData.append('nome', dados.nome);
        formData.append('descricao', dados.descricao);
        formData.append('preco', dados.preco.toString());
        formData.append('imagem', dados.imagem);

        return this.http.post(`${environment.apiUrl}/produtos`, formData);
    }
    atualizar(
        id: number,
        dados: { nome: string; descricao: string; preco: number; imagem: string }
    ): Observable<{ data: Produto }> {
        return this.http.put<{ data: Produto }>(`${this.baseUrl}/update/${id}`, dados)
    }

    apagar(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/delete/${id}`);
    }

    restaurar(id: number): Observable<{ data: Produto }> {
        return this.http.patch<{ data: Produto }>(`${this.baseUrl}/restore/${id}`, {})
    }

    apagarPermanente(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/deletarPermanente/${id}`);
    }
}