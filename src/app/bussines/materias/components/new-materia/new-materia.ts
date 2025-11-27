import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateMateriaRequest } from '../../models/materia.model';
import { MateriaService } from '../../services/materia.service';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-new-materia',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-materia.html',
  styleUrl: './new-materia.css'
})
export class NewMateria {
  @Output() materiaCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private materiaService = inject(MateriaService);
  private authService = inject(AuthService);

  materiaNombre: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isVisible: boolean = true;

  onSubmit(): void {
    if (!this.materiaNombre.trim()) {
      this.errorMessage = 'El nombre de la materia es requerido';
      return;
    }
    
    console.log('token: ', this.authService.getToken())
    
    if (this.materiaNombre.trim().length < 3) {
      this.errorMessage = 'El nombre de la materia debe tener al menos 3 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const materiaData: CreateMateriaRequest = {
      name: this.materiaNombre.trim()
    };

    this.materiaService.createMateria(materiaData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.materiaNombre = '';
        this.materiaCreated.emit();
        this.closeModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear la materia. Por favor, intente nuevamente.';
        console.error('Error creating materia:', error);
      }
    });
  }

  onCancel(): void {
    this.materiaNombre = '';
    this.errorMessage = '';
    this.cancel.emit();
    this.closeModal();
  }

  closeModal(): void {
    this.isVisible = false;
    // Opcional: Emitir evento cuando el modal se cierra completamente
    setTimeout(() => {
      this.cancel.emit();
    }, 300);
  }

  // Método para abrir el modal desde el componente padre
  open(): void {
    this.isVisible = true;
    this.materiaNombre = '';
    this.errorMessage = '';
  }
}
