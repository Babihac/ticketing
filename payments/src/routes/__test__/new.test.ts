import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@mvticketsxxx/common";
import { stripe } from "../../stripe";

// it("return 404 if the order does no exist", async () => {
//   await request(app)
//     .post("/api/payment")
//     .set("Cookie", global.signin())
//     .send({
//       token: "sss",
//       orderId: mongoose.Types.ObjectId().toHexString(),
//     })
//     .expect(404);
// });

// it("return 401 when purchasing an order that doesnt belong to the user", async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();

//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId: userId,
//     version: 0,
//     price: 20,
//     status: OrderStatus.Canceled,
//   });
//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin())
//     .send({
//       token: "sss",
//       orderId: order.id,
//     })
//     .expect(401);
// });

// it("return 400 when purchasing a cancelled order", async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();

//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId: userId,
//     version: 0,
//     price: 20,
//     status: OrderStatus.Canceled,
//   });
//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signin(userId))
//     .send({
//       orderId: order.id,
//       token: "hahah",
//     })
//     .expect(400);
// });

it("returns 201 when for payment with valida data", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 1000000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 20 });
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
});
