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
    nomeFicheiro = signal<string>('');

    formulario = this.fb.group({
        nome: ['', [Validators.required]],
        descricao: ['', [Validators.required]],
        preco: [null as number | null, [Validators.required, Validators.min(0)]],
        telefone: ['', [Validators.pattern(/^[0-9\s\-\+\(\)]{9,20}$/)]],
        whatsapp: ['', [Validators.pattern(/^[0-9\s\-\+\(\)]{9,20}$/)]],
        facebook: [''],
    });

    abrirSeletorFicheiro(): void {
        const input = document.getElementById('imagem') as HTMLInputElement;
        if (input) input.click();
    }

    aoEscolherFicheiro(evento: Event): void {
        const input = evento.target as HTMLInputElement;
        const ficheiro = input.files?.[0] ?? null;
        this.ficheiroImagem.set(ficheiro);
        this.nomeFicheiro.set(ficheiro ? ficheiro.name : '');
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

        const valores = this.formulario.getRawValue();

        this.aEnviar.set(true);
        this.mensagemErro.set(null);

        this.produtoService
            .criar({
                user_id: userId,
                nome: valores.nome!,
                descricao: valores.descricao!,
                preco: Number(valores.preco),
                telefone: valores.telefone || undefined,
                whatsapp: valores.whatsapp || undefined,
                facebook: valores.facebook || undefined,
                imagem: this.ficheiroImagem()!
            })
            .subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: (err: any) => {
                    this.aEnviar.set(false);
                    this.mensagemErro.set(err.error?.message || 'Não foi possível criar o produto. Confere os dados.');
                },
            });
    }
}