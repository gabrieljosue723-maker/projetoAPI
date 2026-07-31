import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environmente';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
    private http = inject(HttpClient);

    listar(filtros?: { nome?: string; preco_min?: number | null; preco_max?: number | null }): Observable<any> {
        let url = `${environment.apiUrl}/produtos`;
        const params = new URLSearchParams();
        if (filtros?.nome) params.append('nome', filtros.nome);
        if (filtros?.preco_min !== null && filtros?.preco_min !== undefined) params.append('preco_min', filtros.preco_min.toString());
        if (filtros?.preco_max !== null && filtros?.preco_max !== undefined) params.append('preco_max', filtros.preco_max.toString());

        const query = params.toString();
        if (query) url += '?' + query;

        return this.http.get(url);
    }

    criar(dados: {
        user_id: number;
        nome: string;
        descricao: string;
        preco: number;
        telefone?: string;
        whatsapp?: string;
        facebook?: string;
        imagem: File
    }): Observable<any> {
        const formData = new FormData();
        formData.append('user_id', dados.user_id.toString());
        formData.append('nome', dados.nome);
        formData.append('descricao', dados.descricao);
        formData.append('preco', dados.preco.toString());
        if (dados.telefone) formData.append('telefone', dados.telefone);
        if (dados.whatsapp) formData.append('whatsapp', dados.whatsapp);
        if (dados.facebook) formData.append('facebook', dados.facebook);
        formData.append('imagem', dados.imagem);

        return this.http.post(`${environment.apiUrl}/produtos/store`, formData);  // <-- MUDOU AQUI
    }

    meusProdutos(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/meus-produtos`);
    }

    obter(id: number): Observable<any> {
        return this.http.get(`${environment.apiUrl}/produtos/${id}`);
    }

    atualizar(id: number, dados: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/produtos/${id}`, dados);
    }

    apagar(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/produtos/${id}`);
    }

    listarLixeira(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/produtos/lixeira`);
    }

    restaurar(id: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}/produtos/${id}/restaurar`, {});
    }

    apagarPermanente(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/produtos/${id}/permanente`);
    }
}