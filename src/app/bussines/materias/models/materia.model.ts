export interface MateriaDto{
    codmat: number;
    nombre: string;
    estado: number;
}

export interface UpdateMateriaRequest{
    nombre: string; // Si el backend espera "nombre" en lugar de "name"
}

export interface CreateMateriaRequest{
  name: string;
}

export interface CreateMateriaResponse{
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}


export interface MateriaModalState {
  isOpen: boolean;
  selectedMateria: MateriaDto | null;
  isLoading: boolean;
  error: string | null;
}