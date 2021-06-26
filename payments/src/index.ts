import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";
const main = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("fff");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS client id not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("XXX");
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error("stripe key not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS cluster id not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS url  not defined");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => {
      natsWrapper.client.close();
    });

    process.on("SIGTERM", () => {
      natsWrapper.client.close();
    });

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Connected to TICKETS DB");
    console.log("STRIPE_KEY", process.env.STRIPE_KEY);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("listeninng on port 3000 HA");
  });
};

main();
