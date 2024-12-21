import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetProductsResponse, Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly BASE_URL = 'http://localhost:8081/api/products';

  constructor(private readonly httpClient: HttpClient) {}

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.BASE_URL}/search/findByCategoryId?id=${categoryId}`;
    return this.httpClient
      .get<GetProductsResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
}
