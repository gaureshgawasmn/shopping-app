import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { GetProductsResponse, Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, NgbPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  categoryId = 1;
  products: Product[] = [];
  searchMode = false;
  allProducts = true;
  subscription: Subscription | undefined;
  pageNumber = 1;
  pageSize = 5;
  totalElements = 0;
  constructor(
    private readonly productService: ProductService,
    private readonly activateRoute: ActivatedRoute,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    const subscription = this.activateRoute.paramMap.subscribe((params) => {
      this.searchMode = params.has('keyword');
      this.allProducts = !this.searchMode && !params.has('categoryId');
      this.listProducts();
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  listProducts() {
    let productObs: Observable<GetProductsResponse>;
    let params = this.activateRoute.snapshot.paramMap;
    if (this.allProducts) {
      productObs = this.productService.searchAllProductPaginate(
        this.pageNumber - 1,
        this.pageSize
      );
    } else if (this.searchMode) {
      productObs = this.productService.searchProductPaginate(
        params.get('keyword') ?? '',
        this.pageNumber - 1,
        this.pageSize
      );
    } else {
      this.categoryId = +(params.get('categoryId') ?? '1');
      productObs = this.productService.getProductListPaginate(
        this.categoryId,
        this.pageNumber - 1,
        this.pageSize
      );
    }
    productObs.subscribe((data) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    });
  }

  selectPageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
}
