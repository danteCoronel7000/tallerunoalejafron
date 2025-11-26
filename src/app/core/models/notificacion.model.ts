export interface Notification {
  id: number;
  type: 'success' | 'error';
  title: string;
  message: string;
  show: boolean;
}