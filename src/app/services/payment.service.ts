import { Injectable } from '@angular/core';

export interface CardDetails {
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
}

export interface CustomerInfo {
  email: string;
  name: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  cardDetails?: CardDetails;
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
  processedAt?: Date;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
}

export interface PaymentValidationError {
  field: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  // Simulated failure rates for testing
  private readonly FAILURE_RATES = {
    credit_card: 0.15, // 15% failure rate
    debit_card: 0.10,  // 10% failure rate
    paypal: 0.05,      // 5% failure rate
    bank_transfer: 0.02 // 2% failure rate
  };

  // Simulated processing delays
  private readonly PROCESSING_DELAYS = {
    credit_card: 2000,    // 2 seconds
    debit_card: 1500,     // 1.5 seconds
    paypal: 3000,         // 3 seconds
    bank_transfer: 4000   // 4 seconds
  };

  constructor() {}

  /**
   * Simulates payment processing with various scenarios
   */
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // Validate payment data
      const validationErrors = this.validatePaymentData(paymentData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errorMessage: `Datos de pago inválidos: ${validationErrors.map(e => e.message).join(', ')}`,
          errorCode: 'VALIDATION_ERROR'
        };
      }

      // Simulate network delay
      const delay = this.PROCESSING_DELAYS[paymentData.paymentMethod];
      await this.sleep(delay);

      // Simulate different payment scenarios
      const scenario = this.determinePaymentScenario(paymentData);

      switch (scenario) {
        case 'success':
          return this.createSuccessResult(paymentData);

        case 'insufficient_funds':
          return {
            success: false,
            errorMessage: 'Fondos insuficientes en la cuenta',
            errorCode: 'INSUFFICIENT_FUNDS'
          };

        case 'card_declined':
          return {
            success: false,
            errorMessage: 'Tarjeta declinada por el banco emisor',
            errorCode: 'CARD_DECLINED'
          };

        case 'expired_card':
          return {
            success: false,
            errorMessage: 'La tarjeta ha expirado',
            errorCode: 'EXPIRED_CARD'
          };

        case 'invalid_cvv':
          return {
            success: false,
            errorMessage: 'CVV inválido',
            errorCode: 'INVALID_CVV'
          };

        case 'network_error':
          return {
            success: false,
            errorMessage: 'Error de conectividad con el banco',
            errorCode: 'NETWORK_ERROR'
          };

        case 'fraud_detected':
          return {
            success: false,
            errorMessage: 'Transacción bloqueada por seguridad. Contacte a su banco.',
            errorCode: 'FRAUD_DETECTED'
          };

        case 'processing_error':
          return {
            success: false,
            errorMessage: 'Error en el procesamiento del pago',
            errorCode: 'PROCESSING_ERROR'
          };

        default:
          return this.createSuccessResult(paymentData);
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        errorMessage: 'Error interno del servidor de pagos',
        errorCode: 'INTERNAL_ERROR'
      };
    }
  }

  /**
   * Validates payment data before processing
   */
  private validatePaymentData(paymentData: PaymentData): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    // Validate amount
    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push({ field: 'amount', message: 'Monto inválido' });
    }

    if (paymentData.amount > 10000) {
      errors.push({ field: 'amount', message: 'Monto excede el límite permitido' });
    }

    // Validate card details for card payments
    if (paymentData.paymentMethod.includes('card') && paymentData.cardDetails) {
      const card = paymentData.cardDetails;

      if (!card.number || !/^\d{16}$/.test(card.number)) {
        errors.push({ field: 'cardNumber', message: 'Número de tarjeta inválido' });
      }

      if (!card.cvv || !/^\d{3,4}$/.test(card.cvv)) {
        errors.push({ field: 'cvv', message: 'CVV inválido' });
      }

      // Check if card is expired
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (card.expiryYear < currentYear ||
          (card.expiryYear === currentYear && card.expiryMonth < currentMonth)) {
        errors.push({ field: 'expiry', message: 'Tarjeta expirada' });
      }
    }

    // Validate customer info
    if (!paymentData.customerInfo.email || !this.isValidEmail(paymentData.customerInfo.email)) {
      errors.push({ field: 'email', message: 'Email inválido' });
    }

    return errors;
  }

  /**
   * Determines payment scenario based on various factors
   */
  private determinePaymentScenario(paymentData: PaymentData): string {
    const random = Math.random();

    // Special test scenarios based on card numbers or amounts
    if (paymentData.cardDetails) {
      const cardNumber = paymentData.cardDetails.number;

      // Test cards for specific scenarios
      if (cardNumber === '4000000000000002') return 'card_declined';
      if (cardNumber === '4000000000000069') return 'expired_card';
      if (cardNumber === '4000000000000127') return 'invalid_cvv';
      if (cardNumber === '4000000000000119') return 'processing_error';
      if (cardNumber === '4000000000000259') return 'fraud_detected';
    }

    // Amount-based scenarios
    if (paymentData.amount > 9999.99) return 'insufficient_funds';
    if (paymentData.amount === 13.13) return 'network_error';

    // Random failures based on payment method
    const failureRate = this.FAILURE_RATES[paymentData.paymentMethod];

    if (random < failureRate) {
      // Randomly select a failure type
      const failureTypes = [
        'insufficient_funds', 'card_declined', 'network_error',
        'processing_error', 'fraud_detected'
      ];

      const failureIndex = Math.floor(Math.random() * failureTypes.length);
      return failureTypes[failureIndex];
    }

    return 'success';
  }

  /**
   * Creates a successful payment result
   */
  private createSuccessResult(paymentData: PaymentData): PaymentResult {
    return {
      success: true,
      transactionId: this.generateTransactionId(),
      processedAt: new Date(),
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod
    };
  }

  /**
   * Generates a unique transaction ID
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sleep utility for simulating network delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get payment method display information
   */
  getPaymentMethodInfo(method: string) {
    const info = {
      credit_card: {
        displayName: 'Tarjeta de Crédito',
        processingTime: '1-2 minutos',
        fees: 'Sin costo adicional'
      },
      debit_card: {
        displayName: 'Tarjeta de Débito',
        processingTime: '30-60 segundos',
        fees: 'Sin costo adicional'
      },
      paypal: {
        displayName: 'PayPal',
        processingTime: '2-3 minutos',
        fees: 'Sin costo adicional'
      },
      bank_transfer: {
        displayName: 'Transferencia Bancaria',
        processingTime: '1-2 días hábiles',
        fees: 'Sin costo adicional'
      }
    };

    return info[method as keyof typeof info] || null;
  }

  /**
   * Simulates refund processing
   */
  async processRefund(transactionId: string, amount: number, reason?: string): Promise<PaymentResult> {
    await this.sleep(1500); // Simulate processing time

    // Simulate 95% success rate for refunds
    if (Math.random() < 0.95) {
      return {
        success: true,
        transactionId: `REF-${this.generateTransactionId()}`,
        processedAt: new Date(),
        amount: amount,
        currency: 'USD'
      };
    } else {
      return {
        success: false,
        errorMessage: 'No se pudo procesar el reembolso. Intente más tarde.',
        errorCode: 'REFUND_ERROR'
      };
    }
  }
}
