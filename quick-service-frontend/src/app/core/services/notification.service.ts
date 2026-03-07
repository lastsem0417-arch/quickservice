import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationId = 0;

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  showSuccess(message: string, duration = 3000) {
    this.addNotification('success', message, duration);
  }

  showError(message: string, duration = 4000) {
    this.addNotification('error', message, duration);
  }

  showWarning(message: string, duration = 3500) {
    this.addNotification('warning', message, duration);
  }

  showInfo(message: string, duration = 3000) {
    this.addNotification('info', message, duration);
  }

  private addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number) {
    const id = this.notificationId++;
    const notification: Notification = { id, type, message, duration };

    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);

    // Auto-remove notification
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }
  }

  removeNotification(id: number) {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }
}
