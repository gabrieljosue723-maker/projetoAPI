import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho';

@Component({
    selector: 'app-carrinho',
    standalone: true,
    imports: [DecimalPipe, RouterLink],
    templateUrl: './carrinho.html',
    styleUrl: './carrinho.css',
})
export class Carrinho implements OnInit {
    carrinhoService = inject(CarrinhoService);

    aCarregar = signal(true);
    mensagemErro = signal<string | null>(null);
    idsAAtualizar = signal<Set<number>>(new Set());

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.aCarregar.set(true);
        this.carrinhoService.carregar().subscribe({
            next: () => this.aCarregar.set(false),
            error: () => {
                this.mensagemErro.set('Não foi possível carregar o carrinho.');
                this.aCarregar.set(false);
            },
        });
    }

    alterarQuantidade(itemId: number, quantidadeAtual: number, delta: number): void {
        const novaQuantidade = quantidadeAtual + delta;
        if (novaQuantidade < 1) {
            return;
        }
        this.marcarAAtualizar(itemId, true);
        this.carrinhoService.atualizarQuantidade(itemId, novaQuantidade).subscribe({
            next: () => this.marcarAAtualizar(itemId, false),
            error: () => {
                this.mensagemErro.set('Não foi possível atualizar a quantidade.');
                this.marcarAAtualizar(itemId, false);
            },
        });
    }

    remover(itemId: number): void {
        this.marcarAAtualizar(itemId, true);
        this.carrinhoService.remover(itemId).subscribe({
            next: () => this.marcarAAtualizar(itemId, false),
            error: () => {
                this.mensagemErro.set('Não foi possível remover o item.');
                this.marcarAAtualizar(itemId, false);
            },
        });
    }

    limparCarrinho(): void {
        this.carrinhoService.limpar().subscribe({
            error: () => this.mensagemErro.set('Não foi possível esvaziar o carrinho.'),
        });
    }

    private marcarAAtualizar(itemId: number, ativo: boolean): void {
        const atual = new Set(this.idsAAtualizar());
        ativo ? atual.add(itemId) : atual.delete(itemId);
        this.idsAAtualizar.set(atual);
    }
}
