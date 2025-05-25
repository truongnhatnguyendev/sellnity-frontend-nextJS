import { OrderEntity } from "@/types/order";
import { RestBaseService } from "../rest-base.service";

export class OrderService extends RestBaseService<OrderEntity> {
  constructor() {
    super("http://localhost:3001", "orders");
  }
}

export const orderService = new OrderService();
