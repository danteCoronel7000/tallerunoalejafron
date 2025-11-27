import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsignarRolesUsuarioDTO, Usuario, UsuarioPageDto, UsuRol } from '../../models/roles.usuarios.model';
import { RolesUsuariosService } from '../../services/roles.usuarios.service';
import { UsuariosService } from '../../../../dashboard/services/usuarios-dash.service';
import { RoleService } from '../../../roles/services/rol.service';
import { RolDto } from '../../../roles/models/rol.model';
import { NotificationService } from '../../../../core/service/notificacion.service';
import { Notificacion } from '../../../../core/models/notificacion.model';
import Swal from 'sweetalert2';

type EstadoFiltro = 'todos' | 'asignados' | 'noasignados' | 'usuario';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {

  // listas
  listUsuarios: UsuarioPageDto[] = [];
  listRoles: RolDto[] = [];
  private contadorId = 1;
  notificaciones: Notificacion[] = [];

  estadoSeleccionado: EstadoFiltro = 'todos';
  errorMessage = '';
  rolesDelUsuario = new Set<number>(); // IDs de roles que pertenecen al usuario seleccionado
  rolesUsuarioSeleccionado: number[] = []; // IDs de roles del usuario seleccionado

  // selecciones y relaciones
  usuarioSeleccionado: string | null = null;
  rolesSeleccionados: Set<number> = new Set<number>();

  // paginación usuarios
  currentPageUsuarios = 0;
  pageSizeUsuarios = 3;
  totalPagesUsuarios = 0;
  totalElementsUsuarios = 0;
  isFirstUsuarios = true;
  isLastUsuarios = false;
  userSortBy: string = 'login';
  userSortDir: string = 'asc';

  // paginación roles
  currentPageRoles = 0;
  pageSizeRoles = 3;
  totalPagesRoles = 0;
  totalElementsRoles = 0;
  isFirstRoles = true;
  isLastRoles = false;
  rolSortBy: string = 'codr';
  rolSortDir: string = 'asc';

  // servicios
  usuarioRolService = inject(RolesUsuariosService);
  usuarioService = inject(UsuariosService);
  rolService = inject(RoleService);
  notificationService = inject(NotificationService)
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // no debes depender del constructor para lógica compleja; usamos ngOnInit
    this.getUsuarios();
    this.getRoles();
  }

  // === llamadas al backend ===
  getUsuarios(): void {
    this.usuarioService.getUsuariosPaginadosDto(
      this.currentPageUsuarios,
      this.pageSizeUsuarios,
      this.userSortBy,
      this.userSortDir
    ).subscribe({
      next: (response) => {
        this.listUsuarios = response.content;
        this.totalPagesUsuarios = response.totalPages;
        this.totalElementsUsuarios = response.totalElements;
        this.isFirstUsuarios = response.first;
        this.isLastUsuarios = response.last;
        // si estás en OnPush y no se actualiza la vista:
        this.cdr.detectChanges();
        console.log('Página recibida de usuarios:', response);
      },
      error: (err) => console.error('Error al obtener usuarios', err),
    });
  }

  getRoles(): void {
    this.rolService.getRolesPaginados(
      this.currentPageRoles,
      this.pageSizeRoles,
      this.rolSortBy,
      this.rolSortDir
    ).subscribe({
      next: (response) => {
        this.listRoles = response.content || [];
        this.totalPagesRoles = response.totalPages ?? 0;
        this.totalElementsRoles = response.totalElements ?? 0;
        this.isFirstRoles = response.first ?? (this.currentPageRoles === 0);
        this.isLastRoles = response.last ?? (this.currentPageRoles >= (this.totalPagesRoles - 1));
        this.cdr.detectChanges();
        console.log('Página recibida de roles:', response);
      },
      error: (err) => console.error('Error al obtener roles', err),
    });
  }

  // === trackBy para ngFor ===
  trackByLogin(index: number, item: UsuarioPageDto) {
    return item.login;
  }



  // === selección usuario ===
  seleccionarUsuario(login: string): void {
    this.usuarioSeleccionado = login;
    // Luego marcar los del usuario
    setTimeout(() => {
      this.estadoSeleccionado = 'usuario';
      this.filtrarByEstado('usuario');
    }, 100);
  }

  // === toggle roles seleccionados (Set) ===
  toggleSeleccionRol(codr: number): void {
    if (this.rolesSeleccionados.has(codr)) {
      this.rolesSeleccionados.delete(codr);
    } else {
      this.rolesSeleccionados.add(codr);
    }
    // detectChanges en caso de OnPush
    this.cdr.detectChanges();
  }

  // === paginación usuarios: ahora llama a getUsuarios() ===
  cambiarPaginaUsuarios(page: number): void {
    if (page >= 0 && page < this.totalPagesUsuarios) {
      this.currentPageUsuarios = page;
      this.getUsuarios();
    }
  }

  cambiarPageSizeUsuarios(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSizeUsuarios = parseInt(target.value, 10);
      this.currentPageUsuarios = 0;
      this.getUsuarios();
    }
  }

  // === paginación roles (ya estaba bien, lo dejamos) ===
  cambiarPaginaRoles(page: number): void {
    if (page >= 0 && page < this.totalPagesRoles) {
      this.currentPageRoles = page;
      this.getRoles();
    }
  }

  cambiarPageSizeRoles(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSizeRoles = parseInt(target.value, 10);
      this.currentPageRoles = 0;
      this.getRoles();
    }
  }

  asignarRolesAUsuario() {
    if (!this.usuarioSeleccionado || this.rolesSeleccionados.size === 0) {
      console.log('Debe seleccionar un usuario y al menos un rol');
      return;
    }
    const dto: AsignarRolesUsuarioDTO = {
      usuarioId: this.usuarioSeleccionado,
      rolesIds: Array.from(this.rolesSeleccionados)
    };

    this.usuarioRolService.asignarRoles(dto).subscribe({
      next: () => {
        console.log("Roles asignados correctamente");
        Swal.fire(
          '¡Exito!',
          `Roles asignados correctamente.`,
          'success'
        );
      },
      error: (err) => {
        console.error("Error asignando roles:", err);
        // ❌ LLAMAR NOTIFICACIÓN DE ERROR
        Swal.fire('Error', 'Fallo al asignar roles al usuario.', 'error');
      }
    });
  }

  // Método opcional para limpiar selección
  limpiarSeleccion() {
    this.usuarioSeleccionado = null;
    this.rolesSeleccionados.clear();
  }
  desasignarRolesAUsuario() {
    if (!this.usuarioSeleccionado || this.rolesSeleccionados.size === 0) {
      console.log('Debe seleccionar un usuario y al menos un rol');
      return;
    }

    // Confirmación antes de desasignar
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a desasignar los roles seleccionados del usuario",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dto: AsignarRolesUsuarioDTO = {
          usuarioId: this.usuarioSeleccionado!,
          rolesIds: Array.from(this.rolesSeleccionados)
        };

        this.usuarioRolService.desasignarRoles(dto).subscribe({
          next: () => {
            console.log("Roles desasignados correctamente");
            Swal.fire(
              '¡Éxito!',
              `Roles desasignados correctamente.`,
              'success'
            );
            this.limpiarSeleccion();
          },
          error: (err) => {
            console.error("Error desasignando roles:", err);
            Swal.fire('Error', 'Fallo al desasignar roles al usuario.', 'error');
          }
        });
      }
    });
  }
  onEnterFiltroRol(valor: string) {
    this.rolService.buscarRoles(valor).subscribe({
      next: (roles) => {
        this.listRoles = roles
        this.cdr.detectChanges(); // fuerza renderizado
      },
      error: (error) => {
        console.error('Error al buscar roles:', error);
      }
    });
  }

  onEnterFiltroUsu(valor: string) {
    console.log("valro:::: ", valor)
    this.usuarioRolService.buscarUsuarios(valor).subscribe({
      next: (usuarios) => {
        this.listUsuarios = [...usuarios]; // fuerza cambio
        console.log('usu busc: ', usuarios)
        console.log('usu busc: ', this.listUsuarios)
        this.cdr.detectChanges(); // fuerza renderizado
      },
      error: (error) => {
        console.error('Error al buscar usuarios:', error);
      }
    });
  }

  // Método principal mejorado con switch
  filtrarByEstado(estado: EstadoFiltro): void {
    this.estadoSeleccionado = estado;
    this.errorMessage = '';

    switch (estado) {
      case 'todos':
        this.getRoles();
        break;

      case 'asignados':
        this.getRolesAsignados();
        break;

      case 'noasignados':
        this.getRolesNoAsignados();
        break;

      case 'usuario':
        if (this.usuarioSeleccionado) {
          this.getRolesByUsuario(this.usuarioSeleccionado);
        } else {
          this.errorMessage = 'Por favor, seleccione un usuario primero';
        }
        break;

      default:
        this.getRoles();
    }
  }

  // Verificar si un rol está seleccionado/marcado
  isRolMarcado(codr: number): boolean {
    return this.rolesUsuarioSeleccionado.includes(codr);
  }

  // Obtener roles asignados a cualquier usuario
  private getRolesAsignados(): void {
    this.usuarioRolService.getRolesAssignedToAnyUser().subscribe({
      next: (data) => {
        this.listRoles = data;
        console.log('obtenidos asignados:', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener roles asignados:', error);
        this.errorMessage = 'Error al cargar los roles asignados';
      }
    });
  }

   // Obtener roles NO asignados a ningún usuario
  private getRolesNoAsignados(): void {
    this.usuarioRolService.getUnassignedRoles().subscribe({
      next: (data) => {
        this.listRoles = data;
        console.log('obtenidos NO asignado :', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener roles no asignados:', error);
        this.errorMessage = 'Error al cargar los roles no asignados';
      }
    });
  }

  // Obtener roles de un usuario específico
  private getRolesByUsuario(login: string): void {
    this.usuarioRolService.getRolesForUser(login).subscribe({
      next: (data) => {
        this.listRoles = data;
        console.log('obtenidos asignado a user:', data);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener roles del usuario:', error);
        this.errorMessage = `Error al cargar los roles del usuario ${login}`;
      }
    });
  }

  // TrackBy para optimizar el renderizado
  trackByCodr(index: number, rol: RolDto): number {
    return rol.codr;
  }

  // Verificar si un rol pertenece al usuario seleccionado
  esRolDelUsuario(codr: number): boolean {
    return this.rolesDelUsuario.has(codr);
  }
}


