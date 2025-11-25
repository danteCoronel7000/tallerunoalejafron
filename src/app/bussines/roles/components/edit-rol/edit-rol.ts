import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { RolDto, UpdateRoleRequest } from '../../models/rol.model';
import { RoleService } from '../../services/rol.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolStateService } from '../../services/rol.state.service';
import { RolUsuService } from '../../../../auth/services/rol-usu.service';

@Component({
  selector: 'app-edit-rol',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rol.html',
  styleUrl: './edit-rol.css'
})
export class EditRol {
roleState = inject(RolStateService);
  roleService = inject(RoleService);

  // Signal local para el nombre
  roleName = signal('');

  // Computed para validación - solo para edición
  isFormValid = computed(() => this.roleName().trim().length >= 3);

  constructor() {
    // Inicializar el form con los datos del rol seleccionado
    const selectedRole = this.roleState.selectedRole();
    if (selectedRole) {
      this.roleName.set(selectedRole.nombre);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.roleState.setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validar que tenemos un rol seleccionado
    const selectedRole = this.roleState.selectedRole();
    if (!selectedRole) {
      this.roleState.setError('No se ha seleccionado un rol para editar');
      return;
    }

    this.roleState.setLoading(true);

    try {
      const roleData: UpdateRoleRequest = {
        nombre: this.roleName().trim()
      };

      const roleId = selectedRole.codr;
      await this.roleService.updateRole(roleId, roleData).toPromise();

      this.roleState.closeModal();
      
      // Opcional: Emitir evento de actualización exitosa
      // this.roleState.roleUpdated.emit();
      
    } catch (error: any) {
      this.roleState.setError(
        error.error?.message || 'Error al actualizar el rol'
      );
    }
  }

  closeModal(): void {
    this.roleState.closeModal();
  }
}
