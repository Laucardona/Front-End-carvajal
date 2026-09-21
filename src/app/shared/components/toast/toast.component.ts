import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="ecommerce-toast-container">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="ecommerce-toast ecommerce-toast--{{ toast.tipo }} mostrar"
      >
        {{ toast.mensaje }}
      </div>
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
