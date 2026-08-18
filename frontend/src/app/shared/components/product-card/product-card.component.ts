import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card glass-card" *ngIf="product">
      <!-- Badge overlay -->
      <div class="card-badges">
        <span class="badge badge-amber" *ngIf="product.isBestSeller">Best Seller</span>
        <span class="badge badge-emerald" *ngIf="product.isFeatured && !product.isBestSeller">Featured</span>
        <span class="discount-badge" *ngIf="discountPercent > 0">-{{ discountPercent }}%</span>
      </div>

      <!-- Image container -->
      <a [routerLink]="['/products', product.slug]" class="img-wrapper">
        <img
          [src]="primaryImage"
          [alt]="product.name"
          loading="lazy"
        />
      </a>

      <!-- Card Body -->
      <div class="card-body">
        <span class="category-name" *ngIf="product.category">{{ product.category.name }}</span>
        <h3 class="product-title">
          <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
        </h3>

        <div class="weight-tag">
          <span class="material-icons-outlined">scale</span> {{ product.weightGram }}g Jar
        </div>

        <!-- Pricing & Add to Cart Counter -->
        <div class="card-footer">
          <div class="price-box">
            <span class="current-price">₹{{ product.price }}</span>
            <span class="compare-price" *ngIf="product.comparePrice && product.comparePrice > product.price">
              ₹{{ product.comparePrice }}
            </span>
          </div>

          <!-- Out of Stock State -->
          <div *ngIf="product.stockQuantity <= 0" class="out-of-stock-btn">
            Out of Stock
          </div>

          <!-- In Stock: Add Button or Increment/Decrement Counter -->
          <div *ngIf="product.stockQuantity > 0">
            <!-- 1. Not in Cart: Show "+ ADD" Button -->
            <button
              *ngIf="cartQuantity === 0"
              class="add-btn"
              (click)="onAdd($event)"
            >
              <span class="material-icons-outlined">add</span> ADD
            </button>

            <!-- 2. In Cart: Show Interactive Count Selector [-] [count] [+] -->
            <div *ngIf="cartQuantity > 0" class="qty-counter-group" (click)="$event.stopPropagation()">
              <button
                type="button"
                class="qty-btn"
                (click)="onDecrement($event)"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span class="qty-count">{{ cartQuantity }}</span>
              <button
                type="button"
                class="qty-btn"
                (click)="onIncrement($event)"
                [disabled]="cartQuantity >= product.stockQuantity"
                aria-label="Increase quantity"
              >
                &#43;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .discount-badge {
      background: var(--secondary);
      color: #FFF;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      width: fit-content;
    }
    .img-wrapper {
      display: block;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.03);
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
      }
      &:hover img {
        transform: scale(1.08);
      }
    }
    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .category-name {
      font-size: 0.75rem;
      color: var(--primary);
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .product-title {
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      line-height: 1.35;
      a {
        color: var(--text-main);
        &:hover { color: var(--primary); }
      }
    }
    .weight-tag {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      .material-icons-outlined { font-size: 0.95rem; }
    }
    .card-footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--card-border);
    }
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .current-price {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
    }
    .compare-price {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    /* Out of Stock */
    .out-of-stock-btn {
      background: rgba(156, 163, 175, 0.2);
      color: #9CA3AF;
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* Add Button */
    .add-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--primary);
      color: #FFF;
      border: none;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.25);
      transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      &:hover {
        background: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(217, 119, 6, 0.35);
      }
      .material-icons-outlined { font-size: 1.1rem; }
    }

    /* Interactive Quantity Counter Group [-] [Count] [+] */
    .qty-counter-group {
      display: inline-flex;
      align-items: center;
      background: var(--primary);
      border-radius: var(--radius-sm);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
      transition: transform 0.2s ease;

      .qty-btn {
        width: 32px;
        height: 32px;
        background: transparent;
        color: #FFF;
        border: none;
        font-size: 1.2rem;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;

        &:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.15);
        }
        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }

      .qty-count {
        min-width: 26px;
        text-align: center;
        font-weight: 800;
        font-size: 0.95rem;
        color: #FFF;
        padding: 0 0.2rem;
        user-select: none;
      }
    }
  `]
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  cartQuantity = 0;
  private cartSub?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.items$.subscribe(items => {
      if (this.product) {
        const item = items.find(i => i.product.id === this.product.id);
        this.cartQuantity = item ? item.quantity : 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  get primaryImage(): string {
    if (this.product?.images?.length) {
      const primary = this.product.images.find(img => img.isPrimary);
      return primary ? primary.imageUrl : this.product.images[0].imageUrl;
    }
    return 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600';
  }

  get discountPercent(): number {
    if (this.product?.comparePrice && this.product.comparePrice > this.product.price) {
      const diff = this.product.comparePrice - this.product.price;
      return Math.round((diff / this.product.comparePrice) * 100);
    }
    return 0;
  }

  onAdd(event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
    this.addToCart.emit(this.product);
  }

  onIncrement(event: Event): void {
    event.stopPropagation();
    if (this.cartQuantity < this.product.stockQuantity) {
      this.cartService.updateQuantity(this.product.id, this.cartQuantity + 1);
    }
  }

  onDecrement(event: Event): void {
    event.stopPropagation();
    this.cartService.updateQuantity(this.product.id, this.cartQuantity - 1);
  }
}
