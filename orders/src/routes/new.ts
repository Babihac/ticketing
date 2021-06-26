import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  currentUser,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@mvticketsxxx/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/orders";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  currentUser,
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket the user want to order in the database
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure that this ticket is not already reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved haha");
    }

    // Calculate an expiration date of order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the oreder and save this to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();
    // Publish an event saying that order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
