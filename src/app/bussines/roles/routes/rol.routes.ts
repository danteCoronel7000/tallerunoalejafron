import { Routes } from '@angular/router';

export const ROL_ROUTES: Routes = [
      {
    path: 'roles',
    loadComponent: () => import('../components/layout/layout'),
  }
]