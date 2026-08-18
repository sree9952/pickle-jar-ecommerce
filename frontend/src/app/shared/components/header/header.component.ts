import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatBadgeModule],
  template: `
    <header class="header-glass">
      <div class="container header-content">
        <!-- Logo Brand -->
        <a routerLink="/" class="brand-logo">
          <span class="logo-icon">🫙</span>
          <div class="logo-text">
            <span class="title">Grandma's Pickles</span>
            <span class="subtitle">Homemade & Pure</span>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" routerLinkActive="active">All Pickles & Jars</a>
          <a routerLink="/products" [queryParams]="{category: 'veg-pickles'}">Veg Pickles</a>
          <a routerLink="/products" [queryParams]="{category: 'non-veg-pickles'}">Non-Veg Pickles</a>
          <a routerLink="/products" [queryParams]="{category: 'gift-packs'}">Gift Packs</a>
        </nav>

        <!-- Right Action Icons -->
        <div class="header-actions">
          <button (click)="toggleTheme()" class="icon-btn" [attr.aria-label]="'Toggle Theme'">
            <span class="material-icons-outlined">
              {{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>

          <a routerLink="/cart" class="cart-btn" [matBadge]="cartCount" [matBadgeHidden]="cartCount === 0" matBadgeColor="warn">
            <span class="material-icons-outlined">shopping_bag</span>
            <span class="cart-label">Cart</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-glass {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--card-border);
      padding: 0.75rem 0;
      transition: background 0.3s ease;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .logo-icon {
      font-size: 2.2rem;
    }
    .logo-text {
      display: flex;
      flex-direction: column;
      .title {
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 1.25rem;
        color: var(--primary);
        line-height: 1.1;
      }
      .subtitle {
        font-size: 0.75rem;
        color: var(--text-muted);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      a {
        font-weight: 500;
        color: var(--text-main);
        font-size: 0.95rem;
        transition: color 0.2s ease;
        &.active, &:hover {
          color: var(--primary);
        }
      }

      @media (max-width: 768px) {
        display: none;
      }
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
      &:hover {
        background: rgba(217, 119, 6, 0.1);
        color: var(--primary);
      }
    }
    .cart-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--primary);
      color: #FFF;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: background 0.2s ease, transform 0.2s ease;
      &:hover {
        background: var(--primary-hover);
        transform: scale(1.03);
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(private cartService: CartService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(() => {
      this.cartCount = this.cartService.getSummary().itemCount;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
