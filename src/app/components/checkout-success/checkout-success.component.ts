import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  template: `
    <div class="success-container">
      <mat-card class="success-card">
        <mat-card-content>
          <div class="success-header">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <h1>¡Pago Exitoso!</h1>
            <p class="success-subtitle">Tu pedido ha sido procesado correctamente</p>
          </div>

          <div class="order-details" *ngIf="orderId && total">
            <h3>Detalles del Pedido</h3>
            <div class="detail-row">
              <span class="label">Número de pedido:</span>
              <span class="value">{{ orderId }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total pagado:</span>
              <span class="value total-amount">\${{ total?.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fecha:</span>
              <span class="value">{{ currentDate | date:'medium' }}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>¿Qué sigue?</h3>
            <ul>
              <li>
                <mat-icon>email</mat-icon>
                Recibirás un email de confirmación en los próximos minutos
              </li>
              <li>
                <mat-icon>local_shipping</mat-icon>
                Tu pedido será procesado y enviado en 1-2 días hábiles
              </li>
              <li>
                <mat-icon>track_changes</mat-icon>
                Podrás rastrear tu pedido desde tu cuenta
              </li>
            </ul>
          </div>

          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="continueShopping()">
              <mat-icon>store</mat-icon>
              Continuar Comprando
            </button>

            <button mat-stroked-button (click)="viewOrders()">
              <mat-icon>receipt_long</mat-icon>
              Ver Mis Pedidos
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 20px;
      background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
    }

    .success-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    .success-header {
      margin-bottom: 32px;
    }

    .success-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      color: #4caf50;
      margin-bottom: 16px;
    }

    .success-header h1 {
      color: #2e7d32;
      margin: 16px 0 8px 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .success-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .order-details {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 24px;
      margin: 24px 0;
      text-align: left;
      border: 1px solid #e0e0e0;
    }

    .order-details h3 {
      margin: 0 0 16px 0;
      color: #333;
      text-align: center;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    .value {
      font-weight: 600;
      color: #333;
    }

    .total-amount {
      color: #4caf50;
      font-size: 1.2rem;
    }

    .next-steps {
      margin: 32px 0;
      text-align: left;
    }

    .next-steps h3 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .next-steps ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .next-steps li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      color: #555;
    }

    .next-steps mat-icon {
      color: #4caf50;
      flex-shrink: 0;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 32px;
    }

    .action-buttons button {
      min-width: 180px;
      height: 48px;
    }

    @media (max-width: 600px) {
      .success-container {
        padding: 12px;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .action-buttons button {
        width: 100%;
        max-width: 300px;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId: string | null = null;
  total: number | null = null;
  currentDate = new Date();

  ngOnInit() {
    // Get query parameters
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
    const totalParam = this.route.snapshot.queryParamMap.get('total');
    this.total = totalParam ? parseFloat(totalParam) : null;

    // If no order data, redirect to home
    if (!this.orderId || !this.total) {
      this.router.navigate(['/']);
    }
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  viewOrders() {
    // For now, redirect to home. In a real app, this would go to orders page
    this.router.navigate(['/']);
  }
}
