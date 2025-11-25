import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {

 private readonly router = inject(Router);
   authService = inject(AuthService);

/*
   irAGestionarUsuarios():void {
         this.router.navigate(['/gestion-usuarios']);
    }

  irAGestionarRoles() {
    this.router.navigate(['/dashboard/roles']);
  }

  irAReportes() {
    this.router.navigate(['/dashboard/reportes']);
  }*/
}
