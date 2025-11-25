import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  public errorMessage: string | null = null;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.errorMessage = null;

    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: (resp) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage =
          'Credenciales incorrectas. Verifica tu usuario y contraseña.';
        console.error('Error de autenticación:', err);
      },
    });
  }
}
