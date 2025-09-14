import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let notification of getNotifications()"
        class="notification"
        [ngClass]="'notification-' + notification.type"
        (click)="removeNotification(notification.id)">

        <div class="notification-icon">
          <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
        </div>

        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>

        <button
          mat-icon-button
          class="close-button"
          (click)="removeNotification(notification.id)"
          [attr.aria-label]="'Cerrar notificación'">
          <mat-icon>close</mat-icon>
        </button>

        <div class="progress-bar" [style.animation-duration]="notification.duration + 'ms'"></div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      width: 100%;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      position: relative;
      overflow: hidden;
      min-height: 64px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .notification:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-1px);
    }

    .notification-success {
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
    }

    .notification-error {
      background: linear-gradient(135deg, #f44336, #e53935);
      color: white;
    }

    .notification-warning {
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
    }

    .notification-info {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    .notification-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }

    .notification-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .notification-message {
      font-size: 12px;
      opacity: 0.9;
      line-height: 1.3;
      word-wrap: break-word;
    }

    .close-button {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
      margin: -4px;
    }

    .close-button mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.7;
    }

    .close-button:hover mat-icon {
      opacity: 1;
    }

    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      animation: progress-countdown linear;
      transform-origin: left;
    }

    @keyframes progress-countdown {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    /* Mobile responsive */
    @media (max-width: 480px) {
      .notifications-container {
        bottom: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .notification {
        padding: 12px;
        margin-bottom: 8px;
      }

      .notification-title {
        font-size: 13px;
      }

      .notification-message {
        font-size: 11px;
      }
    }
  `]
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);

  getNotifications() {
    return this.notificationService.getNotifications();
  }

  getIcon(type: string): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type as keyof typeof icons] || 'info';
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
