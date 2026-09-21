import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  correo = '';
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
    this.userService.iniciarSesion(this.correo.trim(), this.clave).subscribe({
      next: (resultado) => {
        this.cargando = false;
        this.toastService.mostrar(`¡Hola de nuevo, ${resultado.usuario!.nombre.split(' ')[0]}!`, 'exito');
        const volver = this.route.snapshot.queryParamMap.get('volver');
        setTimeout(() => this.router.navigateByUrl(volver || '/'), 400);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error || 'No fue posible iniciar sesión.';
      },
    });
  }
}
