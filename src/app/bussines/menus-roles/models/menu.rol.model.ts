interface Menu {
  codm: number;
  nombre: string;
}

interface MenuDto {
  codm: number;
  nombre: string;
}

interface Rol {
  codr: number;
  nombre: string;
  estado: string;
}

interface MenuRol {
  codm: number;
  codr: number;
}

// En lugar de AsignarRolesUsuarioDTO
interface AsignarMenusRolDTO {
  rolId: number;
  menusIds: number[];
}