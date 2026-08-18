import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-container">
      <div class="container footer-content">
        <div class="footer-col brand-info">
          <div class="brand">
            <span class="icon">🫙</span>
            <h3>Grandma's Pickles & Jars</h3>
          </div>
          <p>
            Bringing authentic, sun-ripened, traditional homemade pickles and artisanal ceramic jars directly to your dining table. Made with 100% pure cold-pressed oils.
          </p>
          <div class="badges">
            <span class="badge badge-amber">100% Homemade</span>
            <span class="badge badge-emerald">Zero Preservatives</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/products">All Products</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 'veg-pickles'}">Veg Pickles</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 'non-veg-pickles'}">Non-Veg Pickles</a></li>
            <li><a routerLink="/products" [queryParams]="{category: 'gift-packs'}">Gift Boxes</a></li>
            <li><a routerLink="/order-tracking">Track Order</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Customer Care & Policies</h4>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact Us</a></li>
            <li><a routerLink="/privacy">Privacy Policy</a></li>
            <li><a routerLink="/terms">Terms & Conditions</a></li>
            <li><a routerLink="/refund">Refund Policy</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Need Assistance?</h4>
          <p class="contact-item"><span class="material-icons-outlined">phone</span> +91 98765 43210</p>
          <p class="contact-item"><span class="material-icons-outlined">email</span> support&#64;picklejar.com</p>
          <p class="contact-item"><span class="material-icons-outlined">place</span> Hyderabad, Telangana, India</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>&copy; 2026 Grandma's Pickles & Jars. All Rights Reserved.</p>
          <p class="secure-text"><span class="material-icons-outlined">lock</span> 256-Bit SSL Encrypted & Razorpay Verified</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background: var(--card-bg);
      border-top: 1px solid var(--card-border);
      padding-top: 3.5rem;
      margin-top: 4rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 2.5rem;
      padding-bottom: 3rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    .footer-col {
      h4 {
        font-family: 'Outfit', sans-serif;
        font-size: 1.1rem;
        margin-bottom: 1.25rem;
        color: var(--primary);
      }
      ul {
        list-style: none;
        li {
          margin-bottom: 0.6rem;
          a {
            color: var(--text-muted);
            font-size: 0.9rem;
            &:hover {
              color: var(--primary);
            }
          }
        }
      }
      p {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }
    .brand-info {
      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        .icon { font-size: 1.8rem; }
        h3 { font-size: 1.3rem; color: var(--primary); }
      }
      .badges {
        display: flex;
        gap: 0.5rem;
        margin-top: 1.25rem;
      }
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: var(--text-muted);
      .material-icons-outlined {
        font-size: 1.1rem;
        color: var(--primary);
      }
    }
    .footer-bottom {
      background: rgba(0, 0, 0, 0.05);
      border-top: 1px solid var(--card-border);
      padding: 1.25rem 0;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
    .secure-text {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      .material-icons-outlined { font-size: 1rem; color: var(--accent); }
    }
  `]
})
export class FooterComponent {}
