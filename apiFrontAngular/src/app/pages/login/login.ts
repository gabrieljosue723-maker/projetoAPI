import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { authService } from '../../core/services/auth';
import { CarrinhoService } from '../../core/services/carrinho';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private fb = inject(FormBuilder);
    private authService = inject(authService);
    private carrinhoService = inject(CarrinhoService);
    private router = inject(Router);

    mensagemErro = signal<string | null>(null);
    aEnviar = signal(false);


    formulario = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    entrar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.mensagemErro.set(null);
        this.aEnviar.set(true);

        const { email, password } = this.formulario.getRawValue();

        this.authService.login(email!, password!).subscribe({
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
                this.mensagemErro.set(
                    erro.status === 401
                        ? 'Email ou password incorretos.'
                        : 'Não foi possível ligar à API. Verifica se ela está a correr.'
                );
            },
        });
    }
}