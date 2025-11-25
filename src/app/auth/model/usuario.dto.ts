import { Proceso } from "./usuario.model";

export interface UsuarioDTO {
  login: string;
  passwd: string;
  estado: number;
}

export interface RolesDTO {
  codr: number;
  nombre: string;
  estado: number;
  menus: string[]; // nombres de menús
}

export interface MenusDTO {
  codm: number;
  nombre: string;
  estado: number;
  procesos: Proceso[];
}
