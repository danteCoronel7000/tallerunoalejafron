import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario, Rol, Menu } from '../model/usuario.model';
import { RolesService } from './roles.service';

const LS_USER = 'app.user';
const LS_SELECTED_ROL = 'app.selectedRol';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  private readonly rolesSubject = new BehaviorSubject<Rol[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private readonly selectedRolSubject = new BehaviorSubject<Rol | null>(null);
  selectedRol$ = this.selectedRolSubject.asObservable();

  private readonly menusSubject = new BehaviorSubject<Menu[]>([]);
  menus$ = this.menusSubject.asObservable();

  constructor(private readonly rolesApi: RolesService) {
    // rehidratar desde localStorage
    const raw = localStorage.getItem(LS_USER);
    if (raw) {
      const u: Usuario = JSON.parse(raw);
      this.setUser(u, false);
      const savedRol = Number(localStorage.getItem(LS_SELECTED_ROL) ?? '0');
      if (savedRol) this.selectRol(savedRol);
    }
  }

  setUser(user: Usuario | null, persist = true) {
    this.userSubject.next(user);

    const roles: Rol[] = user?.roles ?? [];
    this.rolesSubject.next(roles);

    if (persist) {
      if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
      else localStorage.removeItem(LS_USER);
    }

    if (roles.length) {
      const saved = Number(localStorage.getItem(LS_SELECTED_ROL) ?? '0');
      this.selectRol(saved || roles[0].codr);
    } else {
      this.selectedRolSubject.next(null);
      this.menusSubject.next([]);
      localStorage.removeItem(LS_SELECTED_ROL);
    }
  }


  selectRol(codr: number) {
    const base = this.rolesSubject.value.find(r => r.codr === codr) || null;


    if (base?.menus?.length) {
      this.selectedRolSubject.next(base);
      this.menusSubject.next(base.menus);
      localStorage.setItem(LS_SELECTED_ROL, String(codr));
      return;
    }


    this.rolesApi.get(codr).subscribe({
      next: (rol) => {
        this.selectedRolSubject.next(rol);
        this.menusSubject.next(rol.menus ?? []);
        localStorage.setItem(LS_SELECTED_ROL, String(codr));
      },
      error: () => {

        this.selectedRolSubject.next(null);
        this.menusSubject.next([]);
        localStorage.removeItem(LS_SELECTED_ROL);
      }
    });
  }
}
