import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { authService } from '../services/auth';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService2 = inject(authService);
    const token = authService2.obterToken();

    const pedido = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next(pedido).pipe(
        catchError((erro) => {
            if (erro.status === 401) {
                authService2.limparSessaoESair();
            }
            return throwError(() => erro);
        })
    )
}

