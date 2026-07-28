import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto';
import { authService } from '../../core/services/auth';

@Component({
    selector: 'app-produto-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './produto-form.html',
    styleUrl: './produto-form.css',
})
export class ProdutoForm {
    private fb = inject(FormBuilder);
    private produtoService = inject(ProdutoService);
    private authService = inject(authService);
    private router = inject(Router);

    aEnviar = signal(false);
    mensagemErro = signal<string | null>(null);


    ficheiroImagem = signal<File | null>(null);

    formulario = this.fb.group({
        nome: ['', [Validators.required]],
        descricao: ['', [Validators.required]],
        preco: [null as string | null, [Validators.required, Validators.min(0)]],
    });

    aoEscolherFicheiro(evento: Event): void {
        const input = evento.target as HTMLInputElement;
        this.ficheiroImagem.set(input.files?.[0] ?? null);
    }

    guardar(): void {
        if (this.formulario.invalid || !this.ficheiroImagem()) {
            this.formulario.markAllAsTouched();
            if (!this.ficheiroImagem()) {
                this.mensagemErro.set('Escolhe uma imagem para o produto.');
            }
            return;
        }

        const userId = this.authService.usuarioAtual()?.id;
        if (!userId) {
            this.mensagemErro.set('Sessão inválida, faz login novamente.');
            return;
        }

        const { nome, descricao, preco } = this.formulario.getRawValue();

        this.aEnviar.set(true);
        this.mensagemErro.set(null);

        this.produtoService
            .criar({ user_id: userId, nome: nome!, descricao: descricao!, preco: preco!, imagem: this.ficheiroImagem()! })
            .subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: () => {
                    this.aEnviar.set(false);
                    this.mensagemErro.set('Não foi possível criar o produto. Confere os dados.');
                },
            });
    }
}