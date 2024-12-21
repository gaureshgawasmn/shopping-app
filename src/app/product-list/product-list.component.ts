import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  categoryId = 1;
  products: Product[] = [];
  subscription: Subscription | undefined;
  constructor(
    private readonly productService: ProductService,
    private readonly activateRoute: ActivatedRoute,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    const subscription = this.activateRoute.paramMap.subscribe((params) => {
      const searchMode = params.has('keyword');
      if (searchMode) {
        this.productService
          .searchProduct(params.get('keyword') ?? '')
          .subscribe((data) => {
            this.products = data;
          });
      } else {
        this.categoryId = +(params.get('categoryId') ?? '1');
        this.productService
          .getProductList(this.categoryId)
          .subscribe((data) => {
            this.products = data;
          });
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
