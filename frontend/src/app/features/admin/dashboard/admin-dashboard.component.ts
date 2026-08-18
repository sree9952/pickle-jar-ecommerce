import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="container admin-dashboard-page">
      <!-- Admin Header -->
      <div class="dashboard-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p>Real-time analytics, order fulfillment & store inventory management</p>
        </div>
        <div class="header-actions">
          <a routerLink="/" class="btn-storefront" target="_blank">
            <span class="material-icons-outlined">storefront</span> View Live Store
          </a>
          <button class="btn-logout" (click)="logout()">
            <span class="material-icons-outlined">logout</span> Sign Out
          </button>
        </div>
      </div>

      <!-- KPI Metrics Cards Grid -->
      <div class="metrics-grid" *ngIf="stats">
        <div class="metric-card glass-card">
          <div class="icon-box revenue"><span class="material-icons-outlined">payments</span></div>
          <div class="info">
            <span class="label">Total Revenue</span>
            <span class="value">₹{{ stats.totalRevenue }}</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="icon-box orders"><span class="material-icons-outlined">shopping_bag</span></div>
          <div class="info">
            <span class="label">Total Orders</span>
            <span class="value">{{ stats.totalOrders }}</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="icon-box pending"><span class="material-icons-outlined">pending_actions</span></div>
          <div class="info">
            <span class="label">Pending Orders</span>
            <span class="value">{{ stats.pendingOrders }}</span>
          </div>
        </div>

        <div class="metric-card glass-card">
          <div class="icon-box low-stock"><span class="material-icons-outlined">warning</span></div>
          <div class="info">
            <span class="label">Low Stock Alerts</span>
            <span class="value">{{ stats.lowStockProducts }}</span>
          </div>
        </div>
      </div>

      <!-- Management Modules Tabs -->
      <div class="modules-tabs glass-card">
        <button class="tab-btn" [class.active]="activeTab === 'products'" (click)="activeTab = 'products'">
          🫙 Product Catalog & Add Pickles
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
          📦 Orders Management
        </button>
      </div>

      <!-- Tab 1: Product Inventory & Add Product View -->
      <div class="tab-content glass-card" *ngIf="activeTab === 'products'">
        <div class="section-title-row">
          <div>
            <h3>Product Catalog ({{ products.length }} items)</h3>
            <p class="section-desc">Manage pickle items, adjust stock, or add new homemade batches</p>
          </div>
          <button class="btn-add-product" (click)="showAddModal = true">
            <span class="material-icons-outlined">add_circle</span> + Add New Pickle Product
          </button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Weight</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of products">
                <td>
                  <img
                    [src]="getProductImage(prod)"
                    [alt]="prod.name"
                    class="product-thumb"
                  />
                </td>
                <td>
                  <strong>{{ prod.name }}</strong>
                  <span class="prod-desc">{{ prod.description | slice:0:50 }}...</span>
                </td>
                <td>{{ prod.category?.name || 'Veg Pickles' }}</td>
                <td>{{ prod.weightGram }}g</td>
                <td><strong>₹{{ prod.price }}</strong></td>
                <td>
                  <span [class.stock-warn]="prod.stockQuantity <= 10" [class.stock-ok]="prod.stockQuantity > 10">
                    {{ prod.stockQuantity }} in stock
                  </span>
                </td>
                <td>
                  <span class="badge badge-amber" *ngIf="prod.isBestSeller">Best Seller</span>
                  <span class="badge badge-emerald" *ngIf="prod.isFeatured">Featured</span>
                </td>
                <td>
                  <button class="btn-delete" (click)="deleteProduct(prod.id)">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Orders Management View -->
      <div class="tab-content glass-card" *ngIf="activeTab === 'orders'">
        <h3>Customer Orders</h3>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td><strong>{{ order.orderNumber }}</strong></td>
                <td>{{ order.customer?.name }}</td>
                <td>{{ order.customer?.phone }}</td>
                <td><strong>₹{{ order.totalAmount }}</strong></td>
                <td><span class="badge badge-emerald">{{ order.paymentStatus }}</span></td>
                <td>
                  <span class="badge badge-amber">{{ order.status }}</span>
                </td>
                <td>
                  <select (change)="updateOrderStatus(order.id, $any($event.target).value)" class="status-select">
                    <option value="PENDING" [selected]="order.status === 'PENDING'">Pending</option>
                    <option value="CONFIRMED" [selected]="order.status === 'CONFIRMED'">Confirmed</option>
                    <option value="PROCESSING" [selected]="order.status === 'PROCESSING'">Processing</option>
                    <option value="SHIPPED" [selected]="order.status === 'SHIPPED'">Shipped</option>
                    <option value="DELIVERED" [selected]="order.status === 'DELIVERED'">Delivered</option>
                    <option value="CANCELLED" [selected]="order.status === 'CANCELLED'">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Product Modal Dialog -->
      <div class="modal-overlay" *ngIf="showAddModal" (click)="showAddModal = false">
        <div class="modal-card glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>🫙 Add New Pickle Product</h2>
            <button class="btn-close" (click)="showAddModal = false">&times;</button>
          </div>

          <form [formGroup]="productForm" (ngSubmit)="onAddProduct()" class="product-form">
            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select formControlName="categoryId">
                  <option *ngFor="let cat of categories" [value]="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>Pickle / Product Name *</label>
                <input type="text" formControlName="name" placeholder="e.g. Gongura Spicy Pickle" />
              </div>
            </div>

            <div class="form-row three-col">
              <div class="form-group">
                <label>Weight (in Grams) *</label>
                <input type="number" formControlName="weightGram" placeholder="e.g. 500" />
              </div>

              <div class="form-group">
                <label>Selling Price (₹) *</label>
                <input type="number" formControlName="price" placeholder="e.g. 299" />
              </div>

              <div class="form-group">
                <label>Compare Price (₹)</label>
                <input type="number" formControlName="comparePrice" placeholder="e.g. 349" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Initial Stock Quantity *</label>
                <input type="number" formControlName="stockQuantity" placeholder="e.g. 50" />
              </div>

              <div class="form-group">
                <label>Image URL *</label>
                <input type="text" formControlName="imageUrl" placeholder="https://images.unsplash.com/..." />
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" rows="3" placeholder="Grandma's traditional recipe prepared with fresh ingredients..."></textarea>
            </div>

            <div class="form-group">
              <label>Ingredients (Optional)</label>
              <input type="text" formControlName="ingredients" placeholder="e.g. Fresh Gongura leaves, Cold-pressed gingelly oil, Red chilli powder..." />
            </div>

            <div class="checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isFeatured" /> Feature on Homepage
              </label>
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isBestSeller" /> Mark as Best Seller
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="showAddModal = false">Cancel</button>
              <button type="submit" class="btn-save" [disabled]="productForm.invalid || saving">
                {{ saving ? 'Saving Pickle...' : 'Save & Publish Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-page { padding: 3rem 0; }
    .dashboard-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 2.25rem; color: var(--primary); margin-bottom: 0.25rem; }
      p { color: var(--text-muted); }
      .header-actions { display: flex; gap: 1rem; align-items: center; }
      .btn-storefront {
        display: inline-flex; align-items: center; gap: 0.35rem; background: var(--bg-color);
        color: var(--text-main); border: 1px solid var(--card-border); padding: 0.6rem 1.2rem;
        border-radius: var(--radius-md); font-weight: 600; text-decoration: none;
        &:hover { border-color: var(--primary); color: var(--primary); }
      }
      .btn-logout {
        display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(239, 68, 68, 0.1);
        color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.6rem 1.2rem;
        border-radius: var(--radius-md); font-weight: 600; cursor: pointer;
        &:hover { background: rgba(239, 68, 68, 0.2); }
      }
    }
    .metrics-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;
    }
    .metric-card {
      padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem;
      .icon-box {
        width: 54px; height: 54px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;
        .material-icons-outlined { font-size: 1.75rem; }
        &.revenue { background: rgba(21, 128, 61, 0.15); color: var(--accent); }
        &.orders { background: rgba(217, 119, 6, 0.15); color: var(--primary); }
        &.pending { background: rgba(200, 90, 50, 0.15); color: var(--secondary); }
        &.low-stock { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
      }
      .info {
        display: flex; flex-direction: column;
        .label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
        .value { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: var(--text-main); }
      }
    }
    .modules-tabs {
      padding: 0.5rem; margin-bottom: 1.5rem; display: flex; gap: 0.5rem;
      .tab-btn {
        background: transparent; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-sm);
        font-weight: 600; font-size: 0.95rem; color: var(--text-muted); cursor: pointer;
        &.active { background: var(--primary); color: #FFF; }
      }
    }
    .tab-content {
      padding: 2rem;
      .section-title-row {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
        h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        .section-desc { font-size: 0.85rem; color: var(--text-muted); }
      }
      .btn-add-product {
        display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary);
        color: #FFF; border: none; padding: 0.65rem 1.25rem; border-radius: var(--radius-md);
        font-weight: 700; font-size: 0.9rem; cursor: pointer;
        &:hover { background: var(--primary-hover); }
      }
      .table-wrapper { overflow-x: auto; }
      table {
        width: 100%; border-collapse: collapse; font-size: 0.9rem;
        th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--card-border); text-align: left; vertical-align: middle; }
        th { background: var(--bg-color); color: var(--text-main); font-weight: 600; }
        td { color: var(--text-muted); strong { color: var(--text-main); } }
      }
    }
    .product-thumb { width: 48px; height: 48px; border-radius: var(--radius-sm); object-fit: cover; }
    .prod-desc { display: block; font-size: 0.75rem; color: var(--text-muted); }
    .btn-delete { background: transparent; border: none; color: #EF4444; cursor: pointer; }
    .status-select {
      padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--card-border);
      background: var(--bg-color); color: var(--text-main); font-size: 0.85rem; outline: none;
    }
    .stock-warn { color: #EF4444; font-weight: 700; }
    .stock-ok { color: var(--accent); font-weight: 600; }

    /* Modal Styles */
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1.5rem;
    }
    .modal-card {
      width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; padding: 2rem; background: var(--card-bg);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border); padding-bottom: 0.75rem;
      h2 { font-size: 1.4rem; color: var(--primary); }
      .btn-close { background: transparent; border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-muted); }
    }
    .product-form {
      display: flex; flex-direction: column; gap: 1rem;
      .form-row {
        display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        &.three-col { grid-template-columns: 1fr 1fr 1fr; }
      }
      .form-group {
        display: flex; flex-direction: column; gap: 0.35rem;
        label { font-size: 0.85rem; font-weight: 600; }
        input, select, textarea {
          padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--card-border);
          background: var(--bg-color); color: var(--text-main); font-size: 0.9rem; outline: none;
          &:focus { border-color: var(--primary); }
        }
      }
      .checkbox-row {
        display: flex; gap: 2rem; margin: 0.5rem 0;
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
      }
    }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;
      border-top: 1px solid var(--card-border); padding-top: 1rem;
      .btn-cancel {
        background: transparent; border: 1px solid var(--card-border); padding: 0.65rem 1.25rem;
        border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; color: var(--text-main);
      }
      .btn-save {
        background: var(--primary); color: #FFF; border: none; padding: 0.65rem 1.5rem;
        border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;
        &:hover:not(:disabled) { background: var(--primary-hover); }
        &:disabled { background: #9CA3AF; cursor: not-allowed; }
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  orders: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  activeTab: 'products' | 'orders' = 'products';
  showAddModal = false;
  saving = false;
  productForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initProductForm();
    this.loadStats();
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      categoryId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      weightGram: [500, [Validators.required, Validators.min(50)]],
      price: [299, [Validators.required, Validators.min(1)]],
      comparePrice: [349],
      stockQuantity: [40, [Validators.required, Validators.min(0)]],
      imageUrl: ['https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800', [Validators.required]],
      description: ['Grandma’s authentic homemade recipe prepared with cold-pressed oil and stone-ground spices.', [Validators.required]],
      ingredients: ['Cut raw mangoes, cold-pressed gingelly oil, mustard powder, red chilli powder, salt'],
      isFeatured: [true],
      isBestSeller: [false],
    });
  }

  loadStats(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard-stats`).subscribe(res => {
      if (res.data) this.stats = res.data;
    });
  }

  loadOrders(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/orders`).subscribe(res => {
      if (res.data) this.orders = res.data;
    });
  }

  loadProducts(): void {
    this.http.get<any>(`${environment.apiUrl}/products?limit=50`).subscribe(res => {
      if (res.data) this.products = res.data;
    });
  }

  loadCategories(): void {
    this.http.get<any>(`${environment.apiUrl}/categories`).subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.categories = res.data;
        if (!this.productForm.get('categoryId')?.value) {
          this.productForm.patchValue({ categoryId: this.categories[0].id });
        }
      }
    });
  }

  getProductImage(prod: any): string {
    if (prod.images && prod.images.length > 0) {
      return prod.images[0].imageUrl;
    }
    return 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200';
  }

  onAddProduct(): void {
    if (this.productForm.invalid) return;
    this.saving = true;

    const val = this.productForm.value;
    const payload = {
      categoryId: val.categoryId,
      name: val.name,
      weightGram: Number(val.weightGram),
      price: Number(val.price),
      comparePrice: val.comparePrice ? Number(val.comparePrice) : undefined,
      stockQuantity: Number(val.stockQuantity),
      description: val.description,
      ingredients: val.ingredients || undefined,
      isFeatured: val.isFeatured || false,
      isBestSeller: val.isBestSeller || false,
      images: [
        {
          imageUrl: val.imageUrl,
          isPrimary: true,
        },
      ],
    };

    this.http.post<any>(`${environment.apiUrl}/products`, payload).subscribe({
      next: () => {
        this.saving = false;
        this.showAddModal = false;
        this.snackBar.open(`"${val.name}" added to pickle catalog! 🫙`, 'OK', { duration: 3000 });
        this.initProductForm();
        this.loadProducts();
        this.loadStats();
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err.error?.message || 'Error creating product', 'Close', { duration: 4000 });
      },
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to remove this product from the store?')) {
      this.http.delete<any>(`${environment.apiUrl}/products/${id}`).subscribe({
        next: () => {
          this.snackBar.open('Product removed successfully', 'OK', { duration: 2000 });
          this.loadProducts();
          this.loadStats();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error removing product', 'Close', { duration: 3000 });
        },
      });
    }
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.http
      .put<any>(`${environment.apiUrl}/admin/orders/${orderId}/status`, { status })
      .subscribe({
        next: () => {
          this.snackBar.open('Order status updated!', 'OK', { duration: 2000 });
          this.loadOrders();
          this.loadStats();
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error updating order status', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
