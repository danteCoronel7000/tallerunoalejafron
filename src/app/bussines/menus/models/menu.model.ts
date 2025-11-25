export interface Menu {
    codm: number;
    nombre: string;
    estado: string;
}

export interface Menu {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMenuRequest {
  name: string;
}

export interface CreateMenuResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuDto {
    codm: number;
    nombre: string;
    estado: number;
}

export interface UpdateMenuRequest {
  nombre: string; // Si el backend espera "nombre" en lugar de "name"
}

export interface MenuModalState {
  isOpen: boolean;
  selectedMenu: MenuDto | null;
  isLoading: boolean;
  error: string | null;
}