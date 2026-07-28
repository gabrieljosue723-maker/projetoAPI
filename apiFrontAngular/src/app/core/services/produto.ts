import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environment/environmente";
import { Produto } from "../models/produto";

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/produtos`;

    listar(): Observable<{ data: Produto[] }> {
        return this.http.get<{ data: Produto[] }>(this.baseUrl);
    }

    listarLixeira(): Observable<{ data: Produto[] }> {
        return this.http.get<{ data: Produto[] }>(`${this.baseUrl}/produtosDeletados`);
    }

    obter(id: number): Observable<{ data: Produto }> {
        return this.http.get<{ data: Produto }>(`${this.baseUrl}/show/${id}`);
    }

    criar(dados: {
        user_id: number;
        nome: string;
        descricao: string;
        preco: string;
        imagem: File;
    }): Observable<{ data: Produto }> {
        const formData = new FormData();
        formData.append('user_id', String(dados.user_id));
        formData.append('nome', dados.nome);
        formData.append('descricao', dados.descricao);
        formData.append('preco', String(dados.preco));
        formData.append('imagem', dados.imagem);

        return this.http.post<{ data: Produto }>(`${this.baseUrl}/store`, formData)
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