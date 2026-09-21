import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { isValidationError } from '../models/api-error.model';

/**
 * Normaliza los errores que devuelven los microservicios del equipo:
 *  - Errores de negocio (404/409/500...): { message, path, ... }
 *  - Errores de validación (400, hoy solo en favorites): { errors: { campo: mensaje } }
 *
 * En ambos casos muestra un toast con un mensaje legible y deja pasar
 * el error (el componente que llamó puede seguir manejándolo si necesita
 * algo más específico, p. ej. marcar un campo de formulario en rojo).
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const body = err.error;

        if (isValidationError(body)) {
          const primerMensaje = Object.values(body.errors)[0];
          toastService.mostrar(primerMensaje ?? 'Datos inválidos.', 'advertencia');
        } else if (body?.message) {
          toastService.mostrar(body.message, 'advertencia');
        } else if (err.status === 0) {
          // Típico de "cold start" de Render o problema de CORS/red.
          toastService.mostrar(
            'No se pudo contactar el servicio. Si es la primera petición del día puede tardar hasta 90s en responder — intenta de nuevo en un momento.',
            'advertencia'
          );
        } else {
          toastService.mostrar('Ocurrió un error inesperado. Intenta de nuevo.', 'advertencia');
        }
      }
      return throwError(() => err);
    })
  );
};
