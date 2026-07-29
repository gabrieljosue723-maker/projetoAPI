import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { authService } from '../../core/services/auth';
import { CarrinhoService } from '../../core/services/carrinho';

function passwordsIguaisValidator(grupo: AbstractControl): ValidationErrors | null {
    const password = grupo.get('password')?.value;
    const confirmacao = grupo.get('password_confirmation')?.value;
    return password === confirmacao ? null : { passwordsDiferentes: true };
}

@Component({
    selector: 'app-registar',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './registar.html',
    styleUrl: './registar.css',
})
export class Registar {
    private fb = inject(FormBuilder);
    private authService = inject(authService);
    private carrinhoService = inject(CarrinhoService);
    private router = inject(Router);

    mensagemErro = signal<string | null>(null);
    aEnviar = signal(false);

    formulario = this.fb.group(
        {
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', [Validators.required]],
        },
        { validators: passwordsIguaisValidator }
    );

    criarConta(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.mensagemErro.set(null);
        this.aEnviar.set(true);

        const { name, email, password, password_confirmation } = this.formulario.getRawValue();

        this.authService
            .registar(name!, email!, password!, password_confirmation!)
            .subscribe({
                next: () => {
                    this.authService.carregarPerfil().subscribe({
                        next: () => {
                            this.carrinhoService.carregar().subscribe();
                            this.aEnviar.set(false);
                            this.router.navigate(['/home']);
                        },
                        error: () => {
                            this.aEnviar.set(false);
                            this.router.navigate(['/home']);
                        },
                    });
                },
                error: (erro) => {
                    this.aEnviar.set(false);
                    if (erro.status === 422 && erro.error?.errors?.email) {
                        this.mensagemErro.set('Este email já está registado.');
                    } else if (erro.status === 422) {
                        this.mensagemErro.set('Verifica os dados preenchidos.');
                    } else {
                        this.mensagemErro.set(
                            'Não foi possível ligar à API. Verifica se ela está a correr.'
                        );
                    }
                },
            });
    }
}
