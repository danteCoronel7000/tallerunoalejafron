
export interface Personal {
  codp: number;
  nombre: string;
  ap?: string;
  am?: string;
  estado: number;
  fnac: Date;
  ecivil: string;
  genero: string;
  direc?: string;
  telf?: string;
  tipo: string;
  foto?: string;
}

export interface Menu {
  codm: number;
  nombre: string;
  estado: number;
  procesos?: Proceso[];
}

export interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
  ayuda?: string;
  estado: number;
}

export interface Rol {
  codr: number;
  nombre: string;
  estado: number;
  menus: Menu[];
}

export interface Datos {
  codp: number;
  cedula: string;
}

export interface Usuario {
  login: string;
  estado: number;
  codp: number;
  personal: Personal;
  datos: Datos;
  roles: Rol[];
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}
