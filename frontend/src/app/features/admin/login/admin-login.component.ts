import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="admin-login-page">
      <div class="login-card glass-card">
        <div class="header">
          <span class="icon">🫙</span>
          <h1>Admin Portal Login</h1>
          <p>Sign in to manage products, categories, orders & inventory</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label>Admin Email</label>
            <input type="email" formControlName="email" placeholder="admin&#64;picklejar.com" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••••••••" />
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || submitting">
            {{ submitting ? 'Authenticating...' : 'Sign In to Dashboard' }}
          </button>
        </form>

        <div class="seed-hint">
          <p>💡 Demo Admin Credentials:</p>
          <code>Email: admin&#64;picklejar.com</code><br/>
          <code>Password: AdminPassword123!</code>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
      text-align: center;
    }
    .header {
      margin-bottom: 2rem;
      .icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
      h1 { font-size: 1.75rem; margin-bottom: 0.25rem; color: var(--primary); }
      p { font-size: 0.85rem; color: var(--text-muted); }
    }
    .login-form {
      text-align: left;
      .form-group {
        margin-bottom: 1.25rem;
        display: flex; flex-direction: column; gap: 0.35rem;
        label { font-size: 0.85rem; font-weight: 600; }
        input {
          padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--card-border);
          background: var(--bg-color); color: var(--text-main); font-size: 0.95rem; outline: none;
          &:focus { border-color: var(--primary); }
        }
      }
    }
    .btn-login {
      width: 100%; background: var(--primary); color: #FFF; border: none; padding: 0.85rem;
      border-radius: var(--radius-md); font-weight: 700; font-size: 1rem; cursor: pointer;
      margin-top: 1rem; transition: background 0.2s ease;
      &:hover:not(:disabled) { background: var(--primary-hover); }
      &:disabled { background: #9CA3AF; cursor: not-allowed; }
    }
    .seed-hint {
      margin-top: 2rem; padding: 1rem; background: var(--bg-color); border-radius: var(--radius-sm);
      border: 1px dashed var(--card-border); font-size: 0.8rem; color: var(--text-muted); text-align: left;
      code { color: var(--primary); font-weight: 600; }
    }
  `]
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigate(['/admin/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['admin@picklejar.com', [Validators.required, Validators.email]],
      password: ['AdminPassword123!', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.submitting = true;

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('Logged in successfully!', 'OK', { duration: 2000 });
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.submitting = false;
        this.snackBar.open(err.error?.message || 'Invalid admin credentials', 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
