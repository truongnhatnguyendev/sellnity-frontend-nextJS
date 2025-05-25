import { ProductsEntity } from "../product";

export interface ShopEntity {
  id: number;
  name: string;
  logo?: string;
  platform: string;
  orders: number;
  products: Products;
  status: string;
}
export interface Products {
  synced: number;
  total: number;
}
