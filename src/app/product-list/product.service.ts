import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GetProductCategoryResponse,
  ProductCategory,
} from '../side-nav/product-category.model';
import { GetProductsResponse, Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly BASE_URL = 'http://localhost:8081/api';

  constructor(private readonly httpClient: HttpClient) {}

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.BASE_URL}/products/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(
    categoryId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<GetProductsResponse> {
    const searchUrl = `${this.BASE_URL}/products/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetProductsResponse>(searchUrl);
  }

  getProduct(id: number): Observable<Product> {
    const searchUrl = `${this.BASE_URL}/products/${id}`;
    return this.httpClient.get<Product>(searchUrl);
  }

  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetProductCategoryResponse>(`${this.BASE_URL}/product-category`)
      .pipe(map((response) => response._embedded.productCategories));
  }

  searchProduct(name: string): Observable<Product[]> {
    const searchUrl = `${this.BASE_URL}/products/search/findByNameContaining?name=${name}`;
    return this.getProducts(searchUrl);
  }

  searchAllProductPaginate(
    pageNumber: number,
    pageSize: number
  ): Observable<GetProductsResponse> {
    const searchUrl = `${this.BASE_URL}/products?page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetProductsResponse>(searchUrl);
  }

  searchProductPaginate(
    name: string,
    pageNumber: number,
    pageSize: number
  ): Observable<GetProductsResponse> {
    const searchUrl = `${this.BASE_URL}/products/search/findByNameContaining?name=${name}&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<GetProductsResponse>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetProductsResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
}
