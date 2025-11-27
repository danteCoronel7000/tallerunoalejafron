import { Routes } from '@angular/router';

export const MATERIAS_ROUTES: Routes = [
      {
    path: 'materias',
    loadComponent: () => import('../components/layoutmat/layoutmat'),
  }
]