import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'E-commerce — Implementos deportivos para el eje cafetero' },
  { path: 'producto/:id', component: ProductDetailComponent, title: 'Producto — E-commerce' },
  { path: 'login', component: LoginComponent, title: 'Iniciar sesión — E-commerce' },
  { path: 'registro', component: RegisterComponent, title: 'Crear cuenta — E-commerce' },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard], title: 'Mi perfil — E-commerce' },
  { path: 'carrito', component: CartComponent, canActivate: [authGuard], title: 'Tu carrito — E-commerce' },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Pagar pedido — E-commerce' },
  { path: '**', redirectTo: '' },
];
