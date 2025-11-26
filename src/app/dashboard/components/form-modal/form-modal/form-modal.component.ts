import { Component, input, output, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rol, Usuario } from '../../../interfaces/usuario-ges.interface';
import { UsuariosService } from '../../../services/usuarios-dash.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-modal.component.html',
})
export class FormModalComponent implements OnInit {
  usuario = input<Usuario | null>(null);
  close = output<Usuario | null>();

  private readonly fb = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);

  myForm!: FormGroup;
  rolesDisponibles: Rol[] = [
    { codr: 1, nombre: 'ADMIN' },
    { codr: 2, nombre: 'MAESTRO' },
    { codr: 3, nombre: 'ALUMNO' },
  ];

  generos = [
    { key: 'M', value: 'Masculino' },
    { key: 'F', value: 'Femenino' },
  ];
  estadosCivil = [
    { key: 'S', value: 'Soltero' },
    { key: 'C', value: 'Casado' },
  ];
  tiposPersonal = [
    { key: 'M', value: 'Maestro' },
    { key: 'Admin', value: 'Administrador' },
    { key: 'A', value: 'Alumno' },
  ];

  ngOnInit(): void {
    this.myForm = this.buildForm();
  }

  private mapTipoToRole(tipoPersonal: string): { codr: number }[] {
    switch (tipoPersonal) {
      case 'Admin':
        return [{ codr: 1 }];
      case 'M':
        return [{ codr: 2 }];
      case 'A':
        return [{ codr: 3 }];
      default:
        return [];
    }
  }

  buildForm(): FormGroup {
    return this.fb.group({
      personal: this.fb.group({
        nombre: ['', [Validators.required]],
        ap: ['', [Validators.required]],
        am: ['', [Validators.required]],
        fnac: ['', [Validators.required]],
        ecivil: ['S', [Validators.required]],
        genero: ['M', [Validators.required]],
        direc: [''],
        tipo: ['M'],
        estado: [1, [Validators.required]],
        foto: [''],

        datos: this.fb.group({
          id: this.fb.group({
            cedula: [
              '',
              [Validators.required, Validators.pattern(/^\d{6,10}$/)],
            ],
          }),
        }),
      }),
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      Swal.fire(
        'Atención',
        'Por favor, complete todos los campos requeridos.',
        'warning'
      );
      return;
    }

    const formValue = this.myForm.getRawValue();
    const rolesArray = this.mapTipoToRole(formValue.personal.tipo);

    const usuarioFinal: Usuario = {
      estado: 1,

      personal: {
        ...formValue.personal,
        direc: formValue.personal.direc || '',
      },
      roles: rolesArray,
    } as Usuario;


    this.usuariosService.crearUsuario(usuarioFinal).subscribe({
      next: (response) => {
        Swal.fire(
          '¡Éxito!',
          `Usuario ${response.personal.nombre} creado. Ahora puede usar el botón del candado para asignar credenciales.`,
          'success'
        );
        this.close.emit(response);
      },
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Ocurrió un error desconocido al crear el usuario.';
        console.error('Error de Creación:', err);
        Swal.fire('Error', `Fallo al crear usuario: ${errorMessage}`, 'error');
      },
    });
  }

  onClose() {
    this.close.emit(null);
  }
}


/*const formValue = this.myForm.getRawValue();
    const rolesArray = this.mapTipoToRole(formValue.personal.tipo);*/
