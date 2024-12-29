// Interface for the customer object
export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

// Interface for the address object (common for shipping and billing)
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Interface for the order object
export interface Order {
  totalPrice: number;
  totalQuantity: number;
}

// Interface for the order items
export interface OrderItem {
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  productId: number;
}

// Main interface for the entire purchase object
export interface Purchase {
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  order: Order;
  orderItems: OrderItem[];
}
