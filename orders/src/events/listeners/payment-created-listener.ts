import {
  Subjects,
  Listener,
  PaymentCreated,
  OrderStatus,
} from "@mvticketsxxx/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreated> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreated["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      return console.log("order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();
    msg.ack();
  }
}
