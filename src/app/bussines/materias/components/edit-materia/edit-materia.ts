import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateMateriaRequest } from '../../models/materia.model';
import { MateriaStateService } from '../../services/materia.state.service';
import { MateriaService } from '../../services/materia.service';

@Component({
  selector: 'app-edit-materia',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-materia.html',
  styleUrl: './edit-materia.css'
})
export class EditMateria {
  materiaState = inject(MateriaStateService);
  materiaService = inject(MateriaService);

  // Signal local para el nombre
  materiaNombre = signal('');

  // Computed para validación - solo para edición
  isFormValid = computed(() => this.materiaNombre().trim().length >= 3);

  constructor() {
    // Inicializar el form con los datos de la materia seleccionada
    const selectedMateria = this.materiaState.selectedMateria();
    if (selectedMateria) {
      this.materiaNombre.set(selectedMateria.nombre);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.materiaState.setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validar que tenemos una materia seleccionada
    const selectedMateria = this.materiaState.selectedMateria();
    if (!selectedMateria) {
      this.materiaState.setError('No se ha seleccionado una materia para editar');
      return;
    }

    this.materiaState.setLoading(true);

    try {
      const materiaData: UpdateMateriaRequest = {
        nombre: this.materiaNombre().trim()
      };

      const materiaId = selectedMateria.codmat;
      await this.materiaService.updateMateria(materiaId, materiaData).toPromise();

      this.materiaState.closeModal();
      
      // Opcional: Emitir evento de actualización exitosa
      // this.materiaState.materiaUpdated.emit();
      
    } catch (error: any) {
      this.materiaState.setError(
        error.error?.message || 'Error al actualizar la materia'
      );
    }
  }

  closeModal(): void {
    this.materiaState.closeModal();
  }
}
