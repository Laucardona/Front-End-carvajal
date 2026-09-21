import { Component, Input } from '@angular/core';
import { NUMERO_WHATSAPP_TIENDA } from '../../../core/data/seed-data';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <a
      class="whatsapp-flotante"
      [href]="enlace"
      target="_blank"
      rel="noopener"
      title="Chatea con nosotros por WhatsApp"
    >
      <svg viewBox="0 0 32 32">
        <path
          d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.7a10.6 10.6 0 01-5.4-1.5l-.4-.2-4 1 1.1-3.9-.2-.4A10.7 10.7 0 1116 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6 0a8.6 8.6 0 01-2.5-1.6 9.6 9.6 0 01-1.8-2.2c-.2-.3 0-.5.1-.6l.5-.6.3-.5a.6.6 0 000-.5c-.1-.2-.7-1.7-1-2.3s-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.8.4A3.6 3.6 0 007 10.6a6.3 6.3 0 001.3 3.3 14.4 14.4 0 005.6 5c.8.3 1.4.5 1.9.7a4.5 4.5 0 002.1.1 3.5 3.5 0 002.3-1.6 2.8 2.8 0 00.2-1.6c-.1-.2-.3-.2-.6-.4z"
        />
      </svg>
    </a>
  `,
})
export class WhatsappButtonComponent {
  @Input() mensaje = 'Hola E-commerce, quiero hacer una consulta sobre un producto.';

  get enlace(): string {
    return `https://wa.me/${NUMERO_WHATSAPP_TIENDA}?text=${encodeURIComponent(this.mensaje)}`;
  }
}
