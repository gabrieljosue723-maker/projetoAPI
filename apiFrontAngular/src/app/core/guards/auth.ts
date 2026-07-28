import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
    const authService1 = inject(authService);
    const router = inject(Router);

    if (authService1.obterToken()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
