export function formatCOP(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

export function generarId(prefijo: string): string {
  return prefijo + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

export function imagenURL(seed: string, w = 640, h = 640): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
