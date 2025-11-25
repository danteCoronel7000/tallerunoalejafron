import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'core-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  authService = inject(AuthService);
  router = inject(Router);

  onLogout() {
    this.authService.logout();
    // Redirigir al login después de cerrar sesión
    this.router.navigate(['/auth/login']);
  }
}
