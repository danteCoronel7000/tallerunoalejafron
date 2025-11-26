import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notificacion.service';
import { Notification } from '../../models/notificacion.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacion',
  imports: [CommonModule],
  templateUrl: './notificacion.html',
  styleUrl: './notificacion.css'
})
export class Notificacion implements OnInit{
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  close(id: number) {
    this.notificationService.removeNotification(id);
  }

  getNotificationClass(notification: Notification): string {
    return `w-96 max-w-full ${notification.show ? 'slide-in' : 'slide-out'}`;
  }

  getCardClass(notification: Notification): string {
    const borderColor = notification.type === 'success' ? 'border-l-green-500' : 'border-l-red-500';
    return `bg-white ${borderColor} border-l-4 rounded-lg shadow-2xl p-4 flex items-start space-x-4`;
  }

  getIconBgClass(notification: Notification): string {
    const bgColor = notification.type === 'success' ? 'bg-green-100' : 'bg-red-100';
    return `${bgColor} rounded-full p-2 bounce-icon`;
  }

  getTitleClass(notification: Notification): string {
    const textColor = notification.type === 'success' ? 'text-green-800' : 'text-red-800';
    return `font-bold ${textColor} text-lg`;
  }

  getProgressBarClass(notification: Notification): string {
    const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return `h-full ${bgColor}`;
  }
}
