import { Publisher, Subjects, TicketCreatedEvent } from "@mvticketsxxx/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
