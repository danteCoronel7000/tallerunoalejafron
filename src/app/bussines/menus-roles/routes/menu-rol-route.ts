import { Routes } from '@angular/router';

export const MENU_ROL_ROUTES: Routes = [
      {
    path: 'procesos-menus',
    loadComponent: () => import('../components/layoutmr/layoutmr'),
  }
]