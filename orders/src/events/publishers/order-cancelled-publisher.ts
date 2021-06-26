import { Publisher, OrderCancelledEvent, Subjects } from "@mvticketsxxx/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
