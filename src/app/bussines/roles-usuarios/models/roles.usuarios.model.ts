interface Usuario {
  login: string;
  estado: string;
  password: string;
  codp: number;
  persona?: Persona;
  selected?: boolean;
}

interface Rol {
  codr: number;
  nombre: string;
  estado: string;
  selected?: boolean;
}

interface Persona {
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