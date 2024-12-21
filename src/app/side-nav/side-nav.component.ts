import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../product-list/product.service';
import { ProductCategory } from './product-category.model';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  productCategories: ProductCategory[] = [];
  private readonly productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.getProductCategoryList().subscribe((data) => {
      this.productCategories = data;
    });
  }
}
