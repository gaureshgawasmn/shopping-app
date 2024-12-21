import { CurrencyPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  id = input.required<string>();
  product: Product | undefined;
  productService = inject(ProductService);
  ngOnInit() {
    this.productService.getProduct(+this.id()).subscribe((data) => {
      this.product = data;
    });
  }
}
