import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { ProdutoService } from '../../core/services/produto';
import { Produto } from '../../core/models/produto';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DecimalPipe, FormsModule],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home implements OnInit {
    private produtoService = inject(ProdutoService);

    produtos = signal<Produto[]>([]);
    aCarregar = signal(true);
    mensagemErro = signal<string | null>(null);

    nomePesquisa = '';
    precoMin: number | null = null;
    precoMax: number | null = null;

    private pesquisaSubject = new Subject<void>();

    constructor() {
        this.pesquisaSubject.pipe(debounceTime(400)).subscribe(() => this.carregarProdutos());
    }

    ngOnInit(): void {
        this.carregarProdutos();
    }

    onPesquisaAlterada(): void {
        this.pesquisaSubject.next();
    }

    limparFiltros(): void {
        this.nomePesquisa = '';
        this.precoMin = null;
        this.precoMax = null;
        this.carregarProdutos();
    }

    carregarProdutos(): void {
        this.aCarregar.set(true);
        this.mensagemErro.set(null);

        this.produtoService
            .listar({
                nome: this.nomePesquisa || undefined,
                preco_min: this.precoMin,
                preco_max: this.precoMax,
            })
            .subscribe({
                next: (resposta) => {
                    this.produtos.set(resposta.data);
                    this.aCarregar.set(false);
                },
                error: () => {
                    this.mensagemErro.set('Não foi possível carregar os produtos.');
                    this.aCarregar.set(false);
                },
            });
    }
}