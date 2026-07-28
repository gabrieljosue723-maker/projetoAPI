import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProdutoService } from '../../core/services/produto';
import { Produto } from '../../core/models/produto';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [DecimalPipe],
    templateUrl: './home.html',
    styleUrl: './home.css',
})

export class Home implements OnInit {
    private produtoService = inject(ProdutoService);

    produtos = signal<Produto[]>([]);
    aCarregar = signal(true);
    mensagemErro = signal<string | null>(null);

    ngOnInit(): void {
        this.produtoService.listar().subscribe({
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