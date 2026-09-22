export function formatCOP(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

export function generarId(prefijo: string): string {
  return prefijo + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}

export function imagenURL(valor: string, w = 640, h = 640): string {
  // Si ya es una URL real (imagen de un producto real, como la de
  // Productos-M), se usa tal cual. Si es solo una palabra/seed (como
  // las de los productos de ejemplo), se genera una imagen placeholder.
  if (/^https?:\/\//i.test(valor)) return valor;
  return `https://picsum.photos/seed/${encodeURIComponent(valor)}/${w}/${h}`;
}