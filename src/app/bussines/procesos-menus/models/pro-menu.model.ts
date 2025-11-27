export interface Menu {
  codm: number;
  nombre: string;
}

export interface MenuDto {
  codm: number;
  nombre: string;
  estado: number;
}

export interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
  ayuda: string;
  estado: number;
}


export interface ProcesoDto {
  codp: number;
  nombre: string;
  enlace: string;
  ayuda: string;
  estado: number;
}

export interface MenuProceso {
  codm: number;
  codp: number;
}

export interface AsignarProcesosMenuDTO {
  menuId: number;
  procesosIds: number[];
}