export interface Notificacion {
  id: number;
  tipo: 'success' | 'error';
  titulo: string;
  mensaje: string;
  visible: boolean;
}