export interface OrderEntity {
  id: string;
  shop: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
  items: Item[];
  shipping: Shipping;
  customerInfo: CustomerInfo;
}

export interface Item {
  product: string;
  price: number;
  quantity: number;
}

export interface Shipping {
  carrier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}
