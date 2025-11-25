import { Routes } from '@angular/router';

export const MENU_ROUTES: Routes = [
      {
    path: 'menus',
    loadComponent: () => import('../components/layout/layout'),
  }
]