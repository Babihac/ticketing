import { Publisher, Subjects, TicketUpdatedEvent } from "@mvticketsxxx/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
