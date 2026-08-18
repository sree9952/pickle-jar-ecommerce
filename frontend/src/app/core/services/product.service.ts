import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { Product } from '../models/product.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    sortBy?: string;
  }): Observable<ApiResponse<Product[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl, { params: httpParams });
  }

  getProductBySlug(slug: string): Observable<ApiResponse<{ product: Product; related: Product[] }>> {
    return this.http.get<ApiResponse<{ product: Product; related: Product[] }>>(
      `${this.apiUrl}/slug/${slug}`
    );
  }
}
