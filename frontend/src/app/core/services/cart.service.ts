import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product } from '../models/product.model';

const CART_KEY = 'pickle_jar_cart_v1';
const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private couponDiscountSubject = new BehaviorSubject<{ code?: string; amount: number }>({
    amount: 0,
  });
  public couponDiscount$: Observable<{ code?: string; amount: number }> =
    this.couponDiscountSubject.asObservable();

  constructor() {}

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      this.itemsSubject.next(items);
    } catch (e) {
      console.error('Error saving cart to LocalStorage:', e);
    }
  }

  public getItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  public addToCart(product: Product, quantity = 1): void {
    const currentItems = [...this.getItems()];
    const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const newQty = currentItems[existingIndex].quantity + quantity;
      currentItems[existingIndex].quantity = Math.min(newQty, product.stockQuantity);
    } else {
      currentItems.push({ product, quantity: Math.min(quantity, product.stockQuantity) });
    }

    this.saveToStorage(currentItems);
  }

  public updateQuantity(productId: string, quantity: number): void {
    let currentItems = [...this.getItems()];
    const index = currentItems.findIndex((item) => item.product.id === productId);

    if (index > -1) {
      if (quantity <= 0) {
        currentItems.splice(index, 1);
      } else {
        currentItems[index].quantity = Math.min(
          quantity,
          currentItems[index].product.stockQuantity
        );
      }
      this.saveToStorage(currentItems);
    }
  }

  public removeFromCart(productId: string): void {
    const filtered = this.getItems().filter((item) => item.product.id !== productId);
    this.saveToStorage(filtered);
  }

  public clearCart(): void {
    this.saveToStorage([]);
    this.couponDiscountSubject.next({ amount: 0 });
  }

  public applyDiscount(code: string, amount: number): void {
    this.couponDiscountSubject.next({ code, amount });
  }

  public getSummary(): CartSummary {
    const items = this.getItems();
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const discount = this.couponDiscountSubject.getValue();
    const discountAmount = Math.min(discount.amount, subtotal);

    const afterDiscountSubtotal = subtotal - discountAmount;
    const shippingFee =
      afterDiscountSubtotal > 0 && afterDiscountSubtotal < FREE_SHIPPING_THRESHOLD
        ? STANDARD_SHIPPING_FEE
        : 0;

    const totalAmount = afterDiscountSubtotal + shippingFee;

    return {
      items,
      subtotal,
      discountAmount,
      couponCode: discount.code,
      shippingFee,
      totalAmount,
      itemCount,
    };
  }
}
