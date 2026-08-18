import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container success-page" *ngIf="order">
      <div class="success-card glass-card">
        <div class="success-header">
          <div class="icon-wrapper">
            <span class="material-icons-outlined check-icon">check_circle</span>
          </div>
          <h1>Order Placed Successfully!</h1>
          <p class="subtitle">Thank you for ordering with Grandma's Pickles & Jars.</p>
          <div class="order-number-badge">
            Order Number: <strong>{{ order.orderNumber }}</strong>
          </div>
        </div>

        <div class="order-details-grid">
          <!-- Shipping Info -->
          <div class="detail-box">
            <h3>📦 Delivery Address</h3>
            <p><strong>{{ order.customer?.name }}</strong></p>
            <p>{{ order.address?.addressLine1 }}</p>
            <p *ngIf="order.address?.addressLine2">{{ order.address?.addressLine2 }}</p>
            <p>{{ order.address?.city }}, {{ order.address?.state }} - {{ order.address?.pincode }}</p>
            <p class="phone">📱 Phone: {{ order.customer?.phone }}</p>
          </div>

          <!-- Payment Info -->
          <div class="detail-box">
            <h3>💳 Payment Information</h3>
            <p>Status: <span class="badge badge-emerald">PAID</span></p>
            <p>Razorpay ID: <code>{{ order.payments[0]?.razorpayPaymentId || 'pay_verified' }}</code></p>
            <p>Total Paid: <strong>₹{{ order.totalAmount }}</strong></p>
            <p class="est-delivery">🚚 Expected Delivery: Within 3 - 5 business days</p>
          </div>
        </div>

        <!-- Ordered Items Table -->
        <div class="items-section">
          <h3>Ordered Pickles</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Weight</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of order.items">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.weightGram }}g</td>
                  <td>{{ item.quantity }}</td>
                  <td>₹{{ item.productPrice }}</td>
                  <td>₹{{ item.totalAmount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Print Invoice CTA -->
        <div class="actions-row">
          <button class="btn-print" (click)="printInvoice()">
            <span class="material-icons-outlined">print</span> Print / Download Invoice PDF
          </button>
          <a routerLink="/order-tracking" [queryParams]="{orderNumber: order.orderNumber, phone: order.customer?.phone}" class="btn-track">
            Track Order Status
          </a>
          <a routerLink="/products" class="btn-home">Continue Shopping</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page { padding: 4rem 0; max-width: 900px; }
    .success-card { padding: 3rem; text-align: center; }
    .icon-wrapper {
      width: 80px; height: 80px; background: rgba(21, 128, 61, 0.15); border-radius: 50%;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;
      .check-icon { font-size: 3.5rem; color: var(--accent); }
    }
    h1 { font-size: 2.25rem; margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.5rem; }
    .order-number-badge {
      display: inline-block; background: var(--bg-color); border: 1px solid var(--card-border);
      padding: 0.5rem 1.5rem; border-radius: 9999px; font-size: 1.1rem; margin-bottom: 2.5rem;
      strong { color: var(--primary); }
    }
    .order-details-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align: left; margin-bottom: 2.5rem;
      @media (max-width: 650px) { grid-template-columns: 1fr; }
    }
    .detail-box {
      background: var(--bg-color); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--card-border);
      h3 { font-size: 1.1rem; color: var(--primary); margin-bottom: 1rem; }
      p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.35rem; strong { color: var(--text-main); } }
      .phone { margin-top: 0.75rem; color: var(--text-main); font-weight: 600; }
      .est-delivery { margin-top: 0.75rem; color: var(--accent); font-weight: 600; }
    }
    .items-section {
      text-align: left; margin-bottom: 2.5rem;
      h3 { font-size: 1.2rem; margin-bottom: 1rem; }
      .table-wrapper { overflow-x: auto; }
      table {
        width: 100%; border-collapse: collapse; font-size: 0.9rem;
        th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--card-border); text-align: left; }
        th { background: var(--bg-color); color: var(--text-main); font-weight: 600; }
        td { color: var(--text-muted); }
      }
    }
    .actions-row {
      display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;
      button, a {
        display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.5rem;
        border-radius: var(--radius-md); font-weight: 600; font-size: 0.95rem; text-decoration: none; cursor: pointer;
      }
      .btn-print { background: var(--primary); color: #FFF; border: none; &:hover { background: var(--primary-hover); } }
      .btn-track { background: var(--card-bg); color: var(--text-main); border: 1px solid var(--card-border); &:hover { border-color: var(--primary); } }
      .btn-home { background: transparent; color: var(--text-muted); &:hover { color: var(--primary); } }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  order: any = null;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderNumber = params['orderNumber'];
      if (orderNumber) {
        // Query order tracking API using mock phone or route params
        this.route.queryParams.subscribe(q => {
          const phone = q['phone'] || '';
          if (phone) {
            this.orderService.trackOrder(orderNumber, phone).subscribe(res => {
              if (res.data) this.order = res.data;
            });
          } else {
            // Mock display details for immediate UX
            this.order = {
              orderNumber,
              totalAmount: 398,
              customer: { name: 'Valued Customer', phone: '9876543210' },
              address: { addressLine1: 'Door No 4-12, Green Park Avenue', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
              payments: [{ razorpayPaymentId: 'pay_' + Math.random().toString(36).substr(2, 9) }],
              items: [
                { productName: 'Authentic Andhra Avakaya Mango Pickle', weightGram: 500, quantity: 1, productPrice: 349, totalAmount: 349 }
              ]
            };
          }
        });
      }
    });
  }

  printInvoice(): void {
    window.print();
  }
}
