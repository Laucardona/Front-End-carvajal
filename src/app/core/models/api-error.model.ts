/**
 * Shape de error "de negocio" (404, 409, 500, etc.) usado por los
 * microservicios de Spring Boot del equipo.
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

/**
 * Shape de error "de validación" (400) — solo lo usa (por ahora)
 * carvajal-favorites. No trae `message` ni `path`, sino un mapa
 * `errors` con un mensaje por campo inválido.
 */
export interface ApiValidationErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  errors: Record<string, string>;
}

export type ApiErrorShape = ApiErrorResponse | ApiValidationErrorResponse;

/** True si el error trae el mapa `errors` por campo (shape de validación). */
export function isValidationError(
  err: unknown
): err is ApiValidationErrorResponse {
  return !!err && typeof err === 'object' && 'errors' in (err as Record<string, unknown>);
}
