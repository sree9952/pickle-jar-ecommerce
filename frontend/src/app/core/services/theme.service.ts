import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadInitialTheme());
  public isDarkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.getValue());
  }

  private loadInitialTheme(): boolean {
    const saved = localStorage.getItem('pickle_theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public toggleTheme(): void {
    const current = !this.darkModeSubject.getValue();
    this.darkModeSubject.next(current);
    localStorage.setItem('pickle_theme', current ? 'dark' : 'light');
    this.applyTheme(current);
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.setAttribute('data-theme', 'dark');
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
    } else {
      body.removeAttribute('data-theme');
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
    }
  }
}
