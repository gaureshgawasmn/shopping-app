import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../shared/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly BASE_URL = 'http://localhost:8081/api';

  constructor(private readonly httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}/checkout/purchase`, purchase);
  }
}
