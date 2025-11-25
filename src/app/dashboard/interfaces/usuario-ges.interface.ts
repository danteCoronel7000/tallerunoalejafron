
export interface DatosPK {
    cedula: string;
}

export interface Datos {
    id: DatosPK;
}


export interface Personal {
    codp?: number;
    nombre: string;
    ap: string;
    am: string;
    estado: number;
    fnac: string;
    ecivil: string;
    genero: string;
    direc: string;
    telf: string;
    tipo: string;
    foto: string;
    datos: Datos;
}


export interface Usuario {
    login: string;
    password?: string;
    estado: number;
    personal: Personal;
    roles: Rol[];
}

export interface Rol {
    codr: number;
    nombre?: string;
}

export interface PageableResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}
