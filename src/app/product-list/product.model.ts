export interface Product {
  id: number;
  sku: string; // SKU (Stock Keeping Unit)
  name: string; // Name of the product
  description: string; // Description of the product
  unitPrice: number; // Price per unit
  imageUrl: string; // URL of the product image
  active: boolean; // Whether the product is active or not
  unitsInStock: number; // Number of units available in stock
  dateCreated: Date; // Date when the product was created
  lastUpdated: Date; // Date when the product was updated
}

export interface GetProductsResponse {
  _embedded: {
    products: Product[];
  };
}
