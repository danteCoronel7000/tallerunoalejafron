export interface ParaleloDto{
    codpar: number;
    nombre: string;
    estado: number;
}

export interface CreateParaleloRequest {
  name: string;
}

export interface CreateParaleloResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateParaleloRequest {
  nombre: string; // Si el backend espera "nombre" en lugar de "name"
}

export interface ParaleloModalState {
  isOpen: boolean;
  selectedParalelo: ParaleloDto | null;
  isLoading: boolean;
  error: string | null;
}