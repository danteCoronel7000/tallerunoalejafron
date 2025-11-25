export interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
  estado: number;
}

export interface Menu {
  codm: number;
  nombre: string;
  estado: number;
  procesos?: Proceso[];
}

export interface Rol {
  codr: number;
  nombre: string;
  estado: number;
  menus?: Menu[];
}

export interface Usuario {
  cedula: number;
  login: string;
  password: string;
  estado: number;
  token?: string | null;   // Devuelto por /api/login
  roles?: Rol[];
  personal?: Personal | null;          // Según tu mapeo ManyToMany
}

export interface Datos {
  codp?: number;
  cedula: string;
}

export interface Personal {
  codp?: number;
  nombre: string;
  ap?: string;
  am?: string;
  estado: number;      // 1=activo, 0=nulo
  fnac: string;        // ISO string (YYYY-MM-DD)
  ecivil: string;      // 1 char
  genero: string;      // M/F (1 char)
  direc?: string;
  telf?: string;
  tipo: string;        // E=Estudiante, P=Profesor
  foto?: string;       // ruta relativa "fotos/xxx.jpg"
}
