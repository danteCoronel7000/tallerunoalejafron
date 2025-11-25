import { Routes } from '@angular/router';
import { HomePageComponent } from './core/pages/home-page/home-page.component';
import { ContactosPageComponent } from './core/pages/contactos-page/contactos-page.component';
import { DashboardPageComponent } from './dashboard/pages/dashboard-page/dashboard-page.component';
import { TableUsuariosComponent } from './dashboard/components/table-usuarios/table-usuarios.component';
import { PasswordModalComponent } from './dashboard/components/password-modal/password-modal/password-modal.component';
import { FormModalComponent } from './dashboard/components/form-modal/form-modal/form-modal.component';
import { GestionarUsuariosPageComponent } from './dashboard/pages/gestionar-usuarios/pages/gestionar-usuarios-page/gestionar-usuarios-page/gestionar-usuarios-page.component';
import { ROL_ROUTES } from './bussines/roles/routes/rol.routes';
import { MENU_ROUTES } from './bussines/menus/routes/menu.route';
import { PRO_MENU_ROUTES } from './bussines/procesos-menus/routes/pro.menu.route';
import { ROL_USU_ROUTES } from './bussines/roles-usuarios/routes/rol.usu.route';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomePageComponent },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(
        (c) => c.LoginPageComponent
      ),
  },

  {
    path: 'dashboard',
    component: DashboardPageComponent,
    children: [
      ...ROL_ROUTES, // ahora SÍ es hijo dentro de dashboard
    ],
  },
  ...ROL_ROUTES, // ahora SÍ es hijo dentro de dashboard
  ...MENU_ROUTES,
  ...PRO_MENU_ROUTES,
  ...ROL_USU_ROUTES,

  { path: 'contactos', component: ContactosPageComponent },
  { path: 'gestion-usuarios', component: GestionarUsuariosPageComponent },
  { path: 'table-usuarios', component: TableUsuariosComponent },
  { path: 'password-modal', component: PasswordModalComponent },
  { path: 'form-modal', component: FormModalComponent },
];
