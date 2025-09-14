import { Injectable, signal } from '@angular/core';
import { timer } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  // Readonly signal para que los componentes puedan suscribirse
  public readonly notifications$ = this.notifications.asReadonly();

  /**
   * Muestra una notificación de éxito
   */
  showSuccess(title: string, message: string, duration: number = 5000): void {
    this.addNotification('success', title, message, duration);
  }

  /**
   * Muestra una notificación de error
   */
  showError(title: string, message: string, duration: number = 7000): void {
    this.addNotification('error', title, message, duration);
  }

  /**
   * Muestra una notificación de advertencia
   */
  showWarning(title: string, message: string, duration: number = 6000): void {
    this.addNotification('warning', title, message, duration);
  }

  /**
   * Muestra una notificación informativa
   */
  showInfo(title: string, message: string, duration: number = 5000): void {
    this.addNotification('info', title, message, duration);
  }

  /**
   * Agrega una nueva notificación
   */
  private addNotification(type: Notification['type'], title: string, message: string, duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    // Agregar la notificación
    this.notifications.update(notifications => [...notifications, notification]);

    // Auto-remover después del tiempo especificado
    timer(duration).subscribe(() => {
      this.removeNotification(notification.id);
    });
  }

  /**
   * Remueve una notificación específica
   */
  removeNotification(id: string): void {
    this.notifications.update(notifications =>
      notifications.filter(notification => notification.id !== id)
    );
  }

  /**
   * Obtiene todas las notificaciones actuales
   */
  getNotifications(): Notification[] {
    return this.notifications();
  }  /**
   * Remueve todas las notificaciones
   */
  clearAll(): void {
    this.notifications.set([]);
  }

  /**
   * Genera un ID único para las notificaciones
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Métodos específicos para el carrito de compras
   */
  showCartSuccess(productName: string, quantity: number): void {
    this.showSuccess(
      'Producto agregado',
      `${quantity}x ${productName} agregado al carrito`
    );
  }

  showCartRemoved(productName: string): void {
    this.showInfo(
      'Producto removido',
      `${productName} removido del carrito`
    );
  }

  showCartUpdated(productName: string, quantity: number): void {
    this.showInfo(
      'Carrito actualizado',
      `${productName} actualizado a ${quantity} unidades`
    );
  }

  showCartCleared(): void {
    this.showInfo(
      'Carrito vaciado',
      'Todos los productos han sido removidos'
    );
  }

  /**
   * Métodos específicos para el proceso de pago
   */
  showPaymentProcessing(): void {
    this.showInfo(
      'Procesando pago',
      'Por favor espera mientras procesamos tu pago...',
      3000
    );
  }

  showPaymentSuccess(total: number): void {
    this.showSuccess(
      'Pago exitoso',
      `Tu pago de $${total.toFixed(2)} ha sido procesado correctamente`
    );
  }

  showPaymentError(errorMessage: string = 'Error en el procesamiento del pago'): void {
    this.showError(
      'Error en el pago',
      errorMessage
    );
  }

  showPaymentCancelled(): void {
    this.showWarning(
      'Pago cancelado',
      'El proceso de pago ha sido cancelado'
    );
  }
}
