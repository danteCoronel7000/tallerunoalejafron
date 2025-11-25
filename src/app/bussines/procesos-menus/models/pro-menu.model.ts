interface Menu {
  codm: number;
  nombre: string;
}

interface Proceso {
  codp: number;
  nombre: string;
  enlace: string;
  ayuda: string;
  estado: number;
}

interface MenuProceso {
  codm: number;
  codp: number;
}