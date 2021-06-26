import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connected to NATS");
  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: "xxx",
    title: "hahaha",
    price: 222,
  });
});
