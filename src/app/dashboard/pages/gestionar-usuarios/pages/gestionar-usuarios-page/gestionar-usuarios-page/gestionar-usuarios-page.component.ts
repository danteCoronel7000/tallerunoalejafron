import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableUsuariosComponent } from '../../../../../components/table-usuarios/table-usuarios.component';
import { FormModalComponent } from '../../../../../components/form-modal/form-modal/form-modal.component';
import { PasswordModalComponent } from '../../../../../components/password-modal/password-modal/password-modal.component';
import { Usuario } from '../../../../../interfaces/usuario-ges.interface';
import { UsuariosService } from '../../../../../services/usuarios-dash.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-usuarios-page',
  standalone: true,
  imports: [
    CommonModule,
    TableUsuariosComponent,
    FormModalComponent,
    PasswordModalComponent,
  ],
  templateUrl: './gestionar-usuarios-page.component.html',
})
export class GestionarUsuariosPageComponent implements OnInit {
  isOpenModal = signal(false);
  usuarios = signal<Usuario[]>([]);
  usuarioModal = signal<Usuario | null>(null);

  //para el filtro
  usuariosOriginal = signal<Usuario[]>([]);
  usuariosFiltrados = signal<Usuario[]>([]);

  isOpenPasswordModal = signal(false);
  loginToChangePassword = signal<string>('');

  // ⭐️ MODIFICACIÓN 2: Variables/Señales para guardar los valores de los filtros
  filtroTexto = signal<string>('');
  filtroTipo = signal<string>('T'); // T = Todos (Ajusta la inicialización si tu select tiene otro valor por defecto)
  filtroEstado = signal<string>('1'); // 1 = Activos (Según tu HTML: Activos, Bajas, Todos)

  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuariosOriginal.set(data);
        this.applyAllFilters();
        this.usuarios.set(data);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        if (err.status === 401) {
          localStorage.removeItem('token');
          Swal.fire(
            'Sesión Expirada',
            'Tu sesión no está activa o ha expirado. Por favor, vuelve a iniciar sesión.',
            'warning'
          );
          this.router.navigate(['/auth/login']);
          return;
        }
        Swal.fire('Error', 'Fallo al cargar la lista de usuarios.', 'error');
      },
    });
  }

  async onDeleteUsuario(login: string) {
    if (login.length === 0) return;

    const { isConfirmed } = await Swal.fire({
      title: '¿Desactivar Usuario?',
      html: `El usuario con **login: ${login}** será marcado como 'Desactivo'.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desactivar',
      cancelButtonText: 'Cancelar',
    });

    if (!isConfirmed) return;

    this.usuariosService.eliminarUsuario(login).subscribe({
      next: () => {
        Swal.fire(
          '¡Desactivado!',
          `Usuario ${login} desactivado correctamente.`,
          'success'
        );
        this.cargarUsuarios();
      },
      error: (err) => {
        const errorMessage =
          err.error?.message || 'Error al desactivar usuario.';
        Swal.fire('Error', `Fallo al desactivar: ${errorMessage}`, 'error');
      },
    });
  }

  async onActiveUsuario(login: string) {
    if (login.length === 0) return;

    const { isConfirmed } = await Swal.fire({
      title: '¿Activar Usuario?',
      html: `El usuario con **login: ${login}** será marcado como 'Activo'.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, Activar',
      cancelButtonText: 'Cancelar',
    });

    if (!isConfirmed) return;

    Swal.fire(
      '¡Activado!',
      `Usuario ${login} activado (Simulación, implementar API).`,
      'success'
    );
    this.cargarUsuarios();
  }

  // Botón (+) para crear nuevo usuario
  openNewUsuario() {
    const usuarioVacio: Usuario = {
      login: '',
      estado: 1,
      personal: {
        nombre: '',
        ap: '',
        am: '',
        estado: 1,
        fnac: '',
        ecivil: 'S',
        genero: 'M',
        direc: '',
        telf: '',
        tipo: 'A',
        foto: '',
        datos: { id: { cedula: '' } },
      },
      roles: [],
    };
    this.usuarioModal.set(usuarioVacio);
    this.isOpenModal.set(true);
  }

  // Botón (Lápiz) para modificar datos personales
  openUpdateUsuario(usuario: Usuario) {
    this.usuarioModal.set(usuario);
    this.isOpenModal.set(true);
  }

  closeModal(usuarioGuardado: Usuario | null = null) {
    this.isOpenModal.set(false);
    this.usuarioModal.set(null);
    if (usuarioGuardado) {
      this.cargarUsuarios();
    }
  }

  // Botón (Llave) para abrir modal de password
  openChangePasswordModal(login: string) {
    this.loginToChangePassword.set(login);
    this.isOpenPasswordModal.set(true);
  }

  // Cierre del modal de password
  closePasswordModal() {
    this.isOpenPasswordModal.set(false);
    this.loginToChangePassword.set('');
  }

  onChangePasswordSubmit(data: { login: string; newPassword: string }) {
    this.usuariosService
      .modificarPassword(data.login, data.newPassword)
      .subscribe({
        next: () => {
          Swal.fire(
            '¡Éxito!',
            `Contraseña de ${data.login} modificada correctamente.`,
            'success'
          );
          this.closePasswordModal();
        },
        error: (err) => {
          Swal.fire('Error', 'Fallo al modificar la contraseña.', 'error');
          console.error(err);
        },
      });
  }

  //filtro de busqued para nombre/apellido
  applyFilter(searchText: string): void {
    this.filtroTexto.set(searchText.trim());
    this.applyAllFilters();
  }

  //filtro para personal
  filterByType(tipo: string): void {
    this.filtroTipo.set(tipo);
    this.applyAllFilters();
  }

  //filtro por estado
  filterByStatus(estado: string): void {
    this.filtroEstado.set(estado);
    this.applyAllFilters();
  }

  applyAllFilters(): void {
    let filteredList = this.usuariosOriginal();

    const term = this.filtroTexto().toLowerCase();
    const estado = this.filtroEstado();
    const tipo = this.filtroTipo();

    if (term) {
      filteredList = filteredList.filter((user) => {
        const nombreCompleto = `${user.personal.nombre} ${user.personal.ap} ${user.personal.am}`;
        return nombreCompleto.toLowerCase().includes(term);
      });
    }

    if (estado !== 'T') {
      const estadoNum = parseInt(estado); // '1' o '0'
      filteredList = filteredList.filter((user) => user.estado === estadoNum);
    }

    if (tipo !== 'T') {
      filteredList = filteredList.filter((user) => user.personal.tipo === tipo);
    }

    this.usuariosFiltrados.set(filteredList);
  }
}
