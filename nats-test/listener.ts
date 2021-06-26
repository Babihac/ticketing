import nats, { Message } from "node-nats-streaming";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

interface Event {
  subject: Subjects;
  data: any;
}

const stan = nats.connect("ticketing", "test", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  const ticketCreatedListener = new TicketCreatedListener(stan);
  ticketCreatedListener.listen();
});

stan.on("close", () => {
  console.log("exiting NATS connection");
  process.exit();
});

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: nats.Stan;
  protected ackWait = 5 * 1000;

  constructor(client: nats.Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    nats.Subscription;
    subscription.on("message", (msg: nats.Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("event data", data);
    msg.ack();
  }
}
