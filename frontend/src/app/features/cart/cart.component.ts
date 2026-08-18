import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CouponService } from '../../core/services/coupon.service';
import { CartSummary } from '../../core/models/cart.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="container cart-page">
      <h1 class="page-title">Shopping Cart ({{ summary.itemCount }} items)</h1>

      <div class="cart-layout" *ngIf="summary.items.length > 0; else emptyCartTpl">
        <!-- Cart Items List -->
        <div class="cart-items-container">
          <!-- Free Shipping Progress Bar -->
          <div class="free-shipping-bar glass-card">
            <div class="bar-text">
              <span class="icon">🚚</span>
              <span *ngIf="summary.subtotal >= 499">
                Congratulations! You qualify for <strong>FREE Shipping</strong>!
              </span>
              <span *ngIf="summary.subtotal < 499">
                Add <strong>₹{{ 499 - summary.subtotal }}</strong> more to unlock FREE Shipping!
              </span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                [style.width.%]="Math.min((summary.subtotal / 499) * 100, 100)"
              ></div>
            </div>
          </div>

          <!-- Items Table / Cards -->
          <div class="cart-item-card glass-card" *ngFor="let item of summary.items">
            <div class="item-img">
              <img [src]="getItemImage(item)" [alt]="item.product.name" />
            </div>

            <div class="item-details">
              <h3><a [routerLink]="['/products', item.product.slug]">{{ item.product.name }}</a></h3>
              <span class="weight">{{ item.product.weightGram }}g Pack</span>
              <span class="unit-price">₹{{ item.product.price }} each</span>
            </div>

            <div class="item-actions">
              <div class="quantity-picker">
                <button (click)="updateQuantity(item.product.id, item.quantity - 1)">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="updateQuantity(item.product.id, item.quantity + 1)">+</button>
              </div>
              <span class="item-total">₹{{ item.product.price * item.quantity }}</span>
              <button class="remove-btn" (click)="removeItem(item.product.id)">
                <span class="material-icons-outlined">delete_outline</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="cart-summary-sidebar">
          <div class="summary-card glass-card">
            <h3>Order Summary</h3>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹{{ summary.subtotal }}</span>
            </div>

            <div class="summary-row" *ngIf="summary.discountAmount > 0">
              <span class="discount-label">Coupon Discount ({{ summary.couponCode }})</span>
              <span class="discount-val">-₹{{ summary.discountAmount }}</span>
            </div>

            <div class="summary-row">
              <span>Shipping Fee</span>
              <span>{{ summary.shippingFee === 0 ? 'FREE' : '₹' + summary.shippingFee }}</span>
            </div>

            <!-- Coupon Input -->
            <div class="coupon-box">
              <div class="input-group">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. WELCOME10)"
                  [(ngModel)]="couponCodeInput"
                  [disabled]="validatingCoupon"
                />
                <button (click)="applyCoupon()" [disabled]="!couponCodeInput || validatingCoupon">
                  Apply
                </button>
              </div>
            </div>

            <div class="total-row">
              <span>Total Payable</span>
              <span class="total-amount">₹{{ summary.totalAmount }}</span>
            </div>

            <a routerLink="/checkout" class="btn-checkout">
              Proceed to Guest Checkout &rarr;
            </a>

            <p class="guest-note">
              🔒 No login or password required. Guest checkout in 60 seconds.
            </p>
          </div>
        </div>
      </div>

      <ng-template #emptyCartTpl>
        <div class="empty-cart glass-card">
          <span class="icon">🫙</span>
          <h2>Your Cart is Empty</h2>
          <p>Explore our handcrafted pickles and add your favorites to the cart!</p>
          <a routerLink="/products" class="btn-shop">Shop Pickles Now</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page { padding: 3rem 0; }
    .page-title { font-size: 2.25rem; margin-bottom: 2rem; }
    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 2rem;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .free-shipping-bar {
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      .bar-text { font-size: 0.95rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
      .progress-track { height: 8px; background: rgba(0,0,0,0.08); border-radius: 4px; overflow: hidden; }
      .progress-fill { height: 100%; background: var(--accent); transition: width 0.3s ease; }
    }
    .cart-item-card {
      padding: 1.25rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      @media (max-width: 600px) { flex-direction: column; align-items: flex-start; }
    }
    .item-img {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      flex-shrink: 0;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .item-details {
      flex: 1;
      h3 { font-size: 1.05rem; margin-bottom: 0.25rem; a { color: var(--text-main); } }
      .weight { font-size: 0.8rem; color: var(--text-muted); display: block; }
      .unit-price { font-size: 0.85rem; color: var(--primary); font-weight: 600; }
    }
    .item-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .quantity-picker {
      display: flex;
      align-items: center;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      button { width: 32px; height: 32px; border: none; background: transparent; cursor: pointer; color: var(--text-main); }
      span { width: 32px; text-align: center; font-weight: 600; }
    }
    .item-total { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; color: var(--primary); }
    .remove-btn { background: transparent; border: none; color: #EF4444; cursor: pointer; }
    .summary-card {
      padding: 1.75rem;
      h3 { font-size: 1.3rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem; }
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      color: var(--text-muted);
      .discount-label { color: var(--accent); }
      .discount-val { color: var(--accent); font-weight: 700; }
    }
    .coupon-box {
      margin: 1.25rem 0;
      .input-group {
        display: flex;
        gap: 0.5rem;
        input {
          flex: 1;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--bg-color);
          color: var(--text-main);
          font-size: 0.85rem;
          outline: none;
        }
        button {
          background: var(--primary);
          color: #FFF;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }
      }
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 2px dashed var(--card-border);
      margin-bottom: 1.5rem;
      span { font-size: 1.1rem; font-weight: 700; }
      .total-amount { font-family: 'Outfit', sans-serif; font-size: 1.75rem; color: var(--primary); }
    }
    .btn-checkout {
      display: block;
      width: 100%;
      text-align: center;
      background: var(--primary);
      color: #FFF;
      padding: 0.9rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1.05rem;
      text-decoration: none;
      transition: background 0.2s ease;
      &:hover { background: var(--primary-hover); }
    }
    .guest-note { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1rem; }
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      .icon { font-size: 4rem; margin-bottom: 1rem; display: block; }
      h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
      p { color: var(--text-muted); margin-bottom: 1.5rem; }
      .btn-shop {
        display: inline-block;
        background: var(--primary);
        color: #FFF;
        padding: 0.75rem 1.75rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        text-decoration: none;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  summary!: CartSummary;
  couponCodeInput = '';
  validatingCoupon = false;
  Math = Math;

  constructor(
    private cartService: CartService,
    private couponService: CouponService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(() => {
      this.summary = this.cartService.getSummary();
    });
    this.summary = this.cartService.getSummary();
  }

  getItemImage(item: any): string {
    if (item.product.images?.length) {
      return item.product.images[0].imageUrl;
    }
    return '';
  }

  updateQuantity(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.snackBar.open('Item removed from cart', undefined, { duration: 2000 });
  }

  applyCoupon(): void {
    if (!this.couponCodeInput) return;
    this.validatingCoupon = true;
    this.couponService.validateCoupon(this.couponCodeInput, this.summary.subtotal).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.cartService.applyDiscount(res.data.code, res.data.discountAmount);
          this.snackBar.open(`Coupon '${res.data.code}' applied! Saved ₹${res.data.discountAmount} 🎉`, 'OK', {
            duration: 4000,
          });
        }
        this.validatingCoupon = false;
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Invalid coupon code', 'Close', { duration: 4000 });
        this.validatingCoupon = false;
      },
    });
  }
}
