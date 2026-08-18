import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, MatSnackBarModule],
  template: `
    <!-- Hero Banner Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-text">
          <span class="badge badge-amber hero-badge">🫙 100% Sun-Dried & Hand-Pounded Spices</span>
          <h1>Taste Grandma's Secret Homemade Pickle Recipes</h1>
          <p>
            Made in small handcrafted batches with pure cold-pressed gingelly oil, organic raw mangoes, and stone-ground spices. No artificial preservatives.
          </p>
          <div class="hero-cta">
            <a routerLink="/products" class="btn btn-primary">
              <span class="material-icons-outlined">shopping_bag</span> Explore Pickle Catalog
            </a>
            <a routerLink="/products" [queryParams]="{category: 'gift-packs'}" class="btn btn-secondary">
              🎁 Festive Gift Boxes
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="hero-trust">
            <div class="trust-item"><span class="icon">🌿</span> 100% Natural</div>
            <div class="trust-item"><span class="icon">🌶️</span> Cold-Pressed Oil</div>
            <div class="trust-item"><span class="icon">🚚</span> Fast All-India Shipping</div>
          </div>
        </div>

        <div class="hero-image-box">
          <div class="glass-card image-card">
            <img
              src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=80"
              alt="Authentic Avakaya Mango Pickle Jar"
            />
            <div class="floating-tag">
              <span class="icon">⭐ 4.9/5</span>
              <span class="text">Over 10,000+ Happy Pickle Lovers</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section container">
      <div class="section-header">
        <h2>Shop By Category</h2>
        <p>Explore our wide range of handcrafted pickles and traditional ceramic jars</p>
      </div>

      <div class="categories-grid">
        <a
          *ngFor="let cat of categories"
          [routerLink]="['/products']"
          [queryParams]="{category: cat.slug}"
          class="category-card glass-card"
        >
          <div class="cat-img">
            <img [src]="cat.imageUrl" [alt]="cat.name" />
          </div>
          <h3>{{ cat.name }}</h3>
          <p>{{ cat.description }}</p>
        </a>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="bestsellers-section container">
      <div class="section-header">
        <span class="badge badge-terracotta">Most Loved</span>
        <h2>Best Selling Pickles</h2>
        <p>Our customer favorites shipped fresh every week</p>
      </div>

      <div class="products-grid" *ngIf="!loading; else loadingTpl">
        <app-product-card
          *ngFor="let prod of bestSellers"
          [product]="prod"
          (addToCart)="onAddToCart($event)"
        ></app-product-card>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-state">
          <p>Loading grandma's best pickles...</p>
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    .hero-section {
      padding: 4rem 0 3rem;
      background: var(--bg-gradient);
      border-bottom: 1px solid var(--card-border);
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: center;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }
    .hero-text {
      .hero-badge { margin-bottom: 1.25rem; }
      h1 {
        font-size: 3rem;
        margin-bottom: 1.25rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        @media (max-width: 600px) { font-size: 2.2rem; }
      }
      p {
        font-size: 1.1rem;
        color: var(--text-muted);
        margin-bottom: 2rem;
        line-height: 1.7;
      }
    }
    .hero-cta {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
      @media (max-width: 500px) { flex-direction: column; }
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.75rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1rem;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      &.btn-primary {
        background: var(--primary);
        color: #FFF;
        box-shadow: var(--shadow-md);
        &:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
      }
      &.btn-secondary {
        background: var(--card-bg);
        color: var(--text-main);
        border: 1px solid var(--card-border);
        &:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
      }
    }
    .hero-trust {
      display: flex;
      gap: 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-main);
      .trust-item { display: flex; align-items: center; gap: 0.4rem; }
    }
    .hero-image-box {
      position: relative;
      .image-card {
        padding: 0.75rem;
        border-radius: var(--radius-lg);
        img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }
      }
      .floating-tag {
        position: absolute;
        bottom: -1rem;
        left: 2rem;
        background: var(--card-bg);
        backdrop-filter: blur(12px);
        border: 1px solid var(--card-border);
        padding: 0.75rem 1.25rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.85rem;
        font-weight: 600;
      }
    }
    .section-header {
      text-align: center;
      margin: 4rem 0 2.5rem;
      h2 { font-size: 2.25rem; margin-top: 0.5rem; }
      p { color: var(--text-muted); font-size: 1.05rem; }
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .category-card {
      padding: 1.5rem;
      text-decoration: none;
      text-align: center;
      .cat-img {
        height: 160px;
        border-radius: var(--radius-md);
        overflow: hidden;
        margin-bottom: 1rem;
        img { width: 100%; height: 100%; object-fit: cover; }
      }
      h3 { color: var(--primary); margin-bottom: 0.5rem; font-size: 1.2rem; }
      p { font-size: 0.85rem; color: var(--text-muted); }
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.75rem;
    }
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  bestSellers: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => {
      if (res.data) this.categories = res.data;
    });

    this.productService.getProducts({ isBestSeller: true, limit: 6 }).subscribe(res => {
      if (res.data) this.bestSellers = res.data;
      this.loading = false;
    });
  }

  onAddToCart(product: Product): void {
    this.snackBar.open(`Added "${product.name}" to cart! 🫙`, 'View Cart', {
      duration: 3000,
    });
  }
}
