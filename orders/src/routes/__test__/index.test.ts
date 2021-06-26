import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  return ticket;
};

it("fetches orders of a particular user", async () => {
  //Create some tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);
  // Create two orders as user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      ticketId: ticketThree.id,
    })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
});
