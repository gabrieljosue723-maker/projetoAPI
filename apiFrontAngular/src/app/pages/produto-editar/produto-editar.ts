import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto';

@Component({
    selector: 'app-produto-editar',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './produto-editar.html',
    styleUrl: './produto-editar.css',
})
export class ProdutoEditar implements OnInit {
    private fb = inject(FormBuilder);
    private produtoService = inject(ProdutoService);
    private router = inject(Router);

    private route = inject(ActivatedRoute);


    private produtoId = +this.route.snapshot.params['id'];

    aCarregar = signal(true);
    aGuardar = signal(false);
    mensagemErro = signal<string | null>(null);

    formulario = this.fb.group({
        nome: ['', [Validators.required]],
        descricao: ['', [Validators.required]],
        preco: [null as number | null, [Validators.required, Validators.min(0)]],

        imagem: ['', [Validators.required]],
    });

    ngOnInit(): void {

        this.produtoService.obter(this.produtoId).subscribe({
            next: (resposta) => {
                this.formulario.patchValue({
                    nome: resposta.data.nome,
                    descricao: resposta.data.descricao,
                    preco: resposta.data.preco,
                    imagem: resposta.data.imagem,
                });
                this.aCarregar.set(false);
            },
            error: () => {
                this.mensagemErro.set('Não foi possível carregar este produto.');
                this.aCarregar.set(false);
            },
        });
    }

    guardar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const { nome, descricao, preco, imagem } = this.formulario.getRawValue();

        this.aGuardar.set(true);
        this.produtoService
            .atualizar(this.produtoId, { nome: nome!, descricao: descricao!, preco: preco!, imagem: imagem! })
            .subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: () => {
                    this.aGuardar.set(false);
                    this.mensagemErro.set('Não foi possível guardar as alterações.');
                },
            });
    }
}