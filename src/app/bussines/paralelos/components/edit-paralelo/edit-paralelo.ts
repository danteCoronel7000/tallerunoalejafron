import { Component, computed, inject, signal } from '@angular/core';
import { UpdateParaleloRequest } from '../../models/paralelo.model';
import { ParaleloService } from '../../services/paralelo.service';
import { ParaleloStateService } from '../../services/paralelo.state.service';

@Component({
  selector: 'app-edit-paralelo',
  imports: [],
  templateUrl: './edit-paralelo.html',
  styleUrl: './edit-paralelo.css'
})
export class EditParalelo {
  paraleloState = inject(ParaleloStateService);
  paraleloService = inject(ParaleloService);

  // Signal local para el nombre
  paraleloName = signal('');

  // Computed para validación - solo para edición
  isFormValid = computed(() => this.paraleloName().trim().length >= 3);

  constructor() {
    // Inicializar el form con los datos del paralelo seleccionado
    const selectedParalelo = this.paraleloState.selectedParalelo();
    if (selectedParalelo) {
      this.paraleloName.set(selectedParalelo.nombre);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.paraleloState.setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validar que tenemos un paralelo seleccionado
    const selectedParalelo = this.paraleloState.selectedParalelo();
    if (!selectedParalelo) {
      this.paraleloState.setError('No se ha seleccionado un paralelo para editar');
      return;
    }

    this.paraleloState.setLoading(true);

    try {
      const paraleloData: UpdateParaleloRequest = {
        nombre: this.paraleloName().trim()
      };

      const paraleloId = selectedParalelo.codpar;
      await this.paraleloService.updateParalelo(paraleloId, paraleloData).toPromise();

      this.paraleloState.closeModal();
      
      // Opcional: Emitir evento de actualización exitosa
      // this.paraleloState.paraleloUpdated.emit();
      
    } catch (error: any) {
      this.paraleloState.setError(
        error.error?.message || 'Error al actualizar el paralelo'
      );
    }
  }

  closeModal(): void {
    this.paraleloState.closeModal();
  }
}
