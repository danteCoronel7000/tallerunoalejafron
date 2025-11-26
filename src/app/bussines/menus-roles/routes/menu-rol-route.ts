import { Routes } from '@angular/router';

export const MENU_ROL_ROUTES: Routes = [
      {
    path: 'menus-roles',
    loadComponent: () => import('../components/layoutmr/layoutmr'),
  }
]