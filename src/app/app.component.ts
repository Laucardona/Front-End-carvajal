import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent, WhatsappButtonComponent],
  template: `
    <header>
      <app-header></app-header>
    </header>
    <router-outlet></router-outlet>
    <app-whatsapp-button></app-whatsapp-button>
    <app-toast></app-toast>
  `,
})
export class AppComponent {
  title = 'ecommerce';
}
