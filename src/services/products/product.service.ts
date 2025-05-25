// import { ProductsEntity } from "@/types";
let cacheData: ProductsEntity[] | undefined = undefined;

async function getMany(): Promise<ProductsEntity[] | undefined> {
  if (cacheData === undefined) {
    const res = await fetch("/mock-data/data.json"); // hoạt động trên client
    cacheData = await res.json();
  }
  return cacheData;
}
export const proservice = {
  getMany,
};

import { ProductsEntity } from "@/types/product";
import { RestBaseService } from "../rest-base.service";

export class ProductService extends RestBaseService<ProductsEntity> {
  constructor() {
    super("http://localhost:3001", "products");
  }
}

export const productService = new ProductService();
