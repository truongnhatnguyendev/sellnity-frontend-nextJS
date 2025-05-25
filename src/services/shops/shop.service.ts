import { RestBaseService } from "../rest-base.service";
import { ShopEntity } from "@/types/shop";

export class ShopService extends RestBaseService<ShopEntity> {
  constructor() {
    super("http://localhost:3001", "shops");
  }
}

export const shopService = new ShopService();
