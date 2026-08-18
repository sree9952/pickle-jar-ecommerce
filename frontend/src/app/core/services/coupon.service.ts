import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { Coupon } from '../models/coupon.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  validateCoupon(code: string, cartAmount: number): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(`${this.apiUrl}/validate`, {
      code,
      cartAmount,
    });
  }

  getAllCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(this.apiUrl);
  }
}
