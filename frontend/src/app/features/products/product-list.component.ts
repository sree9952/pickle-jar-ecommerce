import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, MatSnackBarModule],
  template: `
    <div class="container catalog-page">
      <!-- Header Title -->
      <div class="catalog-header">
        <h1>Handcrafted Pickles & Jars</h1>
        <p>Explore our entire range of traditional pickles, ceramics, and festive sets</p>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="toolbar glass-card">
        <div class="search-box">
          <span class="material-icons-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search pickles by name, ingredient..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="applyFilters()"
          />
        </div>

        <div class="filter-controls">
          <!-- Category Chips -->
          <div class="chip-group">
            <button
              class="chip"
              [class.active]="!selectedCategory"
              (click)="selectCategory('')"
            >
              All Pickles
            </button>
            <button
              *ngFor="let cat of categories"
              class="chip"
              [class.active]="selectedCategory === cat.slug"
              (click)="selectCategory(cat.slug)"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- Sort Dropdown -->
          <select [(ngModel)]="sortBy" (change)="applyFilters()" class="sort-select">
            <option value="newest">Sort by: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid" *ngIf="!loading && products.length > 0">
        <app-product-card
          *ngFor="let prod of products"
          [product]="prod"
          (addToCart)="onAddToCart($event)"
        ></app-product-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state glass-card" *ngIf="!loading && products.length === 0">
        <span class="material-icons-outlined empty-icon">search_off</span>
        <h3>No Pickles Found</h3>
        <p>Try searching for a different name or clear category filters.</p>
        <button class="btn btn-primary" (click)="resetFilters()">Clear Filters</button>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .catalog-page {
      padding: 3rem 0;
    }
    .catalog-header {
      text-align: center;
      margin-bottom: 2.5rem;
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--primary); }
      p { color: var(--text-muted); font-size: 1.05rem; }
    }
    .toolbar {
      padding: 1.25rem 1.75rem;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .search-box {
      position: relative;
      width: 100%;
      .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
      }
      input {
        width: 100%;
        padding: 0.85rem 1rem 0.85rem 2.8rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--card-border);
        background: var(--bg-color);
        color: var(--text-main);
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s ease;
        &:focus { border-color: var(--primary); }
      }
    }
    .filter-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .chip-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .chip {
      background: var(--bg-color);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 0.45rem 1rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      &.active, &:hover {
        background: var(--primary);
        color: #FFF;
        border-color: var(--primary);
      }
    }
    .sort-select {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--card-border);
      background: var(--bg-color);
      color: var(--text-main);
      font-size: 0.9rem;
      outline: none;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.75rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      .empty-icon { font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem; }
      h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
      p { color: var(--text-muted); margin-bottom: 1.5rem; }
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      margin-top: 3rem;
      button {
        padding: 0.6rem 1.25rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--card-border);
        background: var(--card-bg);
        color: var(--text-main);
        font-weight: 600;
        cursor: pointer;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  searchQuery = '';
  selectedCategory = '';
  sortBy = 'newest';
  currentPage = 1;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => {
      if (res.data) this.categories = res.data;
    });

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory = params['category'];
      if (params['search']) this.searchQuery = params['search'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProducts({
        page: this.currentPage,
        limit: 12,
        search: this.searchQuery,
        category: this.selectedCategory,
        sortBy: this.sortBy,
      })
      .subscribe(res => {
        if (res.data) {
          this.products = res.data;
          this.totalPages = res.meta?.totalPages || 1;
        }
        this.loading = false;
      });
  }

  selectCategory(categorySlug: string): void {
    this.selectedCategory = categorySlug;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory || null,
        search: this.searchQuery || null,
      },
      queryParamsHandling: 'merge',
    });
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.sortBy = 'newest';
    this.applyFilters();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.snackBar.open(`Added "${product.name}" to cart! 🫙`, 'View Cart', {
      duration: 3000,
    });
  }
}
