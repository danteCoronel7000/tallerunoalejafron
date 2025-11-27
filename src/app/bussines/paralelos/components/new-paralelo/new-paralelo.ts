import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CreateParaleloRequest } from '../../models/paralelo.model';
import { ParaleloService } from '../../services/paralelo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-paralelo',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-paralelo.html',
  styleUrl: './new-paralelo.css'
})
export class NewParalelo {
  @Output() paraleloCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private paraleloService = inject(ParaleloService);


  paraleloName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isVisible: boolean = true;

  onSubmit(): void {
    if (!this.paraleloName.trim()) {
      this.errorMessage = 'El nombre del paralelo es requerido';
      return;
    }
    
    if (this.paraleloName.trim().length < 3) {
      this.errorMessage = 'El nombre del paralelo debe tener al menos 3 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const paraleloData: CreateParaleloRequest = {
      name: this.paraleloName.trim()
    };

    this.paraleloService.createParalelo(paraleloData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.paraleloName = '';
        this.paraleloCreated.emit();
        this.closeModal();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear el paralelo. Por favor, intente nuevamente.';
        console.error('Error creating paralelo:', error);
      }
    });
  }

  onCancel(): void {
    this.paraleloName = '';
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
    this.paraleloName = '';
    this.errorMessage = '';
  }
}