import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@mvticketsxxx/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
import { requireAuth } from "@mvticketsxxx/common";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();
    res.status(204).send({ order });

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
);

export { router as deleterOrdeRouter };
