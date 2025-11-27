import { signal } from '@angular/core';
import { MateriaDto } from '../models/materia.model';

export const materiasMock = signal<MateriaDto[]>([
  { codmat: 101, nombre: 'Programación I', estado: 1 },
  { codmat: 102, nombre: 'Estructuras de Datos', estado: 1 },
  { codmat: 103, nombre: 'Arquitectura de Computadores', estado: 1 },
  { codmat: 104, nombre: 'Matemática Discreta', estado: 1 },
  { codmat: 105, nombre: 'Bases de Datos I', estado: 0 }
]);