export interface Usuario {
  login: string;
  estado: string;
  password: string;
  codp: Persona;
}

export interface Rol {
  codr: number;
  nombre: string;
  estado: string;
}

export interface UsuRol{
  codr: number;
  login: string;
}

export interface Persona {
  codp: number;
  nombre: string;
  ap: string;
  am: string;
  estado: string;
  fna: string;
  ecivil: string;
  genero: string;
  direc: string;
  telf: string;
  tipo: string;
  foto: string;
}

export interface AsignarRolesUsuarioDTO {
  usuarioId: String;
  rolesIds: number[];
}


export interface UsuarioPageDto {
  login: string;
  estado: number;
  nombre: string;
  ap: string;
  am: string;
}
