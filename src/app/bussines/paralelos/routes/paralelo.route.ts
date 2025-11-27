import { Routes } from '@angular/router';

export const PARALELO_ROUTES: Routes = [
      {
    path: 'paralelos',
    loadComponent: () => import('../components/paralelo/paralelo'),
  }
]