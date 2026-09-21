import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ShippingService } from '../../core/services/shipping.service';
import { ToastService } from '../../core/services/toast.service';
import { City } from '../../core/models/product.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private shippingService = inject(ShippingService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  ciudades: City[] = this.shippingService.listarCiudades();

  nombre = '';
  correo = '';
  documento = '';
  ciudad = '';
  clave = '';
  error = '';
  cargando = false;

  constructor() {
    if (this.userService.usuarioActual()) {
      this.router.navigate(['/perfil']);
    }
  }

  enviar(): void {
    this.error = '';
    this.cargando = true;
    this.userService
      .registrar({
        nombre: this.nombre.trim(),
        correo: this.correo.trim(),
        clave: this.clave.trim(),
        ciudad: this.ciudad,
        documento: this.documento.trim(),
      })
      .subscribe({
        next: () => {
          this.cargando = false;
          this.toastService.mostrar('Cuenta creada. ¡Bienvenido a E-commerce!', 'exito');
          setTimeout(() => this.router.navigateByUrl('/'), 500);
        },
        error: (err) => {
          this.cargando = false;
          this.error = err?.error || 'No fue posible crear la cuenta.';
        },
      });
  }
}
