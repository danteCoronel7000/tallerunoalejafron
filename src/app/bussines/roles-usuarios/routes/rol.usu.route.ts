import { Routes } from '@angular/router';

export const ROL_USU_ROUTES: Routes = [
      {
    path: 'roles-usuarios',
    loadComponent: () => import('../components/layout/layout'),
  }
]