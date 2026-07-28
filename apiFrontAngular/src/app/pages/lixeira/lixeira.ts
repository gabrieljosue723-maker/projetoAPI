import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProdutoService } from '../../core/services/produto';
import { Produto } from '../../core/models/produto';

@Component({
    selector: 'app-lixeira',
    standalone: true,
    imports: [DecimalPipe],
    templateUrl: './lixeira.html',
    styleUrl: './lixeira.css',
})
export class Lixeira implements OnInit {
    private produtoService = inject(ProdutoService);

    produtos = signal<Produto[]>([]);
    aCarregar = signal(true);
    mensagemErro = signal<string | null>(null);

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.aCarregar.set(true);
        this.produtoService.listarLixeira().subscribe({
            next: (resposta) => {
                this.produtos.set(resposta.data);
                this.aCarregar.set(false);
            },
            error: () => {
                this.mensagemErro.set('Não foi possível carregar a lixeira.');
                this.aCarregar.set(false);
            },
        });
    }

    restaurar(produto: Produto): void {
        this.produtoService.restaurar(produto.id).subscribe({
            next: () => {
                this.produtos.update((lista) => lista.filter((p) => p.id !== produto.id));
            },
            error: () => this.mensagemErro.set('Não foi possível restaurar o produto.'),
        });
    }

    apagarPermanente(produto: Produto): void {
        if (!confirm(`Apagar "${produto.nome}" definitivamente? Esta ação não tem volta a trás.`)) {
            return;
        }

        this.produtoService.apagarPermanente(produto.id).subscribe({
            next: () => {
                this.produtos.update((lista) => lista.filter((p) => p.id !== produto.id));
            },
            error: () => this.mensagemErro.set('Não foi possível apagar o produto definitivamente.'),
        });
    }
}