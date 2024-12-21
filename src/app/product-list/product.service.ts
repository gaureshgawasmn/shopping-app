import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetProductsResponse, Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly BASE_URL = 'http://localhost:8081/api/products?size=100';

  constructor(private readonly httpClient: HttpClient) {}

  getProductList(): Observable<Product[]> {
    return this.httpClient
      .get<GetProductsResponse>(this.BASE_URL)
      .pipe(map((response) => response._embedded.products));
  }
}
