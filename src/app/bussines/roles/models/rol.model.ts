export interface Rol {
    codr: number;
    nombre: string;
    estado: string;
}

export interface Role {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateRoleRequest {
  name: string;
}

export interface CreateRoleResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}


export interface RolDto {
    codr: number;
    nombre: string;
    estado: number;
}

export interface UpdateRoleRequest {
  nombre: string; // Si el backend espera "nombre" en lugar de "name"
}

export interface RoleModalState {
  isOpen: boolean;
  selectedRole: RolDto | null;
  isLoading: boolean;
  error: string | null;
}