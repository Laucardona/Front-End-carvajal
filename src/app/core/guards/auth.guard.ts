import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const usuario = userService.usuarioActual();
  if (usuario) return true;

  toastService.mostrar('Debes iniciar sesión para continuar.', 'advertencia');
  return router.createUrlTree(['/login'], { queryParams: { volver: state.url } });
};
