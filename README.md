# E-commerce (Angular)

Tienda online de implementos deportivos convertida a Angular 19 (standalone
components) a partir del proyecto original en HTML/CSS/JS puro. Simula 5
microservicios (usuarios, productos, pedidos, pagos, notificaciones) más
envíos, cupones, reseñas, lista de deseos, historial y devoluciones — todo
persistido en `localStorage`, igual que el proyecto original.

## Cómo ejecutarlo

```bash
npm install
npm start
```

Abre http://localhost:4200

## Estructura

```
src/app/
├── core/
│   ├── data/seed-data.ts        Catálogo, ciudades y cupones semilla
│   ├── models/product.model.ts  Interfaces del dominio
│   ├── services/                Los "microservicios" (Injectables de Angular)
│   └── guards/auth.guard.ts     Protege rutas que requieren sesión
├── shared/components/           Header, tarjeta de producto, estrellas,
│                                 botón de WhatsApp, toasts
└── pages/                       Home, producto, login, registro, perfil,
                                  carrito, checkout
```

## Notas

- El logo y las fotos son provisionales (picsum.photos), igual que en el
  proyecto original — reemplázalos antes de producción.
- El número de WhatsApp (`NUMERO_WHATSAPP_TIENDA` en `seed-data.ts`) es de
  ejemplo.
- Todo el "backend" sigue simulado con `localStorage`; en una versión real
  cada servicio de `core/services` llamaría a una API (por ejemplo Spring
  Boot) en lugar de leer/escribir localStorage directamente.
