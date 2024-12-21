export interface ProductCategory {
  id: number;
  categoryName: string;
}

export interface GetProductCategoryResponse {
  _embedded: {
    productCategories: ProductCategory[];
  };
}
