import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';

export interface RazorpayOrderResponse {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createRazorpayOrder(payload: any): Observable<ApiResponse<RazorpayOrderResponse>> {
    return this.http.post<ApiResponse<RazorpayOrderResponse>>(
      `${this.apiUrl}/create-razorpay-order`,
      payload
    );
  }

  verifyPayment(payload: VerifyPaymentPayload): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/verify-payment`, payload);
  }

  trackOrder(orderNumber: string, phone: string): Observable<ApiResponse<any>> {
    const params = new HttpParams().set('orderNumber', orderNumber).set('phone', phone);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/track`, { params });
  }
}
