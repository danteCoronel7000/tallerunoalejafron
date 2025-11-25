import { Component, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  // Es importante importar CommonModule y ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-modal.component.html',
})
export class PasswordModalComponent implements OnInit {
  // INPUT: Recibe el login del usuario a modificar
  login = input.required<string>();

  // OUTPUTS: Para cerrar el modal y para enviar el formulario
  close = output();
  submitPassword = output<{ login: string, newPassword: string }>();

  private readonly fb = inject(FormBuilder);

  myForm!: FormGroup;

  ngOnInit(): void {
    // Inicializar el formulario para el cambio de password
    this.myForm = this.fb.group({
      // El login se carga desde el Input y se hace de solo lectura
      login: [{ value: this.login(), disabled: true }, [Validators.required]],
      // Nuevo campo de contraseña
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      // Campo de confirmación (opcional, pero recomendado)
      confirmPassword: ['', [Validators.required]]
    }, {
      // Validator personalizado para chequear que ambas contraseñas coincidan
      validators: this.passwordMatchValidator
    });
  }

  // Validador personalizado para la coincidencia de contraseñas
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }


  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    // Antes de emitir, confirmar con SweetAlert
    const { isConfirmed } = await Swal.fire({
        title: 'Confirmar Cambio de Contraseña',
        html: `¿Está seguro de modificar la contraseña del usuario <b>${this.login()}</b>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Cambiar',
        cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;

    // Emitir el evento al componente padre
    this.submitPassword.emit({
      login: this.login(),
      newPassword: this.myForm.get('newPassword')?.value
    });

    // El padre se encargará de cerrar el modal después del éxito de la API.
  }

  // Helpers para manejo de errores (opcional, pero útil)
  isValidField(fieldName: string): boolean {
    return !!this.myForm.controls[fieldName].errors && this.myForm.controls[fieldName].touched;
  }
}
