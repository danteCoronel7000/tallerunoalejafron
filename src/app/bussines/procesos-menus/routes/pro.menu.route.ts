import { Routes } from '@angular/router';

export const PRO_MENU_ROUTES: Routes = [
      {
    path: 'procesos-menus',
    loadComponent: () => import('../components/layout/layout'),
  }
]