import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { PaymentService, PaymentData, PaymentResult } from '../../services/payment.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-simple.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(CartService);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);

  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  cartSummary = this.cartService.getCartSummary();
  isProcessing = false;

  paymentMethods = [
    { value: 'credit_card', name: 'Tarjeta de Crédito', icon: 'credit_card' },
    { value: 'debit_card', name: 'Tarjeta de Débito', icon: 'payment' },
    { value: 'paypal', name: 'PayPal', icon: 'account_balance_wallet' },
    { value: 'bank_transfer', name: 'Transferencia Bancaria', icon: 'account_balance' }
  ];

  creditCardTypes = [
    { value: 'visa', name: 'Visa' },
    { value: 'mastercard', name: 'Mastercard' },
    { value: 'amex', name: 'American Express' },
    { value: 'discover', name: 'Discover' }
  ];

  ngOnInit() {
    this.cartItems = this.cartService.items();

    // Redirect if cart is empty
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      this.notificationService.showWarning(
        'Carrito vacío',
        'Agrega productos al carrito antes de proceder al checkout'
      );
      return;
    }

    this.initializeForm();
  }

  private initializeForm() {
    this.checkoutForm = this.fb.group({
      // Shipping Information
      shipping: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        address: ['', [Validators.required, Validators.minLength(10)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        country: ['US', [Validators.required]]
      }),

      // Payment Information
      payment: this.fb.group({
        method: ['credit_card', [Validators.required]],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        cardType: ['visa', [Validators.required]],
        expiryMonth: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        expiryYear: ['', [Validators.required, Validators.min(new Date().getFullYear())]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
        cardHolderName: ['', [Validators.required, Validators.minLength(2)]]
      }),

      // Billing same as shipping
      billingSameAsShipping: [true],

      // Terms and conditions
      agreeToTerms: [false, [Validators.requiredTrue]]
    });

    // Watch for payment method changes to adjust validation
    this.checkoutForm.get('payment.method')?.valueChanges.subscribe(method => {
      this.updatePaymentValidators(method);
    });
  }

  private updatePaymentValidators(method: string) {
    const paymentGroup = this.checkoutForm.get('payment') as FormGroup;

    if (method === 'paypal' || method === 'bank_transfer') {
      // Disable card-specific validations
      paymentGroup?.get('cardNumber')?.clearValidators();
      paymentGroup?.get('cardType')?.clearValidators();
      paymentGroup?.get('expiryMonth')?.clearValidators();
      paymentGroup?.get('expiryYear')?.clearValidators();
      paymentGroup?.get('cvv')?.clearValidators();
      paymentGroup?.get('cardHolderName')?.clearValidators();
    } else {
      // Enable card-specific validations
      paymentGroup?.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      paymentGroup?.get('cardType')?.setValidators([Validators.required]);
      paymentGroup?.get('expiryMonth')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      paymentGroup?.get('expiryYear')?.setValidators([Validators.required, Validators.min(new Date().getFullYear())]);
      paymentGroup?.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      paymentGroup?.get('cardHolderName')?.setValidators([Validators.required, Validators.minLength(2)]);
    }

    // Update validity
    Object.keys(paymentGroup?.controls || {}).forEach(key => {
      paymentGroup?.get(key)?.updateValueAndValidity();
    });
  }

  getErrorMessage(controlPath: string): string {
    const control = this.checkoutForm.get(controlPath);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength')?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (controlPath.includes('phone')) return 'Ingrese un teléfono válido (10 dígitos)';
      if (controlPath.includes('zipCode')) return 'Ingrese un código postal válido (5 dígitos)';
      if (controlPath.includes('cardNumber')) return 'Ingrese un número de tarjeta válido (16 dígitos)';
      if (controlPath.includes('cvv')) return 'Ingrese un CVV válido (3-4 dígitos)';
    }
    return '';
  }

  async onSubmit() {
    if (this.checkoutForm.valid && !this.isProcessing) {
      this.isProcessing = true;

      try {
        // Show processing notification
        this.notificationService.showPaymentProcessing();

        // Prepare payment data
        const formValue = this.checkoutForm.value;
        const paymentData: PaymentData = {
          amount: this.cartSummary.total,
          currency: 'USD',
          paymentMethod: formValue.payment.method,
          cardDetails: formValue.payment.method.includes('card') ? {
            number: formValue.payment.cardNumber,
            expiryMonth: formValue.payment.expiryMonth,
            expiryYear: formValue.payment.expiryYear,
            cvv: formValue.payment.cvv,
            holderName: formValue.payment.cardHolderName,
            type: formValue.payment.cardType
          } : undefined,
          customerInfo: {
            email: formValue.shipping.email,
            name: `${formValue.shipping.firstName} ${formValue.shipping.lastName}`,
            phone: formValue.shipping.phone
          },
          shippingAddress: formValue.shipping,
          orderItems: this.cartItems.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.total
          }))
        };

        // Process payment
        const result = await this.paymentService.processPayment(paymentData);

        if (result.success) {
          // Payment successful
          this.notificationService.showPaymentSuccess(paymentData.amount);

          // Clear cart
          this.cartService.clearCart();

          // Navigate to success page
          this.router.navigate(['/checkout/success'], {
            queryParams: {
              orderId: result.transactionId,
              total: paymentData.amount
            }
          });
        } else {
          // Payment failed
          this.notificationService.showPaymentError(result.errorMessage);
        }

      } catch (error) {
        console.error('Payment error:', error);
        this.notificationService.showPaymentError('Error inesperado en el procesamiento del pago');
      } finally {
        this.isProcessing = false;
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.checkoutForm);
      this.notificationService.showWarning(
        'Formulario incompleto',
        'Por favor complete todos los campos requeridos'
      );
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/cart']);
  }

  // Generate years for expiry dropdown
  getExpiryYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  }
}
