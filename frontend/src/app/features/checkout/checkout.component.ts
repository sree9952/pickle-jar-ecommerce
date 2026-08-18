import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CartSummary } from '../../core/models/cart.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  template: `
    <div class="container checkout-page">
      <h1 class="page-title">Guest Checkout</h1>
      <p class="page-subtitle">No login or password needed. Provide shipping details to complete your order.</p>

      <div class="checkout-grid" *ngIf="summary.items.length > 0; else emptyCartTpl">
        <!-- Form Section -->
        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="checkout-form glass-card">
          <h2>1. Contact & Shipping Details</h2>

          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" formControlName="name" placeholder="e.g. Ramesh Kumar" />
              <span class="error" *ngIf="f['name'].touched && f['name'].invalid">Name is required</span>
            </div>

            <div class="form-group">
              <div class="form-group-header">
                <label>Mobile Phone (For Order SMS & Tracking) *</label>
              </div>
              <input type="tel" formControlName="phone" placeholder="10-digit mobile number" maxlength="10" />
              <span class="error" *ngIf="f['phone'].touched && f['phone'].invalid">Valid 10-digit mobile number required</span>
            </div>
          </div>

          <div class="form-group">
            <label>Email Address (Optional for Invoice PDF)</label>
            <input type="email" formControlName="email" placeholder="name&#64;example.com" />
            <span class="error" *ngIf="f['email'].touched && f['email'].invalid">Invalid email format</span>
          </div>

          <h2>2. Delivery Address</h2>

          <div class="form-group">
            <label>Flat / House No. / Street Address *</label>
            <input type="text" formControlName="addressLine1" placeholder="e.g. Door No 4-12, Green Park Avenue" />
            <span class="error" *ngIf="f['addressLine1'].touched && f['addressLine1'].invalid">Address line 1 is required</span>
          </div>

          <div class="form-group">
            <label>Apartment / Landmark / Locality (Optional)</label>
            <input type="text" formControlName="addressLine2" placeholder="e.g. Opposite SBI Bank" />
          </div>

          <div class="form-row three-col">
            <div class="form-group">
              <label>City *</label>
              <input type="text" formControlName="city" placeholder="e.g. Hyderabad" />
              <span class="error" *ngIf="f['city'].touched && f['city'].invalid">City is required</span>
            </div>

            <div class="form-group">
              <label>State *</label>
              <input type="text" formControlName="state" placeholder="e.g. Telangana" />
              <span class="error" *ngIf="f['state'].touched && f['state'].invalid">State is required</span>
            </div>

            <div class="form-group">
              <label>Pincode *</label>
              <input type="text" formControlName="pincode" placeholder="6-digit pincode" maxlength="6" />
              <span class="error" *ngIf="f['pincode'].touched && f['pincode'].invalid">6-digit pincode required</span>
            </div>
          </div>

          <button type="submit" class="btn-pay" [disabled]="checkoutForm.invalid || submitting">
            <span class="material-icons-outlined">lock</span>
            {{ submitting ? 'Initiating Razorpay Payment...' : 'Pay ₹' + summary.totalAmount + ' via Razorpay' }}
          </button>
        </form>

        <!-- Sidebar Summary -->
        <div class="checkout-sidebar">
          <div class="summary-card glass-card">
            <h3>Order Items ({{ summary.itemCount }})</h3>

            <div class="items-list">
              <div class="item-row" *ngFor="let item of summary.items">
                <span class="item-name">{{ item.product.name }} (x{{ item.quantity }})</span>
                <span class="item-price">₹{{ item.product.price * item.quantity }}</span>
              </div>
            </div>

            <div class="price-breakdown">
              <div class="row">
                <span>Subtotal</span>
                <span>₹{{ summary.subtotal }}</span>
              </div>
              <div class="row" *ngIf="summary.discountAmount > 0">
                <span class="discount">Discount ({{ summary.couponCode }})</span>
                <span class="discount">-₹{{ summary.discountAmount }}</span>
              </div>
              <div class="row">
                <span>Shipping</span>
                <span>{{ summary.shippingFee === 0 ? 'FREE' : '₹' + summary.shippingFee }}</span>
              </div>
              <div class="row total">
                <span>Total Amount</span>
                <span class="total-val">₹{{ summary.totalAmount }}</span>
              </div>
            </div>

            <div class="security-badge">
              <span class="material-icons-outlined">verified_user</span>
              <span>100% Payment Security via Razorpay (UPI, Credit/Debit Cards, NetBanking)</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #emptyCartTpl>
        <div class="empty-cart glass-card">
          <p>Your cart is empty. Please add pickles before checking out.</p>
          <a routerLink="/products" class="btn-shop">Back to Store</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 3rem 0; }
    .page-title { font-size: 2.25rem; margin-bottom: 0.25rem; }
    .page-subtitle { color: var(--text-muted); margin-bottom: 2rem; }
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .checkout-form {
      padding: 2rem;
      h2 { font-size: 1.25rem; color: var(--primary); margin: 1.5rem 0 1rem; &:first-child { margin-top: 0; } }
    }
    .form-group {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--text-main); }
      input {
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--card-border);
        background: var(--bg-color);
        color: var(--text-main);
        font-size: 0.95rem;
        outline: none;
        &:focus { border-color: var(--primary); }
      }
      .error { color: #EF4444; font-size: 0.75rem; font-weight: 500; }
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      &.three-col { grid-template-columns: 1fr 1fr 1fr; }
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
    .btn-pay {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: var(--primary);
      color: #FFF;
      padding: 1rem;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 1.5rem;
      transition: background 0.2s ease;
      &:hover:not(:disabled) { background: var(--primary-hover); }
      &:disabled { background: #9CA3AF; cursor: not-allowed; }
    }
    .summary-card {
      padding: 1.75rem;
      h3 { font-size: 1.2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.5rem; }
    }
    .items-list {
      max-height: 220px;
      overflow-y: auto;
      margin-bottom: 1rem;
      .item-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.4rem 0; color: var(--text-muted); }
    }
    .price-breakdown {
      border-top: 1px solid var(--card-border);
      padding-top: 1rem;
      .row {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: var(--text-muted);
        &.total { font-size: 1.1rem; font-weight: 700; color: var(--text-main); border-top: 2px dashed var(--card-border); padding-top: 0.75rem; margin-top: 0.5rem; }
        .discount { color: var(--accent); font-weight: 600; }
        .total-val { color: var(--primary); font-family: 'Outfit', sans-serif; font-size: 1.5rem; }
      }
    }
    .security-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      .material-icons-outlined { color: var(--accent); font-size: 1.2rem; }
    }
    .empty-cart { text-align: center; padding: 3rem; }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  summary!: CartSummary;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.summary = this.cartService.getSummary();
    if (this.summary.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) return;
    this.submitting = true;

    const val = this.checkoutForm.value;

    const payload = {
      customer: {
        name: val.name,
        phone: val.phone,
        email: val.email || undefined,
      },
      shippingAddress: {
        addressLine1: val.addressLine1,
        addressLine2: val.addressLine2 || undefined,
        city: val.city,
        state: val.state,
        pincode: val.pincode,
      },
      items: this.summary.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      couponCode: this.summary.couponCode,
    };

    this.orderService.createRazorpayOrder(payload).subscribe({
      next: (res) => {
        if (res.data) {
          this.openRazorpayModal(res.data);
        }
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(err.error?.message || 'Error creating Razorpay order', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  private openRazorpayModal(orderData: any): void {
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: "Grandma's Pickles & Jars",
      description: `Order #${orderData.orderNumber}`,
      image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
      order_id: orderData.razorpayOrderId.startsWith('order_mock_') ? undefined : orderData.razorpayOrderId,
      prefill: {
        name: orderData.customer.name,
        contact: orderData.customer.phone,
        email: orderData.customer.email || '',
      },
      theme: {
        color: '#D97706',
      },
      handler: (response: any) => {
        this.verifyPaymentOnServer({
          razorpayOrderId: orderData.razorpayOrderId,
          razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
          razorpaySignature: response.razorpay_signature || 'mock_signature',
        }, orderData.orderNumber);
      },
      modal: {
        ondismiss: () => {
          this.submitting = false;
          this.snackBar.open('Payment cancelled by user', 'OK', { duration: 3000 });
        },
      },
    };

    if (typeof Razorpay !== 'undefined') {
      const rzp = new Razorpay(options);
      rzp.open();
    } else {
      // Direct mock verification if Razorpay JS SDK script not loaded
      this.verifyPaymentOnServer({
        razorpayOrderId: orderData.razorpayOrderId,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpaySignature: 'mock_signature',
      }, orderData.orderNumber);
    }
  }

  private verifyPaymentOnServer(paymentData: any, orderNumber: string): void {
    this.orderService.verifyPayment(paymentData).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.submitting = false;
        this.router.navigate(['/order-success', orderNumber]);
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(err.error?.message || 'Payment verification failed', 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
