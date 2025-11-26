import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  showSuccess(title: string, message: string) {
    this.addNotification('success', title, message);
  }

  showError(title: string, message: string) {
    this.addNotification('error', title, message);
  }

  private addNotification(type: 'success' | 'error', title: string, message: string) {
    const notification: Notification = {
      id: this.nextId++,
      type,
      title,
      message,
      show: false
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Trigger animation
    setTimeout(() => {
      const notifications = this.notificationsSubject.value;
      const index = notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        notifications[index].show = true;
        this.notificationsSubject.next([...notifications]);
      }
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(id: number) {
    const notifications = this.notificationsSubject.value;
    const index = notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      notifications[index].show = false;
      this.notificationsSubject.next([...notifications]);

      setTimeout(() => {
        const updatedNotifications = this.notificationsSubject.value.filter(n => n.id !== id);
        this.notificationsSubject.next(updatedNotifications);
      }, 500);
    }
  }
}