import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container tracking-page">
      <div class="tracking-card glass-card">
        <span class="icon">🚚</span>
        <h1>Track Your Pickle Order</h1>
        <p class="subtitle">Enter your Order Number and Mobile Phone number to check real-time delivery status.</p>

        <!-- Search Form -->
        <div class="search-form">
          <div class="input-group">
            <input
              type="text"
              placeholder="Order Number (e.g. PKL-202608-1001)"
              [(ngModel)]="orderNumberInput"
            />
            <input
              type="tel"
              placeholder="Mobile Phone (10 digits)"
              [(ngModel)]="phoneInput"
              maxlength="10"
            />
            <button (click)="onTrackOrder()" [disabled]="!orderNumberInput || !phoneInput || loading">
              {{ loading ? 'Tracking...' : 'Track Order' }}
            </button>
          </div>
          <span class="error" *ngIf="errorMessage">{{ errorMessage }}</span>
        </div>

        <!-- Tracking Results Card -->
        <div class="results-section" *ngIf="order">
          <div class="status-stepper">
            <div class="step" [class.active]="isStepActive('PENDING')">
              <div class="dot"><span class="material-icons-outlined">receipt</span></div>
              <span class="label">Order Placed</span>
            </div>
            <div class="step-line" [class.active]="isStepActive('CONFIRMED')"></div>
            <div class="step" [class.active]="isStepActive('CONFIRMED')">
              <div class="dot"><span class="material-icons-outlined">thumb_up</span></div>
              <span class="label">Confirmed</span>
            </div>
            <div class="step-line" [class.active]="isStepActive('PROCESSING')"></div>
            <div class="step" [class.active]="isStepActive('PROCESSING')">
              <div class="dot"><span class="material-icons-outlined">soup_kitchen</span></div>
              <span class="label">Packing & Processing</span>
            </div>
            <div class="step-line" [class.active]="isStepActive('SHIPPED')"></div>
            <div class="step" [class.active]="isStepActive('SHIPPED')">
              <div class="dot"><span class="material-icons-outlined">local_shipping</span></div>
              <span class="label">Shipped</span>
            </div>
            <div class="step-line" [class.active]="isStepActive('DELIVERED')"></div>
            <div class="step" [class.active]="isStepActive('DELIVERED')">
              <div class="dot"><span class="material-icons-outlined">home</span></div>
              <span class="label">Delivered</span>
            </div>
          </div>

          <div class="order-info-box">
            <div class="info-col">
              <h4>Order Number</h4>
              <p><strong>{{ order.orderNumber }}</strong></p>
            </div>
            <div class="info-col">
              <h4>Customer Name</h4>
              <p>{{ order.customer?.name }}</p>
            </div>
            <div class="info-col">
              <h4>Payment Status</h4>
              <p><span class="badge badge-emerald">{{ order.paymentStatus }}</span></p>
            </div>
            <div class="info-col">
              <h4>Total Amount</h4>
              <p><strong>₹{{ order.totalAmount }}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-page { padding: 4rem 0; max-width: 850px; }
    .tracking-card { padding: 3rem; text-align: center; }
    .icon { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
    h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 2rem; }
    .search-form {
      max-width: 650px; margin: 0 auto 2.5rem;
      .input-group {
        display: grid; grid-template-columns: 1.2fr 1fr 140px; gap: 0.75rem;
        @media (max-width: 650px) { grid-template-columns: 1fr; }
        input {
          padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--card-border);
          background: var(--bg-color); color: var(--text-main); font-size: 0.95rem; outline: none;
          &:focus { border-color: var(--primary); }
        }
        button {
          background: var(--primary); color: #FFF; border: none; padding: 0.85rem;
          border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;
          &:disabled { background: #9CA3AF; cursor: not-allowed; }
        }
      }
      .error { color: #EF4444; font-size: 0.85rem; display: block; margin-top: 0.75rem; }
    }
    .results-section {
      border-top: 1px solid var(--card-border); padding-top: 2.5rem; text-align: left;
    }
    .status-stepper {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem;
      @media (max-width: 650px) { overflow-x: auto; padding-bottom: 1rem; }
    }
    .step {
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-muted);
      .dot {
        width: 44px; height: 44px; border-radius: 50%; background: var(--bg-color); border: 2px solid var(--card-border);
        display: flex; align-items: center; justify-content: center; color: var(--text-muted);
      }
      &.active {
        color: var(--primary); font-weight: 700;
        .dot { background: rgba(217, 119, 6, 0.15); border-color: var(--primary); color: var(--primary); }
      }
    }
    .step-line {
      flex: 1; height: 3px; background: var(--card-border); margin: 0 0.5rem; margin-bottom: 1.5rem;
      &.active { background: var(--primary); }
    }
    .order-info-box {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem;
      background: var(--bg-color); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--card-border);
      h4 { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem; }
      p { font-size: 1rem; color: var(--text-main); }
    }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orderNumberInput = '';
  phoneInput = '';
  order: any = null;
  loading = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['orderNumber']) this.orderNumberInput = params['orderNumber'];
      if (params['phone']) this.phoneInput = params['phone'];
      if (this.orderNumberInput && this.phoneInput) {
        this.onTrackOrder();
      }
    });
  }

  onTrackOrder(): void {
    if (!this.orderNumberInput || !this.phoneInput) return;
    this.loading = true;
    this.errorMessage = '';
    this.order = null;

    this.orderService.trackOrder(this.orderNumberInput, this.phoneInput).subscribe({
      next: (res) => {
        if (res.data) this.order = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No order found matching these details';
        this.loading = false;
      },
    });
  }

  isStepActive(status: string): boolean {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = statuses.indexOf(this.order?.status || 'PENDING');
    const targetIdx = statuses.indexOf(status);
    return currentIdx >= targetIdx;
  }
}
