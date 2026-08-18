import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, MatSnackBarModule],
  template: `
    <div class="container detail-page" *ngIf="product">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <a routerLink="/">Home</a> &rsaquo;
        <a routerLink="/products">Products</a> &rsaquo;
        <span>{{ product.name }}</span>
      </nav>

      <div class="product-wrapper glass-card">
        <!-- Gallery Section -->
        <div class="gallery">
          <div class="main-image">
            <img [src]="selectedImage || primaryImage" [alt]="product.name" />
          </div>
          <div class="thumbnails" *ngIf="product.images && product.images.length > 1">
            <div
              *ngFor="let img of product.images"
              class="thumb"
              [class.active]="(selectedImage || primaryImage) === img.imageUrl"
              (click)="selectedImage = img.imageUrl"
            >
              <img [src]="img.imageUrl" [alt]="product.name" />
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="product-info">
          <span class="category-badge badge badge-amber" *ngIf="product.category">
            {{ product.category.name }}
          </span>

          <h1 class="title">{{ product.name }}</h1>

          <div class="meta-row">
            <span class="weight-badge"><span class="material-icons-outlined">scale</span> {{ product.weightGram }}g Pack</span>
            <span class="stock-status" [class.in-stock]="product.stockQuantity > 0" [class.out-of-stock]="product.stockQuantity <= 0">
              ● {{ product.stockQuantity > 0 ? 'In Stock (' + product.stockQuantity + ' available)' : 'Out of Stock' }}
            </span>
          </div>

          <!-- Price Box -->
          <div class="price-box">
            <span class="price">₹{{ product.price }}</span>
            <span class="compare-price" *ngIf="product.comparePrice && product.comparePrice > product.price">
              ₹{{ product.comparePrice }}
            </span>
            <span class="discount-badge" *ngIf="discountPercent > 0">Save {{ discountPercent }}%</span>
          </div>

          <!-- Description -->
          <p class="description">{{ product.description }}</p>

          <!-- Ingredients -->
          <div class="ingredients-box" *ngIf="product.ingredients">
            <h4>🌿 Pure Ingredients</h4>
            <p>{{ product.ingredients }}</p>
          </div>

          <!-- Actions -->
          <div class="action-row">
            <div class="quantity-picker">
              <button (click)="decreaseQty()">-</button>
              <span>{{ quantity }}</span>
              <button (click)="increaseQty()">+</button>
            </div>

            <button class="add-to-cart-btn" (click)="addToCart()" [disabled]="product.stockQuantity <= 0">
              <span class="material-icons-outlined">shopping_cart</span> Add to Cart
            </button>
          </div>

          <div class="guarantee-box">
            <div class="guarantee-item">
              <span class="material-icons-outlined">verified</span>
              <span>100% Traditional Recipe</span>
            </div>
            <div class="guarantee-item">
              <span class="material-icons-outlined">local_shipping</span>
              <span>Free Shipping Over ₹499</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="related-section" *ngIf="relatedProducts.length > 0">
        <h2>You Might Also Love</h2>
        <div class="products-grid">
          <app-product-card
            *ngFor="let prod of relatedProducts"
            [product]="prod"
            (addToCart)="onAddToCartRelated($event)"
          ></app-product-card>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .detail-page { padding: 3rem 0; }
    .breadcrumbs {
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-muted);
      a { color: var(--text-muted); &:hover { color: var(--primary); } }
      span { color: var(--primary); font-weight: 600; }
    }
    .product-wrapper {
      padding: 2.5rem;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 3rem;
      @media (max-width: 850px) { grid-template-columns: 1fr; }
    }
    .main-image {
      height: 420px;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: rgba(0,0,0,0.03);
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .thumbnails {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      .thumb {
        width: 70px;
        height: 70px;
        border-radius: var(--radius-sm);
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        img { width: 100%; height: 100%; object-fit: cover; }
        &.active { border-color: var(--primary); }
      }
    }
    .product-info {
      display: flex;
      flex-direction: column;
      .category-badge { width: fit-content; margin-bottom: 0.75rem; }
      .title { font-size: 2.25rem; margin-bottom: 1rem; }
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      .weight-badge { display: flex; align-items: center; gap: 0.25rem; color: var(--text-muted); }
      .stock-status {
        font-weight: 600;
        &.in-stock { color: var(--accent); }
        &.out-of-stock { color: var(--secondary); }
      }
    }
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 1.5rem;
      .price { font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--primary); }
      .compare-price { font-size: 1.1rem; color: var(--text-muted); text-decoration: line-through; }
      .discount-badge { background: var(--secondary); color: #FFF; font-size: 0.8rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 9999px; }
    }
    .description { color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; }
    .ingredients-box {
      background: var(--bg-color);
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      border-left: 4px solid var(--primary);
      margin-bottom: 1.5rem;
      h4 { font-size: 0.95rem; margin-bottom: 0.35rem; color: var(--primary); }
      p { font-size: 0.85rem; color: var(--text-muted); }
    }
    .action-row {
      display: flex;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .quantity-picker {
      display: flex;
      align-items: center;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      button {
        width: 40px;
        height: 44px;
        border: none;
        background: transparent;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-main);
      }
      span { width: 40px; text-align: center; font-weight: 700; }
    }
    .add-to-cart-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: var(--primary);
      color: #FFF;
      border: none;
      border-radius: var(--radius-sm);
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;
      &:hover:not(:disabled) { background: var(--primary-hover); }
      &:disabled { background: #9CA3AF; cursor: not-allowed; }
    }
    .guarantee-box {
      display: flex;
      gap: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--card-border);
      .guarantee-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: var(--text-muted);
        .material-icons-outlined { color: var(--accent); font-size: 1.1rem; }
      }
    }
    .related-section {
      margin-top: 4rem;
      h2 { font-size: 1.75rem; margin-bottom: 1.5rem; }
      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1.5rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  selectedImage = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.productService.getProductBySlug(slug).subscribe(res => {
          if (res.data) {
            this.product = res.data.product;
            this.relatedProducts = res.data.related;
            this.selectedImage = this.primaryImage;
          }
        });
      }
    });
  }

  get primaryImage(): string {
    if (this.product?.images?.length) {
      const primary = this.product.images.find(img => img.isPrimary);
      return primary ? primary.imageUrl : this.product.images[0].imageUrl;
    }
    return '';
  }

  get discountPercent(): number {
    if (this.product?.comparePrice && this.product.comparePrice > this.product.price) {
      const diff = this.product.comparePrice - this.product.price;
      return Math.round((diff / this.product.comparePrice) * 100);
    }
    return 0;
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.snackBar.open(`Added ${this.quantity}x "${this.product.name}" to cart! 🫙`, 'View Cart', {
        duration: 3000,
      });
    }
  }

  onAddToCartRelated(prod: Product): void {
    this.cartService.addToCart(prod, 1);
    this.snackBar.open(`Added "${prod.name}" to cart! 🫙`, 'View Cart', {
      duration: 3000,
    });
  }
}
