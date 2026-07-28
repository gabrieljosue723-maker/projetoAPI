import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProdutoService } from '../../core/services/produto';
import { authService } from '../../core/services/auth';
import { Produto } from '../../core/models/produto';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterLink, DecimalPipe],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
    private produtoService = inject(ProdutoService);
    private authServiceInst = inject(authService);

    get nomeUtilizador(): string {
        return this.authServiceInst.usuarioAtual()?.name ?? 'Utilizador';
    }

    todosOsProdutos = signal<Produto[]>([]);
    aCarregar = signal(true);
    mensagemErro = signal<string | null>(null);


    meusProdutos = computed(() => {
        const meuEmail = this.authServiceInst.usuarioAtual()?.email;
        return this.todosOsProdutos().filter((produto) => produto.user.email === meuEmail);
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.aCarregar.set(true);
        this.produtoService.listar().subscribe({
            next: (resposta) => {
                this.todosOsProdutos.set(resposta.data);
                this.aCarregar.set(false);
            },
            error: () => {
                this.mensagemErro.set('Não foi possível carregar os teus produtos.');
                this.aCarregar.set(false);
            },
        });
    }

    apagar(produto: Produto): void {
        if (!confirm(`Enviar "${produto.nome}" para a lixeira?`)) return;

        this.produtoService.apagar(produto.id).subscribe({
            next: () => {
                this.todosOsProdutos.update((lista) => lista.filter((p) => p.id !== produto.id));
            },
            error: () => this.mensagemErro.set('Não foi possível apagar o produto.'),
        });
    }
}